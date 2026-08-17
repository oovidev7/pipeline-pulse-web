// Shared Slack payload reader — used by /api/slack for the dashboard and by
// the alerts cron, which needs the same parsed payloads server-side.

export interface SlackSnapshotResponse {
  cachedAt: string;
  latest: any | null;
  previous: any | null;
  /** Every PULSE_DATA snapshot found, oldest first — the trend chart's source. */
  history: any[];
  /** Newest MARKET_SIGNALS payload, posted weekly by the Monday research agent. */
  marketSignals: any | null;
  /** Newest CALL_BRIEFS payload, posted weekly by the same agent. */
  callBriefs: any | null;
  /**
   * Newest MEETING_NOTES payload — per-club Granola meeting summaries. The
   * web app has no Granola API access, so the weekly agent is the bridge:
   * it reads Granola via its connector and posts the digest here.
   */
  meetingNotes: any | null;
}

const CACHE_TTL_MS = 3 * 60 * 1000;

let cache: { data: SlackSnapshotResponse; timestamp: number } | null = null;

/**
 * The weekly agent posts tagged payloads to one channel, each a header line
 * followed by a fenced JSON block:
 *
 *   PULSE_DATA | week_of: 2026-08-11
 *   ```{ "week_of": ... }```
 *
 * so the fence has to be extracted from anywhere in the message, and each tag
 * read separately.
 */
const SNAPSHOT_TAG = "PULSE_DATA";
const MARKET_SIGNALS_TAG = "MARKET_SIGNALS";
const CALL_BRIEFS_TAG = "CALL_BRIEFS";
const MEETING_NOTES_TAG = "MEETING_NOTES";

function extractJsonBlock(text: string): string | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenced) return fenced[1];
  // Fall back to a bare object spanning the message (older, untagged posts).
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  return start !== -1 && end > start ? text.slice(start, end + 1) : null;
}

function tryParseSnapshot(text: string): any | null {
  try {
    const block = extractJsonBlock(text);
    if (!block) return null;
    const parsed = JSON.parse(block);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
}

const empty = (): SlackSnapshotResponse => ({
  cachedAt: new Date().toISOString(),
  latest: null,
  previous: null,
  history: [],
  marketSignals: null,
  callBriefs: null,
  meetingNotes: null,
});

async function computeSlackSnapshots(): Promise<SlackSnapshotResponse> {
  const token = process.env.SLACK_BOT_TOKEN;
  const channel = process.env.SLACK_CHANNEL_ID;

  if (!token || !channel) return empty();

  const url = `https://slack.com/api/conversations.history?channel=${encodeURIComponent(
    channel
  )}&limit=50`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`[slack-data] HTTP error ${res.status}`);
    return empty();
  }

  const body = await res.json();
  if (!body.ok) {
    console.error(`[slack-data] Slack API error: ${body.error}`);
    return empty();
  }

  const messages: any[] = body.messages || [];

  // Messages come back newest-first. Each tag is collected separately so a
  // CALL_BRIEFS or MARKET_SIGNALS post can never be mistaken for snapshot data.
  const byTag = (tag: string): any[] => {
    const out: any[] = [];
    // A week can be posted more than once (re-runs, corrections). Keep only the
    // newest post per week_of — otherwise a duplicate becomes the "previous"
    // week and every delta reads as a false "flat vs last week".
    const seenWeeks = new Set<string>();
    for (const msg of messages) {
      const text: string = msg.text || "";
      if (!text.trimStart().startsWith(tag)) continue;
      const parsed = tryParseSnapshot(text);
      if (!parsed) continue;
      const week = typeof parsed.week_of === "string" ? parsed.week_of : null;
      if (week) {
        if (seenWeeks.has(week)) continue;
        seenWeeks.add(week);
      }
      out.push(parsed);
    }
    return out;
  };

  const parsedSnapshots = byTag(SNAPSHOT_TAG);

  return {
    cachedAt: new Date().toISOString(),
    latest: parsedSnapshots[0] || null,
    previous: parsedSnapshots[1] || null,
    // Oldest first so the trend chart reads left-to-right in time order.
    history: [...parsedSnapshots].reverse(),
    marketSignals: byTag(MARKET_SIGNALS_TAG)[0] || null,
    callBriefs: byTag(CALL_BRIEFS_TAG)[0] || null,
    meetingNotes: byTag(MEETING_NOTES_TAG)[0] || null,
  };
}

/** Cached accessor. Failures degrade to an empty payload, never a throw. */
export async function getSlackData(forceRefresh = false): Promise<SlackSnapshotResponse> {
  if (!forceRefresh && cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }
  try {
    const data = await computeSlackSnapshots();
    cache = { data, timestamp: Date.now() };
    return data;
  } catch (err) {
    console.error("[slack-data] error", err);
    return empty();
  }
}
