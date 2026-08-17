"use client";

import { useState } from "react";
import { DealRecord, OpenTask, TasksApiResponse } from "@/lib/types";
import ConfirmWrite from "./ConfirmWrite";

function formatDeadline(iso: string | null): string {
  if (!iso) return "no due date";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "no due date";
  return dt.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** yyyy-mm-dd for a date input, in local time. */
function toDateInput(iso: string | null): string {
  if (!iso) return "";
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "";
  return new Date(dt.getTime() - dt.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
}

export default function OpenTasks({
  tasks,
  /** Open deals, for the "add task" picker. */
  deals,
  onChanged,
  error,
}: {
  tasks: TasksApiResponse | null;
  deals?: DealRecord[];
  onChanged?: () => void;
  error?: string | null;
}) {
  const [assignee, setAssignee] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<OpenTask | null>(null);

  // Add-task form
  const [adding, setAdding] = useState(false);
  const [newDealId, setNewDealId] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newDue, setNewDue] = useState("");
  const [creating, setCreating] = useState(false);

  const all = tasks?.tasks ?? [];
  const assignees = Array.from(new Set(all.flatMap((t) => t.assigneeNames))).sort();
  const visible = assignee
    ? all.filter((t) => t.assigneeNames.includes(assignee))
    : all;
  const overdueCount = visible.filter((t) => t.overdue).length;

  async function patchTask(taskId: string, body: Record<string, unknown>, done: string) {
    setBusyId(taskId);
    setStatus(null);
    try {
      const res = await fetch("/api/deal-task", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, ...body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed");
      setStatus({ text: done, ok: true });
      onChanged?.();
    } catch (err: any) {
      setStatus({ text: err?.message || "Update failed", ok: false });
    } finally {
      setBusyId(null);
    }
  }

  async function runDelete() {
    if (!pendingDelete) return;
    const taskId = pendingDelete.id;
    setBusyId(taskId);
    try {
      const res = await fetch("/api/deal-task", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Delete failed");
      setStatus({ text: "Task deleted", ok: true });
      onChanged?.();
    } catch (err: any) {
      setStatus({ text: err?.message || "Delete failed", ok: false });
    } finally {
      setBusyId(null);
      setPendingDelete(null);
    }
  }

  async function createTask() {
    if (!newDealId || !newContent.trim()) return;
    setCreating(true);
    setStatus(null);
    try {
      const dueInDays = newDue
        ? Math.max(
            0,
            Math.round((new Date(newDue).getTime() - Date.now()) / 86_400_000)
          )
        : 3;
      const res = await fetch("/api/deal-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: newDealId, content: newContent, dueInDays }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Create failed");
      setStatus({ text: "Task created", ok: true });
      setNewContent("");
      setNewDue("");
      setAdding(false);
      onChanged?.();
    } catch (err: any) {
      setStatus({ text: err?.message || "Create failed", ok: false });
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="card">
      <div className="section-title" style={{ justifyContent: "space-between" }}>
        <span>
          Open tasks <span className="hint">— due in the next 7 days</span>
        </span>
        <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {assignees.length > 1 && (
            <>
              <button
                className={`wk${!assignee ? " active" : ""}`}
                onClick={() => setAssignee(null)}
              >
                All
              </button>
              {assignees.map((name) => (
                <button
                  key={name}
                  className={`wk${assignee === name ? " active" : ""}`}
                  onClick={() => setAssignee(assignee === name ? null : name)}
                >
                  {name}
                </button>
              ))}
            </>
          )}
          {deals && deals.length > 0 && (
            <button className="wk" onClick={() => setAdding((v) => !v)}>
              {adding ? "Cancel" : "+ Add task"}
            </button>
          )}
        </span>
      </div>

      {adding && (
        <div className="task-add">
          <select
            className="stage-select"
            value={newDealId}
            onChange={(e) => setNewDealId(e.target.value)}
          >
            <option value="">Choose a deal…</option>
            {[...(deals ?? [])]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
          </select>
          <input
            className="task-input"
            placeholder="What needs doing?"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <input
            className="stage-select"
            type="date"
            value={newDue}
            onChange={(e) => setNewDue(e.target.value)}
            title="Due date (defaults to 3 days)"
          />
          <button
            className="reload small"
            disabled={!newDealId || !newContent.trim() || creating}
            onClick={createTask}
          >
            {creating ? "Creating…" : "Create"}
          </button>
        </div>
      )}

      {error ? (
        <div className="error-state">{error}</div>
      ) : !tasks ? (
        <div className="loading-text">Loading...</div>
      ) : visible.length === 0 ? (
        <div className="empty-state">
          {all.length === 0
            ? "No tasks due in the next 7 days."
            : `No tasks due in the next 7 days for ${assignee}.`}
        </div>
      ) : (
        <>
          <p className="hint" style={{ margin: "0 0 10px" }}>
            {visible.length} task{visible.length > 1 ? "s" : ""}
            {overdueCount > 0 && `, ${overdueCount} already overdue`}
            {status && (
              <span className={`note-status ${status.ok ? "ok" : "err"}`}>
                {" · "}
                {status.text}
              </span>
            )}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {visible.map((t) => (
              <div className={`task-item${t.overdue ? " overdue" : ""}`} key={t.id}>
                <div className="task-row">
                  <input
                    type="checkbox"
                    className="task-check"
                    checked={false}
                    disabled={busyId === t.id}
                    title="Mark complete"
                    onChange={() =>
                      patchTask(t.id, { isCompleted: true }, "Task completed")
                    }
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p className="call-title">
                      {t.url ? (
                        <a
                          className="task-link"
                          href={t.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t.content}
                        </a>
                      ) : (
                        t.content
                      )}
                      {t.dealName && <span className="hint"> · {t.dealName}</span>}
                    </p>
                    <p className="call-time">
                      <span className={t.overdue ? "overdue-date" : undefined}>
                        {t.overdue && "overdue · "}
                        {formatDeadline(t.deadlineAt)}
                      </span>
                      {t.assigneeNames.length > 0
                        ? ` · ${t.assigneeNames.join(" + ")}`
                        : " · unassigned"}
                    </p>
                  </div>
                  <div className="task-controls">
                    <input
                      type="date"
                      className="task-date"
                      value={toDateInput(t.deadlineAt)}
                      disabled={busyId === t.id}
                      title="Reschedule"
                      onChange={(e) => {
                        if (!e.target.value) return;
                        patchTask(
                          t.id,
                          { deadlineAt: new Date(e.target.value).toISOString() },
                          "Rescheduled"
                        );
                      }}
                    />
                    <button
                      className="reload small"
                      disabled={busyId === t.id}
                      title="Delete task"
                      onClick={() => setPendingDelete(t)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {pendingDelete && (
        <ConfirmWrite
          title="Delete this task in Attio?"
          recordName={pendingDelete.dealName || "Unlinked task"}
          description="This permanently removes the task from Attio. It cannot be undone — completing it instead keeps the record."
          preview={pendingDelete.content}
          confirmLabel="Delete task"
          busy={busyId === pendingDelete.id}
          onConfirm={runDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
