// Daily Slack alert digest. Rules agreed 2026-08-14:
//   1. any open deal with composite risk score >= RISK_ALERT_THRESHOLD
//   2. a fresh market signal matched to a pipeline club
// Destination: #sentrum-sales, weekday mornings, skipped when nothing fires.

import { getComputedDealsResponse } from "./attio";
import { getOpenTasks } from "./attio";
import { getContactActivity } from "./contact-activity-data";
import { getSlackData } from "./slack-data";
import { cleanSlackText } from "./slack-text";
import { rankDeals, scoreDeal, ScoredDeal } from "./risk";
import { CLOSED_STAGES } from "./types";

/**
 * Score a deal must reach to appear in the morning digest.
 *
 * Raised from 50 to 60 on 2026-08-17: at 50 the digest ran to 23 deals, and
 * the top eight were near-identical (single-threaded, no call, cold, over the
 * stage median) — a daily message that long reads as backlog, not as alerts.
 *
 * Scores cluster tightly around the cut (…61 ×6, 60, 59 ×5…), so the count
 * swings by several deals for a one-point move. That is tolerable because the
 * message lists at most `MAX_LISTED` and folds the rest into a count; treat
 * this as "roughly the worst ten", not a precise gate.
 */
export const RISK_ALERT_THRESHOLD = 60;

/** Deals named individually before the rest become "…and N more". */
const MAX_LISTED = 8;
/** Signals older than this aren't "fresh" — they refresh each Monday anyway. */
const SIGNAL_FRESH_DAYS = 4;

export interface AlertDigest {
  /** True when at least one rule fired — nothing posts otherwise. */
  shouldPost: boolean;
  riskDeals: ScoredDeal[];
  signals: { club: string; dealName: string; signal: string; source_date?: string }[];
  /**
   * Short, human-facing: fresh buying signals only. Goes to the channel the
   * team actually reads, because a signal is a dated event worth interrupting
   * for. Empty when no signal fired.
   */
  signalMessage: string;
  /**
   * The full risk list. Goes to the data channel — it is a standing state
   * (the same deals are stalled tomorrow), so it belongs in a record people
   * consult rather than a feed that pings them. Empty when nothing qualified.
   */
  digestMessage: string;
}

function clubOf(dealName: string): string {
  return dealName.split(/\s+[-–]\s+/)[0].trim().toLowerCase();
}

function fmtGBP(n: number): string {
  if (!n) return "£0";
  return "£" + Math.round(n).toLocaleString("en-GB");
}

function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return null;
  return Math.max(0, Math.floor((Date.now() - dt.getTime()) / 86_400_000));
}

/**
 * Joins every source exactly the way the dashboard does, so a deal's alert
 * score always matches the score shown on screen.
 */
