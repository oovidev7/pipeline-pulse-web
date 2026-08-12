interface SlackData {
  cachedAt: string;
  latest: any | null;
  previous: any | null;
}

function labelize(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function Tile({ current, prev, label }: { current: number; prev: number; label: string }) {
  const diff = current - prev;
  const isUp = diff > 0;
  const isDown = diff < 0;
  return (
    <div>
      <p className="hint" style={{ margin: "0 0 2px" }}>
        {label}
      </p>
      <p style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>
        {current}{" "}
        {diff !== 0 && (
          <span className={`pill ${isUp ? "pill-context" : "pill-unlinked"}`}>
            {isUp ? "▲ +" : "▼ "}
            {Math.abs(diff)}
          </span>
        )}
      </p>
      <p className="hint" style={{ margin: "2px 0 0" }}>
        {isUp ? "up" : isDown ? "down" : "flat"} vs last week
      </p>
    </div>
  );
}

export default function WeeklyActivity({ slack }: { slack: SlackData | null }) {
  return (
    <div className="card">
      <div className="section-title">Weekly activity</div>
      {!slack ? (
        <div className="loading-text">Loading...</div>
      ) : !slack.latest ? (
        <div className="empty-state">No weekly snapshot data found in Slack yet.</div>
      ) : (
        <div className="grid grid-3">
          {Object.entries(slack.latest)
            .filter(([, v]) => typeof v === "number")
            .map(([key, value]) => (
              <Tile
                key={key}
                current={value as number}
                prev={(slack.previous?.[key] as number) ?? (value as number)}
                label={labelize(key)}
              />
            ))}
        </div>
      )}
    </div>
  );
}
