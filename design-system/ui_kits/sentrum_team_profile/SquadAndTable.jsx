// Team profile — Squad table (ClubSquad.tsx port) and League standings
// (LeagueStandings.tsx port).
const { Eyebrow: TsqEyebrow, StatCard: TsqStatCard } = window.SentrumDesignSystem_fd9502

const sqMono = (size, color = 'var(--zinc-500)', extra = {}) => ({
  fontFamily: 'var(--font-mono)',
  fontSize: size,
  color,
  fontVariantNumeric: 'tabular-nums',
  ...extra,
})
const sqTh = { ...sqMono(10, 'var(--zinc-500)', { fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }) }

const POS_BADGE = {
  GK: { background: '#fef3c7', color: '#b45309' },
  DEF: { background: '#e0f2fe', color: '#0369a1' },
  MID: { background: 'var(--emerald-50)', color: 'var(--emerald-700)' },
  FWD: { background: '#fee2e2', color: '#b91c1c' },
}
const POS_ORDER = { GK: 1, DEF: 2, MID: 3, FWD: 4 }

function contractColor(year) {
  if (year <= 2026) return { color: '#dc2626', fontWeight: 500 }
  if (year <= 2027) return { color: '#d97706' }
  return { color: 'var(--zinc-700)' }
}

const SortGlyph = ({ state }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13, opacity: state ? 1 : 0.45 }} aria-hidden="true">
    {state === 'asc' ? <path d="m18 15-6-6-6 6"></path> : state === 'desc' ? <path d="m6 9 6 6 6-6"></path> : <React.Fragment><path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path></React.Fragment>}
  </svg>
)

