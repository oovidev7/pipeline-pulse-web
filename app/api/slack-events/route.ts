import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { handleThreadReply } from "@/lib/capture";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Slack Events API receiver — the instant half of the capture loop.
 *
 * Slack pushes every message in channels the bot belongs to; replies inside an
 * open ask thread are written back to Attio the moment they arrive, instead of
 * waiting for the hourly cron. The cron stays as the safety net for anything
 * this misses (downtime, a dropped event).
 *
 * Runs entirely on Vercel: nobody's laptop is involved.
 */

/** Reject events older than this — the standard Slack replay-attack guard. */
const MAX_SKEW_SECONDS = 300;

function verifySignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.SLACK_SIGNING_SECRET;
  if (!secret) return false;

  const timestamp = req.headers.get("x-slack-request-timestamp") ?? "";
  const given = req.headers.get("x-slack-signature") ?? "";
  if (!timestamp || !given) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > MAX_SKEW_SECONDS) {
    return false;
  }

  const expected =
    "v0=" +
    createHmac("sha256", secret).update(`v0:${timestamp}:${rawBody}`).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(given));
  } catch {
    return false; // length mismatch
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  if (!process.env.SLACK_SIGNING_SECRET) {
    // Setup-order guard: without the secret nothing can be authenticated, and
    // processing unsigned events would let anyone who finds the URL write
    // into Attio. 503 rather than 401 so Slack's config check shows a clear
    // "endpoint not ready" instead of appearing misconfigured.
    console.error("[slack-events] SLACK_SIGNING_SECRET not set");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Slack's one-time endpoint verification happens before any signing-secret
  // mismatch would be obvious, so verify the signature for it too — a correct
  // secret is exactly what this handshake should prove.
  if (!verifySignature(req, rawBody)) {
    return NextResponse.json({ error: "Bad signature" }, { status: 401 });
  }
  if (body.type === "url_verification") {
    return NextResponse.json({ challenge: body.challenge });
  }

  // Slack retries on slow responses; the original request is still being
  // processed, so a retry acknowledged and dropped is the correct dedupe.
  if (req.headers.get("x-slack-retry-num")) {
    return NextResponse.json({ ok: true, retry: "ignored" });
  }

  const event = body.event;
  const isReply =
    body.type === "event_callback" &&
    event?.type === "message" &&
    !event.bot_id &&
    !event.subtype && // edits/deletes arrive as subtypes; only fresh messages count
    event.thread_ts &&
    event.thread_ts !== event.ts;

  if (!isReply) return NextResponse.json({ ok: true });

  try {
    const result = await handleThreadReply(event.channel, event.thread_ts);
    if (result.handled) {
      console.log(`[slack-events] settled ask for ${result.club}`);
    }
    return NextResponse.json({ ok: true, ...result });
  } catch (err: any) {
    console.error("[slack-events] error", err);
    // 200 regardless: a 5xx makes Slack retry and eventually disable the
    // subscription, and the hourly cron already covers a missed event.
    return NextResponse.json({ ok: true, error: err?.message });
  }
}
