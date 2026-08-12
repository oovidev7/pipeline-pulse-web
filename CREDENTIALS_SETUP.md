# Credentials Setup Guide

This walks through obtaining every credential listed in `.env.example`, in the
order you'll likely want to get them. None of these require deep technical
knowledge — just careful copy/pasting.

## 1. Attio API key

1. Log in to Attio at https://app.attio.com and open the **Sentrum** workspace.
2. Click the workspace name (top left) → **Settings**.
3. In the left sidebar, find **Developers** → **API keys** (sometimes listed
   as "Access" or "Integrations" depending on your Attio plan — look for
   "API keys").
4. Click **Create API key** (or **+ New key**).
5. Give it a name like "Pipeline Pulse Web".
6. Grant it **read access** to: `Deals` (object), `People` (object), and
   `Workspace members`. If Attio only offers a single "read" scope for the
   whole workspace, that's fine too.
7. Click **Create**, then copy the key immediately (Attio typically only
   shows it once). Paste it into `ATTIO_API_KEY` in your `.env.local` (and
   later into Vercel's environment variables).
8. Set `ATTIO_WORKSPACE_SLUG` to `sentrum` (or whatever your workspace's URL
   slug is — check the URL when logged into Attio, e.g.
   `app.attio.com/sentrum/...`).

## 2. Google OAuth credentials (Gmail + Calendar)

You need three things: a Google Cloud project with Gmail API and Calendar API
enabled, an OAuth 2.0 Client ID/Secret, and a refresh token obtained via
Google's OAuth Playground.

### 2a. Create a Google Cloud project

1. Go to https://console.cloud.google.com/ and log in with the Google account
   whose Gmail/Calendar you want the dashboard to read (e.g. your sales
   mailbox).
2. Click the project dropdown at the top → **New Project**.
3. Name it something like "Pipeline Pulse" and click **Create**.

### 2b. Enable the Gmail API and Calendar API

1. With your new project selected, go to **APIs & Services** → **Library**.
2. Search for "Gmail API", click it, click **Enable**.
3. Search for "Google Calendar API", click it, click **Enable**.

### 2c. Configure the OAuth consent screen

1. Go to **APIs & Services** → **OAuth consent screen**.
2. Choose **External** (unless you have a Google Workspace org and want
   **Internal**).
3. Fill in the required fields (app name "Pipeline Pulse", your email as
   support/developer contact). You don't need to fill in most optional
   fields.
4. On the **Scopes** step, you can skip adding scopes here (they'll be
   requested directly in the OAuth Playground later) — click through.
5. On the **Test users** step, click **Add users** and add your own Google
   account email (the one whose Gmail/Calendar you're connecting). This is
   required because the app won't be "verified" by Google, and unverified
   apps can only be used by explicitly added test users.
6. Save and continue through to finish.

### 2d. Create an OAuth 2.0 Client ID

1. Go to **APIs & Services** → **Credentials**.
2. Click **+ Create Credentials** → **OAuth client ID**.
3. Application type: **Web application**.
4. Name it "Pipeline Pulse Web".
5. Under **Authorized redirect URIs**, add:
   `https://developers.google.com/oauthplayground`
   (This is required so Google's OAuth Playground tool, used in the next
   step, can complete the auth flow using your own credentials.)
6. Click **Create**. Copy the **Client ID** and **Client Secret** — these go
   into `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### 2e. Get a refresh token via OAuth Playground

1. Go to https://developers.google.com/oauthplayground
2. Click the gear icon (top right) → check **"Use your own OAuth
   credentials"** → paste in your Client ID and Client Secret from step 2d →
   close the settings panel.
3. In the left panel ("Step 1 — Select & authorize APIs"), find and check:
   - **Gmail API v1** → `https://www.googleapis.com/auth/gmail.readonly`
   - **Calendar API v3** → `https://www.googleapis.com/auth/calendar.readonly`
4. Click **Authorize APIs**. You'll be sent through a normal Google sign-in
   and consent flow — sign in with the account you added as a test user in
   step 2c, and approve access. (You may see an "unverified app" warning —
   click "Advanced" → "Go to Pipeline Pulse (unsafe)" to proceed; this is
   expected for apps that haven't gone through Google's verification review.)
5. Back on the OAuth Playground, you'll land on "Step 2 — Exchange
   authorization code for tokens". Click **Exchange authorization code for
   tokens**.
6. Copy the **Refresh token** value shown. This goes into
   `GOOGLE_REFRESH_TOKEN` (or `GOOGLE_REFRESH_TOKEN_OGI` /
   `GOOGLE_REFRESH_TOKEN_DANNY` if you're setting up a second calendar for a
   second person — repeat this whole section 2 with their Google account to
   get a second refresh token).

## 3. Slack bot token

1. Go to https://api.slack.com/apps and click **Create New App** → **From
   scratch**.
2. Name it "Pipeline Pulse" and select the Sentrum Slack workspace.
3. In the left sidebar, go to **OAuth & Permissions**.
4. Scroll to **Scopes** → **Bot Token Scopes** and add:
   - `channels:history` (read messages in public channels)
   - `channels:read` (list/look up public channels)
   - `groups:history` (only needed if the data channel is private)
5. Scroll up and click **Install to Workspace** (or **Install App**), then
   approve the permissions.
6. Copy the **Bot User OAuth Token** — it starts with `xoxb-`. This goes into
   `SLACK_BOT_TOKEN`.
7. In Slack itself, go to the channel referenced in the code as
   `#sentrum-pulse-data-v2` (or whatever your weekly-snapshot data channel is
   called) and type `/invite @Pipeline Pulse` (or your app's name) to invite
   the bot to that channel — the bot can only read channels it's been
   invited to.
8. To find the channel's ID (not name) for `SLACK_CHANNEL_ID`: open the
   channel in Slack, click the channel name at the top to open channel
   details, and the ID (starts with `C`) is shown near the bottom of that
   panel, or in the URL when viewing the channel in a browser.

## 4. Anthropic API key

1. Go to https://console.anthropic.com and log in (or create an account).
2. In the left sidebar, click **API Keys**.
3. Click **Create Key**, give it a name like "Pipeline Pulse Web", and copy
   the key. This goes into `ANTHROPIC_API_KEY`.
4. Make sure the account/organization has billing set up — API calls will
   fail without an active payment method on file.

## 5. SITE_PASSWORD and ADMIN_SECRET

These aren't obtained from anywhere — you just pick them yourself:

- `SITE_PASSWORD`: any password you want to require to view the dashboard.
  Share it with whoever should have access.
- `ADMIN_SECRET`: a long, random string used to cryptographically sign the
  login session cookie. Generate one from a terminal with:
  ```
  openssl rand -hex 32
  ```
  Paste the output as-is. Never share this value — it's not something users
  type in, it's just used internally to prevent cookie forgery.
