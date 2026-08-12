import { DealsApiResponse } from "@/lib/types";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OwnerPerformance({
  ownerPerformance,
}: {
  ownerPerformance: DealsApiResponse["ownerPerformance"] | null;
}) {
  return (
    <div className="card">
      <h2>Owner Performance</h2>
      {!ownerPerformance ? (
        <div className="loading-text">Loading...</div>
      ) : ownerPerformance.length === 0 ? (
        <div className="empty-state">No owner data available.</div>
      ) : (
        ownerPerformance.map((o) => (
          <div className="owner-row" key={o.ownerId || o.ownerName}>
            <span>{o.ownerName}</span>
            <span>
              {o.dealCount} deals · {formatCurrency(o.totalValue)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
