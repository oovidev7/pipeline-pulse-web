// Pure comparison between two runs' scores. Kept free of Slack, Attio, and
// env access so it can be exercised directly — the alerting behaviour people
// actually notice lives here, and it is the part most worth testing.

export interface DiffInput {
  id: string;
  score: number;
  factors: string[];
}

export interface ScoreDiff<T extends DiffInput> {
  crossed: { item: T; from: number | null }[];
  worsened: { item: T; from: number }[];
  cleared: { item: T; from: number }[];
}

/**
 * Classifies each deal against the previous run.
 *
 * - `crossed`  — not flagged before, flagged now. `from` is null when the deal
 *   was absent from the baseline (new to us, not necessarily new to the
 *   pipeline), which is reported rather than silently treated as a rise.
 * - `worsened` — flagged before and after, and climbed by at least `rise`.
 * - `cleared`  — flagged before, not any more.
 *
 * A deal flagged in both runs whose score barely moved appears in none of
 * them: that is the standing state the digest covers, not news.
 */
export function diffScores<T extends DiffInput>(
  current: T[],
  previous: Record<string, number>,
  threshold: number,
  rise: number
): ScoreDiff<T> {
  const out: ScoreDiff<T> = { crossed: [], worsened: [], cleared: [] };

  for (const item of current) {
    const before = previous[item.id];
    const hadBefore = typeof before === "number";
    const nowFlagged = item.score >= threshold;
    const wasFlagged = hadBefore && before >= threshold;

    if (nowFlagged && !wasFlagged) {
      out.crossed.push({ item, from: hadBefore ? before : null });
    } else if (nowFlagged && wasFlagged && item.score - before >= rise) {
      out.worsened.push({ item, from: before });
    } else if (!nowFlagged && wasFlagged) {
      out.cleared.push({ item, from: before });
    }
  }

  // Worst first, and for escalations the biggest jump first.
  out.crossed.sort((a, b) => b.item.score - a.item.score);
  out.worsened.sort(
    (a, b) => b.item.score - b.from - (a.item.score - a.from)
  );
  return out;
}
