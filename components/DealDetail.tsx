"use client";

import { DealRecord, OpenTask, StageBenchmark } from "@/lib/types";
import { STAGE_LABELS } from "./StageSnapshot";
import { cleanSlackText, cleanSlackUrl } from "@/lib/slack-text";

export interface DealContext {
  /** Gmail: last message exchanged with this deal's first contact. */
  activity?: {
    lastContactDate: string | null;
    direction: "ours" | "theirs" | null;
    snippet: string | null;
  } | null;
  /** Google Calendar: client calls matched to this deal in the next 7 days. */
  calls?: { summary: string; start: string | null; allDay?: boolean }[];
  /** Attio: open tasks linked to this deal. */
  tasks?: OpenTask[];
  /** Slack MARKET_SIGNALS: research signal for this club. */
  signal?: {
    signal: string;
    why_it_matters?: string;
    source_url?: string;
    source_date?: string;
  } | null;
  /** Slack CALL_BRIEFS: prepared brief for this club. */
  brief?: { brief?: string; sources?: string[] } | null;
  /** Slack MEETING_NOTES: Granola meeting summaries for this club, via the weekly agent. */
  meetings?: { meeting_date?: string; summary?: string; attendees?: string[] }[];
  /** How deals historically behave in this deal's current stage. */
  benchmark?: StageBenchmark | null;
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return null;
  return Math.max(0, Math.round((Date.now() - dt.getTime()) / 86_400_000));
}

/** A labelled fact with the connector it came from, so provenance is visible. */
function Fact({
  label,
  source,
  children,
  muted,
}: {
  label: string;
  source: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="fact">
      <p className="fact-label">
        {label} <span className="fact-source">{source}</span>
      </p>
      <p className={`fact-value${muted ? " muted-value" : ""}`}>{children}</p>
    </div>
  );
}

