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
import { CLOSED_STAGES, DealRecord } from "./types";
import { readPreviousScores, buildScoreStateMessage } from "./alert-state";
import { diffScores } from "./alert-diff";
import { getDealContext, DealSignals } from "./deal-context";

/**
 * Score a deal must reach to appear in the morning digest.
 *
 * Raised 50 → 60 on 2026-08-17: at 50 the digest ran to 23 deals, and the top
 * eight were near-identical — a daily message that long reads as backlog.
 *
 * Raised 60 → 70 on 2026-08-24, when scores began escalating with time. That
 * change alone moved the ≥60 set from 9 deals to 16 without any deal actually
 * getting worse, so the gate moves with the scale rather than quietly widening
 * the list. 70 restores it to 8.
 *
 * Scores cluster tightly around the cut (…76 ×5, 70 ×3, 68 ×2…), so the count
 * swings by several deals for a one-point move. That is tolerable because the
 * message lists at most `MAX_LISTED` and folds the rest into a count; treat
 * this as "roughly the worst ten", not a precise gate.
 */
export const RISK_ALERT_THRESHOLD = 70;

/** Deals named individually before the rest become "…and N more". */
const MAX_LISTED = 8;

/**
 * How much a score must climb, on a deal already past the threshold, to count
 * as "getting worse" rather than normal drift. Factors are weighted in steps
 * of 8-20, so 3 catches a real new problem without firing on rounding.
 *
 * Since scores escalate with time (see `persisted` in ./risk), a stalling deal
 * now drifts up ~1/week per rotting factor. 3 stays the right cut: it ignores
 * that background creep day to day and fires when several factors tick over
 * together or a genuinely new problem appears. These go to the data channel
 * only — the team is interrupted for threshold crossings, not for drift.
 */
const ESCALATION_RISE = 3;
/** Signals older than this aren't "fresh" — they refresh each Monday anyway. */
const SIGNAL_FRESH_DAYS = 4;

