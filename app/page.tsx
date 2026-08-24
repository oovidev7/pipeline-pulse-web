"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Agenda, AgendaDecision } from "@/lib/agenda";

const GBP = (n: number) =>
  "£" + Math.round(n || 0).toLocaleString("en-GB");

const DATE = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

type Decision = "live" | "park" | "dead";

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

  const stats: { label: string; key: keyof NonNullable<Agenda["current"]> }[] = [
    { label: "Deals reaching demo", key: "dealsReachingDemo" },
    { label: "Discovery calls", key: "discoveryCalls" },
    { label: "Progression calls", key: "progressionCalls" },
    { label: "Conversations", key: "conversations" },
    { label: "Ecosystem meetings", key: "ecosystemMeetings" },
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
          {done} of {total} decided
          {data.queueTotal > data.queue.length &&
            ` · ${data.queueTotal - data.queue.length} more roll to next week`}
        </div>
      </div>

      {error && <div className="err">{error}</div>}

      {/* ---------------------------- numbers ---------------------------- */}
      <section>
        <div className="eyebrow"><span className="dot" /><span>The week · vs last week</span></div>
        {data.current ? (
          <div className="stats">
            {stats.map(({ label, key }) => {
              const d = delta(key);
              return (
                <div className="stat" key={key}>
                  <div className="stat-label">{label}</div>
                  <div className="stat-value">{data.current![key] as number}</div>
                  <div className={`delta ${d && d > 0 ? "up" : d && d < 0 ? "down" : ""}`}>
                    {d === null ? "—" : d === 0 ? "no change" : d > 0 ? `+${d}` : `${d}`}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="note">No weekly figures yet.</p>
        )}
        <div className="coverage" style={{ marginTop: 20 }}>
          <div className="cov-item">
            <div className="cov-label">Gap to target</div>
            <div className="cov-value">{GBP(data.coverage.gap)}</div>
          </div>
          <div className="cov-item">
            <div className="cov-label">Open</div>
            <div className="cov-value">{GBP(data.coverage.openValue)}</div>
          </div>
          <div className="cov-item">
            <div className="cov-label">Weighted at {Math.round(data.coverage.winRate * 100)}%</div>
            <div className="cov-value">{GBP(data.coverage.weighted)}</div>
          </div>
        </div>
      </section>

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
            <span>No visibility · alive or dead?</span>
          </div>
          <p className="note" style={{ marginTop: 10 }}>
            {data.queueTotal} deals where nothing has been captured on any channel and no note explains
            why. These are questions, not findings — several are probably fine. One line each and they
            stop coming back.
          </p>
          <div className="queue">
            {data.queue.map((q) => (
              <div className="qrow" key={q.deal.id}>
                <div>
                  <div className="qname">
                    <Link href={`/deal/${q.deal.id}`}>{q.deal.name}</Link>
                  </div>
                  <div className="qmeta">
                    {q.deal.stage} · sees {q.channels.length ? q.channels.join(", ") : "nothing"}
                  </div>
                </div>
                <div className="qval">
                  {q.days === null ? "never" : `${q.days}d`} · {GBP(q.deal.value)}
                </div>
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
            <div className="quote">Recorded verdict — <b>“{visibility.verdict}”</b></div>
          )}
          {lastConversation?.excerpt && (
            <div className="quote">
              <b>{lastConversation.title}</b> — {lastConversation.excerpt}
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
            <span className="muted" style={{ fontSize: 12, marginLeft: 4 }}>score {score}</span>
          </>
        )}
      </div>
    </div>
  );
}
