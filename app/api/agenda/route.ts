import { NextRequest, NextResponse } from "next/server";
import { buildAgenda, getAgenda } from "@/lib/agenda";
import { revalidateTag } from "next/cache";
import { invalidateNotesCache } from "@/lib/deal-context";

export const dynamic = "force-dynamic";
// Joins Attio deals, notes, meetings, tasks, Gmail and Slack on a cold cache.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const bust = req.nextUrl.searchParams.has("refresh");
  if (bust) {
    invalidateNotesCache();
    // "Refresh" should mean the outreach numbers too, not an hour-old copy —
    // and the cached agenda itself, or the next plain page load would bring
    // back the very numbers this refresh replaced.
    for (const tag of ["agenda", "outbound-states", "inbound-email"]) {
      try { revalidateTag(tag); } catch { /* outside a request scope */ }
    }
  }
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