export interface AlertDigest {
  /** True when at least one rule fired — nothing posts otherwise. */
  shouldPost: boolean;
  riskDeals: ScoredDeal[];
  signals: { club: string; dealName: string; signal: string; source_date?: string }[];
  /** Deals that got worse since the previous run — what the team is told about. */
  changes: {
    crossed: { deal: DealRecord; score: number; from: number | null; factors: string[] }[];
    worsened: { deal: DealRecord; score: number; from: number; factors: string[] }[];
    cleared: { deal: DealRecord; score: number; from: number }[];
  };
  /**
   * Deals we have no current visibility on and no recorded explanation for.
   * Deliberately not risk-scored — we do not know these are stalled, and the
   * dashboard's job is to ask rather than to guess. Answering the question is
   * also how the explanation gets captured.
   */
  dark: { deal: DealRecord; days: number | null; channels: string[] }[];
  /** True when there was no previous run to compare against. */
  baseline: boolean;
  /** Every open deal's score, to be written back as the next baseline. */
  scores: Record<string, number>;
  /**
   * Short, human-facing: deals that *crossed* the threshold since the last run,
   * either way. Goes to the channel the team reads, because becoming (or
   * ceasing to be) a problem is an event worth interrupting for; a flagged deal
   * grinding slowly worse is not, and stays in the data channel. Empty when
   * nothing crossed — the normal case on a quiet day.
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

  // What we can see, joined the same way the dashboard joins it. On failure the
  // scoring silently reverts to email-only, which is worse but not wrong-headed
  // — the digest is still worth sending.
  const gmailByDeal = new Map(
    (activity?.entries ?? []).map((e) => [e.dealId, e.lastContactDate ?? null])
  );
  const context = await getDealContext(gmailByDeal).catch((err) => {
    console.error("[alerts] visibility unavailable, falling back to email-only", err);
    return new Map<string, DealSignals>();
  });

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
          visibility: context.get(d.id)?.visibility ?? null,
        });
      })
  );

  const riskDeals = scored.filter((s) => s.score >= RISK_ALERT_THRESHOLD);

  const dark = scored
    .filter((s) => context.get(s.deal.id)?.visibility.state === "dark")
    .map((s) => {
      const v = context.get(s.deal.id)!.visibility;
      return { deal: s.deal, days: v.daysSinceCapture, channels: v.channels };
    })
    .sort((a, b) => (b.deal.value || 0) - (a.deal.value || 0));

  // Compare against the previous run so the team hears about *movement*, not
  // the standing list — the same deals are stalled again tomorrow.
  const previous = await readPreviousScores();
  const scores: Record<string, number> = {};
  for (const s of scored) scores[s.deal.id] = s.score;

  const baseline = previous === null;
  const changes: AlertDigest["changes"] = { crossed: [], worsened: [], cleared: [] };

  if (previous) {
    const byId = new Map(scored.map((s) => [s.deal.id, s]));
    const diff = diffScores(
      scored.map((s) => ({
        id: s.deal.id,
        score: s.score,
        factors: s.factors.map((f) => f.label),
      })),
      previous.scores,
      RISK_ALERT_THRESHOLD,
      ESCALATION_RISE
    );

    const dealOf = (id: string) => byId.get(id)!.deal;
    changes.crossed = diff.crossed.map(({ item, from }) => ({
      deal: dealOf(item.id),
      score: item.score,
      from,
      factors: item.factors,
    }));
    changes.worsened = diff.worsened.map(({ item, from }) => ({
      deal: dealOf(item.id),
      score: item.score,
      from,
      factors: item.factors,
    }));
    changes.cleared = diff.cleared.map(({ item, from }) => ({
      deal: dealOf(item.id),
      score: item.score,
      from,
    }));
  }

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

  // What the team hears about: deals that moved. A fresh buying signal rides
  // along on a deal that also moved, rather than posting on its own.
  const signalByClub = new Map(freshSignals.map((s) => [clubOf(s.dealName), s]));
  const withSignal = (deal: DealRecord) => {
    const s = signalByClub.get(clubOf(deal.name));
    return s ? `\n   ↳ _buying signal:_ ${s.signal}` : "";
  };

  // Crossings only: a deal that just became a problem, or just stopped being
  // one. Both are events. A flagged deal drifting from 64 to 67 is not, and is
  // reported in the data channel instead.
  const crossedLines = changes.crossed.map(
    (c) =>
      `• *${c.deal.name}* — ${fmtGBP(c.deal.value)}, ${c.deal.ownerName || "Unassigned"} · *now needs action* (${
        c.from === null ? `score ${c.score}` : `${c.from} → ${c.score}`
      })\n   ${c.factors.join(", ")}${withSignal(c.deal)}`
  );
  const clearedLine =
    changes.cleared.length > 0
      ? `_No longer flagged: ${changes.cleared.map((c) => c.deal.name).join(", ")}._`
      : "";

  // Drift belongs with the standing list, under its own heading so the record
  // shows which of these deals are actively rotting rather than merely stuck.
  if (changes.worsened.length > 0) {
    digestLines.push("", `*Getting worse since yesterday:*`);
    for (const w of changes.worsened) {
      digestLines.push(
        `• *${w.deal.name}* — ${w.from} → ${w.score} · ${w.factors.join(", ")}`
      );
    }
  }

  // Questions, not findings. Phrased as what we failed to capture so nobody
  // reads it as "these deals are dead" — several of them are probably fine.
  if (dark.length > 0) {
    digestLines.push("", `*No visibility on ${dark.length} — alive or dead?*`);
    for (const d of dark.slice(0, MAX_LISTED)) {
      digestLines.push(
        `• *${d.deal.name}* — ${fmtGBP(d.deal.value)}, ${d.deal.stage} · nothing captured ${
          d.days === null ? "ever" : `in ${d.days}d`
        } (we see: ${d.channels.length ? d.channels.join(", ") : "nothing"})`
      );
    }
    if (dark.length > MAX_LISTED) {
      digestLines.push(`…and ${dark.length - MAX_LISTED} more.`);
    }
  }

  const digestMessage = digestLines.length
    ? `:telephone_receiver: *Pipeline Pulse — morning digest*\n\n${digestLines.join("\n")}`
    : "";

  // Nothing to say on the first run — there is no baseline to compare with,
  // and announcing every already-flagged deal as "new" would be wrong.
  const n = crossedLines.length;
  const signalMessage =
    baseline || (n === 0 && !clearedLine)
      ? ""
      : n === 0
        ? `:white_check_mark: *Pipeline Pulse* — ${clearedLine}`
        : `:rotating_light: *Pipeline moved — ${
            n === 1 ? "1 deal needs" : `${n} deals need`
          } a look*\n${[...crossedLines, clearedLine].filter(Boolean).join("\n")}`;

  return {
    shouldPost: Boolean(digestMessage || signalMessage),
    riskDeals,
    signals: freshSignals,
    changes,
    dark,
    baseline,
    scores,
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
  target: "signals" | "digest" | "state";
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

  // Record this run's scores last, so the next run can report movement. Always
  // attempted — even when nothing was posted — otherwise a quiet day would
  // leave the baseline stale and the following run would over-report.
  if (digestChannel) {
    const res = await postToChannel(
      digestChannel,
      buildScoreStateMessage(digest.scores)
    );
    results.push({ target: "state", channel: digestChannel, ...res });
  }

  return results;
}
