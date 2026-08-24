// Team profile app root — sample data + tab switching + shell
const TEAM = {
  name: 'Feyenoord',
  tla: 'FEY',
  competition: 'Eredivisie',
  venue: 'De Kuip',
  venueCapacity: '47,500',
  city: 'Rotterdam',
  founded: 1908,
  colors: 'Red / White / Black',
  coach: 'R. van Persie',
  standings: { position: 2, positionDelta: 1, points: 71, played: 32, gd: 38, gf: 74, ga: 36 },
}

const FORM = {
  matches: [
    { result: 'W', opponent: 'Ajax', opponentCode: 'AJA', score: '3-1', home: true },
    { result: 'W', opponent: 'FC Utrecht', opponentCode: 'UTR', score: '2-0', home: true },
    { result: 'D', opponent: 'NEC Nijmegen', opponentCode: 'NEC', score: '1-1', home: false },
    { result: 'L', opponent: 'PSV', opponentCode: 'PSV', score: '0-2', home: false },
    { result: 'W', opponent: 'Sparta Rotterdam', opponentCode: 'SPA', score: '4-1', home: true },
  ],
  pts: '10/15',
  goals: '10-5',
  diff: 5,
  home: { w: 11, d: 3, l: 2 },
  away: { w: 9, d: 4, l: 3 },
}

const AGE = {
  average: 24.3,
  brackets: [
    { bracket: 'U21', count: 6, pct: 33 },
    { bracket: '21-24', count: 5, pct: 28 },
    { bracket: '25-28', count: 4, pct: 22 },
    { bracket: '29-32', count: 2, pct: 11 },
    { bracket: '33+', count: 1, pct: 6 },
  ],
}

const PERFORMERS = {
  goals: [
    { name: 'J. van den Berg', initials: 'JV', values: { goals: 16, assists: 6, minutes: 2122 }, sub: { goals: '6a · 27 apps', assists: '16g · 27 apps', minutes: '16g · 6a' } },
    { name: 'S. Ueda', initials: 'SU', values: { goals: 12, assists: 3, minutes: 1980 }, sub: { goals: '3a · 26 apps', assists: '12g · 26 apps', minutes: '12g · 3a' } },
    { name: 'I. Paixão', initials: 'IP', values: { goals: 9, assists: 11, minutes: 2540 }, sub: { goals: '11a · 30 apps', assists: '9g · 30 apps', minutes: '9g · 11a' } },
  ],
  assists: [
    { name: 'I. Paixão', initials: 'IP', values: { goals: 9, assists: 11, minutes: 2540 }, sub: { goals: '11a · 30 apps', assists: '9g · 30 apps', minutes: '9g · 11a' } },
    { name: 'C. Stengs', initials: 'CS', values: { goals: 5, assists: 9, minutes: 2310 }, sub: { goals: '9a · 29 apps', assists: '5g · 29 apps', minutes: '5g · 9a' } },
    { name: 'J. van den Berg', initials: 'JV', values: { goals: 16, assists: 6, minutes: 2122 }, sub: { goals: '6a · 27 apps', assists: '16g · 27 apps', minutes: '16g · 6a' } },
  ],
  minutes: [
    { name: 'T. Wellenreuther', initials: 'TW', values: { goals: 0, assists: 0, minutes: 2880 }, sub: { goals: '0a · 32 apps', assists: '0g · 32 apps', minutes: '0g · 0a' } },
    { name: 'D. Hancko', initials: 'DH', values: { goals: 3, assists: 2, minutes: 2790 }, sub: { goals: '2a · 31 apps', assists: '3g · 31 apps', minutes: '3g · 2a' } },
    { name: 'I. Paixão', initials: 'IP', values: { goals: 9, assists: 11, minutes: 2540 }, sub: { goals: '11a · 30 apps', assists: '9g · 30 apps', minutes: '9g · 11a' } },
  ],
}

const INJURIES = [
  { name: 'Q. Timber', initials: 'QT', type: 'Hamstring strain', daysOut: 6 },
  { name: 'B. Read', initials: 'BR', type: 'Ankle sprain', daysOut: 19 },
  { name: 'G. Trauner', initials: 'GT', type: 'ACL rehabilitation', daysOut: 74 },
]

