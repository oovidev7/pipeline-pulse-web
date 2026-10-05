// The path to signature for every deal that could close next.
//
// "Could close next" listed Trialling and Proposal deals by name and value,
// which says where they are and nothing about what happens next. This reads
// everything the CRM holds on each one — call notes in full, meetings, who the
// contacts are, the standing verdict, the research brief — and asks for two
// things: the next step, and what still stands between today and a signed
// contract. Every line has to point at the intel it came from; a gap the notes
// are silent on is named as silence, not filled with a guess.

import Anthropic from "@anthropic-ai/sdk";
import { unstable_cache } from "next/cache";
import { attioFetch, getAttioSnapshot } from "./attio";
import { getDealContext, DealSignals } from "./deal-context";
import { getSlackData } from "./slack-data";
import { CLOSED_STAGES, DealRecord } from "./types";

const MODEL = "claude-opus-5-5";
/** Bump when the prompt or output shape changes, so cached plans regenerate. */
const PLAN_VERSION = "v1";
const LATE_STAGES = ["Trialling", "Proposal"];
/** Enough history to see how the deal got here without drowning the latest call. */
const MAX_NOTES = 10;
const MAX_NOTE_CHARS = 4000;
const MAX_CONTACTS = 20;

export interface ClosePlanGap {
  gap: string;
  evidence: string;
  kind: "blocker" | "risk";
}

export interface ClosePlan {
  nextStep: { action: string; who: string; by: string; because: string };
  gaps: ClosePlanGap[];
  /** Date of the newest piece of intel the plan rests on. */
  intelThrough: string;
  generatedAt: string;
}

export type ClosePlanResult = ClosePlan | { error: string };

const PLAN_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["next_step", "gaps", "intel_through"],
  properties: {
    next_step: {
      type: "object",
      additionalProperties: false,
      required: ["action", "who", "by", "because"],
      properties: {
        action: { type: "string", description: "The one next step, concrete enough to do today. One sentence." },
        who: { type: "string", description: "Who at Sentrum does it, and with whom at the club, by name where the intel names them." },
        by: { type: "string", description: "When: a date or a short timeframe tied to something in the intel." },
        because: { type: "string", description: "The specific evidence that makes this the next step, with its date." },
      },
    },
    gaps: {
      type: "array",
      description: "What still stands between today and a signed contract, most blocking first. At most four.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["gap", "evidence", "kind"],
        properties: {
          gap: { type: "string", description: "The missing piece, in a few words." },
          evidence: { type: "string", description: "What in the intel shows it is missing — or that the intel is silent on it, and since when." },
          kind: { type: "string", enum: ["blocker", "risk"] },
        },
      },
    },
    intel_through: { type: "string", description: "YYYY-MM-DD of the newest note, meeting or field you relied on." },
  },
} as const;

const SYSTEM = `You support the sales team at Sentrum, which sells a football data hub to professional football clubs. Deals in Trialling or Proposal are the ones that could close next. For one such deal, you get everything the CRM holds: deal fields, call and conversation notes, meetings, the club's contacts and their roles, the team's own standing notes, and any research brief.

Produce the path to signature:
- next_step: the single most useful thing to do next, concrete enough to do today.
- gaps: what still stands between today and a signed contract, most blocking first, at most four.

What a signature at a club usually needs, to test the deal against: the person who signs off on budget identified and engaged; budget confirmed and the business case accepted; the decision process and timeline known; a champion inside the club; pricing shared and accepted; procurement, legal, IT or data-security review where it applies; a reason to sign now (start date, season, transfer window, budget cycle); no unaddressed competing vendor; more than one person engaged.

Rules:
- Ground every line in the intel: name the person, the note or meeting, and its date. Never write advice that would fit any deal.
- Do not invent people, dates, amounts or commitments. If the intel does not establish something a signature needs, that is a gap; say the notes are silent on it and since when.
- If the newest intel is old, say so; staleness is itself a gap.
- Write for a salesperson who knows the deal: plain, short, no preamble, no markdown.`;

/** What to tell the room when a plan can't be built — actionable where possible. */
function planError(err: any): string {
  const detail = String(err?.error?.error?.message ?? err?.message ?? "");
  if (/credit balance is too low/i.test(detail)) {
    return "No plan: the Anthropic API account is out of credits (console.anthropic.com → Plans & Billing).";
  }
  if (err instanceof Anthropic.AuthenticationError) return "No plan: the Anthropic API key is invalid.";
  if (err instanceof Anthropic.RateLimitError) return "No plan yet: rate limited, it will retry on the next load.";
  return "Couldn't work out a plan for this deal right now.";
}

