---
name: sentrum-design
description: Use this skill to generate well-branded interfaces and assets for Sentrum (football intelligence platform for clubs and federations), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key facts:

- Link `styles.css` for all tokens (colors, type, spacing, shadows) and the `snt-*` component classes.
- Fonts: Geist (body), Geist Mono (code/data), Outfit (display/wordmark) — loaded from Google Fonts via `tokens/fonts.css`.
- Icons: Lucide only. No emoji.
- Signature motifs: warm stone shell with white rounded nested panels (12px gutters, `--shadow-nested`); near-monochrome gray/slate palette; sentence case copy; lowercase "sentrum" wordmark.
- React primitives live in `components/` (Button, Card, Badge, Composer, PromptRow, DataTable, SidebarSection, …) with usage notes in each `<Name>.prompt.md`.
- A full interactive app recreation is in `ui_kits/sentrum_app/`.
