// Team profile Overview tab, part 2 — LastMatchFormation, TacticalIdentityCard,
// UpcomingFixturesCard, SentrumPanel. Ports of components/profiles/club/*.
const { Eyebrow: Tov2Eyebrow, StatCard: Tov2StatCard } = window.SentrumDesignSystem_fd9502

const t2Mono = (size, color = 'var(--zinc-500)', extra = {}) => ({
  fontFamily: 'var(--font-mono)',
  fontSize: size,
  color,
  fontVariantNumeric: 'tabular-nums',
  ...extra,
})
const t2Outfit = (size, extra = {}) => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  fontSize: size,
  lineHeight: 1,
  color: 'var(--zinc-950)',
  ...extra,
})

/* ---- Last match formation ---- */
// Landscape green pitch, 4-3-3 slots in % coords (attacking right).
const FORMATION_433 = [
  { pos: 'GK', x: 6, y: 50 },
  { pos: 'RB', x: 22, y: 82 },
  { pos: 'CB', x: 20, y: 62 },
  { pos: 'CB2', x: 20, y: 38 },
  { pos: 'LB', x: 22, y: 18 },
  { pos: 'CM1', x: 44, y: 68 },
  { pos: 'DM', x: 38, y: 50 },
  { pos: 'CM2', x: 44, y: 32 },
  { pos: 'RW', x: 68, y: 80 },
  { pos: 'ST', x: 74, y: 50 },
  { pos: 'LW', x: 68, y: 20 },
]

function PitchLandscape() {
  return (
    <svg viewBox="0 0 113 72" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', borderRadius: 8 }} preserveAspectRatio="none" aria-hidden="true">
      <rect x="0" y="0" width="113" height="72" fill="#2d7a4f"></rect>
      <g opacity="0.08">
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={i * 14.125} y="0" width="7.06" height="72" fill="#fff"></rect>
        ))}
      </g>
      <g stroke="rgba(255,255,255,0.65)" strokeWidth="0.5" fill="none">
        <rect x="1" y="1" width="111" height="70"></rect>
        <line x1="56.5" y1="1" x2="56.5" y2="71"></line>
        <circle cx="56.5" cy="36" r="8"></circle>
        <circle cx="56.5" cy="36" r="0.6" fill="rgba(255,255,255,0.65)"></circle>
        <rect x="1" y="18" width="15" height="36"></rect>
        <rect x="1" y="27" width="5.5" height="18"></rect>
        <rect x="97" y="18" width="15" height="36"></rect>
        <rect x="106.5" y="27" width="5.5" height="18"></rect>
      </g>
    </svg>
  )
}

function PlayerChip({ player }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <div style={{ position: 'relative' }}>
        <span className="snt-avatar" style={{ width: 34, height: 34, fontSize: 10, background: '#fff', color: 'var(--zinc-700)', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }}>{player.initials}</span>
        <span style={{ position: 'absolute', top: -4, right: -7, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 15, height: 15, borderRadius: 9999, background: 'var(--zinc-950)', color: '#fff', ...t2Mono(8, '#fff', { fontWeight: 600 }), padding: '0 3px' }}>{player.num}</span>
      </div>
      <span style={{ borderRadius: 3, background: 'rgba(0,0,0,0.55)', padding: '1px 5px', fontSize: 9, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)' }}>{player.short}</span>
    </div>
  )
}