export async function buildAlertDigest(): Promise<AlertDigest> {
  const [deals, tasks, slack, activity] = await Promise.all([
    getComputedDealsResponse(),
    getOpenTasks().catch(() => null),
    getSlackData(),
    getContactActivity().catch(() => null),
  ]);

  const signals: any[] = slack.marketSignals?.signals ?? [];

  const scored = rankDeals(
    deals.deals
      .filter((d) => !CLOSED_STAGES.includes(d.stage as any))
      .map((d) => {
        const club = clubOf(d.name);
        const entry = activity?.entries.find((e) => e.dealId === d.id);
        const signal = signals.find(
          (s: any) => (s.club || "").trim().toLowerCase() === club
        );
        return scoreDeal(d, {
          lastContactDate: entry?.lastContactDate ?? null,
          direction: entry?.direction ?? null,
          // The cron has no per-request calendar view; a future next_call is
          // the best available signal for a booked call here.
          hasUpcomingCall: Boolean(d.nextCall && new Date(d.nextCall) >= new Date()),
          overdueTaskCount:
            tasks?.tasks.filter((t) => t.dealId === d.id && t.overdue).length ?? 0,
          signalDate: signal?.source_date ?? null,
          benchmark: deals.stageBenchmarks.find((b) => b.stage === d.stage) ?? null,
        });
      })
  );

  const riskDeals = scored.filter((s) => s.score >= RISK_ALERT_THRESHOLD);

  // Rule 2: fresh signals on pipeline clubs. Bounded to the first weekdays
  // after Monday's research so the same signal doesn't repeat all week.
  const dealsByClub = new Map(deals.deals.map((d) => [clubOf(d.name), d]));
  const freshSignals = signals
    .map((s: any) => {
      const deal = dealsByClub.get((s.club || "").trim().toLowerCase());
      const age = daysSince(s.source_date);
      if (!deal || age === null || age > SIGNAL_FRESH_DAYS) return null;
      return {
        club: s.club,
        dealName: deal.name,
        signal: cleanSlackText(s.signal || ""),
        source_date: s.source_date,
      };
    })
    .filter(Boolean) as AlertDigest["signals"];

  // Two messages, two audiences. Kept separate rather than one message with
  // two sections so each can be routed to the channel that suits it.
  const digestLines: string[] = [];
  if (riskDeals.length > 0) {
    digestLines.push(
      `*${riskDeals.length} deal${riskDeals.length > 1 ? "s" : ""} need attention* (risk ≥ ${RISK_ALERT_THRESHOLD}):`
    );
    for (const { deal, score, factors } of riskDeals.slice(0, MAX_LISTED)) {
      digestLines.push(
        `• *${deal.name}* — ${deal.stage}, ${deal.ownerName || "Unassigned"}, ${fmtGBP(deal.value)} · score ${score}: ${factors.map((f) => f.label).join(", ")}`
      );
    }
    if (riskDeals.length > MAX_LISTED) {
      digestLines.push(`…and ${riskDeals.length - MAX_LISTED} more on the dashboard.`);
    }
  }

  const signalLines: string[] = freshSignals.map(
    (s) => `• *${s.club}* — ${s.signal} _(${s.dealName})_`
  );

  const digestMessage = digestLines.length
    ? `:telephone_receiver: *Pipeline Pulse — morning digest*\n\n${digestLines.join("\n")}`
    : "";

  const signalMessage = signalLines.length
    ? `:satellite_antenna: *${
        signalLines.length > 1
          ? `${signalLines.length} new buying signals`
          : "New buying signal"
      } on a pipeline club*\n${signalLines.join("\n")}`
    : "";

  return {
    shouldPost: Boolean(digestMessage || signalMessage),
    riskDeals,
    signals: freshSignals,
    signalMessage,
    digestMessage,
  };
}

/** Posts one message to one channel. Requires chat:write and bot membership. */
async function postToChannel(
  channel: string,
  message: string
): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) return { ok: false, error: "SLACK_BOT_TOKEN not set" };

  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ channel, text: message, unfurl_links: false }),
  });
  const body = await res.json();
  return body.ok ? { ok: true } : { ok: false, error: body.error };
}

export interface PostResult {
  target: "signals" | "digest";
  channel: string;
  ok: boolean;
  error?: string;
}

/**
 * Routes each half of the digest to its own channel:
 *   - signals  -> SLACK_ALERTS_CHANNEL_ID (the channel the team reads)
 *   - risk list -> SLACK_DIGEST_CHANNEL_ID, falling back to SLACK_CHANNEL_ID
 *     (the data channel the weekly research already posts to)
 *
 * Each is posted independently so one failing channel — a missing invite, a
 * bad id — cannot suppress the other.
 */
export async function postDigest(digest: AlertDigest): Promise<PostResult[]> {
  const signalChannel = process.env.SLACK_ALERTS_CHANNEL_ID;
  const digestChannel =
    process.env.SLACK_DIGEST_CHANNEL_ID || process.env.SLACK_CHANNEL_ID;

  const jobs: { target: PostResult["target"]; channel?: string; message: string }[] = [
    { target: "signals", channel: signalChannel, message: digest.signalMessage },
    { target: "digest", channel: digestChannel, message: digest.digestMessage },
  ];

  const results: PostResult[] = [];
  for (const job of jobs) {
    if (!job.message) continue; // nothing fired for this half
    if (!job.channel) {
      results.push({
        target: job.target,
        channel: "",
        ok: false,
        error:
          job.target === "signals"
            ? "SLACK_ALERTS_CHANNEL_ID not set"
            : "SLACK_DIGEST_CHANNEL_ID / SLACK_CHANNEL_ID not set",
      });
      continue;
    }
    const res = await postToChannel(job.channel, job.message);
    results.push({ target: job.target, channel: job.channel, ...res });
  }
  return results;
}
