"use client";

import { useEffect, useState, useCallback } from "react";
import { DealRecord, DealsApiResponse, TasksApiResponse } from "@/lib/types";
import type { DealContext } from "@/components/DealDetail";
import OpenTasks from "@/components/OpenTasks";
import StageSnapshot from "@/components/StageSnapshot";
import FilteredDeals from "@/components/FilteredDeals";
import StageTrend from "@/components/StageTrend";
import MarketSignals from "@/components/MarketSignals";
import CoverageHeader from "@/components/CoverageHeader";
import FocusList from "@/components/FocusList";
import ThisWeek from "@/components/ThisWeek";
import CallsWeek from "@/components/CallsWeek";
import Roundtable from "@/components/Roundtable";
import { rankDeals, scoreDeal } from "@/lib/risk";
import { CLOSED_STAGES } from "@/lib/types";
import OwnerPerformance from "@/components/OwnerPerformance";

type SectionKey =
  | "deals"
  | "calendar"
  | "contactActivity"
  | "slack"
  | "tasks"
  | "roundtable";

type SectionErrors = Partial<Record<SectionKey, string>>;

export default function Home() {
  const [deals, setDeals] = useState<DealsApiResponse | null>(null);
  const [calendar, setCalendar] = useState<any | null>(null);
  const [contactActivity, setContactActivity] = useState<any | null>(null);
  const [slack, setSlack] = useState<any | null>(null);
  const [tasks, setTasks] = useState<TasksApiResponse | null>(null);
  const [roundtable, setRoundtable] = useState<any | null>(null);
  const [errors, setErrors] = useState<SectionErrors>({});
  const [refreshing, setRefreshing] = useState(false);
  const [filterStage, setFilterStage] = useState<string | null>(null);

  /**
   * Fetches one section. A failed request records an error for that section
   * only — the error payload is never written into the data state, so one dead
   * API degrades its own card instead of crashing the dashboard.
   */
  const loadSection = useCallback(
    async <T,>(key: SectionKey, url: string, set: (value: T) => void) => {
      try {
        const res = await fetch(url);
        const body = await res.json().catch(() => null);
        if (!res.ok || body?.error) {
          throw new Error(body?.error || `Request failed (${res.status})`);
        }
        set(body as T);
        setErrors((e) => {
          if (!e[key]) return e;
          const next = { ...e };
          delete next[key];
          return next;
        });
      } catch (err: any) {
        console.error(`${key} fetch failed`, err);
        setErrors((e) => ({ ...e, [key]: err?.message || "Failed to load" }));
      }
    },
    []
  );

  // Each section loads and renders independently rather than waiting on the slowest.
  const loadAll = useCallback(
    (bust: boolean) => {
      const qs = bust ? "?refresh=1" : "";
      return Promise.all([
        loadSection<DealsApiResponse>("deals", `/api/deals${qs}`, setDeals),
        loadSection<any>("calendar", `/api/calendar${qs}`, setCalendar),
        loadSection<any>(
          "contactActivity",
          `/api/contact-activity${qs}`,
          setContactActivity
        ),
        loadSection<any>("slack", `/api/slack${qs}`, setSlack),
        loadSection<TasksApiResponse>("tasks", `/api/tasks${qs}`, setTasks),
        loadSection<any>("roundtable", `/api/roundtable${qs}`, setRoundtable),
      ]);
    },
    [loadSection]
  );

  useEffect(() => {
    loadAll(false);
  }, [loadAll]);

  /**
   * Refetches deal-derived data after a write (stage move, note). The write
   * already invalidated the server caches, so a plain GET recomputes.
   */
  const refreshDeals = useCallback(() => {
    loadSection<DealsApiResponse>("deals", "/api/deals", setDeals);
  }, [loadSection]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await loadAll(true);
    } finally {
      setRefreshing(false);
    }
  }

  // Market signals name a club ("Nottingham Forest"); deals are named
  // "Nottingham Forest - Q3 2026". Match on the deal name's leading segment so a
  // signal can show whether that club is already in the pipeline.
  const dealsByClub = new Map<
    string,
    { id: string; name: string; stage: string; ownerName: string | null }
  >();
  for (const d of deals?.deals ?? []) {
    const club = d.name.split(/\s+[-–]\s+/)[0].trim().toLowerCase();
    if (club && !dealsByClub.has(club)) {
      dealsByClub.set(club, {
        id: d.id,
        name: d.name,
        stage: d.stage,
        ownerName: d.ownerName,
      });
    }
  }

  /**
   * Joins one deal to everything the connectors know about it. Called lazily
   * when a row is expanded, so the joins only run for rows actually opened.
   */
  const dealContext = (deal: DealRecord): DealContext => {
    const club = deal.name.split(/\s+[-–]\s+/)[0].trim().toLowerCase();
    const matchesClub = (value: string | null | undefined) =>
      Boolean(value && value.trim().toLowerCase() === club);

    return {
      activity: (contactActivity?.entries ?? []).find(
        (e: any) => e.dealId === deal.id
      ),
      calls: (calendar?.matched ?? []).filter((c: any) => c.dealId === deal.id),
      tasks: (tasks?.tasks ?? []).filter((t) => t.dealId === deal.id),
      signal: (slack?.marketSignals?.signals ?? []).find((s: any) =>
        matchesClub(s.club)
      ),
      brief: (slack?.callBriefs?.briefs ?? []).find((b: any) =>
        matchesClub(b.club)
      ),
      meetings: (slack?.meetingNotes?.notes ?? []).filter((m: any) =>
        matchesClub(m.club)
      ),
      benchmark:
        deals?.stageBenchmarks.find((b) => b.stage === deal.stage) ?? null,
    };
  };

  // Composite risk ranking over open deals, joining every source the page has.
  const rankedRisk = deals
    ? rankDeals(
        deals.deals
          .filter((d) => !CLOSED_STAGES.includes(d.stage as any))
          .map((d) => {
            const ctx = dealContext(d);
            return scoreDeal(d, {
              lastContactDate: ctx.activity?.lastContactDate ?? null,
              direction: ctx.activity?.direction ?? null,
              hasUpcomingCall: (ctx.calls?.length ?? 0) > 0,
              overdueTaskCount: (ctx.tasks ?? []).filter((t) => t.overdue).length,
              signalDate: ctx.signal?.source_date ?? null,
              benchmark: ctx.benchmark,
            });
          })
          .filter((s) => s.score > 0)
      )
    : null;

  // Same scores keyed by deal id, so the per-stage lists show identical chips.
  const riskById = new Map((rankedRisk ?? []).map((s) => [s.deal.id, s]));

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
        <CoverageHeader
          pipelineHealth={deals?.pipelineHealth ?? null}
          stageValues={deals?.stageValues ?? null}
          targetGBP={slack?.latest?.commercial_target_gbp ?? null}
          wonValue={deals?.stageValues?.["Won 🎉"] ?? 0}
        />
      </div>

      <div className="section">
        <FocusList
          ranked={rankedRisk}
          contextFor={dealContext}
          onDealChanged={refreshDeals}
          error={errors.deals}
        />
      </div>

      <div className="section">
        <ThisWeek
          movement={deals?.movement ?? null}
          history={slack?.history}
          stalledCount={deals?.pipelineHealth.stalledDealsCount ?? null}
          latestWeek={slack?.latest ?? null}
          prevWeek={slack?.previous ?? null}
          signals={slack?.marketSignals ?? null}
          briefs={slack?.callBriefs ?? null}
          tasks={tasks}
          followUpsCount={contactActivity?.followUpsNeeded?.length ?? null}
          newConversations={deals?.newConversations ?? []}
          error={errors.deals}
        />
      </div>

      <div className="section">
        <CallsWeek
          calendar={calendar}
          briefsData={slack?.callBriefs ?? null}
          calendarError={errors.calendar}
          briefsError={errors.slack}
        />
      </div>

      <div className="section">
        <StageSnapshot
          stageSnapshot={deals?.stageSnapshot ?? null}
          stageValues={deals?.stageValues ?? null}
          activeStage={filterStage}
          onSelectStage={(stage) =>
            setFilterStage((current) => (current === stage ? null : stage))
          }
          error={errors.deals}
        />
        {slack?.history?.length > 0 && (
          <div className="card" style={{ marginTop: 12 }}>
            <StageTrend history={slack.history} />
          </div>
        )}
      </div>

      {filterStage && deals && (
        <div className="section">
          <FilteredDeals
            stage={filterStage}
            deals={deals.deals.filter((d) => d.stage === filterStage)}
            contextFor={dealContext}
            risk={riskById}
            onDealChanged={refreshDeals}
            onClear={() => setFilterStage(null)}
          />
        </div>
      )}

      <div className="section">
        <Roundtable data={roundtable} error={errors.roundtable} />
      </div>

      <div className="section">
        <OpenTasks tasks={tasks} error={errors.tasks} />
      </div>

      <div className="section">
        <MarketSignals
          data={slack?.marketSignals ?? null}
          dealsByClub={dealsByClub}
          error={errors.slack}
        />
      </div>

      <div className="section">
        <OwnerPerformance
          ownerPerformance={deals?.ownerPerformance ?? null}
          error={errors.deals}
        />
      </div>

      {/* Removed as redundant: "Follow-ups needed" (awaiting-reply is a Focus
          factor and a This week line), "New conversations" (a This week line),
          "Weekly activity" (snapshot numbers conflicted with live ones),
          "Pipeline health" (every stat lives in Coverage, Focus, This week or
          the stage tiles). */}
    </div>
  );
}