function LastMatchFormation({ match }) {
  return (
    <Tov2StatCard style={{ overflow: 'hidden', borderRadius: 12 }}>
      {/* Match header */}
      <div style={{ borderBottom: '1px solid var(--zinc-200)', padding: 16 }}>
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, ...t2Mono(10, 'var(--zinc-500)', { fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }) }}>
          <span>{match.competition}</span>
          <span style={{ color: 'var(--zinc-300)' }}>·</span>
          <span>{match.date}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', minWidth: 0, alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: match.homeIsUs ? 'var(--zinc-900)' : 'var(--zinc-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{match.homeTeam}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ ...t2Outfit(30, { fontWeight: 700 }), display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span>{match.scoreHome}</span>
              <span style={{ color: 'var(--zinc-300)' }}>–</span>
              <span>{match.scoreAway}</span>
            </span>
            <span style={{ borderRadius: 4, padding: '2px 6px', fontSize: 10, fontWeight: 700, color: '#fff', background: match.result === 'W' ? 'var(--emerald-500)' : match.result === 'D' ? '#f59e0b' : '#ef4444' }}>{match.result}</span>
          </div>
          <div style={{ display: 'flex', minWidth: 0, alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: match.homeIsUs ? 'var(--zinc-500)' : 'var(--zinc-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{match.awayTeam}</span>
          </div>
        </div>
      </div>

      {/* Body: pitch | subs | events */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 220px 220px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 16 }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 760, margin: '0 auto', aspectRatio: '113 / 72' }}>
            <PitchLandscape />
            <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 4, borderRadius: 9999, background: 'rgba(255,255,255,0.7)', padding: '2px 8px', fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#064e3b', backdropFilter: 'blur(2px)' }}>
              <span>Attack</span>
              <span aria-hidden="true">→</span>
            </div>
            {FORMATION_433.map((slot, i) => (
              <div key={slot.pos} style={{ position: 'absolute', left: slot.x + '%', top: slot.y + '%', transform: 'translate(-50%, -50%)' }}>
                <PlayerChip player={match.starters[i]} />
              </div>
            ))}
          </div>
          <span style={{ ...t2Mono(11, 'var(--zinc-500)', { fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }) }}>{match.formation}</span>
        </div>

        {/* Subs */}
        <div style={{ borderLeft: '1px solid var(--zinc-200)', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <h3 style={{ margin: '0 0 8px', ...t2Mono(10, 'var(--zinc-500)', { fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }) }}>Subs Used ({match.subs.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {match.subs.map((sub, i) => (
                <div key={i}>
                  <div style={{ marginBottom: 2, display: 'flex', alignItems: 'center', gap: 4, ...t2Mono(10) }}>
                    <span style={{ fontWeight: 600, color: 'var(--zinc-700)' }}>{sub.minute}'</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>off {sub.off}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 6, background: 'var(--zinc-100)', padding: '4px 6px' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--zinc-900)' }}>{sub.on}</span>
                    <span style={{ fontSize: 12, color: 'var(--zinc-400)' }}>({sub.num})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ margin: '0 0 8px', ...t2Mono(10, 'var(--zinc-500)', { fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }) }}>Bench ({match.bench.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {match.bench.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 6, background: 'var(--zinc-50)', padding: '4px 6px' }}>
                  <span style={{ fontSize: 13, color: 'var(--zinc-700)' }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--zinc-400)' }}>({p.num})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Events */}
        <div style={{ borderLeft: '1px solid var(--zinc-200)', padding: 16 }}>
          <h3 style={{ margin: '0 0 8px', ...t2Mono(10, 'var(--zinc-500)', { fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }) }}>Match Events ({match.events.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {match.events.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ width: 26, textAlign: 'right', ...t2Mono(11, 'var(--zinc-500)', { fontWeight: 600 }) }}>{e.minute}'</span>
                <span aria-hidden="true" style={{ width: 14, display: 'inline-flex', justifyContent: 'center' }}>
                  {e.kind === 'goal' ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--zinc-700)" strokeWidth="2" style={{ width: 11, height: 11 }}><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3.5" fill="var(--zinc-700)" stroke="none"></circle></svg>
                  ) : (
                    <span style={{ display: 'inline-block', width: 8, height: 11, borderRadius: 1.5, background: e.kind === 'yellow' ? '#facc15' : '#ef4444', verticalAlign: 'middle' }}></span>
                  )}
                </span>
                <span style={{ minWidth: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--zinc-900)' }}>
                  {e.player}
                  {e.detail && <span style={{ color: 'var(--zinc-400)' }}> {e.detail}</span>}
                </span>
                <span style={{ ...t2Mono(10, e.us ? 'var(--emerald-600)' : 'var(--zinc-400)', { fontWeight: 600 }) }}>{e.teamCode}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Tov2StatCard>
  )
}

/* ---- Tactical identity card ---- */
function TacticalIdentityCard({ data }) {
  const [filter, setFilter] = React.useState(data.competitions[0].id)
  const [openRow, setOpenRow] = React.useState(null)
  const showComp = filter === 'all'
  const matches = filter === 'all' ? data.matches : data.matches.filter(m => m.compId === filter)
  const groups = {}
  for (const m of matches) {
    groups[m.formation] = groups[m.formation] || []
    groups[m.formation].push(m)
  }
  const formations = Object.entries(groups)
    .map(([name, ms]) => ({ name, count: ms.length, pct: Math.round((ms.length / matches.length) * 100), matches: ms }))
    .sort((a, b) => b.count - a.count)

  return (
    <Tov2StatCard>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, borderBottom: '1px solid var(--zinc-100)', padding: '12px 16px' }}>
        {[...data.competitions, { id: 'all', name: 'All' }].map(c => {
          const selected = filter === c.id
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={selected}
              onClick={() => { setFilter(c.id); setOpenRow(null) }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                borderRadius: 9999,
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                border: selected ? '1px solid transparent' : '1px solid var(--zinc-200)',
                background: selected ? 'var(--zinc-950)' : 'var(--zinc-50)',
                color: selected ? '#fff' : 'var(--zinc-700)',
                whiteSpace: 'nowrap',
              }}
            >
              {c.name}
            </button>
          )
        })}
      </div>
      <div style={{ padding: '4px 16px' }}>
        {formations.map(entry => {
          const open = openRow === entry.name
          return (
            <div key={entry.name} style={{ borderBottom: '1px solid var(--zinc-100)' }}>
              <button
                type="button"
                onClick={() => setOpenRow(open ? null : entry.name)}
                aria-expanded={open}
                className="row-hover"
                style={{ display: 'grid', width: '100%', gridTemplateColumns: '16px 104px minmax(0,1fr) 68px', alignItems: 'center', gap: 8, padding: '8px 0', fontSize: 12, border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, color: 'var(--zinc-400)', transform: open ? 'rotate(90deg)' : 'none' }} aria-hidden="true">
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
                <span style={{ textAlign: 'left', fontWeight: 500, color: 'var(--zinc-900)', fontVariantNumeric: 'tabular-nums' }}>{entry.name}</span>
                <span style={{ height: 12, overflow: 'hidden', borderRadius: 4, background: 'var(--zinc-100)' }}>
                  <span style={{ display: 'block', height: '100%', background: open ? 'var(--emerald-500)' : 'var(--zinc-400)', width: entry.pct + '%' }}></span>
                </span>
                <span style={{ textAlign: 'right', ...t2Mono(12, 'var(--zinc-600)') }}>{entry.pct}% <span style={{ opacity: 0.6 }}>({entry.count})</span></span>
              </button>
              {open && (
                <ul style={{ listStyle: 'none', margin: 0, padding: '4px 4px 8px 28px' }}>
                  {entry.matches.map((m, i) => (
                    <li key={i} style={{ display: 'grid', gridTemplateColumns: '52px minmax(0,1fr) 16px 56px', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 12, borderTop: i > 0 ? '1px solid var(--zinc-50)' : 'none' }}>
                      <span style={{ textAlign: 'right', ...t2Mono(11, 'var(--zinc-500)', { fontWeight: 500 }) }}>{m.date}</span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--zinc-900)' }}>{m.opponent}</span>
                      <span style={{ textAlign: 'center', ...t2Mono(10, 'var(--zinc-400)', { fontWeight: 500, textTransform: 'uppercase' }) }}>{m.home ? 'H' : 'A'}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 4, padding: '2px 6px', ...t2Mono(11, undefined, { fontWeight: 600 }), background: m.result === 'W' ? 'var(--emerald-50)' : m.result === 'L' ? '#fef2f2' : 'var(--zinc-100)', color: m.result === 'W' ? 'var(--emerald-700)' : m.result === 'L' ? '#b91c1c' : 'var(--zinc-700)', boxShadow: 'inset 0 0 0 1px ' + (m.result === 'W' ? 'rgba(5,150,105,0.2)' : m.result === 'L' ? 'rgba(220,38,38,0.2)' : 'var(--zinc-300)') }}>
                        <span>{m.result}</span>
                        <span style={{ opacity: 0.7 }}>{m.score}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </Tov2StatCard>
  )
}

/* ---- Upcoming fixtures card ---- */
function UpcomingFixturesCard({ fixtures }) {
  const badgeTone = { now: { background: '#d1fae5', color: '#065f46' }, soon: { background: '#fef3c7', color: '#92400e' }, far: { background: 'var(--zinc-100)', color: 'var(--zinc-600)' } }
  return (
    <Tov2StatCard style={{ overflow: 'hidden' }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {fixtures.map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'stretch', gap: 12, padding: 12, borderTop: i > 0 ? '1px solid var(--zinc-100)' : 'none' }}>
            <div style={{ display: 'flex', width: 48, flexShrink: 0, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: 'var(--zinc-50)', padding: '4px 0', lineHeight: 1.2 }}>
              <span style={t2Mono(9, 'var(--zinc-500)', { fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' })}>{f.weekday}</span>
              <span style={t2Outfit(16, { fontWeight: 700 })}>{f.day}</span>
              <span style={t2Mono(9, 'var(--zinc-500)', { fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' })}>{f.month}</span>
            </div>
            <div style={{ display: 'flex', minWidth: 0, flex: 1, flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...t2Mono(10, 'var(--zinc-500)', { fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }) }}>{f.competition}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 500, color: 'var(--zinc-900)' }}>{f.opponent}</span>
            </div>
            <div style={{ display: 'flex', flexShrink: 0, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 4 }}>
              {f.badge && <span style={{ display: 'inline-flex', alignItems: 'center', borderRadius: 4, padding: '2px 6px', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap', ...badgeTone[f.badgeTone] }}>{f.badge}</span>}
              <span style={t2Mono(10, 'var(--zinc-400)', { fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' })}>{f.home ? 'Home' : 'Away'}</span>
            </div>
          </li>
        ))}
      </ul>
    </Tov2StatCard>
  )
}

/* ---- Sentrum panel ("What we know") ---- */
function SentrumPanel({ activity }) {
  const totalReports = activity.players.reduce((s, p) => s + p.reports, 0)
  return (
    <Tov2StatCard style={{ overflow: 'hidden' }}>
      <header style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, borderBottom: '1px solid var(--zinc-100)', padding: '10px 12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, ...t2Mono(10, 'var(--zinc-500)', { fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }) }}>
          <span style={{ display: 'inline-block', height: 4, width: 4, borderRadius: 9999, background: 'var(--emerald-500)' }}></span>
          {activity.players.length} covered
          <span style={{ color: 'var(--zinc-300)' }}>·</span>
          {totalReports} reports
        </span>
        <span style={t2Mono(10, 'var(--zinc-400)')}>{activity.lastActivity}</span>
      </header>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {activity.players.map((p, i) => (
          <li key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderTop: i > 0 ? '1px solid var(--zinc-100)' : 'none' }}>
            <span className="snt-avatar" style={{ width: 28, height: 28, fontSize: 9, background: '#d1fae5', color: '#047857' }}>{p.initials}</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, fontWeight: 500, color: 'var(--zinc-900)' }}>{p.name}</div>
              <div style={t2Mono(9, 'var(--zinc-500)', { fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' })}>{p.pos}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {p.reports > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, borderRadius: 6, background: '#d1fae5', padding: '2px 6px', ...t2Mono(10, '#065f46', { fontWeight: 600 }) }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10 }} aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path></svg>
                  {p.reports}
                </span>
              )}
              {p.shortlisted && (
                <svg viewBox="0 0 24 24" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12 }} aria-label="Shortlisted"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg>
              )}
            </div>
            <span style={{ width: 28, flexShrink: 0, textAlign: 'right', ...t2Mono(10, 'var(--zinc-500)', { fontWeight: 500 }) }}>{p.last}</span>
          </li>
        ))}
      </ul>
    </Tov2StatCard>
  )
}

Object.assign(window, { LastMatchFormation, TacticalIdentityCard, UpcomingFixturesCard, SentrumPanel })