const LAST_MATCH = {
  competition: 'Eredivisie',
  date: '18 May 2026',
  homeTeam: 'Feyenoord',
  awayTeam: 'Ajax',
  homeIsUs: true,
  scoreHome: 3,
  scoreAway: 1,
  result: 'W',
  formation: '4-3-3',
  starters: [
    { short: 'Wellenreuther', initials: 'TW', num: 1 },
    { short: 'Read', initials: 'BR', num: 2 },
    { short: 'Beelen', initials: 'TB', num: 4 },
    { short: 'Hancko', initials: 'DH', num: 6 },
    { short: 'Smal', initials: 'GS', num: 5 },
    { short: 'Stengs', initials: 'CS', num: 10 },
    { short: 'Zerrouki', initials: 'RZ', num: 8 },
    { short: 'Milambo', initials: 'AM', num: 18 },
    { short: 'Hadj Moussa', initials: 'AH', num: 11 },
    { short: 'Van den Berg', initials: 'JV', num: 9 },
    { short: 'Paixão', initials: 'IP', num: 14 },
  ],
  subs: [
    { minute: 63, off: 'A. Milambo', on: 'I. Hwang', num: 26 },
    { minute: 74, off: 'A. Hadj Moussa', on: 'L. Sauer', num: 7 },
    { minute: 88, off: 'J. van den Berg', on: 'S. Ueda', num: 19 },
  ],
  bench: [
    { name: 'J. Bijlow', num: 22 },
    { name: 'J. Mitchell', num: 3 },
    { name: 'T. Nieuwkoop', num: 15 },
  ],
  events: [
    { minute: 12, kind: 'goal', player: 'J. van den Berg', detail: '(pen)', teamCode: 'FEY', us: true },
    { minute: 34, kind: 'yellow', player: 'R. Zerrouki', teamCode: 'FEY', us: true },
    { minute: 41, kind: 'goal', player: 'K. Taylor', teamCode: 'AJA' },
    { minute: 58, kind: 'goal', player: 'I. Paixão', teamCode: 'FEY', us: true },
    { minute: 71, kind: 'yellow', player: 'J. Šutalo', teamCode: 'AJA' },
    { minute: 84, kind: 'goal', player: 'J. van den Berg', teamCode: 'FEY', us: true },
  ],
}

const TACTICAL = {
  competitions: [
    { id: 'ere', name: 'Eredivisie' },
    { id: 'knvb', name: 'KNVB Beker' },
  ],
  matches: [
    { formation: '4-3-3', compId: 'ere', date: '18 May', opponent: 'Ajax', home: true, result: 'W', score: '3-1' },
    { formation: '4-3-3', compId: 'ere', date: '11 May', opponent: 'FC Utrecht', home: true, result: 'W', score: '2-0' },
    { formation: '4-3-3', compId: 'ere', date: '3 May', opponent: 'NEC Nijmegen', home: false, result: 'D', score: '1-1' },
    { formation: '4-2-3-1', compId: 'ere', date: '27 Apr', opponent: 'PSV', home: false, result: 'L', score: '0-2' },
    { formation: '4-3-3', compId: 'ere', date: '19 Apr', opponent: 'Sparta Rotterdam', home: true, result: 'W', score: '4-1' },
    { formation: '4-3-3', compId: 'ere', date: '12 Apr', opponent: 'Go Ahead Eagles', home: false, result: 'W', score: '2-1' },
    { formation: '4-2-3-1', compId: 'knvb', date: '5 Apr', opponent: 'AZ Alkmaar', home: true, result: 'W', score: '2-1 aet' },
    { formation: '4-3-3', compId: 'ere', date: '29 Mar', opponent: 'FC Twente', home: false, result: 'D', score: '0-0' },
    { formation: '3-5-2', compId: 'ere', date: '15 Mar', opponent: 'Heracles', home: true, result: 'W', score: '3-0' },
  ],
}

