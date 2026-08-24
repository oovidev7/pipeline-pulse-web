// Player profile Overview tab — recreation of player-v2/tabs/OverviewTab.tsx
// sections: verdict, quick stats, performance snapshot, squad context,
// position heatmap + market value, upcoming fixtures.
const { Eyebrow: OvEyebrow, StatCard: OvStatCard, PercentileBar: OvPercentileBar, Pitch: OvPitch } =
  window.SentrumDesignSystem_fd9502

function tierTextColor(p) {
  if (p >= 75) return 'var(--emerald-600)'
  if (p >= 50) return '#ca8a04'
  if (p >= 25) return '#ea580c'
  return '#dc2626'
}

const outfitNum = (size, extra = {}) => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  fontSize: size,
  lineHeight: 1,
  color: 'var(--zinc-950)',
  ...extra,
})

function SectionHeader({ label, action, onAction }) {
  return (
    <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <OvEyebrow>{label}</OvEyebrow>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="ov-action"
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--zinc-500)',
            padding: 0,
          }}
        >
          {action} →
        </button>
      )}
    </div>
  )
}

/* ---- 1. Scouting verdict ---- */
function ScoutingVerdict({ verdict }) {
  return (
    <OvStatCard emphasis style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <OvEyebrow>Scouting verdict · synthesized from {verdict.reportCount} reports</OvEyebrow>
          <h3 style={{ fontFamily: 'var(--font-display)', margin: '10px 0 0', fontSize: 20, lineHeight: 1.375, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--zinc-950)' }}>
            {verdict.headline}
          </h3>
          <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.6, color: 'var(--zinc-600)' }}>{verdict.body}</p>
          <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--zinc-500)' }}>
            <span>Most recent</span>
            <span style={{ fontWeight: 500, color: 'var(--zinc-700)' }}>{verdict.mostRecent}</span>
            <span style={{ color: 'var(--zinc-300)' }}>·</span>
            <button type="button" style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', fontSize: 12, fontWeight: 500, color: 'var(--zinc-700)', fontFamily: 'var(--font-sans)' }}>
              View all reports →
            </button>
          </div>
        </div>
        <div style={{ flexShrink: 0, borderLeft: '1px solid var(--zinc-200)', paddingLeft: 24, display: 'flex', gap: 20 }}>
          {verdict.grades.map(g => (
            <div key={g.label} style={{ textAlign: 'center' }}>
              <OvEyebrow size="sm" dot={false} style={{ justifyContent: 'center' }}>{g.label}</OvEyebrow>
              <div style={outfitNum(30, { marginTop: 4 })}>{g.value}</div>
            </div>
          ))}
        </div>
      </div>
    </OvStatCard>
  )
}

/* ---- 2. Season quick stats ---- */
function SeasonQuickStats({ contextLabel, stats }) {
  return (
    <div>
      <SectionHeader label={contextLabel} action="Change season" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {stats.map(stat => (
          <OvStatCard key={stat.label} style={{ padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <OvEyebrow size="sm" dot={false}>{stat.label}</OvEyebrow>
              {stat.chip && (
                <span style={{ borderRadius: 2, background: 'var(--emerald-50)', padding: '2px 6px', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--emerald-700)' }}>
                  {stat.chip}
                </span>
              )}
            </div>
            <div style={outfitNum(24, { marginTop: 4 })}>{stat.value}</div>
            {stat.caption && <div style={{ marginTop: 6, fontSize: 11, color: 'var(--zinc-500)' }}>{stat.caption}</div>}
          </OvStatCard>
        ))}
      </div>
    </div>
  )
}

/* ---- 3. Performance snapshot ---- */
function MetricRow({ metric }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', fontSize: 14 }}>
        <span style={{ color: 'var(--zinc-700)' }}>{metric.label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--zinc-950)' }}>
          {metric.displayValue} <span style={{ color: 'var(--zinc-400)' }}>·</span>{' '}
          <span style={{ color: tierTextColor(metric.percentile) }}>P{Math.round(metric.percentile)}</span>
        </span>
      </div>
      <OvPercentileBar percentile={metric.percentile} style={{ marginTop: 6 }} />
    </div>
  )
}

function PerformanceSnapshot({ technical, physical, technicalContext, physicalContext, onFullPerformance }) {
  const col = (title, context, metrics) => (
    <OvStatCard style={{ padding: 16 }}>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <OvEyebrow size="sm" dot={false}>{title}</OvEyebrow>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--zinc-400)' }}>{context}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {metrics.map(m => <MetricRow key={m.label} metric={m} />)}
      </div>
    </OvStatCard>
  )
  return (
    <div>
      <SectionHeader label="Performance snapshot" action="Full performance" onAction={onFullPerformance} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {col('Technical · Impect', technicalContext, technical)}
        {col('Physical · SkillCorner', physicalContext, physical)}
      </div>
    </div>
  )
}

/* ---- 4. Squad context (3 mini leaderboards) ---- */
function SquadContext({ contextLabel, leaderboards, onFullComparison }) {
  return (
    <div>
      <SectionHeader label={contextLabel} action="Full comparison" onAction={onFullComparison} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {leaderboards.map(board => (
          <OvStatCard key={board.metricLabel} style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <OvEyebrow size="sm" dot={false}>{board.metricLabel}</OvEyebrow>
              <div style={outfitNum(18)}>
                #{board.playerRank}{' '}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 400, color: 'var(--zinc-500)' }}>/{board.totalPlayers}</span>
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {board.entries.map(entry => (
                <div key={entry.rank} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                  <span style={{ width: 16, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: entry.me ? 'var(--emerald-700)' : 'var(--zinc-400)' }}>
                    {entry.rank}.
                  </span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: entry.me ? 500 : 400, color: entry.me ? 'var(--emerald-700)' : 'var(--zinc-700)' }}>
                    {entry.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontWeight: entry.me ? 600 : 400, color: entry.me ? 'var(--zinc-950)' : 'var(--zinc-700)' }}>
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </OvStatCard>
        ))}
      </div>
    </div>
  )
}

/* ---- 5. Position map + market value chart ---- */
function MarketValueMiniChart({ history }) {
  // history: [{ label, value }] — simple step-free polyline, emerald
  const w = 280, h = 120, pad = 8
  const max = Math.max(...history.map(p => p.value))
  const min = Math.min(...history.map(p => p.value))
  const x = i => pad + (i / (history.length - 1)) * (w - pad * 2)
  const y = v => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2)
  const points = history.map((p, i) => `${x(i)},${y(p.value)}`).join(' ')
  const last = history[history.length - 1]
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 'auto', display: 'block' }} aria-label="Market value history">
      <polyline
        points={`${x(0)},${h - pad} ${points} ${x(history.length - 1)},${h - pad}`}
        fill="var(--emerald-50)"
        stroke="none"
        opacity="0.8"
      ></polyline>
      <polyline points={points} fill="none" stroke="var(--emerald-500)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"></polyline>
      <circle cx={x(history.length - 1)} cy={y(last.value)} r="3.5" fill="var(--emerald-500)" stroke="#fff" strokeWidth="1.5"></circle>
    </svg>
  )
}

