// Deals the pipeline should already have.
//
// A club books a call or writes back, and the deal only appears once someone
// remembers to make it — Notts County had two calls in the diary and a website
// enquiry before anyone had. The capture loop used to *offer* every such deal
// in Slack, because creating from the calendar alone would make deals out of PR
// firms and investors. The League field settles that: a company with a league
// is a club, and a club that is talking to us is pipeline. Clubs are now
// created directly; everyone else still gets the offer.
//
//   call booked or held  → Demo / discovery
//   email from the club  → Prospecting

import { attioFetch, getAttioSnapshot, invalidateCaches, AttioSnapshot } from "./attio";
import { getMeetings } from "./deal-context";
import { AttioMeeting } from "./attio-meetings";
import { readHiddenCounterparts } from "./hidden";
import {
  getAccessToken,
  getConfiguredGoogleAccounts,
  runWithConcurrency,
  withTimeout,
} from "./google-auth";
import { CLOSED_STAGES } from "./types";
import { AUTO_REPLY_HEADERS, isAutoReply, isOutreachMailbox, outreachMailbox } from "./mailboxes";

const DAY_MS = 86_400_000;
/** Calls this far back still count: a call held yesterday is as good as one booked. */
const MEETING_LOOKBACK_DAYS = 7;
const MEETING_LOOKAHEAD_DAYS = 21;
/** The cron runs weekdays only, so a Friday-night reply is still in range on Monday. */
const EMAIL_LOOKBACK_DAYS = 3;
/** A ceiling, not a target: more than this in one run means something upstream is wrong. */
const MAX_PER_RUN = 5;

export type AutoDealStage = "Demo / discovery" | "Prospecting";

export interface AutoDealCandidate {
  companyId: string;
  companyName: string;
  league: string;
  stage: AutoDealStage;
  dealName: string;
  ownerId: string | null;
  ownerName: string | null;
  personIds: string[];
  /** Deal Source, when the signal settles it (a reply to the outreach inbox). */
  source: string | null;
  /** One line for Slack: what made this a deal. */
  reason: string;
}

export interface AutoDealRun {
  candidates: AutoDealCandidate[];
  created: AutoDealCandidate[];
  /** Candidates past the per-run ceiling, left for the next run. */
  deferred: AutoDealCandidate[];
  errors: string[];
}

/** "Leicester City Football Club" → "Leicester City"; deal names drop the suffix. */
function clubName(companyName: string): string {
  return (
    companyName.replace(/\s+(Football Club|F\.?\s?C\.?|A\.?F\.?C\.?)$/i, "").trim() || companyName
  );
}

/** "Notts County - Q4 2026": the workspace convention, quarter the deal opened. */
export function autoDealName(companyName: string, now = new Date()): string {
  return `${clubName(companyName)} - Q${Math.ceil((now.getUTCMonth() + 1) / 3)} ${now.getUTCFullYear()}`;
}

interface InboundEmail {
  from: string;
  at: string;
  subject: string;
  /** The mailbox it arrived in, so the deal goes to whoever was written to. */
  mailbox: string | null;
}

/**
 * Recent mail from outside, across every connected mailbox. One list call and
 * a header fetch per message — cheap enough to run hourly — rather than a
 * search per club, which would be hundreds of calls. Headers only: sender,
 * subject, date. Bodies are never read.
 */
