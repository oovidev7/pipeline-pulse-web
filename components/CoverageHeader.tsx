import { CLOSED_STAGES, DealsApiResponse, STAGES } from "@/lib/types";

const OPEN_STAGES = STAGES.filter((s) => !CLOSED_STAGES.includes(s));

/**
 * Below this many closed deals the win rate is too small a sample to weight a
 * forecast with any confidence — still shown, but flagged as indicative.
 */
const MIN_CLOSED_FOR_CONFIDENCE = 20;

function fmtGBP(n: number): string {
  if (!n) return "£0";
  return "£" + Math.round(n).toLocaleString("en-GB");
}

export default function CoverageHeader({
  pipelineHealth,
  stageValues,
  /** Commercial target, from the weekly PULSE_DATA post — the only source for it. */
  targetGBP,
  wonValue,
}: {
  pipelineHealth: DealsApiResponse["pipelineHealth"] | null;
  stageValues?: Record<string, number> | null;
  targetGBP?: number | null;
  wonValue: number;
}) {
  // Without a target there is nothing to measure coverage against.
  if (!pipelineHealth || !targetGBP || targetGBP <= 0) return null;

  const openValue = OPEN_STAGES.reduce((sum, s) => sum + (stageValues?.[s] || 0), 0);
  const attainment = wonValue / targetGBP;
  const gap = Math.max(0, targetGBP - wonValue);
  const closedCount = pipelineHealth.wonCount + pipelineHealth.lostCount;
  const winRate = pipelineHealth.winRate;

  const rawCoverage = gap > 0 ? openValue / gap : Infinity;
  const weighted = openValue * winRate;
  const surplus = weighted - gap;
  const onTrack = surplus >= 0;
  const lowConfidence = closedCount < MIN_CLOSED_FOR_CONFIDENCE;

  return (
    <div className="card coverage">
      <div className="coverage-grid">
        <div className="stat">
          <p className="label">Target</p>
          <p className="value">{fmtGBP(targetGBP)}</p>
          <p className="sub">commercial goal</p>
        </div>
        <div className="stat">
          <p className="label">Won</p>
          <p className="value">{fmtGBP(wonValue)}</p>
          <p className="sub">{Math.round(attainment * 100)}% of target</p>
        </div>
        <div className="stat">
          <p className="label">Gap</p>
          <p className="value">{fmtGBP(gap)}</p>
          <p className="sub">still to close</p>
        </div>
        <div className="stat">
          <p className="label">Coverage</p>
          <p className="value">
            {rawCoverage === Infinity ? "—" : `${rawCoverage.toFixed(1)}×`}
          </p>
          <p className="sub">{fmtGBP(openValue)} open ÷ gap</p>
        </div>
        <div className="stat">
          <p className="label">Weighted</p>
          <p className={`value ${onTrack ? "" : "danger"}`}>{fmtGBP(weighted)}</p>
          <p className="sub">at {Math.round(winRate * 100)}% win rate</p>
        </div>
      </div>

      <div
        className="coverage-track"
        role="img"
        aria-label={`Weighted pipeline ${fmtGBP(weighted)} against a gap of ${fmtGBP(gap)}`}
      >
        <span
          className={`coverage-fill${onTrack ? " ok" : " short"}`}
          style={{ width: `${Math.min(100, gap > 0 ? (weighted / gap) * 100 : 100)}%` }}
        />
      </div>

      <p className="coverage-verdict">
        {onTrack ? (
          <>
            Weighted pipeline covers the gap with{" "}
            <strong>{fmtGBP(surplus)}</strong> to spare.
          </>
        ) : (
          <>
            Weighted pipeline is <strong className="danger">{fmtGBP(-surplus)} short</strong>{" "}
            of the gap — {rawCoverage.toFixed(1)}× raw coverage looks healthy, but at a{" "}
            {Math.round(winRate * 100)}% win rate it converts to {fmtGBP(weighted)}.
          </>
        )}{" "}
        {lowConfidence && (
          <span className="hint">
            Win rate is from {closedCount} closed deal{closedCount === 1 ? "" : "s"} —
            treat as directional, not a forecast.
          </span>
        )}
      </p>
    </div>
  );
}
