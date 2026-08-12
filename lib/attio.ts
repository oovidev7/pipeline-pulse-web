import {
  CLOSED_STAGES,
  DealRecord,
  DealsApiResponse,
  PersonRecord,
  WorkspaceMember,
} from "./types";

const ATTIO_BASE = "https://api.attio.com/v2";
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

function apiKey(): string {
  const key = process.env.ATTIO_API_KEY;
  if (!key) throw new Error("ATTIO_API_KEY is not set");
  return key;
}

async function attioFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${ATTIO_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Attio request failed (${res.status}): ${path} ${text}`);
  }
  return res.json();
}

/** Paginates through POST /v2/objects/{object}/records/query, fetching all records. */
async function listAllRecords(object: string): Promise<any[]> {
  const limit = 500;
  let offset = 0;
  const all: any[] = [];
  // Hard cap of 20 pages (10k records) as a safety valve.
  for (let page = 0; page < 20; page++) {
    const body = await attioFetch(`/objects/${object}/records/query`, {
      method: "POST",
      body: JSON.stringify({ limit, offset }),
    });
    const records = body?.data || [];
    all.push(...records);
    if (records.length < limit) break;
    offset += limit;
  }
  return all;
}

function getAttrValue(record: any, slug: string): any {
  const values = record?.values?.[slug];
  if (!values || !Array.isArray(values) || values.length === 0) return null;
  return values[0];
}

function getAttrString(record: any, slug: string): string | null {
  const v = getAttrValue(record, slug);
  if (!v) return null;
  return v.value ?? v.option?.title ?? v.status?.title ?? v.target_record_id ?? null;
}

function getAttrNumber(record: any, slug: string): number | null {
  const v = getAttrValue(record, slug);
  if (!v) return null;
  return typeof v.value === "number" ? v.value : Number(v.currency_value ?? v.value) || null;
}

function getAttrDate(record: any, slug: string): string | null {
  const v = getAttrValue(record, slug);
  if (!v) return null;
  return v.value ?? null;
}

function getReferencedIds(record: any, slug: string): string[] {
  const values = record?.values?.[slug];
  if (!values || !Array.isArray(values)) return [];
  return values
    .map((v: any) => v.target_record_id || v.referenced_actor_id || null)
    .filter(Boolean);
}

function getOwnerRef(record: any, slug: string): string | null {
  const v = getAttrValue(record, slug);
  if (!v) return null;
  return v.referenced_actor_id || v.workspace_member_id || null;
}

async function fetchWorkspaceMembers(): Promise<WorkspaceMember[]> {
  const body = await attioFetch(`/workspace_members`);
  const data = body?.data || [];
  return data.map((m: any) => ({
    id: m.id?.workspace_member_id || m.workspace_member_id || m.id,
    name: m.name || m.first_name || m.email_address || "Unknown",
    email: m.email_address || null,
  }));
}

function normalizeDeal(record: any): DealRecord {
  const id = record?.id?.record_id || record?.id;
  return {
    id,
    name: getAttrString(record, "name") || "Untitled deal",
    stage: getAttrString(record, "stage") || "Prospecting",
    value: getAttrNumber(record, "value") || 0,
    ownerId: getOwnerRef(record, "owner"),
    ownerName: null,
    stageChangedAt: getAttrDate(record, "stage_changed_at"),
    nextCall: getAttrDate(record, "next_call"),
    personIds: getReferencedIds(record, "associated_people"),
    personEmails: [],
    createdAt: record?.created_at || null,
  };
}

function normalizePerson(record: any): PersonRecord {
  const id = record?.id?.record_id || record?.id;
  const emailValues = record?.values?.email_addresses;
  const email = Array.isArray(emailValues) && emailValues.length > 0
    ? emailValues[0]?.email_address || emailValues[0]?.value || null
    : null;
  const strongest = getAttrValue(record, "strongest_connection_user");
  return {
    id,
    name: getAttrString(record, "name") || "Unknown",
    email,
    firstEmailInteraction: getAttrDate(record, "first_email_interaction"),
    strongestConnectionUserId:
      strongest?.workspace_membership_id || strongest?.referenced_actor_id || null,
  };
}

export interface AttioSnapshot {
  deals: DealRecord[];
  people: PersonRecord[];
  members: WorkspaceMember[];
}

let rawCache: { data: AttioSnapshot; timestamp: number } | null = null;
let computedCache: { data: DealsApiResponse; timestamp: number } | null = null;

/** Fetches deals, people, and workspace members from Attio (raw, uncomputed). Cached 3 min. */
export async function getAttioSnapshot(forceRefresh = false): Promise<AttioSnapshot> {
  if (!forceRefresh && rawCache && Date.now() - rawCache.timestamp < CACHE_TTL_MS) {
    return rawCache.data;
  }

  const [dealRecords, personRecords, members] = await Promise.all([
    listAllRecords("deals"),
    listAllRecords("people"),
    fetchWorkspaceMembers(),
  ]);

  const people = personRecords.map(normalizePerson);
  const peopleById = new Map(people.map((p) => [p.id, p]));

  const deals = dealRecords.map(normalizeDeal).map((d) => {
    const emails = d.personIds
      .map((pid) => peopleById.get(pid)?.email)
      .filter((e): e is string => Boolean(e));
    const owner = members.find((m) => m.id === d.ownerId);
    return { ...d, personEmails: emails, ownerName: owner?.name || null };
  });

  const data: AttioSnapshot = { deals, people, members };
  rawCache = { data, timestamp: Date.now() };
  return data;
}

function daysBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

/** Computes the full dashboard payload from a raw Attio snapshot. Cached 3 min. */
export async function getComputedDealsResponse(
  forceRefresh = false
): Promise<DealsApiResponse> {
  if (!forceRefresh && computedCache && Date.now() - computedCache.timestamp < CACHE_TTL_MS) {
    return computedCache.data;
  }

  const snapshot = await getAttioSnapshot(forceRefresh);
  const { deals, people, members } = snapshot;
  const now = new Date();

  // Stage snapshot
  const stageSnapshot: Record<string, number> = {};
  for (const d of deals) {
    stageSnapshot[d.stage] = (stageSnapshot[d.stage] || 0) + 1;
  }

  // Pipeline health
  const wonCount = deals.filter((d) => d.stage === "Won 🎉").length;
  const lostCount = deals.filter((d) => d.stage === "Lost").length;
  const openDeals = deals.filter((d) => !CLOSED_STAGES.includes(d.stage as any));
  const openCount = openDeals.length;
  const winRate = wonCount + lostCount > 0 ? wonCount / (wonCount + lostCount) : 0;
  const openPipelineValue = openDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const stalledDealsCount = openDeals.filter((d) => {
    if (!d.stageChangedAt) return false;
    return daysBetween(now, new Date(d.stageChangedAt)) > 14;
  }).length;

  // Average dwell time per stage (for open deals currently in that stage)
  const dwellByStage = new Map<string, number[]>();
  for (const d of openDeals) {
    if (!d.stageChangedAt) continue;
    const dwell = daysBetween(now, new Date(d.stageChangedAt));
    const arr = dwellByStage.get(d.stage) || [];
    arr.push(dwell);
    dwellByStage.set(d.stage, arr);
  }
  const avgDwellByStage = new Map<string, number>();
  for (const [stage, arr] of dwellByStage.entries()) {
    avgDwellByStage.set(stage, arr.reduce((a, b) => a + b, 0) / arr.length);
  }

  // At-risk deals
  const atRiskDeals = openDeals
    .map((d) => {
      const reasons: { code: any; label: string }[] = [];
      const dwell = d.stageChangedAt ? daysBetween(now, new Date(d.stageChangedAt)) : 0;
      const stageStale = dwell > 14;

      if (!d.nextCall && stageStale) {
        reasons.push({
          code: "no_next_call_stale",
          label: "No call scheduled and stage is stale (14+ days)",
        });
      }
      if (d.personIds.length <= 1) {
        reasons.push({
          code: "single_threaded",
          label: "Only one contact associated with this deal",
        });
      }
      const avgDwell = avgDwellByStage.get(d.stage);
      if (avgDwell && d.stageChangedAt && dwell > avgDwell * 2) {
        reasons.push({
          code: "stage_stale_vs_avg",
          label: `In "${d.stage}" ${Math.round(dwell)}d vs avg ${Math.round(avgDwell)}d`,
        });
      }
      return { deal: d, reasons };
    })
    .filter((r) => r.reasons.length > 0)
    .sort((a, b) => b.reasons.length - a.reasons.length);

  // Owner performance
  const ownerMap = new Map<
    string,
    { ownerId: string | null; ownerName: string; dealCount: number; totalValue: number }
  >();
  for (const d of deals) {
    const key = d.ownerId || "unassigned";
    const entry = ownerMap.get(key) || {
      ownerId: d.ownerId,
      ownerName: d.ownerName || "Unassigned",
      dealCount: 0,
      totalValue: 0,
    };
    entry.dealCount += 1;
    entry.totalValue += d.value || 0;
    ownerMap.set(key, entry);
  }
  const ownerPerformance = Array.from(ownerMap.values()).sort(
    (a, b) => b.totalValue - a.totalValue
  );

  // New conversations: person's first_email_interaction within last 7 days AND
  // strongest_connection_user resolves to a workspace member (i.e. Attio auto-detected
  // a real first-contact email exchanged with someone on our team).
  const memberIds = new Set(members.map((m) => m.id));
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const newConversations = people
    .filter((p) => {
      if (!p.firstEmailInteraction) return false;
      const dt = new Date(p.firstEmailInteraction);
      if (dt < sevenDaysAgo || dt > now) return false;
      return p.strongestConnectionUserId ? memberIds.has(p.strongestConnectionUserId) : false;
    })
    .map((p) => ({
      personId: p.id,
      name: p.name,
      email: p.email,
      firstEmailInteraction: p.firstEmailInteraction as string,
    }));

  const data: DealsApiResponse = {
    cachedAt: new Date().toISOString(),
    stageSnapshot,
    pipelineHealth: {
      winRate,
      openPipelineValue,
      stalledDealsCount,
      wonCount,
      lostCount,
      openCount,
    },
    atRiskDeals,
    ownerPerformance,
    newConversations,
    deals,
  };

  computedCache = { data, timestamp: Date.now() };
  return data;
}
