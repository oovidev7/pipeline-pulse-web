import { DealsApiResponse } from "@/lib/types";

function fmtGBP(n: number): string {
  if (!n) return "£0";
  return "£" + Math.round(n).toLocaleString("en-GB");
}

export default function PipelineHealth({
  pipelineHealth,
}: {
  pipelineHealth: DealsApiResponse["pipelineHealth"] | null;
}) {
  return (
    <div className="card">
      <div className="section-title">Pipeline health</div>
      {!pipelineHealth ? (
        <div className="loading-text">Loading...</div>
      ) : (
        <div className="stat-row">
          <div className="stat">
            <p className="label">Open value</p>
            <p className="value">{fmtGBP(pipelineHealth.openPipelineValue)}</p>
            <p className="sub">{pipelineHealth.openCount} deals open</p>
          </div>
          <div className="stat">
            <p className="label">Win rate</p>
            <p className="value">{Math.round(pipelineHealth.winRate * 100)}%</p>
            <p className="sub">
              {pipelineHealth.wonCount} won / {pipelineHealth.wonCount + pipelineHealth.lostCount} closed
            </p>
          </div>
          <div className="stat">
            <p className="label">Lost</p>
            <p className="value">{pipelineHealth.lostCount}</p>
            <p className="sub">all-time</p>
          </div>
          <div className="stat">
            <p className="label">Stalled</p>
            <p className="value">{pipelineHealth.stalledDealsCount}</p>
            <p className="sub">14+ days, no next call</p>
          </div>
        </div>
      )}
    </div>
  );
}
