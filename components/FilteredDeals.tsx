"use client";

import { useState } from "react";
import { DealRecord } from "@/lib/types";
import { ScoredDeal } from "@/lib/risk";
import { STAGE_LABELS } from "./StageSnapshot";
import DealDetail, { DealContext } from "./DealDetail";
import StageMover from "./StageMover";
import useDealActions from "./useDealActions";

function fmtGBP(n: number): string {
  if (!n) return "value not set";
  return "£" + Math.round(n).toLocaleString("en-GB");
}

function daysIn(deal: DealRecord): string {
  const source = deal.stageEnteredAt || deal.stageChangedAt;
  if (!source) return "stage age unknown";
  const dt = new Date(source);
  if (Number.isNaN(dt.getTime())) return "stage age unknown";
  const days = Math.floor((Date.now() - dt.getTime()) / 86_400_000);
  return `${days}d in stage`;
}

function nextCallLabel(nextCall: string | null): string {
  if (!nextCall) return "no call booked";
  const dt = new Date(nextCall);
  if (Number.isNaN(dt.getTime())) return "no call booked";
  const label = dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return dt >= new Date() ? `call ${label}` : `last call ${label}`;
}

export default function FilteredDeals({
  stage,
  deals,
  contextFor,
  /** Risk scores keyed by deal id — same scoring the Focus card shows. */
  risk,
  onDealChanged,
  onClear,
}: {
  stage: string;
  deals: DealRecord[];
  /** Resolves connector data for a deal, called only when a row is expanded. */
  contextFor?: (deal: DealRecord) => DealContext;
  risk?: Map<string, ScoredDeal>;
  /** Called after a write changes a deal (e.g. a stage move) so data refetches. */
  onDealChanged?: () => void;
  onClear: () => void;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { actionsFor, dialog } = useDealActions();

  const sorted = [...deals].sort((a, b) => (b.value || 0) - (a.value || 0));
  const totalValue = sorted.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div className="card">
      <div className="section-title" style={{ justifyContent: "space-between" }}>
        <span>
          {STAGE_LABELS[stage] || stage} deals{" "}
          <span className="hint">
            — {sorted.length}
            {totalValue > 0 && ` · ${fmtGBP(totalValue)}`}
          </span>
        </span>
        <button className="reload small" onClick={onClear}>
          Clear filter
        </button>
      </div>
      {sorted.length === 0 ? (
        <div className="empty-state">No deals in this stage.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.map((d) => {
            const isOpen = expanded[d.id];
            const scored = risk?.get(d.id);
            return (
              <div className="deal-card" key={d.id}>
                <button
                  type="button"
                  className="deal-row-toggle"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded((e) => ({ ...e, [d.id]: !e[d.id] }))}
                >
                  <span style={{ minWidth: 0 }}>
                    <span className="deal-name">{d.name}</span>
                    <span className="deal-meta">
                      {d.ownerName || "Unassigned"} · {daysIn(d)} ·{" "}
                      {nextCallLabel(d.nextCall)} ·{" "}
                      {d.personIds.length === 0
                        ? "no contacts"
                        : `${d.personIds.length} contact${d.personIds.length > 1 ? "s" : ""}`}
                    </span>
                    {scored && scored.factors.length > 0 && (
                      <span className="factor-row">
                        {scored.factors.map((f, i) => (
                          <span
                            key={i}
                            className={`factor-chip ${f.kind === "opportunity" ? "opp" : ""}`}
                          >
                            {f.label}
                          </span>
                        ))}
                      </span>
                    )}
                  </span>
                  <span className="deal-row-right">
                    {scored && (
                      <span className="risk-score" title={`Risk score ${scored.score}`}>
                        {scored.score}
                      </span>
                    )}
                    <span className="deal-value">{fmtGBP(d.value)}</span>
                    <span className={`chevron${isOpen ? " open" : ""}`} aria-hidden="true">
                      ›
                    </span>
                  </span>
                </button>
                {isOpen && (
                  <>
                    <DealDetail deal={d} context={contextFor ? contextFor(d) : {}} />
                    <StageMover
                      dealId={d.id}
                      dealName={d.name}
                      currentStage={d.stage}
                      onMoved={onDealChanged}
                    />
                    {actionsFor(d)}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {dialog}
    </div>
  );
}
