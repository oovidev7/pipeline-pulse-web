import { NextRequest, NextResponse } from "next/server";
import { getOpenTasks } from "@/lib/attio";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const forceRefresh = req.nextUrl.searchParams.has("refresh");
  try {
    const data = await getOpenTasks(forceRefresh);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[/api/tasks] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load tasks from Attio" },
      { status: 500 }
    );
  }
}
