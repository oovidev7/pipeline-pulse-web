import { NextRequest, NextResponse } from "next/server";
import { getAttioSnapshot, saveStallNote } from "@/lib/attio";

export const dynamic = "force-dynamic";

/** Guards against a runaway paste filling a CRM field with nonsense. */
const MAX_NOTE_LENGTH = 5000;

/**
 * Writes the `stall_notes` field on a deal. This is a real mutation of the live
 * Attio workspace — the UI confirms with the user before calling it.
 */
export async function POST(req: NextRequest) {
  let dealId: string | undefined;
  let note: string | undefined;
  try {
    const body = await req.json();
    dealId = body?.dealId;
    note = body?.note;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!dealId) {
    return NextResponse.json({ error: "dealId is required" }, { status: 400 });
  }
  if (typeof note !== "string") {
    return NextResponse.json({ error: "note must be a string" }, { status: 400 });
  }
  if (note.length > MAX_NOTE_LENGTH) {
    return NextResponse.json(
      { error: `Note is too long (${note.length}/${MAX_NOTE_LENGTH} characters)` },
      { status: 400 }
    );
  }

  try {
    // Confirm the deal exists before writing, so a stale or malformed id fails
    // with a clear message rather than a raw Attio 404.
    const snapshot = await getAttioSnapshot();
    const deal = snapshot.deals.find((d) => d.id === dealId);
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    await saveStallNote(dealId, note);
    return NextResponse.json({ dealId, saved: true, note });
  } catch (err: any) {
    console.error("[/api/deal-note] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to save note to Attio" },
      { status: 500 }
    );
  }
}
