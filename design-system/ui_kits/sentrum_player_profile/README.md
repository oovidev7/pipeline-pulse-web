# Sentrum player profile UI kit

Interactive recreation of the **v2 player profile** — the current production
profile surface (`components/profiles/player-v2/` in Ginger-Samba-Sports/sentrum).

What's recreated, from the real source:

- **Hero** (`Hero.tsx`): 76px rounded-square avatar with club badge, uppercase
  club label, 42px Outfit name, meta line, stats strip (Positions pitch ·
  Market value · Contract separated by hairlines), Shortlist/Write report
  action stack.
- **Tab nav** (`TabNav.tsx`): zinc pill list, active tab inverts to zinc-950.
- **Overview tab** (`tabs/OverviewTab.tsx` + `overview/*`), in spec order:
  scouting verdict card (with grade triptych), season quick stats (4 cards),
  performance snapshot (Technical · Impect / Physical · SkillCorner with
  tier-colored percentile bars), squad context mini-leaderboards (profile
  player in emerald), position pitch + market value chart (3/5 + 2/5 grid),
  upcoming fixtures.
- **Performance tab** (`tabs/PerformanceTab.tsx` + `performance/*`): Combined /
  Technical / Physical underline sub-tabs, mono filter selects (season ·
  competition · vs position), two polar "pizza" charts (port of
  `PolarBarChart.tsx` — tier-colored segment bars, dashed reference rings,
  composite percentile), ranked top-metric lists, the match-by-match table
  (mode-aware columns, standout G+A/xG highlighted emerald) and the season
  trend chart with metric picker + peer-median dashed line.
- **Career tab** (`tabs/CareerTab.tsx`): 5-card totals strip, club timeline
  (CURRENT badge, loan/academy types), season-by-season table with season
  filter + totals row, full market value chart, and the injury record
  (availability-by-season split bars + injuries table with RECOVERED/ACTIVE
  badges).
- **"Ask about" FAB** bottom-right, and the repo's literal `TabPlaceholder`
  ("Content pending") for the Scouting and Compare tabs.

The v2 surface has its own design language vs. the chat app: zinc neutrals,
Geist Mono eyebrows with an emerald dot, Outfit tabular numerals, flat
borders (no shadows on cards). Its primitives are DS components:
`Eyebrow`, `StatCard`, `PercentileBar`, `Pitch` (in `components/profile/`).

Omitted on purpose: sticky compressed header bar, report viewer dialog, note
composer, ask drawer, Scouting/Compare tab content, live filter refetching
(filters render but data is static), pizza hover tooltips.
Original sources kept in `reference/player-v2-src/`. Sample player is fictional.
