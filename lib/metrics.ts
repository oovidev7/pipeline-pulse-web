// The numbers the Monday meeting runs on.
//
// Four measures, deliberately separated because collapsing them hides the
// thing you need to see:
//
//   deals reaching demo  — are we creating new opportunities?  (window-sensitive)
//   calls held           — split discovery / progression, because a busy week of
//                          trial support and a busy week of new business look
//                          identical in a single total
//   conversations        — did anyone engage with our outreach?
//   ecosystem meetings   — VCs, advisory, multi-club groups. Real work, not
//                          pipeline, and three times the volume of club calls
//
// Everything here derives from Attio's own history. Nobody types anything.

import { getAttioSnapshot } from "./attio";
import { getMeetings } from "./deal-context";
import { fetchNotes } from "./attio-notes";
import { AttioMeeting } from "./attio-meetings";
import { StageHistoryEntry } from "./types";

const DEMO_STAGE = "Demo / discovery";
/** Stages where a call is still about winning the deal, not progressing it. */
const NEW_BUSINESS_STAGES = new Set(["Prospecting", DEMO_STAGE]);

export interface WeeklyMetrics {
  /** ISO date of the Monday starting this week. */
  week: string;
  dealsReachingDemo: number;
  discoveryCalls: number;
  progressionCalls: number;
  conversations: number;
  ecosystemMeetings: number;
}

export interface MarketMetrics {
  country: string;
  conversations: number;
  calls: number;
  openDeals: number;
  openValue: number;
}

/** One counted thing — so a number on screen can open into its receipts. */
export interface MetricItem {
  /** What to show: a deal name, a meeting title, a note title. */
  label: string;
  at: string;
  dealId: string | null;
  /** For conversations: the exchange itself, so the count opens into substance. */
  excerpt: string | null;
}

export type WeekDetail = Record<keyof Omit<WeeklyMetrics, "week">, MetricItem[]>;

export interface MetricsResponse {
  weeks: WeeklyMetrics[];
  /** The items behind each week's counts, keyed by week. */
  details: Record<string, WeekDetail>;
  /**
   * Rolling window rather than weekly. At ~30 conversations a week across a
   * dozen markets, a weekly per-market number is almost entirely noise —
   * "nothing from this market in a month" is an observation, "nothing this
   * week" is not.
   */
  byMarket: MarketMetrics[];
  marketWindowDays: number;
  cachedAt: string;
}

/** Monday of the week containing `iso`, as YYYY-MM-DD. */
function weekOf(iso: string): string {
  const d = new Date(iso);
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return monday.toISOString().slice(0, 10);
}

/**
 * Which stage a deal was in on a given date, from its recorded history.
 *
 * This is what separates a discovery call from a trial call. Using the deal's
 * *current* stage would misfile every historical call the moment a deal
 * advances, quietly rewriting past weeks.
 */
function stageOn(history: StageHistoryEntry[] | undefined, iso: string): string | null {
  let current: string | null = null;
  for (const entry of history ?? []) {
    if (entry.activeFrom > iso) break;
    current = entry.stage;
  }
  return current;
}

