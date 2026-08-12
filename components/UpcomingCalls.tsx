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
  if (!iso) return "All day";
  try {
    return new Date(iso).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function UpcomingCalls({ calendar }: { calendar: CalendarData | null }) {
  return (
    <div className="card">
      <h2>Upcoming Calls (next 7 days)</h2>
      {!calendar ? (
        <div className="loading-text">Loading...</div>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
            <div className="deal-meta" style={{ marginBottom: 6, fontWeight: 600 }}>
              Matched to deals
            </div>
            {calendar.matched.length === 0 ? (
              <div className="empty-state">No matched calls.</div>
            ) : (
              calendar.matched.map((c) => (
                <div className="call-item" key={c.id}>
                  <span>{c.dealName} — {c.summary}</span>
                  <span className="call-time">{formatTime(c.start)}</span>
                </div>
              ))
            )}
          </div>
          <div>
            <div className="deal-meta" style={{ marginBottom: 6, fontWeight: 600 }}>
              Unmatched
            </div>
            {calendar.unmatched.length === 0 ? (
              <div className="empty-state">No unmatched calls.</div>
            ) : (
              calendar.unmatched.map((c) => (
                <div className="call-item" key={c.id}>
                  <span>{c.summary}</span>
                  <span className="call-time">{formatTime(c.start)}</span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
