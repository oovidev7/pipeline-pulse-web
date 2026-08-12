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
  attendeeEmails: string[];
  accountKey: string;
}

interface MatchedCall extends CalendarEvent {
  dealId: string;
  dealName: string;
}

interface CalendarResponse {
  cachedAt: string;
  matched: MatchedCall[];
  unmatched: CalendarEvent[];
}

let cache: { data: CalendarResponse; timestamp: number } | null = null;

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

  return items
    .filter((e: any) => e.status !== "cancelled")
    .map((e: any) => ({
      id: e.id,
      summary: e.summary || "(no title)",
      start: e.start?.dateTime || e.start?.date || null,
      end: e.end?.dateTime || e.end?.date || null,
      attendeeEmails: (e.attendees || []).map((a: any) => a.email).filter(Boolean),
      accountKey,
    }));
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

  // De-duplicate events that appear on both calendars (e.g. Ogi + Danny both invited).
  const seen = new Set<string>();
  const allEvents: CalendarEvent[] = [];
  for (const list of eventLists) {
    for (const ev of list) {
      const dedupeKey = `${ev.summary}|${ev.start}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      allEvents.push(ev);
    }
  }

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
    for (const attendee of ev.attendeeEmails) {
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

  return { cachedAt: new Date().toISOString(), matched, unmatched };
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