function SquadTable({ players }) {
  const [sortField, setSortField] = React.useState('position')
  const [sortDir, setSortDir] = React.useState('asc')
  const [minutesView, setMinutesView] = React.useState('league')

  const getMinutes = p => (minutesView === 'league' ? p.minLeague : p.minAll)
  const maxMinutes = Math.max(...players.map(getMinutes))

  const handleSort = field => {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else {
      setSortField(field)
      setSortDir(field === 'name' || field === 'position' ? 'asc' : 'desc')
    }
  }

  const sorted = [...players].sort((a, b) => {
    let cmp = 0
    if (sortField === 'position') cmp = (POS_ORDER[a.pos] || 99) - (POS_ORDER[b.pos] || 99)
    else if (sortField === 'name') cmp = a.name.localeCompare(b.name)
    else if (sortField === 'age') cmp = a.age - b.age
    else if (sortField === 'value') cmp = a.valueNum - b.valueNum
    else if (sortField === 'minutes') cmp = getMinutes(a) - getMinutes(b)
    else if (sortField === 'contract') cmp = a.contract - b.contract
    return sortDir === 'asc' ? cmp : -cmp
  })

  const SortHeader = ({ label, field, align = 'left' }) => (
    <th style={{ padding: '12px', textAlign: align }}>
      <button type="button" onClick={() => handleSort(field)} className="sort-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, border: 'none', background: 'none', cursor: 'pointer', padding: 0, ...sqTh, color: sortField === field ? 'var(--zinc-900)' : 'var(--zinc-500)' }}>
        {label}
        <SortGlyph state={sortField === field ? sortDir : null} />
      </button>
    </th>
  )

  return (
    <TsqStatCard style={{ overflow: 'hidden' }}>
      {/* Minutes view toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--zinc-100)', padding: '12px 16px' }}>
        <span style={{ ...sqMono(10, 'var(--zinc-500)', { fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }) }}>Minutes Played</span>
        <div className="snt-tabs__list" style={{ padding: 2 }}>
          {[['league', 'League Only'], ['all', 'All Competitions']].map(([v, label]) => (
            <button key={v} type="button" className="snt-tabs__trigger" data-active={minutesView === v ? 'true' : 'false'} style={{ height: 24, fontSize: 12, padding: '2px 10px' }} onClick={() => setMinutesView(v)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--zinc-200)', background: 'var(--zinc-50)' }}>
            <th style={{ width: 40, padding: 12, textAlign: 'left', ...sqTh }}>#</th>
            <SortHeader label="Player" field="name" />
            <SortHeader label="Pos" field="position" align="center" />
            <SortHeader label="Age" field="age" align="center" />
            <SortHeader label="Minutes" field="minutes" align="right" />
            <th style={{ padding: 12, textAlign: 'right', ...sqTh }}>Share</th>
            <SortHeader label="Value" field="value" align="right" />
            <SortHeader label="Contract" field="contract" align="right" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => {
            const mins = getMinutes(p)
            return (
              <tr key={p.name} className="row-hover" style={{ cursor: 'pointer', borderBottom: i < sorted.length - 1 ? '1px solid var(--zinc-100)' : 'none' }}>
                <td style={{ padding: '10px 12px', textAlign: 'center', ...sqMono(14, 'var(--zinc-500)', { fontWeight: 500 }) }}>{p.num}</td>
                <td style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="snt-avatar" style={{ width: 32, height: 32, fontSize: 10 }}>{p.initials}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--zinc-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--zinc-500)' }}>{p.nationality}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <span style={{ display: 'inline-flex', borderRadius: 4, padding: '2px 6px', ...sqMono(10, undefined, { fontWeight: 600, letterSpacing: '0.1em' }), ...POS_BADGE[p.pos] }}>{p.pos}</span>
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', fontSize: 14, color: 'var(--zinc-700)', fontVariantNumeric: 'tabular-nums' }}>{p.age}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 14, color: 'var(--zinc-700)', fontVariantNumeric: 'tabular-nums' }}>{mins.toLocaleString()}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 14, color: 'var(--zinc-500)', fontVariantNumeric: 'tabular-nums' }}>{Math.round((mins / maxMinutes) * 100)}%</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 14, fontWeight: 500, color: 'var(--emerald-600)', fontVariantNumeric: 'tabular-nums' }}>{p.value}</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', fontSize: 14, fontVariantNumeric: 'tabular-nums', ...contractColor(p.contract) }}>{p.contract}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </TsqStatCard>
  )
}

/* ---- League standings ---- */
function positionAccent(position, total) {
  if (position <= 4) return '#0ea5e9'
  if (position <= 6) return '#f59e0b'
  if (position === 7) return 'var(--emerald-500)'
  if (position > total - 3) return '#ef4444'
  return 'transparent'
}

function LeagueStandings({ standings, highlightTeam }) {
  const total = standings.length
  const center = { padding: '10px 8px', textAlign: 'center', fontSize: 14, color: 'var(--zinc-700)', fontVariantNumeric: 'tabular-nums' }
  return (
    <TsqStatCard style={{ overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--zinc-200)', background: 'var(--zinc-50)' }}>
            <th style={{ width: 40, padding: '12px 8px', textAlign: 'center', ...sqTh }}>#</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', ...sqTh }}>Team</th>
            {['P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts'].map(h => (
              <th key={h} style={{ width: 52, padding: '12px 8px', textAlign: 'center', ...sqTh }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standings.map((team, i) => {
            const highlighted = team.name === highlightTeam
            return (
              <tr key={team.name} className={highlighted ? '' : 'row-hover'} style={{ background: highlighted ? 'var(--emerald-50)' : 'transparent', borderBottom: i < standings.length - 1 ? '1px solid var(--zinc-100)' : 'none' }}>
                <td style={{ padding: '10px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <div style={{ height: 20, width: 4, borderRadius: 9999, background: positionAccent(team.position, total) }}></div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--zinc-700)', fontVariantNumeric: 'tabular-nums' }}>{team.position}</span>
                  </div>
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', height: 24, width: 24, flexShrink: 0, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 4, background: 'var(--zinc-100)', ...sqMono(8, 'var(--zinc-500)', { fontWeight: 700 }) }}>{team.tla}</div>
                    <span style={{ fontSize: 14, fontWeight: highlighted ? 700 : 500, color: 'var(--zinc-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{team.name}</span>
                  </div>
                </td>
                <td style={center}>{team.p}</td>
                <td style={center}>{team.w}</td>
                <td style={center}>{team.d}</td>
                <td style={center}>{team.l}</td>
                <td style={center}>{team.gf}</td>
                <td style={center}>{team.ga}</td>
                <td style={{ ...center, color: team.gd > 0 ? 'var(--emerald-600)' : team.gd < 0 ? '#dc2626' : 'var(--zinc-700)' }}>{team.gd > 0 ? `+${team.gd}` : team.gd}</td>
                <td style={{ ...center, fontWeight: 700, color: 'var(--zinc-950)' }}>{team.pts}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, borderTop: '1px solid var(--zinc-100)', padding: '10px 16px' }}>
        {[['#0ea5e9', 'Champions League'], ['#f59e0b', 'Europa League'], ['var(--emerald-500)', 'Conference League'], ['#ef4444', 'Relegation']].map(([color, label]) => (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--zinc-500)' }}>
            <span style={{ display: 'inline-block', height: 10, width: 4, borderRadius: 9999, background: color }}></span>
            {label}
          </span>
        ))}
      </div>
    </TsqStatCard>
  )
}

Object.assign(window, { SquadTable, LeagueStandings })
