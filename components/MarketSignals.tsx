"use client";

import { useState } from "react";
import { cleanSlackText, cleanSlackUrl } from "@/lib/slack-text";
import ConfirmWrite from "./ConfirmWrite";

interface Signal {
  club: string;
  scope?: "named_account" | "broader_sweep" | "industry" | string;
  signal: string;
  why_it_matters?: string;
  source_url?: string;
  source_date?: string;
  footnote?: string;
}

interface MarketSignalsData {
  week_of?: string;
  signals?: Signal[];
}

const SCOPE_LABELS: Record<string, string> = {
  named_account: "In pipeline",
  broader_sweep: "New prospect",
  industry: "Industry",
};

const SCOPE_PILLS: Record<string, string> = {
  named_account: "pill-context",
  broader_sweep: "pill-callweek",
  industry: "pill-unlinked",
};

const cleanUrl = cleanSlackUrl;

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}

interface ClubDeal {
  id: string;
  name: string;
  stage: string;
  ownerName: string | null;
}

export default function MarketSignals({
  data,
  /** Deal names keyed by a normalised club name, for linking a signal to pipeline. */
  dealsByClub,
  error,
}: {
  data: MarketSignalsData | null;
  dealsByClub?: Map<string, ClubDeal>;
  error?: string | null;
}) {
  const [scope, setScope] = useState<string | null>(null);

  // Outreach drafting, keyed by signal index. Nothing writes to Attio until
  // the confirm dialog is accepted.
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [drafting, setDrafting] = useState<Record<number, boolean>>({});
  const [status, setStatus] = useState<Record<number, { text: string; ok: boolean }>>({});
  const [pending, setPending] = useState<{
    index: number;
    deal: ClubDeal;
    note: string;
  } | null>(null);
  const [writing, setWriting] = useState(false);

  async function handleDraft(index: number, s: Signal, deal: ClubDeal) {
    setDrafting((d) => ({ ...d, [index]: true }));
    setStatus((st) => ({ ...st, [index]: { text: "", ok: true } }));
    try {
      const res = await fetch("/api/suggest-next-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealId: deal.id,
          mode: "outreach_note",
          signal: {
            signal: cleanSlackText(s.signal),
            why_it_matters: s.why_it_matters ? cleanSlackText(s.why_it_matters) : undefined,
            source_date: s.source_date,
          },
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Failed to draft");
      setDrafts((d) => ({ ...d, [index]: body.suggestion }));
      setStatus((st) => ({
        ...st,
        [index]: { text: "Drafted — edit before saving", ok: true },
      }));
    } catch (err: any) {
      setStatus((st) => ({
        ...st,
        [index]: { text: err?.message || "Failed to draft", ok: false },
      }));
    } finally {
      setDrafting((d) => ({ ...d, [index]: false }));
    }
  }

  async function savePending() {
    if (!pending) return;
    setWriting(true);
    try {
      const res = await fetch("/api/deal-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: pending.deal.id, note: pending.note }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Write failed");
      setStatus((st) => ({
        ...st,
        [pending.index]: { text: "Saved to Attio", ok: true },
      }));
    } catch (err: any) {
      setStatus((st) => ({
        ...st,
        [pending.index]: { text: err?.message || "Write failed", ok: false },
      }));
    } finally {
      setWriting(false);
      setPending(null);
    }
  }

  const all = data?.signals ?? [];
  const scopes = Array.from(new Set(all.map((s) => s.scope || "other")));
  const visible = scope ? all.filter((s) => (s.scope || "other") === scope) : all;

  return (
    <div className="card">
      <div className="section-title" style={{ justifyContent: "space-between" }}>
        <span>
          Market signals{" "}
          <span className="hint">
            {data?.week_of ? `— week of ${data.week_of}` : "— weekly research"}
          </span>
        </span>
        {scopes.length > 1 && (
          <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button
              className={`wk${!scope ? " active" : ""}`}
              onClick={() => setScope(null)}
            >
              All
            </button>
            {scopes.map((s) => (
              <button
                key={s}
                className={`wk${scope === s ? " active" : ""}`}
                onClick={() => setScope(scope === s ? null : s)}
              >
                {SCOPE_LABELS[s] || s}
              </button>
            ))}
          </span>
        )}
      </div>
      {error ? (
        <div className="error-state">{error}</div>
      ) : !data ? (
        <div className="empty-state">
          No MARKET_SIGNALS post found in Slack yet — the research agent posts these
          weekly on Monday.
        </div>
      ) : visible.length === 0 ? (
        <div className="empty-state">No signals in this category.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {visible.map((s, i) => {
            const href = cleanUrl(s.source_url);
            const scopeKey = s.scope || "other";
            const match = dealsByClub?.get(s.club.trim().toLowerCase());
            return (
              <div className="deal-card" key={`${s.club}-${i}`}>
                <div className="deal-card-header">
                  <div style={{ minWidth: 0 }}>
                    <p className="deal-name">
                      {s.club}{" "}
                      <span className={`pill ${SCOPE_PILLS[scopeKey] || "pill-unlinked"}`}>
                        {SCOPE_LABELS[scopeKey] || scopeKey}
                      </span>
                    </p>
                    {match && (
                      <p className="deal-meta">
                        In pipeline: {match.name} · {match.stage} ·{" "}
                        {match.ownerName || "Unassigned"}
                      </p>
                    )}
                  </div>
                  {s.source_date && <p className="deal-meta">{s.source_date}</p>}
                </div>

                <p className="signal-text">{cleanSlackText(s.signal)}</p>
                {s.why_it_matters && (
                  <p className="signal-why">
                    <strong>Why it matters:</strong> {cleanSlackText(s.why_it_matters)}
                  </p>
                )}
                {s.footnote && (
                  <p className="signal-footnote">{cleanSlackText(s.footnote)}</p>
                )}
                {href && (
                  <p style={{ margin: "6px 0 0" }}>
                    <a className="signal-source" href={href} target="_blank" rel="noreferrer">
                      {hostOf(href)} ↗
                    </a>
                  </p>
                )}

                {match && (
                  <>
                    {drafts[i] !== undefined && (
                      <textarea
                        className="stall-note-box"
                        value={drafts[i]}
                        onChange={(e) =>
                          setDrafts((d) => ({ ...d, [i]: e.target.value }))
                        }
                      />
                    )}
                    <div className="note-actions">
                      <button
                        className="reload small"
                        onClick={() => handleDraft(i, s, match)}
                        disabled={drafting[i]}
                      >
                        {drafting[i]
                          ? "Drafting…"
                          : drafts[i] !== undefined
                          ? "Redraft"
                          : "Draft outreach note"}
                      </button>
                      {drafts[i] !== undefined && (
                        <button
                          className="reload small"
                          disabled={!drafts[i].trim()}
                          onClick={() =>
                            setPending({ index: i, deal: match, note: drafts[i] })
                          }
                        >
                          Save to deal
                        </button>
                      )}
                      {status[i]?.text && (
                        <span className={`note-status ${status[i].ok ? "ok" : "err"}`}>
                          {status[i].text}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {pending && (
        <ConfirmWrite
          title="Save note to Attio?"
          recordName={pending.deal.name}
          description="This overwrites the deal's stall_notes field, replacing anything already there."
          preview={pending.note}
          confirmLabel="Save note"
          busy={writing}
          onConfirm={savePending}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}
