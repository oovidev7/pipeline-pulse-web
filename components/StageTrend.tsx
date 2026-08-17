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
        — the trend appears once two weekly PULSE_DATA posts have accumulated.
      </p>
    );
  }

  const recent = weeks.slice(-6);
  const series = TREND_STAGES.map((stage, i) => ({
    stage,
    color: SERIES_COLORS[i % SERIES_COLORS.length],
    points: recent.map((w) => w.stage_counts?.[stage] ?? 0),
  }));

  const maxCount = Math.max(1, ...series.flatMap((s) => s.points));
  const plotW = WIDTH - PAD.left - PAD.right;
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const xAt = (i: number) =>
    PAD.left + (recent.length === 1 ? plotW / 2 : (i / (recent.length - 1)) * plotW);
  const yAt = (v: number) => PAD.top + plotH - (v / maxCount) * plotH;

  // Four horizontal gridlines, rounded to whole deals.
  const ticks = Array.from({ length: 4 }, (_, i) => Math.round((maxCount / 3) * i));

  return (
    <div>
      <p className="hint" style={{ margin: "0 0 8px" }}>
        Stage counts over the last {recent.length} weeks — open stages only
      </p>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Stage counts across the last ${recent.length} weekly snapshots`}
        style={{ width: "100%", height: "auto", display: "block" }}
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

        {recent.map((w, i) => (
          <text
            key={`${w.week_of}-${i}`}
            x={xAt(i)}
            y={HEIGHT - 8}
            // Anchor the end labels inward so they don't clip at the viewBox edge.
            textAnchor={i === 0 ? "start" : i === recent.length - 1 ? "end" : "middle"}
            fontSize="9"
            fill="var(--hint)"
          >
            {w.week_of || `wk ${i + 1}`}
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
              <circle key={i} cx={xAt(i)} cy={yAt(v)} r="2.5" fill={s.color} />
            ))}
          </g>
        ))}
      </svg>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 14px",
          marginTop: 8,
        }}
      >
        {series.map((s) => (
          <span
            key={s.stage}
            className="hint"
            style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
          >
            <span
              style={{
                width: 9,
                height: 2.5,
                borderRadius: 2,
                background: s.color,
                display: "inline-block",
              }}
            />
            {STAGE_LABELS[s.stage] || s.stage}
          </span>
        ))}
      </div>
    </div>
  );
}
