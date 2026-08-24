import {
  CLOSED_STAGES,
  DealRecord,
  DealsApiResponse,
  MULTITHREAD_STAGES,
  OpenTask,
  PersonRecord,
  PipelineMovement,
  RankedStalledDeal,
  STAGES,
  StageBenchmark,
  StageHistoryEntry,
  StageJourneyStep,
  StageMove,
  TasksApiResponse,
  WorkspaceMember,
} from "./types";
import { runWithConcurrency } from "./google-auth";

import { unstable_cache, revalidateTag } from "next/cache";

const ATTIO_BASE = "https://api.attio.com/v2";
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes
/** Shared-cache window. Longer, because it survives between invocations. */
const SHARED_SNAPSHOT_SECONDS = 3600;

function apiKey(): string {
  const key = process.env.ATTIO_API_KEY;
  if (!key) throw new Error("ATTIO_API_KEY is not set");
  return key;
}

/**
 * Attio rate-limits per workspace, and the dashboard loads seven sections at
 * once — so a burst is normal traffic here, not misuse. A 429 is retried with
 * backoff rather than surfaced, because failing a section for a transient limit
 * shows the user an error where a half-second wait would have succeeded.
 */
const RATE_LIMIT_RETRIES = 3;

export async function attioFetch(path: string, init?: RequestInit) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${ATTIO_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${apiKey()}`,
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      cache: "no-store",
    });

    if (res.ok) return res.json();

    if (res.status === 429 && attempt < RATE_LIMIT_RETRIES) {
      const retryAfter = Number(res.headers.get("retry-after"));
      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : 400 * 2 ** attempt;
      await new Promise((r) => setTimeout(r, waitMs));
      continue;
    }

    const text = await res.text().catch(() => "");
    throw new Error(`Attio request failed (${res.status}): ${path} ${text}`);
  }
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
  // personal-name values carry full_name rather than value
  return (
    v.value ?? v.full_name ?? v.option?.title ?? v.status?.title ?? v.target_record_id ?? null
  );
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
    stageEnteredAt: null,
    nextCall: getAttrDate(record, "next_call"),
    personIds: getReferencedIds(record, "associated_people"),
    personEmails: [],
    createdAt: record?.created_at || null,
    stallNotes: getAttrString(record, "stall_notes"),
    // Fields that existed in Attio from the start and went unread until
    // 2026-08-24. `note` in particular carries human verdicts — Spartak
    // Moscow's reads "one more try then move to lost" — which is exactly the
    // judgement the dashboard should surface rather than recompute.
    dealNote: getAttrString(record, "note"),
    lastWhatsappTouch: getAttrDate(record, "last_whatsapp_touch"),
    source: getAttrString(record, "source"),
    associatedCompanyId: getReferencedIds(record, "associated_company")[0] ?? null,
    companyDomain: null,
    contactsViaCompany: false,
    engagedContactCount: 0,
    lastPersonInteraction: null,
    bestConnectionStrength: null,
    stageJourney: [],
  };
}

/** Attio's connection-strength ladder, weakest first. */
const CONNECTION_STRENGTH_ORDER = [
  "Very weak",
  "Weak",
  "Good",
  "Strong",
  "Very strong",
];

function strongerOf(a: string | null, b: string | null): string | null {
  if (!a) return b;
  if (!b) return a;
  return CONNECTION_STRENGTH_ORDER.indexOf(a) >= CONNECTION_STRENGTH_ORDER.indexOf(b)
    ? a
    : b;
}

export interface CompanyRecord {
  id: string;
  name: string;
  /** ISO country code from `primary_location`, for grouping by market. */
  countryCode: string | null;
}

/**
 * Companies, kept for grouping deals and meetings by market. Location comes
 * from Attio's enrichment rather than a club-name lookup table, which would
 * break on the first ambiguous name and silently misfile it.
 */
function normalizeCompanies(records: any[]): CompanyRecord[] {
  return records.map((record) => ({
    id: record?.id?.record_id,
    name: getAttrString(record, "name") || "Unknown",
    countryCode: getAttrValue(record, "primary_location")?.country_code ?? null,
  }));
}

/** Company id → primary email domain, from the companies object's `domains`. */
function normalizeCompanyDomains(records: any[]): Map<string, string> {
  const out = new Map<string, string>();
  for (const record of records) {
    const id = record?.id?.record_id;
    const domains = record?.values?.domains;
    const domain =
      Array.isArray(domains) && domains.length > 0
        ? domains[0]?.domain ?? domains[0]?.root_domain ?? null
        : null;
    if (id && domain) out.set(id, String(domain).toLowerCase());
  }
  return out;
}

/**
 * Turns raw stage history into a readable journey: which stages the deal passed
 * through and how long it sat in each. The final step is open-ended, so its
 * duration runs to now rather than to an `active_until`.
 */
function buildStageJourney(
  history: StageHistoryEntry[] | undefined,
  now: Date
): StageJourneyStep[] {
  if (!history || history.length === 0) return [];
  return history.map((entry, i) => {
    const isCurrent = i === history.length - 1;
    const start = new Date(entry.activeFrom);
    const end = isCurrent
      ? now
      : new Date(entry.activeUntil ?? history[i + 1]?.activeFrom ?? entry.activeFrom);
    const days = Math.max(
      0,
      Math.round((end.getTime() - start.getTime()) / 86_400_000)
    );
    return { stage: entry.stage, enteredAt: entry.activeFrom, days, isCurrent };
  });
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
    companyId: getReferencedIds(record, "company")[0] ?? null,
    firstEmailInteraction: getAttrDate(record, "first_email_interaction"),
    // Interaction attributes carry `interacted_at` rather than `value`.
    lastEmailInteraction:
      getAttrValue(record, "last_email_interaction")?.interacted_at ?? null,
    // Attio syncs calendar independently of our Google tokens, so these are
    // populated even for the accounts whose refresh tokens are missing.
    lastCalendarInteraction:
      getAttrValue(record, "last_calendar_interaction")?.interacted_at ?? null,
    nextCalendarInteraction:
      getAttrValue(record, "next_calendar_interaction")?.interacted_at ?? null,
    linkedin: getAttrString(record, "linkedin"),
    connectionStrength:
      getAttrValue(record, "strongest_connection_strength")?.option?.title ?? null,
    strongestConnectionUserId:
      strongest?.workspace_membership_id || strongest?.referenced_actor_id || null,
  };
}

export interface AttioSnapshot {
  deals: DealRecord[];
  people: PersonRecord[];
  companies: CompanyRecord[];
  members: WorkspaceMember[];
  /** Stage history per deal id. Empty when the history fetch failed. */
  stageHistory: Record<string, StageHistoryEntry[]>;
}

const HISTORY_CONCURRENCY = 6;

/**
 * Attio's `stage_changed_at` is a workspace field rather than a system
 * timestamp, and on this workspace it disagrees with reality for a handful of
 * deals. The historical attribute-values endpoint is authoritative and also
 * yields the *previous* stage, which is the only way to know which direction a
 * deal moved.
 */
async function fetchStageHistory(dealId: string): Promise<StageHistoryEntry[]> {
  const body = await attioFetch(
    `/objects/deals/records/${dealId}/attributes/stage/values?show_historic=true&limit=50`
  );
  return ((body?.data || []) as any[])
    .map((v) => ({
      stage: v?.status?.title ?? v?.option?.title ?? v?.value ?? null,
      activeFrom: v?.active_from ?? null,
      activeUntil: v?.active_until ?? null,
    }))
    .filter((e): e is StageHistoryEntry => Boolean(e.stage && e.activeFrom))
    .sort((a, b) => a.activeFrom.localeCompare(b.activeFrom));
}

/**
 * Fetches stage history for every deal concurrently. A failure for one deal
 * yields an empty history for that deal rather than failing the dashboard —
 * callers fall back to `stageChangedAt`.
 */
async function fetchAllStageHistory(
  deals: DealRecord[]
): Promise<Record<string, StageHistoryEntry[]>> {
  const results = await runWithConcurrency(deals, HISTORY_CONCURRENCY, async (deal) => {
    try {
      return [deal.id, await fetchStageHistory(deal.id)] as const;
    } catch (err) {
      console.error(`[attio] stage history failed for ${deal.id}`, err);
      return [deal.id, [] as StageHistoryEntry[]] as const;
    }
  });

  const out: Record<string, StageHistoryEntry[]> = {};
  for (const entry of results) {
    if (!entry) continue;
    out[entry[0]] = entry[1];
  }
  return out;
}

let rawCache: { data: AttioSnapshot; timestamp: number } | null = null;
let computedCache: { data: DealsApiResponse; timestamp: number } | null = null;

async function buildSnapshot(): Promise<AttioSnapshot> {
  const [dealRecords, personRecords, companyRecords, members] = await Promise.all([
    listAllRecords("deals"),
    listAllRecords("people"),
    listAllRecords("companies"),
    fetchWorkspaceMembers(),
  ]);
  const companyDomains = normalizeCompanyDomains(companyRecords);

  const people = personRecords.map(normalizePerson);
  const peopleById = new Map(people.map((p) => [p.id, p]));

  // In this workspace contacts are attached to the company card, not the deal —
  // so a deal's people are resolved through its company when nothing is linked
  // directly. Direct links still win when present.
  const peopleByCompany = new Map<string, PersonRecord[]>();
  for (const p of people) {
    if (!p.companyId) continue;
    const arr = peopleByCompany.get(p.companyId) || [];
    arr.push(p);
    peopleByCompany.set(p.companyId, arr);
  }

  const baseDeals = dealRecords.map(normalizeDeal).map((d) => {
    const companyPeople = d.associatedCompanyId
      ? peopleByCompany.get(d.associatedCompanyId) ?? []
      : [];
    // Union, not either/or. Taking the direct links *instead of* the company's
    // people hid 122 contacts across 32 open deals — 23 of them people who had
    // actually replied — because a single direct link suppressed the whole
    // company card. Thirteen deals were scored "single-threaded" or "never
    // reached" while someone at the club was mid-conversation with us.
    const contactsViaCompany = d.personIds.length === 0 && companyPeople.length > 0;
    const personIds = [
      ...new Set([...d.personIds, ...companyPeople.map((p) => p.id)]),
    ];
    const contacts = personIds
      .map((pid) => peopleById.get(pid))
      .filter((p): p is PersonRecord => Boolean(p));
    const emails = contacts
      .map((p) => p.email)
      .filter((e): e is string => Boolean(e));

    // Engagement, from Attio's own interaction log — no extra API calls.
    const engaged = contacts.filter((p) => Boolean(p.lastEmailInteraction));
    const lastPersonInteraction = engaged.reduce<string | null>(
      (latest, p) =>
        !latest || (p.lastEmailInteraction as string) > latest
          ? (p.lastEmailInteraction as string)
          : latest,
      null
    );
    const bestConnectionStrength = contacts.reduce<string | null>(
      (best, p) => strongerOf(best, p.connectionStrength),
      null
    );

    const owner = members.find((m) => m.id === d.ownerId);
    return {
      ...d,
      personIds,
      personEmails: emails,
      contactsViaCompany,
      engagedContactCount: engaged.length,
      lastPersonInteraction,
      bestConnectionStrength,
      ownerName: owner?.name || null,
      companyDomain: d.associatedCompanyId
        ? companyDomains.get(d.associatedCompanyId) ?? null
        : null,
    };
  });

  const stageHistory = await fetchAllStageHistory(baseDeals);

  // Prefer the real "entered this stage" moment over the workspace field.
  const now = new Date();
  const deals = baseDeals.map((d) => {
    const history = stageHistory[d.id];
    const current = history?.[history.length - 1];
    return {
      ...d,
      stageEnteredAt: current?.activeFrom ?? null,
      stageJourney: buildStageJourney(history, now),
    };
  });

  const data: AttioSnapshot = {
    deals,
    people,
    companies: normalizeCompanies(companyRecords),
    members,
    stageHistory,
  };
  return data;
}

/**
 * The snapshot, cached in two layers.
 *
 * Building it costs a records query per object plus one stage-history request
 * per deal — around sixty calls. The in-memory layer covers repeat reads inside
 * a single invocation; the shared layer is what survives between them, since
 * every serverless invocation starts with an empty module scope and would
 * otherwise rebuild the whole thing for whoever arrives next.
 *
 * `forceRefresh` deliberately bypasses both: it exists for the moment after a
 * write, where returning a cached copy would show the user their change had not
 * happened.
 */
const sharedSnapshot = unstable_cache(buildSnapshot, ["attio-snapshot"], {
  revalidate: SHARED_SNAPSHOT_SECONDS,
  tags: ["attio-snapshot"],
});

export async function getAttioSnapshot(forceRefresh = false): Promise<AttioSnapshot> {
  if (!forceRefresh && rawCache && Date.now() - rawCache.timestamp < CACHE_TTL_MS) {
    return rawCache.data;
  }
  let data: AttioSnapshot;
  if (forceRefresh) {
    data = await buildSnapshot();
  } else {
    try {
      data = await sharedSnapshot();
    } catch (err: any) {
      // unstable_cache only works inside the Next server. Scripts and tests
      // call this module directly, and losing the shared layer there is fine —
      // they were never sharing an instance with anyone anyway.
      if (!String(err?.message).includes("incrementalCache")) throw err;
      data = await buildSnapshot();
    }
  }
  rawCache = { data, timestamp: Date.now() };
  return data;
}

function daysBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

const STALE_STAGE_DAYS = 14;

/**
 * A `next_call` date in the past is not a booked call — the meeting already
 * happened and nothing new was scheduled. Only a future date counts.
 */
function hasUpcomingCall(deal: DealRecord, now: Date): boolean {
  if (!deal.nextCall) return false;
  const dt = new Date(deal.nextCall);
  return !Number.isNaN(dt.getTime()) && dt >= now;
}

/**
 * Days the deal has sat in its current stage, or null if unknown. Prefers the
 * real stage-history entry date, falling back to the workspace field when
 * history is unavailable.
 */
function stageDwellDays(deal: DealRecord, now: Date): number | null {
  const source = deal.stageEnteredAt || deal.stageChangedAt;
  if (!source) return null;
  const dt = new Date(source);
  if (Number.isNaN(dt.getTime())) return null;
  return daysBetween(now, dt);
}

/**
 * "Stalled" means the deal has no forward motion: it has sat in its stage for
 * 14+ days AND has no upcoming call booked. Both halves matter — a stale stage
 * with a call on the books is just a slow stage, not a stalled deal.
 */
function isStalled(deal: DealRecord, now: Date): boolean {
  const dwell = stageDwellDays(deal, now);
  return dwell !== null && dwell > STALE_STAGE_DAYS && !hasUpcomingCall(deal, now);
}

const MOVEMENT_WINDOW_DAYS = 7;

/** True if `iso` falls inside the trailing window ending now. */
function withinWindow(iso: string | null, now: Date, days: number): boolean {
  if (!iso) return false;
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return false;
  const age = now.getTime() - dt.getTime();
  return age >= 0 && age <= days * 24 * 60 * 60 * 1000;
}

function sumValue(deals: DealRecord[]): number {
  return deals.reduce((sum, d) => sum + (d.value || 0), 0);
}

/**
 * What actually changed in the pipeline this week, per deal.
 *
 * Deals created inside the window are excluded from `movedStage` — Attio stamps
 * `stage_changed_at` when a deal is created, so a brand-new deal would
 * otherwise be counted twice, once as created and once as moved.
 */
/**
 * Builds the transition a deal made inside the window from its stage history.
 * Returns null if it did not change stage in that period.
 *
 * A deal can cross several stages in one week, so every transition inside the
 * window is collected: `fromStage` is where it started the week, `toStage`
 * where it ended, and `path` the route between them.
 */
function buildStageMove(
  deal: DealRecord,
  history: StageHistoryEntry[] | undefined,
  now: Date
): StageMove | null {
  if (!history || history.length < 2) return null;

  // Every entry that became active inside the window is a transition.
  const transitions = history.filter(
    (e, i) => i > 0 && withinWindow(e.activeFrom, now, MOVEMENT_WINDOW_DAYS)
  );
  if (transitions.length === 0) return null;

  const firstIdx = history.indexOf(transitions[0]);
  const fromStage = history[firstIdx - 1]?.stage ?? null;
  const last = transitions[transitions.length - 1];
  const toStage = last.stage;

  const fromRank = fromStage !== undefined && fromStage !== null ? STAGE_RANK[fromStage] : undefined;
  const toRank = STAGE_RANK[toStage];
  const direction =
    fromRank === undefined || toRank === undefined || fromRank === toRank
      ? "sideways"
      : toRank > fromRank
      ? "up"
      : "down";

  return {
    deal,
    fromStage,
    toStage,
    path: [...(fromStage ? [fromStage] : []), ...transitions.map((t) => t.stage)],
    transitions: transitions.map((t) => ({ stage: t.stage, at: t.activeFrom })),
    hops: transitions.length,
    movedAt: last.activeFrom,
    direction,
  };
}

function computeMovement(
  deals: DealRecord[],
  stageHistory: Record<string, StageHistoryEntry[]>,
  now: Date
): PipelineMovement {
  const created = deals.filter((d) => withinWindow(d.createdAt, now, MOVEMENT_WINDOW_DAYS));
  const createdIds = new Set(created.map((d) => d.id));

  const hasAnyHistory = Object.values(stageHistory).some((h) => h.length > 0);

  const moves = deals
    .filter((d) => !createdIds.has(d.id))
    .map((d) => buildStageMove(d, stageHistory[d.id], now))
    .filter((m): m is StageMove => m !== null);

  const won = moves.filter((m) => m.toStage === "Won 🎉");
  const lost = moves.filter((m) => m.toStage === "Lost");
  const movedStage = moves.filter((m) => !CLOSED_STAGES.includes(m.toStage as any));

  const valueOf = (list: StageMove[]) => sumValue(list.map((m) => m.deal));

  return {
    windowDays: MOVEMENT_WINDOW_DAYS,
    created,
    movedStage,
    won,
    lost,
    createdValue: sumValue(created),
    movedValue: valueOf(movedStage),
    wonValue: valueOf(won),
    lostValue: valueOf(lost),
    degraded: !hasAnyHistory,
  };
}

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Conversion and velocity per stage, from every transition in every deal's
 * real stage history. This is what makes "17d in Demo" meaningful — deals that
 * advanced out of Demo historically did so in N days.
 */
function computeStageBenchmarks(
  deals: DealRecord[],
  stageHistory: Record<string, StageHistoryEntry[]>,
  now: Date
): StageBenchmark[] {
  const acc = new Map<
    string,
    { entered: number; advanced: number; lostFrom: number; regressed: number; stillIn: number; advanceDays: number[] }
  >();
  const bucket = (stage: string) => {
    let b = acc.get(stage);
    if (!b) {
      b = { entered: 0, advanced: 0, lostFrom: 0, regressed: 0, stillIn: 0, advanceDays: [] };
      acc.set(stage, b);
    }
    return b;
  };

  for (const deal of deals) {
    const history = stageHistory[deal.id];
    if (!history || history.length === 0) continue;
    history.forEach((entry, i) => {
      const b = bucket(entry.stage);
      b.entered += 1;
      const next = history[i + 1];
      if (!next) {
        // Terminal stages are an outcome, not a queue — only open deals "sit" anywhere.
        if (!CLOSED_STAGES.includes(entry.stage as any)) b.stillIn += 1;
        return;
      }
      const dwell = daysBetween(new Date(next.activeFrom), new Date(entry.activeFrom));
      if (next.stage === "Lost") {
        b.lostFrom += 1;
      } else if ((STAGE_RANK[next.stage] ?? -1) > (STAGE_RANK[entry.stage] ?? -1)) {
        b.advanced += 1;
        b.advanceDays.push(dwell);
      } else {
        b.regressed += 1;
      }
    });
  }

  return STAGES.filter((s) => !CLOSED_STAGES.includes(s))
    .map((stage) => {
      const b = acc.get(stage);
      return {
        stage,
        entered: b?.entered ?? 0,
        advanced: b?.advanced ?? 0,
        lostFrom: b?.lostFrom ?? 0,
        regressed: b?.regressed ?? 0,
        stillIn: b?.stillIn ?? 0,
        medianDaysToAdvance: median(b?.advanceDays ?? []),
      };
    });
}

const STAGE_RANK: Record<string, number> = Object.fromEntries(
  STAGES.map((s, i) => [s, i])
);
const MAX_STAGE_RANK = STAGE_RANK["Won 🎉"];

/**
 * Scores stalled deals so the worst-first list is a short triage queue rather
 * than a dump of everything open. Weights mirror the original Pipeline Pulse
 * artifact: recency 0.25, value 0.25, stage 0.20, contact depth 0.15,
 * engagement 0.15.
 *
 * Recency is deliberately inverted — a deal that went quiet 5 days ago is a
 * better re-engagement candidate than one cold for 6 months.
 */
function rankStalledDeals(openDeals: DealRecord[], now: Date): RankedStalledDeal[] {
  return openDeals
    .filter((d) => isStalled(d, now))
    .map((deal) => {
      const lastActivity = deal.stageEnteredAt || deal.stageChangedAt || deal.createdAt;
      const daysSinceActivity = lastActivity
        ? Math.floor(daysBetween(now, new Date(lastActivity)))
        : 0;

      const recencyScore =
        daysSinceActivity <= 45 ? (45 - daysSinceActivity) / 45 : 0;
      const valueScore = deal.value ? Math.min(deal.value / 50000, 1) : 0.1;
      const stageScore =
        STAGE_RANK[deal.stage] !== undefined ? STAGE_RANK[deal.stage] / MAX_STAGE_RANK : 0;
      const contactCount = deal.personIds.length;
      const multiThreadScore = Math.min(contactCount / 3, 1);
      // The artifact weights deals that had real logged engagement then went
      // quiet. This app has no per-deal meeting/email history yet, so every
      // deal takes the same neutral 0.5 and the term drops out of the ordering.
      const wentQuietScore = 0.5;

      const score =
        recencyScore * 0.25 +
        valueScore * 0.25 +
        stageScore * 0.2 +
        multiThreadScore * 0.15 +
        wentQuietScore * 0.15;

      return { deal, daysSinceActivity, contactCount, score };
    })
    .sort((a, b) => b.score - a.score);
}

/** Computes the full dashboard payload from a raw Attio snapshot. Cached 3 min. */
export async function getComputedDealsResponse(
  forceRefresh = false
): Promise<DealsApiResponse> {
  if (!forceRefresh && computedCache && Date.now() - computedCache.timestamp < CACHE_TTL_MS) {
    return computedCache.data;
  }

  const snapshot = await getAttioSnapshot(forceRefresh);
  const { deals, people, members, stageHistory } = snapshot;
  const now = new Date();

  // Stage snapshot
  const stageSnapshot: Record<string, number> = {};
  const stageValues: Record<string, number> = {};
  for (const d of deals) {
    stageSnapshot[d.stage] = (stageSnapshot[d.stage] || 0) + 1;
    stageValues[d.stage] = (stageValues[d.stage] || 0) + (d.value || 0);
  }

  // Pipeline health
  const wonCount = deals.filter((d) => d.stage === "Won 🎉").length;
  const lostCount = deals.filter((d) => d.stage === "Lost").length;
  const openDeals = deals.filter((d) => !CLOSED_STAGES.includes(d.stage as any));
  const openCount = openDeals.length;
  const winRate = wonCount + lostCount > 0 ? wonCount / (wonCount + lostCount) : 0;
  const openPipelineValue = openDeals.reduce((sum, d) => sum + (d.value || 0), 0);
  const stalledRanked = rankStalledDeals(openDeals, now);
  const stalledDealsCount = stalledRanked.length;

  // Average dwell time per stage (for open deals currently in that stage)
  const dwellByStage = new Map<string, number[]>();
  for (const d of openDeals) {
    const dwell = stageDwellDays(d, now);
    if (dwell === null) continue;
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
      const dwell = stageDwellDays(d, now);

      if (isStalled(d, now)) {
        reasons.push({
          code: "no_next_call_stale",
          label: `No upcoming call and stage is stale (${STALE_STAGE_DAYS}+ days)`,
        });
      }
      // Zero contacts is a data-hygiene problem; one contact only matters once
      // the deal is far enough along that multi-threading is expected.
      if (d.personIds.length === 0) {
        reasons.push({
          code: "no_contacts",
          label: "No contacts associated with this deal",
        });
      } else if (d.personIds.length === 1 && MULTITHREAD_STAGES.includes(d.stage)) {
        reasons.push({
          code: "single_threaded",
          label: `Single-threaded — only one contact at "${d.stage}"`,
        });
      }
      const avgDwell = avgDwellByStage.get(d.stage);
      if (avgDwell && dwell !== null && dwell > avgDwell * 2) {
        reasons.push({
          code: "stage_stale_vs_avg",
          label: `In "${d.stage}" ${Math.round(dwell)}d vs avg ${Math.round(avgDwell)}d`,
        });
      }
      return { deal: d, reasons };
    })
    .filter((r) => r.reasons.length > 0)
    .sort(
      (a, b) =>
        b.reasons.length - a.reasons.length || (b.deal.value || 0) - (a.deal.value || 0)
    );

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
    stageValues,
    pipelineHealth: {
      winRate,
      openPipelineValue,
      stalledDealsCount,
      wonCount,
      lostCount,
      openCount,
    },
    atRiskDeals,
    movement: computeMovement(deals, stageHistory, now),
    stageBenchmarks: computeStageBenchmarks(deals, stageHistory, now),
    ownerPerformance,
    newConversations,
    deals,
  };

  computedCache = { data, timestamp: Date.now() };
  return data;
}

const TASK_WINDOW_DAYS = 7;

let tasksCache: { data: TasksApiResponse; timestamp: number } | null = null;

/**
 * Builds a deep link to a task in the Attio UI. The URL shape is
 * https://app.attio.com/<slug>/tasks?id=<task_id>&command-menu-page=task
 */
function taskUrl(taskId: string): string | null {
  const slug = process.env.ATTIO_WORKSPACE_SLUG;
  if (!slug) return null;
  return `https://app.attio.com/${slug}/tasks?id=${taskId}&command-menu-page=task`;
}

