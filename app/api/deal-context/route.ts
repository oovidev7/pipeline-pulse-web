import { NextRequest, NextResponse } from "next/server";
import { getDealContext, invalidateNotesCache } from "@/lib/deal-context";
import { getContactActivity } from "@/lib/contact-activity-data";

export const dynamic = "force-dynamic";
// Reads every note in the workspace alongside the Attio snapshot.
export const maxDuration = 60;

/**
 * Per-deal visibility and the last real conversation.
 *
 * Note bodies are trimmed to an excerpt server-side rather than shipped whole:
 * the dashboard only ever shows "what was last said", and call notes are the
 * most sensitive text in the workspace.
 */
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.has("refresh")) invalidateNotesCache();

  try {
    // Gmail's view sharpens the picture but must never block it — the Attio
    // signals alone are enough to tell active from dark.
    const activity = await getContactActivity().catch(() => null);
    const gmailByDeal = new Map(
      (activity?.entries ?? []).map((e: any) => [e.dealId, e.lastContactDate ?? null])
    );

    const context = await getDealContext(gmailByDeal);
    const out: Record<string, unknown> = {};
    for (const [dealId, signals] of context) {
      out[dealId] = {
        visibility: signals.visibility,
        lastConversation: signals.notes.lastConversation,
        noteCount: signals.notes.all.length,
        noteChannels: signals.notes.channels,
      };
    }

    return NextResponse.json({ context: out, cachedAt: new Date().toISOString() });
  } catch (err: any) {
    console.error("[/api/deal-context] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load deal context" },
      { status: 500 }
    );
  }
}
