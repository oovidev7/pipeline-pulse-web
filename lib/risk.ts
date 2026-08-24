import { DealRecord, StageBenchmark } from "./types";

/**
 * Composite "needs you today" scoring. Each factor is a plain-English reason
 * with a weight; the score is their sum, and the factors themselves are shown
 * next to the deal so the number is never a black box.
 *
 * Weights are house rules, not statistics: contact problems and lapsed calls
 * outrank soft signals because they block any next step at all.
 *
 * Each weight has two parts: a base for *what* is wrong, and an escalation for
 * *how long* it has been wrong (see `persisted`). Without the second part a
 * deal that stalled in June scores exactly what it scored in May — which is
 * why the labels counted up all week while the numbers sat still.
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

/**
 * Extra weight for a problem that has *persisted*, given how far past its
 * threshold it now is. One point per week overdue.
 *
 * Capped because ageing stops being informative: a deal untouched for six
 * months is not twice the problem of one untouched for three, and without a
 * ceiling a single ancient factor would swamp every other signal. Ten weeks is
 * roughly where "needs chasing" becomes "needs closing out".
 *
 * Only time-based factors take this. Structural ones — no contacts linked, no
 * call booked — have no clock to run: they are equally wrong on day one.
 */
const ESCALATION_CAP = 10;

function persisted(daysOverdue: number | null): number {
  if (daysOverdue === null || daysOverdue <= 0) return 0;
  return Math.min(ESCALATION_CAP, Math.floor(daysOverdue / 7));
}

export function scoreDeal(deal: DealRecord, inputs: RiskInputs): ScoredDeal {
  const factors: RiskFactor[] = [];
  const add = (label: string, weight: number, kind: RiskFactor["kind"] = "risk") =>
    factors.push({ label, weight, kind });

  // Contact depth, measured by who we have actually reached rather than who we
  // know of. A company card can list a dozen names nobody has ever spoken to,
  // so counting known contacts would mark those deals as well-threaded.
  const known = deal.personIds.length;
  const engaged = deal.engagedContactCount;
  if (known === 0) {
    add("no contacts linked", 20);
  } else if (engaged === 0) {
    // Never reached anyone: a qualification problem, not a nurture problem.
    add(known === 1 ? "never reached" : `never reached any of ${known}`, 18);
  } else if (engaged === 1) {
    add(known > 1 ? `single-threaded (1 of ${known} reached)` : "single-threaded", 12);
  }

  // A relationship that existed and cooled is a better re-engagement bet than
  // one that never started, so warmth lowers the score rather than raising it.
  if (engaged > 0) {
    const strength = deal.bestConnectionStrength;
    if (strength === "Strong" || strength === "Very strong") {
      add(`${strength.toLowerCase()} relationship`, -8, "opportunity");
    } else if (strength === "Good") {
      add("good relationship", -4, "opportunity");
    }
  }

  // Calls. A lapsed next_call is worse than none: momentum existed and was lost.
  const nextCallDays = deal.nextCall ? daysSince(deal.nextCall) : null;
  const nextCallInPast =
    deal.nextCall !== null && new Date(deal.nextCall) < new Date();
  if (!inputs.hasUpcomingCall) {
    // The lapse is overdue from the moment it passes, so its own age is the
    // escalation clock — a call missed in June outranks one missed on Friday.
    if (nextCallInPast) add(`call lapsed ${nextCallDays}d ago`, 20 + persisted(nextCallDays));
    else if (!deal.nextCall) add("no call booked", 12);
  }

  // Email momentum. Gmail is the live signal but only covers the primary
  // contact; Attio's per-person interaction log is the fallback and is what
  // separates deals the mailbox search can't see.
  const gmailQuiet = daysSince(inputs.lastContactDate);
  const attioQuiet = daysSince(deal.lastPersonInteraction);
  const quietDays =
    gmailQuiet === null ? attioQuiet : attioQuiet === null ? gmailQuiet : Math.min(gmailQuiet, attioQuiet);

  if (quietDays === null) {
    // Nothing anywhere — only meaningful once we know someone was reachable.
    add(engaged > 0 ? "no email history" : "never contacted", 12);
  } else if (quietDays > 90) {
    add(`cold ${Math.round(quietDays / 30)}mo`, 14 + persisted(quietDays - 14));
  } else if (quietDays > 14) {
    add(`quiet ${quietDays}d`, 12 + persisted(quietDays - 14));
  } else if (inputs.direction === "ours" && quietDays > 7) {
    add(`awaiting reply ${quietDays}d`, 10 + persisted(quietDays - 7));
  }

  // Velocity vs. the stage's own history. A median from fewer than 3
  // advancing deals is noise, not a benchmark — skip it below that.
  const dwell = daysSince(deal.stageEnteredAt || deal.stageChangedAt);
  const medianAdvance =
    (inputs.benchmark?.advanced ?? 0) >= 3
      ? inputs.benchmark?.medianDaysToAdvance ?? null
      : null;
  if (dwell !== null && medianAdvance !== null && dwell > medianAdvance * 1.5) {
    add(
      `${dwell}d in stage vs ${Math.round(medianAdvance)}d median`,
      15 + persisted(dwell - medianAdvance * 1.5)
    );
  } else if (dwell !== null && dwell > 30 && medianAdvance === null) {
    // Without a usable benchmark, a month-plus in one stage still deserves a flag.
    add(`${dwell}d in stage`, 10 + persisted(dwell - 30));
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
