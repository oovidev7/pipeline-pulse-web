import { NextRequest, NextResponse } from "next/server";
import { getComputedDealsResponse } from "@/lib/attio";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const forceRefresh = req.nextUrl.searchParams.has("refresh");
  try {
    const data = await getComputedDealsResponse(forceRefresh);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[/api/deals] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load deals from Attio" },
      { status: 500 }
    );
  }
}
