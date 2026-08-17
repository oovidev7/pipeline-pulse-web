"use client";

import { useState } from "react";
import { DealRecord } from "@/lib/types";
import { ScoredDeal } from "@/lib/risk";
import { STAGE_LABELS, fmtCompactGBP } from "./StageSnapshot";
import DealDetail, { DealContext } from "./DealDetail";
import StageMover from "./StageMover";
import useDealActions from "./useDealActions";
import IntroNote from "./IntroNote";

/** The card is a worklist, not a report — anything past this is scrolling. */
const SHOW_LIMIT = 5;

export default function FocusList({
  ranked,
  contextFor,
  onDealChanged,
  error,
}: {
  ranked: ScoredDeal[] | null;
  contextFor: (deal: DealRecord) => DealContext;
  /** Called after a write changes a deal (e.g. a stage move) so data refetches. */
  onDealChanged?: () => void;
  error?: string | null;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { actionsFor, dialog } = useDealActions();

  const shown = (ranked ?? []).slice(0, SHOW_LIMIT);
  const total = ranked?.length ?? 0;

  return (
    <div className="card">
      <div className="section-title" style={{ justifyContent: "space-between" }}>
        <span>
          Focus this week{" "}
          <span className="hint">
            — ranked by every risk factor across CRM, email, calendar and research
          </span>
        </span>
      </div>

      <IntroNote storageKey="pulse-intro-focus" title="New here? Start with this card.">
        <ul>
          <li>
            Every <strong>open deal</strong> is checked against the same risk factors —
            contacts reached, calls booked, how long it's been quiet, time in stage,
            overdue tasks, and fresh market signals. The five that need you most are
            shown here.
          </li>
          <li>
            The <strong>red chips</strong> are the reasons, and the{" "}
            <strong>number on the right</strong> is just their weights added up. A
            higher score means more is wrong at once — it isn't a probability or a
            forecast.
          </li>
          <li>
            <strong>Click any deal</strong> to see everything we know about it: where
            it's been, the last email, the prep brief, and which sources had nothing
            to say.
          </li>
          <li>
            Buttons that <strong>change Attio</strong> — saving a note, creating a
            task, moving a stage — always ask you to confirm first and show exactly
            what will change. The AI buttons only draft text; nothing is saved until
            you say so.
          </li>
        </ul>
      </IntroNote>

      {error ? (
        <div className="error-state">{error}</div>
      ) : !ranked ? (
        <div className="loading-text">Loading...</div>
      ) : shown.length === 0 ? (
        <div className="empty-state">
          Nothing urgent — no open deal has outstanding risk factors right now.
        </div>
      ) : (
        <>
          {total > SHOW_LIMIT && (
            <p className="hint" style={{ margin: "0 0 10px" }}>
              Top {shown.length} of {total} flagged — expand a deal for its full
              picture and next-step actions.
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {shown.map(({ deal, score, factors }) => {
              const isOpen = expanded[deal.id];
              return (
                <div className="deal-card" key={deal.id}>
                  <button
                    type="button"
                    className="deal-row-toggle"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setExpanded((e) => ({ ...e, [deal.id]: !e[deal.id] }))
                    }
                  >
                    <span style={{ minWidth: 0 }}>
                      <span className="deal-name">
                        {deal.name}{" "}
                        <span className="hint">
                          {STAGE_LABELS[deal.stage] || deal.stage} ·{" "}
                          {deal.ownerName || "Unassigned"}
                        </span>
                      </span>
                      <span className="factor-row">
                        {factors.map((f, i) => (
                          <span
                            key={i}
                            className={`factor-chip ${f.kind === "opportunity" ? "opp" : ""}`}
                          >
                            {f.label}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="deal-row-right">
                      <span className="risk-score" title={`Risk score ${score}`}>
                        {score}
                      </span>
                      <span className="deal-value">{fmtCompactGBP(deal.value)}</span>
                      <span
                        className={`chevron${isOpen ? " open" : ""}`}
                        aria-hidden="true"
                      >
                        ›
                      </span>
                    </span>
                  </button>

                  {isOpen && (
                    <>
                      <DealDetail deal={deal} context={contextFor(deal)} />

                      <StageMover
                        dealId={deal.id}
                        dealName={deal.name}
                        currentStage={deal.stage}
                        onMoved={onDealChanged}
                      />

                      {actionsFor(deal)}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {dialog}
    </div>
  );
}
