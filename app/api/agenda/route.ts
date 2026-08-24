import { NextRequest, NextResponse } from "next/server";
import { buildAgenda, getAgenda } from "@/lib/agenda";
import { invalidateNotesCache } from "@/lib/deal-context";

export const dynamic = "force-dynamic";
// Joins Attio deals, notes, meetings, tasks, Gmail and Slack on a cold cache.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const bust = req.nextUrl.searchParams.has("refresh");
  if (bust) invalidateNotesCache();
  try {
    // "?refresh=1" must actually rebuild, not hand back the copy it was asked
    // to bypass.
    return NextResponse.json(bust ? await buildAgenda() : await getAgenda());
  } catch (err: any) {
    console.error("[/api/agenda] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to build the agenda" },
      { status: 500 }
    );
  }
}
