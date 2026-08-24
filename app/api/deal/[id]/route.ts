import { NextRequest, NextResponse } from "next/server";
import { getAttioSnapshot, getComputedDealsResponse, getOpenTasks } from "@/lib/attio";
import { getDealContext } from "@/lib/deal-context";
import { getContactActivity } from "@/lib/contact-activity-data";
import { scoreDeal } from "@/lib/risk";
import { CLOSED_STAGES } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Everything known about one deal: its timeline, its people, why it scores what
 * it scores, and which sources had nothing to say. This is where a Slack link
 * or an agenda item lands, and where the CRM gets repaired — an unnamed contact
 * or a duplicate is surfaced next to the call that revealed it.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [snapshot, computed, tasks, activity] = await Promise.all([
      getAttioSnapshot(),
      getComputedDealsResponse(),
      getOpenTasks().catch(() => null),
      getContactActivity().catch(() => null),
    ]);

    const deal = snapshot.deals.find((d) => d.id === params.id);
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const gmail = new Map(
      (activity?.entries ?? []).map((e: any) => [e.dealId, e.lastContactDate ?? null])
    );
    const context = await getDealContext(gmail);
    const signals = context.get(deal.id);

    const contacts = snapshot.people.filter((p) => deal.personIds.includes(p.id));

    // Addresses that have been on a call but belong to no person record, and
    // people whose record carries no name. Both render as "Unknown" everywhere
    // and both are a one-field fix.
    const known = new Set(
      contacts.map((c) => c.email?.toLowerCase()).filter(Boolean) as string[]
    );
    const callOnly = [
      ...new Set(
        (signals?.meetings ?? []).flatMap((m) =>
          m.externalEmails.filter((e) => !known.has(e.toLowerCase()))
        )
      ),
    ];

    // Two records for one human — the calls and the deal end up on different
    // ones, which is how a live conversation reads as silence.
    const byName = new Map<string, typeof contacts>();
    for (const c of contacts) {
      if (!c.name || c.name === "Unknown") continue;
      const key = c.name.toLowerCase().replace(/[^a-z]/g, "");
      byName.set(key, [...(byName.get(key) ?? []), c]);
    }
    const duplicates = [...byName.values()].filter((group) => group.length > 1);

    const benchmark =
      computed.stageBenchmarks.find((b) => b.stage === deal.stage) ?? null;

    const scored = scoreDeal(deal, {
      lastContactDate: gmail.get(deal.id) ?? null,
      direction: activity?.entries.find((e: any) => e.dealId === deal.id)?.direction ?? null,
      hasUpcomingCall: Boolean(signals?.visibility.nextMeetingAt),
      overdueTaskCount:
        tasks?.tasks.filter((t) => t.dealId === deal.id && t.overdue).length ?? 0,
      benchmark,
      visibility: signals?.visibility ?? null,
    });

    return NextResponse.json({
      deal,
      isOpen: !CLOSED_STAGES.includes(deal.stage as any),
      score: scored.score,
      factors: scored.factors,
      benchmark,
      visibility: signals?.visibility ?? null,
      notes: signals?.notes.all.slice(0, 12) ?? [],
      meetings: signals?.meetings.slice(0, 12) ?? [],
      contacts,
      tasks: tasks?.tasks.filter((t) => t.dealId === deal.id) ?? [],
      hygiene: { callOnly, duplicates },
      cachedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("[/api/deal] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load deal" },
      { status: 500 }
    );
  }
}
