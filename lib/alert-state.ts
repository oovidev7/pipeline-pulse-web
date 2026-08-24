// Score state for the daily alert, so the digest can report *change* rather
// than a standing list. There is no database here, so state rides in the same
// Slack data channel the weekly research already posts to, under its own tag:
//
//   PULSE_SCORES | run: 2026-08-17T07:00:00.000Z
//   ```{ "run": "...", "scale": 2, "scores": { "<dealId>": 61, ... } }```
//
// Each run reads the newest PULSE_SCORES, diffs against it, then writes a
// fresh one. Losing the message (channel cleared, retention) is not fatal:
// the run simply reports no changes and re-establishes a baseline.

const STATE_TAG = "PULSE_SCORES";

/**
 * Bumped whenever the scoring changes shape, so scores from before the change
 * are never diffed against scores from after it. A rescale moves every number
 * at once; compared naively that reads as the whole pipeline deteriorating
 * overnight and pages the team about deals that did not move.
 *
 * A mismatch is treated exactly like a missing baseline: report nothing, write
 * a fresh one, resume comparing tomorrow.
 *
 *   1 — flat weights
 *   2 — 2026-08-24, weights escalate with time (see `persisted` in ./risk)
 */
const SCALE = 2;

export interface ScoreState {
  run: string;
  scores: Record<string, number>;
}

function stateChannel(): string | undefined {
  return process.env.SLACK_DIGEST_CHANNEL_ID || process.env.SLACK_CHANNEL_ID;
}

/** Reads the most recent score state, or null when there is no baseline yet. */
export async function readPreviousScores(): Promise<ScoreState | null> {
  const token = process.env.SLACK_BOT_TOKEN;
  const channel = stateChannel();
  if (!token || !channel) return null;

  try {
    const res = await fetch(
      `https://slack.com/api/conversations.history?channel=${encodeURIComponent(
        channel
      )}&limit=60`,
      { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
    );
    if (!res.ok) return null;
    const body = await res.json();
    if (!body.ok) return null;

    // Newest first — the first PULSE_SCORES we can parse is the baseline.
    for (const msg of body.messages || []) {
      const text: string = msg.text || "";
      if (!text.trimStart().startsWith(STATE_TAG)) continue;
      const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (!fenced) continue;
      try {
        const parsed = JSON.parse(fenced[1]);
        // Stop at the newest state either way: an older same-scale message is
        // not a valid baseline, it is just a staler one.
        if (parsed && typeof parsed.scores === "object") {
          if ((parsed.scale ?? 1) !== SCALE) return null;
          return { run: parsed.run ?? "", scores: parsed.scores };
        }
      } catch {
        // Malformed payload — keep looking at older messages.
      }
    }
  } catch {
    // Network/permission failure: treat as "no baseline" rather than failing
    // the whole run — the digest itself is still worth posting.
  }
  return null;
}

/** The message body that records this run's scores for the next comparison. */
export function buildScoreStateMessage(scores: Record<string, number>): string {
  const run = new Date().toISOString();
  const payload = JSON.stringify({ run, scale: SCALE, scores });
  return `${STATE_TAG} | run: ${run}\n\`\`\`${payload}\`\`\``;
}
