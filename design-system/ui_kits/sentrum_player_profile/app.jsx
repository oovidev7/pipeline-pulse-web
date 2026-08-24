// Player profile app root — shell + tab state + FAB
const PLAYER = {
  name: 'Jonas van den Berg',
  initials: 'JV',
  club: 'Feyenoord',
  clubCode: 'FEY',
  metaLine: 'Age 19 · 187cm · Left foot · Netherlands',
  primaryPosition: 'ST',
  positionDots: [
    { position: 'ST', percentage: 62 },
    { position: 'LW', percentage: 24 },
    { position: 'AM', percentage: 9 },
  ],
  positionsLabel: 'Plays as Striker, Left Winger, Attacking Midfielder',
  positionMinutes: '1,840',
  positionMatches: 24,
  marketValue: '€18M',
  marketValueDelta: '↑ €2.5M (90d)',
  contractYear: '2027',
  verdict: {
    reportCount: 6,
    headline: 'Explosive box presence with elite finishing instincts; needs a stronger left-sided defensive workrate.',
    body: 'All six reports converge on finishing quality and movement in the final third — repeatedly found attacking the front post ahead of his marker. Two scouts independently flag pressing intensity dropping after the 70th minute. Profile fits a high-possession side looking for a penalty-box striker who can also rotate wide left.',
    mostRecent: 'M. de Vries · 18 May 2026 vs Ajax',
    grades: [
      { label: 'Perf', value: '7.8' },
      { label: 'Pot', value: '8.5' },
      { label: 'Char', value: '7.2' },
    ],
  },
  seasonContextLabel: 'Season 2025/26 · Eredivisie',
  quickStats: [
    { label: 'Goals', value: 14, caption: '0.68 per 90', chip: 'TOP 5%' },
    { label: 'Assists', value: 5, caption: '0.24 per 90' },
    { label: 'Minutes', value: '1,840', caption: '24 matches' },
    { label: 'xG', value: '11.2', caption: '+2.8 over xG' },
  ],
  technicalContext: 'vs Eredivisie ST',
  technicalMetrics: [
    { label: 'Shots on target / 90', displayValue: '1.9', percentile: 92 },
    { label: 'Successful dribbles / 90', displayValue: '2.4', percentile: 78 },
    { label: 'Progressive passes / 90', displayValue: '3.1', percentile: 54 },
  ],
  physicalContext: 'vs Eredivisie ST',
  physicalMetrics: [
    { label: 'Top speed', displayValue: '34.6 km/h', percentile: 88 },
    { label: 'Sprints / 90', displayValue: '21.3', percentile: 71 },
    { label: 'Distance / 90', displayValue: '10.4 km', percentile: 46 },
  ],
  squadContextLabel: 'Squad context · Feyenoord',
  leaderboards: [
    {
      metricLabel: 'Goals / 90',
      playerRank: 1,
      totalPlayers: 24,
      entries: [
        { rank: 1, name: 'J. van den Berg', value: '0.68', me: true },
        { rank: 2, name: 'S. Ueda', value: '0.51' },
        { rank: 3, name: 'I. Paixão', value: '0.43' },
        { rank: 4, name: 'C. Stengs', value: '0.31' },
        { rank: 5, name: 'Q. Timber', value: '0.18' },
      ],
    },
    {
      metricLabel: 'xG / 90',
      playerRank: 2,
      totalPlayers: 24,
      entries: [
        { rank: 1, name: 'S. Ueda', value: '0.58' },
        { rank: 2, name: 'J. van den Berg', value: '0.55', me: true },
        { rank: 3, name: 'I. Paixão', value: '0.40' },
        { rank: 4, name: 'C. Stengs', value: '0.27' },
        { rank: 5, name: 'A. Milambo', value: '0.21' },
      ],
    },
    {
      metricLabel: 'Sprints / 90',
      playerRank: 3,
      totalPlayers: 24,
      entries: [
        { rank: 1, name: 'I. Paixão', value: '24.8' },
        { rank: 2, name: 'B. Read', value: '22.6' },
        { rank: 3, name: 'J. van den Berg', value: '21.3', me: true },
        { rank: 4, name: 'C. Stengs', value: '19.7' },
        { rank: 5, name: 'A. Milambo', value: '18.2' },
      ],
    },
  ],
  marketValueHistory: [
    { label: '21/22', value: 1.5 },
    { label: '22/23', value: 3 },
    { label: '23/24', value: 6.5 },
    { label: '24/25', value: 12 },
    { label: '25/26', value: 18 },
  ],
  fixtures: [
    { date: 'Sat 14 Jun', match: 'Feyenoord vs PSV', competition: 'Eredivisie' },
    { date: 'Sun 22 Jun', match: 'AZ Alkmaar vs Feyenoord', competition: 'Eredivisie' },
    { date: 'Wed 25 Jun', match: 'Feyenoord vs FC Twente', competition: 'KNVB Beker' },
  ],
  performance: {
    technicalSubtitle: 'ST template · 8 KPIs · 1,840 mins',
    physicalSubtitle: 'ST cohort · 6 KPIs · 22 tracked matches',
    technicalContextLabel: 'vs Eredivisie ST',
    physicalContextLabel: 'vs Eredivisie ST',
    technicalPizza: [
      { metric: 'Shots', fullName: 'Shots on target / 90', rawValue: '1.9', percentile: 92 },
      { metric: 'xG', fullName: 'Expected goals / 90', rawValue: '0.55', percentile: 89 },
      { metric: 'Box touch', fullName: 'Touches in box / 90', rawValue: '6.8', percentile: 84 },
      { metric: 'Drib', fullName: 'Successful dribbles / 90', rawValue: '2.4', percentile: 78 },
      { metric: 'Aerial', fullName: 'Aerial duels won / 90', rawValue: '2.1', percentile: 62 },
      { metric: 'PXT pass', fullName: 'Pass value added (PXT)', rawValue: '0.18', percentile: 54 },
      { metric: 'Press', fullName: 'Pressing actions / 90', rawValue: '14.2', percentile: 41 },
      { metric: 'Cross', fullName: 'Crosses completed / 90', rawValue: '0.4', percentile: 23 },
    ],
    physicalPizza: [
      { metric: 'Speed', fullName: 'Top speed', rawValue: '34.6', unit: 'km/h', percentile: 88 },
      { metric: 'Accel', fullName: 'High accelerations / 90', rawValue: '11.9', percentile: 76 },
      { metric: 'Sprints', fullName: 'Sprints / 90', rawValue: '21.3', percentile: 71 },
      { metric: 'HSR', fullName: 'High-speed running m / 90', rawValue: '624', unit: 'm', percentile: 64 },
      { metric: 'Intensity', fullName: 'Distance at intensity %', rawValue: '8.4', percentile: 52 },
      { metric: 'Dist', fullName: 'Total distance / 90', rawValue: '10.41', unit: 'km', percentile: 46 },
    ],
    technicalMetrics: [
      { label: 'Shots on target / 90', displayValue: '1.9', percentile: 92 },
      { label: 'Expected goals / 90', displayValue: '0.55', percentile: 89 },
      { label: 'Touches in box / 90', displayValue: '6.8', percentile: 84 },
      { label: 'Successful dribbles / 90', displayValue: '2.4', percentile: 78 },
      { label: 'Pass value added', subLabel: '(PXT Pass)', displayValue: '0.18', percentile: 54 },
    ],
    physicalMetrics: [
      { label: 'Top speed', displayValue: '34.6 km/h', percentile: 88 },
      { label: 'High accelerations / 90', displayValue: '11.9', percentile: 76 },
      { label: 'Sprints / 90', displayValue: '21.3', percentile: 71 },
      { label: 'High-speed running / 90', displayValue: '624 m', percentile: 64 },
      { label: 'Total distance / 90', displayValue: '10.4 km', percentile: 46 },
    ],
    matchHistory: [
      { date: '18 May', opponent: 'Ajax', home: false, pos: 'ST', comp: 'Eredivisie', min: 90, ga: 3, gaDisplay: '2+1', drib: 0.31, xgxa: 1.24, speed: 34.1, sprints: 23, dist: 10.8 },
      { date: '11 May', opponent: 'FC Utrecht', home: true, pos: 'ST', comp: 'Eredivisie', min: 84, ga: 1, gaDisplay: '1+0', drib: 0.18, xgxa: 0.62, speed: 33.4, sprints: 21, dist: 10.2 },
      { date: '3 May', opponent: 'NEC Nijmegen', home: true, pos: 'LW', comp: 'Eredivisie', min: 90, ga: 0, gaDisplay: '0+1', drib: 0.42, xgxa: 0.48, speed: 34.6, sprints: 25, dist: 11.1 },
      { date: '27 Apr', opponent: 'PSV', home: false, pos: 'ST', comp: 'Eredivisie', min: 73, ga: 0, gaDisplay: '0+0', drib: 0.09, xgxa: 0.21, speed: 33.8, sprints: 18, dist: 9.4 },
      { date: '19 Apr', opponent: 'Sparta Rotterdam', home: true, pos: 'ST', comp: 'Eredivisie', min: 90, ga: 2, gaDisplay: '2+0', drib: 0.27, xgxa: 0.93, speed: 34.2, sprints: 22, dist: 10.6 },
      { date: '12 Apr', opponent: 'Go Ahead Eagles', home: false, pos: 'ST', comp: 'Eredivisie', min: 90, ga: 1, gaDisplay: '1+1', drib: 0.22, xgxa: 0.81, speed: 33.9, sprints: 20, dist: 10.3 },
      { date: '5 Apr', opponent: 'AZ Alkmaar', home: true, pos: 'ST', comp: 'KNVB Beker', min: 120, ga: 1, gaDisplay: '1+0', drib: 0.15, xgxa: 0.44, speed: 34.0, sprints: 27, dist: 13.2 },
      { date: '29 Mar', opponent: 'FC Twente', home: false, pos: 'LW', comp: 'Eredivisie', min: 64, ga: 0, gaDisplay: '0+0', drib: 0.36, xgxa: 0.18, speed: 34.4, sprints: 16, dist: 7.9 },
    ],
    trendSeries: [
      {
        id: 'tech_xgxa', label: 'xG+xA / 90', unit: '', peerMedian: 0.42, decimals: 2,
        points: [
          { month: 'SEP', value: 0.31, contextLabel: 'vs Heerenveen' },
          { month: 'OCT', value: 0.48, contextLabel: 'vs Vitesse' },
          { month: 'NOV', value: 0.39, contextLabel: 'vs Ajax' },
          { month: 'DEC', value: 0.57, contextLabel: 'vs NEC' },
          { month: 'JAN', value: 0.52, contextLabel: 'vs Heracles' },
          { month: 'FEB', value: 0.71, contextLabel: 'vs Sparta' },
          { month: 'MAR', value: 0.64, contextLabel: 'vs Twente' },
          { month: 'APR', value: 0.58, contextLabel: 'vs PSV' },
          { month: 'MAY', value: 0.92, contextLabel: 'vs Ajax' },
        ],
      },
      {
        id: 'phys_speed', label: 'Top speed', unit: ' km/h', peerMedian: 33.1, decimals: 1,
        points: [
          { month: 'SEP', value: 33.2, contextLabel: 'vs Heerenveen' },
          { month: 'OCT', value: 33.8, contextLabel: 'vs Vitesse' },
          { month: 'NOV', value: 33.5, contextLabel: 'vs Ajax' },
          { month: 'DEC', value: 34.0, contextLabel: 'vs NEC' },
          { month: 'JAN', value: 33.6, contextLabel: 'vs Heracles' },
          { month: 'FEB', value: 34.2, contextLabel: 'vs Sparta' },
          { month: 'MAR', value: 34.4, contextLabel: 'vs Twente' },
          { month: 'APR', value: 33.8, contextLabel: 'vs PSV' },
          { month: 'MAY', value: 34.6, contextLabel: 'vs Ajax' },
        ],
      },
      {
        id: 'phys_sprints', label: 'Sprints / 90', unit: '', peerMedian: 18.5, decimals: 0,
        points: [
          { month: 'SEP', value: 17 },
          { month: 'OCT', value: 19 },
          { month: 'NOV', value: 18 },
          { month: 'DEC', value: 21 },
          { month: 'JAN', value: 20 },
          { month: 'FEB', value: 22 },
          { month: 'MAR', value: 16 },
          { month: 'APR', value: 20 },
          { month: 'MAY', value: 23 },
        ],
      },
    ],
  },
  career: {
    totals: { apps: 74, minutes: '5,480', minPerApp: 74, goals: 33, goalsPer90: '0.54', assists: 12, assistsPer90: '0.20', clubs: 2, youthClubs: 1 },
    clubs: [
      { range: '2024 → now', name: 'Feyenoord', code: 'FEY', type: 'First team', fee: '—', apps: 45, goals: 22, assists: 8, current: true },
      { range: '2023 → 2024', name: 'Excelsior', code: 'EXC', type: 'Loan', fee: 'Loan', apps: 29, goals: 11, assists: 4 },
      { range: '2016 → 2023', name: 'Feyenoord Academy', code: 'FEY', type: 'Academy', fee: '—', apps: null, goals: null, assists: null },
    ],
    seasonStats: [
      { season: '2025/26', competition: 'Eredivisie', club: 'Feyenoord', apps: 24, minutes: 1840, goals: 14, assists: 5, y: 3, r: 0 },
      { season: '2025/26', competition: 'KNVB Beker', club: 'Feyenoord', apps: 3, minutes: 282, goals: 2, assists: 1, y: 0, r: 0 },
      { season: '2024/25', competition: 'Eredivisie', club: 'Feyenoord', apps: 18, minutes: 1058, goals: 6, assists: 2, y: 2, r: 0 },
      { season: '2023/24', competition: 'Eerste Divisie', club: 'Excelsior', apps: 29, minutes: 2300, goals: 11, assists: 4, y: 4, r: 1 },
    ],
    currentSeason: '2025/26',
    injuries: [
      { dates: '4 Sep → 28 Sep 2025', type: 'Hamstring strain', recovered: true, days: 24, matches: 4 },
      { dates: '11 Feb → 1 Mar 2024', type: 'Ankle sprain', recovered: true, days: 18, matches: 3 },
    ],
    availability: [
      { season: '2025/26', pct: 93.4, days: 24 },
      { season: '2023/24', pct: 95.1, days: 18 },
    ],
  },
}

