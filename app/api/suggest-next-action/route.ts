import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getComputedDealsResponse } from "@/lib/attio";

export const dynamic = "force-dynamic";

// NOTE: update this model string if a newer Claude model becomes the
// recommended default for this kind of short-form reasoning task.
const MODEL = "claude-sonnet-4-5-20250929";

// Research-backed tactic blocks keyed by at-risk reason code. These get
// spliced into the prompt for whichever reasons apply to the deal at hand.
const PLAYBOOK: Record<string, string> = {
  single_threaded:
    "Multi-threading research shows deals with 2+ engaged stakeholders close at meaningfully " +
    "higher rates than single-threaded deals. Suggest identifying and looping in a second " +
    "contact by name/role if one is visible anywhere in the data provided (e.g. mentioned in " +
    "an email snippet or meeting note). If no second contact is visible in the data, suggest " +
    "directly asking the existing contact who else at their club should be looped in on this " +
    "decision (e.g. finance, technical, or ownership stakeholders).",
  unanswered_followups:
    "When our last outbound message has gone unanswered for several days, research on sales " +
    "follow-up cadence suggests a short, low-pressure nudge referencing something specific and " +
    "concrete (not a generic 'just checking in') performs best. Suggest referencing the specific " +
    "topic or question from our last message, and proposing one small next step (e.g. a 15-minute " +
    "call) rather than re-asking an open-ended question.",
  no_recent_activity:
    "Deals that go quiet for an extended period benefit from a re-engagement touch that adds new " +
    "value rather than just 'checking in' — e.g. sharing a relevant update, case study, or seasonal " +
    "hook (preseason, transfer window, budget cycle) tied to what football/soccer clubs care about. " +
    "Suggest a specific, value-adding reason to reach back out, grounded only in what's known about " +
    "this deal and contact.",
  contact_unreachable:
    "If the primary contact appears unresponsive across multiple channels, suggest trying an " +
    "alternate channel (e.g. a direct call instead of email, or vice versa) or reaching a secondary " +
    "contact if one exists in the data. Avoid escalating tone; suggest a brief, friendly nudge.",
  stage_stale:
    "Deals that sit in a stage far longer than the average dwell time for that stage often stall on " +
    "an unstated blocker (budget, internal buy-in, competing priority). Suggest directly and " +
    "diplomatically asking the contact what's needed to move things to the next step, referencing " +
    "how long the deal has been in its current stage only if that fact is in the provided data.",
};

function buildReasonCodes(dealName: string, riskLabels: string[], hasFollowUp: boolean, hasRecentActivity: boolean): string[] {
  const codes: string[] = [];
  if (riskLabels.some((l) => l.toLowerCase().includes("one contact"))) {
    codes.push("single_threaded");
  }
  if (hasFollowUp) {
    codes.push("unanswered_followups");
  }
  if (!hasRecentActivity) {
    codes.push("no_recent_activity");
  }
  if (riskLabels.some((l) => l.toLowerCase().includes("stale") || l.toLowerCase().includes("avg"))) {
    codes.push("stage_stale");
  }
  return Array.from(new Set(codes));
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not set" }, { status: 500 });
  }

  let dealId: string | undefined;
  try {
    const body = await req.json();
    dealId = body?.dealId;
  } catch {
    // ignore
  }

  if (!dealId) {
    return NextResponse.json({ error: "dealId is required" }, { status: 400 });
  }

  try {
    const dealsData = await getComputedDealsResponse();
    const deal = dealsData.deals.find((d) => d.id === dealId);
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const atRisk = dealsData.atRiskDeals.find((r) => r.deal.id === dealId);
    const riskLabels = atRisk?.reasons.map((r) => r.label) || [];

    // Best-effort: pull contact activity for this deal from the in-memory
    // cache maintained by /api/contact-activity (module-level, not shared
    // across serverless instances, so this may be empty on a cold start —
    // that's fine, the prompt just has less context in that case).
    let contactSnippet: string | null = null;
    let lastContactDate: string | null = null;
    let direction: string | null = null;
    try {
      const contactRes = await fetch(
        `${req.nextUrl.origin}/api/contact-activity`,
        { headers: { cookie: req.headers.get("cookie") || "" } }
      );
      if (contactRes.ok) {
        const contactData = await contactRes.json();
        const entry = (contactData.entries || []).find((e: any) => e.dealId === dealId);
        if (entry) {
          contactSnippet = entry.snippet;
          lastContactDate = entry.lastContactDate;
          direction = entry.direction;
        }
      }
    } catch {
      // contact-activity may be slow/cold; proceed without it
    }

    const hasFollowUp = direction === "ours" && Boolean(lastContactDate);
    const hasRecentActivity =
      Boolean(lastContactDate) &&
      Date.now() - new Date(lastContactDate as string).getTime() < 14 * 24 * 60 * 60 * 1000;

    const reasonCodes = buildReasonCodes(deal.name, riskLabels, hasFollowUp, hasRecentActivity);
    const tacticBlocks = reasonCodes
      .map((code) => PLAYBOOK[code])
      .filter(Boolean)
      .join("\n\n");

    const dataSummary = `
Deal: ${deal.name}
Stage: ${deal.stage}
Value: ${deal.value}
Owner: ${deal.ownerName || "Unassigned"}
Stage changed at: ${deal.stageChangedAt || "unknown"}
Next call scheduled: ${deal.nextCall || "none"}
Number of associated contacts: ${deal.personIds.length}
Risk flags: ${riskLabels.length > 0 ? riskLabels.join("; ") : "none"}
Last email contact date: ${lastContactDate || "unknown"}
Last email direction: ${direction || "unknown"}
Last email snippet: ${contactSnippet || "not available"}
`.trim();

    const prompt = `
You are a sales assistant helping a rep at Sentrum (a company selling to football/soccer clubs) decide the single best next action on an at-risk deal.

Here is the real data we have on this deal. Do not invent facts that are not present here — if something is unknown, don't guess at specifics (names, dates, numbers); instead give generically sound advice.

${dataSummary}

Relevant tactics based on this deal's risk factors:

${tacticBlocks || "No specific playbook tactic matched; give general best-practice advice for re-engaging a stalled B2B sales deal."}

Based on all of the above, give ONE concrete, specific, actionable suggested next step the rep should take today. Write it as a short paragraph (3-5 sentences max) in plain text, no markdown, no bullet points. Be specific about *what* to say or do, not just "follow up."
`.trim();

    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const suggestion = textBlock && "text" in textBlock ? textBlock.text : "No suggestion generated.";

    return NextResponse.json({ dealId, suggestion });
  } catch (err: any) {
    console.error("[/api/suggest-next-action] error", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate suggestion" },
      { status: 500 }
    );
  }
}
