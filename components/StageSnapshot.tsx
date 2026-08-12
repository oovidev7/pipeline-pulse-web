import { STAGES } from "@/lib/types";

export default function StageSnapshot({
  stageSnapshot,
}: {
  stageSnapshot: Record<string, number> | null;
}) {
  return (
    <div className="card">
      <h2>Stage Snapshot</h2>
      {!stageSnapshot ? (
        <div className="loading-text">Loading...</div>
      ) : (
        <div className="stage-grid">
          {STAGES.map((stage) => (
            <div className="stage-tile" key={stage}>
              <div className="count">{stageSnapshot[stage] || 0}</div>
              <div className="label">{stage}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
