"use client";

import { useState } from "react";
import { cleanSlackText } from "@/lib/slack-text";

// One card for the week's client calls: the calendar events themselves, each
// with its prep brief attached when the weekly research produced one, plus
// briefed calls the (currently single-token) calendar can't see.

interface CalendarEvent {
  id: string;
  summary: string;
  start: string | null;
  end: string | null;
  allDay?: boolean;
  attendeeEmails: string[];
  externalEmails?: string[];
  owners?: string[];
  dealId?: string;
  dealName?: string;
}

interface CalendarData {
  cachedAt: string;
  matched: CalendarEvent[];
  unmatched: CalendarEvent[];
  internalFilteredCount?: number;
}

interface Brief {
  call_title?: string;
  person?: string | null;
  club?: string | null;
  owner?: string | null;
  start?: string | null;
  mode?: string;
  sources?: string[];
  brief?: string;
  footnotes?: { source?: string; detail?: string }[];
}

function clubOf(dealName: string | undefined): string | null {
  if (!dealName) return null;
  return dealName.split(/\s+[-–]\s+/)[0].trim().toLowerCase();
}

function startMs(iso: string | null | undefined): number {
  const t = iso ? new Date(iso).getTime() : NaN;
  return Number.isNaN(t) ? Number.MAX_SAFE_INTEGER : t;
}

function isPast(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const dt = new Date(iso);
  return !Number.isNaN(dt.getTime()) && dt < new Date();
}

