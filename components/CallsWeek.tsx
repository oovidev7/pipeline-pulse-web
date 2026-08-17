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

function formatTime(iso: string | null | undefined, allDay?: boolean): string {
  if (!iso) return "time TBC";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "time TBC";
  const opts: Intl.DateTimeFormatOptions = allDay
    ? { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }
    : { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" };
  return dt.toLocaleString("en-GB", opts) + (allDay ? " · all day" : "");
}

function isPast(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const dt = new Date(iso);
  return !Number.isNaN(dt.getTime()) && dt < new Date();
}

function startMs(iso: string | null | undefined): number {
  const t = iso ? new Date(iso).getTime() : NaN;
  return Number.isNaN(t) ? Number.MAX_SAFE_INTEGER : t;
}

/** A row is either a calendar event (maybe with brief) or a brief-only call. */
interface CallRow {
  key: string;
  title: string;
  start: string | null;
  allDay?: boolean;
  dealName?: string | null;
  person?: string | null;
  owners?: string | null;
  linked: boolean;
  externalEmails?: string[];
  brief?: Brief | null;
  briefOnly: boolean;
}

function BriefBlock({ brief }: { brief: Brief }) {
  const [open, setOpen] = useState(false);
  const footnotes = brief.footnotes ?? [];
  return (
    <div style={{ marginTop: 6 }}>
      {brief.brief && <p className="signal-text">{cleanSlackText(brief.brief)}</p>}
      {(footnotes.length > 0 || (brief.sources?.length ?? 0) > 0) && (
        <button
          className="reload small"
          style={{ marginTop: 6 }}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Hide detail" : `Detail${footnotes.length ? ` · ${footnotes.length}` : ""}`}
        </button>
      )}
      {open && (
        <div style={{ marginTop: 8 }}>
          {footnotes.map((f, j) => (
            <p className="signal-footnote" key={j}>
              {f.source && <strong>{cleanSlackText(f.source)}: </strong>}
              {cleanSlackText(f.detail || "")}
            </p>
          ))}
          {(brief.sources?.length ?? 0) > 0 && (
            <p className="hint" style={{ margin: "6px 0 0" }}>
              Sources: {brief.sources!.map(cleanSlackText).join(" · ")}
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

  // Calendar events first, each claiming its brief by title or club match.
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
        return {
          key: `ev-${c.id}`,
          title: c.summary,
          start: c.start,
          allDay: c.allDay,
          dealName: c.dealName ?? null,
          owners: c.owners?.join(" & ") ?? null,
          linked: c.linked,
          externalEmails: c.externalEmails ?? c.attendeeEmails,
          brief,
          briefOnly: false,
        };
      })
    : [];

  // Briefed calls the calendar can't see (e.g. the other rep's calendar).
  const briefRows: CallRow[] = briefs
    .filter((b) => !usedBriefs.has(b))
    .map((b, i) => ({
      key: `brief-${i}`,
      title: b.club || b.person || cleanSlackText(b.call_title || "Call"),
      start: b.start ?? null,
      dealName: null,
      person: b.person ?? null,
      owners: b.owner ?? null,
      linked: true,
      brief: b,
      briefOnly: true,
    }));

  const all = [...events, ...briefRows].sort((a, b) => startMs(a.start) - startMs(b.start));
  const upcoming = all.filter((r) => !isPast(r.start));
  const past = all.filter((r) => isPast(r.start));
  const visible = showPast ? all : upcoming;

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
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {visible.map((r) => {
            const gone = isPast(r.start);
            return (
              <div
                className={`call-item${!r.linked ? " unmatched" : ""}${gone ? " past-call" : ""}`}
                key={r.key}
              >
                <p className="call-title">
                  {r.title}
                  {r.dealName && <span className="hint"> · {r.dealName}</span>}
                  {!r.linked && (
                    <span className="pill pill-unlinked" style={{ marginLeft: 6 }}>
                      not linked to a deal
                    </span>
                  )}
                  {r.briefOnly && (
                    <span className="pill pill-callweek" style={{ marginLeft: 6 }}>
                      from briefs — not on the synced calendar
                    </span>
                  )}
                </p>
                <p className="call-time">
                  {formatTime(r.start, r.allDay)}
                  {gone && " · already happened"}
                  {r.person && ` · ${r.person}`}
                  {r.owners && ` · ${r.owners}`}
                  {!r.linked && (r.externalEmails?.length ?? 0) > 0
                    ? ` · ${r.externalEmails!.join(", ")}`
                    : ""}
                </p>
                {r.brief && <BriefBlock brief={r.brief} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
