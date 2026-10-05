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
}

export interface ConversationPerson {
  name: string;
  club: string;
  channels: ConversationChannel[];
  /** First conversation with this person in the lookback window. */
  isNew: boolean;
  dealId: string | null;
  at: string;
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
  /** False until the Attio key can read email; the count is then notes and calls only. */
  emailConnected: boolean;
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
  };
  /** Open deals by people engaged in the last 30 days. */
  engagedPerDeal: {
    distribution: { zero: number; one: number; two: number; threePlus: number };
    /** Qualified and beyond with one person or none — the deals that hang on a single contact. */
    thin: { dealId: string; deal: string; stage: string; people: number }[];
  };
  windowWeeks: number;
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
      if (e?.direction !== "inbound") continue;
      const from = (e.participants ?? []).find((p: any) => p.role === "from")?.email_address;
      if (!from) continue;
      out.push({
        at: e.sent_at,
        from: String(from).toLowerCase(),
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

/** Cached for an hour: a lookback of email is many pages, and it moves slowly. */
const cachedInboundEmail = (since: string) =>
  unstable_cache(() => fetchInboundEmail(since), ["inbound-email", since.slice(0, 13)], {
    revalidate: 3600,
    tags: ["inbound-email"],
  })();

export async function buildConversations(): Promise<ConversationReport> {
  const now = new Date();
  const since = new Date(weekOf(new Date(now.getTime() - LOOKBACK_WEEKS * 7 * DAY_MS).toISOString())).toISOString();
  const nowIso = now.toISOString();

  const [snapshot, notes, meetings, email] = await Promise.all([
    getAttioSnapshot(),
    fetchNotes(),
    getMeetings().catch(() => []),
    cachedInboundEmail(since).catch((err) => {
      console.error("[conversations] email", err?.message ?? err);
      return null;
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

  const events: Event[] = [];
  const add = (personId: string | null, companyId: string | null | undefined, at: string, channel: ConversationChannel) => {
    if (!companyId || !clubs.has(companyId) || at < since || at > nowIso) return;
    events.push({
      key: personId ? `person:${personId}` : `club:${companyId}`,
      personId,
      companyId,
      at,
      channel,
    });
  };

  for (const e of email ?? []) {
    const person = personByEmail.get(e.from);
    const companyId =
      person?.companyId ??
      e.companyIds.find((id) => clubs.has(id)) ??
      clubByDomain.get(e.from.split("@")[1] ?? "");
    add(person?.id ?? null, companyId, e.at, "email");
  }

  for (const n of notes) {
    // Meeting notes are the call itself, counted from the calendar below.
    if (!n.human || n.channel === "meeting") continue;
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
  const byWeek = new Map<string, Map<string, { e: Event; channels: Set<ConversationChannel>; first: string }>>();
  for (const e of sorted) {
    const w = weekOf(e.at);
    const bucket = byWeek.get(w) ?? new Map();
    const row = bucket.get(e.key) ?? { e, channels: new Set<ConversationChannel>(), first: e.at };
    row.channels.add(e.channel);
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
      const source = deal ? deal.source ?? "Not recorded" : "No deal yet";
      bySource[source] = (bySource[source] ?? 0) + 1;
      const isNew = weekOf(firstByKey.get(r.e.key)!) === w;
      if (isNew) {
        newPeople += 1;
        newBySource[source] = (newBySource[source] ?? 0) + 1;
      }
      const person = r.e.personId ? personById.get(r.e.personId) : null;
      return {
        name: person?.name && person.name !== "Unknown" ? person.name : "Someone at the club",
        club: clubs.get(r.e.companyId)!.name,
        channels: [...r.channels],
        isNew,
        dealId: deal?.id ?? null,
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
  for (const [companyId, first] of firstByClub) {
    const w = weekOf(first);
    if (w < from8 || w > to4) continue;
    const limit = new Date(new Date(first).getTime() + CONVERSION_DAYS * DAY_MS).toISOString();
    const converted = (callsByClub.get(companyId) ?? []).some((at) => at >= first && at <= limit);
    const row = cohorts.get(w) ?? { clubs: 0, converted: 0 };
    row.clubs += 1;
    if (converted) row.converted += 1;
    cohorts.set(w, row);
  }
  const conversionWeeks = [...cohorts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, r]) => ({ week, ...r }));

  // People engaged per open deal, last 30 days.
  const engagedSince = new Date(now.getTime() - ENGAGED_DAYS * DAY_MS).toISOString();
  const engagedByClub = new Map<string, Set<string>>();
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
    const n = engagedByClub.get(d.associatedCompanyId)?.size ?? 0;
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
    weeks,
    people,
    conversion: {
      weeks: conversionWeeks,
      clubs: conversionWeeks.reduce((t, r) => t + r.clubs, 0),
      converted: conversionWeeks.reduce((t, r) => t + r.converted, 0),
    },
    engagedPerDeal: { distribution, thin },
    windowWeeks: LOOKBACK_WEEKS,
  };
}
