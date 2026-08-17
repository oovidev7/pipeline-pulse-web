"use client";

import { ReactNode, useEffect, useState } from "react";

/**
 * A one-time explainer for a card, dismissed per person via localStorage.
 *
 * Rendering is deferred until after mount: localStorage is unavailable during
 * server rendering, so deciding visibility on the first pass would produce a
 * hydration mismatch. The reopen link is always available once mounted, so a
 * dismissed intro is never lost.
 */
export default function IntroNote({
  storageKey,
  title,
  children,
}: {
  storageKey: string;
  title: string;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setOpen(window.localStorage.getItem(storageKey) !== "dismissed");
    } catch {
      // Private mode or storage disabled — show it, just don't remember.
      setOpen(true);
    }
  }, [storageKey]);

  function dismiss() {
    setOpen(false);
    try {
      window.localStorage.setItem(storageKey, "dismissed");
    } catch {
      // Non-fatal: the intro simply reappears next visit.
    }
  }

  if (!mounted) return null;

  if (!open) {
    return (
      <button className="intro-reopen" onClick={() => setOpen(true)}>
        What is this?
      </button>
    );
  }

  return (
    <div className="intro">
      <div className="intro-head">
        <p className="intro-title">{title}</p>
        <button className="reload small" onClick={dismiss}>
          Got it
        </button>
      </div>
      <div className="intro-body">{children}</div>
    </div>
  );
}
