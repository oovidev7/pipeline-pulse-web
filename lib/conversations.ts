// Conversations: people at clubs who talked with us, on any channel.
//
// The old count was logged notes only — LinkedIn, WhatsApp, manual write-ups —
// so email, where most of the back-and-forth actually happens, never reached
// it: 24 people at clubs exchanged email in a week the tile read "6". A
// conversation is now a two-way human exchange with a named person, counted
// once per person per week whatever the channel:
//
//   email     — a message from someone at a club (Attio's email sync, inbound)
//   linkedin  — a captured LinkedIn thread
//   whatsapp  — a logged WhatsApp exchange
//   call      — a call held with the club
//   note      — any other human write-up of an exchange
//
// Outreach triggers, digests and agent notes are automation and count nowhere.
// Only clubs count (a League is set, or we have a deal with them): advisers and
// investors are real work, but they are not prospecting.

import { unstable_cache } from "next/cache";
import { attioFetch, getAttioSnapshot } from "./attio";
import { fetchNotes } from "./attio-notes";
import { getMeetings } from "./deal-context";
import { CLOSED_STAGES } from "./types";
import {
  AUTO_REPLY_HEADERS,
  isAutoReply,
  isAutoReplySubject,
  isOutreachMailbox,
  outreachMailbox,
} from "./mailboxes";
import { getOutboundStates, OutboundRead } from "./outbound";
import {
  getAccessToken,
  getConfiguredGoogleAccounts,
  runWithConcurrency,
  withTimeout,
} from "./google-auth";

export type ConversationChannel = "email" | "linkedin" | "whatsapp" | "call" | "note";

const LOOKBACK_WEEKS = 12;
const DAY_MS = 86_400_000;
/** A club "converts" when a call follows its first conversation within this many days. */
const CONVERSION_DAYS = 30;
/** People engaged per deal: talked with us in this window. */
const ENGAGED_DAYS = 30;

interface Event {
  /** person:<id>, or club:<id> when an exchange can't be pinned to a person. */
  key: string;
  personId: string | null;
  companyId: string;
  at: string;
  channel: ConversationChannel;
  /** Arrived in the outreach inbox (danny@sentrum.ai). */
  outreach: boolean;
}

export interface ConversationPerson {
  name: string;
  club: string;
  channels: ConversationChannel[];
  /** First conversation with this person in the lookback window. */
  isNew: boolean;
  dealId: string | null;
  /** How the club's deal started, "Outreach" for a reply to the outreach inbox, or "No deal yet". */
  source: string;
  /** Any of this week's exchanges came in through the outreach inbox. */
  viaOutreach: boolean;
  at: string;
}

/** One club the outbound agent is working, judged on what came of it. */
export interface OutboundClub {
  club: string;
  dealId: string | null;
  contact: string | null;
  status: string;
  channels: string[];
  touchesPlanned: number;
  touchesSent: number;
  /** The newest touch is drafted but not yet approved in Slack. */
  awaitingApproval: boolean;
  lastSentAt: string | null;
  /** First reply after the first send — the agent's record, or a conversation we saw. */
  repliedAt: string | null;
  /** First call after the first send. */
  callAt: string | null;
  firstSentAt: string | null;
  addedAt: string | null;
}

export interface ConversionClub {
  club: string;
  dealId: string | null;
  firstAt: string;
  /** Date of the first call within 30 days, if there was one. */
  callAt: string | null;
}

export interface EngagedDeal {
  dealId: string;
  deal: string;
  stage: string;
  /** Names of the people at the club who talked with us in the window. */
  people: string[];
}

export interface ConversationWeek {
  week: string;
  people: number;
  newPeople: number;
  byChannel: Record<ConversationChannel, number>;
  /** By how the club's deal started; "No deal yet" when there is none. */
  bySource: Record<string, number>;
  /** The same, for people new this week only — where fresh conversations come from. */
  newBySource: Record<string, number>;
}

