import { NextRequest, NextResponse } from "next/server";
import { createDealTask, getAttioSnapshot } from "@/lib/attio";

export const dynamic = "force-dynamic";

const MAX_CONTENT_LENGTH = 5000;
const DEFAULT_DUE_IN_DAYS = 3;

/**
 * Creates an Attio task linked to a deal. Purely additive, but still a real
 * mutation — the UI confirms with the user before calling it.
 */
export async function POST(req: NextRequest) {
  let dealId: string | undefined;
  let content: string | undefined;
  let dueInDays: number | undefined;
  try {
    const body = await req.json();
    dealId = body?.dealId;
    content = body?.content;
    dueInDays = typeof body?.dueInDays === "number" ? body.dueInDays : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!dealId) {
    return NextResponse.json({ error: "dealId is required" }, { status: 400 });
  }
  if (typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json(
      { error: "Task content cannot be empty" },
      { status: 400 }
    );
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json(
      { error: `Task is too long (${content.length}/${MAX_CONTENT_LENGTH} characters)` },
      { status: 400 }
    );
  }

  try {
    const snapshot = await getAttioSnapshot();
    const deal = snapshot.deals.find((d) => d.id === dealId);
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    // Assign to the deal's owner when there is one, so the task lands in the
    // right person's queue rather than being unassigned.
    const assigneeIds = deal.ownerId ? [deal.ownerId] : [];

    const result = await createDealTask({
      dealId,
      content: content.trim(),
      dueInDays: dueInDays ?? DEFAULT_DUE_IN_DAYS,
      assigneeIds,
    });

    return NextResponse.json({ dealId, created: true, ...result });
  } catch (err: any) {
    console.error("[/api/deal-task] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create task in Attio" },
      { status: 500 }
    );
  }
}
