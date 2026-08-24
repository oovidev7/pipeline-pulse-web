// The weekly hygiene batch: CRM defects with ten-second fixes.
//
// Every item here quietly corrupts something downstream — an unlinked company
// breaks meeting attribution, a missing domain blocks enrichment and the
// market view, an unnamed contact renders as "Unknown" everywhere, and a
// duplicate person splits one relationship across two records so a live
// conversation reads as silence.
//
// The list is stateless and self-draining: each run recomputes from live
// Attio, so a fixed item simply never appears again. Unfixed items repeat
// weekly, which is the nag working as intended.
//
// The one fix offered in-channel is linking a deal to its company, because
// the right answer is usually computable: reply `link N` in the thread and
// the suggestion is applied. Everything else deep-links into Attio, where the
// fix is a single field.

import { attioFetch, getAttioSnapshot } from "./attio";
import { CLOSED_STAGES } from "./types";

/**
 * Effectively "show everything". A hygiene list is a work list — truncating it
 * hides exactly the items someone sat down to fix. The cap exists only as a
 * guard against a pathological workspace; at normal volume it never bites.
 * (Contrast with the risk digest, which caps hard because it is read, not
 * worked through.)
 */
const MAX_PER_SECTION = 40;
const STATE_TAG = "PULSE_HYGIENE";

