// Assembles the per-deal visibility map once, so the dashboard and the Slack
// digest always agree about what we can see. They previously shared the
// scoring function but not its inputs, which is exactly how a number on screen
// and a number in Slack drift apart.

import { getAttioSnapshot } from "./attio";
import { fetchNotes, groupNotesByDeal, DealNotes } from "./attio-notes";
import { computeVisibility, DealVisibility } from "./visibility";
import { PersonRecord } from "./types";

const CACHE_TTL_MS = 3 * 60 * 1000;

type Notes = Awaited<ReturnType<typeof fetchNotes>>;

let notesCache: { data: Notes; timestamp: number } | null = null;
/**
 * The in-flight fetch, shared by concurrent callers.
 *
 * Notes are a whole-workspace paginated read — dozens of requests. A plain
 * time cache does not help the first load, where several callers arrive at
 * once, all miss, and each start their own pagination; that multiplied the
 * request count enough to trip Attio's rate limit. Callers now await the same
 * promise, so the workspace is paginated once however many ask.
 */
let notesInFlight: Promise<Notes> | null = null;

async function getNotes(): Promise<Notes> {
  if (notesCache && Date.now() - notesCache.timestamp < CACHE_TTL_MS) {
    return notesCache.data;
  }
  if (notesInFlight) return notesInFlight;

  notesInFlight = fetchNotes()
    .then((data) => {
      notesCache = { data, timestamp: Date.now() };
      return data;
    })
    .finally(() => {
      // Cleared either way: a failure must not pin every later caller to it.
      notesInFlight = null;
    });

  return notesInFlight;
}

/** Latest past and earliest future calendar touch across a deal's contacts. */
function calendarFor(contacts: PersonRecord[]): {
  last: string | null;
  next: string | null;
} {
  let last: string | null = null;
  let next: string | null = null;
  for (const c of contacts) {
    if (c.lastCalendarInteraction && (!last || c.lastCalendarInteraction > last)) {
      last = c.lastCalendarInteraction;
    }
    if (c.nextCalendarInteraction && (!next || c.nextCalendarInteraction < next)) {
      next = c.nextCalendarInteraction;
    }
  }
  return { last, next };
}

export interface DealSignals {
  visibility: DealVisibility;
  notes: DealNotes;
}

/**
 * @param gmailLastContact deal id → Gmail's last-contact date, where the app
 *   has credentials for that mailbox. Optional: the cron has no per-request
 *   Gmail view and passes nothing.
 */
export async function getDealContext(
  gmailLastContact?: Map<string, string | null>
): Promise<Map<string, DealSignals>> {
  const [snapshot, notes] = await Promise.all([getAttioSnapshot(), getNotes()]);

  const byDeal = groupNotesByDeal(notes, snapshot.deals);
  const peopleById = new Map(snapshot.people.map((p) => [p.id, p]));

  const out = new Map<string, DealSignals>();
  for (const deal of snapshot.deals) {
    const contacts = deal.personIds
      .map((id) => peopleById.get(id))
      .filter((p): p is PersonRecord => Boolean(p));
    const cal = calendarFor(contacts);
    const dealNotes = byDeal.get(deal.id) ?? {
      all: [],
      lastConversation: null,
      channels: [],
    };

    out.set(deal.id, {
      notes: dealNotes,
      visibility: computeVisibility(deal, {
        notes: dealNotes,
        gmailLastContact: gmailLastContact?.get(deal.id) ?? null,
        lastCalendar: cal.last,
        nextCalendar: cal.next,
      }),
    });
  }
  return out;
}

/** Clears the notes cache so the next read reflects a write. */
export function invalidateNotesCache(): void {
  notesCache = null;
}
