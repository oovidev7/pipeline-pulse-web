import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CACHE_TTL_MS = 3 * 60 * 1000;

// Default channel reference: "#sentrum-pulse-data-v2". Set SLACK_CHANNEL_ID to
// that channel's ID (not name) in env vars.

interface SlackSnapshotResponse {
  cachedAt: string;
  latest: any | null;
  previous: any | null;
}

let cache: { data: SlackSnapshotResponse; timestamp: number } | null = null;

/** Strips a leading/trailing ```json ... ``` or ``` ... ``` fence if present. */
function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  return fenceMatch ? fenceMatch[1] : trimmed;
}

function tryParseSnapshot(text: string): any | null {
  try {
    const cleaned = stripCodeFence(text);
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === "object") return parsed;
    return null;
  } catch {
    return null;
  }
}

async function computeSlackSnapshots(): Promise<SlackSnapshotResponse> {
  const token = process.env.SLACK_BOT_TOKEN;
  const channel = process.env.SLACK_CHANNEL_ID;

  if (!token || !channel) {
    return { cachedAt: new Date().toISOString(), latest: null, previous: null };
  }

  const url = `https://slack.com/api/conversations.history?channel=${encodeURIComponent(
    channel
  )}&limit=50`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`[/api/slack] HTTP error ${res.status}`);
    return { cachedAt: new Date().toISOString(), latest: null, previous: null };
  }

  const body = await res.json();
  if (!body.ok) {
    console.error(`[/api/slack] Slack API error: ${body.error}`);
    return { cachedAt: new Date().toISOString(), latest: null, previous: null };
  }

  const messages: any[] = body.messages || [];
  // messages come back newest-first already
  const parsedSnapshots: any[] = [];
  for (const msg of messages) {
    const text = msg.text || "";
    const parsed = tryParseSnapshot(text);
    if (parsed) {
      parsedSnapshots.push(parsed);
    }
    if (parsedSnapshots.length >= 2) break;
  }

  return {
    cachedAt: new Date().toISOString(),
    latest: parsedSnapshots[0] || null,
    previous: parsedSnapshots[1] || null,
  };
}

export async function GET(req: NextRequest) {
  const forceRefresh = req.nextUrl.searchParams.has("refresh");

  if (!forceRefresh && cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cache.data);
  }

  try {
    const data = await computeSlackSnapshots();
    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[/api/slack] error", err);
    // Graceful degrade: return empty snapshot rather than erroring the page.
    return NextResponse.json({ cachedAt: new Date().toISOString(), latest: null, previous: null });
  }
}
