import { DealsApiResponse } from "@/lib/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PipelineHealth({
  pipelineHealth,
}: {
  pipelineHealth: DealsApiResponse["pipelineHealth"] | null;
}) {
  return (
    <div className="card">
      <h2>Pipeline Health</h2>
      {!pipelineHealth ? (
        <div className="loading-text">Loading...</div>
      ) : (
        <div className="stat-row">
          <div className="stat">
            <div className="value">{Math.round(pipelineHealth.winRate * 100)}%</div>
            <div className="label">Win rate</div>
          </div>
          <div className="stat">
            <div className="value">{formatCurrency(pipelineHealth.openPipelineValue)}</div>
            <div className="label">Open pipeline value</div>
          </div>
          <div className="stat">
            <div className="value">{pipelineHealth.openCount}</div>
            <div className="label">Open deals</div>
          </div>
          <div className="stat">
            <div className="value">{pipelineHealth.stalledDealsCount}</div>
            <div className="label">Stalled (14+ days)</div>
          </div>
        </div>
      )}
    </div>
  );
}
