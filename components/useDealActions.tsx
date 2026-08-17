"use client";

import { ReactNode, useState } from "react";
import ConfirmWrite from "./ConfirmWrite";

// Shared write-action machinery for a list of deals: the AI suggestion, the
// editable stall note, and the confirmed Save note / Create task writes.
// Lives in a hook so each card keeps state at card level — collapsing a row
// must not throw away an unsaved draft.

interface DealLike {
  id: string;
  name: string;
  stallNotes: string | null;
}

type PendingWrite =
  | { kind: "note"; dealId: string; dealName: string; note: string }
  | { kind: "task"; dealId: string; dealName: string; content: string };

export default function useDealActions(): {
  /** The suggestion box, note editor and action buttons for one deal. */
  actionsFor: (deal: DealLike) => ReactNode;
  /** The confirm dialog — render once per card, after the rows. */
  dialog: ReactNode;
} {
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [drafting, setDrafting] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Record<string, { text: string; ok: boolean }>>({});
  const [pending, setPending] = useState<PendingWrite | null>(null);
  const [writing, setWriting] = useState(false);

  const noteFor = (deal: DealLike) =>
    notes[deal.id] !== undefined ? notes[deal.id] : deal.stallNotes || "";

  async function handleSuggest(dealId: string) {
    setLoadingIds((s) => ({ ...s, [dealId]: true }));
    try {
      const res = await fetch("/api/suggest-next-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to get suggestion");
      setSuggestions((s) => ({ ...s, [dealId]: data.suggestion }));
    } catch (err: any) {
      setStatus((s) => ({
        ...s,
        [dealId]: { text: err?.message || "Failed to get suggestion", ok: false },
      }));
    } finally {
      setLoadingIds((s) => ({ ...s, [dealId]: false }));
    }
  }

  async function handleDraft(dealId: string) {
    setDrafting((s) => ({ ...s, [dealId]: true }));
    setStatus((s) => ({ ...s, [dealId]: { text: "", ok: true } }));
    try {
      const res = await fetch("/api/suggest-next-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId, mode: "stall_note" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to draft note");
      setNotes((n) => ({ ...n, [dealId]: data.suggestion }));
      setStatus((s) => ({
        ...s,
        [dealId]: { text: "Drafted — edit before saving", ok: true },
      }));
    } catch (err: any) {
      setStatus((s) => ({
        ...s,
        [dealId]: { text: err?.message || "Failed to draft note", ok: false },
      }));
    } finally {
      setDrafting((s) => ({ ...s, [dealId]: false }));
    }
  }

  /** Runs the confirmed write. Nothing here executes without the dialog. */
  async function runPendingWrite() {
    if (!pending) return;
    setWriting(true);
    const { kind, dealId } = pending;
    try {
      const res = await fetch(kind === "note" ? "/api/deal-note" : "/api/deal-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          kind === "note"
            ? { dealId, note: pending.note }
            : { dealId, content: pending.content }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Write failed");
      setStatus((s) => ({
        ...s,
        [dealId]: {
          text: kind === "note" ? "Saved to Attio" : "Task created, due in 3 days",
          ok: true,
        },
      }));
    } catch (err: any) {
      setStatus((s) => ({
        ...s,
        [dealId]: { text: err?.message || "Write failed", ok: false },
      }));
    } finally {
      setWriting(false);
      setPending(null);
    }
  }

  const actionsFor = (deal: DealLike): ReactNode => (
    <>
      {suggestions[deal.id] && (
        <div className="suggestion-box" style={{ marginTop: 10 }}>
          <strong style={{ fontWeight: 500 }}>Try this next:</strong>{" "}
          {suggestions[deal.id]}
        </div>
      )}

      <textarea
        className="stall-note-box"
        value={noteFor(deal)}
        placeholder="Why is this deal at risk, and what's the next step? Draft with AI, then edit before saving."
        onChange={(e) => setNotes((n) => ({ ...n, [deal.id]: e.target.value }))}
      />
      <div className="note-actions">
        <button
          className="reload small"
          onClick={() => handleSuggest(deal.id)}
          disabled={loadingIds[deal.id]}
        >
          {loadingIds[deal.id] ? "Thinking…" : "Suggest next action"}
        </button>
        <button
          className="reload small"
          onClick={() => handleDraft(deal.id)}
          disabled={drafting[deal.id]}
        >
          {drafting[deal.id] ? "Drafting…" : "Draft note with AI"}
        </button>
        <button
          className="reload small"
          disabled={!noteFor(deal).trim()}
          onClick={() =>
            setPending({
              kind: "note",
              dealId: deal.id,
              dealName: deal.name,
              note: noteFor(deal),
            })
          }
        >
          Save note
        </button>
        <button
          className="reload small"
          disabled={!noteFor(deal).trim()}
          onClick={() =>
            setPending({
              kind: "task",
              dealId: deal.id,
              dealName: deal.name,
              content: noteFor(deal),
            })
          }
        >
          Create task
        </button>
        {status[deal.id]?.text && (
          <span className={`note-status ${status[deal.id].ok ? "ok" : "err"}`}>
            {status[deal.id].text}
          </span>
        )}
      </div>
    </>
  );

  const dialog: ReactNode = pending ? (
    <ConfirmWrite
      title={pending.kind === "note" ? "Save note to Attio?" : "Create task in Attio?"}
      recordName={pending.dealName}
      description={
        pending.kind === "note"
          ? "This overwrites the deal's stall_notes field, replacing anything already there."
          : "This creates a new task assigned to the deal owner, due in 3 days. Nothing existing is changed."
      }
      preview={pending.kind === "note" ? pending.note : pending.content}
      confirmLabel={pending.kind === "note" ? "Save note" : "Create task"}
      busy={writing}
      onConfirm={runPendingWrite}
      onCancel={() => setPending(null)}
    />
  ) : null;

  return { actionsFor, dialog };
}
