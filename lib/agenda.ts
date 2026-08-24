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
import { getComputedDealsResponse, getOpenTasks } from "./attio";
import { getContactActivity } from "./contact-activity-data";
import { getSlackData } from "./slack-data";
import { getDealContext } from "./deal-context";
import { buildMetrics, WeeklyMetrics, WeekDetail } from "./metrics";
import { rankDeals, scoreDeal, RiskFactor } from "./risk";
import { RISK_ALERT_THRESHOLD } from "./alerts";
import { CLOSED_STAGES, DealRecord } from "./types";
import { DealVisibility } from "./visibility";
import { AttioNote } from "./attio-notes";

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

export interface Agenda {
  weekOf: string;
  coverage: {
    target: number;
    won: number;
    gap: number;
    openValue: number;
    weighted: number;
    winRate: number;
  };
  current: WeeklyMetrics | null;
  previous: WeeklyMetrics | null;
  /** The items behind the displayed week's counts — a number should open into its receipts. */
  breakdown: WeekDetail | null;
  decisions: AgendaDecision[];
  queue: AgendaQueueItem[];
  queueTotal: number;
  /** Deals that changed stage in the last 7 days — read out, not debated. */
  moved: { deal: DealRecord; from: string | null; to: string }[];
  cachedAt: string;
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
const AGENDA_CACHE_VERSION = "v3";

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
  const [context, metrics] = await Promise.all([
    getDealContext(gmailByDeal),
    buildMetrics(8).catch(() => null),
  ]);

  const signals: any[] = slack?.marketSignals?.signals ?? [];
  const open = deals.deals.filter((d) => !CLOSED_STAGES.includes(d.stage as any));

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

  // The meeting reviews the last *complete* week. On a Monday morning the
  // current week is hours old and every stat would read zero with an alarming
  // negative delta — which is noise wearing the clothes of a collapse.
  const monday = new Date();
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
  const thisWeek = monday.toISOString().slice(0, 10);
  const weeks = (metrics?.weeks ?? []).filter((w) => w.week < thisWeek);

  const openValue = open.reduce((t, d) => t + (d.value || 0), 0);
  const won = deals.pipelineHealth.wonCount > 0 ? valueOfWon(deals) : 0;

  return {
    weekOf: new Date().toISOString().slice(0, 10),
    coverage: {
      target: TARGET,
      won,
      gap: Math.max(0, TARGET - won),
      openValue,
      weighted: openValue * deals.pipelineHealth.winRate,
      winRate: deals.pipelineHealth.winRate,
    },
    current: weeks[weeks.length - 1] ?? null,
    previous: weeks[weeks.length - 2] ?? null,
    breakdown: weeks.length
      ? metrics?.details?.[weeks[weeks.length - 1].week] ?? null
      : null,
    decisions,
    queue: queueAll.slice(0, MAX_QUEUE),
    queueTotal: queueAll.length,
    // Stage changes, wins and losses alike — the room reads these, it does not
    // debate them.
    moved: [
      ...(deals.movement?.movedStage ?? []),
      ...(deals.movement?.won ?? []),
      ...(deals.movement?.lost ?? []),
    ].map((m) => ({ deal: m.deal, from: m.fromStage, to: m.toStage })),
    cachedAt: new Date().toISOString(),
  };
}

function valueOfWon(deals: Awaited<ReturnType<typeof getComputedDealsResponse>>): number {
  return deals.deals
    .filter((d) => d.stage === "Won 🎉")
    .reduce((t, d) => t + (d.value || 0), 0);
}
