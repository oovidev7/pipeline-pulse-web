import { NextRequest, NextResponse } from "next/server";
import { getSlackData } from "@/lib/slack-data";

export const dynamic = "force-dynamic";

// Default channel reference: "#sentrum-pulse-data-v2". Set SLACK_CHANNEL_ID to
// that channel's ID (not name) in env vars. Parsing lives in lib/slack-data.ts,
// shared with the alerts cron.

export async function GET(req: NextRequest) {
  const forceRefresh = req.nextUrl.searchParams.has("refresh");
  const data = await getSlackData(forceRefresh);
  return NextResponse.json(data);
}
