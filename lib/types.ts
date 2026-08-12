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
  nextCall: string | null;
  personIds: string[];
  personEmails: string[];
  createdAt: string | null;
}

export interface PersonRecord {
  id: string;
  name: string;
  email: string | null;
  firstEmailInteraction: string | null;
  strongestConnectionUserId: string | null;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string | null;
}

export type RiskReasonCode =
  | "no_next_call_stale"
  | "single_threaded"
  | "stage_stale_vs_avg";

export interface AtRiskDeal {
  deal: DealRecord;
  reasons: { code: RiskReasonCode; label: string }[];
}

export interface DealsApiResponse {
  cachedAt: string;
  stageSnapshot: Record<string, number>;
  pipelineHealth: {
    winRate: number;
    openPipelineValue: number;
    stalledDealsCount: number;
    wonCount: number;
    lostCount: number;
    openCount: number;
  };
  atRiskDeals: AtRiskDeal[];
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
