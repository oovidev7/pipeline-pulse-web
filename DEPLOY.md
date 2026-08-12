# Deploying to Vercel

## 1. Push this folder to a new GitHub repository

From inside the `pipeline-pulse-web` folder:

```bash
git init
git add -A
git commit -m "Initial commit: Pipeline Pulse web app"
```

Create a new empty repository on GitHub (https://github.com/new — do not
initialize it with a README, .gitignore, or license, since this folder
already has those). Then push:

```bash
git remote add origin https://github.com/<your-username>/pipeline-pulse-web.git
git branch -M main
git push -u origin main
```

## 2. Import into Vercel

1. Go to https://vercel.com/new
2. Click **Import** next to the `pipeline-pulse-web` GitHub repo (you may
   need to grant Vercel access to your GitHub account/repo first).
3. Framework Preset should auto-detect as **Next.js** — leave build/output
   settings at their defaults (`next build`, `.next`).
4. Before clicking Deploy, add environment variables (or add them right
   after the first deploy — see step 3).

## 3. Add environment variables

In the Vercel project → **Settings** → **Environment Variables**, add every
variable listed in `.env.example`:

```
SITE_PASSWORD
ADMIN_SECRET
ATTIO_API_KEY
ATTIO_WORKSPACE_SLUG
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN
GOOGLE_REFRESH_TOKEN_OGI       (optional — only if using a second calendar)
GOOGLE_REFRESH_TOKEN_DANNY     (optional — only if using a second calendar)
SLACK_BOT_TOKEN
SLACK_CHANNEL_ID
ANTHROPIC_API_KEY
```

See `CREDENTIALS_SETUP.md` for how to obtain each value. Apply them to all
environments (Production, Preview, Development) unless you specifically want
different credentials per environment.

## 4. Redeploy

After adding env vars, trigger a redeploy: **Deployments** tab → **...** menu
on the latest deployment → **Redeploy** (env vars are only picked up on a
fresh build/deploy, not retroactively).

## Timeout considerations

Vercel's **Hobby plan** limits serverless functions to a **10-second**
timeout. This app is specifically designed to stay under that:

- `/api/deals`, `/api/contact-activity`, `/api/calendar`, and `/api/slack`
  all cache their computed responses in-memory for 3 minutes, so repeat page
  loads within that window return instantly without re-hitting any external
  API.
- `/api/contact-activity` (the most expensive route — up to ~50 Gmail
  searches) uses a concurrency-limited worker pool (6 requests in flight at
  once, not 50 sequential ones) plus an 8-second per-request timeout, so a
  single slow Gmail call can't block the whole batch or blow the function's
  overall time budget.

If you have a large number of deals/contacts and still see timeouts on a
cold cache (i.e. the very first load after each 3-minute cache window
expires), consider upgrading to **Vercel Pro**, which raises the serverless
function timeout to 60 seconds — that gives significant headroom for the
Gmail route in particular.

Note: Vercel's serverless functions are stateless and may run on different
instances between requests, so the in-memory caches described above are
best-effort (a "warm" instance will serve from cache; a fresh cold start
will recompute). This is expected and fine for a 3-minute cache window used
to avoid rate-limit/latency issues, not as a source of truth.
