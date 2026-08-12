import { NextRequest, NextResponse } from "next/server";
import { getComputedDealsResponse } from "@/lib/attio";
import {
  getAccessToken,
  getConfiguredGoogleAccounts,
  runWithConcurrency,
  withTimeout,
} from "@/lib/google-auth";

export const dynamic = "force-dynamic";

const CACHE_TTL_MS = 3 * 60 * 1000;
const CONCURRENCY = 6;
const PER_REQUEST_TIMEOUT_MS = 8000;

interface ContactActivityEntry {
  dealId: string;
  dealName: string;
  email: string;
  lastContactDate: string | null;
  direction: "ours" | "theirs" | null;
  snippet: string | null;
}

interface ContactActivityResponse {
  cachedAt: string;
  entries: ContactActivityEntry[];
  followUpsNeeded: ContactActivityEntry[];
}

let cache: { data: ContactActivityResponse; timestamp: number } | null = null;

async function gmailFetch(accessToken: string, path: string) {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Gmail request failed (${res.status}): ${path}`);
  }
  return res.json();
}

function getHeader(headers: any[], name: string): string | null {
  const h = headers?.find((x: any) => x.name?.toLowerCase() === name.toLowerCase());
  return h?.value || null;
}

/**
 * Searches Gmail for the newest message to/from a given email address, and
 * determines whether the sales team sent the last message or the contact did.
 */
async function fetchLastMessageForEmail(
  accessToken: string,
  ourEmailDomainHints: string[],
  email: string
): Promise<{ lastContactDate: string | null; direction: "ours" | "theirs" | null; snippet: string | null }> {
  const query = `from:${email} OR to:${email}`;
  const listBody = await withTimeout(
    gmailFetch(accessToken, `/messages?q=${encodeURIComponent(query)}&maxResults=1`),
    PER_REQUEST_TIMEOUT_MS,
    `gmail list for ${email}`
  );

  const messages = listBody?.messages || [];
  if (messages.length === 0) {
    return { lastContactDate: null, direction: null, snippet: null };
  }

  const msgId = messages[0].id;
  const msg = await withTimeout(
    gmailFetch(accessToken, `/messages/${msgId}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`),
    PER_REQUEST_TIMEOUT_MS,
    `gmail get for ${email}`
  );

  const headers = msg?.payload?.headers || [];
  const from = getHeader(headers, "From") || "";
  const dateHeader = getHeader(headers, "Date");
  const internalDate = msg?.internalDate ? new Date(Number(msg.internalDate)).toISOString() : null;
  const lastContactDate = internalDate || (dateHeader ? new Date(dateHeader).toISOString() : null);

  const fromIsUs = ourEmailDomainHints.some((hint) => from.toLowerCase().includes(hint.toLowerCase()));
  const direction: "ours" | "theirs" = fromIsUs ? "ours" : "theirs";

  return { lastContactDate, direction, snippet: msg?.snippet || null };
}

async function computeContactActivity(): Promise<ContactActivityResponse> {
  const accounts = getConfiguredGoogleAccounts();
  if (accounts.length === 0) {
    return { cachedAt: new Date().toISOString(), entries: [], followUpsNeeded: [] };
  }
  const account = accounts[0];
  const accessToken = await getAccessToken(account);

  const dealsData = await getComputedDealsResponse();
  const deals = dealsData.deals.filter((d) => d.personEmails.length > 0);

  // Rough heuristic for "sent by us": our workspace member emails' domain(s).
  // Falls back to matching against the configured Google account addresses if needed.
  const ourDomainHints = ["sentrum"];

  const jobs = deals.map((d) => ({ deal: d, email: d.personEmails[0] }));

  const results = await runWithConcurrency(jobs, CONCURRENCY, async (job) => {
    try {
      const result = await fetchLastMessageForEmail(accessToken, ourDomainHints, job.email);
      return {
        dealId: job.deal.id,
        dealName: job.deal.name,
        email: job.email,
        ...result,
      } as ContactActivityEntry;
    } catch (err) {
      return {
        dealId: job.deal.id,
        dealName: job.deal.name,
        email: job.email,
        lastContactDate: null,
        direction: null,
        snippet: null,
      } as ContactActivityEntry;
    }
  });

  const entries = results.filter(Boolean) as ContactActivityEntry[];

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const followUpsNeeded = entries.filter((e) => {
    if (e.direction !== "ours" || !e.lastContactDate) return false;
    const age = now - new Date(e.lastContactDate).getTime();
    return age >= 0 && age <= sevenDaysMs;
  });

  return { cachedAt: new Date().toISOString(), entries, followUpsNeeded };
}

export async function GET(req: NextRequest) {
  const forceRefresh = req.nextUrl.searchParams.has("refresh");

  if (!forceRefresh && cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cache.data);
  }

  try {
    const data = await computeContactActivity();
    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[/api/contact-activity] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load Gmail contact activity" },
      { status: 500 }
    );
  }
}
