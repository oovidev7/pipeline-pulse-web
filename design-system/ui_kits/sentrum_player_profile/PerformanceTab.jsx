// Performance tab — recreation of player-v2/tabs/PerformanceTab.tsx
// Sub-tabs (Combined/Technical/Physical), filters, polar pizzas, ranked
// metric lists, match history table, season trend chart.
const { Eyebrow: PfEyebrow, StatCard: PfStatCard, PercentileBar: PfPercentileBar } =
  window.SentrumDesignSystem_fd9502

function pfTierColor(p) {
  if (p >= 90) return '#22c55e'
  if (p >= 75) return '#4ade80'
  if (p >= 50) return '#eab308'
  if (p >= 25) return '#f97316'
  return '#ef4444'
}
function pfTierText(p) {
  if (p >= 75) return 'var(--emerald-600)'
  if (p >= 50) return '#ca8a04'
  if (p >= 25) return '#ea580c'
  return '#dc2626'
}

const pfMono = (size, color = 'var(--zinc-700)', extra = {}) => ({
  fontFamily: 'var(--font-mono)',
  fontSize: size,
  color,
  fontVariantNumeric: 'tabular-nums',
  ...extra,
})

/* ---- Sub-tab bar (underline style) ---- */
function SubTabBar({ tabs, active, onChange }) {
  return (
    <div role="tablist" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {tabs.map(tab => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={isActive ? '' : 'subtab-idle'}
            style={{
              position: 'relative',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '0 0 12px',
              marginBottom: -1,
              fontFamily: 'var(--font-sans)',
              fontSize: 14,
              fontWeight: 500,
              color: isActive ? 'var(--zinc-950)' : 'var(--zinc-500)',
              borderBottom: isActive ? '2px solid var(--zinc-950)' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

/* ---- Mono select (filters + metric picker) ---- */
function MonoSelect({ value, onChange, options, ariaLabel }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        value={value}
        aria-label={ariaLabel}
        onChange={e => onChange(e.target.value)}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          borderRadius: 6,
          border: '1px solid var(--zinc-200)',
          background: '#fff',
          padding: '6px 28px 6px 12px',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--zinc-700)',
          cursor: 'pointer',
          outline: 'none',
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '50%', right: 8, width: 14, height: 14, transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--zinc-400)' }} aria-hidden="true">
        <path d="m6 9 6 6 6-6"></path>
      </svg>
    </div>
  )
}

/* ---- Polar bar (pizza) chart — port of PolarBarChart.tsx, static ---- */
function PolarBarChart({ data, size = 340 }) {
  const center = size / 2
  const outerRadius = size * 0.36
  const innerRadius = size * 0.14
  const labelRadius = size * 0.5
  const count = data.length
  const anglePerSegment = (2 * Math.PI) / count
  const gapAngle = 0.04

  const segments = data.map((item, index) => {
    const startAngle = index * anglePerSegment - Math.PI / 2 + gapAngle / 2
    const endAngle = (index + 1) * anglePerSegment - Math.PI / 2 - gapAngle / 2
    const midAngle = (startAngle + endAngle) / 2
    const barRadius = innerRadius + (outerRadius - innerRadius) * (item.percentile / 100)
    return { ...item, startAngle, endAngle, midAngle, barRadius, color: pfTierColor(item.percentile) }
  })

  const arc = (innerR, outerR, startAngle, endAngle) => {
    const isx = center + innerR * Math.cos(startAngle)
    const isy = center + innerR * Math.sin(startAngle)
    const iex = center + innerR * Math.cos(endAngle)
    const iey = center + innerR * Math.sin(endAngle)
    const osx = center + outerR * Math.cos(startAngle)
    const osy = center + outerR * Math.sin(startAngle)
    const oex = center + outerR * Math.cos(endAngle)
    const oey = center + outerR * Math.sin(endAngle)
    const large = endAngle - startAngle > Math.PI ? 1 : 0
    return `M ${isx} ${isy} L ${osx} ${osy} A ${outerR} ${outerR} 0 ${large} 1 ${oex} ${oey} L ${iex} ${iey} A ${innerR} ${innerR} 0 ${large} 0 ${isx} ${isy} Z`
  }

  const labelPos = midAngle => {
    const x = center + labelRadius * Math.cos(midAngle)
    const y = center + labelRadius * Math.sin(midAngle)
    const deg = (midAngle * 180) / Math.PI + 90
    let anchor = 'middle'
    if (deg > 45 && deg < 135) anchor = 'start'
    else if (deg > 225 && deg < 315) anchor = 'end'
    return { x, y, anchor }
  }

  const padding = size * 0.12
  const totalSize = size + padding * 2

  return (
    <svg
      width={totalSize}
      height={totalSize}
      viewBox={`${-padding} ${-padding} ${totalSize} ${totalSize}`}
      style={{ overflow: 'visible', maxWidth: '100%' }}
    >
      <circle cx={center} cy={center} r={outerRadius} fill="none" stroke="var(--zinc-200)" strokeWidth="1"></circle>
      {[25, 50, 75, 100].map(pct => (
        <circle
          key={pct}
          cx={center}
          cy={center}
          r={innerRadius + (outerRadius - innerRadius) * (pct / 100)}
          fill="none"
          stroke="var(--zinc-200)"
          strokeWidth="0.5"
          strokeDasharray="2,4"
        ></circle>
      ))}
      <circle cx={center} cy={center} r={innerRadius} fill="var(--zinc-50)"></circle>
      <circle cx={center} cy={center} r={innerRadius} fill="none" stroke="var(--zinc-200)" strokeWidth="1"></circle>
      {segments.map(seg => (
        <path key={`track-${seg.metric}`} d={arc(innerRadius, outerRadius, seg.startAngle, seg.endAngle)} fill="var(--zinc-100)"></path>
      ))}
      {segments.map(seg => (
        <path key={`bar-${seg.metric}`} d={arc(innerRadius, seg.barRadius, seg.startAngle, seg.endAngle)} fill={seg.color}>
          <title>{`${seg.fullName}: ${seg.rawValue} ${seg.unit || 'p90'} · P${Math.round(seg.percentile)}`}</title>
        </path>
      ))}
      {segments.map(seg => {
        const x1 = center + innerRadius * Math.cos(seg.startAngle)
        const y1 = center + innerRadius * Math.sin(seg.startAngle)
        const x2 = center + outerRadius * Math.cos(seg.startAngle)
        const y2 = center + outerRadius * Math.sin(seg.startAngle)
        return <line key={`div-${seg.metric}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="1.5"></line>
      })}
      {segments.map(seg => {
        const { x, y, anchor } = labelPos(seg.midAngle)
        return (
          <g key={`label-${seg.metric}`}>
            <text x={x} y={y - 6} textAnchor={anchor} dominantBaseline="middle" style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.05em', fill: 'var(--zinc-600)', fontFamily: 'var(--font-sans)', textTransform: 'uppercase' }}>
              {seg.metric}
            </text>
            <text x={x} y={y + 6} textAnchor={anchor} dominantBaseline="middle" style={{ fontSize: 8, fill: 'var(--zinc-500)', fontFamily: 'var(--font-mono)' }}>
              {seg.rawValue} {seg.unit || 'p90'}
            </text>
          </g>
        )
      })}
      <text x={center} y={center - 4} textAnchor="middle" style={{ fontSize: 7, fontWeight: 600, letterSpacing: '0.1em', fill: 'var(--zinc-600)', textTransform: 'uppercase', fontFamily: 'var(--font-sans)' }}>Percentile</text>
      <text x={center} y={center + 6} textAnchor="middle" style={{ fontSize: 7, fill: 'var(--zinc-500)', fontFamily: 'var(--font-sans)' }}>Rank</text>
    </svg>
  )
}

function LegendChip({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ height: 8, width: 8, borderRadius: 2, background: color }}></div>
      <span style={{ color: 'var(--zinc-500)', fontSize: 10 }}>{label}</span>
    </div>
  )
}

function PerformancePizza({ title, subtitle, data, compositePercentile, size = 300 }) {
  return (
    <PfStatCard style={{ padding: 20 }}>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <PfEyebrow size="sm" dot={false}>{title}</PfEyebrow>
          {subtitle && <div style={{ marginTop: 2, ...pfMono(10, 'var(--zinc-400)') }}>{subtitle}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--zinc-950)' }}>
            P{Math.round(compositePercentile)}
          </div>
          <div style={{ marginTop: 4, ...pfMono(9, 'var(--emerald-600)') }}>AVG PERCENTILE</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PolarBarChart data={data} size={size} />
      </div>
      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <LegendChip color="#22c55e" label="Elite ≥90" />
        <LegendChip color="#4ade80" label="75+" />
        <LegendChip color="#eab308" label="50+" />
        <LegendChip color="#f97316" label="25+" />
        <LegendChip color="#ef4444" label="Low" />
      </div>
    </PfStatCard>
  )
}

/* ---- Ranked metric list ---- */
function TopMetricsList({ title, subtitle, metrics }) {
  const sorted = [...metrics].sort((a, b) => b.percentile - a.percentile)
  return (
    <PfStatCard style={{ padding: 16 }}>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <PfEyebrow size="sm" dot={false}>{title}</PfEyebrow>
        {subtitle && <div style={pfMono(10, 'var(--zinc-400)')}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map(metric => (
          <div key={metric.label}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: 'var(--zinc-700)' }}>
                {metric.label}
                {metric.subLabel && <span style={{ marginLeft: 4, fontSize: 12, color: 'var(--zinc-400)' }}>{metric.subLabel}</span>}
              </span>
              <span style={pfMono(14, 'var(--zinc-950)', { fontWeight: 600 })}>
                {metric.displayValue} <span style={{ color: 'var(--zinc-400)' }}>·</span>{' '}
                <span style={{ color: pfTierText(metric.percentile) }}>P{Math.round(metric.percentile)}</span>
              </span>
            </div>
            <PfPercentileBar percentile={metric.percentile} style={{ marginTop: 4 }} />
          </div>
        ))}
      </div>
    </PfStatCard>
  )
}

/* ---- Match history table ---- */
function MatchHistoryTable({ matches, mode }) {
  const showTech = mode === 'combined' || mode === 'technical'
  const showPhys = mode === 'combined' || mode === 'physical'
  const techCols = showTech ? ' 60px 60px 70px' : ''
  const physCols = showPhys ? ' 70px 70px 70px' : ''
  const gridTemplate = `80px 1fr 130px 50px${techCols}${physCols}`
  const Th = ({ children, right }) => (
    <div style={{ ...pfMono(9, 'var(--zinc-500)', { fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }), textAlign: right ? 'right' : 'left' }}>{children}</div>
  )
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <PfEyebrow>Match-by-match · last 8 played</PfEyebrow>
      </div>
      <PfStatCard style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: 12, alignItems: 'center', borderBottom: '1px solid var(--zinc-200)', background: 'rgba(250,250,250,0.6)', padding: '10px 16px' }}>
          <Th>Date</Th>
          <Th>Opponent</Th>
          <Th>Comp</Th>
          <Th right>Min</Th>
          {showTech && (<React.Fragment><Th right>G+A</Th><Th right>Drib</Th><Th right>xG+xA</Th></React.Fragment>)}
          {showPhys && (<React.Fragment><Th right>Speed</Th><Th right>Sprints</Th><Th right>Dist</Th></React.Fragment>)}
        </div>
        {matches.map((m, i) => {
          const standout = m.ga >= 2 || m.xgxa >= 0.5
          return (
            <div
              key={i}
              className="match-row"
              style={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: 12, alignItems: 'center', padding: '10px 16px', borderBottom: i < matches.length - 1 ? '1px solid var(--zinc-100)' : 'none' }}
            >
              <div style={pfMono(12)}>{m.date}</div>
              <div style={{ display: 'flex', minWidth: 0, alignItems: 'center', gap: 8, fontSize: 14 }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500, color: 'var(--zinc-900)' }}>{m.opponent}</span>
                <span style={{ flexShrink: 0, borderRadius: 2, background: 'var(--zinc-100)', padding: '1px 4px', ...pfMono(9, 'var(--zinc-600)', { fontWeight: 600 }) }}>{m.home ? 'H' : 'A'}</span>
                <span style={{ flexShrink: 0, borderRadius: 2, background: '#f0fdfa', padding: '1px 4px', ...pfMono(9, '#0f766e', { fontWeight: 600 }) }}>{m.pos}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--zinc-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.comp}</div>
              <div style={{ textAlign: 'right', ...pfMono(14) }}>{m.min}</div>
              {showTech && (
                <React.Fragment>
                  <div style={{ textAlign: 'right', ...pfMono(14, standout ? 'var(--emerald-600)' : 'var(--zinc-700)', { fontWeight: standout ? 600 : 400 }) }}>{m.gaDisplay}</div>
                  <div style={{ textAlign: 'right', ...pfMono(14, 'var(--zinc-900)') }}>{m.drib}</div>
                  <div style={{ textAlign: 'right', ...pfMono(14, m.xgxa >= 0.5 ? 'var(--emerald-600)' : 'var(--zinc-900)', { fontWeight: m.xgxa >= 0.5 ? 600 : 400 }) }}>{m.xgxa.toFixed(2)}</div>
                </React.Fragment>
              )}
              {showPhys && (
                <React.Fragment>
                  <div style={{ textAlign: 'right', ...pfMono(14, 'var(--zinc-900)') }}>{m.speed.toFixed(1)}</div>
                  <div style={{ textAlign: 'right', ...pfMono(14, 'var(--zinc-900)') }}>{m.sprints}</div>
                  <div style={{ textAlign: 'right', ...pfMono(14, 'var(--zinc-900)') }}>{m.dist.toFixed(1)}</div>
                </React.Fragment>
              )}
            </div>
          )
        })}
      </PfStatCard>
    </div>
  )
}

/* ---- Season trend chart ---- */
function SeasonTrendChart({ series, mode }) {
  const prefix = mode === 'physical' ? 'phys_' : mode === 'technical' ? 'tech_' : null
  const available = prefix ? series.filter(s => s.id.startsWith(prefix)) : series
  const [selectedId, setSelectedId] = React.useState(available[0] ? available[0].id : null)
  const active = available.find(s => s.id === selectedId) || available[0]
  if (!active) return null

  const decimals = active.decimals != null ? active.decimals : 2
  const values = active.points.map(p => p.value)
  const maxV = Math.max(...values, active.peerMedian != null ? active.peerMedian : -Infinity)
  const minV = Math.min(...values, active.peerMedian != null ? active.peerMedian : Infinity, 0)
  const range = maxV - minV || 1

  const W = 800, H = 220, PL = 50, PR = 20, PT = 20, PB = 30
  const cw = W - PL - PR, ch = H - PT - PB
  const xFor = i => (active.points.length === 1 ? PL + cw / 2 : PL + (i / (active.points.length - 1)) * cw)
  const yFor = v => PT + (1 - (v - minV) / range) * ch
  const linePath = active.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${xFor(i)},${yFor(p.value)}`).join(' ')
  const areaPath = `${linePath} L${xFor(active.points.length - 1)},${PT + ch} L${xFor(0)},${PT + ch} Z`
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => ({ y: PT + f * ch, label: (maxV - f * range).toFixed(decimals) }))
  const high = Math.max(...values), low = Math.min(...values)
  const highIdx = values.indexOf(high), lowIdx = values.indexOf(low)
  const delta = values[values.length - 1] - values[0]
  const unit = active.unit || ''

  const stat = (label, val, ctx, color) => (
    <div>
      <span style={pfMono(9, 'var(--zinc-400)', { letterSpacing: '0.18em', textTransform: 'uppercase' })}>{label}</span>{' '}
      <span style={{ marginLeft: 4, ...pfMono(11, color || 'var(--zinc-950)', { fontWeight: 600 }) }}>{val}</span>{' '}
      {ctx && <span style={{ fontSize: 11, color: 'var(--zinc-500)' }}>{ctx}</span>}
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <PfEyebrow>Season trend · {active.label}</PfEyebrow>
        {available.length > 1 && (
          <MonoSelect
            ariaLabel="Trend metric"
            value={active.id}
            onChange={setSelectedId}
            options={available.map(s => ({ value: s.id, label: s.label }))}
          />
        )}
      </div>
      <PfStatCard style={{ padding: 20 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }} preserveAspectRatio="none">
          <g stroke="#e4e4e7" strokeWidth="0.5">
            {gridLines.map((g, i) => <line key={i} x1={PL} y1={g.y} x2={W - PR} y2={g.y}></line>)}
          </g>
          <g fontFamily="ui-monospace, monospace" fontSize="10" fill="#a1a1aa">
            {gridLines.map((g, i) => <text key={i} x={PL - 10} y={g.y + 3} textAnchor="end">{g.label}</text>)}
          </g>
          {active.peerMedian != null && (
            <g>
              <line x1={PL} y1={yFor(active.peerMedian)} x2={W - PR} y2={yFor(active.peerMedian)} stroke="#a1a1aa" strokeWidth="1" strokeDasharray="4 4"></line>
              <text x={W - PR} y={yFor(active.peerMedian) - 3} textAnchor="end" fontFamily="ui-monospace, monospace" fontSize="9" fill="#71717a">
                Peer median · {active.peerMedian.toFixed(decimals)}
              </text>
            </g>
          )}
          <defs>
            <linearGradient id="pf-trend-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.12"></stop>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#pf-trend-fill)"></path>
          <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2.5"></path>
          {active.points.map((p, i) => <circle key={i} cx={xFor(i)} cy={yFor(p.value)} r="3" fill="#10b981"></circle>)}
          <g fontFamily="ui-monospace, monospace" fontSize="9" fill="#a1a1aa" textAnchor="middle">
            {active.points.map((p, i) => (i % 2 === 0 ? <text key={i} x={xFor(i)} y={H - 8}>{p.month}</text> : null))}
          </g>
        </svg>
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, borderTop: '1px solid var(--zinc-100)', paddingTop: 12, fontSize: 11 }}>
          {stat('Season high', `${high.toFixed(decimals)}${unit}`, active.points[highIdx].contextLabel)}
          {stat('Low', `${low.toFixed(decimals)}${unit}`, active.points[lowIdx].contextLabel)}
          {stat('Trend', `${delta >= 0 ? '↗ +' : '↘ '}${delta.toFixed(decimals)}${unit}`, null, delta >= 0 ? 'var(--emerald-600)' : 'var(--zinc-700)')}
        </div>
      </PfStatCard>
    </div>
  )
}

/* ---- Performance tab root ---- */
function PerformanceTab({ data }) {
  const [mode, setMode] = React.useState('combined')
  const [season, setSeason] = React.useState('2025/26')
  const [comp, setComp] = React.useState('Eredivisie')
  const [vsPos, setVsPos] = React.useState('ST')

  const techComposite = data.technicalPizza.reduce((a, d) => a + d.percentile, 0) / data.technicalPizza.length
  const physComposite = data.physicalPizza.reduce((a, d) => a + d.percentile, 0) / data.physicalPizza.length
  const showTech = mode === 'combined' || mode === 'technical'
  const showPhys = mode === 'combined' || mode === 'physical'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Sub-tabs + filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderBottom: '1px solid var(--zinc-200)' }}>
        <SubTabBar
          tabs={[
            { id: 'combined', label: 'Combined' },
            { id: 'technical', label: 'Technical' },
            { id: 'physical', label: 'Physical' },
          ]}
          active={mode}
          onChange={setMode}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 12 }}>
          <MonoSelect ariaLabel="Season" value={season} onChange={setSeason} options={[{ value: '2025/26', label: '2025/26' }, { value: '2024/25', label: '2024/25' }, { value: '2023/24', label: '2023/24' }]} />
          <MonoSelect ariaLabel="Competition" value={comp} onChange={setComp} options={[{ value: 'Eredivisie', label: 'Eredivisie' }, { value: 'KNVB Beker', label: 'KNVB Beker' }]} />
          <MonoSelect ariaLabel="Compared position" value={vsPos} onChange={setVsPos} options={[{ value: 'ST', label: 'vs ST' }, { value: 'LW', label: 'vs LW' }]} />
        </div>
      </div>

      {/* Pizzas + ranked metrics */}
      {mode === 'combined' ? (
        <React.Fragment>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <PerformancePizza title="Technical · Impect" subtitle={data.technicalSubtitle} data={data.technicalPizza} compositePercentile={techComposite} />
            <PerformancePizza title="Physical · SkillCorner" subtitle={data.physicalSubtitle} data={data.physicalPizza} compositePercentile={physComposite} />
          </div>
          <div>
            <div style={{ marginBottom: 12 }}>
              <PfEyebrow>Top metrics · ranked by percentile vs peers</PfEyebrow>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <TopMetricsList title="Technical · Impect" subtitle={data.technicalContextLabel} metrics={data.technicalMetrics} />
              <TopMetricsList title="Physical · SkillCorner" subtitle={data.physicalContextLabel} metrics={data.physicalMetrics} />
            </div>
          </div>
        </React.Fragment>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, alignItems: 'stretch' }}>
          <PerformancePizza
            title={showTech ? 'Technical · Impect' : 'Physical · SkillCorner'}
            subtitle={showTech ? data.technicalSubtitle : data.physicalSubtitle}
            data={showTech ? data.technicalPizza : data.physicalPizza}
            compositePercentile={showTech ? techComposite : physComposite}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <PfEyebrow>Top metrics · ranked by percentile vs peers</PfEyebrow>
            <div style={{ flex: 1 }}>
              <TopMetricsList
                title={showTech ? 'Technical · Impect' : 'Physical · SkillCorner'}
                subtitle={showTech ? data.technicalContextLabel : data.physicalContextLabel}
                metrics={showTech ? data.technicalMetrics : data.physicalMetrics}
              />
            </div>
          </div>
        </div>
      )}

      <MatchHistoryTable matches={data.matchHistory} mode={mode} />
      <SeasonTrendChart series={data.trendSeries} mode={mode} />
    </div>
  )
}

Object.assign(window, { PerformanceTab })
