import { NextRequest, NextResponse } from "next/server";
import { buildHygiene, runHygiene } from "@/lib/hygiene";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Weekly CRM hygiene batch. `?dry=1` returns what would be posted without
 * touching Slack — the message itself, so the wording can be judged too.
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
      const report = await buildHygiene();
      return NextResponse.json({ dryRun: true, ...report });
    }
    return NextResponse.json(await runHygiene());
  } catch (err: any) {
    console.error("[/api/hygiene/run] error", err);
    return NextResponse.json(
      { error: err?.message || "Hygiene run failed" },
      { status: 500 }
    );
  }
}
