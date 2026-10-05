// The Monday agenda.
//
// A dashboard browses: no order, no end, which is why a meeting run off one
// ambles down the pipeline deal by deal. This is the other object — ordered,
// finite, one decision per item, and it finishes.
//
// The whole thing is assembled server-side so the page has nothing to join.
// The dashboard's numbers and Slack's numbers used to drift apart precisely
// because two callers joined the same sources slightly differently.

import { unstable_cache } from "next/cache";
import {
  computeMovementBetween,
  getAttioSnapshot,
  getComputedDealsResponse,
  getOpenTasks,
} from "./attio";
import { getContactActivity } from "./contact-activity-data";
import { getSlackData } from "./slack-data";
import { getDealContext, getMeetings } from "./deal-context";
import { STAGES } from "./types";
import { buildMetrics, WeeklyMetrics, WeekDetail } from "./metrics";
import { buildConversations, ConversationReport } from "./conversations";
import { rankDeals, scoreDeal, RiskFactor } from "./risk";
import { RISK_ALERT_THRESHOLD } from "./alerts";
import { CLOSED_STAGES, DealRecord, StageMove } from "./types";
import { DealVisibility } from "./visibility";
import { AttioNote } from "./attio-notes";
import { cleanSlackText, cleanSlackUrl } from "./slack-text";
import { readHiddenCounterparts } from "./hidden";

/** Deals put to the room. More than this and it stops being a meeting. */
const MAX_DECISIONS = 5;
/** Deals asked about in the visibility queue before the rest roll to next week. */
const MAX_QUEUE = 8;

export interface AgendaDecision {
  deal: DealRecord;
  score: number;
  factors: RiskFactor[];
  visibility: DealVisibility;
  lastConversation: AttioNote | null;
  callsHeld: number;
  /**
   * Set when the recorded verdict and the deal's current state disagree —
   * e.g. a note saying "move to lost" on a deal nobody has revisited. The most
   * useful thing an agenda can do is surface a decision someone already made
   * and nobody has revisited.
   */
  tension: string | null;
}

export interface AgendaQueueItem {
  deal: DealRecord;
  days: number | null;
  channels: string[];
}

export interface UpcomingCall {
  at: string;
  title: string;
  /** The company Attio recognises on the invite, when there is no deal yet. */
  company: string | null;
  companyId: string | null;
  deal: DealRecord | null;
  /** The standing verdict on the deal, as one line of context. */
  verdict: string | null;
  /** Monday research's prepared brief for this club, when one exists. */
  brief: string | null;
}

export interface MarketSignal {
  /** Club name, or null for industry-wide signals. */
  club: string | null;
  /** The matched open deal, when the club is in the pipeline. */
  dealId: string | null;
  text: string;
  date: string | null;
  url: string | null;
}

export interface StageRow {
  stage: string;
  count: number;
  value: number;
  /**
   * Median days the open deals have sat in this stage so far. Median, not
   * mean: one deal parked for 200 days dragged the average for its whole
   * stage past anything the other deals were doing.
   */
  medianDays: number | null;
  /** Historical median days for deals that advanced out of this stage. */
  benchmarkDays: number | null;
  /** Open deals sitting longer than 1.5× that historical median. */
  aging: number;
}

/** A stage change, as the room reads it. */
export interface AgendaMove {
  deal: DealRecord;
  from: string | null;
  to: string;
}

/** An open deal as the "where" view lists it when a row is expanded. */
export interface WhereDeal {
  id: string;
  name: string;
  stage: string;
  value: number;
  active: boolean;
}

/**
 * One league's coverage: how many of its clubs in the CRM we are in play with.
 * "3 of 24 Championship clubs" is the question; the deals are the answer.
 */
export interface AgendaLeague {
  league: string;
  /** Clubs in the CRM carrying this league — the addressable set we know of. */
  clubs: number;
  /** Distinct clubs with at least one open deal. */
  clubsInPlay: number;
  openDeals: number;
  activeDeals: number;
  openValue: number;
  deals: WhereDeal[];
}

/** One market's share of the pipeline and of the recent talking. */
export interface AgendaMarket {
  /** ISO country code, or "Unknown" when the club's company has no location. */
  country: string;
  openDeals: number;
  /** Open deals with a touch in the last 14 days or a call booked. */
  activeDeals: number;
  openValue: number;
  calls: number;
  conversations: number;
  deals: WhereDeal[];
}

