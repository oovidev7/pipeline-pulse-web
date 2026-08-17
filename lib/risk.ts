import { DealRecord, StageBenchmark } from "./types";

/**
 * Composite "needs you today" scoring. Each factor is a plain-English reason
 * with a weight; the score is their sum, and the factors themselves are shown
 * next to the deal so the number is never a black box.
 *
 * Weights are house rules, not statistics: contact problems and lapsed calls
 * outrank soft signals because they block any next step at all.
 */
export interface RiskFactor {
  label: string;
  weight: number;
  /** "risk" reads red; "opportunity" (a fresh buying signal) reads accent. */
  kind: "risk" | "opportunity";
}

export interface ScoredDeal {
  deal: DealRecord;
  score: number;
  factors: RiskFactor[];
}

export interface RiskInputs {
  /** Gmail: when we last exchanged email with this deal's contact. */
  lastContactDate?: string | null;
  direction?: "ours" | "theirs" | null;
  /** Calendar: a matched upcoming client call exists. */
  hasUpcomingCall?: boolean;
  /** Attio tasks: any overdue task linked to this deal. */
  overdueTaskCount?: number;
  /** Weekly research: a market signal matched this club, and how old it is. */
  signalDate?: string | null;
  benchmark?: StageBenchmark | null;
}

const DAY_MS = 86_400_000;

function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - dt.getTime()) / DAY_MS));
}

export function scoreDeal(deal: DealRecord, inputs: RiskInputs): ScoredDeal {
  const factors: RiskFactor[] = [];
  const add = (label: string, weight: number, kind: RiskFactor["kind"] = "risk") =>
    factors.push({ label, weight, kind });

  // Contact depth — with nobody linked, nothing else can move.
  if (deal.personIds.length === 0) add("no contacts linked", 20);
  else if (deal.personIds.length === 1) add("single-threaded", 12);

  // Calls. A lapsed next_call is worse than none: momentum existed and was lost.
  const nextCallDays = deal.nextCall ? daysSince(deal.nextCall) : null;
  const nextCallInPast =
    deal.nextCall !== null && new Date(deal.nextCall) < new Date();
  if (!inputs.hasUpcomingCall) {
    if (nextCallInPast) add(`call lapsed ${nextCallDays}d ago`, 20);
    else if (!deal.nextCall) add("no call booked", 12);
  }

  // Email momentum.
  const quietDays = daysSince(inputs.lastContactDate);
  if (quietDays === null) add("no email history", 12);
  else if (quietDays > 14) add(`quiet ${quietDays}d`, 12);
  else if (inputs.direction === "ours" && quietDays > 7)
    add(`awaiting reply ${quietDays}d`, 10);

  // Velocity vs. the stage's own history. A median from fewer than 3
  // advancing deals is noise, not a benchmark — skip it below that.
  const dwell = daysSince(deal.stageEnteredAt || deal.stageChangedAt);
  const medianAdvance =
    (inputs.benchmark?.advanced ?? 0) >= 3
      ? inputs.benchmark?.medianDaysToAdvance ?? null
      : null;
  if (dwell !== null && medianAdvance !== null && dwell > medianAdvance * 1.5) {
    add(`${dwell}d in stage vs ${Math.round(medianAdvance)}d median`, 15);
  } else if (dwell !== null && dwell > 30 && medianAdvance === null) {
    // Without a usable benchmark, a month-plus in one stage still deserves a flag.
    add(`${dwell}d in stage`, 10);
  }

  if ((inputs.overdueTaskCount ?? 0) > 0) {
    add(
      `${inputs.overdueTaskCount} overdue task${inputs.overdueTaskCount === 1 ? "" : "s"}`,
      8
    );
  }

  // A recent buying signal raises urgency: the window to act is open now.
  const signalAge = daysSince(inputs.signalDate);
  if (signalAge !== null && signalAge <= 14) {
    add(`buying signal ${signalAge}d ago`, 10, "opportunity");
  }

  return {
    deal,
    score: factors.reduce((sum, f) => sum + f.weight, 0),
    factors,
  };
}

/** Ranks open deals by score, ties broken by value. */
export function rankDeals(scored: ScoredDeal[]): ScoredDeal[] {
  return [...scored].sort(
    (a, b) => b.score - a.score || (b.deal.value || 0) - (a.deal.value || 0)
  );
}