/** Internal addresses — team duplicates are noise, not defects. */
function internalPattern(): RegExp {
  const raw = process.env.INTERNAL_EMAIL_DOMAINS || "gingersamba,gingersambasports,sentrum";
  const alts = raw
    .split(",")
    .map((s) => s.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .filter(Boolean)
    .join("|");
  return new RegExp(`@(${alts})`, "i");
}

/**
 * Attio's record URLs are not one pattern: standard objects use a singular
 * path (`/person/{id}`, `/company/{id}`) while custom objects like deals use
 * `/{slug}/record/{id}`. Verified against the API's own `web_url` field —
 * guessing one shape for all three sent every people/company link to the
 * Attio homepage.
 */
function attioUrl(object: "people" | "companies" | "deals", id: string): string | null {
  const slug = process.env.ATTIO_WORKSPACE_SLUG;
  if (!slug) return null;
  const path =
    object === "people"
      ? `person/${id}`
      : object === "companies"
        ? `company/${id}`
        : `deals/record/${id}`;
  return `https://app.attio.com/${slug}/${path}`;
}

function link(label: string, url: string | null): string {
  return url ? `<${url}|${label}>` : label;
}

export interface CompanySuggestion {
  n: number;
  dealId: string;
  dealName: string;
  companyId: string;
  companyName: string;
}

export interface HygieneReport {
  message: string;
  itemCount: number;
  suggestions: CompanySuggestion[];
}

export async function buildHygiene(): Promise<HygieneReport> {
  const snapshot = await getAttioSnapshot();
  const internal = internalPattern();

  const openDeals = snapshot.deals.filter(
    (d) => !CLOSED_STAGES.includes(d.stage as any)
  );
  const companyById = new Map(snapshot.companies.map((c) => [c.id, c]));
  const sections: string[] = [];
  let itemCount = 0;

  // -- Deals with no company: breaks meeting attribution and the market view.
  // A name match against existing companies makes the fix a reply.
  const suggestions: CompanySuggestion[] = [];
  const orphanLines: string[] = [];
  const norm = (s: string) => s.toLowerCase().replace(/\b(fc|cf|afc|sc)\b|[^a-z0-9]/g, "");
  for (const d of openDeals.filter((x) => !x.associatedCompanyId)) {
    const club = norm(d.name.replace(/\s+[-–]\s+.*$/, ""));
    const match = snapshot.companies.find((c) => {
      const cn = norm(c.name);
      return cn && club && (cn.includes(club) || club.includes(cn));
    });
    if (match) {
      const n = suggestions.length + 1;
      suggestions.push({
        n,
        dealId: d.id,
        dealName: d.name,
        companyId: match.id,
        companyName: match.name,
      });
      orphanLines.push(
        `• ${link(d.name, attioUrl("deals", d.id))} — no company linked. Likely *${match.name}* — reply \`link ${n}\` to apply.`
      );
    } else {
      orphanLines.push(
        `• ${link(d.name, attioUrl("deals", d.id))} — no company linked, and no match found by name.`
      );
    }
  }
  if (orphanLines.length) {
    itemCount += orphanLines.length;
    sections.push(`*Deals with no company*\n${orphanLines.slice(0, MAX_PER_SECTION).join("\n")}`);
  }

  // -- Deal companies missing domain or country: enrichment and the market
  // view stay blind until these single fields are filled.
  const dealCompanyIds = new Set(
    openDeals.map((d) => d.associatedCompanyId).filter(Boolean) as string[]
  );
  const blindLines: string[] = [];
  for (const id of dealCompanyIds) {
    const c = companyById.get(id);
    if (!c) continue;
    const missing = [
      !c.domain ? "domain" : null,
      !c.countryCode ? "location" : null,
    ].filter(Boolean);
    if (missing.length) {
      blindLines.push(
        `• ${link(c.name, attioUrl("companies", id))} — no ${missing.join(" or ")}.`
      );
    }
  }
  if (blindLines.length) {
    itemCount += blindLines.length;
    sections.push(
      `*Companies Attio can't enrich*\n${blindLines.slice(0, MAX_PER_SECTION).join("\n")}` +
        (blindLines.length > MAX_PER_SECTION
          ? `\n…and ${blindLines.length - MAX_PER_SECTION} more.`
          : "")
    );
  }

  // -- Unnamed contacts with real activity: they render as "Unknown" on every
  // surface, including the calls they were actually on.
  const dealPersonIds = new Set(openDeals.flatMap((d) => d.personIds));
  const unnamed = snapshot.people.filter(
    (p) =>
      (!p.name || p.name === "Unknown") &&
      dealPersonIds.has(p.id) &&
      (p.lastEmailInteraction || p.lastCalendarInteraction)
  );
  if (unnamed.length) {
    itemCount += unnamed.length;
    sections.push(
      `*Contacts with no name* — they show as "Unknown" everywhere\n` +
        unnamed
          .slice(0, MAX_PER_SECTION)
          .map((p) => `• ${link(p.email ?? p.id, attioUrl("people", p.id))}`)
          .join("\n") +
        (unnamed.length > MAX_PER_SECTION ? `\n…and ${unnamed.length - MAX_PER_SECTION} more.` : "")
    );
  }

  // -- Duplicate people: the deal links one record while the calls hit the
  // other, which is how a live conversation reads as silence.
  const byName = new Map<string, typeof snapshot.people>();
  for (const p of snapshot.people) {
    if (!p.name || p.name === "Unknown") continue;
    if (p.email && internal.test(p.email)) continue;
    const key = p.name.toLowerCase().replace(/[^a-z]/g, "");
    byName.set(key, [...(byName.get(key) ?? []), p]);
  }
  const dupes = [...byName.values()].filter(
    (g) => g.length > 1 && g.some((p) => dealPersonIds.has(p.id))
  );
  if (dupes.length) {
    itemCount += dupes.length;
    sections.push(
      `*Duplicate people* — merge in Attio so activity lands on one record\n` +
        dupes
          .slice(0, MAX_PER_SECTION)
          .map((g) => {
            const first = g[0];
            return `• ${link(first.name, attioUrl("people", first.id))} — ${g.length} records (${g
              .map((p) => p.email ?? "no address")
              .join(", ")})`;
          })
          .join("\n") +
        (dupes.length > MAX_PER_SECTION
          ? `\n…and ${dupes.length - MAX_PER_SECTION} more.`
          : "")
    );
  }

  const message =
    itemCount === 0
      ? ""
      : `:broom: *CRM hygiene — ${itemCount} item${itemCount === 1 ? "" : "s"}, each a ten-second fix*\n\n` +
        sections.join("\n\n") +
        `\n\n_Fixed items drop off next week's list by themselves._`;

  return { message, itemCount, suggestions };
}

// ---------------------------------------------------------------------------

async function slack(method: string, params: Record<string, unknown>) {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) throw new Error("SLACK_BOT_TOKEN not set");
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(params),
    // Next.js caches fetches made inside GET route handlers — POSTs included.
    // A cached conversations.history is how the cron reads a thread from
    // before the reply existed and concludes nobody answered.
    cache: "no-store",
  });
  const body = await res.json();
  if (!body.ok) throw new Error(`${method}: ${body.error}`);
  return body;
}