/** "Today" / "Tomorrow" / "Thu 20 Aug" — the grouping header. */
function dayLabel(iso: string | null | undefined): string {
  if (!iso) return "Date TBC";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "Date TBC";
  const midnight = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((midnight(dt) - midnight(new Date())) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  return dt.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function timeLabel(iso: string | null | undefined, allDay?: boolean): string {
  if (!iso) return "time TBC";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "time TBC";
  if (allDay) return "all day";
  return dt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

interface CallRow {
  key: string;
  title: string;
  subtitle: string | null;
  start: string | null;
  allDay?: boolean;
  owners?: string | null;
  linked: boolean;
  externalEmails?: string[];
  brief?: Brief | null;
  briefOnly: boolean;
}

function BriefBlock({ brief }: { brief: Brief }) {
  const [open, setOpen] = useState(false);
  const footnotes = (brief.footnotes ?? []).filter((f) => f.detail);
  const sources = brief.sources ?? [];

  return (
    <div className="brief">
      <p className="brief-label">
        Prep
        {brief.mode === "research" && (
          <span className="hint"> · no history, researched</span>
        )}
      </p>
      {brief.brief && <p className="brief-text">{cleanSlackText(brief.brief)}</p>}

      {(footnotes.length > 0 || sources.length > 0) && (
        <button className="brief-toggle" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide detail" : `Detail${footnotes.length ? ` · ${footnotes.length}` : ""}`}
        </button>
      )}

      {open && (
        <div className="brief-detail">
          {footnotes.map((f, i) => (
            <p className="brief-note" key={i}>
              {f.source && (
                <span className="brief-note-source">{cleanSlackText(f.source)}</span>
              )}
              {cleanSlackText(f.detail || "")}
            </p>
          ))}
          {sources.length > 0 && (
            <p className="brief-sources">
              {sources.map((s, i) => (
                <span className="source-chip on" key={i}>
                  {cleanSlackText(s)}
                </span>
              ))}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function CallsWeek({
  calendar,
  briefsData,
  calendarError,
  briefsError,
}: {
  calendar: CalendarData | null;
  briefsData: { week_of?: string; briefs?: Brief[] } | null;
  calendarError?: string | null;
  briefsError?: string | null;
}) {
  const [showPast, setShowPast] = useState(false);

  const briefs = briefsData?.briefs ?? [];
  const usedBriefs = new Set<Brief>();

  const events: CallRow[] = calendar
    ? [
        ...(calendar.matched ?? []).map((c) => ({ ...c, linked: true })),
        ...(calendar.unmatched ?? []).map((c) => ({ ...c, linked: false })),
      ].map((c) => {
        const club = clubOf(c.dealName);
        const brief =
          briefs.find(
            (b) =>
              cleanSlackText(b.call_title || "") === c.summary ||
              (club && (b.club || "").trim().toLowerCase() === club)
          ) ?? null;
        if (brief) usedBriefs.add(brief);
        // Lead with the club, since that's what the call is actually about.
        const club_display = c.dealName || brief?.club || null;
        return {
          key: `ev-${c.id}`,
          title: club_display || c.summary,
          subtitle: club_display ? c.summary : null,
          start: c.start,
          allDay: c.allDay,
          owners: c.owners?.join(" & ") ?? null,
          linked: c.linked,
          externalEmails: c.externalEmails ?? c.attendeeEmails,
          brief,
          briefOnly: false,
        };
      })
    : [];

  const briefRows: CallRow[] = briefs
    .filter((b) => !usedBriefs.has(b))
    .map((b, i) => ({
      key: `brief-${i}`,
      title: b.club || b.person || cleanSlackText(b.call_title || "Call"),
      subtitle: b.club && b.person ? b.person : cleanSlackText(b.call_title || ""),
      start: b.start ?? null,
      owners: b.owner ?? null,
      linked: true,
      brief: b,
      briefOnly: true,
    }));

  const all = [...events, ...briefRows].sort((a, b) => startMs(a.start) - startMs(b.start));
  const upcoming = all.filter((r) => !isPast(r.start));
  const past = all.filter((r) => isPast(r.start));
  const visible = showPast ? all : upcoming;

  // Group into day buckets so the week reads as a schedule, not a list.
  const groups: { label: string; rows: CallRow[] }[] = [];
  for (const row of visible) {
    const label = dayLabel(row.start);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.rows.push(row);
    else groups.push({ label, rows: [row] });
  }

  const loading = !calendar && !briefsData && !calendarError && !briefsError;

  return (
    <div className="card">
      <div className="section-title" style={{ justifyContent: "space-between" }}>
        <span>
          Calls this week{" "}
          <span className="hint">— client calls with their prep briefs</span>
        </span>
        {past.length > 0 && (
          <button className="wk" onClick={() => setShowPast((v) => !v)}>
            {showPast ? "Hide past" : `Show ${past.length} past`}
          </button>
        )}
      </div>

      {calendarError && (
        <div className="error-state" style={{ marginBottom: 8 }}>
          Calendar: {calendarError}
        </div>
      )}
      {briefsError && (
        <div className="error-state" style={{ marginBottom: 8 }}>
          Briefs: {briefsError}
        </div>
      )}

      {loading ? (
        <div className="loading-text">Loading...</div>
      ) : visible.length === 0 ? (
        <div className="empty-state">
          No upcoming client calls found
          {past.length > 0 && ` (${past.length} already happened)`}
          {calendar?.internalFilteredCount
            ? ` · ${calendar.internalFilteredCount} internal-only events hidden`
            : ""}
          .
        </div>
      ) : (
        <div className="call-days">
          {groups.map((g) => (
            <div className="call-day" key={g.label}>
              <p className="call-day-label">{g.label}</p>
              {g.rows.map((r) => {
                const gone = isPast(r.start);
                return (
                  <div className={`call-row${gone ? " past-call" : ""}`} key={r.key}>
                    <span className="call-time-col">{timeLabel(r.start, r.allDay)}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p className="call-name">
                        {r.title}
                        {!r.linked && (
                          <span className="pill pill-unlinked" style={{ marginLeft: 6 }}>
                            no deal
                          </span>
                        )}
                        {r.briefOnly && (
                          <span className="pill pill-callweek" style={{ marginLeft: 6 }}>
                            not on synced calendar
                          </span>
                        )}
                      </p>
                      <p className="call-meta">
                        {[r.subtitle, r.owners].filter(Boolean).join(" · ")}
                        {!r.linked && (r.externalEmails?.length ?? 0) > 0
                          ? `${r.subtitle || r.owners ? " · " : ""}${r.externalEmails!.join(", ")}`
                          : ""}
                      </p>
                      {r.brief ? (
                        <BriefBlock brief={r.brief} />
                      ) : (
                        !gone && <p className="brief-missing">No brief prepared</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
