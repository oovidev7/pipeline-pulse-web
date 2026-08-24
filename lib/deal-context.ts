// Assembles the per-deal visibility map once, so the dashboard and the Slack
// digest always agree about what we can see. They previously shared the
// scoring function but not its inputs, which is exactly how a number on screen
// and a number in Slack drift apart.

import { getAttioSnapshot } from "./attio";
import { fetchNotes, groupNotesByDeal, DealNotes } from "./attio-notes";
import { fetchMeetings, attachDeals, AttioMeeting } from "./attio-meetings";
import { computeVisibility, DealVisibility } from "./visibility";
import { PersonRecord } from "./types";

const CACHE_TTL_MS = 3 * 60 * 1000;

/**
 * Caches a whole-workspace paginated read, sharing the in-flight promise.
 *
 * Notes and meetings are each dozens of requests — meetings is ~56 against
 * 2,750 records. A plain time cache does not help the first load, where
 * several callers arrive at once, all miss, and each start their own
 * pagination; that multiplied the request count enough to trip Attio's rate
 * limit. Callers now await the same promise, so the workspace is paginated
 * once however many ask.
 */
function cachedFetch<T>(load: () => Promise<T>) {
  let cache: { data: T; timestamp: number } | null = null;
  let inFlight: Promise<T> | null = null;

  const get = async (): Promise<T> => {
    if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) return cache.data;
    if (inFlight) return inFlight;

    inFlight = load()
      .then((data) => {
        cache = { data, timestamp: Date.now() };
        return data;
      })
      .finally(() => {
        // Cleared either way: a failure must not pin every later caller to it.
        inFlight = null;
      });

    return inFlight;
  };

  return { get, invalidate: () => { cache = null; } };
}

const notesStore = cachedFetch(fetchNotes);
const meetingsStore = cachedFetch(fetchMeetings);

/** Every meeting, deal-attributed. Exported for the metrics view. */
export async function getMeetings(): Promise<AttioMeeting[]> {
  const [snapshot, meetings] = await Promise.all([
    getAttioSnapshot(),
    meetingsStore.get(),
  ]);
  return attachDeals(meetings, snapshot.deals);
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
  /** Calls held with this deal's company, newest first. */
  meetings: AttioMeeting[];
}

/**
 * @param gmailLastContact deal id → Gmail's last-contact date, where the app
 *   has credentials for that mailbox. Optional: the cron has no per-request
 *   Gmail view and passes nothing.
 */
export async function getDealContext(
  gmailLastContact?: Map<string, string | null>
): Promise<Map<string, DealSignals>> {
  const [snapshot, notes, rawMeetings] = await Promise.all([
    getAttioSnapshot(),
    notesStore.get(),
    // Meetings must never be the reason the dashboard fails: without them the
    // picture is poorer, but every other signal still stands.
    meetingsStore.get().catch((err) => {
      console.error("[deal-context] meetings unavailable", err);
      return [] as AttioMeeting[];
    }),
  ]);

  const byDeal = groupNotesByDeal(notes, snapshot.deals);
  const peopleById = new Map(snapshot.people.map((p) => [p.id, p]));

  const now = new Date().toISOString();
  const meetingsByDeal = new Map<string, AttioMeeting[]>();
  for (const m of attachDeals(rawMeetings, snapshot.deals)) {
    if (!m.dealId) continue;
    const arr = meetingsByDeal.get(m.dealId) || [];
    arr.push(m);
    meetingsByDeal.set(m.dealId, arr);
  }
  for (const arr of meetingsByDeal.values()) {
    arr.sort((a, b) => b.startsAt.localeCompare(a.startsAt));
  }

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

    const dealMeetings = meetingsByDeal.get(deal.id) ?? [];

    out.set(deal.id, {
      notes: dealNotes,
      meetings: dealMeetings,
      visibility: computeVisibility(deal, {
        notes: dealNotes,
        gmailLastContact: gmailLastContact?.get(deal.id) ?? null,
        lastCalendar: cal.last,
        nextCalendar: cal.next,
        lastMeeting: dealMeetings.find((m) => m.startsAt <= now)?.startsAt ?? null,
        // Sorted newest-first, so the *last* future entry is the soonest one.
        nextMeeting:
          [...dealMeetings].reverse().find((m) => m.startsAt > now)?.startsAt ?? null,
      }),
    });
  }
  return out;
}

/** Clears the notes cache so the next read reflects a write. */
export function invalidateNotesCache(): void {
  notesStore.invalidate();
  meetingsStore.invalidate();
}