export interface Agenda {
  weekOf: string;
  /** The last complete week — what the numbers and the movement both describe. */
  period: { from: string; to: string };
  coverage: {
    target: number;
    won: number;
    gap: number;
    openValue: number;
    /** Every deal ever decided, as counts: at this volume a bare % misleads. */
    wonCount: number;
    lostCount: number;
    /**
     * Trialling and Proposal, by name. Replaces a weighted total: no deal ever
     * closes at "8% of £45k", and a named list is what the room can act on.
     */
    lateStage: DealRecord[];
  };
  /** Wins and losses in the trailing window, from stage history. */
  closed: { windowDays: number; won: AgendaMove[]; lost: AgendaMove[] };
  current: WeeklyMetrics | null;
  previous: WeeklyMetrics | null;
  /** The items behind the displayed week's counts — a number should open into its receipts. */
  breakdown: WeekDetail | null;
  /**
   * Open deals touched in the last 14 days or with a call booked — the same
   * "active" the decision cards use, so the two can never disagree.
   */
  active: { deals: { deal: DealRecord; lastAt: string | null }[]; openCount: number };
  decisions: AgendaDecision[];
  queue: AgendaQueueItem[];
  queueTotal: number;
  /** Stage changes in `period` — read out, not debated. */
  movement: {
    forward: AgendaMove[];
    back: AgendaMove[];
    won: AgendaMove[];
    lost: AgendaMove[];
    created: DealRecord[];
  };
  /** Calls booked for the next 7 days — pipeline calls first, each with its brief. */
  upcoming: UpcomingCall[];
  /** Open pipeline by stage — where the value actually sits. */
  stages: StageRow[];
  /** People at clubs who talked with us, any channel — and what came of it. */
  conversations: ConversationReport | null;
  /** Where the pipeline and the talking are, by country. */
  markets: AgendaMarket[];
  /** Open deals by the club's league; deals on companies with no league come last as "No league". */
  leagues: AgendaLeague[];
  marketWindowDays: number;
  /** This week's research signals, deal-linked where the club is in play. */
  signals: MarketSignal[];
  cachedAt: string;
}

/** Wins and losses are read over a quarter: a week of them is mostly zeros. */
const CLOSED_WINDOW_DAYS = 90;
/** A deal is "aging" past this multiple of its stage's historical median. */
const AGING_MULTIPLE = 1.5;

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function toMove(m: StageMove): AgendaMove {
  return { deal: m.deal, from: m.fromStage, to: m.toStage };
}

const TARGET = Number(process.env.COMMERCIAL_TARGET || 300_000);

function clubOf(name: string): string {
  return name.split(/\s+[-–]\s+/)[0].trim().toLowerCase();
}

/**
 * How long a meeting decision keeps a deal off the agenda. A parked deal
 * without an explicit revisit date returns after two weeks; "still live"
 * holds for one — the room just said so, and re-asking next Monday reads as
 * not having listened.
 */
const PARK_DEFAULT_DAYS = 14;
const STILL_LIVE_DAYS = 7;

/**
 * Reads the most recent meeting decision from `stall_notes` (the decision
 * endpoint writes them dated, newest first) and returns when the deal should
 * come back. Without this, parking a long-quiet deal is self-defeating: the
 * "Parked" verdict itself trips the tension rule and the deal reappears on
 * the very next build.
 */
function suppressedUntil(stallNotes: string | null): number | null {
  const m = stallNotes
    ?.split("\n")[0]
    ?.match(/^(Still live|Parked|Marked lost) (\d{4}-\d{2}-\d{2})(?: — revisit (\d{4}-\d{2}-\d{2}))?/);
  if (!m) return null;
  const decidedAt = new Date(m[2]).getTime();
  if (Number.isNaN(decidedAt)) return null;
  if (m[1] === "Parked") {
    return m[3]
      ? new Date(m[3]).getTime()
      : decidedAt + PARK_DEFAULT_DAYS * 86_400_000;
  }
  if (m[1] === "Still live") return decidedAt + STILL_LIVE_DAYS * 86_400_000;
  return null; // "Marked lost" also changes stage; nothing to suppress.
}

/**
 * A recorded verdict that the deal's own state contradicts. Only fires where
 * someone wrote something down and then nothing happened — silence with no
 * verdict is the queue's job, not a decision.
 */