/**
 * Incomplete tasks due within the next week, plus anything already overdue —
 * an overdue task is more urgent than one due Friday, so hiding it would defeat
 * the point of the list.
 */
export async function getOpenTasks(forceRefresh = false): Promise<TasksApiResponse> {
  if (!forceRefresh && tasksCache && Date.now() - tasksCache.timestamp < CACHE_TTL_MS) {
    return tasksCache.data;
  }

  const [body, snapshot] = await Promise.all([
    attioFetch(`/tasks?limit=500&sort=created_at:desc`),
    getAttioSnapshot(),
  ]);

  const dealsById = new Map(snapshot.deals.map((d) => [d.id, d]));
  const membersById = new Map(snapshot.members.map((m) => [m.id, m]));

  // Tasks in this workspace almost never link to deals directly — of the open
  // tasks, most link to a person or a company. Resolve those links to a deal
  // through the deal's own associations, preferring open deals when a company
  // or person appears on several.
  const byCompany = new Map<string, DealRecord>();
  const byPerson = new Map<string, DealRecord>();
  const preferOpen = (map: Map<string, DealRecord>, key: string, deal: DealRecord) => {
    const existing = map.get(key);
    if (!existing || (CLOSED_STAGES.includes(existing.stage as any) && !CLOSED_STAGES.includes(deal.stage as any))) {
      map.set(key, deal);
    }
  };
  for (const d of snapshot.deals) {
    if (d.associatedCompanyId) preferOpen(byCompany, d.associatedCompanyId, d);
    for (const pid of d.personIds) preferOpen(byPerson, pid, d);
  }
  const resolveLinkedDeal = (linkedRecords: any[]): DealRecord | undefined => {
    for (const r of linkedRecords) {
      const direct = dealsById.get(r.target_record_id);
      if (direct) return direct;
    }
    for (const r of linkedRecords) {
      const viaCompany = byCompany.get(r.target_record_id);
      if (viaCompany) return viaCompany;
    }
    for (const r of linkedRecords) {
      const viaPerson = byPerson.get(r.target_record_id);
      if (viaPerson) return viaPerson;
    }
    return undefined;
  };

  const now = new Date();
  const horizon = new Date(now.getTime() + TASK_WINDOW_DAYS * 24 * 60 * 60 * 1000);

  const tasks: OpenTask[] = (body?.data || [])
    .filter((t: any) => !t.is_completed)
    .map((t: any) => {
      const id = t?.id?.task_id || t?.id;
      const deadlineAt = t.deadline_at || null;
      const deadline = deadlineAt ? new Date(deadlineAt) : null;
      const validDeadline = deadline && !Number.isNaN(deadline.getTime()) ? deadline : null;

      const linkedDeal = resolveLinkedDeal(t.linked_records || []);

      const assigneeNames = (t.assignees || [])
        .map((a: any) => membersById.get(a.referenced_actor_id)?.name)
        .filter(Boolean) as string[];

      return {
        id,
        content: (t.content_plaintext || "").trim() || "(no description)",
        deadlineAt: validDeadline ? validDeadline.toISOString() : null,
        assigneeNames,
        dealName: linkedDeal?.name ?? null,
        dealId: linkedDeal?.id ?? null,
        url: taskUrl(id),
        overdue: validDeadline ? validDeadline < now : false,
      };
    })
    // Undated tasks have no due pressure, so they stay out of a "next 7 days" list.
    .filter((t: OpenTask) => t.deadlineAt !== null && new Date(t.deadlineAt) <= horizon)
    .sort(
      (a: OpenTask, b: OpenTask) =>
        new Date(a.deadlineAt as string).getTime() -
        new Date(b.deadlineAt as string).getTime()
    );

  const data: TasksApiResponse = {
    cachedAt: new Date().toISOString(),
    tasks,
    overdueCount: tasks.filter((t) => t.overdue).length,
  };

  tasksCache = { data, timestamp: Date.now() };
  return data;
}

