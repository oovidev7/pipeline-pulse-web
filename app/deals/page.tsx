"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { DealsApiResponse } from "@/lib/types";
import { CLOSED_STAGES } from "@/lib/types";

const GBP = (n: number) => "£" + Math.round(n || 0).toLocaleString("en-GB");

const STAGES = ["Prospecting", "Demo / discovery", "Qualified", "Trialling", "Proposal"];

/**
 * The browse surface: every open deal, filterable by stage.
 *
 * Deliberately a list and nothing more. The nine-section dashboard this
 * replaced tried to be a meeting surface and a reference at once and was a
 * poor version of both — deciding happens on the agenda, depth happens on the
 * deal page, and this exists purely for "show me everything in Qualified".
 */
export default function Deals() {
  const [data, setData] = useState<DealsApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/deals")
      .then(async (r) => {
        const b = await r.json();
        if (!r.ok || b?.error) throw new Error(b?.error || `Failed (${r.status})`);
        setData(b);
      })
      .catch((e) => setError(e?.message || "Could not load deals"));
  }, []);

  const open = useMemo(
    () =>
      (data?.deals ?? [])
        .filter((d) => !CLOSED_STAGES.includes(d.stage as any))
        .filter((d) => !stage || d.stage === stage)
        .sort((a, b) => (b.value || 0) - (a.value || 0)),
    [data, stage]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const d of data?.deals ?? []) {
      if (CLOSED_STAGES.includes(d.stage as any)) continue;
      c[d.stage] = (c[d.stage] ?? 0) + 1;
    }
    return c;
  }, [data]);

  return (
    <div className="panel">
      <Link className="back" href="/">← Sales weekly</Link>
      <div className="head">
        <div className="head-top">
          <h1>All deals</h1>
          <div className="head-meta">
            {open.length} open · {GBP(open.reduce((t, d) => t + (d.value || 0), 0))}
          </div>
        </div>
        <div className="tabs">
          <button className={`tab ${!stage ? "on" : ""}`} onClick={() => setStage(null)}>
            All
          </button>
          {STAGES.filter((s) => counts[s]).map((s) => (
            <button key={s} className={`tab ${stage === s ? "on" : ""}`} onClick={() => setStage(s)}>
              {s} · {counts[s]}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="err">{error}</div>}
      {!data && !error && <div className="loading">Loading…</div>}

      {data && (
        <section>
          <div className="list">
            <div className="lrow header">
              <div>Deal</div><div>Stage</div><div>Owner</div><div>Value</div>
            </div>
            {open.map((d) => (
              <Link className="lrow" href={`/deal/${d.id}`} key={d.id}>
                <div>{d.name}</div>
                <div className="muted">{d.stage}</div>
                <div className="muted">{d.ownerName || "—"}</div>
                <div className="qval">{GBP(d.value)}</div>
              </Link>
            ))}
            {open.length === 0 && <div className="lrow"><div className="muted">Nothing in this stage.</div></div>}
          </div>
        </section>
      )}
    </div>
  );
}
