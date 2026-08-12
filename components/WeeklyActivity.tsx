interface SlackData {
  cachedAt: string;
  latest: any | null;
  previous: any | null;
}

function Delta({ current, prev, label }: { current: number; prev: number; label: string }) {
  const diff = current - prev;
  const isUp = diff > 0;
  const isFlat = diff === 0;
  return (
    <div className="stat">
      <div className="value">
        {current}{" "}
        {!isFlat && (
          <span className={`pill ${isUp ? "pill-up" : "pill-down"}`}>
            {isUp ? "+" : ""}
            {diff}
          </span>
        )}
      </div>
      <div className="label">{label}</div>
    </div>
  );
}

export default function WeeklyActivity({ slack }: { slack: SlackData | null }) {
  return (
    <div className="card">
      <h2>Weekly Activity</h2>
      {!slack ? (
        <div className="loading-text">Loading...</div>
      ) : !slack.latest ? (
        <div className="empty-state">
          No weekly snapshot data found in Slack yet.
        </div>
      ) : (
        <div className="stat-row">
          {Object.entries(slack.latest)
            .filter(([, v]) => typeof v === "number")
            .map(([key, value]) => (
              <Delta
                key={key}
                current={value as number}
                prev={(slack.previous?.[key] as number) ?? (value as number)}
                label={key}
              />
            ))}
        </div>
      )}
    </div>
  );
}
