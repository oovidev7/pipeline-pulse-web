import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { setCounterpartHidden } from "@/lib/hidden";

export const dynamic = "force-dynamic";

/**
 * Hides (or restores) a counterpart from "Coming up". Session-protected by
 * the middleware like every page-facing write. Per company, not per meeting —
 * dismissing an investor once should cover their next call too.
 */
export async function POST(req: NextRequest) {
  let companyId: string | undefined;
  let name: string | undefined;
  let hide = true;
  try {
    const body = await req.json();
    companyId = body?.companyId;
    name = typeof body?.name === "string" ? body.name.slice(0, 120) : undefined;
    hide = body?.hide !== false;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!companyId || !name) {
    return NextResponse.json(
      { error: "companyId and name are required" },
      { status: 400 }
    );
  }

  try {
    const hidden = await setCounterpartHidden(companyId, name, hide);
    // The agenda is cached; dropping the tag makes the dismissal stick on the
    // next load instead of the card reappearing for an hour.
    revalidateTag("agenda");
    return NextResponse.json({ ok: true, hiddenCount: hidden.length });
  } catch (err: any) {
    console.error("[/api/hide-counterpart] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update" },
      { status: 500 }
    );
  }
}