function AskFab({ playerName }) {
  const [hover, setHover] = React.useState(false)
  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'fixed',
        right: 24,
        bottom: 24,
        zIndex: 40,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 40,
        borderRadius: 9999,
        padding: '0 18px',
        border: 'none',
        cursor: 'pointer',
        background: hover ? 'var(--zinc-800)' : 'var(--zinc-950)',
        color: '#fff',
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        boxShadow: 'var(--shadow-floating)',
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }} aria-hidden="true">
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
      </svg>
      Ask about {playerName}
    </button>
  )
}

function PlayerProfileApp() {
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
          <div className="profile-col">
            <window.PlayerHero player={PLAYER} />
            <div style={{ paddingTop: 16 }}>
              <window.ProfileTabNav active={tab} onChange={setTab} />
            </div>
            <section style={{ marginTop: 24 }}>
              {tab === 'overview' ? (
                <window.OverviewTab
                  player={PLAYER}
                  onFullPerformance={() => setTab('performance')}
                  onFullComparison={() => setTab('compare')}
                />
              ) : tab === 'performance' ? (
                <window.PerformanceTab data={PLAYER.performance} />
              ) : tab === 'career' ? (
                <window.CareerTab data={PLAYER.career} marketValueHistory={PLAYER.marketValueHistory} currentValue={PLAYER.marketValue} />
              ) : (
                <window.TabPlaceholder label={window.PROFILE_TABS.find(t => t.id === tab).label} />
              )}
            </section>
          </div>
        </div>
        <AskFab playerName={PLAYER.name.split(' ')[0] + ' ' + PLAYER.name.split(' ').slice(-1)[0]} />
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<PlayerProfileApp />)
