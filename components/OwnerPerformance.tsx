import { DealsApiResponse } from "@/lib/types";

function fmtGBP(n: number): string {
  if (!n) return "£0";
  return "£" + Math.round(n).toLocaleString("en-GB");
}

export default function OwnerPerformance({
  ownerPerformance,
  error,
}: {
  ownerPerformance: DealsApiResponse["ownerPerformance"] | null;
  error?: string | null;
}) {
  return (
    <div className="card">
      <div className="section-title">Owner performance</div>
      {error ? (
        <div className="error-state">{error}</div>
      ) : !ownerPerformance ? (
        <div className="loading-text">Loading...</div>
      ) : ownerPerformance.length === 0 ? (
        <div className="empty-state">No owner data available.</div>
      ) : (
        <div className="grid grid-3">
          {ownerPerformance.map((o) => (
            <div className="owner-card" key={o.ownerId || o.ownerName}>
              <p className="owner-name">{o.ownerName}</p>
              <p className="hint" style={{ margin: 0 }}>
                {o.dealCount} deals · {fmtGBP(o.totalValue)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
