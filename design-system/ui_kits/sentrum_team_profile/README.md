# Sentrum team profile UI kit

Interactive recreation of the **team/club page** (`/[slug]/team/[id]` —
`club-profile-content.tsx` + `ClubHeader.tsx` + `components/profiles/club/*`
in Ginger-Samba-Sports/sentrum).

Recreated from source:

- **Header** (`ClubHeader.tsx`): 80px crest tile, uppercase league label, 36px
  Outfit club name, metadata row (stadium · city · founded · colors · manager),
  and the KPI strip (Position with vs-last-season delta · Points · Goal diff)
  with hairline dividers.
- **Sticky pill tab nav** (Overview / Squad / Table / Fixtures & Results) with
  backdrop blur, from `club-profile-content.tsx`.
- **Overview tab**: mission-control row of four cards — `FormCard` (W/D/L
  chips with latest-match ring, form points/goals/diff, home-away split bars),
  `AgeProfileCard` (big average + bracket bars, modal bracket emerald),
  `TopPerformerCard` (Goals/Assists/Minutes sub-tabs, leader ringed),
  `AvailabilityCard` (injured list with back-in-Xd tones) — then
  `LastMatchFormation` (score header, landscape green pitch with 4-3-3 chips,
  subs used + bench, match events) and the three-column row of
  `TacticalIdentityCard` (competition filter chips, expandable formation bars),
  `UpcomingFixturesCard` (tear-off date blocks, relative badges) and
  `SentrumPanel` ("What we know" scouting coverage).
- **Squad tab** (`ClubSquad.tsx`): sortable table with League Only / All
  Competitions minutes toggle, position category badges (GK amber / DEF sky /
  MID emerald / FWD red), minutes share %, emerald market values, contract
  year urgency colors. List/Overview toggle + Compare button render; the
  Overview analysis charts are intentionally not recreated.
- **Table tab** (`LeagueStandings.tsx`): full 18-team table with UCL/UEL/UECL/
  relegation position accents and the club row highlighted emerald.

Omitted on purpose (placeholder with disclaimer, no invention): Fixtures &
Results tab (`FixturesResultsTab.tsx`), squad analysis charts
(`SquadAnalysis.tsx`), squad compare dialog. Crests are TLA tiles — the repo
ships no club imagery. Original sources in `reference/club-src/`. All data
is fictional/sample.