function findTension(deal: DealRecord, vis: DealVisibility): string | null {
  const verdict = vis.verdict?.toLowerCase() ?? "";
  if (!verdict) return null;

  const days = vis.daysSinceCapture;
  if (/lost|dead|drop|park/.test(verdict) && (days === null || days > 30)) {
    return `The note says “${vis.verdict}”, and nothing has happened since. Settle it either way.`;
  }
  if (/proposal|send|due|follow/.test(verdict) && (days === null || days > 14)) {
    return `The note says “${vis.verdict}” — ${
      days === null ? "with nothing captured since" : `${days} days ago`
    }.`;
  }
  return null;
}

/**
 * The finished agenda, cached across invocations.
 *
 * Caching the parts was not enough: the assembly also pulls Gmail and Slack,
 * which have no shared cache of their own, so a warm build still took seconds.
 * Caching the result makes opening the page a single read whatever happens
 * underneath — which is the whole point, since the first person in on Monday
 * should not be the one who pays to rebuild it.
 *
 * `revalidateTag("agenda")` runs after any decision is recorded, so the page
 * never shows someone their own change as not having happened.
 */
/**
 * Bump whenever the agenda's *meaning* changes. Vercel's data cache survives
 * deployments, so without this a new build serves the old build's cached
 * agenda under the new labels — which is how "last week" once rendered with
 * the in-progress week's zeros.
 */
const AGENDA_CACHE_VERSION = "v13";

export const getAgenda = unstable_cache(
  () => buildAgenda(),
  ["agenda", AGENDA_CACHE_VERSION],
  { revalidate: 3600, tags: ["agenda"] }
);

