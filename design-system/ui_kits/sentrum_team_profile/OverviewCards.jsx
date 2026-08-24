// Team profile Overview tab — FormCard, AgeProfileCard, TopPerformerCard,
// AvailabilityCard, LastMatchFormation, TacticalIdentityCard,
// UpcomingFixturesCard, SentrumPanel. Ports of components/profiles/club/*.
const { Eyebrow: TovEyebrow, StatCard: TovStatCard } = window.SentrumDesignSystem_fd9502

const tovMono = (size, color = 'var(--zinc-500)', extra = {}) => ({
  fontFamily: 'var(--font-mono)',
  fontSize: size,
  color,
  fontVariantNumeric: 'tabular-nums',
  ...extra,
})
const tovMicro = { ...tovMono(9, 'var(--zinc-400)', { fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase' }) }
const tovOutfit = (size, extra = {}) => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontVariantNumeric: 'tabular-nums',
  fontSize: size,
  lineHeight: 1,
  color: 'var(--zinc-950)',
  ...extra,
})

/* ---- Form card ---- */
function chipColor(r) {
  if (r === 'W') return 'var(--emerald-500)'
  if (r === 'D') return 'var(--zinc-400)'
  return '#ef4444'
}

function VenueSplit({ label, split }) {
  const total = split.w + split.d + split.l
  const pct = n => (total > 0 ? (n / total) * 100 : 0)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', alignItems: 'center', gap: 8, fontSize: 12 }}>
      <span style={tovMicro}>{label}</span>
      <span style={{ display: 'flex', height: 6, overflow: 'hidden', borderRadius: 9999, background: 'var(--zinc-100)' }}>
        <span style={{ background: 'var(--emerald-500)', width: pct(split.w) + '%' }}></span>
        <span style={{ background: 'var(--zinc-400)', width: pct(split.d) + '%' }}></span>
        <span style={{ background: '#ef4444', width: pct(split.l) + '%' }}></span>
      </span>
      <span style={tovMono(12, 'var(--zinc-900)', { fontWeight: 500 })}>{split.w}-{split.d}-{split.l}</span>
    </div>
  )
}

function MidStat({ label, value, tone }) {
  const color = tone === 'up' ? 'var(--emerald-600)' : tone === 'down' ? '#dc2626' : 'var(--zinc-950)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={{ ...tovMono(9, 'var(--zinc-500)', { fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }) }}>{label}</span>
      <span style={{ ...tovOutfit(16), color }}>{value}</span>
    </div>
  )
}

function FormCard({ form }) {
  return (
    <TovStatCard style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 16 }}>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <TovEyebrow>Form</TovEyebrow>
        <span style={tovMicro}>Last {form.matches.length}</span>
      </div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center', gap: 12 }}>
        {form.matches.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }} title={`${m.home ? 'vs' : '@'} ${m.opponent} (${m.score})`}>
            <span style={{ display: 'flex', height: 32, width: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 4, fontSize: 12, fontWeight: 600, color: '#fff', background: chipColor(m.result), boxShadow: i === 0 ? '0 0 0 2px rgba(16,185,129,0.7), 0 0 0 3px #fff' : 'none' }}>
              {m.result}
            </span>
            <span style={tovMono(9, 'var(--zinc-400)', { fontWeight: 500 })}>{m.opponentCode}</span>
            <span style={tovMono(9, 'var(--zinc-400)')}>{m.home ? 'H' : 'A'}</span>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, borderTop: '1px solid var(--zinc-100)', borderBottom: '1px solid var(--zinc-100)', padding: '12px 0' }}>
        <MidStat label="Form Pts" value={form.pts} />
        <MidStat label="Goals" value={form.goals} />
        <MidStat label="Diff" value={form.diff > 0 ? `+${form.diff}` : form.diff} tone={form.diff > 0 ? 'up' : form.diff < 0 ? 'down' : undefined} />
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <VenueSplit label="Home" split={form.home} />
        <VenueSplit label="Away" split={form.away} />
      </div>
    </TovStatCard>
  )
}