async function recentInboundEmail(): Promise<InboundEmail[]> {
  const out: InboundEmail[] = [];
  // All inboxes at once — the capture cron shares a 60s budget.
  await Promise.all(getConfiguredGoogleAccounts().map(async (account) => {
    try {
      const token = await getAccessToken(account);
      const gmail = async (path: string) => {
        const res = await withTimeout(
          fetch(`https://gmail.googleapis.com/gmail/v1/users/me${path}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          8000,
          "gmail"
        );
        if (!res.ok) throw new Error(`Gmail ${res.status}: ${path}`);
        return res.json();
      };
      const profile = await gmail("/profile");
      // The outreach inbox is known by its variable as well as its address
      // (danny@sentrum.ai reports itself as danny@gingersambasports.com).
      const address = String(profile?.emailAddress ?? "").toLowerCase() || null;
      const mailbox =
        account.key === "outreach" || isOutreachMailbox(address) ? outreachMailbox().address : address;
      const q = `newer_than:${EMAIL_LOOKBACK_DAYS}d -from:me -category:promotions -category:social`;
      const list = await gmail(`/messages?q=${encodeURIComponent(q)}&maxResults=50`);
      const headerParams = ["From", "Subject", ...AUTO_REPLY_HEADERS]
        .map((h) => `metadataHeaders=${h}`)
        .join("&");
      // Several at a time: the capture cron shares a 60s budget with everything else.
      const msgs = await runWithConcurrency(
        (list?.messages ?? []).map((m: any) => m.id as string),
        8,
        (id) => gmail(`/messages/${id}?format=metadata&${headerParams}`)
      );
      for (const msg of msgs) {
        if (!msg) continue;
        const header = (name: string) =>
          msg?.payload?.headers?.find((h: any) => h.name?.toLowerCase() === name)?.value ?? "";
        const from = (header("from").match(/<([^>]+)>/)?.[1] ?? header("from")).trim().toLowerCase();
        if (!from.includes("@")) continue;
        // An out-of-office is not a club talking to us.
        if (isAutoReply(header, from)) continue;
        out.push({
          from,
          at: new Date(Number(msg?.internalDate ?? Date.now())).toISOString(),
          subject: header("subject"),
          mailbox,
        });
      }
    } catch (err: any) {
      // One mailbox failing must not stop the calendar half of the job.
      console.error(`[auto-deals] gmail ${account.key}:`, err?.message);
    }
  }));
  return out;
}

/** The company whose domain an address belongs to, subdomains included. */
function companyForEmail(email: string, byDomain: Map<string, string>): string | null {
  let domain = email.split("@")[1] ?? "";
  while (domain.includes(".")) {
    const hit = byDomain.get(domain);
    if (hit) return hit;
    domain = domain.slice(domain.indexOf(".") + 1);
  }
  return null;
}

/**
 * Who should own the new deal: whoever was on the call or received the email,
 * else whoever owns the most open deals today.
 */
function ownerResolver(snapshot: AttioSnapshot) {
  const byEmail = new Map(
    snapshot.members.filter((m) => m.email).map((m) => [m.email!.toLowerCase(), m])
  );
  const openCounts = new Map<string, number>();
  for (const d of snapshot.deals) {
    if (!d.ownerId || CLOSED_STAGES.includes(d.stage as any)) continue;
    openCounts.set(d.ownerId, (openCounts.get(d.ownerId) ?? 0) + 1);
  }
  const busiest = [...openCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const fallback = snapshot.members.find((m) => m.id === busiest) ?? null;
  return (emails: (string | null | undefined)[]) => {
    for (const e of emails) {
      const m = e ? byEmail.get(e.toLowerCase()) : undefined;
      if (m) return { id: m.id, name: m.name.trim() };
    }
    return fallback ? { id: fallback.id, name: fallback.name.trim() } : { id: null, name: null };
  };
}

/** What would be created right now. Reads only — safe to call for a dry run. */
export async function findAutoDeals(options?: {
  snapshot?: AttioSnapshot;
  meetings?: AttioMeeting[];
  inbound?: InboundEmail[];
}): Promise<AutoDealCandidate[]> {
  const [snapshot, meetings, inbound, hidden] = await Promise.all([
    options?.snapshot ?? getAttioSnapshot(true),
    options?.meetings ?? getMeetings(),
    options?.inbound ?? recentInboundEmail(),
    readHiddenCounterparts().catch(() => []),
  ]);

  const hiddenIds = new Set(hidden.map((h) => h.companyId));
  // Any deal at all, won and lost included: a club we lost writing back is a
  // conversation for the owner, not a fresh deal under a new name.
  const hasDeal = new Set(
    snapshot.deals.map((d) => d.associatedCompanyId).filter(Boolean) as string[]
  );
  // A deal made by hand is sometimes linked only to a person, not the club —
  // Notts County's was. Its contacts' club counts as having a deal too, or the
  // next run would make a second one.
  const companyOfPerson = new Map(snapshot.people.map((p) => [p.id, p.companyId]));
  for (const d of snapshot.deals) {
    for (const pid of d.personIds) {
      const companyId = companyOfPerson.get(pid);
      if (companyId) hasDeal.add(companyId);
    }
  }
  const clubs = new Map(
    snapshot.companies
      .filter((c) => c.league && !hasDeal.has(c.id) && !hiddenIds.has(c.id))
      .map((c) => [c.id, c])
  );
  const clubByDomain = new Map<string, string>();
  for (const c of clubs.values()) {
    if (c.domain) clubByDomain.set(c.domain.toLowerCase().replace(/^www\./, ""), c.id);
  }
  const personByEmail = new Map(
    snapshot.people.filter((p) => p.email).map((p) => [p.email!.toLowerCase(), p.id])
  );
  const owner = ownerResolver(snapshot);

  const found = new Map<string, AutoDealCandidate>();
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

  const from = new Date(Date.now() - MEETING_LOOKBACK_DAYS * DAY_MS).toISOString();
  const to = new Date(Date.now() + MEETING_LOOKAHEAD_DAYS * DAY_MS).toISOString();
  const nowIso = new Date().toISOString();
  for (const m of [...meetings].sort((a, b) => a.startsAt.localeCompare(b.startsAt))) {
    if (m.dealId || m.startsAt < from || m.startsAt > to) continue;
    const club = m.companyIds.map((id) => clubs.get(id)).find(Boolean);
    if (!club || found.has(club.id)) continue;
    const who = owner(m.internalEmails ?? []);
    found.set(club.id, {
      companyId: club.id,
      companyName: club.name,
      league: club.league!,
      stage: "Demo / discovery",
      dealName: autoDealName(club.name),
      ownerId: who.id,
      ownerName: who.name,
      personIds: m.externalEmails
        .map((e) => personByEmail.get(e.toLowerCase()))
        .filter((id): id is string => Boolean(id)),
      source: null,
      reason: `${m.startsAt > nowIso ? "call booked" : "call held"} ${fmt(m.startsAt)} — ${m.title.trim() || "call"}`,
    });
  }

  for (const e of [...inbound].sort((a, b) => a.at.localeCompare(b.at))) {
    const clubId = companyForEmail(e.from, clubByDomain);
    const club = clubId ? clubs.get(clubId) : undefined;
    if (!club || found.has(club.id)) continue;
    // A reply to the outreach inbox is cold outreach working: owned by whoever
    // runs that inbox, sourced Email.
    const viaOutreach = isOutreachMailbox(e.mailbox);
    const who = owner([viaOutreach ? outreachMailbox().ownerEmail : e.mailbox]);
    const person = personByEmail.get(e.from);
    found.set(club.id, {
      companyId: club.id,
      companyName: club.name,
      league: club.league!,
      stage: "Prospecting",
      dealName: autoDealName(club.name),
      ownerId: who.id,
      ownerName: who.name,
      personIds: person ? [person] : [],
      source: viaOutreach ? outreachMailbox().source : null,
      reason: `${viaOutreach ? `reply to ${outreachMailbox().address}` : "email"} from ${e.from} ${fmt(e.at)}${e.subject ? ` — “${e.subject.slice(0, 80)}”` : ""}`,
    });
  }

  return [...found.values()];
}

/** Creates the deals `findAutoDeals` returns, up to the per-run ceiling. */
export async function createAutoDeals(): Promise<AutoDealRun> {
  const run: AutoDealRun = { candidates: [], created: [], deferred: [], errors: [] };
  run.candidates = await findAutoDeals();
  run.deferred = run.candidates.slice(MAX_PER_RUN);

  for (const c of run.candidates.slice(0, MAX_PER_RUN)) {
    if (!c.ownerId) {
      run.errors.push(`${c.companyName}: no owner could be resolved`);
      continue;
    }
    try {
      await attioFetch("/objects/deals/records", {
        method: "POST",
        body: JSON.stringify({
          data: {
            values: {
              name: c.dealName,
              stage: c.stage,
              owner: [{ referenced_actor_type: "workspace-member", referenced_actor_id: c.ownerId }],
              associated_company: [{ target_object: "companies", target_record_id: c.companyId }],
              ...(c.source && { source: c.source }),
              ...(c.personIds.length && {
                associated_people: c.personIds.map((id) => ({
                  target_object: "people",
                  target_record_id: id,
                })),
              }),
            },
          },
        }),
      });
      run.created.push(c);
    } catch (err: any) {
      run.errors.push(`${c.companyName}: ${err?.message}`);
    }
  }
  if (run.created.length) invalidateCaches();
  return run;
}