export default function DealDetail({
  deal,
  context,
}: {
  deal: DealRecord;
  context: DealContext;
}) {
  const { activity, calls = [], tasks = [], signal, brief, meetings = [], benchmark } =
    context;

  const journey = deal.stageJourney;
  const totalAge = daysSince(deal.createdAt);
  const lastContactDays = daysSince(activity?.lastContactDate);
  const overdueTasks = tasks.filter((t) => t.overdue).length;
  const signalUrl = cleanSlackUrl(signal?.source_url);

  // Which connectors actually contributed anything for this deal — a missing
  // source is as informative as a present one.
  const sources: { name: string; present: boolean }[] = [
    { name: "Attio", present: true },
    { name: "Gmail", present: Boolean(activity?.lastContactDate) },
    { name: "Calendar", present: calls.length > 0 },
    { name: "Tasks", present: tasks.length > 0 },
    { name: "Research", present: Boolean(signal || brief) },
    { name: "Granola", present: meetings.length > 0 },
  ];

  return (
    <div className="deal-detail">
      <div className="detail-block">
        <p className="detail-heading">Journey</p>
        {journey.length === 0 ? (
          <p className="fact-value muted-value">
            No stage history available for this deal.
          </p>
        ) : (
          <div className="journey">
            {journey.map((step, i) => (
              <span key={i} className="journey-step">
                {i > 0 && <span className="journey-arrow">→</span>}
                <span className={step.isCurrent ? "journey-current" : undefined}>
                  {STAGE_LABELS[step.stage] || step.stage}
                </span>{" "}
                <span className="hint">
                  {step.days}d{step.isCurrent ? " · now" : ""}
                </span>
              </span>
            ))}
          </div>
        )}
        <p className="hint" style={{ margin: "6px 0 0" }}>
          Created {fmtDate(deal.createdAt)}
          {totalAge !== null && ` · ${totalAge}d old`}
          {journey.length > 1 && ` · ${journey.length - 1} stage change${journey.length > 2 ? "s" : ""}`}
        </p>
        {benchmark?.medianDaysToAdvance !== null &&
          benchmark?.medianDaysToAdvance !== undefined &&
          (benchmark?.advanced ?? 0) >= 3 &&
          journey.length > 0 && (
            <p className="hint" style={{ margin: "2px 0 0" }}>
              Deals that advanced out of {STAGE_LABELS[deal.stage] || deal.stage} took
              a median {Math.round(benchmark.medianDaysToAdvance)}d — this one is at{" "}
              {journey[journey.length - 1].days}d
              {journey[journey.length - 1].days >
                benchmark.medianDaysToAdvance * 1.5 && (
                <span className="overdue-date"> · behind the curve</span>
              )}
              .
            </p>
          )}
      </div>

      <div className="detail-grid">
        <Fact label="Last email" source="Gmail" muted={!activity?.lastContactDate}>
          {activity?.lastContactDate ? (
            <>
              {fmtDate(activity.lastContactDate)}
              {lastContactDays !== null && ` · ${lastContactDays}d ago`}
              {activity.direction && (
                <span className="hint">
                  {" "}
                  · {activity.direction === "ours" ? "we sent last" : "they replied last"}
                </span>
              )}
            </>
          ) : (
            "No email history found"
          )}
        </Fact>

        <Fact
          label="Next call"
          source="Calendar + Attio"
          muted={calls.length === 0 && !deal.nextCall}
        >
          {calls.length > 0 ? (
            `${calls[0].summary} · ${fmtDate(calls[0].start)}`
          ) : deal.nextCall ? (
            <>
              {fmtDate(deal.nextCall)}
              {/* A next_call in the past is not a booked call — the meeting has
                  been and gone with nothing scheduled to replace it. */}
              {new Date(deal.nextCall) < new Date() && (
                <span className="overdue-date"> · lapsed, nothing rebooked</span>
              )}
            </>
          ) : (
            "Nothing booked"
          )}
        </Fact>

        <Fact
          label="Contacts"
          source={deal.contactsViaCompany ? "Attio · via company card" : "Attio"}
          muted={deal.personIds.length === 0}
        >
          {deal.personIds.length === 0
            ? "None — nobody linked to the deal or its company"
            : deal.personIds.length === 1
            ? "1 contact · single-threaded"
            : `${deal.personIds.length} contacts`}
        </Fact>

        <Fact label="Open tasks" source="Attio" muted={tasks.length === 0}>
          {tasks.length === 0
            ? "None"
            : `${tasks.length} open${overdueTasks > 0 ? ` · ${overdueTasks} overdue` : ""}`}
        </Fact>
      </div>

      {activity?.snippet && (
        <div className="detail-block">
          <p className="detail-heading">
            Last message <span className="fact-source">Gmail</span>
          </p>
          <p className="detail-quote">{activity.snippet}</p>
        </div>
      )}

      {brief?.brief && (
        <div className="detail-block">
          <p className="detail-heading">
            Call brief <span className="fact-source">Weekly research</span>
          </p>
          <p className="fact-value">{cleanSlackText(brief.brief)}</p>
          {brief.sources?.length ? (
            <p className="hint" style={{ margin: "4px 0 0" }}>
              Sources: {brief.sources.map(cleanSlackText).join(" · ")}
            </p>
          ) : null}
        </div>
      )}

      {meetings.length > 0 && (
        <div className="detail-block">
          <p className="detail-heading">
            Meetings <span className="fact-source">Granola via weekly research</span>
          </p>
          {meetings.map((m, i) => (
            <div key={i} style={{ marginBottom: i < meetings.length - 1 ? 8 : 0 }}>
              <p className="fact-value">
                {m.meeting_date && <strong>{m.meeting_date} — </strong>}
                {cleanSlackText(m.summary || "")}
              </p>
              {m.attendees?.length ? (
                <p className="hint" style={{ margin: "2px 0 0" }}>
                  With: {m.attendees.join(", ")}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {signal && (
        <div className="detail-block">
          <p className="detail-heading">
            Market signal <span className="fact-source">Weekly research</span>
            {signal.source_date && <span className="hint"> · {signal.source_date}</span>}
          </p>
          <p className="fact-value">{cleanSlackText(signal.signal)}</p>
          {signal.why_it_matters && (
            <p className="signal-why">
              <strong>Why it matters:</strong> {cleanSlackText(signal.why_it_matters)}
            </p>
          )}
          {signalUrl && (
            <p style={{ margin: "4px 0 0" }}>
              <a className="signal-source" href={signalUrl} target="_blank" rel="noreferrer">
                View source ↗
              </a>
            </p>
          )}
        </div>
      )}

      {tasks.length > 0 && (
        <div className="detail-block">
          <p className="detail-heading">
            Tasks <span className="fact-source">Attio</span>
          </p>
          {tasks.map((t) => (
            <p key={t.id} className="fact-value" style={{ marginBottom: 2 }}>
              {t.url ? (
                <a className="task-link" href={t.url} target="_blank" rel="noreferrer">
                  {t.content}
                </a>
              ) : (
                t.content
              )}{" "}
              <span className={t.overdue ? "overdue-date" : "hint"}>
                {t.overdue ? "overdue" : "due"} {fmtDate(t.deadlineAt)}
              </span>
            </p>
          ))}
        </div>
      )}

      {deal.stallNotes && (
        <div className="detail-block">
          <p className="detail-heading">
            Stall note <span className="fact-source">Attio</span>
          </p>
          <p className="detail-quote">{deal.stallNotes}</p>
        </div>
      )}

      <div className="detail-sources">
        <span className="hint">Data sources:</span>
        {sources.map((s) => (
          <span key={s.name} className={`source-chip${s.present ? " on" : ""}`}>
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
}