export async function buildAgenda(): Promise<Agenda> {
  const [deals, tasks, slack, activity] = await Promise.all([
    getComputedDealsResponse(),
    getOpenTasks().catch(() => null),
    getSlackData().catch(() => null),
    getContactActivity().catch(() => null),
  ]);

  const gmailByDeal = new Map(
    (activity?.entries ?? []).map((e: any) => [e.dealId, e.lastContactDate ?? null])
  );
  const [context, metrics, conversations, allMeetings, snapshot, hidden] = await Promise.all([
    getDealContext(gmailByDeal),
    buildMetrics(8).catch(() => null),
    buildConversations().catch((err) => {
      console.error("[agenda] conversations", err);
      return null;
    }),
    getMeetings().catch(() => []),
    getAttioSnapshot(),
    readHiddenCounterparts().catch(() => []),
  ]);
  const hiddenCompanies = new Set(hidden.map((h) => h.companyId));
  const companyNameById = new Map(snapshot.companies.map((c) => [c.id, c.name]));

  const signals: any[] = slack?.marketSignals?.signals ?? [];
  const open = deals.deals.filter((d) => !CLOSED_STAGES.includes(d.stage as any));

  const dealByClub = new Map(open.map((d) => [clubOf(d.name), d.id]));
  const signalsFresh: MarketSignal[] = signals
    .filter((x: any) => {
      const t = x?.source_date ? new Date(x.source_date).getTime() : NaN;
      return Number.isFinite(t) && Date.now() - t <= 21 * 86_400_000;
    })
    .map((x: any) => {
      const club = (x.club ?? "").trim();
      const isIndustry = !club || /^industry$/i.test(club);
      return {
        club: isIndustry ? null : club,
        dealId: isIndustry ? null : dealByClub.get(club.toLowerCase()) ?? null,
        text: cleanSlackText(x.signal ?? ""),
        date: x.source_date ?? null,
        url: cleanSlackUrl(x.source_url) ?? null,
      };
    })
    .filter((x: MarketSignal) => x.text)
    // Pipeline clubs first, then the rest, newest first within each.
    .sort(
      (a: MarketSignal, b: MarketSignal) =>
        Number(Boolean(b.dealId)) - Number(Boolean(a.dealId)) ||
        (b.date ?? "").localeCompare(a.date ?? "")
    )
    .slice(0, 8);

  const scored = rankDeals(
    open.map((d) => {
      const signal = signals.find(
        (s: any) => (s.club || "").trim().toLowerCase() === clubOf(d.name)
      );
      return scoreDeal(d, {
        lastContactDate: gmailByDeal.get(d.id) ?? null,
        direction: activity?.entries.find((e: any) => e.dealId === d.id)?.direction ?? null,
        hasUpcomingCall: Boolean(context.get(d.id)?.visibility.nextMeetingAt),
        overdueTaskCount:
          tasks?.tasks.filter((t) => t.dealId === d.id && t.overdue).length ?? 0,
        signalDate: signal?.source_date ?? null,
        benchmark: deals.stageBenchmarks.find((b) => b.stage === d.stage) ?? null,
        visibility: context.get(d.id)?.visibility ?? null,
      });
    })
  );

  // Decisions: what the room should settle. Deals we cannot see are excluded —
  // there is nothing to decide about a deal nobody has any information on, and
  // they get asked about in the queue instead.
  const decisions: AgendaDecision[] = [];
  const now = Date.now();
  for (const s of scored) {
    const signals = context.get(s.deal.id);
    if (!signals || signals.visibility.state === "dark") continue;

    // The room already decided this one recently — honour it.
    const until = suppressedUntil(s.deal.stallNotes);
    if (until !== null && now < until) continue;

    const tension = findTension(s.deal, signals.visibility);
    const flagged = s.score >= RISK_ALERT_THRESHOLD;
    if (!flagged && !tension) continue;

    decisions.push({
      deal: s.deal,
      score: s.score,
      factors: s.factors,
      visibility: signals.visibility,
      lastConversation: signals.notes.lastConversation,
      callsHeld: signals.meetings.filter((m) => m.startsAt <= new Date().toISOString())
        .length,
      tension,
    });
    if (decisions.length >= MAX_DECISIONS) break;
  }

  const queueAll: AgendaQueueItem[] = scored
    .filter((s) => context.get(s.deal.id)?.visibility.state === "dark")
    .map((s) => {
      const v = context.get(s.deal.id)!.visibility;
      return { deal: s.deal, days: v.daysSinceCapture, channels: v.channels };
    })
    .sort((a, b) => (b.deal.value || 0) - (a.deal.value || 0));

  // Coming up: booked client calls for the next 7 days, each carrying the one
  // line of context that makes it preparable — the deal's standing verdict and
  // Monday research's brief where one exists. Walking into a call having read
  // two sentences beats walking in cold, and this was the old dashboard's most
  // valuable section by the user's own account.
  const nowIso = new Date().toISOString();
  const weekAhead = new Date(Date.now() + 7 * 86_400_000).toISOString();
  const briefs: any[] = slack?.callBriefs?.briefs ?? [];
  // External calls the CRM recognises — pipeline clubs and known ecosystem
  // counterparts. "Felix x Danny (no deal yet)" is worth seeing coming;
  // dinners and blockers with a guest on a personal address are not, which is
  // why an unrecognised external attendee is not enough to qualify.
  const upcoming: UpcomingCall[] = allMeetings
    .filter(
      (m) =>
        (m.kind === "client" || m.kind === "ecosystem") &&
        m.startsAt > nowIso &&
        m.startsAt <= weekAhead
    )
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    // Pipeline calls are never crowded out: on 5 Oct, six coffees and catch-ups
    // took six of the ten slots ahead of the club calls they were sharing.
    .filter(
      (m, _i, all) =>
        all.filter((x) => Boolean(x.dealId) === Boolean(m.dealId)).indexOf(m) <
        (m.dealId ? 10 : 8)
    )
    .map((m) => {
      const deal = m.dealId ? deals.deals.find((d) => d.id === m.dealId) ?? null : null;
      const club = deal ? clubOf(deal.name) : null;
      const brief = club
        ? briefs.find((b: any) => (b.club || "").trim().toLowerCase() === club)
        : null;
      const companyId = deal
        ? null
        : m.companyIds.find((c) => companyNameById.has(c)) ?? null;
      return {
        at: m.startsAt,
        title: m.title || "Call",
        company: companyId ? companyNameById.get(companyId) ?? null : null,
        companyId,
        deal,
        verdict: deal ? context.get(deal.id)?.visibility.verdict ?? null : null,
        brief: brief?.brief ?? null,
      };
    })
    // Dismissed counterparts stay dismissed — investors and funds someone has
    // said are not sales. Pipeline deals can never be hidden this way.
    .filter((c) => !c.companyId || !hiddenCompanies.has(c.companyId));

  // Where the value sits, stage by stage. A single open total flattens the
  // only distribution that matters: £45k in Trialling and £45k in Prospecting
  // are not the same money.
  const dwellDays = (d: DealRecord): number | null => {
    const from = d.stageEnteredAt || d.stageChangedAt;
    return from ? (Date.now() - new Date(from).getTime()) / 86_400_000 : null;
  };
  const stages: StageRow[] = STAGES.filter((s) => !CLOSED_STAGES.includes(s))
    .map((stage) => {
      const inStage = open.filter((d) => d.stage === stage);
      const dwells = inStage
        .map(dwellDays)
        .filter((n): n is number => n !== null);
      const benchmark =
        deals.stageBenchmarks.find((b) => b.stage === stage)?.medianDaysToAdvance ?? null;
      const mid = median(dwells);
      return {
        stage,
        count: inStage.length,
        value: inStage.reduce((t, d) => t + (d.value || 0), 0),
        medianDays: mid === null ? null : Math.round(mid),
        benchmarkDays: benchmark === null ? null : Math.round(benchmark),
        aging:
          benchmark === null
            ? 0
            : dwells.filter((days) => days > benchmark * AGING_MULTIPLE).length,
      };
    })
    .filter((r) => r.count > 0);

  // The meeting reviews the last *complete* week. On a Monday morning the
  // current week is hours old and every stat would read zero with an alarming
  // negative delta — which is noise wearing the clothes of a collapse.
  const monday = new Date();
  monday.setUTCHours(0, 0, 0, 0);
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
  const thisWeek = monday.toISOString().slice(0, 10);
  const lastMonday = new Date(monday.getTime() - 7 * 86_400_000);
  const lastWeek = lastMonday.toISOString().slice(0, 10);
  const weekBefore = new Date(lastMonday.getTime() - 7 * 86_400_000)
    .toISOString()
    .slice(0, 10);
  // By key, not position: a week with nothing in it has no row at all, and
  // taking "the last row" then showed an older week under last week's label.
  const weekRow = (week: string): WeeklyMetrics | null =>
    metrics
      ? metrics.weeks.find((w) => w.week === week) ?? {
          week,
          dealsReachingDemo: 0,
          discoveryCalls: 0,
          progressionCalls: 0,
          conversations: 0,
          ecosystemMeetings: 0,
        }
      : null;

  // Movement over the same week the numbers describe, so the two can be read
  // against each other.
  const movement = computeMovementBetween(
    deals.deals,
    snapshot.stageHistory,
    lastMonday.toISOString(),
    monday.toISOString()
  );

  // Wins and losses over a quarter, dated by the stage change itself.
  const closedSince = new Date(Date.now() - CLOSED_WINDOW_DAYS * 86_400_000).toISOString();
  const closedIn = (stage: string): AgendaMove[] =>
    deals.deals
      .filter((d) => d.stage === stage)
      .map((d): (AgendaMove & { at: string }) | null => {
        const history = snapshot.stageHistory[d.id] ?? [];
        const i = history.findIndex((e) => e.stage === stage && !e.activeUntil);
        const entry = i >= 0 ? history[i] : null;
        return entry && entry.activeFrom >= closedSince
          ? { deal: d, from: history[i - 1]?.stage ?? null, to: stage, at: entry.activeFrom }
          : null;
      })
      .filter((m): m is AgendaMove & { at: string } => m !== null)
      .sort((a, b) => b.at.localeCompare(a.at))
      .map(({ deal, from, to }) => ({ deal, from, to }));

  const active = open
    .map((d) => ({ deal: d, visibility: context.get(d.id)?.visibility }))
    .filter((x) => x.visibility?.state === "active")
    .map((x) => ({ deal: x.deal, lastAt: x.visibility!.lastCapturedAt }))
    .sort((a, b) => (b.lastAt ?? "").localeCompare(a.lastAt ?? ""));
  const activeIds = new Set(active.map((a) => a.deal.id));
  const whereDeal = (d: DealRecord): WhereDeal => ({
    id: d.id,
    name: d.name,
    stage: d.stage,
    value: d.value || 0,
    active: activeIds.has(d.id),
  });

  // Where: open deals by the country of the club's company, against the calls
  // and conversations in the market window. "9 of 21 active" is a coverage
  // statement; a map of the same numbers would mostly show how big Britain is.
  const countryOf = new Map(snapshot.companies.map((c) => [c.id, c.countryCode]));
  const markets = new Map<string, AgendaMarket>();
  const market = (country: string) => {
    let row = markets.get(country);
    if (!row) {
      row = { country, openDeals: 0, activeDeals: 0, openValue: 0, calls: 0, conversations: 0, deals: [] };
      markets.set(country, row);
    }
    return row;
  };
  for (const d of open) {
    const row = market(
      (d.associatedCompanyId && countryOf.get(d.associatedCompanyId)) || "Unknown"
    );
    row.openDeals += 1;
    row.openValue += d.value || 0;
    if (activeIds.has(d.id)) row.activeDeals += 1;
    row.deals.push(whereDeal(d));
  }

  // By league: the sharper cut. The denominator is every club in the CRM with
  // that league — the leagues were loaded whole, so it is the real field.
  const leagueOf = new Map(snapshot.companies.map((c) => [c.id, c.league]));
  const leagueRows = new Map<string, AgendaLeague & { inPlay: Set<string> }>();
  for (const c of snapshot.companies) {
    if (!c.league) continue;
    const row = leagueRows.get(c.league) ?? {
      league: c.league, clubs: 0, clubsInPlay: 0, openDeals: 0, activeDeals: 0,
      openValue: 0, deals: [], inPlay: new Set<string>(),
    };
    row.clubs += 1;
    leagueRows.set(c.league, row);
  }
  for (const d of open) {
    const league = (d.associatedCompanyId && leagueOf.get(d.associatedCompanyId)) || "No league";
    const row = leagueRows.get(league) ?? {
      league, clubs: 0, clubsInPlay: 0, openDeals: 0, activeDeals: 0,
      openValue: 0, deals: [], inPlay: new Set<string>(),
    };
    row.openDeals += 1;
    row.openValue += d.value || 0;
    if (activeIds.has(d.id)) row.activeDeals += 1;
    if (d.associatedCompanyId) row.inPlay.add(d.associatedCompanyId);
    row.deals.push(whereDeal(d));
    leagueRows.set(league, row);
  }
  const leagues: AgendaLeague[] = [...leagueRows.values()]
    .filter((r) => r.openDeals > 0)
    .map(({ inPlay, ...r }) => ({ ...r, clubsInPlay: inPlay.size }))
    .sort(
      (a, b) =>
        Number(a.league === "No league") - Number(b.league === "No league") ||
        b.openDeals - a.openDeals ||
        b.openValue - a.openValue
    );
  for (const m of metrics?.byMarket ?? []) {
    const row = market(m.country);
    row.calls = m.calls;
    row.conversations = m.conversations;
  }

  const openValue = open.reduce((t, d) => t + (d.value || 0), 0);
  const won = deals.pipelineHealth.wonCount > 0 ? valueOfWon(deals) : 0;

  return {
    weekOf: new Date().toISOString().slice(0, 10),
    period: { from: lastWeek, to: thisWeek },
    coverage: {
      target: TARGET,
      won,
      gap: Math.max(0, TARGET - won),
      openValue,
      wonCount: deals.pipelineHealth.wonCount,
      lostCount: deals.pipelineHealth.lostCount,
      lateStage: open
        .filter((d) => d.stage === "Trialling" || d.stage === "Proposal")
        .sort((a, b) => (b.value || 0) - (a.value || 0)),
    },
    closed: {
      windowDays: CLOSED_WINDOW_DAYS,
      won: closedIn("Won 🎉"),
      lost: closedIn("Lost"),
    },
    current: weekRow(lastWeek),
    previous: weekRow(weekBefore),
    breakdown: metrics?.details?.[lastWeek] ?? null,
    active: { deals: active, openCount: open.length },
    decisions,
    queue: queueAll.slice(0, MAX_QUEUE),
    queueTotal: queueAll.length,
    // Stage changes, wins and losses alike — the room reads these, it does not
    // debate them. Split by direction: a deal sliding back a stage is news the
    // old single list filed alongside progress.
    movement: {
      forward: movement.movedStage.filter((m) => m.direction !== "down").map(toMove),
      back: movement.movedStage.filter((m) => m.direction === "down").map(toMove),
      won: movement.won.map(toMove),
      lost: movement.lost.map(toMove),
      created: movement.created,
    },
    upcoming,
    stages,
    markets: [...markets.values()].sort(
      (a, b) =>
        Number(a.country === "Unknown") - Number(b.country === "Unknown") ||
        b.openDeals - a.openDeals ||
        b.calls + b.conversations - (a.calls + a.conversations)
    ),
    leagues,
    conversations,
    marketWindowDays: metrics?.marketWindowDays ?? 28,
    // This week's research, cleaned of Slack markup and deal-linked where the
    // club is in play. Fresh only: signals refresh each Monday, and stale ones
    // reading as news is the exact failure the old section was deleted for.
    signals: signalsFresh,
    cachedAt: new Date().toISOString(),
  };
}

function valueOfWon(deals: Awaited<ReturnType<typeof getComputedDealsResponse>>): number {
  return deals.deals
    .filter((d) => d.stage === "Won 🎉")
    .reduce((t, d) => t + (d.value || 0), 0);
}
