import { NextRequest, NextResponse } from "next/server";
import { getComputedDealsResponse } from "@/lib/attio";
import { getAccessToken, getConfiguredGoogleAccounts, withTimeout } from "@/lib/google-auth";

export const dynamic = "force-dynamic";

const CACHE_TTL_MS = 3 * 60 * 1000;

interface CalendarEvent {
  id: string;
  summary: string;
  start: string | null;
  end: string | null;
  /** True when Google gave a date-only value (an all-day event, so no meaningful clock time). */
  allDay: boolean;
  attendeeEmails: string[];
  /** External (non-internal) attendees only — the people who make this a client call. */
  externalEmails: string[];
  accountKey: string;
  /** Display name(s) of the calendar owner(s) this event came from. */
  owners: string[];
}

interface MatchedCall extends CalendarEvent {
  dealId: string;
  dealName: string;
}

interface CalendarResponse {
  cachedAt: string;
  matched: MatchedCall[];
  unmatched: CalendarEvent[];
  /** Client calls kept after dropping internal-only events, and how many were dropped. */
  internalFilteredCount: number;
}

let cache: { data: CalendarResponse; timestamp: number } | null = null;

/**
 * Domains that count as "us". An event whose only attendees are on these
 * domains is internal (standups, 5-a-side, office) and is not a client call.
 */
function internalDomains(): Set<string> {
  const configured = (process.env.INTERNAL_EMAIL_DOMAINS || "")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  return new Set(
    configured.length > 0 ? configured : ["gingersambasports.com", "sentrum.ai"]
  );
}

function domainOf(email: string): string | null {
  const at = email.lastIndexOf("@");
  return at === -1 ? null : email.slice(at + 1).toLowerCase();
}

const ACCOUNT_LABELS: Record<string, string> = {
  ogi: "Ogi",
  danny: "Danny",
  default: "Shared",
};

function accountLabel(key: string): string {
  return ACCOUNT_LABELS[key] || key;
}

async function fetchEventsForAccount(accessToken: string, accountKey: string): Promise<CalendarEvent[]> {
  const timeMin = new Date().toISOString();
  const timeMax = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const url =
    `https://www.googleapis.com/calendar/v3/calendars/primary/events` +
    `?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}` +
    `&singleEvents=true&orderBy=startTime&maxResults=100`;

  const res = await withTimeout(
    fetch(url, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" }),
    8000,
    `calendar list for ${accountKey}`
  );
  if (!res.ok) {
    throw new Error(`Calendar request failed (${res.status}) for ${accountKey}`);
  }
  const body = await res.json();
  const items = body?.items || [];

  const internal = internalDomains();

  return items
    .filter((e: any) => e.status !== "cancelled")
    .map((e: any) => {
      // A date-only value is an all-day event. Keep the flag so the UI renders a
      // date instead of inventing a clock time — `new Date("2026-08-13")` parses
      // as UTC midnight, which previously displayed as "01:00" in BST.
      const allDay = Boolean(e.start?.date && !e.start?.dateTime);
      const attendeeEmails: string[] = (e.attendees || [])
        .map((a: any) => a.email)
        .filter(Boolean);
      const externalEmails = attendeeEmails.filter((email) => {
        const dom = domainOf(email);
        return dom !== null && !internal.has(dom);
      });

      return {
        id: e.id,
        summary: e.summary || "(no title)",
        start: e.start?.dateTime || e.start?.date || null,
        end: e.end?.dateTime || e.end?.date || null,
        allDay,
        attendeeEmails,
        externalEmails,
        accountKey,
        owners: [accountLabel(accountKey)],
      };
    });
}

async function computeCalendar(): Promise<CalendarResponse> {
  const accounts = getConfiguredGoogleAccounts();
  const dealsData = await getComputedDealsResponse();

  const eventLists = await Promise.all(
    accounts.map(async (account) => {
      try {
        const token = await getAccessToken(account);
        return await fetchEventsForAccount(token, account.key);
      } catch (err) {
        console.error(`[/api/calendar] failed for account ${account.key}`, err);
        return [] as CalendarEvent[];
      }
    })
  );

  // Merge events that appear on both calendars (e.g. Ogi + Danny both invited).
  // Merging rather than dropping the duplicate keeps both owners and the union
  // of attendees, since the two copies of an invite can differ slightly.
  const eventGroups = new Map<string, CalendarEvent>();
  for (const list of eventLists) {
    for (const ev of list) {
      const dedupeKey = `${ev.summary}|${ev.start}`;
      const existing = eventGroups.get(dedupeKey);
      if (!existing) {
        eventGroups.set(dedupeKey, { ...ev });
        continue;
      }
      for (const email of ev.attendeeEmails) {
        if (!existing.attendeeEmails.includes(email)) existing.attendeeEmails.push(email);
      }
      for (const email of ev.externalEmails) {
        if (!existing.externalEmails.includes(email)) existing.externalEmails.push(email);
      }
      for (const owner of ev.owners) {
        if (!existing.owners.includes(owner)) existing.owners.push(owner);
      }
    }
  }

  // Only events with at least one external attendee are client calls. Internal-only
  // events (standups, office days, personal appointments) are not pipeline signal.
  const mergedEvents = [...eventGroups.values()];
  const allEvents = mergedEvents.filter((ev) => ev.externalEmails.length > 0);
  const internalFilteredCount = mergedEvents.length - allEvents.length;

  // Build a lookup of contact email -> deal for matching.
  const emailToDeal = new Map<string, { id: string; name: string }>();
  for (const deal of dealsData.deals) {
    for (const email of deal.personEmails) {
      emailToDeal.set(email.toLowerCase(), { id: deal.id, name: deal.name });
    }
  }

  const matched: MatchedCall[] = [];
  const unmatched: CalendarEvent[] = [];

  for (const ev of allEvents) {
    let matchedDeal: { id: string; name: string } | null = null;
    // Match on external attendees only — an internal colleague on the invite
    // should never be what links a call to a deal.
    for (const attendee of ev.externalEmails) {
      const found = emailToDeal.get(attendee.toLowerCase());
      if (found) {
        matchedDeal = found;
        break;
      }
    }
    if (matchedDeal) {
      matched.push({ ...ev, dealId: matchedDeal.id, dealName: matchedDeal.name });
    } else {
      unmatched.push(ev);
    }
  }

  return { cachedAt: new Date().toISOString(), matched, unmatched, internalFilteredCount };
}

export async function GET(req: NextRequest) {
  const forceRefresh = req.nextUrl.searchParams.has("refresh");

  if (!forceRefresh && cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cache.data);
  }

  try {
    const data = await computeCalendar();
    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[/api/calendar] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load calendar events" },
      { status: 500 }
    );
  }
}
