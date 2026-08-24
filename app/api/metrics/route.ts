import { NextRequest, NextResponse } from "next/server";
import { buildMetrics } from "@/lib/metrics";
import { invalidateNotesCache } from "@/lib/deal-context";

export const dynamic = "force-dynamic";
// Pages the whole workspace's notes and meetings on a cold cache.
export const maxDuration = 60;

/**
 * The weekly numbers: deals reaching demo, calls held (split discovery vs
 * progression), conversations, and ecosystem meetings — plus a rolling
 * per-market view.
 *
 * All derived from Attio's own history, so the figures cannot drift from what
 * the CRM says and nobody has to maintain them.
 */
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.has("refresh")) invalidateNotesCache();

  const weeks = Number(req.nextUrl.searchParams.get("weeks"));
  const weeksBack = Number.isFinite(weeks) && weeks > 0 && weeks <= 52 ? weeks : 12;

  try {
    return NextResponse.json(await buildMetrics(weeksBack));
  } catch (err: any) {
    console.error("[/api/metrics] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to build metrics" },
      { status: 500 }
    );
  }
}
