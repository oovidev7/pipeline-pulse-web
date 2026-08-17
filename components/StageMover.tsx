"use client";

import { useState } from "react";
import { STAGES } from "@/lib/types";
import { STAGE_LABELS } from "./StageSnapshot";
import ConfirmWrite from "./ConfirmWrite";

/**
 * Inline stage control for a deal: pick a stage, confirm, and the deal moves
 * in Attio without leaving the Pulse. Won/Lost are real closes and the confirm
 * copy says so.
 */
export default function StageMover({
  dealId,
  dealName,
  currentStage,
  /** Called after a confirmed successful move so the parent can refetch. */
  onMoved,
}: {
  dealId: string;
  dealName: string;
  currentStage: string;
  onMoved?: () => void;
}) {
  const [selected, setSelected] = useState(currentStage);
  const [confirming, setConfirming] = useState(false);
  const [writing, setWriting] = useState(false);
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(null);

  const isClose = selected.startsWith("Won") || selected === "Lost";
  const changed = selected !== currentStage;

  async function runMove() {
    setWriting(true);
    try {
      const res = await fetch("/api/deal-stage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId, stage: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Move failed");
      setStatus({
        text: `Moved to ${STAGE_LABELS[selected] || selected}`,
        ok: true,
      });
      onMoved?.();
    } catch (err: any) {
      setStatus({ text: err?.message || "Move failed", ok: false });
      setSelected(currentStage);
    } finally {
      setWriting(false);
      setConfirming(false);
    }
  }

  return (
    <div className="stage-mover">
      <span className="hint">Stage:</span>
      <select
        className="stage-select"
        value={selected}
        disabled={writing}
        onChange={(e) => {
          setSelected(e.target.value);
          setStatus(null);
        }}
      >
        {STAGES.map((s) => (
          <option key={s} value={s}>
            {STAGE_LABELS[s] || s}
            {s === currentStage ? " (current)" : ""}
          </option>
        ))}
      </select>
      <button
        className="reload small"
        disabled={!changed || writing}
        onClick={() => setConfirming(true)}
      >
        {writing ? "Moving…" : "Move"}
      </button>
      {status && (
        <span className={`note-status ${status.ok ? "ok" : "err"}`}>{status.text}</span>
      )}

      {confirming && (
        <ConfirmWrite
          title={isClose ? "Close this deal in Attio?" : "Move deal stage in Attio?"}
          recordName={dealName}
          description={
            isClose
              ? `This closes the deal as "${STAGE_LABELS[selected] || selected}" — it leaves the open pipeline and every metric (coverage, win rate, stage counts) updates.`
              : `This moves the deal from "${STAGE_LABELS[currentStage] || currentStage}" to "${STAGE_LABELS[selected] || selected}". The change lands in Attio's stage history.`
          }
          confirmLabel={isClose ? `Close as ${STAGE_LABELS[selected] || selected}` : "Move stage"}
          busy={writing}
          onConfirm={runMove}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}
