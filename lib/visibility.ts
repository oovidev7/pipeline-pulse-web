// What we can actually see about a deal, as distinct from what is happening.
//
// The original scoring collapsed two very different states into one number.
// "Silent 47 days" was reported for FC Copenhagen while it was having calls
// every week and live WhatsApp threads with their scouts — none of which
// touches email, the only channel the score could see. A dashboard that states
// falsehoods with a number attached does not get a second look, which is the
// likeliest reason the founders stopped opening this one.
//
// So the rule here: never assert silence we cannot verify. A deal with no
// captured activity and no human explanation is not a risk, it is a question —
// and asking it is also how the answer gets captured.

import { DealRecord } from "./types";
import { DealNotes, NoteChannel } from "./attio-notes";

export type Channel = NoteChannel | "calendar";

/** Days without captured activity before a deal stops counting as active. */
const QUIET_DAYS = 14;

export type VisibilityState =
  /** Something reached us recently, or a meeting is on the calendar ahead. */
  | "active"
  /** Nothing recent, but a human has recorded where this stands. */
  | "explained"
  /** Nothing recent and no explanation. We do not know, and should ask. */
  | "dark";

export interface DealVisibility {
  state: VisibilityState;
  lastCapturedAt: string | null;
  lastCapturedChannel: Channel | null;
  daysSinceCapture: number | null;
  /** Every channel this deal has ever produced a signal on. */
  channels: Channel[];
  /** A future meeting, which means alive regardless of silence elsewhere. */
  nextMeetingAt: string | null;
  /** The standing human verdict, when one is recorded on the deal. */
  verdict: string | null;
  /** One plain sentence, honest about its own limits. */
  summary: string;
}

const DAY_MS = 86_400_000;

function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((Date.now() - t) / DAY_MS));
}

function isFuture(iso: string | null): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return !Number.isNaN(t) && t > Date.now();
}

export interface VisibilityInputs {
  notes: DealNotes | undefined;
  /** Gmail's view, where this app has credentials for the mailbox. */
  gmailLastContact?: string | null;
  /** Latest calendar interaction across the deal's contacts, from Attio. */
  lastCalendar?: string | null;
  /** Next calendar interaction across the deal's contacts, from Attio. */
  nextCalendar?: string | null;
  /**
   * Most recent meeting held with this deal's company, from Attio's meetings
   * API. Distinct from `lastCalendar`, which only sees people linked as
   * contacts — Copenhagen's trial calls run through someone who never was.
   */
  lastMeeting?: string | null;
  /** Next meeting booked with this deal's company. */
  nextMeeting?: string | null;
}

export function computeVisibility(
  deal: DealRecord,
  inputs: VisibilityInputs
): DealVisibility {
  const signals: { at: string | null; channel: Channel }[] = [
    { at: deal.lastPersonInteraction, channel: "email" },
    { at: inputs.gmailLastContact ?? null, channel: "email" },
    { at: inputs.lastCalendar ?? null, channel: "calendar" },
    { at: inputs.lastMeeting ?? null, channel: "meeting" },
    { at: deal.lastWhatsappTouch, channel: "whatsapp" },
  ];

  // Notes carry their own channel, and are the only evidence of the LinkedIn
  // and WhatsApp conversations where most of this pipeline actually happens.
  for (const note of inputs.notes?.all ?? []) {
    signals.push({ at: note.createdAt, channel: note.channel });
  }

  const dated = signals.filter(
    (s): s is { at: string; channel: Channel } => Boolean(s.at)
  );
  const latest = dated.reduce<{ at: string; channel: Channel } | null>(
    (best, s) => (!best || s.at > best.at ? s : best),
    null
  );

  const channels = [...new Set(dated.map((s) => s.channel))];
  const daysSinceCapture = daysSince(latest?.at ?? null);

  // A booked meeting settles it: whatever email says, this deal is alive.
  const nextMeetingAt =
    [deal.nextCall, inputs.nextCalendar ?? null, inputs.nextMeeting ?? null]
      .filter(isFuture)
      .sort()[0] ?? null;

  // `note` is Attio's free-text verdict field; `stallNotes` is ours. Either
  // means a human has said where this stands. Neither carries a timestamp, so
  // an explanation is treated as standing until contradicted — which is why
  // the digest asks whether it still holds rather than assuming it does.
  const verdict = deal.dealNote?.trim() || deal.stallNotes?.trim() || null;

  const recentlyActive =
    daysSinceCapture !== null && daysSinceCapture <= QUIET_DAYS;

  const state: VisibilityState =
    recentlyActive || nextMeetingAt
      ? "active"
      : verdict
        ? "explained"
        : "dark";

  return {
    state,
    lastCapturedAt: latest?.at ?? null,
    lastCapturedChannel: latest?.channel ?? null,
    daysSinceCapture,
    channels,
    nextMeetingAt,
    verdict,
    summary: describe(state, daysSinceCapture, channels, nextMeetingAt, verdict),
  };
}

function describe(
  state: VisibilityState,
  days: number | null,
  channels: Channel[],
  nextMeetingAt: string | null,
  verdict: string | null
): string {
  if (state === "active") {
    if (nextMeetingAt) return "Meeting booked — this one is live.";
    return `Active — something reached us ${days === 0 ? "today" : `${days}d ago`}.`;
  }

  // Deliberately phrased as what we captured, never as what happened. The
  // channels we hold are named so the reader can judge the gap themselves.
  const seen = channels.length ? channels.join(", ") : "nothing";
  const window = days === null ? "ever" : `in ${days}d`;

  if (state === "explained") {
    return `No activity captured ${window} (we see: ${seen}). Recorded verdict: “${verdict}”.`;
  }
  return `No activity captured ${window} (we see: ${seen}) and no note explaining why — worth a check.`;
}
