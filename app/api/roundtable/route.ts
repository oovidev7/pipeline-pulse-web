import { NextRequest, NextResponse } from "next/server";
import { getAttioSnapshot } from "@/lib/attio";

export const dynamic = "force-dynamic";

const CACHE_TTL_MS = 3 * 60 * 1000;

// The weekly round-table thread lives in the human sales channel, not the data
// channel. The bot must be invited there (/invite) before history is readable.
const DEFAULT_ROUNDTABLE_CHANNEL = "C0BNPM42UE4"; // #sentrum-sales

interface RoundtableReply {
  userId: string;
  name: string | null;
  text: string;
  ts: string;
}

interface RoundtableResponse {
  cachedAt: string;
  /** Set when the bot cannot read the channel — the UI shows setup steps. */
  needsInvite: boolean;
  found: boolean;
  prompt: string | null;
  postedAt: string | null;
  replies: RoundtableReply[];
  /** Attio member first names with no reply yet; null when names are unresolvable. */
  notReplied: string[] | null;
}

let cache: { data: RoundtableResponse; timestamp: number } | null = null;

async function slackGet(path: string): Promise<any> {
  const token = process.env.SLACK_BOT_TOKEN;
  const res = await fetch(`https://slack.com/api/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return res.json();
}

/** Resolves a Slack user id to a display name. Needs users:read; null without it. */
async function resolveName(userId: string): Promise<string | null> {
  const body = await slackGet(`users.info?user=${encodeURIComponent(userId)}`);
  if (!body.ok) return null;
  return body.user?.profile?.display_name || body.user?.real_name || null;
}

const empty = (needsInvite: boolean): RoundtableResponse => ({
  cachedAt: new Date().toISOString(),
  needsInvite,
  found: false,
  prompt: null,
  postedAt: null,
  replies: [],
  notReplied: null,
});

async function computeRoundtable(): Promise<RoundtableResponse> {
  const channel = process.env.SLACK_ROUNDTABLE_CHANNEL_ID || DEFAULT_ROUNDTABLE_CHANNEL;
  if (!process.env.SLACK_BOT_TOKEN) return empty(false);

  const history = await slackGet(
    `conversations.history?channel=${encodeURIComponent(channel)}&limit=30`
  );
  if (!history.ok) {
    // not_in_channel is the expected failure until the bot is invited.
    console.error(`[/api/roundtable] Slack error: ${history.error}`);
    return empty(history.error === "not_in_channel");
  }

  // Newest round-table prompt in the channel. Matches "round-table", "round
  // table", "roundtable" anywhere in the message.
  const parent = (history.messages || []).find((m: any) =>
    /round[\s-]?table/i.test(m.text || "")
  );
  if (!parent) return { ...empty(false), cachedAt: new Date().toISOString() };

  const repliesBody = await slackGet(
    `conversations.replies?channel=${encodeURIComponent(channel)}&ts=${parent.thread_ts || parent.ts}&limit=50`
  );
  const rawReplies: any[] = (repliesBody.ok ? repliesBody.messages || [] : []).slice(1);

  const replies: RoundtableReply[] = [];
  for (const r of rawReplies) {
    if (!r.user || !r.text) continue;
    replies.push({
      userId: r.user,
      name: await resolveName(r.user),
      text: r.text,
      ts: r.ts,
    });
  }

  // Who hasn't replied: compare resolved names against Attio workspace members.
  // Only meaningful when names resolved (users:read granted).
  let notReplied: string[] | null = null;
  if (replies.every((r) => r.name !== null)) {
    try {
      const { members } = await getAttioSnapshot();
      const replied = replies.map((r) => (r.name as string).toLowerCase());
      notReplied = members
        .map((m) => m.name.trim().split(/\s+/)[0])
        .filter(
          (first) =>
            !replied.some((rn) => rn.includes(first.toLowerCase()))
        );
    } catch {
      notReplied = null;
    }
  }

  return {
    cachedAt: new Date().toISOString(),
    needsInvite: false,
    found: true,
    prompt: parent.text || null,
    postedAt: parent.ts ? new Date(Number(parent.ts) * 1000).toISOString() : null,
    replies,
    notReplied,
  };
}

export async function GET(req: NextRequest) {
  const forceRefresh = req.nextUrl.searchParams.has("refresh");
  if (!forceRefresh && cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cache.data);
  }
  try {
    const data = await computeRoundtable();
    cache = { data, timestamp: Date.now() };
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[/api/roundtable] error", err);
    return NextResponse.json(empty(false));
  }
}