function PositionAndValue({ player }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 8 }}>
      <OvStatCard style={{ padding: 16 }}>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <OvEyebrow size="sm" dot={false}>Positions played</OvEyebrow>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--zinc-400)' }}>
          {player.positionMinutes} min · {player.positionMatches} matches
        </span>
      </div>
        <OvPitch width={430} primary={player.primaryPosition} dots={player.positionDots} ariaLabel={player.positionsLabel} />
        <div style={{ marginTop: 10, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {player.positionDots.map(d => (
            <span key={d.position} style={{ fontSize: 11, color: 'var(--zinc-600)', fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: 'var(--emerald-500)', marginRight: 5 }}></span>
              {d.position} {d.percentage}%
            </span>
          ))}
        </div>
      </OvStatCard>
      <OvStatCard style={{ padding: 16 }}>
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <OvEyebrow size="sm" dot={false}>Market value</OvEyebrow>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--zinc-400)' }}>5 seasons</span>
        </div>
        <div style={outfitNum(24, { marginBottom: 10 })}>{player.marketValue}</div>
        <MarketValueMiniChart history={player.marketValueHistory} />
      </OvStatCard>
    </div>
  )
}

/* ---- 6. Upcoming fixtures ---- */
function UpcomingFixtures({ fixtures }) {
  return (
    <div>
      <SectionHeader label="Upcoming fixtures" />
      <OvStatCard>
        {fixtures.map((f, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '12px 16px',
              borderBottom: i < fixtures.length - 1 ? '1px solid var(--zinc-100)' : 'none',
              fontSize: 13,
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--zinc-500)', width: 88, flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{f.date}</span>
            <span style={{ flex: 1, fontWeight: 500, color: 'var(--zinc-900)' }}>{f.match}</span>
            <span style={{ fontSize: 11, color: 'var(--zinc-500)' }}>{f.competition}</span>
            <button type="button" className="snt-btn snt-btn--outline snt-btn--sm" style={{ flexShrink: 0 }}>
              Add to calendar
            </button>
          </div>
        ))}
      </OvStatCard>
    </div>
  )
}

/* ---- Tab placeholder (verbatim pattern from PlayerProfileV2.tsx) ---- */
function TabPlaceholder({ label }) {
  return (
    <div style={{ borderRadius: 6, border: '1px dashed var(--zinc-300)', background: 'rgba(250,250,250,0.3)', padding: 48, textAlign: 'center' }}>
      <OvEyebrow dot={false} style={{ justifyContent: 'center' }}>{label} tab</OvEyebrow>
      <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--zinc-500)' }}>Content pending — landing in upcoming tasks.</p>
    </div>
  )
}

function OverviewTab({ player, onFullPerformance, onFullComparison }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <ScoutingVerdict verdict={player.verdict} />
      <SeasonQuickStats contextLabel={player.seasonContextLabel} stats={player.quickStats} />
      <PerformanceSnapshot
        technical={player.technicalMetrics}
        physical={player.physicalMetrics}
        technicalContext={player.technicalContext}
        physicalContext={player.physicalContext}
        onFullPerformance={onFullPerformance}
      />
      <SquadContext contextLabel={player.squadContextLabel} leaderboards={player.leaderboards} onFullComparison={onFullComparison} />
      <PositionAndValue player={player} />
      <UpcomingFixtures fixtures={player.fixtures} />
    </div>
  )
}

Object.assign(window, { OverviewTab, TabPlaceholder })
