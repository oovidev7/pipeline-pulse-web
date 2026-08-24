"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Agenda, AgendaDecision } from "@/lib/agenda";
import type { WeekDetail } from "@/lib/metrics";

const GBP = (n: number) =>
  "£" + Math.round(n || 0).toLocaleString("en-GB");

const clamp = (s: string, n: number) =>
  s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "") + "…";

const DATE = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

type Decision = "live" | "park" | "dead";

/**
 * A small "?" that expands an explanation in place. Click, not hover — this
 * page is read in meetings and on phones, where tooltips don't exist. Native
 * details/summary so it costs no state and closes itself sensibly.
 */
function Help({ children }: { children: React.ReactNode }) {
  return (
    <details className="help">
      <summary aria-label="What does this mean?">?</summary>
      <div className="help-body">{children}</div>
    </details>
  );
}

/**
 * The weekly agenda.
 *
 * Ordered, finite, one decision per item — the opposite of the dashboard this
 * replaced, which had nine sections in no order and no notion of being
 * finished. A meeting run off a browsing surface ambles because the surface
 * gives it nowhere to stop.
 */
export default function Agenda() {
  const [data, setData] = useState<Agenda | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  /** Which stat card is expanded to show the items behind its count. */
  const [openStat, setOpenStat] = useState<string | null>(null);
  /** Decisions taken in this session, so progress is visible as you go. */
  const [settled, setSettled] = useState<Record<string, string>>({});

  const load = useCallback(async (bust = false) => {
    try {
      const res = await fetch(`/api/agenda${bust ? "?refresh=1" : ""}`);
      const body = await res.json();
      if (!res.ok || body?.error) throw new Error(body?.error || `Failed (${res.status})`);
      setData(body);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Could not load the agenda");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const decide = async (dealId: string, decision: Decision, label: string) => {
    // "Dead" moves the deal to Lost in Attio, so it asks first.
    if (decision === "dead" && !confirm("Mark this deal Lost in Attio?")) return;
    setBusy(dealId);
    try {
      const res = await fetch("/api/deal-decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId, decision }),
      });
      const body = await res.json();
      if (!res.ok || body?.error) throw new Error(body?.error || "Write failed");
      setSettled((s) => ({ ...s, [dealId]: label }));
    } catch (err: any) {
      setError(err?.message || "Could not record that decision");
    } finally {
      setBusy(null);
    }
  };

  const total = (data?.decisions.length ?? 0) + (data?.queue.length ?? 0);
  const done = Object.keys(settled).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const delta = useMemo(() => {
    if (!data?.current || !data?.previous) return () => null;
    return (key: keyof NonNullable<Agenda["current"]>) => {
      const now = data.current![key] as number;
      const before = data.previous![key] as number;
      if (typeof now !== "number" || typeof before !== "number") return null;
      return now - before;
    };
  }, [data]);

  if (error && !data) {
    return (
      <div className="panel">
        <div className="head"><h1>Sales weekly</h1></div>
        <div className="err">{error}</div>
      </div>
    );
  }
  if (!data) return <div className="panel"><div className="loading">Loading the week…</div></div>;

  const stats: {
    label: string;
    key: keyof WeekDetail;
    help: string;
  }[] = [
    {
      label: "Deals reaching demo",
      key: "dealsReachingDemo",
      help: "Deals that moved into the Demo / discovery stage this week — new opportunities actually created. The result, where discovery calls are the effort.",
    },
    {
      label: "Discovery calls",
      key: "discoveryCalls",
      help: "Calls held with clubs still early on (Prospecting or Demo) — time spent winning new business.",
    },
    {
      label: "Progression calls",
      key: "progressionCalls",
      help: "Calls held with clubs further along (Qualified, Trialling, Proposal) — time spent advancing deals we already have.",
    },
    {
      label: "Conversations",
      key: "conversations",
      help: "People who engaged with us this week outside of calls — LinkedIn and WhatsApp threads, logged notes.",
    },
    {
      label: "Ecosystem meetings",
      key: "ecosystemMeetings",
      help: "External meetings with organisations Attio recognises but that aren't clubs — investors, advisory firms, multi-club groups, intermediaries. Counted separately so a heavy networking week never looks like pipeline. Calendar entries with guests the CRM doesn't know (dinners, blockers) count nowhere.",
    },
  ];

  return (
    <div className="panel">
      <div className="head">
        <div className="head-top">
          <h1>Sales weekly</h1>
          <div className="head-meta">{DATE(data.weekOf)}</div>
        </div>
        <div className="progress"><span style={{ width: `${pct}%` }} /></div>
        <div className="progress-label">
          {done} of {total} settled · {data.decisions.length} decision
          {data.decisions.length === 1 ? "" : "s"} + {data.queue.length} quick check
          {data.queue.length === 1 ? "" : "s"} — done when the bar is full
        </div>
      </div>

      {error && <div className="err">{error}</div>}

      {/* ---------------------------- numbers ---------------------------- */}
      <section>
        <div className="eyebrow">
          <span className="dot" />
          <span>Last week · vs the week before</span>
          <Help>
            {stats.map((s) => (
              <p key={s.key}>
                <b>{s.label}</b> — {s.help}
              </p>
            ))}
            <p>
              All five come straight from Attio — stage history, the calendar,
              and logged notes. Nobody types these numbers in.
            </p>
          </Help>
        </div>
        {data.current ? (
          <>
            <div className="stats">
              {stats.map(({ label, key, help }) => {
                const d = delta(key);
                const items = data.breakdown?.[key] ?? [];
                const open = openStat === key;
                return (
                  <button
                    type="button"
                    className={`stat ${open ? "open" : ""}`}
                    key={key}
                    title={help}
                    onClick={() => setOpenStat(open ? null : key)}
                  >
                    <div className="stat-label">{label}</div>
                    <div className="stat-value">{data.current![key] as number}</div>
                    <div className={`delta ${d && d > 0 ? "up" : d && d < 0 ? "down" : ""}`}>
                      {d === null ? "—" : d === 0 ? "no change" : d > 0 ? `+${d}` : `${d}`}
                    </div>
                    {items.length > 0 && <div className="stat-open-hint">{open ? "hide" : "show"}</div>}
                  </button>
                );
              })}
            </div>
            {/* The receipts: the actual deals, calls, and notes the count is
                made of. A number nobody can open is just an assertion. */}
            {openStat && (
              <div className="stat-items">
                {(data.breakdown?.[openStat as keyof WeekDetail] ?? []).length === 0 ? (
                  <p className="note" style={{ margin: 0 }}>Nothing counted last week.</p>
                ) : (
                  (data.breakdown![openStat as keyof WeekDetail])
                    .slice()
                    .sort((a, b) => b.at.localeCompare(a.at))
                    .map((item, i) => (
                      <div className="fact" key={i}>
                        <span className="bullet" />
                        <span>
                          <span className="qval" style={{ marginRight: 8 }}>
                            {new Date(item.at).toLocaleDateString("en-GB", { weekday: "short", day: "numeric" })}
                          </span>
                          {item.dealId ? (
                            <Link href={`/deal/${item.dealId}`} style={{ fontWeight: 500 }}>
                              {item.label}
                            </Link>
                          ) : (
                            item.label
                          )}
                          {item.excerpt && (
                            <span className="muted" style={{ display: "block", fontSize: 12.5, marginTop: 2 }}>
                              “{clamp(item.excerpt, 180)}”
                            </span>
                          )}
                        </span>
                      </div>
                    ))
                )}
              </div>
            )}
          </>
        ) : (
          <p className="note">No weekly figures yet.</p>
        )}
        <div className="coverage" style={{ marginTop: 20 }}>
          <div className="cov-item" style={{ alignSelf: "center" }}>
            <Help>
              <p>
                <b>Gap to target</b> — the commercial target minus what's been
                won this year.
              </p>
              <p>
                <b>Weighted pipeline</b> — every open deal's value multiplied by
                our actual win rate so far. The honest size of the pipeline; if
                it's below the gap, there isn't enough in play yet.
              </p>
              <p>
                <b>The stage strip</b> — where the open value actually sits.
                £45k in Trialling and £45k in Prospecting are not the same
                money. Click a stage to see its deals.
              </p>
            </Help>
          </div>
          <div className="cov-item">
            <div className="cov-label">Gap to target</div>
            <div className="cov-value">{GBP(data.coverage.gap)}</div>
          </div>
          <div className="cov-item">
            <div className="cov-label">Weighted at {Math.round(data.coverage.winRate * 100)}%</div>
            <div className="cov-value">{GBP(data.coverage.weighted)}</div>
          </div>
        </div>
        {/* The distribution a single open total flattens. */}
        <div className="stage-strip">
          {data.stages.map((s) => (
            <Link
              className="stage-cell"
              href={`/deals?stage=${encodeURIComponent(s.stage)}`}
              key={s.stage}
            >
              <div className="stage-cell-name">{s.stage.replace(" / discovery", "")}</div>
              <div className="stage-cell-count">{s.count}</div>
              <div className="stage-cell-meta">
                {GBP(s.value)}
                {s.avgDays !== null && ` · avg ${s.avgDays}d in stage`}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --------------------------- coming up --------------------------- */}
      {data.upcoming.length > 0 && (
        <section>
          <div className="eyebrow">
            <span className="dot" />
            <span>Coming up · next 7 days</span>
            <Help>
              <p>
                Every client call already in the diary, straight from Attio's
                calendar sync — with the deal's standing note and the research
                brief where one exists, so nobody walks in cold.
              </p>
            </Help>
          </div>
          {data.upcoming.map((c, i) => (
            <div className="item" key={i}>
              <div className="item-head">
                <div>
                  <div className="item-idx">
                    {new Date(c.at).toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    ·{" "}
                    {new Date(c.at).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="item-title">
                    {c.deal ? (
                      <Link href={`/deal/${c.deal.id}`}>
                        {c.deal.name.replace(/\s+[-–]\s+.*$/, "")}
                      </Link>
                    ) : (
                      c.title
                    )}
                  </div>
                  <div className="item-sub">
                    {c.title}
                    {c.deal
                      ? ` · ${c.deal.stage}`
                      : c.company
                        ? ` · ${c.company} · no deal yet`
                        : " · not in the pipeline yet"}
                  </div>
                </div>
                {c.deal && <div className="item-value">{GBP(c.deal.value)}</div>}
              </div>
              {c.verdict && (
                <div className="quote">
                  <span className="quote-label">The last word on this deal</span>
                  “{c.verdict}”
                </div>
              )}
              {c.brief && (
                <div className="quote">
                  <span className="quote-label">Prep brief</span>
                  {clamp(c.brief, 320)}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ----------------------------- moved ----------------------------- */}
      {data.moved.length > 0 && (
        <section>
          <div className="eyebrow"><span className="dot" /><span>Moved this week · read, don’t debate</span></div>
          <div className="facts" style={{ marginTop: 12 }}>
            {data.moved.map((m, i) => (
              <div className="fact" key={i}>
                <span className="bullet" />
                <span>
                  <Link href={`/deal/${m.deal.id}`}><b>{m.deal.name}</b></Link>
                  {" — "}{m.from ? `${m.from} → ${m.to}` : m.to}{" · "}{GBP(m.deal.value)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --------------------------- decisions --------------------------- */}
      <section>
        <div className="eyebrow">
          <span className="dot" />
          <span>Decisions · {data.decisions.length} need a call today</span>
          <Help>
            <p>
              A deal lands here when its <b>risk score reaches 70</b>, or when a
              note someone wrote contradicts what the deal is doing (the red
              box).
            </p>
            <p>
              <b>The score is a sum of the red chips.</b> Each chip is one
              problem with a fixed weight — no contacts reached is worth more
              than an overdue task — and problems that persist grow by about a
              point per week, so a deal left to rot climbs the list on its own.
              Hover the score to see the arithmetic.
            </p>
            <p>
              The buttons write straight to Attio: <b>Park it</b> takes the deal
              off this list until its revisit date (two weeks by default),{" "}
              <b>Still live</b> holds it off for one, and <b>Mark lost</b> moves
              the stage after asking.
            </p>
          </Help>
        </div>
        {data.decisions.length === 0 && (
          <p className="note">Nothing is flagged and no recorded verdict is contradicted. Skip to the queue.</p>
        )}
        {data.decisions.map((d, i) => (
          <DecisionItem
            key={d.deal.id}
            item={d}
            index={i + 1}
            total={total}
            settled={settled[d.deal.id]}
            busy={busy === d.deal.id}
            onDecide={decide}
          />
        ))}
      </section>

      {/* ----------------------------- queue ----------------------------- */}
      {data.queue.length > 0 && (
        <section>
          <div className="eyebrow">
            <span className="dot" />
            <span>Quick checks · alive or dead?</span>
            <Help>
              <p>
                Nothing has been logged for these deals on any channel we can
                read — no email, no meeting, no note, no WhatsApp touch — and
                nobody has written down why.
              </p>
              <p>
                That is <b>not</b> the same as the deal being dead: a
                conversation may be happening somewhere we can't see. Which is
                exactly why the question is asked instead of a score assigned.
              </p>
              <p>
                One click answers it, and the answer is written to Attio —
                so each deal only comes back if it goes quiet again.
              </p>
            </Help>
          </div>
          <p className="note" style={{ marginTop: 10 }}>
            {data.queueTotal} deals where nothing has been captured on any channel and no note explains
            why. These are questions, not findings — several are probably fine. One line each and they
            stop coming back.
            {data.queueTotal > data.queue.length &&
              ` Showing the ${data.queue.length} biggest by value; the other ${
                data.queueTotal - data.queue.length
              } wait for next week so this never becomes a wall.`}
          </p>
          <div className="queue">
            {data.queue.map((q) => (
              <div className="qrow" key={q.deal.id}>
                <div>
                  <div className="qname">
                    <Link href={`/deal/${q.deal.id}`}>{q.deal.name}</Link>
                  </div>
                  <div className="qmeta">
                    {q.deal.stage} ·{" "}
                    {q.days === null
                      ? "nothing has ever been logged"
                      : `nothing logged for ${q.days} days`}
                  </div>
                </div>
                <div className="qval">{GBP(q.deal.value)}</div>
                <div className="qbtns">
                  {settled[q.deal.id] ? (
                    <span className="decided">{settled[q.deal.id]}</span>
                  ) : (
                    <>
                      <button className="qbtn" disabled={busy === q.deal.id}
                        onClick={() => decide(q.deal.id, "live", "Still live")}>Live</button>
                      <button className="qbtn" disabled={busy === q.deal.id}
                        onClick={() => decide(q.deal.id, "park", "Parked")}>Park</button>
                      <button className="qbtn" disabled={busy === q.deal.id}
                        onClick={() => decide(q.deal.id, "dead", "Marked lost")}>Dead</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="foot">
        <div className="foot-text">
          Decisions write straight back to Attio. Nothing to update afterwards.{" "}
          <Link href="/deals" style={{ textDecoration: "underline" }}>Browse all deals</Link>
        </div>
        <div className="wordmark">powered by sentrum</div>
      </div>
    </div>
  );
}

function DecisionItem({
  item, index, total, settled, busy, onDecide,
}: {
  item: AgendaDecision;
  index: number;
  total: number;
  settled?: string;
  busy: boolean;
  onDecide: (id: string, d: Decision, label: string) => void;
}) {
  const { deal, visibility, factors, score, lastConversation, callsHeld, tension } = item;

  return (
    <div className="item">
      <div className="item-head">
        <div>
          <div className="item-idx">{index} of {total}{settled ? " · decided" : ""}</div>
          <div className="item-title">
            <Link href={`/deal/${deal.id}`}>{deal.name}</Link>
          </div>
          <div className="item-sub">
            {deal.stage} · {deal.ownerName || "Unassigned"} · {visibility.summary.split(".")[0]}
          </div>
        </div>
        <div className="item-value">{GBP(deal.value)}</div>
      </div>

      {!settled && (
        <>
          <div className="facts">
            {factors.map((f, i) => (
              <div className="fact" key={i}>
                <span className="bullet" />
                <span>{f.label}</span>
              </div>
            ))}
            {callsHeld > 0 && (
              <div className="fact"><span className="bullet" /><span>{callsHeld} calls held.</span></div>
            )}
          </div>

          {visibility.verdict && (
            <div className="quote">
              <span className="quote-label">The last word on this deal</span>
              <b>“{visibility.verdict}”</b>
            </div>
          )}
          {lastConversation?.excerpt && (
            <div className="quote">
              <span className="quote-label">
                Last conversation ·{" "}
                {new Date(lastConversation.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
                {" · "}
                <Link href={`/deal/${deal.id}`} style={{ textDecoration: "underline" }}>
                  read in full
                </Link>
              </span>
              {clamp(lastConversation.excerpt, 170)}
            </div>
          )}
          {tension && <div className="tension">{tension}</div>}
        </>
      )}

      <div className="actions">
        {settled ? (
          <span className="decided">{settled}</span>
        ) : (
          <>
            <button className="btn primary" disabled={busy}
              onClick={() => onDecide(deal.id, "live", "Still live")}>Still live</button>
            <button className="btn" disabled={busy}
              onClick={() => onDecide(deal.id, "park", "Parked")}>Park it</button>
            <button className="btn" disabled={busy}
              onClick={() => onDecide(deal.id, "dead", "Marked lost")}>Mark lost</button>
            <Link href={`/deal/${deal.id}`} className="btn">Open</Link>
            <span
              className="muted"
              style={{ fontSize: 12, marginLeft: 4, cursor: "help" }}
              title={
                factors
                  .map((f) => `${f.weight >= 0 ? "+" : ""}${f.weight}  ${f.label}`)
                  .join("\n") + `\n= ${score} (flagged at 70)`
              }
            >score {score}</span>
          </>
        )}
      </div>
    </div>
  );
}
