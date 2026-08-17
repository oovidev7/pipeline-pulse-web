import { NextRequest, NextResponse } from "next/server";
import { getAttioSnapshot, updateDealStage } from "@/lib/attio";
import { STAGES } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Moves a deal to a different pipeline stage. A real mutation of the live
 * Attio workspace — the UI confirms with the user before calling it.
 */
export async function POST(req: NextRequest) {
  let dealId: string | undefined;
  let stage: string | undefined;
  try {
    const body = await req.json();
    dealId = body?.dealId;
    stage = body?.stage;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!dealId) {
    return NextResponse.json({ error: "dealId is required" }, { status: 400 });
  }
  if (!stage || !STAGES.includes(stage as any)) {
    return NextResponse.json(
      { error: `stage must be one of: ${STAGES.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    // Confirm the deal exists and the move is a real change before writing.
    const snapshot = await getAttioSnapshot();
    const deal = snapshot.deals.find((d) => d.id === dealId);
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }
    if (deal.stage === stage) {
      return NextResponse.json(
        { error: `Deal is already in "${stage}"` },
        { status: 400 }
      );
    }

    await updateDealStage(dealId, stage);
    return NextResponse.json({ dealId, moved: true, from: deal.stage, to: stage });
  } catch (err: any) {
    console.error("[/api/deal-stage] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to move deal in Attio" },
      { status: 500 }
    );
  }
}
