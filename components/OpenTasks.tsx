"use client";

import { useState } from "react";
import { TasksApiResponse } from "@/lib/types";

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

export default function OpenTasks({
  tasks,
  error,
}: {
  tasks: TasksApiResponse | null;
  error?: string | null;
}) {
  const [assignee, setAssignee] = useState<string | null>(null);

  const all = tasks?.tasks ?? [];
  const assignees = Array.from(
    new Set(all.flatMap((t) => t.assigneeNames))
  ).sort();

  const visible = assignee
    ? all.filter((t) => t.assigneeNames.includes(assignee))
    : all;
  const overdueCount = visible.filter((t) => t.overdue).length;

  return (
    <div className="card">
      <div className="section-title" style={{ justifyContent: "space-between" }}>
        <span>
          Open tasks <span className="hint">— due in the next 7 days</span>
        </span>
        {assignees.length > 1 && (
          <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
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
          </span>
        )}
      </div>
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
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {visible.map((t) => (
              <div className={`task-item${t.overdue ? " overdue" : ""}`} key={t.id}>
                <div style={{ minWidth: 0 }}>
                  <p className="call-title">
                    {t.url ? (
                      <a className="task-link" href={t.url} target="_blank" rel="noreferrer">
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
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
