// Team profile header + sticky tab nav — recreation of ClubHeader.tsx
// and the pill nav from club-profile-content.tsx.
const { Eyebrow: ThEyebrow } = window.SentrumDesignSystem_fd9502

const thLabel = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--zinc-500)',
  lineHeight: 1,
  fontFamily: 'var(--font-sans)',
}
const thOutfit = (size, extra = {}) => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  fontSize: size,
  lineHeight: 1,
  ...extra,
})

const ThIcon = ({ d, size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size, flexShrink: 0 }} aria-hidden="true">
    {d}
  </svg>
)
const PinIcon = () => <ThIcon d={<React.Fragment><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></React.Fragment>} />
const StadiumIcon = () => <ThIcon d={<React.Fragment><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"></path><path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"></path><path d="M8 14v.5"></path><path d="M16 14v.5"></path><path d="M11.25 16.25h1.5L12 17z"></path><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"></path></React.Fragment>} />
const CalIcon = () => <ThIcon d={<React.Fragment><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></React.Fragment>} />

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function TeamKpi({ label, value, sub, subTone, tone }) {
  const toneColor = tone === 'up' ? 'var(--emerald-600)' : tone === 'down' ? '#dc2626' : 'var(--zinc-950)'
  const subColor = subTone === 'up' ? 'var(--emerald-600)' : subTone === 'down' ? '#dc2626' : 'var(--zinc-500)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 6 }}>
      <span style={thLabel}>{label}</span>
      <span style={thOutfit(30, { letterSpacing: '-0.01em', color: toneColor })}>{value}</span>
      <span style={{ fontSize: 11, fontWeight: 500, fontVariantNumeric: 'tabular-nums', color: subColor, visibility: sub ? 'visible' : 'hidden' }}>{sub || ' '}</span>
    </div>
  )
}

function TeamHeader({ team }) {
  return (
    <div style={{ borderBottom: '1px solid var(--zinc-200)', background: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {/* Crest + identity */}
          <div style={{ display: 'flex', minWidth: 0, flex: 1, alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative', height: 80, width: 80, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 12, background: 'linear-gradient(135deg, #f5f5f4, #e7e5e4)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)' }}>
              <span style={thOutfit(24, { fontWeight: 700, color: 'var(--zinc-400)' })}>{team.tla}</span>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--zinc-500)' }}>
                {team.competition}
              </span>
              <h1 style={{ ...thOutfit(36, { letterSpacing: '-0.02em', lineHeight: 1.08, color: 'var(--zinc-950)' }), margin: '4px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {team.name}
              </h1>
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', columnGap: 16, rowGap: 4, fontSize: 14, color: 'var(--zinc-500)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <StadiumIcon />
                  {team.venue}
                  <span style={{ color: 'var(--zinc-400)' }}>({team.venueCapacity})</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <PinIcon />
                  {team.city}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CalIcon />
                  Est. {team.founded}
                </span>
              </div>
              <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', columnGap: 12, rowGap: 4, fontSize: 12, color: 'var(--zinc-500)' }}>
                <span>{team.colors}</span>
                <span><span style={{ color: 'var(--zinc-400)' }}>Manager · </span>{team.coach}</span>
              </div>
            </div>
          </div>

          {/* KPI strip */}
          <div style={{ display: 'flex', flexShrink: 0, alignItems: 'stretch', gap: 22 }}>
            <TeamKpi
              label="Position"
              value={ordinal(team.standings.position)}
              sub={team.standings.positionDelta ? `↑ ${team.standings.positionDelta} vs last season` : null}
              subTone="up"
            />
            <div style={{ width: 1, background: 'var(--zinc-200)' }}></div>
            <TeamKpi label="Points" value={team.standings.points} sub={`${team.standings.played} played`} />
            <div style={{ width: 1, background: 'var(--zinc-200)' }}></div>
            <TeamKpi
              label="Goal diff"
              value={team.standings.gd > 0 ? `+${team.standings.gd}` : team.standings.gd}
              tone={team.standings.gd > 0 ? 'up' : team.standings.gd < 0 ? 'down' : undefined}
              sub={`${team.standings.gf} for · ${team.standings.ga} ag.`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const TEAM_TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'squad', label: 'Squad' },
  { key: 'table', label: 'Table' },
  { key: 'fixtures', label: 'Fixtures & Results' },
]

function TeamTabNav({ active, onChange }) {
  return (
    <nav aria-label="Club profile sections" style={{ position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid rgba(228,228,231,0.8)', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', padding: '10px 32px' }}>
        <div role="tablist" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: 12, background: 'var(--zinc-100)', padding: 6 }}>
          {TEAM_TABS.map(({ key, label }) => {
            const selected = active === key
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onChange(key)}
                className={selected ? '' : 'profile-tab-idle'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 14,
                  fontWeight: 500,
                  border: 'none',
                  cursor: 'pointer',
                  background: selected ? 'var(--zinc-950)' : 'transparent',
                  color: selected ? '#fff' : 'var(--zinc-700)',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

Object.assign(window, { TeamHeader, TeamTabNav, TEAM_TABS })