export async function buildMetrics(weeksBack = 12): Promise<MetricsResponse> {
  const [snapshot, meetings, notes] = await Promise.all([
    getAttioSnapshot(),
    getMeetings(),
    fetchNotes(),
  ]);

  const now = new Date();
  const since = new Date(now.getTime() - weeksBack * 7 * 86_400_000).toISOString();
  const nowIso = now.toISOString();

  const blank = (): Omit<WeeklyMetrics, "week"> => ({
    dealsReachingDemo: 0,
    discoveryCalls: 0,
    progressionCalls: 0,
    conversations: 0,
    ecosystemMeetings: 0,
  });
  const byWeek = new Map<string, Omit<WeeklyMetrics, "week">>();
  const details: Record<string, WeekDetail> = {};
  const blankDetail = (): WeekDetail => ({
    dealsReachingDemo: [],
    discoveryCalls: [],
    progressionCalls: [],
    conversations: [],
    ecosystemMeetings: [],
  });
  // Every count carries its receipt: the number on screen must be able to
  // open into the deals, calls, and notes it was made of, or it is just an
  // assertion.
  const bump = (
    iso: string,
    key: keyof Omit<WeeklyMetrics, "week">,
    item: { label: string; dealId?: string | null; excerpt?: string | null }
  ) => {
    const w = weekOf(iso);
    const row = byWeek.get(w) ?? blank();
    row[key] += 1;
    byWeek.set(w, row);
    const detail = (details[w] ??= blankDetail());
    detail[key].push({
      label: item.label,
      at: iso,
      dealId: item.dealId ?? null,
      excerpt: item.excerpt ?? null,
    });
  };

  const dealName = new Map(snapshot.deals.map((d) => [d.id, d.name]));

  // Deals reaching demo: transitions *into* the demo stage. No deal in this
  // workspace has ever re-entered it, so this counts distinct opportunities.
  for (const [dealId, history] of Object.entries(snapshot.stageHistory)) {
    for (const entry of history) {
      if (entry.stage === DEMO_STAGE && entry.activeFrom >= since) {
        bump(entry.activeFrom, "dealsReachingDemo", {
          label: dealName.get(dealId) ?? "Unknown deal",
          dealId,
        });
      }
    }
  }

  const heldMeetings = meetings.filter(
    (m) => m.startsAt >= since && m.startsAt <= nowIso
  );

  const companyName = new Map(snapshot.companies.map((c) => [c.id, c.name]));
  for (const m of heldMeetings) {
    if (m.kind === "ecosystem" || m.kind === "unmatched") {
      const withWhom =
        m.companyIds.map((c) => companyName.get(c)).find(Boolean) ??
        m.externalEmails[0]?.split("@")[1] ??
        null;
      bump(m.startsAt, "ecosystemMeetings", {
        label: `${m.title || "Meeting"}${withWhom ? ` — ${withWhom}` : ""}`,
      });
      continue;
    }
    if (m.kind !== "client" || !m.dealId) continue;

    const stage = stageOn(snapshot.stageHistory[m.dealId], m.startsAt);
    // Post-sale calls are customer success, not selling; counted in neither.
    if (stage === "Won 🎉" || stage === "Lost") continue;
    const club = (dealName.get(m.dealId) ?? "").replace(/\s+[-–]\s+.*$/, "");
    bump(
      m.startsAt,
      // Unknown stage predates history and is treated as new business, which
      // is where an untracked deal almost certainly was.
      stage === null || NEW_BUSINESS_STAGES.has(stage)
        ? "discoveryCalls"
        : "progressionCalls",
      { label: `${club || "Unknown club"} — ${m.title || "call"}`, dealId: m.dealId }
    );
  }

  // Conversations: someone engaged with us. Meeting-channel notes are excluded
  // because the meeting itself is already counted above.
  const conversationNotes = notes.filter(
    (n) => n.human && n.channel !== "meeting" && n.createdAt >= since
  );
  for (const n of conversationNotes) {
    // The exchange itself rides along: a list of note titles says something
    // happened, the excerpt says what.
    bump(n.createdAt, "conversations", {
      label: n.title || "(untitled note)",
      excerpt: n.excerpt || null,
    });
  }

  const weeks: WeeklyMetrics[] = [...byWeek.entries()]
    .map(([week, row]) => ({ week, ...row }))
    .sort((a, b) => a.week.localeCompare(b.week));

  return {
    weeks,
    details,
    byMarket: buildMarkets(snapshot, heldMeetings, conversationNotes, notes),
    marketWindowDays: MARKET_WINDOW_DAYS,
    cachedAt: nowIso,
  };
}

const MARKET_WINDOW_DAYS = 28;

function buildMarkets(
  snapshot: Awaited<ReturnType<typeof getAttioSnapshot>>,
  meetings: AttioMeeting[],
  conversationNotes: Awaited<ReturnType<typeof fetchNotes>>,
  _allNotes: Awaited<ReturnType<typeof fetchNotes>>
): MarketMetrics[] {
  const windowStart = new Date(
    Date.now() - MARKET_WINDOW_DAYS * 86_400_000
  ).toISOString();

  const countryOf = new Map(snapshot.companies.map((c) => [c.id, c.countryCode]));
  const market = (code: string | null | undefined) => code || "Unknown";

  const rows = new Map<string, MarketMetrics>();
  const row = (country: string) => {
    const existing = rows.get(country);
    if (existing) return existing;
    const fresh: MarketMetrics = {
      country,
      conversations: 0,
      calls: 0,
      openDeals: 0,
      openValue: 0,
    };
    rows.set(country, fresh);
    return fresh;
  };

  // Open pipeline by market, so a silent market can be read against how much
  // is actually sitting there.
  for (const deal of snapshot.deals) {
    if (deal.stage === "Won 🎉" || deal.stage === "Lost") continue;
    const r = row(market(deal.associatedCompanyId ? countryOf.get(deal.associatedCompanyId) : null));
    r.openDeals += 1;
    r.openValue += deal.value || 0;
  }

  for (const m of meetings) {
    if (m.startsAt < windowStart || m.kind !== "client") continue;
    row(market(m.companyIds.map((c) => countryOf.get(c)).find(Boolean))).calls += 1;
  }

  // A note's market comes from the company it hangs off, directly or through
  // the person it is attached to.
  const companyOfPerson = new Map(snapshot.people.map((p) => [p.id, p.companyId]));
  for (const n of conversationNotes) {
    if (n.createdAt < windowStart) continue;
    const companyId =
      countryOf.has(n.parentRecordId)
        ? n.parentRecordId
        : companyOfPerson.get(n.parentRecordId) ?? null;
    row(market(companyId ? countryOf.get(companyId) : null)).conversations += 1;
  }

  return [...rows.values()].sort(
    (a, b) => b.conversations + b.calls - (a.conversations + a.calls) || b.openValue - a.openValue
  );
}
