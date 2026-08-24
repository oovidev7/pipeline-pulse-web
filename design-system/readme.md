# Sentrum Design System

Sentrum is a **football intelligence platform for clubs and federations**. It lets sporting directors, scouts and analysts talk to their football data in natural language — a chat agent translates questions into SQL against the tenant's database and answers with prose, tables and charts. Around that core sit scouting reports, recruitment boards, short lists, shadow teams, contract exploration, squad/club views, data imports and configurable dashboards.

It is **multi-tenant and white-label**: each club tenant can brand the chrome with its own crest and name, while Sentrum recedes to a "powered by sentrum" attribution at the bottom of the sidebar.

## Sources

- **GitHub:** [Ginger-Samba-Sports/sentrum](https://github.com/Ginger-Samba-Sports/sentrum) — Next.js 15 + Tailwind CSS v4 + shadcn/ui (new-york style, stone base color, Lucide icons). Key files: `app/globals.css` (tokens — copied verbatim into `reference/sentrum-globals.css`), `components/ui/*` (shadcn primitives), `components/chat/*` (chat surface), `components/sidebar/*` (navigation), `app/[slug]/dashboard-layout-client.tsx` (app shell).

Explore that repository further to design deeper surfaces (recruitment board, contract explorer, my-clubs pitch view, dashboards) with full fidelity.

## Content fundamentals

- **Sentence case everywhere** — buttons, nav, headings ("New chat", "Save report"). The only uppercase is the 11px micro-label eyebrow style ("FOR YOU, THIS WEEK", "KEEP EXPLORING") and the tiny "POWERED BY" attribution.
- **Second person, first name, warm but spare.** The welcome screen greets "What's new, Anna?" and invites "Ask anything, or pick one of today's starting points." No exclamation marks, no hype.
- **Short verb-phrase CTAs:** "Edit & ask", "Send", "New chat", "Browse prompts".
- **Honest disclaimers, plainly worded:** "Sentrum can make mistakes. Check important info."
- **The wordmark is always lowercase:** "sentrum".
- **No emoji** anywhere in product UI.
- Domain copy is football-operations vocabulary: squads, crests, contracts, scouting reports, shadow teams, short lists, transfer windows, xG.

## Visual foundations

- **Colors.** Near-monochrome. Warm **stone** neutrals for surfaces (shadcn stone base), **gray** for text/borders/hovers, **slate** for brand accents (logo ink slate-900, Send button slate-600→700, brand navy #1e293b). The only saturated colors are the five `--chart-*` tokens, `--destructive`, and the v2 profile's **emerald** accent + percentile tier colors. No gradients anywhere.
- **The shell motif** is the signature: a warm stone wash (`--shell-bg`) behind white panels with 12px gutters (`my-3 ml-3 / mr-3`). Sidebar is `rounded-l-xl`, content is `rounded-r-xl` with `border-l-0` so they share a seam — one continuous nested container floating on the shell.
- **Type.** Geist Sans for everything; Geist Mono for SQL/code/tabular figures; **Outfit medium with tight tracking** is reserved for display moments — the wordmark and the big welcome greeting. Default UI size is 14px; chat prose is 15px/1.625; micro-labels 11px/600/+0.05em uppercase.
- **Elevation.** Three soft, layered tiers: `--shadow-nested` (panels), `--shadow-elevated` (composer, modals), `--shadow-floating` (hover/focus lift). Hover often *raises elevation* rather than changing color (composer, prompt rows, chips).
- **Borders.** Hairlines at reduced alpha: `gray-200/80` light, `gray-700/60` dark. Cards = white, 1px border, `rounded-xl`, shadow-xs.
- **Radii.** 10px base; 8px buttons/pills, 12px cards/panels/bubbles, 16px composer, full for avatars.
- **Hover states:** gray-100 fills on nav/ghost items; elevation lift on cards/chips; `hover:opacity-80` on brand marks; secondary buttons scale to 1.02.
- **Press states:** scale 0.98 on chips and secondary buttons.
- **Animation.** Subtle entrance fades: opacity + 10–15px y-translate, 0.3–0.5s, ease `[0.4, 0, 0.2, 1]`, with 0.04–0.06s stagger between siblings. Follow-up chips blur in (2px→0). The typing indicator is the pulsing slate Sentrum mark. Always respect `prefers-reduced-motion`.
- **Chat asymmetry:** user messages sit in a gray-100/80 bubble with the avatar *inside*; assistant replies are plain prose directly on the surface, with tables/charts in white rounded-lg containers below.
- **Transparency & blur:** used sparingly — alpha borders, gray-X/80 fills; no glassmorphism.
- **Dark mode** is a full token remap under `.dark` (class strategy, storage key `sentrum-theme`, system default).
- **The v2 player profile sub-language:** newer surfaces (player profile v2) shift to **zinc** neutrals with flat 1px-bordered cards (no shadows; hover lifts border color), Geist Mono uppercase eyebrows with a 4px emerald dot (0.22em tracking), Outfit semibold tabular numerals for stats, emerald for the profile player/positive deltas, and tier-colored percentile bars (green→red). The navy pitch visualisation (`--pitch-field`) carries position data.
- **Imagery:** none decorative. Images are functional — club crests and player photos, always `object-contain`.

## Iconography

- **Lucide is the only icon system** (the app's configured `iconLibrary`). Outline style, 2px stroke, round caps; 14px in nav rows, 16px in buttons, 18–20px standalone.
- In React components here, frequently-used glyphs (send, sparkles, arrow-right, corner-down-right, chevron, user) are inlined as verbatim Lucide path data. For pages, load Lucide from CDN: `https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js` + `lucide.createIcons()`.
- The **Sentrum "S" mark** (`assets/sentrum-icon.svg`) uses `currentColor` — slate-900 on light, white on dark, slate-500 when animated (typing).
- No emoji, no unicode-as-icon. Tenant crests are bitmap images; fall back to a rounded square with the club's three-letter code.

## Fonts

Geist, Geist Mono and Outfit load from **Google Fonts CDN** (`tokens/fonts.css`). The production app self-hosts them via `next/font/google` — same families, different delivery. If you have licensed woff2 files, replace the CDN import with `@font-face` rules.

## Index

| Path | What |
| --- | --- |
| `styles.css` | Global CSS entry — imports everything below |
| `tokens/` | `colors`, `typography`, `spacing`, `shadows`, `fonts`, plus `components.css` (snt-* classes backing the React primitives) |
| `components/brand/` | `Logo`, `SentrumAttribution` |
| `components/buttons/` | `Button` (primary / accent / secondary / outline / ghost / destructive) |
| `components/forms/` | `Input`, `Textarea`, `Label`, `Switch` |
| `components/display/` | `Card`, `Badge`, `Avatar`, `Tabs`, `Skeleton` |
| `components/data/` | `DataTable` |
| `components/chat/` | `Composer`, `PromptRow`, `UserMessage`, `FollowUpChips`, `TypingIndicator` |
| `components/navigation/` | `SidebarSection`, `SidebarNavItem` |
| `components/profile/` | `Eyebrow`, `StatCard`, `PercentileBar`, `Pitch` (v2 player-profile primitives) |
| `ui_kits/sentrum_app/` | Interactive recreation of the app: shell, sidebar, chat welcome → conversation flow |
| `ui_kits/sentrum_player_profile/` | v2 player profile: hero, tab nav, full Overview tab |
| `ui_kits/sentrum_team_profile/` | Team/club page: header KPIs, overview cards, squad table, standings |
| `guidelines/cards/` | Foundation specimen cards (Design System tab) |
| `assets/` | `sentrum-icon.svg` |
| `reference/sentrum-globals.css` | Verbatim copy of the app's `globals.css` |
| `reference/player-v2-src/` | Verbatim v2 profile sources (Hero, TabNav, Pitch, StatCard, …) |
| `reference/club-src/` | Verbatim team-page sources (ClubHeader, FormCard, ClubSquad, …) |

Component usage details live in each component's `.prompt.md`.
