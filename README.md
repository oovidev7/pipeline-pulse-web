# Pipeline Pulse (Web)

A standalone Next.js (App Router, TypeScript) sales pipeline dashboard for Sentrum,
pulling live data from Attio (CRM), Gmail, Google Calendar, and Slack, with an
AI-generated "suggest next action" feature powered by Claude.

This is a fully standalone replacement for the original Cowork artifact version —
it talks directly to each provider's API using your own credentials, instead of
relying on Cowork's `window.cowork.callMcpTool` bridge, so it can be deployed
anywhere (e.g. Vercel) and used outside of Cowork.

## Local development

1. Install dependencies:
   ```
   npm install
   ```
2. Copy the env file and fill in real credentials (see `CREDENTIALS_SETUP.md` for
   how to obtain each one):
   ```
   cp .env.example .env.local
   ```
3. Run the dev server:
   ```
   npm run dev
   ```
4. Open http://localhost:3000 — you'll be redirected to `/login` and asked for
   `SITE_PASSWORD`.

## Deployment

See `DEPLOY.md` for step-by-step instructions to push this to GitHub and deploy
on Vercel.

## Project structure

- `app/page.tsx` — main dashboard (client component), fetches all API routes and
  renders progressively (deals first, then calendar/contact-activity/slack in
  parallel as each resolves).
- `app/login/page.tsx` — password entry form.
- `middleware.ts` — redirects any request without a valid signed session cookie
  to `/login`.
- `components/*.tsx` — dashboard sections (StageSnapshot, PipelineHealth,
  AtRiskList, UpcomingCalls, OwnerPerformance, WeeklyActivity).
- `lib/attio.ts` — Attio REST client + in-memory 3-minute cache + all dashboard
  metric computation (stage snapshot, pipeline health, at-risk deals, owner
  performance, new conversations).
- `lib/google-auth.ts` — shared Google OAuth2 refresh-token → access-token
  helper (with in-memory caching), plus a bounded-concurrency worker pool and
  a `withTimeout` helper used by the Gmail route.
- `lib/auth.ts` — HMAC-signed session cookie helpers (Web Crypto API, so it
  works in both the Node.js and Edge runtimes).

## API routes

All external API calls happen server-side only, inside these route handlers —
API keys never reach the browser.

- **`GET /api/deals`** — Attio. Fetches all deal + people records and workspace
  members (paginated), then computes: stage snapshot, pipeline health (win
  rate, open pipeline value, stalled-deal count), at-risk deals (with reason
  codes), owner performance, and "new conversations" (people whose
  `first_email_interaction` is within the last 7 days and whose
  `strongest_connection_user` resolves to a workspace member). Cached
  in-memory for 3 minutes; pass `?refresh=1` to bypass the cache.

- **`GET /api/contact-activity`** — Gmail. For each deal's primary contact
  email, searches Gmail for the newest message to/from that address using a
  concurrency-limited worker pool (6 at a time) with an 8-second per-request
  timeout, so a single slow Gmail call can't stall the whole batch or blow a
  serverless timeout. Returns last-contact date/direction/snippet per deal,
  plus a "follow-ups needed" list (our last message unanswered, within 7
  days). Cached in-memory for 3 minutes.

- **`GET /api/calendar`** — Google Calendar. Fetches events for the next 7
  days from one or two configured Google accounts (see
  `GOOGLE_REFRESH_TOKEN_OGI` / `GOOGLE_REFRESH_TOKEN_DANNY` in
  `.env.example`), de-duplicates events that appear on both calendars, and
  matches attendees against Attio contact emails to split events into
  "matched to a deal" vs. "unmatched". Cached 3 minutes.

- **`GET /api/slack`** — Slack. Reads recent messages from
  `SLACK_CHANNEL_ID` via `conversations.history`, and returns the two most
  recent messages that parse as JSON (tolerating a ```` ``` ```` /```` ```json ```` code
  fence) as "latest" / "previous" weekly snapshots for a week-over-week diff.
  Returns nulls gracefully if nothing parses. Cached 3 minutes.

- **`POST /api/suggest-next-action`** — Anthropic (Claude). Accepts
  `{ dealId }`, looks up that deal's Attio data, risk reasons, and (if warm)
  its cached Gmail contact-activity snippet, then builds a prompt using a
  small "playbook" of research-backed tactic blocks matched to which risk
  reasons apply (single-threaded, unanswered follow-ups, no recent activity,
  stage stale, etc.), explicitly instructs the model not to invent facts, and
  returns one concrete suggested action as plain text.

- **`POST /api/auth/login`** — checks the submitted password against
  `SITE_PASSWORD` and sets an httpOnly, HMAC-signed session cookie on success.