/** "Bristol City - Q3 2026" → "bristol city", to match research briefs. */
function clubOf(name: string): string {
  return name.split(/\s+[-–]\s+/)[0].trim().toLowerCase();
}

function day(iso: string | null | undefined): string {
  return iso ? iso.slice(0, 10) : "unknown";
}

/** Full note bodies — the excerpts on the agenda stop mid-sentence. */
async function noteBody(noteId: string): Promise<string | null> {
  try {
    const body = await attioFetch(`/notes/${noteId}`);
    const text: string = body?.data?.content_plaintext ?? "";
    return text.replace(/\n{3,}/g, "\n\n").trim().slice(0, MAX_NOTE_CHARS) || null;
  } catch {
    return null;
  }
}

/** Who the contacts are — title and the role line from imported descriptions. */
async function contactCard(personId: string): Promise<string | null> {
  try {
    const body = await attioFetch(`/objects/people/records/${personId}`);
    const v = body?.data?.values ?? {};
    const name = v.name?.[0]?.full_name ?? "Unknown";
    const title = v.job_title?.[0]?.value ?? null;
    const description = (v.description?.[0]?.value ?? "").slice(0, 300) || null;
    const lastTouch =
      v.last_interaction?.[0]?.interacted_at ?? v.last_email_interaction?.[0]?.interacted_at ?? null;
    return [
      name,
      title && `— ${title}`,
      description && `(${description})`,
      `last interaction ${day(lastTouch)}`,
    ]
      .filter(Boolean)
      .join(" ");
  } catch {
    return null;
  }
}

async function expectedClose(dealId: string): Promise<string | null> {
  try {
    const body = await attioFetch(`/objects/deals/records/${dealId}`);
    return body?.data?.values?.expected_close_date?.[0]?.value ?? null;
  } catch {
    return null;
  }
}

/** Everything the CRM knows about one deal, as plain text for the prompt. */
export async function dealIntel(
  deal: DealRecord,
  signals: DealSignals | undefined,
  brief: string | null,
  marketSignals: string[]
): Promise<{ text: string; newest: string }> {
  const notes = (signals?.notes.all ?? []).filter((n) => n.human).slice(0, MAX_NOTES);
  const [bodies, contacts, closeDate] = await Promise.all([
    Promise.all(notes.map((n) => noteBody(n.id))),
    Promise.all(deal.personIds.slice(0, MAX_CONTACTS).map(contactCard)),
    expectedClose(deal.id),
  ]);
  const now = new Date().toISOString();
  const meetings = signals?.meetings ?? [];
  const past = meetings.filter((m) => m.startsAt <= now).slice(0, 12);
  const upcoming = meetings.filter((m) => m.startsAt > now).reverse();
  const daysInStage = deal.stageEnteredAt || deal.stageChangedAt
    ? Math.floor((Date.now() - new Date((deal.stageEnteredAt || deal.stageChangedAt)!).getTime()) / 86_400_000)
    : null;

  const newest = [
    notes[0]?.createdAt,
    past[0]?.startsAt,
    signals?.visibility.lastCapturedAt ?? undefined,
  ]
    .filter((d): d is string => Boolean(d))
    .sort()
    .pop() ?? "";

  const text = [
    `Today: ${day(now)}`,
    `Deal: ${deal.name}`,
    `Stage: ${deal.stage}${daysInStage !== null ? ` (for ${daysInStage} days)` : ""}`,
    `Stage history: ${deal.stageJourney.map((s) => `${s.stage} from ${day(s.enteredAt)}`).join(" → ") || "unknown"}`,
    `Value: £${Math.round(deal.value || 0).toLocaleString("en-GB")}`,
    `Owner at Sentrum: ${deal.ownerName?.trim() || "unassigned"}`,
    `Source: ${deal.source ?? "not recorded"}`,
    `Expected close date: ${closeDate ?? "not set"}`,
    `Standing note on the deal: ${deal.dealNote?.trim() || "none"}`,
    `Team's stall/decision notes: ${deal.stallNotes?.trim() || "none"}`,
    `Activity: ${signals?.visibility.summary ?? "unknown"}`,
    "",
    `Upcoming meetings: ${upcoming.length ? upcoming.map((m) => `${day(m.startsAt)} "${m.title}"`).join("; ") : "none booked"}`,
    `Past meetings (newest first): ${past.length ? past.map((m) => `${day(m.startsAt)} "${m.title}"`).join("; ") : "none recorded"}`,
    "",
    `Club contacts in the CRM (${deal.personIds.length}):`,
    ...contacts.filter(Boolean).map((c) => `- ${c}`),
    "",
    brief ? `Research brief:\n${brief}\n` : "Research brief: none",
    marketSignals.length ? `Market signals for this club:\n${marketSignals.map((s) => `- ${s}`).join("\n")}\n` : "",
    `Notes, newest first (${notes.length}):`,
    ...notes.map(
      (n, i) => `--- ${day(n.createdAt)} · ${n.channel} · "${n.title}"\n${bodies[i] ?? n.excerpt}`
    ),
  ].join("\n");

  return { text, newest };
}

