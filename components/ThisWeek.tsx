"use client";

import { useState } from "react";
import {
  CLOSED_STAGES,
  DealRecord,
  PipelineMovement as Movement,
  STAGES,
  StageMove,
} from "@/lib/types";
import { STAGE_LABELS, fmtCompactGBP } from "./StageSnapshot";

type Bucket = "created" | "movedStage" | "won" | "lost";

const BUCKETS: { key: Bucket; label: string; hint: string; tone?: "good" | "bad" }[] = [
  { key: "created", label: "New deals", hint: "created in Attio" },
  { key: "movedStage", label: "Changed stage", hint: "still open" },
  { key: "won", label: "Won", hint: "closed won", tone: "good" },
  { key: "lost", label: "Lost", hint: "closed lost", tone: "bad" },
];

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

/**
 * A plain-English read of the week, so the tiles mean something without
 * knowing what a stage is. Zeros are stated explicitly rather than left to be
 * inferred from four "0"s — "nothing new came in" is itself the finding.
 */
function buildSummary(m: Movement, fmt: (n: number) => string): string {
  const inflow =
    m.created.length > 0
      ? `${m.created.length} new ${plural(m.created.length, "deal", "deals")} worth ${fmt(
          m.createdValue
        )} came in`
      : "No new deals came in";

  const closedCount = m.won.length + m.lost.length;
  let closed: string;
  if (closedCount === 0) {
    closed = "nothing closed";
  } else {
    const bits: string[] = [];
    if (m.won.length) bits.push(`${m.won.length} won (${fmt(m.wonValue)})`);
    if (m.lost.length) bits.push(`${m.lost.length} lost (${fmt(m.lostValue)})`);
    closed = bits.join(" and ");
  }

  if (m.movedStage.length === 0) {
    return `${inflow} and ${closed}. No open deals moved to a different stage.`;
  }

  const up = m.movedStage.filter((x) => x.direction === "up").length;
  const down = m.movedStage.filter((x) => x.direction === "down").length;
  const dirBits: string[] = [];
  if (up) dirBits.push(`${up} forward`);
  if (down) dirBits.push(`${down} backward`);

  const moved = `${m.movedStage.length} open ${plural(
    m.movedStage.length,
    "deal",
    "deals"
  )} worth ${fmt(m.movedValue)} changed stage${
    dirBits.length ? ` (${dirBits.join(", ")})` : ""
  }.`;

  return `${inflow} and ${closed}. ${moved}`;
}

const OPEN_STAGES = STAGES.filter((s) => !CLOSED_STAGES.includes(s));

function fmtGBP(n: number): string {
  if (!n) return "£0";
  return "£" + Math.round(n).toLocaleString("en-GB");
}

function bucketValue(m: Movement, key: Bucket): number {
  if (key === "created") return m.createdValue;
  if (key === "won") return m.wonValue;
  if (key === "lost") return m.lostValue;
  return m.movedValue;
}

/**
 * The single "what happened this week" card: deal movement (with drill-down),
 * a stalled read, the research that arrived, execution debt, and new
 * first-contact conversations. Absorbs the old Pipeline movement, week-glance
 * and New conversations cards, which restated each other.
 */
