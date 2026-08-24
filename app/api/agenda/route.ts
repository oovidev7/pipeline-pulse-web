import { NextRequest, NextResponse } from "next/server";
import { buildAgenda } from "@/lib/agenda";
import { invalidateNotesCache } from "@/lib/deal-context";

export const dynamic = "force-dynamic";
// Joins Attio deals, notes, meetings, tasks, Gmail and Slack on a cold cache.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.has("refresh")) invalidateNotesCache();
  try {
    return NextResponse.json(await buildAgenda());
  } catch (err: any) {
    console.error("[/api/agenda] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to build the agenda" },
      { status: 500 }
    );
  }
}
