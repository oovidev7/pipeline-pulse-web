import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getClosePlans } from "@/lib/close-plans";

export const dynamic = "force-dynamic";
// A cold build reads every late-stage deal's notes in full and asks the model
// about each; plans are cached per deal after that.
export const maxDuration = 60;

/** The path to signature for each Trialling and Proposal deal, keyed by deal id. */
export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.has("refresh")) {
    try { revalidateTag("close-plans"); } catch { /* outside a request scope */ }
  }
  try {
    const plans = await getClosePlans();
    return NextResponse.json({ plans, cachedAt: new Date().toISOString() });
  } catch (err: any) {
    console.error("[/api/close-plans] error", err);
    return NextResponse.json({ error: "Could not build the close plans" }, { status: 500 });
  }
}