/* ---- Age profile card ---- */
function AgeProfileCard({ age }) {
  const total = age.brackets.reduce((s, b) => s + b.count, 0)
  const modal = Math.max(...age.brackets.map(b => b.count))
  const [intPart, decPart] = age.average.toFixed(1).split('.')
  return (
    <TovStatCard style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 16 }}>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <TovEyebrow>Age Profile</TovEyebrow>
        <span style={tovMicro}>{total} players</span>
      </div>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={tovOutfit(36, { letterSpacing: '-0.02em' })}>{intPart}</span>
        <span style={tovOutfit(24, { letterSpacing: '-0.01em', color: 'var(--zinc-400)' })}>.{decPart}</span>
        <span style={{ marginLeft: 4, paddingBottom: 4, fontSize: 11, fontWeight: 500, letterSpacing: '0.02em', color: 'var(--zinc-500)' }}>avg age</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {age.brackets.map(b => {
          const isModal = b.count === modal && modal > 0
          return (
            <div key={b.bracket} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
              <span style={{ width: 48, ...tovMono(10, isModal ? 'var(--zinc-900)' : 'var(--zinc-500)', { fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }) }}>{b.bracket}</span>
              <div style={{ position: 'relative', height: 6, flex: 1, overflow: 'hidden', borderRadius: 9999, background: 'var(--zinc-100)' }}>
                <div style={{ height: '100%', borderRadius: 9999, background: isModal ? 'var(--emerald-500)' : 'var(--zinc-300)', width: b.pct + '%' }}></div>
              </div>
              <span style={{ width: 24, textAlign: 'right', ...tovMono(12, isModal ? 'var(--zinc-900)' : 'var(--zinc-600)', { fontWeight: isModal ? 600 : 400 }) }}>{b.count}</span>
            </div>
          )
        })}
      </div>
    </TovStatCard>
  )
}

/* ---- Top performers card ---- */
function TopPerformerCard({ performers }) {
  const [metric, setMetric] = React.useState('goals')
  const list = performers[metric]
  const labels = { goals: 'Goals', assists: 'Assists', minutes: 'Minutes' }
  return (
    <TovStatCard style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 16 }}>
      <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <TovEyebrow>Top Performers</TovEyebrow>
        <div role="tablist" aria-label="Metric" style={{ display: 'inline-flex', alignSelf: 'flex-start', gap: 2, borderRadius: 6, background: 'var(--zinc-100)', padding: 2 }}>
          {Object.keys(labels).map(m => (
            <button
              key={m}
              role="tab"
              aria-selected={metric === m}
              onClick={() => setMetric(m)}
              style={{
                borderRadius: 4,
                padding: '4px 10px',
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                background: metric === m ? '#fff' : 'transparent',
                color: metric === m ? 'var(--zinc-900)' : 'var(--zinc-500)',
                boxShadow: metric === m ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              }}
            >
              {labels[m]}
            </button>
          ))}
        </div>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {list.map((entry, i) => {
          const isLeader = i === 0
          return (
            <li key={entry.name} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 6, padding: '6px', cursor: 'pointer' }}>
              <span style={{ width: 12, textAlign: 'right', ...tovMono(10, isLeader ? 'var(--emerald-600)' : 'var(--zinc-400)', { fontWeight: 500 }) }}>{i + 1}</span>
              <span className="snt-avatar" style={{ width: 36, height: 36, fontSize: 11, boxShadow: isLeader ? '0 0 0 2px rgba(52,211,153,0.6)' : 'none' }}>{entry.initials}</span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, fontWeight: isLeader ? 600 : 500, color: isLeader ? 'var(--zinc-900)' : 'var(--zinc-700)' }}>{entry.name}</div>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...tovMono(11) }}>{entry.sub[metric]}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ ...tovOutfit(18), color: isLeader ? 'var(--zinc-900)' : 'var(--zinc-600)' }}>{entry.values[metric].toLocaleString()}</span>
                <span style={{ ...tovMono(9, 'var(--zinc-400)', { fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' }) }}>{metric === 'minutes' ? 'min' : metric}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </TovStatCard>
  )
}

/* ---- Availability card ---- */
function AvailabilityCard({ injuries }) {
  const count = injuries.length
  const toneFor = days => (days <= 7 ? 'var(--emerald-600)' : days <= 30 ? '#d97706' : '#dc2626')
  return (
    <TovStatCard style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 16 }}>
      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <TovEyebrow>Availability</TovEyebrow>
        <span style={{ ...tovMicro, color: count === 0 ? 'var(--emerald-600)' : count >= 3 ? '#d97706' : 'var(--zinc-500)' }}>
          {count === 0 ? 'All fit' : `${count} out`}
        </span>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {injuries.map(injury => (
          <li key={injury.name} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 6, padding: '6px', cursor: 'pointer' }}>
            <span className="snt-avatar" style={{ width: 36, height: 36, fontSize: 11 }}>{injury.initials}</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 500, color: 'var(--zinc-900)' }}>{injury.name}</div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 11, color: 'var(--zinc-500)' }}>{injury.type}</div>
            </div>
            <span style={{ flexShrink: 0, ...tovMono(11, toneFor(injury.daysOut), { fontWeight: 500 }) }}>back in {injury.daysOut}d</span>
          </li>
        ))}
      </ul>
    </TovStatCard>
  )
}

Object.assign(window, { FormCard, AgeProfileCard, TopPerformerCard, AvailabilityCard })
