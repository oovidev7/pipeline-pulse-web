"use client";

import { useState } from "react";
import { AtRiskDeal } from "@/lib/types";

export default function AtRiskList({
  atRiskDeals,
}: {
  atRiskDeals: AtRiskDeal[] | null;
}) {
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSuggest(dealId: string) {
    setLoadingIds((s) => ({ ...s, [dealId]: true }));
    setErrors((e) => ({ ...e, [dealId]: "" }));
    try {
      const res = await fetch("/api/suggest-next-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to get suggestion");
      setSuggestions((s) => ({ ...s, [dealId]: data.suggestion }));
    } catch (err: any) {
      setErrors((e) => ({ ...e, [dealId]: err?.message || "Failed to get suggestion" }));
    } finally {
      setLoadingIds((s) => ({ ...s, [dealId]: false }));
    }
  }

  return (
    <div className="card">
      <div className="section-title">
        Focus this week <span className="hint">— at-risk deals worth reviewing</span>
      </div>
      {!atRiskDeals ? (
        <div className="loading-text">Loading...</div>
      ) : atRiskDeals.length === 0 ? (
        <div className="empty-state">No at-risk deals right now.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {atRiskDeals.map(({ deal, reasons }) => {
            return (
              <div className="deal-card" key={deal.id}>
                <div className="deal-card-header">
                  <p className="deal-name">{deal.name}</p>
                  <p className="deal-meta">
                    {deal.stage} · {deal.ownerName || "Unassigned"}
                  </p>
                </div>
                <ul className="reason-list">
                  {reasons.map((r) => (
                    <li key={r.code}>&#9888; {r.label}</li>
                  ))}
                </ul>
                <div style={{ marginTop: 6 }}>
                  {suggestions[deal.id] ? (
                    <div className="suggestion-box">
                      <strong style={{ fontWeight: 500 }}>Try this next:</strong> {suggestions[deal.id]}
                    </div>
                  ) : (
                    <>
                      <button
                        className="reload small"
                        onClick={() => handleSuggest(deal.id)}
                        disabled={loadingIds[deal.id]}
                      >
                        {loadingIds[deal.id] ? "Thinking…" : "Suggest next action"}
                      </button>
                      {errors[deal.id] && (
                        <span className="hint" style={{ marginLeft: 8, color: "var(--danger)" }}>
                          {errors[deal.id]}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
