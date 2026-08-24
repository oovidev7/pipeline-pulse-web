// Meetings from Attio — the record of calls actually held.
//
// This is the source that finally sees FC Copenhagen. Its trial calls run
// through people who were never linked as contacts on the deal, so per-person
// interaction data misses them entirely and the deal read as silent while it
// was having calls every fortnight.
//
// Two API quirks, both of which fail silently:
//   1. `offset` is ignored. Every page returns the same rows — an offset loop
//      looks like thousands of meetings and is one page repeated. Use the
//      cursor from `pagination.next_cursor`.
//   2. Results run oldest-first and include future recurring instances, out to
//      2040 on this workspace. "Calls held" must bound on start <= now.

import { attioFetch } from "./attio";

/** Who a meeting was with, which decides which metric it belongs to. */
export type MeetingKind =
  /** No external attendee: team syncs, standups. */
  | "internal"
  /** A club we have an open deal with. */
  | "client"
  /** VCs, advisory, multi-club groups, intermediaries — real work, not pipeline. */
  | "ecosystem"
  /** External attendee Attio could not match to any company (personal email). */
  | "unmatched";

export interface AttioMeeting {
  id: string;
  title: string;
  /** ISO start. Meetings without one are dropped — they cannot be placed in time. */
  startsAt: string;
  /** Company records Attio linked, in order. */
  companyIds: string[];
  externalEmails: string[];
  kind: MeetingKind;
  /** Deal this meeting belongs to, resolved via the linked company. */
  dealId: string | null;
}

/**
 * Domains that make an attendee one of us. Configurable because a hardcoded
 * list silently reclassifies every internal meeting as a client call the day
 * the company changes domain.
 */
function internalPattern(): RegExp {
  const raw = process.env.INTERNAL_EMAIL_DOMAINS || "gingersamba,gingersambasports,sentrum";
  const alts = raw
    .split(",")
    .map((s) => s.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .filter(Boolean)
    .join("|");
  return new RegExp(`@(${alts})`, "i");
}

const PAGE = 50;
/** ~2,750 meetings on this workspace at 50/page; this is headroom, not a target. */
const MAX_PAGES = 200;

export async function fetchMeetings(): Promise<AttioMeeting[]> {
  const raw: any[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const q = `/meetings?limit=${PAGE}${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`;
    const body = await attioFetch(q);
    const rows: any[] = body?.data ?? [];
    raw.push(...rows);

    cursor = body?.pagination?.next_cursor;
    // No cursor means the end. Guarding on rows.length alone would loop
    // forever against the offset-style paging this endpoint does not do.
    if (!cursor || rows.length === 0) break;
  }

  const internal = internalPattern();

  return raw
    .map((m): AttioMeeting | null => {
      const startsAt: string | undefined = m?.start?.datetime;
      if (!startsAt) return null;

      const emails: string[] = (m?.participants ?? [])
        .map((p: any) => p?.email_address)
        .filter(Boolean);
      const externalEmails = emails.filter((e) => !internal.test(e));
      const companyIds: string[] = (m?.linked_records ?? [])
        .map((r: any) => r?.record_id)
        .filter(Boolean);

      return {
        id: m?.id?.meeting_id ?? String(m?.id),
        title: m?.title ?? "",
        startsAt,
        companyIds,
        externalEmails,
        // Refined to client/ecosystem once deals are known; see attachDeals.
        kind: externalEmails.length === 0 ? "internal" : companyIds.length === 0 ? "unmatched" : "ecosystem",
        dealId: null,
      };
    })
    .filter((m): m is AttioMeeting => m !== null);
}

/**
 * Resolves each meeting to a deal through its linked company, promoting
 * "ecosystem" to "client" where one is found.
 *
 * Only ~31 of 367 recent meetings reach a deal's company. That is not a
 * matching failure: 195 are internal and 109 are genuine ecosystem work — VCs,
 * advisory firms, multi-club groups — which are worth counting separately
 * rather than discarding.
 */
export function attachDeals(
  meetings: AttioMeeting[],
  deals: { id: string; associatedCompanyId: string | null }[]
): AttioMeeting[] {
  const dealByCompany = new Map<string, string>();
  for (const d of deals) {
    // First deal wins where a company has several; meeting attribution cannot
    // choose between them and picking arbitrarily beats dropping the signal.
    if (d.associatedCompanyId && !dealByCompany.has(d.associatedCompanyId)) {
      dealByCompany.set(d.associatedCompanyId, d.id);
    }
  }

  return meetings.map((m) => {
    if (m.kind === "internal" || m.kind === "unmatched") return m;
    const dealId = m.companyIds.map((c) => dealByCompany.get(c)).find(Boolean) ?? null;
    return dealId ? { ...m, dealId, kind: "client" as const } : m;
  });
}

/** Meetings that have already happened, newest first. */
export function held(meetings: AttioMeeting[], since?: string): AttioMeeting[] {
  const now = new Date().toISOString();
  return meetings
    .filter((m) => m.startsAt <= now && (!since || m.startsAt >= since))
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
}

/** Meetings still ahead — a booked call means the deal is alive. */
export function upcoming(meetings: AttioMeeting[]): AttioMeeting[] {
  const now = new Date().toISOString();
  return meetings
    .filter((m) => m.startsAt > now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
