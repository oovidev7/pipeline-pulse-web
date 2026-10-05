// The outbound agent's own record of each club it is working.
//
// The agent keeps one JSON "Outbound (agent) state" note per club on the
// club's company record: who it is writing to, the channel plan, and each
// touch drafted, approved (in Slack) and sent. Superseded versions stay on the
// record with "(…, superseded …)" in the title; the newest current one wins.
// Read here so the founder-led outreach test can be judged on what happened:
// touches sent, then replies and calls.
//
// The list keeps growing — the agent feeds new clubs in constantly — so clubs
// are read several at a time, every page of notes is read (Attio returns them
// oldest first, and each state update adds one), and a club that fails on its
// own is counted as failed rather than emptying the whole list.

import { unstable_cache } from "next/cache";
import { attioFetch } from "./attio";
import { runWithConcurrency } from "./google-auth";

export interface OutboundTouch {
  n: number;
  channel: string;
  draftedAt: string | null;
  approvedAt: string | null;
  sentAt: string | null;
}

export interface OutboundState {
  companyId: string;
  club: string;
  contactName: string | null;
  contactRole: string | null;
  status: string;
  channelPlan: string[];
  touches: OutboundTouch[];
  /** The agent's own record of a reply / meeting, when it has one. */
  repliedAt: string | null;
  meetingAt: string | null;
  /** When the club was added to the outbound list. */
  addedAt: string | null;
}

export interface OutboundRead {
  states: OutboundState[];
  /** Clubs on the list whose state couldn't be read. */
  failed: number;
}

const LIST = "outbound_agent";
const NOTES_PAGE = 50;
const CONCURRENCY = 6;

/** Strings stay strings; epoch numbers become ISO; anything else is null. */
function str(v: unknown): string | null {
  if (typeof v === "string" && v.trim()) return v;
  if (typeof v === "number" && Number.isFinite(v)) return new Date(v).toISOString();
  return null;
}

async function readClub(companyId: string, addedAt: string | null): Promise<OutboundState | null> {
  const notes: any[] = [];
  for (let offset = 0; offset < 2000; offset += NOTES_PAGE) {
    const page = await attioFetch(
      `/notes?parent_object=companies&parent_record_id=${companyId}&limit=${NOTES_PAGE}&offset=${offset}`
    );
    const rows: any[] = page?.data ?? [];
    notes.push(...rows);
    if (rows.length < NOTES_PAGE) break;
  }
  const current = notes
    .filter(
      (n) => /^Outbound \(agent\) state/i.test(n?.title ?? "") && !/superseded/i.test(n?.title ?? "")
    )
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))[0];
  if (!current) return null;

  let s: any;
  try {
    s = JSON.parse(current.content_plaintext ?? "");
  } catch {
    return null; // A half-written state is skipped, not guessed at.
  }
  if (!s || typeof s !== "object" || Array.isArray(s)) return null;

  const plan: string[] = Array.isArray(s.channelplan)
    ? s.channelplan.filter((c: unknown): c is string => typeof c === "string")
    : [];
  const touches = (Array.isArray(s.touches) ? s.touches : [])
    .filter((t: unknown) => t && typeof t === "object")
    .map((t: any) => {
      const n = Number(t.n) || 0;
      return {
        n,
        channel: str(t.channel) ?? plan[Math.max(n, 1) - 1] ?? "unknown",
        draftedAt: str(t.draftedat),
        approvedAt: str(t.approvedat),
        sentAt: str(t.sentat),
      };
    });
  return {
    companyId,
    club: str(s.club) ?? "Unknown club",
    contactName: str(s.contact?.name),
    contactRole: str(s.contact?.role),
    status: str(s.status) ?? "unknown",
    channelPlan: plan,
    touches,
    repliedAt: str(s.repliedat),
    meetingAt: str(s.meetingat),
    addedAt,
  };
}

export async function fetchOutboundStates(): Promise<OutboundRead> {
  const entries: any[] = [];
  for (let offset = 0; offset < 5000; offset += 100) {
    const body = await attioFetch(`/lists/${LIST}/entries/query`, {
      method: "POST",
      body: JSON.stringify({ limit: 100, offset }),
    });
    const rows = body?.data ?? [];
    entries.push(...rows);
    if (rows.length < 100) break;
  }

  const jobs = entries
    .map((e) => ({ companyId: e?.parent_record_id as string, addedAt: str(e?.created_at) }))
    .filter((j) => j.companyId);
  let failed = 0;
  const results = await runWithConcurrency(jobs, CONCURRENCY, async (j) => {
    try {
      return await readClub(j.companyId, j.addedAt);
    } catch (err: any) {
      failed += 1;
      console.error(`[outbound] ${j.companyId}:`, err?.message ?? err);
      return null;
    }
  });
  return { states: results.filter((r): r is OutboundState => Boolean(r)), failed };
}

/** Cached for an hour; the page's refresh clears the "outbound-states" tag. */
export const getOutboundStates = unstable_cache(fetchOutboundStates, ["outbound-states-v2"], {
  revalidate: 3600,
  tags: ["outbound-states"],
});
