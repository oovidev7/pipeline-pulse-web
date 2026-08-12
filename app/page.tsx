"use client";

import { useEffect, useState, useCallback } from "react";
import { DealsApiResponse } from "@/lib/types";
import StageSnapshot from "@/components/StageSnapshot";
import PipelineHealth from "@/components/PipelineHealth";
import AtRiskList from "@/components/AtRiskList";
import OwnerPerformance from "@/components/OwnerPerformance";
import UpcomingCalls from "@/components/UpcomingCalls";
import WeeklyActivity from "@/components/WeeklyActivity";

export default function Home() {
  const [deals, setDeals] = useState<DealsApiResponse | null>(null);
  const [calendar, setCalendar] = useState<any | null>(null);
  const [contactActivity, setContactActivity] = useState<any | null>(null);
  const [slack, setSlack] = useState<any | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadAll = useCallback((bust: boolean) => {
    const qs = bust ? "?refresh=1" : "";

    // Deals loads first and renders immediately; other sections backfill independently.
    fetch(`/api/deals${qs}`)
      .then((r) => r.json())
      .then(setDeals)
      .catch((err) => console.error("deals fetch failed", err));

    fetch(`/api/calendar${qs}`)
      .then((r) => r.json())
      .then(setCalendar)
      .catch((err) => console.error("calendar fetch failed", err));

    fetch(`/api/contact-activity${qs}`)
      .then((r) => r.json())
      .then(setContactActivity)
      .catch((err) => console.error("contact-activity fetch failed", err));

    fetch(`/api/slack${qs}`)
      .then((r) => r.json())
      .then(setSlack)
      .catch((err) => console.error("slack fetch failed", err));
  }, []);

  useEffect(() => {
    loadAll(false);
  }, [loadAll, refreshKey]);

  async function handleRefresh() {
    setRefreshing(true);
    loadAll(true);
    setTimeout(() => setRefreshing(false), 1500);
  }

  const cachedTime = deals?.cachedAt
    ? new Date(deals.cachedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="page">
      <div className="page-header">
        <p style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Pipeline Pulse</p>
        <div className="header-actions">
          <button className="reload" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>
      <p className="muted" style={{ fontSize: 13, margin: "0 0 1rem" }}>
        Sentrum sales dashboard {cachedTime ? `· as of ${cachedTime}` : ""}
      </p>

      <div className="section">
        <StageSnapshot stageSnapshot={deals?.stageSnapshot ?? null} />
      </div>

      <div className="section grid grid-2">
        <PipelineHealth pipelineHealth={deals?.pipelineHealth ?? null} />
        <WeeklyActivity slack={slack} />
      </div>

      <div className="section grid grid-2">
        <AtRiskList atRiskDeals={deals?.atRiskDeals ?? null} />
        <UpcomingCalls calendar={calendar} />
      </div>

      <div className="section grid grid-2">
        <OwnerPerformance ownerPerformance={deals?.ownerPerformance ?? null} />

        <div className="card">
          <div className="section-title">
            New conversations <span className="hint">— last 7 days</span>
          </div>
          {!deals ? (
            <div className="loading-text">Loading...</div>
          ) : deals.newConversations.length === 0 ? (
            <div className="empty-state">No new first-contact conversations detected.</div>
          ) : (
            deals.newConversations.map((c) => (
              <div className="owner-row" key={c.personId}>
                <span>{c.name}</span>
                <span className="call-time">
                  {new Date(c.firstEmailInteraction).toLocaleDateString("en-GB")}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {contactActivity?.followUpsNeeded?.length > 0 && (
        <div className="section">
          <div className="card">
            <div className="section-title">Follow-ups needed</div>
            {contactActivity.followUpsNeeded.map((f: any) => (
              <div className="owner-row" key={f.dealId}>
                <span>{f.dealName}</span>
                <span className="call-time">
                  Last sent {f.lastContactDate ? new Date(f.lastContactDate).toLocaleDateString("en-GB") : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