export interface ConversationReport {
  /** False when no email source is available; the count is then notes and calls only. */
  emailConnected: boolean;
  /** Where email came from: Attio's sync (every mailbox) or these Gmail inboxes. */
  emailSource: {
    kind: "attio" | "gmail" | "none";
    mailboxes: string[];
    /** Configured Google tokens that couldn't be used, by env var — so a broken inbox shows. */
    failed: string[];
  };
  weeks: ConversationWeek[];
  /** Who, per week — the receipts behind each count. */
  people: Record<string, ConversationPerson[]>;
  /**
   * Clubs grouped by the week of their first conversation, 4–8 weeks back, and
   * how many reached a call within 30 days. Recent weeks are left out: their
   * 30 days have not run yet.
   */
  conversion: {
    weeks: { week: string; clubs: number; converted: number }[];
    clubs: number;
    converted: number;
    /** Every club in those weeks, so the count opens into names. */
    list: ConversionClub[];
  };
  /** The founder-led outreach test: the outbound agent's clubs and what came of them. */
  outbound: {
    mailbox: string;
    clubs: OutboundClub[];
    awaitingApproval: number;
    sentLast7Days: number;
    addedLast7Days: number;
    replied: number;
    calls: number;
    /** Clubs on the agent's list whose state couldn't be read. */
    failed: number;
    /**
     * Clubs grouped by the week of their first send, and what followed — the
     * read that stays honest as the list grows. Newest week first.
     */
    cohorts: { week: string; clubs: number; replied: number; calls: number }[];
  };
  /** Open deals by people engaged in the last 30 days. */
  engagedPerDeal: {
    distribution: { zero: number; one: number; two: number; threePlus: number };
    /** Every open deal with who is engaged, for the chips to open into. */
    deals: EngagedDeal[];
    /** Qualified and beyond with one person or none — the deals that hang on a single contact. */
    thin: { dealId: string; deal: string; stage: string; people: number }[];
  };
  windowWeeks: number;
}

/**
 * Who to show. 47 contacts at clubs have no name in Attio ("Unknown"); their
 * email address still says who it was, where "Someone at the club" didn't.
 */
function displayName(person: { name: string; email: string | null } | null | undefined): string {
  if (person?.name && person.name !== "Unknown") return person.name;
  if (person?.email) return person.email;
  return "No contact named (logged on the club)";
}