/**
 * Posts the batch and records this week's suggestions under PULSE_HYGIENE in
 * the data channel, so a `link N` reply can be resolved to a deal+company.
 */
export async function runHygiene(): Promise<{ posted: boolean; itemCount: number }> {
  const report = await buildHygiene();
  if (!report.message) return { posted: false, itemCount: 0 };

  const teamChannel = process.env.SLACK_ALERTS_CHANNEL_ID;
  if (!teamChannel) throw new Error("SLACK_ALERTS_CHANNEL_ID not set");

  const posted = await slack("chat.postMessage", {
    channel: teamChannel,
    text: report.message,
    unfurl_links: false,
  });

  const dataChannel =
    process.env.SLACK_DIGEST_CHANNEL_ID || process.env.SLACK_CHANNEL_ID;
  if (dataChannel && report.suggestions.length > 0) {
    const payload = JSON.stringify({
      ts: posted.ts,
      channel: teamChannel,
      suggestions: report.suggestions,
    });
    await slack("chat.postMessage", {
      channel: dataChannel,
      text: `${STATE_TAG} | run: ${new Date().toISOString()}\n\`\`\`${payload}\`\`\``,
      unfurl_links: false,
    });
  }

  return { posted: true, itemCount: report.itemCount };
}

interface HygieneState {
  ts: string;
  channel: string;
  suggestions: CompanySuggestion[];
}

async function readHygieneState(): Promise<HygieneState | null> {
  const channel =
    process.env.SLACK_DIGEST_CHANNEL_ID || process.env.SLACK_CHANNEL_ID;
  if (!channel) return null;
  try {
    const body = await slack("conversations.history", { channel, limit: 80 });
    for (const msg of body.messages ?? []) {
      const text: string = msg.text || "";
      if (!text.trimStart().startsWith(STATE_TAG)) continue;
      const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (!fenced) continue;
      try {
        const parsed = JSON.parse(fenced[1]);
        if (parsed?.ts && Array.isArray(parsed.suggestions)) return parsed;
      } catch {
        // keep looking
      }
    }
  } catch {
    // no state, no reply handling — the batch itself still worked
  }
  return null;
}

/**
 * `link N` in the hygiene thread applies suggestion N: the deal's company
 * reference is written and the fix confirmed in-thread. Any other reply is
 * left alone — the thread is also just a place to discuss the list.
 */
export async function handleHygieneReply(
  channelId: string,
  threadTs: string,
  text: string
): Promise<{ handled: boolean }> {
  const m = text.match(/^\s*link\s+(\d+)\s*$/i);
  if (!m) return { handled: false };

  const state = await readHygieneState();
  if (!state || state.ts !== threadTs || state.channel !== channelId) {
    return { handled: false };
  }

  const suggestion = state.suggestions.find((s) => s.n === Number(m[1]));
  if (!suggestion) return { handled: false };

  await attioFetch(`/objects/deals/records/${suggestion.dealId}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        values: {
          associated_company: [
            {
              target_object: "companies",
              target_record_id: suggestion.companyId,
            },
          ],
        },
      },
    }),
  });

  await slack("chat.postMessage", {
    channel: channelId,
    thread_ts: threadTs,
    text: `Linked *${suggestion.dealName}* to *${suggestion.companyName}*. :white_check_mark:`,
    unfurl_links: false,
  });

  return { handled: true };
}
