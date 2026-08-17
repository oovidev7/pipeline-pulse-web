export const STAGES = [
  "Prospecting",
  "Demo / discovery",
  "Qualified",
  "Trialling",
  "Proposal",
  "Won 🎉",
  "Lost",
] as const;

export type Stage = (typeof STAGES)[number];

export const CLOSED_STAGES: Stage[] = ["Won 🎉", "Lost"];

export interface DealRecord {
  id: string;
  name: string;
  stage: Stage | string;
  value: number;
  ownerId: string | null;
  ownerName: string | null;
  stageChangedAt: string | null;
  /**
   * When the deal actually entered its current stage, from Attio's stage
   * history. Authoritative where `stageChangedAt` is a hand-maintained field
   * and can disagree; null when history could not be loaded.
   */
  stageEnteredAt: string | null;
  nextCall: string | null;
  personIds: string[];
  personEmails: string[];
  createdAt: string | null;
  /** Free-text `stall_notes` field on the Attio deal — the only field this app writes. */
  stallNotes: string | null;
  associatedCompanyId: string | null;
  /** The linked company's email domain — the Gmail fallback when no people are linked. */
  companyDomain: string | null;
  /**
   * True when the deal has no directly-linked people and its contacts were
   * resolved through the company card instead — this workspace's convention.
   */
  contactsViaCompany: boolean;
  /** Stages this deal has passed through, oldest first, with time spent in each. */
  stageJourney: StageJourneyStep[];
}

export interface StageJourneyStep {
  stage: string;
  enteredAt: string;
  days: number;
  isCurrent: boolean;
}

/**
 * How deals historically behave in a stage, computed from real stage history.
 * "Advanced" means moved to a later stage (incl. Won); regressions count
 * separately and Lost-from is tracked on its own.
 */
export interface StageBenchmark {
  stage: string;
  entered: number;
  advanced: number;
  lostFrom: number;
  regressed: number;
  stillIn: number;
  medianDaysToAdvance: number | null;
}

export interface PersonRecord {
  id: string;
  name: string;
  email: string | null;
  /** The company card this person belongs to — where contacts live in this workspace. */
  companyId: string | null;
  firstEmailInteraction: string | null;
  strongestConnectionUserId: string | null;
}

export interface OpenTask {
  id: string;
  content: string;
  deadlineAt: string | null;
  assigneeNames: string[];
  /** Name of the linked deal, when the task points at one. */
  dealName: string | null;
  dealId: string | null;
  /** Deep link into the Attio task, or null when no workspace slug is configured. */
  url: string | null;
  /** True when the deadline has already passed. */
  overdue: boolean;
}

export interface TasksApiResponse {
  cachedAt: string;
  tasks: OpenTask[];
  overdueCount: number;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string | null;
}

export type RiskReasonCode =
  | "no_next_call_stale"
  | "no_contacts"
  | "single_threaded"
  | "stage_stale_vs_avg";

/**
 * Stages where multi-threading actually matters. A Prospecting deal with one
 * contact is normal, so flagging it as at-risk is just noise.
 */
export const MULTITHREAD_STAGES: string[] = ["Qualified", "Trialling", "Proposal"];

export interface AtRiskDeal {
  deal: DealRecord;
  reasons: { code: RiskReasonCode; label: string }[];
}

/**
 * Week-over-week pipeline movement, computed from live Attio timestamps.
 *
 * Attio stores only the *current* `stage_changed_at`, not a stage history, so a
 * deal that changed stage can be identified but the direction it moved cannot —
 * except for Won/Lost, where the destination makes direction unambiguous. Hence
 * `movedStage` rather than separate "advanced" and "slipped" buckets.
 */
/** One stage a deal occupied, from Attio's historical attribute values. */
export interface StageHistoryEntry {
  stage: string;
  activeFrom: string;
  activeUntil: string | null;
}

/**
 * A stage transition inside the movement window. `hops` counts how many
 * transitions happened — a deal can cross more than one stage in a week, so
 * `path` carries the full route when it does.
 */
export interface StageMove {
  deal: DealRecord;
  fromStage: string | null;
  toStage: string;
  path: string[];
  hops: number;
  movedAt: string;
  direction: "up" | "down" | "sideways";
}

export interface PipelineMovement {
  windowDays: number;
  created: DealRecord[];
  movedStage: StageMove[];
  won: StageMove[];
  lost: StageMove[];
  createdValue: number;
  movedValue: number;
  wonValue: number;
  lostValue: number;
  /** True when stage history could not be loaded and timestamps were used instead. */
  degraded: boolean;
}

/** A stalled deal scored for triage priority, highest score first. */
export interface RankedStalledDeal {
  deal: DealRecord;
  /** Days since the deal last moved stage (falls back to creation date). */
  daysSinceActivity: number;
  contactCount: number;
  score: number;
}

export interface DealsApiResponse {
  cachedAt: string;
  stageSnapshot: Record<string, number>;
  /** Summed deal value per stage, so value can be read where the deals actually sit. */
  stageValues: Record<string, number>;
  pipelineHealth: {
    winRate: number;
    openPipelineValue: number;
    stalledDealsCount: number;
    wonCount: number;
    lostCount: number;
    openCount: number;
  };
  atRiskDeals: AtRiskDeal[];
  movement: PipelineMovement;
  /** Per-stage conversion and velocity, from real stage history. */
  stageBenchmarks: StageBenchmark[];
  ownerPerformance: {
    ownerId: string | null;
    ownerName: string;
    dealCount: number;
    totalValue: number;
  }[];
  newConversations: {
    personId: string;
    name: string;
    email: string | null;
    firstEmailInteraction: string;
  }[];
  deals: DealRecord[];
}
