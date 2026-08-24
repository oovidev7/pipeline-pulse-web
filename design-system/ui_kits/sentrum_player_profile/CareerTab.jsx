// Career tab — recreation of player-v2/tabs/CareerTab.tsx
// Totals strip · club timeline · season-by-season · market value · injuries.
const { Eyebrow: CrEyebrow, StatCard: CrStatCard } = window.SentrumDesignSystem_fd9502

const crMono = (size, color = 'var(--zinc-700)', extra = {}) => ({
  fontFamily: 'var(--font-mono)',
  fontSize: size,
  color,
  fontVariantNumeric: 'tabular-nums',
  ...extra,
})
const crTh = right => ({
  ...crMono(9, 'var(--zinc-500)', { fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }),
  textAlign: right ? 'right' : 'left',
})
const crOutfit = (size, extra = {}) => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  fontSize: size,
  lineHeight: 1,
  color: 'var(--zinc-950)',
  ...extra,
})

function crBadge(kind) {
  const styles = {
    emerald: { border: '1px solid #a7f3d0', background: 'var(--emerald-50)', color: 'var(--emerald-700)' },
    amber: { border: '1px solid #fde68a', background: '#fffbeb', color: '#b45309' },
  }
  return {
    borderRadius: 2,
    padding: '2px 6px',
    ...crMono(9, undefined, { fontWeight: 600 }),
    ...styles[kind],
  }
}

function availabilityTier(pct) {
  if (pct >= 90) return { text: 'var(--emerald-600)', bar: 'var(--emerald-500)' }
  if (pct >= 75) return { text: 'var(--emerald-700)', bar: 'var(--emerald-400)' }
  if (pct >= 60) return { text: '#d97706', bar: '#fbbf24' }
  return { text: '#dc2626', bar: '#f87171' }
}

/* ---- Totals strip ---- */
function CareerTotals({ totals }) {
  const cards = [
    { label: 'Career apps', value: totals.apps, caption: 'all comps' },
    { label: 'Minutes', value: totals.minutes, caption: totals.minPerApp + ' / app' },
    { label: 'Goals', value: totals.goals, caption: totals.goalsPer90 + ' / 90' },
    { label: 'Assists', value: totals.assists, caption: totals.assistsPer90 + ' / 90' },
    { label: 'Clubs', value: totals.clubs, caption: '+ ' + totals.youthClubs + ' youth' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
      {cards.map(c => (
        <CrStatCard key={c.label} style={{ padding: '12px 16px' }}>
          <CrEyebrow size="sm" dot={false}>{c.label}</CrEyebrow>
          <div style={crOutfit(24, { marginTop: 4 })}>{c.value}</div>
          {c.caption && <div style={{ marginTop: 6, fontSize: 11, color: 'var(--zinc-500)' }}>{c.caption}</div>}
        </CrStatCard>
      ))}
    </div>
  )
}

/* ---- Club timeline ---- */
const TIMELINE_COLS = '110px 1fr 120px 110px 70px 60px 60px'

function ClubTimeline({ clubs }) {
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <CrEyebrow>Career timeline</CrEyebrow>
      </div>
      <CrStatCard style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: TIMELINE_COLS, gap: 12, alignItems: 'center', borderBottom: '1px solid var(--zinc-200)', background: 'rgba(250,250,250,0.6)', padding: '10px 16px' }}>
          <div style={crTh()}>From — To</div>
          <div style={crTh()}>Club</div>
          <div style={crTh()}>Type</div>
          <div style={crTh(true)}>Fee</div>
          <div style={crTh(true)}>Apps</div>
          <div style={crTh(true)}>G</div>
          <div style={crTh(true)}>A</div>
        </div>
        {clubs.map((club, i) => (
          <div key={i} className="match-row" style={{ display: 'grid', gridTemplateColumns: TIMELINE_COLS, gap: 12, alignItems: 'center', padding: '12px 16px', borderBottom: i < clubs.length - 1 ? '1px solid var(--zinc-100)' : 'none' }}>
            <div style={crMono(12)}>{club.range}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
              <div style={{ height: 20, width: 20, flexShrink: 0, borderRadius: '50%', border: '1px solid var(--zinc-200)', background: 'var(--zinc-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...crMono(7, 'var(--zinc-600)', { fontWeight: 700 }) }}>
                {club.code}
              </div>
              <span style={{ fontWeight: 500, color: 'var(--zinc-900)' }}>{club.name}</span>
              {club.current && <span style={crBadge('emerald')}>CURRENT</span>}
            </div>
            <div style={{ fontSize: 14, color: 'var(--zinc-700)' }}>{club.type}</div>
            <div style={{ textAlign: 'right', ...crMono(14) }}>{club.fee || '—'}</div>
            <div style={{ textAlign: 'right', ...crMono(14, 'var(--zinc-900)') }}>{club.apps != null ? club.apps : '—'}</div>
            <div style={{ textAlign: 'right', ...crMono(14, 'var(--zinc-900)') }}>{club.goals != null ? club.goals : '—'}</div>
            <div style={{ textAlign: 'right', ...crMono(14, 'var(--zinc-900)') }}>{club.assists != null ? club.assists : '—'}</div>
          </div>
        ))}
      </CrStatCard>
    </div>
  )
}

