"use client";

import { useState } from "react";
import { STAGES } from "@/lib/types";
import { STAGE_LABELS } from "./StageSnapshot";

/** Open stages only — Won/Lost are cumulative and swamp the scale. */
const TREND_STAGES = STAGES.filter((s) => !s.startsWith("Won") && s !== "Lost");

/** One line colour per open stage, in stage order. */
const SERIES_COLORS = ["#26215c", "#185fa5", "#1f7a5a", "#8a5a1f", "#993c1d"];

const WIDTH = 640;
const HEIGHT = 200;
const PAD = { top: 12, right: 12, bottom: 26, left: 30 };

interface Snapshot {
  week_of?: string;
  stage_counts?: Record<string, number>;
}

export default function StageTrend({ history }: { history: Snapshot[] }) {
  // Index of the week the pointer is nearest, or null when not hovering.
  const [active, setActive] = useState<number | null>(null);

  // Only snapshots that actually carry stage counts can be plotted.
  const weeks = (history || []).filter(
    (s) => s?.stage_counts && typeof s.stage_counts === "object"
  );

  if (weeks.length < 2) {
    return (
      <p className="hint" style={{ margin: 0 }}>
        {weeks.length === 0
          ? "No weekly snapshots yet"
          : "Only one week of history so far"}{" "}
        — the trend appears once a second weekly snapshot has been posted to Slack.
      </p>
    );
  }

  const recent = weeks.slice(-6);
  const series = TREND_STAGES.map((stage, i) => ({
    stage,
    color: SERIES_COLORS[i % SERIES_COLORS.length],
    points: recent.map((w) => w.stage_counts?.[stage] ?? 0),
  }));

  const totals = recent.map((_, i) =>
    series.reduce((sum, s) => sum + s.points[i], 0)
  );

  const maxCount = Math.max(1, ...series.flatMap((s) => s.points));
  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const xAt = (i: number) =>
    PAD.left + (recent.length === 1 ? plotW / 2 : (i / (recent.length - 1)) * plotW);
  const yAt = (v: number) => PAD.top + plotH - (v / maxCount) * plotH;

  // Four horizontal gridlines, rounded to whole deals.
  const ticks = Array.from({ length: 4 }, (_, i) => Math.round((maxCount / 3) * i));

  /** Maps a pointer position to the nearest week index. */
  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    // The SVG scales to its container, so convert screen px back to viewBox units.
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const step = recent.length > 1 ? plotW / (recent.length - 1) : plotW;
    const idx = Math.round((x - PAD.left) / step);
    setActive(Math.min(recent.length - 1, Math.max(0, idx)));
  }

  const shown = active ?? recent.length - 1;
  const isHovering = active !== null;

  return (
    <div>
      <div className="trend-head">
        <p className="hint" style={{ margin: 0 }}>
          Stage counts over the last {recent.length} weeks — open stages only
          {recent.length > 1 && !isHovering && " · hover for a week"}
        </p>
        {/* Reads out the hovered week, falling back to the latest. */}
        <p className="trend-readout">
          <span className="trend-readout-week">{recent[shown]?.week_of}</span>
          <strong>{totals[shown]}</strong> open
        </p>
      </div>

      <div className="trend-wrap">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`Stage counts across the last ${recent.length} weekly snapshots`}
          style={{ width: "100%", height: "auto", display: "block" }}
          onMouseMove={handleMove}
          onMouseLeave={() => setActive(null)}
        >
          {Array.from(new Set(ticks)).map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={yAt(t)}
                y2={yAt(t)}
                stroke="var(--border)"
                strokeWidth="1"
              />
              <text
                x={PAD.left - 6}
                y={yAt(t) + 3}
                textAnchor="end"
                fontSize="9"
                fill="var(--hint)"
              >
                {t}
              </text>
            </g>
          ))}

          {/* Vertical guide on the hovered week. */}
          {isHovering && (
            <line
              x1={xAt(shown)}
              x2={xAt(shown)}
              y1={PAD.top}
              y2={PAD.top + plotH}
              stroke="var(--accent)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          )}

          {recent.map((w, i) => (
            <text
              key={`${w.week_of}-${i}`}
              x={xAt(i)}
              y={HEIGHT - 8}
              // Anchor the end labels inward so they don't clip at the viewBox edge.
              textAnchor={i === 0 ? "start" : i === recent.length - 1 ? "end" : "middle"}
              fontSize="9"
              fill={isHovering && i === shown ? "var(--accent)" : "var(--hint)"}
              fontWeight={isHovering && i === shown ? 500 : 400}
            >
              {w.week_of}
            </text>
          ))}

          {series.map((s) => (
            <g key={s.stage}>
              <polyline
                fill="none"
                stroke={s.color}
                strokeWidth="1.75"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={s.points.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ")}
              />
              {s.points.map((v, i) => (
                <circle
                  key={i}
                  cx={xAt(i)}
                  cy={yAt(v)}
                  r={isHovering && i === shown ? 4 : 2.5}
                  fill={s.color}
                  stroke={isHovering && i === shown ? "#fff" : "none"}
                  strokeWidth={isHovering && i === shown ? 1.5 : 0}
                />
              ))}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend doubles as the value readout for the hovered (or latest) week. */}
      <div className="trend-legend">
        {series.map((s) => {
          const value = s.points[shown];
          const prev = shown > 0 ? s.points[shown - 1] : null;
          const delta = prev === null ? null : value - prev;
          return (
            <span key={s.stage} className="trend-legend-item">
              <span
                className="trend-legend-swatch"
                style={{ background: s.color }}
              />
              {STAGE_LABELS[s.stage] || s.stage} <strong>{value}</strong>
              {delta !== null && delta !== 0 && (
                <span className={delta > 0 ? "trend-up" : "trend-down"}>
                  {delta > 0 ? `+${delta}` : delta}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
