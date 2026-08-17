import { cleanSlackText } from "@/lib/slack-text";

interface RoundtableData {
  needsInvite: boolean;
  found: boolean;
  prompt: string | null;
  postedAt: string | null;
  replies: { userId: string; name: string | null; text: string; ts: string }[];
  notReplied: string[] | null;
}

export default function Roundtable({
  data,
  error,
}: {
  data: RoundtableData | null;
  error?: string | null;
}) {
  return (
    <div className="card">
      <div className="section-title">
        Round-table <span className="hint">— highlights, challenges, market insights</span>
      </div>
      {error ? (
        <div className="error-state">{error}</div>
      ) : !data ? (
        <div className="loading-text">Loading...</div>
      ) : data.needsInvite ? (
        <div className="empty-state">
          The bot can&apos;t read #sentrum-sales yet — run{" "}
          <code>/invite @Pipeline Pulse</code> in that channel and refresh.
        </div>
      ) : !data.found ? (
        <div className="empty-state">No round-table thread found this week.</div>
      ) : (
        <>
          {data.prompt && (
            <p className="hint" style={{ margin: "0 0 10px" }}>
              {cleanSlackText(data.prompt).slice(0, 200)}
              {data.postedAt &&
                ` · posted ${new Date(data.postedAt).toLocaleDateString("en-GB")}`}
            </p>
          )}
          {data.replies.length === 0 ? (
            <div className="empty-state">No replies yet.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.replies.map((r) => (
                <div className="deal-card" key={r.ts}>
                  <p className="deal-name">{r.name || "Team member"}</p>
                  <p className="signal-text" style={{ whiteSpace: "pre-wrap" }}>
                    {cleanSlackText(r.text)}
                  </p>
                </div>
              ))}
            </div>
          )}
          {data.notReplied && data.notReplied.length > 0 && (
            <p className="hint" style={{ marginTop: 10 }}>
              Not yet replied:{" "}
              <strong style={{ fontWeight: 500, color: "var(--danger)" }}>
                {data.notReplied.join(", ")}
              </strong>
            </p>
          )}
          {data.replies.length > 0 && data.replies.some((r) => !r.name) && (
            <p className="hint" style={{ marginTop: 8 }}>
              Names need the <code>users:read</code> scope on the Slack app.
            </p>
          )}
        </>
      )}
    </div>
  );
}
