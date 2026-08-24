"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const GBP = (n: number) => "£" + Math.round(n || 0).toLocaleString("en-GB");
const DAY = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();

/**
 * One deal, in full. Where a Slack link or an agenda item lands.
 *
 * Its spine is the timeline — calls, notes and stage moves interleaved. That
 * only became possible once notes and meetings were read; before that a deal
 * page could only have shown metadata the old dashboard already displayed.
 *
 * It is also where the CRM gets repaired: an unnamed contact or a duplicate is
 * shown next to the call that revealed it, because that is the moment someone
 * knows who the person actually is.
 */
export default function DealPage() {
  const { id } = useParams<{ id: string }>();
  const [d, setD] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/deal/${id}`);
      const body = await res.json();
      if (!res.ok || body?.error) throw new Error(body?.error || `Failed (${res.status})`);
      setD(body);
    } catch (err: any) {
      setError(err?.message || "Could not load this deal");
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (error) {
    return (
      <div className="panel">
        <Link className="back" href="/">← Sales weekly</Link>
        <div className="err">{error}</div>
      </div>
    );
  }
  if (!d) return <div className="panel"><div className="loading">Loading…</div></div>;

  const { deal, visibility, factors, score, notes, meetings, contacts, tasks, benchmark, hygiene } = d;
  const now = new Date().toISOString();

  // Calls, notes and stage moves on one spine, newest first.
  const events = [
    ...meetings.map((m: any) => ({
      at: m.startsAt, title: m.title || "Call", kind: m.startsAt > now ? "Upcoming" : "Call",
      who: m.externalEmails.join(", "), body: "", call: true,
    })),
    ...notes.map((n: any) => ({
      at: n.createdAt, title: n.title, kind: n.channel, who: "", body: n.excerpt, call: false,
    })),
    ...deal.stageJourney.map((s: any) => ({
      at: s.enteredAt, title: `Moved to ${s.stage}`, kind: "Stage", who: "", body: "", call: false,
    })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  const channels: string[] = visibility?.channels ?? [];
  const sources = ["email", "calendar", "meeting", "linkedin", "whatsapp", "manual"];
  const dupNames = new Set(
    (hygiene?.duplicates ?? []).flatMap((g: any[]) => g.map((p) => p.id))
  );

  return (
    <div className="panel">
      <Link className="back" href="/">← Sales weekly</Link>

      <div className="head">
        <div className="head-top">
          <div>
            <h1>{deal.name.replace(/\s+[-–]\s+.*$/, "")}</h1>
            <div className="sub">
              <span className="badge">{deal.stage}</span>
              {visibility && (
                <span className={`badge ${visibility.state === "active" ? "live" : visibility.state === "dark" ? "dark" : ""}`}>
                  {visibility.state === "active" && <span className="dot" />}
                  {visibility.state === "active"
                    ? `Active · ${visibility.daysSinceCapture ?? 0} days ago`
                    : visibility.state === "dark" ? "No visibility" : "Quiet"}
                </span>
              )}
              <span>{deal.ownerName || "Unassigned"}</span>
            </div>
          </div>
          <div>
            <div className="value">{GBP(deal.value)}</div>
            <div className="value-cap">Deal value</div>
          </div>
        </div>
      </div>

      <div className="cols">
        <div className="main">
          <div className="block">
            <div className="eyebrow"><span className="dot" /><span>Where this stands</span></div>
            <div className="facts" style={{ marginTop: 12 }}>
              <div className="fact"><span className="bullet" /><span>{visibility?.summary ?? "No visibility data."}</span></div>
              {benchmark?.medianDaysToAdvance != null && (
                <div className="fact">
                  <span className="bullet" />
                  <span>
                    Deals that advanced from {deal.stage} took a median of{" "}
                    {Math.round(benchmark.medianDaysToAdvance)} days
                    {benchmark.advanced < 3 && ` — from just ${benchmark.advanced} deal${benchmark.advanced === 1 ? "" : "s"}, so treat it loosely`}.
                  </span>
                </div>
              )}
              {visibility?.nextMeetingAt && (
                <div className="fact"><span className="bullet" /><span>Next call booked for {DAY(visibility.nextMeetingAt)}.</span></div>
              )}
            </div>
            {visibility?.verdict && (
              <div className="quote">Recorded verdict — <b>“{visibility.verdict}”</b></div>
            )}
          </div>

          <div className="block">
            <div className="eyebrow"><span className="dot" /><span>What has happened</span></div>
            {events.length === 0 ? (
              <p className="note">Nothing recorded against this deal yet.</p>
            ) : (
              <div className="tl">
                {events.slice(0, 14).map((e, i) => (
                  <div className={`ev ${e.call ? "call" : ""}`} key={i}>
                    <div className="ev-top">
                      <span className="ev-date">{DAY(e.at)}</span>
                      <span className="ev-title">{e.title}</span>
                      <span className="ev-kind">{e.kind}</span>
                    </div>
                    {e.body && <div className="ev-body">“{e.body}”</div>}
                    {e.who && <div className="ev-who">{e.who}</div>}
                  </div>
                ))}
              </div>
            )}
            {meetings.length > notes.length && (
              <p className="note">
                {meetings.length} calls held, {notes.length} written up. The gap is where the detail went.
              </p>
            )}
          </div>

          {tasks.length > 0 && (
            <div className="block">
              <div className="eyebrow"><span className="dot" /><span>Tasks</span></div>
              <div className="facts" style={{ marginTop: 12 }}>
                {tasks.map((t: any) => (
                  <div className="fact" key={t.id}>
                    <span className="bullet" />
                    <span>
                      {t.content}
                      {t.deadlineAt && (
                        <span className={t.overdue ? "" : "muted"} style={t.overdue ? { color: "var(--destructive)" } : undefined}>
                          {" "}· {t.overdue ? "overdue" : "due"} {new Date(t.deadlineAt).toLocaleDateString("en-GB")}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="rail">
          <div className="block">
            <div className="eyebrow"><span className="dot" /><span>People</span></div>

            {(hygiene?.callOnly ?? []).map((email: string) => (
              <div className="person gap" key={email}>
                <div className="p-name">{email} <span className="flag">Not linked</span></div>
                <div className="p-meta">Has been on a call but belongs to no contact on this deal.</div>
                <div className="p-acts">
                  <a className="chip" href={`mailto:${email}`}>Email</a>
                </div>
              </div>
            ))}

            {/*
              A club card can hold a dozen names nobody has ever written to —
              Aston Villa has ten. Rendering all of them buries the two that
              matter, so only people we have reached or flagged get a card and
              the rest become a count.
            */}
            {contacts
              .filter((c: any) => c.lastEmailInteraction || dupNames.has(c.id) || c.name === "Unknown")
              .sort((a: any, b: any) =>
                (b.lastEmailInteraction ?? "").localeCompare(a.lastEmailInteraction ?? "")
              )
              .map((c: any) => (
              <div className={`person ${dupNames.has(c.id) ? "gap" : ""}`} key={c.id}>
                <div className="p-name">
                  {c.name === "Unknown" ? c.email || "Unnamed contact" : c.name}
                  {c.name === "Unknown" && <span className="flag">No name on record</span>}
                  {dupNames.has(c.id) && <span className="flag">Duplicate</span>}
                </div>
                <div className="p-meta">
                  {c.email || "no address"}
                  {c.connectionStrength && ` · ${c.connectionStrength.toLowerCase()} connection`}
                  {c.lastEmailInteraction
                    ? ` · last email ${new Date(c.lastEmailInteraction).toLocaleDateString("en-GB")}`
                    : " · never emailed"}
                </div>
                <div className="p-acts">
                  {c.email && <a className="chip" href={`mailto:${c.email}`}>Email</a>}
                  {/* The bridge extension fills `linkedin` for captured threads;
                      a real profile link beats a name search whenever it exists. */}
                  {c.linkedin ? (
                    <a className="chip" target="_blank" rel="noreferrer" href={c.linkedin}>
                      Open LinkedIn
                    </a>
                  ) : (
                    <a className="chip" target="_blank" rel="noreferrer"
                       href={`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
                         `${c.name === "Unknown" ? "" : c.name} ${deal.name.replace(/\s+[-–]\s+.*$/, "")}`.trim()
                       )}`}>Find on LinkedIn</a>
                  )}
                </div>
              </div>
            ))}
            <p className="note" style={{ fontSize: 12.5 }}>
              {contacts.length} on the club card, {contacts.filter((c: any) => c.lastEmailInteraction).length} reached
              {contacts.filter((c: any) => !c.lastEmailInteraction && !dupNames.has(c.id) && c.name !== "Unknown").length > 0 &&
                ` · ${contacts.filter((c: any) => !c.lastEmailInteraction && !dupNames.has(c.id) && c.name !== "Unknown").length} never contacted, not shown`}.
            </p>
          </div>

          <div className="block">
            <div className="eyebrow"><span className="dot" /><span>Risk score</span></div>
            <div className="score-head">
              <span className="score-num">{score}</span>
              <span className="score-cap">threshold 70</span>
            </div>
            <div className="factors">
              {factors.length === 0 && <div className="factor muted">Nothing flagged.</div>}
              {factors.map((f: any, i: number) => (
                <div className={`factor ${f.kind === "unknown" ? "unknown" : ""}`} key={i}>
                  <span>{f.label}</span>
                  <span className={`fw ${f.weight < 0 ? "neg" : ""}`}>
                    {f.weight === 0 ? "—" : f.weight > 0 ? `+${f.weight}` : f.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="block">
            <div className="eyebrow"><span className="dot" /><span>Sources</span></div>
            <div className="sources">
              {sources.map((s) => (
                <span className={`src ${channels.includes(s) ? "" : "off"}`} key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