/* ---- Season-by-season ---- */
const SEASON_COLS = '90px 1.2fr 1fr 60px 70px 50px 50px 70px 40px 40px'

function SeasonTable({ seasonStats, currentSeason }) {
  const [selected, setSelected] = React.useState('all')
  const seasons = [...new Set(seasonStats.map(s => s.season))]
  const filtered = selected === 'all' ? seasonStats : seasonStats.filter(s => s.season === selected)
  const totals = filtered.reduce(
    (acc, r) => ({
      apps: acc.apps + r.apps, minutes: acc.minutes + r.minutes,
      goals: acc.goals + r.goals, assists: acc.assists + r.assists,
      y: acc.y + r.y, r: acc.r + r.r,
    }),
    { apps: 0, minutes: 0, goals: 0, assists: 0, y: 0, r: 0 }
  )
  const ga90 = totals.minutes > 0 ? (((totals.goals + totals.assists) / totals.minutes) * 90).toFixed(2) : '—'

  const numCell = (v, opts = {}) => (
    <div style={{ textAlign: 'right', ...crMono(14, opts.color || 'var(--zinc-700)', { fontWeight: opts.bold ? 600 : 400 }) }}>{v}</div>
  )

  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <CrEyebrow>Season-by-season · {selected === 'all' ? 'All competitions' : selected}</CrEyebrow>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <select
            value={selected}
            aria-label="Season filter"
            onChange={e => setSelected(e.target.value)}
            style={{ appearance: 'none', WebkitAppearance: 'none', borderRadius: 6, border: '1px solid var(--zinc-200)', background: '#fff', padding: '6px 28px 6px 12px', ...crMono(11, 'var(--zinc-700)', { letterSpacing: '0.05em', textTransform: 'uppercase' }), cursor: 'pointer', outline: 'none' }}
          >
            <option value="all">All seasons</option>
            {seasons.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '50%', right: 8, width: 14, height: 14, transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--zinc-400)' }} aria-hidden="true">
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </div>
      </div>
      <CrStatCard style={{ overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: SEASON_COLS, gap: 12, alignItems: 'center', borderBottom: '1px solid var(--zinc-200)', background: 'rgba(250,250,250,0.6)', padding: '10px 16px' }}>
          <div style={crTh()}>Season</div>
          <div style={crTh()}>Competition</div>
          <div style={crTh()}>Club</div>
          <div style={crTh(true)}>Apps</div>
          <div style={crTh(true)}>Mins</div>
          <div style={crTh(true)}>G</div>
          <div style={crTh(true)}>A</div>
          <div style={crTh(true)}>G+A/90</div>
          <div style={crTh(true)}>Y</div>
          <div style={crTh(true)}>R</div>
        </div>
        {filtered.map((s, i) => {
          const rowGa90 = s.minutes > 0 ? (((s.goals + s.assists) / s.minutes) * 90).toFixed(2) : '—'
          const highlight = selected === 'all' && s.season === currentSeason
          return (
            <div key={i} className="match-row" style={{ display: 'grid', gridTemplateColumns: SEASON_COLS, gap: 12, alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid var(--zinc-100)', background: highlight ? 'rgba(236,253,245,0.2)' : 'transparent' }}>
              <div style={crMono(12, 'var(--zinc-900)', { fontWeight: highlight ? 600 : 400 })}>{s.season}</div>
              <div style={{ fontSize: 14, color: 'var(--zinc-900)' }}>{s.competition}</div>
              <div style={{ fontSize: 14, color: 'var(--zinc-700)' }}>{s.club}</div>
              {numCell(s.apps, { color: 'var(--zinc-900)' })}
              {numCell(s.minutes.toLocaleString(), { color: 'var(--zinc-900)' })}
              {numCell(s.goals, { color: s.goals > 0 ? 'var(--emerald-600)' : 'var(--zinc-700)', bold: s.goals > 0 })}
              {numCell(s.assists, { color: s.assists > 0 ? 'var(--emerald-600)' : 'var(--zinc-700)', bold: s.assists > 0 })}
              {numCell(rowGa90, { color: 'var(--zinc-900)', bold: true })}
              {numCell(s.y, { color: 'var(--zinc-500)' })}
              {numCell(s.r, { color: 'var(--zinc-500)' })}
            </div>
          )
        })}
        <div style={{ display: 'grid', gridTemplateColumns: SEASON_COLS, gap: 12, alignItems: 'center', borderTop: '1px solid var(--zinc-200)', background: 'rgba(250,250,250,0.4)', padding: '10px 16px' }}>
          <div style={{ gridColumn: 'span 3', ...crMono(10, 'var(--zinc-500)', { letterSpacing: '0.18em', textTransform: 'uppercase' }) }}>
            {selected === 'all' ? 'Career totals' : 'Totals'}
          </div>
          {numCell(totals.apps, { color: 'var(--zinc-950)', bold: true })}
          {numCell(totals.minutes.toLocaleString(), { color: 'var(--zinc-950)', bold: true })}
          {numCell(totals.goals, { color: 'var(--zinc-950)', bold: true })}
          {numCell(totals.assists, { color: 'var(--zinc-950)', bold: true })}
          {numCell(ga90, { color: 'var(--zinc-950)', bold: true })}
          {numCell(totals.y, { color: 'var(--zinc-500)', bold: true })}
          {numCell(totals.r, { color: 'var(--zinc-500)', bold: true })}
        </div>
      </CrStatCard>
    </div>
  )
}

/* ---- Market value full-width chart ---- */
function MarketValueFull({ history, currentValue }) {
  const W = 800, H = 200, PL = 50, PR = 20, PT = 20, PB = 28
  const cw = W - PL - PR, ch = H - PT - PB
  const max = Math.max(...history.map(p => p.value))
  const xFor = i => PL + (i / (history.length - 1)) * cw
  const yFor = v => PT + (1 - v / max) * ch
  const line = history.map((p, i) => `${i === 0 ? 'M' : 'L'}${xFor(i)},${yFor(p.value)}`).join(' ')
  const area = `${line} L${xFor(history.length - 1)},${PT + ch} L${xFor(0)},${PT + ch} Z`
  const grid = [0, 0.5, 1].map(f => ({ y: PT + f * ch, label: '€' + ((1 - f) * max).toFixed(0) + 'M' }))
  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <CrEyebrow>Market value · full history</CrEyebrow>
      </div>
      <CrStatCard style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={crOutfit(24)}>{currentValue}</div>
          <span style={crMono(10, 'var(--zinc-400)')}>Transfermarkt-style estimate · seasons</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }} preserveAspectRatio="none">
          <g stroke="#e4e4e7" strokeWidth="0.5">
            {grid.map((g, i) => <line key={i} x1={PL} y1={g.y} x2={W - PR} y2={g.y}></line>)}
          </g>
          <g fontFamily="ui-monospace, monospace" fontSize="10" fill="#a1a1aa">
            {grid.map((g, i) => <text key={i} x={PL - 10} y={g.y + 3} textAnchor="end">{g.label}</text>)}
          </g>
          <defs>
            <linearGradient id="cr-mv-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.12"></stop>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          <path d={area} fill="url(#cr-mv-fill)"></path>
          <path d={line} fill="none" stroke="#10b981" strokeWidth="2.5"></path>
          {history.map((p, i) => <circle key={i} cx={xFor(i)} cy={yFor(p.value)} r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1.5"></circle>)}
          <g fontFamily="ui-monospace, monospace" fontSize="9" fill="#a1a1aa" textAnchor="middle">
            {history.map((p, i) => <text key={i} x={xFor(i)} y={H - 8}>{p.label}</text>)}
          </g>
        </svg>
      </CrStatCard>
    </div>
  )
}

