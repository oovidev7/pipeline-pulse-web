interface CalendarEvent {
  id: string;
  summary: string;
  start: string | null;
  end: string | null;
  attendeeEmails: string[];
  accountKey: string;
}

interface MatchedCall extends CalendarEvent {
  dealId: string;
  dealName: string;
}

interface CalendarData {
  cachedAt: string;
  matched: MatchedCall[];
  unmatched: CalendarEvent[];
}

function formatTime(iso: string | null): string {
  if (!iso) return "time TBC";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function UpcomingCalls({ calendar }: { calendar: CalendarData | null }) {
  const allCalls = calendar
    ? [
        ...calendar.matched.map((c) => ({ ...c, matched: true as const })),
        ...calendar.unmatched.map((c) => ({ ...c, matched: false as const })),
      ]
    : [];

  return (
    <div className="card">
      <div className="section-title">
        Upcoming calls <span className="hint">— next 7 days</span>
      </div>
      {!calendar ? (
        <div className="loading-text">Loading...</div>
      ) : allCalls.length === 0 ? (
        <div className="empty-state">No external calls found on either calendar in the next 7 days.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {allCalls.map((c) => (
            <div className={`call-item${!c.matched ? " unmatched" : ""}`} key={c.id}>
              <div className="call-item-header">
                <div style={{ minWidth: 0 }}>
                  <p className="call-title">
                    {c.summary}
                    {c.matched && (c as MatchedCall).dealName && (
                      <span className="hint"> · {(c as MatchedCall).dealName}</span>
                    )}
                    {!c.matched && <span className="pill pill-unlinked" style={{ marginLeft: 6 }}>not linked to a deal</span>}
                  </p>
                  <p className="call-time">
                    {formatTime(c.start)}
                    {!c.matched && c.attendeeEmails.length > 0 ? ` · ${c.attendeeEmails.join(", ")}` : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