// ---------------------------------------------------------------------------
// Writes
//
// Everything above this line only reads. These two functions are the only code
// paths that mutate the live Attio workspace, so they are kept together and
// deliberately narrow: one writes a single free-text field, the other creates a
// new task. Neither deletes, and neither touches stage, value, or owner.
// ---------------------------------------------------------------------------

/** Invalidates the cached snapshots so the next read reflects a write. */
function invalidateCaches(): void {
  rawCache = null;
  computedCache = null;
  tasksCache = null;
  // The shared copy too, or a write would appear to have done nothing until
  // the revalidate window expired an hour later.
  try {
    revalidateTag("attio-snapshot");
  } catch {
    // Called outside a request scope (a script, a test) — nothing to drop.
  }
}

/**
 * Overwrites the `stall_notes` field on a deal. This replaces whatever is
 * there — callers should send the full intended text, not a fragment.
 */
export async function saveStallNote(dealId: string, note: string): Promise<void> {
  await attioFetch(`/objects/deals/records/${dealId}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: { values: { stall_notes: note } },
    }),
  });
  invalidateCaches();
}

/**
 * Moves a deal to a different stage. Attio records the transition in the
 * stage's historical values, so movement/benchmarks pick it up on next load.
 */
export async function updateDealStage(dealId: string, stage: string): Promise<void> {
  if (!STAGES.includes(stage as any)) {
    throw new Error(`"${stage}" is not a known stage`);
  }
  await attioFetch(`/objects/deals/records/${dealId}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: { values: { stage } },
    }),
  });
  invalidateCaches();
}

