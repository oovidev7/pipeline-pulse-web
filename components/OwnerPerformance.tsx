"use client";

import { CLOSED_STAGES, DealRecord } from "@/lib/types";
import { ScoredDeal } from "@/lib/risk";
import { fmtCompactGBP } from "./StageSnapshot";

/**
 * Owner load and deal health, not a leaderboard. Deal counts and total value
 * were already visible elsewhere; what isn't visible anywhere else is how much
 * of each rep's book is at risk, and how much of it they've actually reached.
 */
interface OwnerRow {
  ownerName: string;
  openCount: number;
  openValue: number;
  atRiskCount: number;
  atRiskValue: number;
  neverReached: number;
  won: number;
  lost: number;
}

export default function OwnerPerformance({
  deals,
  risk,
  error,
}: {
  deals: DealRecord[] | null;
  risk?: Map<string, ScoredDeal>;
  error?: string | null;
}) {
  const rows: OwnerRow[] = [];
  if (deals) {
    const byOwner = new Map<string, OwnerRow>();
    for (const d of deals) {
      const name = d.ownerName?.trim() || "Unassigned";
      const row =
        byOwner.get(name) ??
        ({
          ownerName: name,
          openCount: 0,
          openValue: 0,
          atRiskCount: 0,
          atRiskValue: 0,
          neverReached: 0,
          won: 0,
          lost: 0,
        } as OwnerRow);

      if (d.stage.startsWith("Won")) row.won += 1;
      else if (d.stage === "Lost") row.lost += 1;
      else {
        row.openCount += 1;
        row.openValue += d.value || 0;
        // "At risk" reuses the Focus score so the two cards can't disagree.
        if ((risk?.get(d.id)?.score ?? 0) > 0) {
          row.atRiskCount += 1;
          row.atRiskValue += d.value || 0;
        }
        if (d.personIds.length > 0 && d.engagedContactCount === 0) {
          row.neverReached += 1;
        }
      }
      byOwner.set(name, row);
    }
    rows.push(...byOwner.values());
    rows.sort((a, b) => b.openValue - a.openValue);
  }

  const totalOpenValue = rows.reduce((s, r) => s + r.openValue, 0);

  return (
    <div className="card">
      <div className="section-title">
        Owner load{" "}
        <span className="hint">— who is carrying what, and how much is at risk</span>
      </div>
      {error ? (
        <div className="error-state">{error}</div>
      ) : !deals ? (
        <div className="loading-text">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="empty-state">No owner data available.</div>
      ) : (
        <div className="owner-grid">
          {rows.map((r) => {
            const share = totalOpenValue > 0 ? r.openValue / totalOpenValue : 0;
            const riskShare = r.openCount > 0 ? r.atRiskCount / r.openCount : 0;
            const closed = r.won + r.lost;
            return (
              <div className="owner-card" key={r.ownerName}>
                <p className="owner-name">{r.ownerName}</p>
                <p className="owner-headline">
                  {fmtCompactGBP(r.openValue)}{" "}
                  <span className="hint">
                    open · {r.openCount} deal{r.openCount === 1 ? "" : "s"} ·{" "}
                    {Math.round(share * 100)}% of pipeline
                  </span>
                </p>

                <div className="owner-bar" title={`${r.atRiskCount} of ${r.openCount} at risk`}>
                  <span
                    className="owner-bar-fill"
                    style={{ width: `${Math.round(riskShare * 100)}%` }}
                  />
                </div>
                <p className="hint" style={{ margin: "4px 0 0" }}>
                  {r.atRiskCount} of {r.openCount} flagged ({fmtCompactGBP(r.atRiskValue)})
                </p>

                <p className="owner-sub">
                  {r.neverReached > 0 && (
                    <span className="overdue-date">
                      {r.neverReached} never reached
                    </span>
                  )}
                  {r.neverReached > 0 && closed > 0 && " · "}
                  {closed > 0 && (
                    <span className="hint">
                      {r.won}W / {r.lost}L all-time
                    </span>
                  )}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
