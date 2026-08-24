// Player profile hero + tab nav — recreation of player-v2/Hero.tsx + TabNav.tsx
const { Eyebrow, Pitch } = window.SentrumDesignSystem_fd9502

const PlusIcon = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size }} aria-hidden="true">
    <path d="M5 12h14"></path><path d="M12 5v14"></path>
  </svg>
)

function HeroActionButton({ label, variant, onClick }) {
  const [hover, setHover] = React.useState(false)
  const primary = variant === 'primary'
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        height: 32,
        borderRadius: 6,
        padding: '0 12px',
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        border: primary ? '1px solid transparent' : '1px solid var(--zinc-200)',
        background: primary ? (hover ? 'var(--zinc-800)' : 'var(--zinc-950)') : hover ? 'var(--zinc-50)' : '#fff',
        color: primary ? '#fff' : 'var(--zinc-900)',
        whiteSpace: 'nowrap',
      }}
    >
      <PlusIcon />
      {label}
    </button>
  )
}

function PlayerHero({ player }) {
  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--zinc-500)',
    lineHeight: 1,
    fontFamily: 'var(--font-sans)',
  }
  return (
    <section style={{ borderBottom: '1px solid var(--zinc-200)', paddingBottom: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 28 }}>
        {/* Avatar with crest badge */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div
            style={{
              position: 'relative',
              height: 76,
              width: 76,
              overflow: 'hidden',
              borderRadius: 12,
              background: 'linear-gradient(135deg, var(--stone-300, #d6d3d1), var(--stone-400, #a8a29e))',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
              {player.initials}
            </span>
          </div>
          <div
            style={{
              position: 'absolute',
              right: -6,
              bottom: -6,
              height: 28,
              width: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              border: '2px solid #fff',
              background: 'var(--zinc-100)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              fontSize: 8,
              fontWeight: 700,
              color: 'var(--zinc-600)',
              letterSpacing: '0.02em',
            }}
            title={player.club}
          >
            {player.clubCode}
          </div>
        </div>

        {/* Name block */}
        <div style={{ minWidth: 0, flexShrink: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--zinc-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {player.club}
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', margin: '4px 0 0', fontSize: 42, lineHeight: 1.08, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--zinc-950)' }}>
            {player.name}
          </h1>
          <div style={{ marginTop: 6, fontSize: 15, color: 'var(--zinc-500)' }}>{player.metaLine}</div>
        </div>

        <div style={{ flex: 1 }}></div>

        {/* Stats strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <span style={labelStyle}>Positions</span>
            <Pitch width={160} primary={player.primaryPosition} dots={player.positionDots} ariaLabel={player.positionsLabel} />
          </div>
          <div style={{ height: 64, width: 1, background: 'var(--zinc-200)' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <span style={labelStyle}>Market value</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--zinc-950)', fontVariantNumeric: 'tabular-nums' }}>
              {player.marketValue}
            </div>
            {player.marketValueDelta && (
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--emerald-600)' }}>{player.marketValueDelta}</div>
            )}
          </div>
          <div style={{ height: 64, width: 1, background: 'var(--zinc-200)' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <span style={labelStyle}>Contract</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--zinc-950)', fontVariantNumeric: 'tabular-nums' }}>
              {player.contractYear}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ marginLeft: 6, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <HeroActionButton label="Shortlist" variant="secondary" />
          <HeroActionButton label="Write report" variant="primary" />
        </div>
      </div>
    </section>
  )
}

const PROFILE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'performance', label: 'Performance' },
  { id: 'career', label: 'Career' },
  { id: 'scouting', label: 'Scouting' },
  { id: 'compare', label: 'Compare' },
]

function ProfileTabNav({ active, onChange }) {
  return (
    <div
      role="tablist"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, borderRadius: 12, background: 'var(--zinc-100)', padding: 6 }}
    >
      {PROFILE_TABS.map(tab => {
        const isActive = tab.id === active
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(tab.id)}
            className={isActive ? '' : 'profile-tab-idle'}
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
              background: isActive ? 'var(--zinc-950)' : 'transparent',
              color: isActive ? '#fff' : 'var(--zinc-700)',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

Object.assign(window, { PlayerHero, ProfileTabNav, PROFILE_TABS })
