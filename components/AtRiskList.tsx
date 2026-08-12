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
      <h2>At-Risk Deals</h2>
      {!atRiskDeals ? (
        <div className="loading-text">Loading...</div>
      ) : atRiskDeals.length === 0 ? (
        <div className="empty-state">No at-risk deals right now.</div>
      ) : (
        atRiskDeals.map(({ deal, reasons }) => (
          <div className="deal-card" key={deal.id}>
            <div className="deal-name">{deal.name}</div>
            <div className="deal-meta">
              {deal.stage} · {deal.ownerName || "Unassigned"}
            </div>
            <ul className="reason-list">
              {reasons.map((r) => (
                <li key={r.code}>{r.label}</li>
              ))}
            </ul>
            <button
              className="btn btn-small"
              onClick={() => handleSuggest(deal.id)}
              disabled={loadingIds[deal.id]}
            >
              {loadingIds[deal.id] ? "Thinking..." : "Suggest next action"}
            </button>
            {errors[deal.id] && (
              <div className="login-error" style={{ marginTop: 8 }}>
                {errors[deal.id]}
              </div>
            )}
            {suggestions[deal.id] && (
              <div className="suggestion-box">{suggestions[deal.id]}</div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
