// Inboxes with a job of their own.
//
// danny@sentrum.ai is the founder-led outreach test: sent under Danny's name,
// run by Ogi, and fed by the outbound agent. A club replying there is cold
// outreach working, so its deal is sourced "Email" and owned by whoever runs
// the inbox — not by whoever's name is on it, and not guessed from the address.

export interface OutreachMailbox {
  address: string;
  /** Workspace member email who owns what comes in. */
  ownerEmail: string;
  /** Deal Source for deals it creates. */
  source: string;
  /** Short label for the dashboard. */
  label: string;
}

const DEFAULT_OUTREACH: OutreachMailbox = {
  address: "danny@sentrum.ai",
  ownerEmail: "oo@gingersambasports.com",
  source: "Email",
  label: "Outreach",
};

/** The outreach inbox, overridable with OUTREACH_MAILBOX / OUTREACH_OWNER_EMAIL. */
export function outreachMailbox(): OutreachMailbox {
  return {
    ...DEFAULT_OUTREACH,
    address: (process.env.OUTREACH_MAILBOX || DEFAULT_OUTREACH.address).toLowerCase(),
    ownerEmail: (process.env.OUTREACH_OWNER_EMAIL || DEFAULT_OUTREACH.ownerEmail).toLowerCase(),
  };
}

export function isOutreachMailbox(address: string | null | undefined): boolean {
  return Boolean(address) && address!.toLowerCase() === outreachMailbox().address;
}

/** Headers to request from Gmail so auto-generated mail can be recognised. */
export const AUTO_REPLY_HEADERS = ["Auto-Submitted", "X-Autoreply", "X-Autorespond", "Precedence"];

/**
 * Out-of-office replies, auto-responders and bounces. A cold send from the
 * outreach inbox draws these from real club addresses, and counted as replies
 * they would create deals and inflate the very number the test is judged on.
 * RFC 3834 headers first, then the subject lines servers use.
 */
export function isAutoReply(header: (name: string) => string, from: string): boolean {
  const auto = header("auto-submitted").trim().toLowerCase();
  if (auto && auto !== "no") return true;
  if (header("x-autoreply") || header("x-autorespond")) return true;
  if (/^(auto_reply|bulk|junk|list)$/i.test(header("precedence").trim())) return true;
  if (/^(mailer-daemon|postmaster|no-?reply)@/i.test(from)) return true;
  return isAutoReplySubject(header("subject"));
}

/** Subject-only check, for sources that give no headers (Attio's email list). */
export function isAutoReplySubject(subject: string | null | undefined): boolean {
  return /^\s*(automatic reply|auto[- ]?reply|autoreply|out of (the )?office|ooo\b|undeliverable|delivery status notification|returned mail|mail delivery (failed|subsystem))/i.test(
    subject ?? ""
  );
}
