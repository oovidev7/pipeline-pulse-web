"use client";

import { STAGES } from "@/lib/types";

const STAGE_LABELS: Record<string, string> = {
  Prospecting: "Prospecting",
  "Demo / discovery": "Demo",
  Qualified: "Qualified",
  Trialling: "Trialling",
  Proposal: "Proposal",
  "Won 🎉": "Won",
  Lost: "Lost",
};

export { STAGE_LABELS };

/** Compact currency — stage tiles are narrow, so £1,534,000 becomes £1.53m. */
export function fmtCompactGBP(n: number): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(2)}m`;
  if (n >= 1_000) return `£${Math.round(n / 1000)}k`;
  return `£${Math.round(n)}`;
}

export default function StageSnapshot({
  stageSnapshot,
  stageValues,
  activeStage,
  onSelectStage,
  error,
}: {
  stageSnapshot: Record<string, number> | null;
  stageValues?: Record<string, number> | null;
  activeStage?: string | null;
  onSelectStage?: (stage: string) => void;
  error?: string | null;
}) {
  const clickable = Boolean(onSelectStage);

  return (
    <div className="card">
      <div className="section-title">
        Stage snapshot{" "}
        {clickable && <span className="hint">— click a stage to see the deals</span>}
      </div>
      {error ? (
        <div className="error-state">{error}</div>
      ) : !stageSnapshot ? (
        <div className="loading-text">Loading...</div>
      ) : (
        <div className="stage-grid">
          {STAGES.map((stage) => {
            const isWon = stage.startsWith("Won");
            const isLost = stage === "Lost";
            const tone = isWon ? " won" : isLost ? " lost" : "";
            const isActive = activeStage === stage;
            const className = `stage-tile${tone}${clickable ? " clickable" : ""}${
              isActive ? " active" : ""
            }`;

            const content = (
              <>
                <p className="label">{STAGE_LABELS[stage] || stage}</p>
                <p className="count">{stageSnapshot[stage] || 0}</p>
                {stageValues && (
                  <p className="age">{fmtCompactGBP(stageValues[stage] || 0)}</p>
                )}
              </>
            );

            return clickable ? (
              <button
                type="button"
                className={className}
                key={stage}
                aria-pressed={isActive}
                onClick={() => onSelectStage?.(stage)}
              >
                {content}
              </button>
            ) : (
              <div className={className} key={stage}>
                {content}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