/* ---- Injuries ---- */
const INJURY_COLS = '170px 1fr 110px 60px 80px'

function InjuryRecord({ injuries, availability }) {
  const totalDays = injuries.reduce((s, i) => s + i.days, 0)
  const avg = injuries.length ? Math.round(totalDays / injuries.length) : 0
  const allRecovered = injuries.every(i => i.recovered)
  const totalsCell = (label, value) => (
    <div style={{ textAlign: 'center' }}>
      <CrEyebrow size="sm" dot={false} style={{ justifyContent: 'center' }}>{label}</CrEyebrow>
      <div style={crOutfit(18, { marginTop: 4 })}>{value}</div>
    </div>
  )
  return (
    <div>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <CrEyebrow>Injury record</CrEyebrow>
        <span style={crBadge(allRecovered ? 'emerald' : 'amber')}>{allRecovered ? 'CURRENTLY AVAILABLE' : 'INJURED'}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: 8 }}>
        <CrStatCard style={{ padding: 20 }}>
          <CrEyebrow size="sm" dot={false} style={{ marginBottom: 16 }}>Availability by season</CrEyebrow>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {availability.map(a => {
              const tier = availabilityTier(a.pct)
              return (
                <div key={a.season}>
                  <div style={{ marginBottom: 6, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <span style={crMono(11, 'var(--zinc-500)', { letterSpacing: '0.18em', textTransform: 'uppercase' })}>{a.season}</span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ ...crOutfit(15), color: tier.text }}>{a.pct.toFixed(1)}%</span>
                      <span style={crMono(10, 'var(--zinc-400)', { letterSpacing: '0.1em', textTransform: 'uppercase' })}>· {a.days}d out</span>
                    </div>
                  </div>
                  <div style={{ position: 'relative', height: 8, overflow: 'hidden', borderRadius: 9999, background: 'var(--zinc-100)' }}>
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, background: tier.bar, width: a.pct + '%' }}></div>
                    <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, background: 'rgba(251,191,36,0.8)', width: (100 - a.pct) + '%' }}></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, borderTop: '1px solid var(--zinc-100)', paddingTop: 16 }}>
            {totalsCell('Total', totalDays + 'd')}
            {totalsCell('Spells', injuries.length)}
            {totalsCell('Avg', avg + 'd')}
          </div>
        </CrStatCard>
        <CrStatCard style={{ overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: INJURY_COLS, gap: 16, alignItems: 'center', borderBottom: '1px solid var(--zinc-200)', background: 'rgba(250,250,250,0.6)', padding: '10px 20px' }}>
            <div style={crTh()}>Dates</div>
            <div style={crTh()}>Type</div>
            <div style={crTh()}>Status</div>
            <div style={crTh(true)}>Days</div>
            <div style={crTh(true)}>Matches</div>
          </div>
          {injuries.map((injury, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: INJURY_COLS, gap: 16, alignItems: 'center', padding: '12px 20px', borderBottom: i < injuries.length - 1 ? '1px solid var(--zinc-100)' : 'none' }}>
              <div style={{ whiteSpace: 'nowrap', ...crMono(12) }}>{injury.dates}</div>
              <div style={{ fontSize: 14, color: 'var(--zinc-900)' }}>{injury.type}</div>
              <div><span style={crBadge(injury.recovered ? 'emerald' : 'amber')}>{injury.recovered ? 'RECOVERED' : 'ACTIVE'}</span></div>
              <div style={{ textAlign: 'right', ...crMono(14, 'var(--zinc-900)') }}>{injury.days}</div>
              <div style={{ textAlign: 'right', ...crMono(14, 'var(--zinc-900)') }}>{injury.matches}</div>
            </div>
          ))}
        </CrStatCard>
      </div>
    </div>
  )
}

function CareerTab({ data, marketValueHistory, currentValue }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <CareerTotals totals={data.totals} />
      <ClubTimeline clubs={data.clubs} />
      <SeasonTable seasonStats={data.seasonStats} currentSeason={data.currentSeason} />
      <MarketValueFull history={marketValueHistory} currentValue={currentValue} />
      <InjuryRecord injuries={data.injuries} availability={data.availability} />
    </div>
  )
}

Object.assign(window, { CareerTab })
