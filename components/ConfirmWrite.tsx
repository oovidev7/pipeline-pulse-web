"use client";

import { useEffect, useRef } from "react";

/**
 * Blocking confirmation shown before anything is written to the live Attio
 * workspace. It states the exact record and the exact change, because the whole
 * point is that the user can tell what is about to happen before it happens.
 */
export default function ConfirmWrite({
  title,
  recordName,
  description,
  preview,
  confirmLabel,
  busy,
  onConfirm,
  onCancel,
}: {
  title: string;
  recordName: string;
  description: string;
  preview?: string;
  confirmLabel: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);

  return (
    <div
      className="confirm-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={() => !busy && onCancel()}
    >
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-title">{title}</p>
        <p className="confirm-record">{recordName}</p>
        <p className="confirm-desc">{description}</p>
        {preview && <div className="confirm-preview">{preview}</div>}
        <p className="confirm-warning">
          This writes to the live Attio workspace, not a copy.
        </p>
        <div className="confirm-actions">
          <button className="reload" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button
            ref={confirmRef}
            className="reload confirm-go"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Writing…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
