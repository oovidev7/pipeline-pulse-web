import { NextRequest, NextResponse } from "next/server";
import { getAgenda } from "@/lib/agenda";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Primes the shared cache so nobody waits for it.
 *
 * The agenda reads every note and meeting in the workspace — roughly seventy
 * Attio requests cold, which is half a minute of staring at a spinner. Building
 * it on a schedule means the cache is already warm when someone opens the page
 * at nine on Monday.
 *
 * Authenticated the same way as the digest cron, since it bypasses the site
 * password and is expensive enough to be worth not exposing.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const querySecret = req.nextUrl.searchParams.get("secret");
  if (!secret || (auth !== `Bearer ${secret}` && querySecret !== secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  try {
    const agenda = await getAgenda();
    return NextResponse.json({
      warmed: true,
      ms: Date.now() - started,
      decisions: agenda.decisions.length,
      queue: agenda.queueTotal,
    });
  } catch (err: any) {
    console.error("[/api/warm] error", err);
    // A failed warm is not an incident: the next page load rebuilds it, slowly.
    return NextResponse.json(
      { warmed: false, ms: Date.now() - started, error: err?.message },
      { status: 500 }
    );
  }
}
