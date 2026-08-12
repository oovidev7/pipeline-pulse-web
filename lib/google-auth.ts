// Shared Google OAuth2 refresh-token helper for Gmail + Calendar routes.
//
// v1 supports up to two Google accounts (e.g. two sales reps sharing this
// dashboard) via GOOGLE_REFRESH_TOKEN_OGI and GOOGLE_REFRESH_TOKEN_DANNY.
// If neither of those is set, falls back to the single GOOGLE_REFRESH_TOKEN.
// Each named account gets its own access-token cache entry. Calendar route
// merges events from every configured account; Gmail route currently only
// needs one account's inbox for from/to search (typically the shared sales
// mailbox), so it uses the first available token.

interface TokenCacheEntry {
  accessToken: string;
  expiresAt: number; // epoch ms
}

const tokenCache = new Map<string, TokenCacheEntry>();

export interface GoogleAccount {
  key: string; // e.g. "default" | "ogi" | "danny"
  refreshToken: string;
}

/** Returns the list of configured Google accounts based on env vars. */
export function getConfiguredGoogleAccounts(): GoogleAccount[] {
  const accounts: GoogleAccount[] = [];
  if (process.env.GOOGLE_REFRESH_TOKEN_OGI) {
    accounts.push({ key: "ogi", refreshToken: process.env.GOOGLE_REFRESH_TOKEN_OGI });
  }
  if (process.env.GOOGLE_REFRESH_TOKEN_DANNY) {
    accounts.push({ key: "danny", refreshToken: process.env.GOOGLE_REFRESH_TOKEN_DANNY });
  }
  if (accounts.length === 0 && process.env.GOOGLE_REFRESH_TOKEN) {
    accounts.push({ key: "default", refreshToken: process.env.GOOGLE_REFRESH_TOKEN });
  }
  return accounts;
}

/** Exchanges (or reuses a cached) refresh token for a short-lived access token. */
export async function getAccessToken(account: GoogleAccount): Promise<string> {
  const cached = tokenCache.get(account.key);
  if (cached && Date.now() < cached.expiresAt - 60_000) {
    return cached.accessToken;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set");
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: account.refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Google token refresh failed for ${account.key}: ${res.status} ${text}`);
  }

  const body = await res.json();
  const accessToken = body.access_token as string;
  const expiresInSec = (body.expires_in as number) || 3600;
  tokenCache.set(account.key, {
    accessToken,
    expiresAt: Date.now() + expiresInSec * 1000,
  });
  return accessToken;
}

/** Races a promise against a timeout, throwing if the timeout wins. */
export function withTimeout<T>(promise: Promise<T>, ms: number, label = "request"): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

/** Simple bounded-concurrency worker pool over a shared index cursor. */
export async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function runNext(): Promise<void> {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      try {
        results[index] = await worker(items[index], index);
      } catch (err) {
        // Store the error as undefined-ish result; caller filters/handles.
        results[index] = undefined as unknown as R;
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => runNext());
  await Promise.all(workers);
  return results;
}
