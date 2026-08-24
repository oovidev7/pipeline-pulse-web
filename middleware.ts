import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySignedCookieValue } from "./lib/auth";

// Public paths that don't require the session cookie. The cron routes
// authenticate themselves with CRON_SECRET inside the route — a cron can't log
// in. "Public" here means only that the middleware steps aside; both still
// reject anything without the secret.
const PUBLIC_PATHS = [
  "/login",
  "/api/auth/login",
  "/api/alerts/run",
  "/api/warm",
  "/api/capture/run",
  "/api/hygiene/run",
  // Authenticated by Slack's request signature, not the session cookie.
  "/api/slack-events",
  // Authenticated by the secret in the URL registered with Attio.
  "/api/attio-webhook",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  // Always allow Next.js internals and static assets.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    isPublic
  ) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const valid = await verifySignedCookieValue(cookie);

  if (!valid) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