const FIXTURES = [
  { weekday: 'Sat', day: '14', month: 'Jun', competition: 'Eredivisie', opponent: 'PSV', home: true, badge: 'in 4d', badgeTone: 'soon' },
  { weekday: 'Sun', day: '22', month: 'Jun', competition: 'Eredivisie', opponent: 'AZ Alkmaar', home: false, badge: 'in 2w', badgeTone: 'far' },
  { weekday: 'Wed', day: '25', month: 'Jun', competition: 'KNVB Beker', opponent: 'FC Twente', home: true, badge: 'in 2w', badgeTone: 'far' },
  { weekday: 'Sun', day: '29', month: 'Jun', competition: 'Eredivisie', opponent: 'FC Groningen', home: false, badge: 'in 3w', badgeTone: 'far' },
  { weekday: 'Sat', day: '05', month: 'Jul', competition: 'Eredivisie', opponent: 'Heerenveen', home: true, badge: null },
]

const SENTRUM_ACTIVITY = {
  lastActivity: '2d ago',
  players: [
    { name: 'J. van den Berg', initials: 'JV', pos: 'ST', reports: 6, shortlisted: true, last: '2d' },
    { name: 'A. Milambo', initials: 'AM', pos: 'CM', reports: 3, shortlisted: true, last: '1w' },
    { name: 'I. Paixão', initials: 'IP', pos: 'LW', reports: 2, shortlisted: false, last: '3w' },
    { name: 'T. Beelen', initials: 'TB', pos: 'CB', reports: 1, shortlisted: false, last: '1mo' },
  ],
}

const SQUAD = [
  { num: 1, name: 'T. Wellenreuther', initials: 'TW', nationality: 'Germany', pos: 'GK', age: 30, minLeague: 2880, minAll: 3240, value: '€8M', valueNum: 8, contract: 2028 },
  { num: 22, name: 'J. Bijlow', initials: 'JB', nationality: 'Netherlands', pos: 'GK', age: 28, minLeague: 0, minAll: 240, value: '€5M', valueNum: 5, contract: 2026 },
  { num: 2, name: 'B. Read', initials: 'BR', nationality: 'England', pos: 'DEF', age: 21, minLeague: 2210, minAll: 2530, value: '€12M', valueNum: 12, contract: 2029 },
  { num: 4, name: 'T. Beelen', initials: 'TB', nationality: 'Netherlands', pos: 'DEF', age: 21, minLeague: 2470, minAll: 2790, value: '€10M', valueNum: 10, contract: 2028 },
  { num: 6, name: 'D. Hancko', initials: 'DH', nationality: 'Slovakia', pos: 'DEF', age: 28, minLeague: 2790, minAll: 3110, value: '€32M', valueNum: 32, contract: 2027 },
  { num: 5, name: 'G. Smal', initials: 'GS', nationality: 'Netherlands', pos: 'DEF', age: 26, minLeague: 2380, minAll: 2660, value: '€9M', valueNum: 9, contract: 2027 },
  { num: 8, name: 'R. Zerrouki', initials: 'RZ', nationality: 'Algeria', pos: 'MID', age: 28, minLeague: 2190, minAll: 2490, value: '€14M', valueNum: 14, contract: 2027 },
  { num: 10, name: 'C. Stengs', initials: 'CS', nationality: 'Netherlands', pos: 'MID', age: 27, minLeague: 2310, minAll: 2620, value: '€18M', valueNum: 18, contract: 2028 },
  { num: 18, name: 'A. Milambo', initials: 'AM', nationality: 'Netherlands', pos: 'MID', age: 21, minLeague: 2050, minAll: 2370, value: '€22M', valueNum: 22, contract: 2027 },
  { num: 26, name: 'I. Hwang', initials: 'IH', nationality: 'South Korea', pos: 'MID', age: 24, minLeague: 1240, minAll: 1480, value: '€11M', valueNum: 11, contract: 2028 },
  { num: 33, name: 'Q. Timber', initials: 'QT', nationality: 'Netherlands', pos: 'MID', age: 25, minLeague: 1680, minAll: 1890, value: '€16M', valueNum: 16, contract: 2026 },
  { num: 9, name: 'J. van den Berg', initials: 'JV', nationality: 'Netherlands', pos: 'FWD', age: 19, minLeague: 1840, minAll: 2122, value: '€18M', valueNum: 18, contract: 2027 },
  { num: 19, name: 'S. Ueda', initials: 'SU', nationality: 'Japan', pos: 'FWD', age: 27, minLeague: 1980, minAll: 2230, value: '€15M', valueNum: 15, contract: 2027 },
  { num: 14, name: 'I. Paixão', initials: 'IP', nationality: 'Brazil', pos: 'FWD', age: 22, minLeague: 2540, minAll: 2870, value: '€28M', valueNum: 28, contract: 2029 },
  { num: 11, name: 'A. Hadj Moussa', initials: 'AH', nationality: 'Algeria', pos: 'FWD', age: 23, minLeague: 1760, minAll: 2010, value: '€13M', valueNum: 13, contract: 2028 },
  { num: 7, name: 'L. Sauer', initials: 'LS', nationality: 'Netherlands', pos: 'FWD', age: 20, minLeague: 980, minAll: 1190, value: '€7M', valueNum: 7, contract: 2029 },
]

