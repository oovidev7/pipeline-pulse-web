import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { invalidateNotesCache } from "@/lib/deal-context";

export const dynamic = "force-dynamic";

/**
 * Attio webhook receiver: the Pulse reflects a CRM change in seconds instead
 * of whenever a cache window expires.
 *
 * v1 deliberately does one thing — drop every shared cache so the next read
 * rebuilds from live Attio — and logs the event types it receives. What Attio
 * actually sends in practice decides what reactions are worth wiring next;
 * guessing at payload shapes from memory is how silent no-ops get built.
 *
 * Authenticated by a secret in the registered URL
 * (`?secret=ATTIO_WEBHOOK_SECRET`): the subscription is created by hand in
 * Attio's UI, and a URL parameter is the one credential that survives that
 * path without depending on Attio's signing details.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.ATTIO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[attio-webhook] ATTIO_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }
  if (req.nextUrl.searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    // Attio may probe with an empty body when the subscription is created.
  }

  const events: any[] = body?.events ?? [];
  const types = [...new Set(events.map((e) => e?.event_type).filter(Boolean))];
  if (types.length > 0) {
    console.log(`[attio-webhook] ${events.length} events: ${types.join(", ")}`);
  }

  // Freshness is the whole point: whatever changed, the caches are now stale.
  invalidateNotesCache();
  for (const tag of ["attio-snapshot", "agenda"]) {
    try {
      revalidateTag(tag);
    } catch {
      // Outside a request scope shouldn't happen here, but never fail Attio.
    }
  }

  return NextResponse.json({ ok: true, received: events.length });
}