export interface CreateTaskInput {
  dealId: string;
  content: string;
  /** Days from now the task is due. */
  dueInDays?: number;
  assigneeIds?: string[];
}

/**
 * Creates an Attio task linked to the deal. Purely additive — it never
 * modifies or completes an existing task.
 */
export async function createDealTask({
  dealId,
  content,
  dueInDays = 3,
  assigneeIds = [],
}: CreateTaskInput): Promise<{ taskId: string | null; url: string | null }> {
  const deadline = new Date(Date.now() + dueInDays * 24 * 60 * 60 * 1000);

  const body = await attioFetch(`/tasks`, {
    method: "POST",
    body: JSON.stringify({
      data: {
        content,
        format: "plaintext",
        deadline_at: deadline.toISOString(),
        is_completed: false,
        linked_records: [{ target_object: "deals", target_record_id: dealId }],
        assignees: assigneeIds.map((id) => ({
          referenced_actor_type: "workspace-member",
          referenced_actor_id: id,
        })),
      },
    }),
  });

  invalidateCaches();
  const taskId = body?.data?.id?.task_id ?? null;
  return { taskId, url: taskId ? taskUrl(taskId) : null };
}

export interface UpdateTaskInput {
  taskId: string;
  /** Mark complete or reopen. */
  isCompleted?: boolean;
  /** New due date as an ISO string. */
  deadlineAt?: string;
}

/**
 * Updates a task's state. Attio's API rejects `content` on PATCH, so task
 * wording is immutable once created — only completion and deadline can change.
 */
export async function updateTask({
  taskId,
  isCompleted,
  deadlineAt,
}: UpdateTaskInput): Promise<void> {
  const data: Record<string, unknown> = {};
  if (typeof isCompleted === "boolean") data.is_completed = isCompleted;
  if (deadlineAt) data.deadline_at = deadlineAt;
  if (Object.keys(data).length === 0) {
    throw new Error("Nothing to update");
  }
  await attioFetch(`/tasks/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify({ data }),
  });
  invalidateCaches();
}

/** Permanently deletes a task. Irreversible — the UI confirms first. */
export async function deleteTask(taskId: string): Promise<void> {
  await attioFetch(`/tasks/${taskId}`, { method: "DELETE" });
  invalidateCaches();
}