const STANDINGS = [
  { position: 1, name: 'PSV', tla: 'PSV', p: 32, w: 24, d: 5, l: 3, gf: 82, ga: 30, gd: 52, pts: 77 },
  { position: 2, name: 'Feyenoord', tla: 'FEY', p: 32, w: 22, d: 5, l: 5, gf: 74, ga: 36, gd: 38, pts: 71 },
  { position: 3, name: 'Ajax', tla: 'AJA', p: 32, w: 20, d: 6, l: 6, gf: 68, ga: 38, gd: 30, pts: 66 },
  { position: 4, name: 'AZ Alkmaar', tla: 'AZ', p: 32, w: 18, d: 7, l: 7, gf: 61, ga: 40, gd: 21, pts: 61 },
  { position: 5, name: 'FC Twente', tla: 'TWE', p: 32, w: 16, d: 8, l: 8, gf: 55, ga: 42, gd: 13, pts: 56 },
  { position: 6, name: 'FC Utrecht', tla: 'UTR', p: 32, w: 14, d: 9, l: 9, gf: 48, ga: 44, gd: 4, pts: 51 },
  { position: 7, name: 'Go Ahead Eagles', tla: 'GAE', p: 32, w: 12, d: 8, l: 12, gf: 44, ga: 46, gd: -2, pts: 44 },
  { position: 8, name: 'NEC Nijmegen', tla: 'NEC', p: 32, w: 11, d: 9, l: 12, gf: 46, ga: 50, gd: -4, pts: 42 },
  { position: 9, name: 'Sparta Rotterdam', tla: 'SPA', p: 32, w: 10, d: 9, l: 13, gf: 38, ga: 46, gd: -8, pts: 39 },
  { position: 10, name: 'Heerenveen', tla: 'HEE', p: 32, w: 9, d: 9, l: 14, gf: 36, ga: 48, gd: -12, pts: 36 },
  { position: 11, name: 'Heracles Almelo', tla: 'HER', p: 32, w: 9, d: 7, l: 16, gf: 38, ga: 56, gd: -18, pts: 34 },
  { position: 12, name: 'FC Groningen', tla: 'GRO', p: 32, w: 8, d: 9, l: 15, gf: 32, ga: 48, gd: -16, pts: 33 },
  { position: 13, name: 'Fortuna Sittard', tla: 'FOR', p: 32, w: 8, d: 8, l: 16, gf: 34, ga: 52, gd: -18, pts: 32 },
  { position: 14, name: 'PEC Zwolle', tla: 'PEC', p: 32, w: 8, d: 7, l: 17, gf: 35, ga: 56, gd: -21, pts: 31 },
  { position: 15, name: 'Willem II', tla: 'WIL', p: 32, w: 7, d: 9, l: 16, gf: 30, ga: 50, gd: -20, pts: 30 },
  { position: 16, name: 'NAC Breda', tla: 'NAC', p: 32, w: 7, d: 8, l: 17, gf: 31, ga: 54, gd: -23, pts: 29 },
  { position: 17, name: 'RKC Waalwijk', tla: 'RKC', p: 32, w: 6, d: 8, l: 18, gf: 28, ga: 56, gd: -28, pts: 26 },
  { position: 18, name: 'Almere City', tla: 'ALM', p: 32, w: 5, d: 7, l: 20, gf: 24, ga: 62, gd: -38, pts: 22 },
]

