import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAttioSnapshot, saveStallNote, updateDealStage } from "@/lib/attio";

export const dynamic = "force-dynamic";

/**
 * Records a decision taken in the weekly meeting.
 *
 * This is the point of the agenda: the one moment each week when everyone is
 * already thinking about a deal, so capturing the outcome costs nothing. It
 * writes to `stall_notes` — the field this app owns — rather than Attio's own
 * `note`, which carries the team's own words and is not ours to overwrite.
 *
 * "dead" also moves the deal to Lost, which is a real stage change and is why
 * the UI confirms before calling this.
 */
export type Decision = "live" | "park" | "dead";

const LABELS: Record<Decision, string> = {
  live: "Still live",
  park: "Parked",
  dead: "Marked lost",
};

export async function POST(req: NextRequest) {
  let dealId: string | undefined;
  let decision: Decision | undefined;
  let reason: string | undefined;
  let wakeOn: string | undefined;

  try {
    const body = await req.json();
    dealId = body?.dealId;
    decision = body?.decision;
    reason = typeof body?.reason === "string" ? body.reason.slice(0, 500) : undefined;
    wakeOn = typeof body?.wakeOn === "string" ? body.wakeOn.slice(0, 10) : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!dealId) {
    return NextResponse.json({ error: "dealId is required" }, { status: 400 });
  }
  if (!decision || !(decision in LABELS)) {
    return NextResponse.json(
      { error: "decision must be one of: live, park, dead" },
      { status: 400 }
    );
  }

  try {
    const snapshot = await getAttioSnapshot();
    const deal = snapshot.deals.find((d) => d.id === dealId);
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    // Dated, so a decision from March is never mistaken for a current one —
    // the existing `note` field carries undated verdicts and that ambiguity is
    // exactly what made them hard to trust.
    const today = new Date().toISOString().slice(0, 10);
    const parts = [`${LABELS[decision]} ${today}`];
    if (decision === "park" && wakeOn) parts.push(`revisit ${wakeOn}`);
    if (reason) parts.push(reason);

    // Existing notes are kept: the history of decisions is the record of how
    // long a deal has been almost-dead.
    const previous = deal.stallNotes?.trim();
    const line = parts.join(" — ");
    await saveStallNote(dealId, previous ? `${line}\n${previous}` : line);

    if (decision === "dead" && deal.stage !== "Lost") {
      await updateDealStage(dealId, "Lost");
    }

    // Drop the cached agenda, or reopening the page would show the deal still
    // waiting on a decision that was just taken.
    revalidateTag("agenda");

    return NextResponse.json({ ok: true, decision, recorded: line });
  } catch (err: any) {
    console.error("[/api/deal-decision] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to record the decision" },
      { status: 500 }
    );
  }
}
