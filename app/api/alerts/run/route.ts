import { NextRequest, NextResponse } from "next/server";
import { buildAlertDigest, postDigest } from "@/lib/alerts";

export const dynamic = "force-dynamic";
// The digest joins Attio + Gmail + Slack; comfortably over the default 10s.
export const maxDuration = 60;

/**
 * Cron entry point for the daily Slack digest. Bypasses the site-password
 * middleware (a cron can't log in), so it authenticates itself instead:
 * Vercel cron sends `Authorization: Bearer ${CRON_SECRET}`; manual testing can
 * pass ?secret=. Without a valid secret it's a 401.
 *
 * `?dry=1` computes and returns the digest without posting — for previewing
 * what would go to Slack.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const querySecret = req.nextUrl.searchParams.get("secret");
  if (!secret || (auth !== `Bearer ${secret}` && querySecret !== secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dryRun = req.nextUrl.searchParams.has("dry");

  try {
    const digest = await buildAlertDigest();

    if (dryRun) {
      return NextResponse.json({ dryRun: true, ...digest });
    }

    if (!digest.shouldPost) {
      return NextResponse.json({ posted: false, reason: "nothing qualified" });
    }

    const result = await postDigest(digest.message);
    if (!result.ok) {
      console.error(`[/api/alerts/run] post failed: ${result.error}`);
      return NextResponse.json(
        { posted: false, error: result.error, message: digest.message },
        { status: 502 }
      );
    }
    return NextResponse.json({
      posted: true,
      riskDeals: digest.riskDeals.length,
      signals: digest.signals.length,
    });
  } catch (err: any) {
    console.error("[/api/alerts/run] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to build digest" },
      { status: 500 }
    );
  }
}