function PlaceholderCard({ label, note }) {
  const { Eyebrow } = window.SentrumDesignSystem_fd9502
  return (
    <div style={{ borderRadius: 6, border: '1px dashed var(--zinc-300)', background: 'rgba(250,250,250,0.3)', padding: 48, textAlign: 'center' }}>
      <Eyebrow dot={false} style={{ justifyContent: 'center' }}>{label}</Eyebrow>
      <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--zinc-500)' }}>{note}</p>
    </div>
  )
}

function OverviewTabContent() {
  const { Eyebrow } = window.SentrumDesignSystem_fd9502
  return (
    <React.Fragment>
      <section className="mission-row" style={{ marginBottom: 24, alignItems: 'stretch' }}>
        <window.FormCard form={FORM} />
        <window.AgeProfileCard age={AGE} />
        <window.TopPerformerCard performers={PERFORMERS} />
        <window.AvailabilityCard injuries={INJURIES} />
      </section>
      <section style={{ marginBottom: 32 }}>
        <Eyebrow style={{ marginBottom: 16 }}>Last Match</Eyebrow>
        <window.LastMatchFormation match={LAST_MATCH} />
      </section>
      <div className="triple-row" style={{ marginBottom: 32, alignItems: 'start' }}>
        <section style={{ minWidth: 0 }}>
          <Eyebrow style={{ marginBottom: 16 }}>Tactical Identity</Eyebrow>
          <window.TacticalIdentityCard data={TACTICAL} />
        </section>
        <section style={{ minWidth: 0 }}>
          <Eyebrow style={{ marginBottom: 16 }}>Next 5 fixtures</Eyebrow>
          <window.UpcomingFixturesCard fixtures={FIXTURES} />
        </section>
        <section style={{ minWidth: 0 }}>
          <Eyebrow style={{ marginBottom: 16 }}>What we know</Eyebrow>
          <window.SentrumPanel activity={SENTRUM_ACTIVITY} />
        </section>
      </div>
    </React.Fragment>
  )
}

function SquadTabContent() {
  const { Eyebrow } = window.SentrumDesignSystem_fd9502
  const [view, setView] = React.useState('list')
  return (
    <section style={{ marginBottom: 32 }}>
      <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <Eyebrow>Squad · {SQUAD.length} players</Eyebrow>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button type="button" className="snt-btn snt-btn--outline snt-btn--sm">Compare</button>
          <div className="snt-tabs__list" style={{ padding: 2 }}>
            {[['list', 'List'], ['overview', 'Overview']].map(([v, label]) => (
              <button key={v} type="button" className="snt-tabs__trigger" data-active={view === v ? 'true' : 'false'} style={{ height: 26, fontSize: 12, padding: '2px 12px' }} onClick={() => setView(v)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {view === 'list' ? (
        <window.SquadTable players={SQUAD} />
      ) : (
        <PlaceholderCard label="Squad overview" note="Squad analysis charts not recreated in this kit — see SquadAnalysis.tsx in the repo." />
      )}
    </section>
  )
}

function TeamProfileApp() {
  const { Eyebrow } = window.SentrumDesignSystem_fd9502
  const [collapsed, setCollapsed] = React.useState(true)
  const [tab, setTab] = React.useState('overview')

  return (
    <div className="app-shell">
      <window.AppSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        onNewChat={() => {}}
        conversations={[]}
        activeId={null}
        onSelect={() => {}}
      />
      <main className="app-main">
        <div className="profile-scroll">
          <window.TeamHeader team={TEAM} />
          <window.TeamTabNav active={tab} onChange={setTab} />
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px 96px' }}>
            {tab === 'overview' && <OverviewTabContent />}
            {tab === 'squad' && <SquadTabContent />}
            {tab === 'table' && (
              <section style={{ marginBottom: 32 }}>
                <Eyebrow style={{ marginBottom: 16 }}>League Standings</Eyebrow>
                <window.LeagueStandings standings={STANDINGS} highlightTeam="Feyenoord" />
              </section>
            )}
            {tab === 'fixtures' && (
              <PlaceholderCard label="Fixtures & Results" note="Full fixtures list not recreated in this kit — see FixturesResultsTab.tsx in the repo." />
            )}
          </div>
        </div>
        <button type="button" className="ask-fab">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }} aria-hidden="true">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
          </svg>
          Ask about Feyenoord
        </button>
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<TeamProfileApp />)
