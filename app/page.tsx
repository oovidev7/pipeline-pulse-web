"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Agenda, AgendaDecision, AgendaMarket, AgendaMove } from "@/lib/agenda";
import type { MetricItem } from "@/lib/metrics";

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

const TIME = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const WHEN = (iso: string) =>
  `${new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  })} · ${TIME(iso)}`;

/** "28 Sep – 4 Oct" for a Monday-to-Monday period (end exclusive). */
const RANGE = (from: string, to: string) => {
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
  return `${fmt(new Date(from))} – ${fmt(new Date(new Date(to).getTime() - 86_400_000))}`;
};

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
  /** Counterparts hidden this session, for instant feedback and undo. */
  const [dismissed, setDismissed] = useState<Record<string, string>>({});
  /** The per-person view; null is everyone. */
  const [owner, setOwner] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

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

  const hideCounterpart = async (companyId: string, name: string, hide: boolean) => {
    // Optimistic: the card reacts instantly, the server write follows. If the
    // write fails, the card comes back with the error shown.
    setDismissed((d) => {
      const next = { ...d };
      if (hide) next[companyId] = name;
      else delete next[companyId];
      return next;
    });
    try {
      const res = await fetch("/api/hide-counterpart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, name, hide }),
      });
      const body = await res.json();
      if (!res.ok || body?.error) throw new Error(body?.error || "Write failed");
    } catch (err: any) {
      setDismissed((d) => {
        const next = { ...d };
        if (hide) delete next[companyId];
        else next[companyId] = name;
        return next;
      });
      setError(err?.message || "Could not update");
    }
  };

  const total = (data?.decisions.length ?? 0) + (data?.queue.length ?? 0);
  const done = Object.keys(settled).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const refresh = async () => {
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  };

  if (error && !data) {
    return (
      <div className="panel">
        <div className="head"><h1>Sales weekly</h1></div>
        <div className="err">{error}</div>
      </div>
    );
  }
  if (!data) return <div className="panel"><div className="loading">Loading the week…</div></div>;

  /** The per-person view: lists narrow to one owner, the numbers stay team-wide. */
  const mine = (deal: { ownerName: string | null }) =>
    !owner || deal.ownerName?.trim() === owner;

  const cur = data.current;
  const prev = data.previous;
  const b = data.breakdown;
  const diff = (now: number, before: number | undefined) =>
    prev && typeof before === "number" ? now - before : null;

  const pipelineCalls = data.upcoming.filter((c) => c.deal);
  // Calls with won or lost clubs are customer success, not selling — the same
  // rule "calls held" counts by.
  const salesCalls = pipelineCalls.filter(
    (c) => c.deal!.stage !== "Won 🎉" && c.deal!.stage !== "Lost"
  );
  const otherCalls = data.upcoming.filter(
    (c) => !c.deal && !(c.companyId && dismissed[c.companyId])
  );

  const tiles: Tile[] = cur
    ? [
        {
          key: "held",
          label: "Calls held",
          value: cur.discoveryCalls + cur.progressionCalls,
          sub: `${cur.discoveryCalls} discovery · ${cur.progressionCalls} progression`,
          delta: diff(
            cur.discoveryCalls + cur.progressionCalls,
            prev ? prev.discoveryCalls + prev.progressionCalls : undefined
          ),
          items: [...(b?.discoveryCalls ?? []), ...(b?.progressionCalls ?? [])],
          help: "Calls held with pipeline clubs last week. Discovery = the club was in Prospecting or Demo at the time (winning new business); progression = Qualified, Trialling or Proposal (advancing deals we have).",
        },
        {
          key: "booked",
          label: "Calls booked",
          value: salesCalls.length,
          sub: "next 7 days",
          delta: null,
          items: salesCalls.map((c) => ({
            label: `${c.deal!.name.replace(/\s+[-–]\s+.*$/, "")} — ${c.title}`,
            at: c.at,
            dealId: c.deal!.id,
            excerpt: null,
          })),
          ascending: true,
          help: "Calls in the diary for the next 7 days with clubs that have an open deal. Held vs booked is the pair to watch: a quiet diary today is a quiet week of calls held next Monday.",
        },
        {
          key: "demo",
          label: "Deals reaching demo",
          value: cur.dealsReachingDemo,
          delta: diff(cur.dealsReachingDemo, prev?.dealsReachingDemo),
          items: b?.dealsReachingDemo ?? [],
          help: "Deals that moved into Demo / discovery last week — new opportunities actually created. The result, where discovery calls are the effort.",
        },
        {
          key: "conversations",
          label: "Conversations",
          value: cur.conversations,
          delta: diff(cur.conversations, prev?.conversations),
          items: b?.conversations ?? [],
          help: "LinkedIn and WhatsApp threads, plus logged exchanges that never touched the calendar. A write-up of a call already counted isn't counted again, and automation notes — digests, the outbound agent's state — count nowhere.",
        },
        {
          key: "active",
          label: "Active deals",
          value: data.active.deals.length,
          sub: `of ${data.active.openCount} open`,
          delta: null,
          items: data.active.deals.map((a) => ({
            label: a.deal.name,
            at: a.lastAt ?? "",
            dealId: a.deal.id,
            excerpt: null,
          })),
          help: "Open deals with a touch on any channel we can read in the last 14 days, or a call booked. The same test the decision cards use — today's state, not last week's.",
        },
      ]
    : [];
  const ecosystem: Tile | null = cur
    ? {
        key: "ecosystem",
        label: "Ecosystem meetings",
        value: cur.ecosystemMeetings,
        delta: diff(cur.ecosystemMeetings, prev?.ecosystemMeetings),
        items: b?.ecosystemMeetings ?? [],
        help: "",
      }
    : null;
  const openTile = [...tiles, ...(ecosystem ? [ecosystem] : [])].find((t) => t.key === openStat);

  const fmtDelta = (d: number | null) =>
    d === null ? null : d === 0 ? "no change" : d > 0 ? `+${d}` : `${d}`;

  const lateStage = data.coverage.lateStage.filter(mine);
  const moveGroups: { label: string; moves: AgendaMove[] }[] = [
    { label: "Forward", moves: data.movement.forward },
    { label: "Back a stage", moves: data.movement.back },
    { label: "Won", moves: data.movement.won },
    { label: "Lost", moves: data.movement.lost },
  ].map((g) => ({ ...g, moves: g.moves.filter((m) => mine(m.deal)) }));
  const created = data.movement.created.filter(mine);
  const anyMoves = moveGroups.some((g) => g.moves.length) || created.length > 0;

  const decisions = data.decisions.filter((d) => mine(d.deal));
  const queue = data.queue.filter((q) => mine(q.deal));

  const knownMarkets = data.markets.filter((m) => m.country !== "Unknown");
  const unknownMarket = data.markets.find((m) => m.country === "Unknown");
  const maxOpen = Math.max(1, ...data.markets.map((m) => m.openDeals));
  const topMarkets = knownMarkets.slice(0, 8);
  const restMarkets = knownMarkets.slice(8);

  const decidedCount = data.coverage.wonCount + data.coverage.lostCount;

  return (
    <div className="panel">
      <div className="head">
        <div className="head-top">
          <h1>Sales weekly</h1>
          <div className="head-meta">
            {DATE(data.weekOf)} · data as of {TIME(data.cachedAt)} ·{" "}
            <button type="button" className="linkbtn" onClick={refresh} disabled={refreshing}>
              {refreshing ? "refreshing…" : "refresh"}
            </button>
          </div>
        </div>
        <div className="progress"><span style={{ width: `${pct}%` }} /></div>
        <div className="progress-label">
          {done} of {total} settled · {data.decisions.length} decision
          {data.decisions.length === 1 ? "" : "s"} + {data.queue.length} quick check
          {data.queue.length === 1 ? "" : "s"} — done when the bar is full
        </div>
        {data.owners.length > 1 && (
          <div className="tabs owner-tabs">
            {[null, ...data.owners].map((o) => (
              <button
                type="button"
                key={o ?? "everyone"}
                className={`tab ${owner === o ? "on" : ""}`}
                onClick={() => setOwner(o)}
              >
                {o ?? "Everyone"}
              </button>
            ))}
            {owner && <span className="muted owner-note">Lists show {owner}’s deals; the numbers stay team-wide.</span>}
          </div>
        )}
      </div>

      {error && <div className="err">{error}</div>}

      {/* ---------------------------- numbers ---------------------------- */}
      <section>
        <div className="eyebrow">
          <span className="dot" />
          <span>Last week · {RANGE(data.period.from, data.period.to)} · vs the week before</span>
          <Help>
            {tiles.map((t) => (
              <p key={t.key}>
                <b>{t.label}</b> — {t.help}
              </p>
            ))}
            <p>
              All of it comes straight from Attio — stage history, the calendar,
              and logged notes. Nobody types these numbers in. Click a number to
              see what it is made of.
            </p>
          </Help>
        </div>
        {cur ? (
          <>
            <div className="stats">
              {tiles.map((t) => {
                const open = openStat === t.key;
                const d = fmtDelta(t.delta);
                return (
                  <button
                    type="button"
                    className={`stat ${open ? "open" : ""}`}
                    key={t.key}
                    title={t.help}
                    onClick={() => setOpenStat(open ? null : t.key)}
                  >
                    <div className="stat-label">{t.label}</div>
                    <div className="stat-value">{t.value}</div>
                    <div className="delta">
                      {t.sub && <span>{t.sub}</span>}
                      {t.sub && d && " · "}
                      {(d || !t.sub) && (
                        <span className={t.delta && t.delta > 0 ? "up" : t.delta && t.delta < 0 ? "down" : ""}>
                          {d ?? "—"}
                        </span>
                      )}
                    </div>
                    {t.items.length > 0 && <div className="stat-open-hint">{open ? "hide" : "show"}</div>}
                  </button>
                );
              })}
            </div>
            {ecosystem && (
              <p className="note">
                Plus <b>{ecosystem.value}</b> ecosystem meeting{ecosystem.value === 1 ? "" : "s"}
                {fmtDelta(ecosystem.delta) && ` (${fmtDelta(ecosystem.delta)})`} — investors,
                advisers, multi-club groups. Real work, counted apart so it never reads as
                pipeline.{" "}
                {ecosystem.items.length > 0 && (
                  <button
                    type="button"
                    className="linkbtn"
                    onClick={() => setOpenStat(openStat === "ecosystem" ? null : "ecosystem")}
                  >
                    {openStat === "ecosystem" ? "hide" : "show"}
                  </button>
                )}
              </p>
            )}
            {/* The receipts: the actual deals, calls, and notes the count is
                made of. A number nobody can open is just an assertion. */}
            {openTile && (
              <div className="stat-items">
                {openTile.items.length === 0 ? (
                  <p className="note" style={{ margin: 0 }}>Nothing counted.</p>
                ) : (
                  openTile.items
                    .slice()
                    .sort((x, y) => (openTile.ascending ? x.at.localeCompare(y.at) : y.at.localeCompare(x.at)))
                    .map((item, i) => (
                      <div className="fact" key={i}>
                        <span className="bullet" />
                        <span>
                          {item.at && (
                            <span className="qval" style={{ marginRight: 8 }}>
                              {new Date(item.at).toLocaleDateString("en-GB", { weekday: "short", day: "numeric" })}
                            </span>
                          )}
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
      </section>

      {/* ---------------------------- pipeline --------------------------- */}
      <section>
        <div className="eyebrow">
          <span className="dot" />
          <span>Pipeline · open now</span>
          <Help>
            <p>
              <b>The stage strip</b> — where the open deals sit. The median is
              how long this stage’s deals have been there so far; <b>aging</b>{" "}
              counts deals past 1.5× how long deals that moved on historically
              took to leave it. Click a stage to see its deals.
            </p>
            <p>
              <b>Could close next</b> — every deal in Trialling or Proposal, by
              name. It replaces the weighted total: no deal ever closes at “8% of
              £45k”, and a list is something the room can act on.
            </p>
            <p>
              <b>Win record</b> — counts, not a percentage. With a dozen deals
              decided, one result moves a percentage by ten points.
            </p>
          </Help>
        </div>
        <div className="coverage">
          <div className="cov-item">
            <div className="cov-label">Won to date</div>
            <div className="cov-value">{GBP(data.coverage.won)}</div>
          </div>
          <div className="cov-item">
            <div className="cov-label">Gap to {GBP(data.coverage.target)} target</div>
            <div className="cov-value">{GBP(data.coverage.gap)}</div>
          </div>
          <div className="cov-item">
            <div className="cov-label">Win record</div>
            <div className="cov-value">
              {data.coverage.wonCount} of {decidedCount} <span className="cov-unit">decided</span>
            </div>
          </div>
          <div className="cov-item">
            <div className="cov-label">Open pipeline</div>
            <div className="cov-value">{GBP(data.coverage.openValue)}</div>
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
                {s.medianDays !== null && ` · median ${s.medianDays}d`}
              </div>
              <div className={`stage-cell-meta ${s.aging > 0 ? "aging" : ""}`}>
                {s.benchmarkDays === null
                  ? "no history yet"
                  : s.aging > 0
                    ? `${s.aging} aging · past ${Math.round(s.benchmarkDays * 1.5)}d`
                    : `none past ${Math.round(s.benchmarkDays * 1.5)}d`}
              </div>
            </Link>
          ))}
        </div>

        <div className="group-label">Could close next · Trialling and Proposal</div>
        {lateStage.length === 0 ? (
          <p className="note">Nothing in Trialling or Proposal{owner ? ` for ${owner}` : ""}.</p>
        ) : (
          <div className="queue">
            {lateStage.map((d) => (
              <div className="qrow" key={d.id}>
                <div>
                  <div className="qname"><Link href={`/deal/${d.id}`}>{d.name}</Link></div>
                  <div className="qmeta">{d.stage} · {d.ownerName?.trim() || "Unassigned"}</div>
                </div>
                <div className="qval">{GBP(d.value)}</div>
                <div />
              </div>
            ))}
          </div>
        )}
        <p className="note">
          <b>Closed in the last {data.closed.windowDays} days:</b>{" "}
          {data.closed.won.length === 0 ? "no wins" : `won ${names(data.closed.won)}`}
          {" · "}
          {data.closed.lost.length === 0 ? "no losses" : `lost ${names(data.closed.lost)}`}.
        </p>
      </section>

      {/* ----------------------------- moved ----------------------------- */}
      <section>
        <div className="eyebrow">
          <span className="dot" />
          <span>Moved last week · {RANGE(data.period.from, data.period.to)} · read, don’t debate</span>
        </div>
        {!anyMoves ? (
          <p className="note">No stage changes last week{owner ? ` on ${owner}’s deals` : ""}.</p>
        ) : (
          <>
            {moveGroups
              .filter((g) => g.moves.length > 0)
              .map((g) => (
                <div key={g.label}>
                  <div className="group-label">{g.label} · {g.moves.length}</div>
                  <div className="facts" style={{ marginTop: 6 }}>
                    {g.moves.map((m, i) => (
                      <div className="fact" key={i}>
                        <span className="bullet" />
                        <span>
                          <Link href={`/deal/${m.deal.id}`}><b>{m.deal.name}</b></Link>
                          {" — "}{m.from ? `${m.from} → ${m.to}` : m.to}{" · "}{GBP(m.deal.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            {created.length > 0 && (
              <div>
                <div className="group-label">New deals · {created.length}</div>
                <div className="facts" style={{ marginTop: 6 }}>
                  {created.map((d) => (
                    <div className="fact" key={d.id}>
                      <span className="bullet" />
                      <span>
                        <Link href={`/deal/${d.id}`}><b>{d.name}</b></Link>
                        {" — "}{d.stage}{" · "}{GBP(d.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ----------------------------- where ----------------------------- */}
      <section>
        <div className="eyebrow">
          <span className="dot" />
          <span>Where · open deals by country</span>
          <Help>
            <p>
              Each bar is a country’s open deals; the dark part is the ones
              active now (a touch in 14 days, or a call booked). “11 of 21
              active” says how much of a market is actually in conversation —
              a map of the same numbers would mostly show how big Britain is.
            </p>
            <p>
              Calls and conversations are the last {data.marketWindowDays} days,
              a window rather than a week: at this volume, a week per market is
              mostly zeros.
            </p>
            <p>
              Country comes from the club’s company record in Attio. League and
              tier would be the sharper cut (“7 of 24 Championship clubs”), but
              Attio has no field for them yet.
            </p>
          </Help>
        </div>
        <div className="bars">
          {topMarkets.map((m) => (
            <MarketRow key={m.country} m={m} maxOpen={maxOpen} />
          ))}
        </div>
        {restMarkets.length > 0 && (
          <details className="more">
            <summary>{restMarkets.length} more countries</summary>
            <div className="bars">
              {restMarkets.map((m) => (
                <MarketRow key={m.country} m={m} maxOpen={maxOpen} />
              ))}
            </div>
          </details>
        )}
        {unknownMarket && unknownMarket.openDeals > 0 && (
          <p className="note">
            {unknownMarket.openDeals} open deal{unknownMarket.openDeals === 1 ? "" : "s"} (
            {GBP(unknownMarket.openValue)}) sit on companies with no location in Attio, so they
            aren’t placed on the chart.
          </p>
        )}
      </section>

      {/* --------------------------- decisions --------------------------- */}
      <section>
        <div className="eyebrow">
          <span className="dot" />
          <span>Decisions · {decisions.length} need a call today</span>
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
        {decisions.length === 0 && (
          <p className="note">Nothing is flagged and no recorded verdict is contradicted. Skip to the queue.</p>
        )}
        {decisions.map((d, i) => (
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
      {queue.length > 0 && (
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
            {owner && ` ${queue.length} of this week’s ${data.queue.length} are ${owner}’s.`}
          </p>
          <div className="queue">
            {queue.map((q) => (
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

      {/* --------------------------- coming up --------------------------- */}
      {(pipelineCalls.length > 0 || otherCalls.length > 0) && (
        <section>
          <div className="eyebrow">
            <span className="dot" />
            <span>Coming up · next 7 days</span>
            <Help>
              <p>
                Calls with pipeline clubs, straight from Attio's calendar sync —
                with the deal's standing note and the research brief where one
                exists, so nobody walks in cold.
              </p>
              <p>
                Other external meetings the CRM recognises are listed underneath,
                one line each. Remove any that aren't sales and they won't show
                again.
              </p>
            </Help>
          </div>
          {pipelineCalls.filter((c) => mine(c.deal!)).map((c, i) => (
            <div className="item" key={i}>
              <div className="item-head">
                <div>
                  <div className="item-idx">{WHEN(c.at)}</div>
                  <div className="item-title">
                    <Link href={`/deal/${c.deal!.id}`}>
                      {c.deal!.name.replace(/\s+[-–]\s+.*$/, "")}
                    </Link>
                  </div>
                  <div className="item-sub">{c.title} · {c.deal!.stage}</div>
                </div>
                <div className="item-value">{GBP(c.deal!.value)}</div>
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
          {pipelineCalls.length > 0 && pipelineCalls.filter((c) => mine(c.deal!)).length === 0 && (
            <p className="note">No pipeline calls for {owner} in the next 7 days.</p>
          )}
          {!owner && otherCalls.length > 0 && (
            <>
              <div className="group-label">Also in the diary · not pipeline</div>
              <div className="queue">
                {otherCalls.map((c, i) => (
                  <div className="qrow" key={i}>
                    <div>
                      <div className="qname">{c.title}</div>
                      <div className="qmeta">
                        {WHEN(c.at)}
                        {c.company ? ` · ${c.company} · no deal yet` : ""}
                      </div>
                    </div>
                    <div />
                    <div className="qbtns">
                      {c.companyId && c.company && (
                        <button
                          className="qbtn"
                          onClick={() => hideCounterpart(c.companyId!, c.company!, true)}
                        >
                          Not sales
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {Object.keys(dismissed).length > 0 && (
            <p className="note">
              Hidden from Coming up: {Object.values(dismissed).join(", ")}.{" "}
              {Object.entries(dismissed).map(([id, name]) => (
                <button key={id} className="linkbtn" onClick={() => hideCounterpart(id, name, false)}>
                  undo {name}
                </button>
              ))}
            </p>
          )}
        </section>
      )}

      {/* ------------------------- market signals ------------------------ */}
      {data.signals.length > 0 && (
        <section>
          <div className="eyebrow">
            <span className="dot" />
            <span>Market signals · this week's research</span>
            <Help>
              <p>
                What the Monday research found moving in the market — sporting
                director changes, vacancies, events. A signal on a pipeline
                club links to its deal; the rest is industry context.
              </p>
              <p>
                Signals older than three weeks drop off by themselves, so
                nothing here is stale news wearing a fresh label.
              </p>
            </Help>
          </div>
          <div className="facts" style={{ marginTop: 12 }}>
            {data.signals.map((sig, i) => (
              <div className="fact" key={i}>
                <span className="bullet" />
                <span>
                  {sig.dealId ? (
                    <Link href={`/deal/${sig.dealId}`}><b>{sig.club}</b></Link>
                  ) : (
                    <b>{sig.club ?? "Industry"}</b>
                  )}
                  {" — "}
                  {sig.text}
                  {sig.date && (
                    <span className="muted">
                      {" "}· {new Date(sig.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  )}
                  {sig.url && (
                    <>
                      {" · "}
                      <a href={sig.url} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>
                        source
                      </a>
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="foot">
        <div className="foot-text">
          Decisions write straight back to Attio. Nothing to update afterwards. Data as of{" "}
          {TIME(data.cachedAt)}.{" "}
          <Link href="/deals" style={{ textDecoration: "underline" }}>Browse all deals</Link>
        </div>
        <div className="wordmark">powered by sentrum</div>
      </div>
    </div>
  );
}

interface Tile {
  key: string;
  label: string;
  value: number;
  /** Context under the number, for tiles a week-on-week delta doesn't fit. */
  sub?: string;
  delta: number | null;
  items: MetricItem[];
  help: string;
  /** Upcoming items read soonest-first; everything else newest-first. */
  ascending?: boolean;
}

const COUNTRY = (() => {
  try {
    return new Intl.DisplayNames(["en-GB"], { type: "region" });
  } catch {
    return null;
  }
})();

function MarketRow({ m, maxOpen }: { m: AgendaMarket; maxOpen: number }) {
  const name = (COUNTRY?.of(m.country) ?? m.country).replace("United Kingdom", "UK");
  const talk = [
    m.calls ? `${m.calls} call${m.calls === 1 ? "" : "s"}` : null,
    m.conversations ? `${m.conversations} conversation${m.conversations === 1 ? "" : "s"}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <div className="bar-row">
      <div className="bar-name">{name}</div>
      <div className="bar-track" aria-hidden="true">
        <span className="bar-open" style={{ width: `${(m.openDeals / maxOpen) * 100}%` }}>
          <span
            className="bar-active"
            style={{ width: m.openDeals ? `${(m.activeDeals / m.openDeals) * 100}%` : 0 }}
          />
        </span>
      </div>
      <div className="bar-text">
        {m.openDeals > 0
          ? `${m.activeDeals} of ${m.openDeals} active · ${GBP(m.openValue)}`
          : "no open deals"}
        {talk && <span className="muted"> · {talk}</span>}
      </div>
    </div>
  );
}

const names = (moves: AgendaMove[]) =>
  moves.map((m) => m.deal.name.replace(/\s+[-–]\s+.*$/, "")).join(", ");

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
