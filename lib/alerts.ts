// Daily Slack alert digest. Rules agreed 2026-08-14:
//   1. any open deal with composite risk score >= 50
//   2. a fresh market signal matched to a pipeline club
// Destination: #sentrum-sales, weekday mornings, skipped when nothing fires.

import { getComputedDealsResponse } from "./attio";
import { getOpenTasks } from "./attio";
import { getContactActivity } from "./contact-activity-data";
import { getSlackData } from "./slack-data";
import { cleanSlackText } from "./slack-text";
import { rankDeals, scoreDeal, ScoredDeal } from "./risk";
import { CLOSED_STAGES } from "./types";

export const RISK_ALERT_THRESHOLD = 50;
/** Signals older than this aren't "fresh" — they refresh each Monday anyway. */
const SIGNAL_FRESH_DAYS = 4;

export interface AlertDigest {
  /** True when at least one rule fired — nothing posts otherwise. */
  shouldPost: boolean;
  riskDeals: ScoredDeal[];
  signals: { club: string; dealName: string; signal: string; source_date?: string }[];
  /** Slack mrkdwn message, ready for chat.postMessage. */
  message: string;
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

  const lines: string[] = [];
  if (riskDeals.length > 0) {
    lines.push(`*${riskDeals.length} deal${riskDeals.length > 1 ? "s" : ""} need attention* (risk ≥ ${RISK_ALERT_THRESHOLD}):`);
    for (const { deal, score, factors } of riskDeals.slice(0, 8)) {
      lines.push(
        `• *${deal.name}* — ${deal.stage}, ${deal.ownerName || "Unassigned"}, ${fmtGBP(deal.value)} · score ${score}: ${factors.map((f) => f.label).join(", ")}`
      );
    }
    if (riskDeals.length > 8) lines.push(`…and ${riskDeals.length - 8} more on the dashboard.`);
  }
  if (freshSignals.length > 0) {
    if (lines.length > 0) lines.push("");
    lines.push(`*Fresh buying signal${freshSignals.length > 1 ? "s" : ""} on pipeline clubs:*`);
    for (const s of freshSignals) {
      lines.push(`• *${s.club}* (${s.dealName}): ${s.signal}`);
    }
  }

  const shouldPost = lines.length > 0;
  const message = shouldPost
    ? `:telephone_receiver: *Pipeline Pulse — morning digest*\n\n${lines.join("\n")}`
    : "";

  return { shouldPost, riskDeals, signals: freshSignals, message };
}

/** Posts the digest. Requires chat:write and bot membership in the channel. */
export async function postDigest(message: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.SLACK_BOT_TOKEN;
  const channel = process.env.SLACK_ALERTS_CHANNEL_ID;
  if (!token) return { ok: false, error: "SLACK_BOT_TOKEN not set" };
  if (!channel) return { ok: false, error: "SLACK_ALERTS_CHANNEL_ID not set" };

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