export default function ThisWeek({
  movement,
  /** PULSE_DATA snapshots, oldest first — supplies the per-stage net change. */
  history,
  stalledCount,
  latestWeek,
  prevWeek,
  signals,
  briefs,
  tasks,
  followUpsCount,
  newConversations,
  error,
}: {
  movement: Movement | null;
  history?: any[];
  stalledCount?: number | null;
  latestWeek?: any | null;
  prevWeek?: any | null;
  signals?: any | null;
  briefs?: any | null;
  tasks?: { tasks: { overdue: boolean }[] } | null;
  followUpsCount?: number | null;
  newConversations?: { personId: string; name: string; firstEmailInteraction: string }[];
  error?: string | null;
}) {
  const [open, setOpen] = useState<Bucket | null>(null);

  // The non-movement lines of the digest, each a sentence with a tone mark.
  const extraLines: { text: string; tone?: "good" | "bad" }[] = [];
  if (typeof stalledCount === "number" && stalledCount > 0) {
    const prevStalled = prevWeek?.stalled_count;
    const delta =
      typeof latestWeek?.stalled_count === "number" && typeof prevStalled === "number"
        ? latestWeek.stalled_count - prevStalled
        : null;
    extraLines.push({
      text: `${stalledCount} open deals are stalled — 14+ days in stage, no upcoming call${
        delta !== null && delta !== 0
          ? ` (${delta > 0 ? "up" : "down"} ${Math.abs(delta)} vs last week's snapshot)`
          : ""
      }.`,
      tone: "bad",
    });
  }
  const signalCount = signals?.signals?.length ?? 0;
  if (signalCount > 0)
    extraLines.push({
      text: `${signalCount} market signal${signalCount > 1 ? "s" : ""} from Monday's research.`,
    });
  const briefCount = briefs?.briefs?.length ?? 0;
  if (briefCount > 0)
    extraLines.push({
      text: `${briefCount} call brief${briefCount > 1 ? "s" : ""} prepared.`,
    });
  const overdue = tasks?.tasks.filter((t) => t.overdue).length ?? 0;
  if (overdue > 0)
    extraLines.push({ text: `${overdue} task${overdue > 1 ? "s" : ""} overdue.`, tone: "bad" });
  if (followUpsCount && followUpsCount > 0)
    extraLines.push({
      text: `${followUpsCount} conversation${followUpsCount > 1 ? "s" : ""} waiting on our follow-up for 7+ days.`,
      tone: "bad",
    });
  if (newConversations && newConversations.length > 0)
    extraLines.push({
      text: `New first-contact conversations: ${newConversations.map((c) => c.name).join(", ")}.`,
      tone: "good",
    });

  const weeks = (history || []).filter((s) => s?.stage_counts);
  const curr = weeks.length >= 2 ? weeks[weeks.length - 1] : null;
  const prev = weeks.length >= 2 ? weeks[weeks.length - 2] : null;

  const deltas = curr
    ? OPEN_STAGES.map((stage) => {
        // PULSE_DATA writes "Won"/"Lost" without the emoji; open stages match directly.
        const c = curr.stage_counts?.[stage] ?? 0;
        const p = prev?.stage_counts?.[stage] ?? 0;
        return { stage, delta: c - p, curr: c };
      }).filter((d) => d.delta !== 0)
    : [];

  const shown = open ? movement?.[open] ?? [] : [];

  return (
    <div className="card">
      <div className="section-title">
        This week{" "}
        <span className="hint">
          — everything that happened in the last {movement?.windowDays ?? 7} days, all sources
        </span>
      </div>

      {error ? (
        <div className="error-state">{error}</div>
      ) : !movement ? (
        <div className="loading-text">Loading...</div>
      ) : (
        <>
          <p className="movement-summary">{buildSummary(movement, fmtGBP)}</p>
          {movement.created.length === 0 && (
            <p className="hint" style={{ margin: "0 0 10px" }}>
              Nothing new entered the pipeline this week — worth noting alongside the
              coverage gap above.
            </p>
          )}
          {extraLines.length > 0 && (
            <ul className="review-list" style={{ marginBottom: 14 }}>
              {extraLines.map((l, i) => (
                <li key={i} className={l.tone ? `review-${l.tone}` : undefined}>
                  {l.text}
                </li>
              ))}
            </ul>
          )}

          <div className="stat-row" style={{ marginBottom: 0 }}>
            {BUCKETS.map(({ key, label, hint, tone }) => {
              const list = movement[key];
              const value = bucketValue(movement, key);
              const active = open === key;
              return (
                <button
                  type="button"
                  key={key}
                  className={`movement-tile${active ? " active" : ""}`}
                  aria-pressed={active}
                  disabled={list.length === 0}
                  onClick={() => setOpen(active ? null : key)}
                >
                  <p className="label">{label}</p>
                  <p
                    className={`value${
                      list.length && tone === "bad" ? " danger" : ""
                    }`}
                  >
                    {list.length}
                  </p>
                  <p className="sub">
                    {fmtGBP(value)}
                    <span className="movement-tile-hint">
                      {list.length > 0 ? "click to see them" : hint}
                    </span>
                  </p>
                </button>
              );
            })}
          </div>

          {open && (
            <div className="movement-list">
              {shown.length === 0 ? (
                <div className="empty-state">Nothing in this bucket.</div>
              ) : open === "created" ? (
                (shown as DealRecord[])
                  .slice()
                  .sort((a, b) => (b.value || 0) - (a.value || 0))
                  .map((d) => (
                    <div className="movement-row" key={d.id}>
                      <span>
                        {d.name}{" "}
                        <span className="hint">
                          {STAGE_LABELS[d.stage] || d.stage} ·{" "}
                          {d.ownerName || "Unassigned"}
                        </span>
                      </span>
                      <span className="call-time">{fmtCompactGBP(d.value)}</span>
                    </div>
                  ))
              ) : (
                (shown as StageMove[])
                  .slice()
                  .sort((a, b) => (b.deal.value || 0) - (a.deal.value || 0))
                  .map((m) => (
                    <div className="movement-row" key={m.deal.id}>
                      <span>
                        {m.deal.name}{" "}
                        <span className="stage-path">
                          {m.path.length > 1 ? (
                            m.path.map((s, i) => (
                              <span key={i}>
                                {i > 0 && (
                                  <span className={`stage-arrow ${m.direction}`}>
                                    {m.direction === "down" ? " ← " : " → "}
                                  </span>
                                )}
                                {STAGE_LABELS[s] || s}
                              </span>
                            ))
                          ) : (
                            <>from unknown → {STAGE_LABELS[m.toStage] || m.toStage}</>
                          )}
                          {m.hops > 1 && (
                            <span className="hint"> · {m.hops} moves</span>
                          )}
                        </span>{" "}
                        <span className="hint">· {m.deal.ownerName || "Unassigned"}</span>
                      </span>
                      <span className="call-time">{fmtCompactGBP(m.deal.value)}</span>
                    </div>
                  ))
              )}
            </div>
          )}

          <div className="movement-net">
            {deltas.length > 0 ? (
              <>
                <p className="label" style={{ margin: "0 0 6px" }}>
                  Net change by stage{" "}
                  <span className="hint">
                    {prev?.week_of} → {curr?.week_of}
                  </span>
                </p>
                <div className="movement-net-row">
                  {deltas.map((d) => (
                    <span key={d.stage} className="movement-net-item">
                      {STAGE_LABELS[d.stage] || d.stage}{" "}
                      <strong className={d.delta > 0 ? "up" : "down"}>
                        {d.delta > 0 ? `+${d.delta}` : d.delta}
                      </strong>
                      <span className="hint"> → {d.curr}</span>
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <p className="hint" style={{ margin: 0 }}>
                {weeks.length < 2
                  ? "A week-on-week comparison needs two weekly snapshots to compare — only one has been posted to Slack so far, so this fills in next Monday."
                  : `No stage counts changed between ${prev?.week_of} and ${curr?.week_of}.`}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