async function generatePlan(intel: string): Promise<ClosePlan> {
  const client = new Anthropic();
  // Server-side fallback: if a safety classifier declines, the request is
  // re-run on Anthropic's recommended fallback model inside the same call.
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: PLAN_SCHEMA },
    },
    system: SYSTEM,
    messages: [{ role: "user", content: intel }],
  });

  if (response.stop_reason === "refusal") throw new Error("The model declined this deal.");
  if (response.stop_reason === "max_tokens") throw new Error("The plan was cut off.");
  const text = response.content
    .map((b) => (b.type === "text" ? b.text : ""))
    .join("");
  const raw = JSON.parse(text);
  return {
    nextStep: raw.next_step,
    gaps: (raw.gaps ?? []).slice(0, 4),
    intelThrough: raw.intel_through,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Plans are rebuilt on a schedule, not on every change: the room reads them
 * twice a week, and rebuilding on each new note spent money on plans nobody
 * opened. Each deal gets one plan per slot — the latest Monday or Thursday,
 * 06:00 UTC — built by the first warm or page load after it. A deal that
 * reaches Trialling mid-week gets its first plan straight away.
 */
const PLAN_DAYS = [1, 4]; // Monday, Thursday
const PLAN_HOUR_UTC = 6;

function planSlot(now = new Date()): string {
  for (let back = 0; back < 8; back++) {
    const d = new Date(now.getTime() - back * 86_400_000);
    d.setUTCHours(PLAN_HOUR_UTC, 0, 0, 0);
    if (PLAN_DAYS.includes(d.getUTCDay()) && d <= now) return d.toISOString().slice(0, 13);
  }
  return now.toISOString().slice(0, 10);
}

function cachedPlan(dealId: string, slot: string, build: () => Promise<ClosePlan>) {
  return unstable_cache(build, ["close-plan", PLAN_VERSION, dealId, slot], {
    revalidate: 7 * 86_400,
    tags: ["close-plans"],
  })();
}

/** Plans for every open Trialling and Proposal deal, keyed by deal id. */
export async function getClosePlans(): Promise<Record<string, ClosePlanResult>> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {};
  }
  const [snapshot, context, slack] = await Promise.all([
    getAttioSnapshot(),
    getDealContext(),
    getSlackData().catch(() => null),
  ]);
  const briefs: any[] = slack?.callBriefs?.briefs ?? [];
  const signalsFeed: any[] = slack?.marketSignals?.signals ?? [];

  const late = snapshot.deals.filter(
    (d) => LATE_STAGES.includes(d.stage) && !CLOSED_STAGES.includes(d.stage as any)
  );

  const entries = await Promise.all(
    late.map(async (deal): Promise<[string, ClosePlanResult]> => {
      const signals = context.get(deal.id);
      const club = clubOf(deal.name);
      const brief = briefs.find((b) => (b.club || "").trim().toLowerCase() === club)?.brief ?? null;
      const market = signalsFeed
        .filter((s) => (s.club || "").trim().toLowerCase() === club)
        .map((s) => `${s.source_date ?? ""} ${s.signal ?? ""}`.trim());
      try {
        const plan = await cachedPlan(deal.id, planSlot(), async () => {
          const { text } = await dealIntel(deal, signals, brief, market);
          return generatePlan(text);
        });
        return [deal.id, plan];
      } catch (err: any) {
        console.error(`[close-plans] ${deal.name}:`, err?.message ?? err);
        return [deal.id, { error: planError(err) }];
      }
    })
  );
  return Object.fromEntries(entries);
}
