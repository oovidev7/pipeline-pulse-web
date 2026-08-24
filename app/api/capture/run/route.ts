import { NextRequest, NextResponse } from "next/server";
import { runCapture, findUnloggedCalls, readCaptureState } from "@/lib/capture";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Cron entry point for the post-call capture loop: harvest replies from open
 * ask threads, then post asks for freshly-ended calls that have no note.
 *
 * `?dry=1` shows what would be asked and which threads are open, without
 * posting to Slack or writing to Attio — for previewing the loop's behaviour.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const querySecret = req.nextUrl.searchParams.get("secret");
  if (!secret || (auth !== `Bearer ${secret}` && querySecret !== secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (req.nextUrl.searchParams.has("dry")) {
      const state = await readCaptureState();
      const { candidates, skipped } = await findUnloggedCalls(state);
      return NextResponse.json({
        dryRun: true,
        wouldAsk: candidates.map((c) => ({
          club: c.club,
          title: c.meeting.title,
          startsAt: c.meeting.startsAt,
          unnamedEmail: c.unnamedEmail,
        })),
        skipped,
        openAsks: Object.values(state.asks).filter((a) => !a.done).length,
      });
    }

    const result = await runCapture();
    for (const e of result.errors) console.error(`[/api/capture/run] ${e}`);
    return NextResponse.json(result, {
      status: result.errors.length > 0 && result.asked.length === 0 ? 502 : 200,
    });
  } catch (err: any) {
    console.error("[/api/capture/run] error", err);
    return NextResponse.json(
      { error: err?.message || "Capture run failed" },
      { status: 500 }
    );
  }
}
