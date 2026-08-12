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

export default function StageSnapshot({
  stageSnapshot,
}: {
  stageSnapshot: Record<string, number> | null;
}) {
  return (
    <div className="card">
      <div className="section-title">
        Stage snapshot
      </div>
      {!stageSnapshot ? (
        <div className="loading-text">Loading...</div>
      ) : (
        <div className="stage-grid">
          {STAGES.map((stage) => {
            const isWon = stage.startsWith("Won");
            const isLost = stage === "Lost";
            const tileClass = isWon ? "stage-tile won" : isLost ? "stage-tile lost" : "stage-tile";
            return (
              <div className={tileClass} key={stage}>
                <p className="label">{STAGE_LABELS[stage] || stage}</p>
                <p className="count">{stageSnapshot[stage] || 0}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