/** Monday of the week containing `iso`, as YYYY-MM-DD. */
function weekOf(iso: string): string {
  const d = new Date(iso);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

interface InboundEmail {
  at: string;
  from: string;
  companyIds: string[];
  /** The inbox it arrived in, where known. */
  mailbox?: string;
}

/**
 * Inbound email from Attio's sync — both founders' mailboxes, with direction,
 * and no Gmail tokens. Returns null when the key lacks the email scope, so the
 * count can say plainly that email isn't in it yet.
 */
async function fetchInboundEmail(since: string): Promise<InboundEmail[] | null> {
  const out: InboundEmail[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < 200; page++) {
    const params = new URLSearchParams({
      sent_after: since,
      limit: "50",
      exclude_automated_participants: "true",
    });
    if (cursor) params.set("cursor", cursor);
    let body: any;
    try {
      body = await attioFetch(`/emails?${params}`);
    } catch (err: any) {
      if (/\(403\)/.test(String(err?.message))) return null;
      throw err;
    }
    for (const e of body?.data ?? []) {
      if (e?.direction !== "inbound" || isAutoReplySubject(e?.subject_line)) continue;
      const from = (e.participants ?? []).find((p: any) => p.role === "from")?.email_address;
      if (!from) continue;
      const toOutreach = (e.participants ?? []).some(
        (p: any) => (p.role === "to" || p.role === "cc") && isOutreachMailbox(p.email_address)
      );
      out.push({
        at: e.sent_at,
        from: String(from).toLowerCase(),
        mailbox: toOutreach ? outreachMailbox().address : undefined,
        companyIds: (e.linked_records ?? [])
          .filter((r: any) => r.object_slug === "companies")
          .map((r: any) => r.record_id),
      });
    }
    cursor = body?.pagination?.next_cursor ?? null;
    if (!cursor) break;
  }
  return out;
}

/** Domains in one Gmail query: `from:(a OR b …)` stays well inside query limits. */
const GMAIL_DOMAINS_PER_QUERY = 30;

/**
 * Inbound email from club domains, straight from Gmail — the fallback while
 * Attio's emails API isn't offered on our token. Searches by sender domain, so
 * only club mail is fetched: a few hundred headers, not the whole inbox.
 * Headers only (From, date); bodies are never read.
 */
async function fetchInboundGmail(
  since: string,
  clubDomains: string[]
): Promise<{ emails: InboundEmail[]; mailboxes: string[]; failed: string[] }> {
  const after = Math.floor(new Date(since).getTime() / 1000);
  const chunks: string[][] = [];
  for (let i = 0; i < clubDomains.length; i += GMAIL_DOMAINS_PER_QUERY) {
    chunks.push(clubDomains.slice(i, i + GMAIL_DOMAINS_PER_QUERY));
  }
  const emails: InboundEmail[] = [];
  const mailboxes: string[] = [];
  const failed: string[] = [];
  const seen = new Map<string, InboundEmail>();
  for (const account of getConfiguredGoogleAccounts()) {
    try {
      const token = await getAccessToken(account);
      const gmail = async (path: string) => {
        const res = await withTimeout(
          fetch(`https://gmail.googleapis.com/gmail/v1/users/me${path}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          10_000,
          "gmail"
        );
        if (!res.ok) throw new Error(`Gmail ${res.status}`);
        return res.json();
      };
      const profile = await gmail("/profile");
      const mailbox = String(profile?.emailAddress ?? "").toLowerCase();
      // Two tokens for the same inbox: read it once.
      if (!mailbox || mailboxes.includes(mailbox)) continue;
      mailboxes.push(mailbox);

      const ids: string[] = [];
      for (const chunk of chunks) {
        const q = `after:${after} -from:me from:(${chunk.join(" OR ")})`;
        let pageToken: string | undefined;
        for (let page = 0; page < 10; page++) {
          const list = await gmail(
            `/messages?q=${encodeURIComponent(q)}&maxResults=500${pageToken ? `&pageToken=${pageToken}` : ""}`
          );
          for (const m of list?.messages ?? []) ids.push(m.id);
          pageToken = list?.nextPageToken;
          if (!pageToken) break;
        }
      }

      const headerParams = ["From", "Subject", ...AUTO_REPLY_HEADERS]
        .map((h) => `metadataHeaders=${h}`)
        .join("&");
      const headers = await runWithConcurrency(ids, 8, async (id) => {
        const msg = await gmail(`/messages/${id}?format=metadata&${headerParams}`);
        const header = (name: string) =>
          msg?.payload?.headers?.find((h: any) => h.name?.toLowerCase() === name)?.value ?? "";
        const from = (header("from").match(/<([^>]+)>/)?.[1] ?? header("from")).trim().toLowerCase();
        // Out-of-office replies and bounces are not conversations.
        if (isAutoReply(header, from)) return null;
        return { from, at: new Date(Number(msg?.internalDate ?? 0)).toISOString() };
      });
      for (const h of headers) {
        if (!h?.from?.includes("@")) continue;
        // One email reaching several inboxes is one email — but if any copy
        // reached the outreach inbox, it is an outreach reply.
        const key = `${h.from}|${h.at.slice(0, 16)}`;
        const prior = seen.get(key);
        if (prior) {
          if (isOutreachMailbox(mailbox)) prior.mailbox = mailbox;
          continue;
        }
        const row: InboundEmail = { at: h.at, from: h.from, companyIds: [], mailbox };
        seen.set(key, row);
        emails.push(row);
      }
    } catch (err: any) {
      console.error(`[conversations] gmail ${account.key}:`, err?.message);
      failed.push(
        account.key === "default" ? "GOOGLE_REFRESH_TOKEN" : `GOOGLE_REFRESH_TOKEN_${account.key.toUpperCase()}`
      );
    }
  }
  return { emails, mailboxes, failed };
}

interface EmailFeed {
  kind: "attio" | "gmail" | "none";
  mailboxes: string[];
  failed: string[];
  emails: InboundEmail[];
}

/** Attio's email sync when the token allows it; Gmail otherwise. */
export async function inboundEmail(since: string, clubDomains: string[]): Promise<EmailFeed> {
  const attio = await fetchInboundEmail(since).catch(() => null);
  if (attio) return { kind: "attio", mailboxes: [], failed: [], emails: attio };
  const gmail = await fetchInboundGmail(since, clubDomains);
  return gmail.mailboxes.length
    ? { kind: "gmail", mailboxes: gmail.mailboxes, failed: gmail.failed, emails: gmail.emails }
    : { kind: "none", mailboxes: [], failed: gmail.failed, emails: [] };
}

/** Cached for an hour: a lookback of email is many requests, and it moves slowly. */
const cachedInboundEmail = (since: string, clubDomains: string[]) =>
  unstable_cache(() => inboundEmail(since, clubDomains), ["inbound-email-v5", since.slice(0, 13)], {
    revalidate: 3600,
    tags: ["inbound-email"],
  })();

export async function buildConversations(): Promise<ConversationReport> {
  const now = new Date();
  const since = new Date(weekOf(new Date(now.getTime() - LOOKBACK_WEEKS * 7 * DAY_MS).toISOString())).toISOString();
  const nowIso = now.toISOString();

  const [snapshot, notes, meetings, outboundStates] = await Promise.all([
    getAttioSnapshot(),
    fetchNotes(),
    getMeetings().catch(() => []),
    getOutboundStates().catch((err): OutboundRead => {
      console.error("[conversations] outbound", err?.message ?? err);
      return { states: [], failed: -1 };
    }),
  ]);

  // Clubs, plus any company we have a deal with — multi-club groups like Bay
  // Collective carry no league but are very much prospecting.
  const withDeal = new Set(snapshot.deals.map((d) => d.associatedCompanyId).filter(Boolean));
  const clubs = new Map(
    snapshot.companies.filter((c) => c.league || withDeal.has(c.id)).map((c) => [c.id, c])
  );
  const personById = new Map(snapshot.people.map((p) => [p.id, p]));
  const personByEmail = new Map(
    snapshot.people.filter((p) => p.email).map((p) => [p.email!.toLowerCase(), p])
  );
  const clubByDomain = new Map<string, string>();
  for (const c of clubs.values()) {
    if (c.domain) clubByDomain.set(c.domain.toLowerCase().replace(/^www\./, ""), c.id);
  }
  /** mail.club.com → club.com: senders often use a subdomain of the club's site. */
  const clubForDomain = (domain: string): string | undefined => {
    let d = domain.toLowerCase();
    while (d.includes(".")) {
      const hit = clubByDomain.get(d);
      if (hit) return hit;
      d = d.slice(d.indexOf(".") + 1);
    }
    return undefined;
  };
  const feed: EmailFeed = await cachedInboundEmail(since, [...clubByDomain.keys()].sort()).catch(
    (err) => {
      console.error("[conversations] email", err?.message ?? err);
      return { kind: "none" as const, mailboxes: [], failed: [], emails: [] };
    }
  );
  const email = feed.kind === "none" ? null : feed.emails;

  const events: Event[] = [];
  const add = (
    personId: string | null,
    companyId: string | null | undefined,
    at: string,
    channel: ConversationChannel,
    outreach = false
  ) => {
    if (!companyId || !clubs.has(companyId) || at < since || at > nowIso) return;
    events.push({
      key: personId ? `person:${personId}` : `club:${companyId}`,
      personId,
      companyId,
      at,
      channel,
      outreach,
    });
  };

  for (const e of email ?? []) {
    const person = personByEmail.get(e.from);
    const companyId =
      person?.companyId ??
      e.companyIds.find((id) => clubs.has(id)) ??
      clubForDomain(e.from.split("@")[1] ?? "");
    add(person?.id ?? null, companyId, e.at, "email", isOutreachMailbox(e.mailbox));
  }

  // A write-up of a call is the call, which the calendar already counts. The
  // write-up often sits on a different record than the meeting — Ogi's note
  // on "Dansk Boldspil-Union" for a call linked to the league body's record —
  // so match on the title, the way meeting tools name their notes.
  const titleKey = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const callTimesByTitle = new Map<string, number[]>();
  for (const m of meetings) {
    const k = titleKey(m.title);
    if (!k || m.startsAt > nowIso) continue;
    const arr = callTimesByTitle.get(k) ?? [];
    arr.push(new Date(m.startsAt).getTime());
    callTimesByTitle.set(k, arr);
  }
  const isCallWriteup = (title: string, at: string) =>
    (callTimesByTitle.get(titleKey(title)) ?? []).some(
      (t) => Math.abs(t - new Date(at).getTime()) <= 2 * DAY_MS
    );

  for (const n of notes) {
    // Meeting notes are the call itself, counted from the calendar below.
    if (!n.human || n.channel === "meeting") continue;
    if (isCallWriteup(n.title, n.createdAt)) continue;
    const channel: ConversationChannel =
      n.channel === "linkedin" ? "linkedin" : n.channel === "whatsapp" ? "whatsapp" : n.channel === "email" ? "email" : "note";
    if (n.parentObject === "people") {
      add(n.parentRecordId, personById.get(n.parentRecordId)?.companyId, n.createdAt, channel);
    } else if (n.parentObject === "companies") {
      add(null, n.parentRecordId, n.createdAt, channel);
    } else if (n.parentObject === "deals") {
      const deal = snapshot.deals.find((d) => d.id === n.parentRecordId);
      add(null, deal?.associatedCompanyId, n.createdAt, channel);
    }
  }

  for (const m of meetings) {
    if (m.startsAt > nowIso || (m.kind !== "client" && m.kind !== "ecosystem")) continue;
    const companyId = m.companyIds.find((id) => clubs.has(id));
    if (!companyId) continue;
    const people = m.externalEmails
      .map((e) => personByEmail.get(e.toLowerCase()))
      .filter((p) => p && p.companyId === companyId);
    if (people.length === 0) add(null, companyId, m.startsAt, "call");
    for (const p of people) add(p!.id, companyId, m.startsAt, "call");
  }

  // Deals per club, for source and links.
  const dealsByClub = new Map<string, typeof snapshot.deals>();
  for (const d of snapshot.deals) {
    if (!d.associatedCompanyId) continue;
    const arr = dealsByClub.get(d.associatedCompanyId) ?? [];
    arr.push(d);
    dealsByClub.set(d.associatedCompanyId, arr);
  }
  const clubDeal = (companyId: string) => {
    const ds = dealsByClub.get(companyId) ?? [];
    return ds.find((d) => !CLOSED_STAGES.includes(d.stage as any)) ?? ds[0] ?? null;
  };

  // First conversation per person and per club, across the window.
  const sorted = events.sort((a, b) => a.at.localeCompare(b.at));
  const firstByKey = new Map<string, string>();
  const firstByClub = new Map<string, string>();
  for (const e of sorted) {
    if (!firstByKey.has(e.key)) firstByKey.set(e.key, e.at);
    if (!firstByClub.has(e.companyId)) firstByClub.set(e.companyId, e.at);
  }

  // Weekly roll-up. A club-level exchange only counts when no named person at
  // that club already did that week — otherwise one call is two "people".
  const byWeek = new Map<
    string,
    Map<string, { e: Event; channels: Set<ConversationChannel>; first: string; outreach: boolean }>
  >();
  for (const e of sorted) {
    const w = weekOf(e.at);
    const bucket = byWeek.get(w) ?? new Map();
    const row = bucket.get(e.key) ?? { e, channels: new Set<ConversationChannel>(), first: e.at, outreach: false };
    row.channels.add(e.channel);
    if (e.outreach) row.outreach = true;
    bucket.set(e.key, row);
    byWeek.set(w, bucket);
  }

  const weeks: ConversationWeek[] = [];
  const people: Record<string, ConversationPerson[]> = {};
  for (const [w, bucket] of [...byWeek.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const named = new Set([...bucket.values()].filter((r) => r.e.personId).map((r) => r.e.companyId));
    const rows = [...bucket.values()].filter((r) => r.e.personId || !named.has(r.e.companyId));
    const byChannel: Record<ConversationChannel, number> = { email: 0, linkedin: 0, whatsapp: 0, call: 0, note: 0 };
    const bySource: Record<string, number> = {};
    const newBySource: Record<string, number> = {};
    let newPeople = 0;
    people[w] = rows.map((r) => {
      for (const c of r.channels) byChannel[c] += 1;
      const deal = clubDeal(r.e.companyId);
      const ob = outreachMailbox();
      const source =
        r.outreach && (!deal || deal.source === ob.source)
          ? ob.label
          : deal
            ? deal.source ?? "Not recorded"
            : "No deal yet";
      bySource[source] = (bySource[source] ?? 0) + 1;
      const isNew = weekOf(firstByKey.get(r.e.key)!) === w;
      if (isNew) {
        newPeople += 1;
        newBySource[source] = (newBySource[source] ?? 0) + 1;
      }
      const person = r.e.personId ? personById.get(r.e.personId) : null;
      return {
        name: displayName(person),
        club: clubs.get(r.e.companyId)!.name,
        channels: [...r.channels],
        isNew,
        dealId: deal?.id ?? null,
        source,
        viaOutreach: r.outreach,
        at: r.first,
      };
    });
    weeks.push({ week: w, people: rows.length, newPeople, byChannel, bySource, newBySource });
  }

  // Conversation → call: clubs whose first conversation fell 4–8 weeks ago.
  const callsByClub = new Map<string, string[]>();
  for (const m of meetings) {
    if (m.kind !== "client" && m.kind !== "ecosystem") continue;
    for (const id of m.companyIds) {
      if (!clubs.has(id)) continue;
      const arr = callsByClub.get(id) ?? [];
      arr.push(m.startsAt);
      callsByClub.set(id, arr);
    }
  }
  const from8 = weekOf(new Date(now.getTime() - 8 * 7 * DAY_MS).toISOString());
  const to4 = weekOf(new Date(now.getTime() - 4 * 7 * DAY_MS).toISOString());
  const cohorts = new Map<string, { clubs: number; converted: number }>();
  const conversionList: ConversionClub[] = [];
  for (const [companyId, first] of firstByClub) {
    const w = weekOf(first);
    if (w < from8 || w > to4) continue;
    const limit = new Date(new Date(first).getTime() + CONVERSION_DAYS * DAY_MS).toISOString();
    const callAt =
      (callsByClub.get(companyId) ?? []).filter((at) => at >= first && at <= limit).sort()[0] ?? null;
    const converted = callAt !== null;
    conversionList.push({
      club: clubs.get(companyId)!.name,
      dealId: clubDeal(companyId)?.id ?? null,
      firstAt: first,
      callAt,
    });
    const row = cohorts.get(w) ?? { clubs: 0, converted: 0 };
    row.clubs += 1;
    if (converted) row.converted += 1;
    cohorts.set(w, row);
  }
  const conversionWeeks = [...cohorts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, r]) => ({ week, ...r }));

  // The outreach test: each club the outbound agent works, judged on what came
  // after its first send. The agent's own reply/meeting record wins; otherwise
  // a conversation or call we saw after that send counts.
  const sevenDaysAgo = new Date(now.getTime() - 7 * DAY_MS).toISOString();
  let sentLast7Days = 0;
  const outboundClubs: OutboundClub[] = outboundStates.states.map((st) => {
    const sent = st.touches
      .filter((t) => t.sentAt)
      .sort((a, b) => a.sentAt!.localeCompare(b.sentAt!));
    sentLast7Days += sent.filter((t) => t.sentAt! >= sevenDaysAgo).length;
    const firstSent = sent[0]?.sentAt ?? null;
    const newest = [...st.touches].sort((a, b) => b.n - a.n)[0];
    const seenReply = firstSent
      ? sorted.find((e) => e.companyId === st.companyId && e.channel !== "call" && e.at >= firstSent)?.at ?? null
      : null;
    const seenCall = firstSent
      ? (callsByClub.get(st.companyId) ?? []).filter((at) => at >= firstSent && at <= nowIso).sort()[0] ?? null
      : null;
    return {
      club: st.club,
      dealId: clubDeal(st.companyId)?.id ?? null,
      contact: st.contactName ? `${st.contactName}${st.contactRole ? `, ${st.contactRole}` : ""}` : null,
      status: st.status,
      channels: [...new Set(st.channelPlan)],
      touchesPlanned: st.channelPlan.length,
      touchesSent: sent.length,
      awaitingApproval: Boolean(newest?.draftedAt && !newest.approvedAt && !newest.sentAt),
      lastSentAt: sent[sent.length - 1]?.sentAt ?? null,
      repliedAt: st.repliedAt ?? seenReply,
      callAt: st.meetingAt ?? seenCall,
      firstSentAt: firstSent,
      addedAt: st.addedAt,
    };
  });
  const cohortRows = new Map<string, { clubs: number; replied: number; calls: number }>();
  for (const c of outboundClubs) {
    if (!c.firstSentAt) continue;
    const w = weekOf(c.firstSentAt);
    const row = cohortRows.get(w) ?? { clubs: 0, replied: 0, calls: 0 };
    row.clubs += 1;
    if (c.repliedAt) row.replied += 1;
    if (c.callAt) row.calls += 1;
    cohortRows.set(w, row);
  }

  // People engaged per open deal, last 30 days.
  const engagedSince = new Date(now.getTime() - ENGAGED_DAYS * DAY_MS).toISOString();
  const engagedByClub = new Map<string, Set<string>>();
  const engagedDeals: EngagedDeal[] = [];
  for (const e of sorted) {
    if (e.at < engagedSince || !e.personId) continue;
    const set = engagedByClub.get(e.companyId) ?? new Set<string>();
    set.add(e.personId);
    engagedByClub.set(e.companyId, set);
  }
  const distribution = { zero: 0, one: 0, two: 0, threePlus: 0 };
  const thin: ConversationReport["engagedPerDeal"]["thin"] = [];
  for (const d of snapshot.deals) {
    if (CLOSED_STAGES.includes(d.stage as any) || !d.associatedCompanyId) continue;
    const engaged = [...(engagedByClub.get(d.associatedCompanyId) ?? [])];
    const n = engaged.length;
    engagedDeals.push({
      dealId: d.id,
      deal: d.name,
      stage: d.stage,
      people: engaged.map((id) => displayName(personById.get(id))),
    });
    if (n === 0) distribution.zero += 1;
    else if (n === 1) distribution.one += 1;
    else if (n === 2) distribution.two += 1;
    else distribution.threePlus += 1;
    if (n <= 1 && ["Qualified", "Trialling", "Proposal"].includes(d.stage)) {
      thin.push({ dealId: d.id, deal: d.name, stage: d.stage, people: n });
    }
  }

  return {
    emailConnected: email !== null,
    emailSource: { kind: feed.kind, mailboxes: feed.mailboxes, failed: feed.failed },
    weeks,
    people,
    conversion: {
      weeks: conversionWeeks,
      clubs: conversionWeeks.reduce((t, r) => t + r.clubs, 0),
      converted: conversionWeeks.reduce((t, r) => t + r.converted, 0),
      list: conversionList.sort((a, b) => a.firstAt.localeCompare(b.firstAt)),
    },
    outbound: {
      mailbox: outreachMailbox().address,
      clubs: outboundClubs.sort(
        (a, b) =>
          Number(Boolean(b.repliedAt)) - Number(Boolean(a.repliedAt)) ||
          Number(b.awaitingApproval) - Number(a.awaitingApproval) ||
          (b.lastSentAt ?? "").localeCompare(a.lastSentAt ?? "") ||
          a.club.localeCompare(b.club)
      ),
      awaitingApproval: outboundClubs.filter((c) => c.awaitingApproval).length,
      sentLast7Days,
      addedLast7Days: outboundClubs.filter((c) => c.addedAt && c.addedAt >= sevenDaysAgo).length,
      replied: outboundClubs.filter((c) => c.repliedAt).length,
      calls: outboundClubs.filter((c) => c.callAt).length,
      failed: outboundStates.failed,
      cohorts: [...cohortRows.entries()]
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, 8)
        .map(([week, r]) => ({ week, ...r })),
    },
    engagedPerDeal: { distribution, deals: engagedDeals, thin },
    windowWeeks: LOOKBACK_WEEKS,
  };
}
