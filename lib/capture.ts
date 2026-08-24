// The post-call capture loop.
//
// The CRM's biggest gap is not analysis, it is that conversations happen and
// nothing enters the system: three and a half weeks of August produced zero
// human notes while Copenhagen alone had calls every fortnight. Nobody will
// maintain a CRM, but everybody answers a direct question in Slack.
//
// So: a client call ends and has no note → one message in the team channel
// naming the deal and asking how it went. The reply, in-thread, is written
// back to Attio as a real Note. The ask also carries that call's hygiene
// question (an attendee with no name on their record), so one call means one
// message, never three pings.
//
// Granola is the primary capture path — this loop is the supplement for what
// Granola misses, which is why a call that already has a note is never asked
// about.

import { attioFetch, getAttioSnapshot } from "./attio";
import { getMeetings } from "./deal-context";
import { fetchNotes } from "./attio-notes";
import { AttioMeeting } from "./attio-meetings";

/** Wait this long after a call ends before asking — Granola gets first go. */
const MIN_AGE_HOURS = 3;
/** Calls older than this are stale: memory is gone, the moment has passed. */
const MAX_AGE_HOURS = 72;
/** A note this close to the call counts as the call being written up. */
const NOTE_WINDOW_DAYS = 2;
/**
 * Most asks posted in one run. The first run sees every unlogged call in the
 * window at once, and a burst of bot messages is how a channel learns to
 * ignore the bot. The rest are asked on later runs while still fresh.
 */
const MAX_ASKS_PER_RUN = 3;
/** An ask nobody answered stops being checked after this long. */
const ASK_EXPIRY_DAYS = 7;

const STATE_TAG = "PULSE_CAPTURE";
const DAY_MS = 86_400_000;

interface AskRecord {
  /** Slack ts of the ask message — the thread the reply arrives in. */
  ts: string;
  dealId: string;
  club: string;
  askedAt: string;
  /** Attendee email awaiting a name, when the ask included that question. */
  unnamedEmail?: string;
  /** Set once a reply has been written back to Attio. */
  done?: boolean;
}

export interface CaptureState {
  asks: Record<string, AskRecord>;
}

export interface CaptureRunResult {
  asked: { club: string; title: string; posted: boolean }[];
  replies: { club: string; savedNote: boolean; namedContact: string | null }[];
  skipped: { club: string; reason: string }[];
  errors: string[];
}

// ---------------------------------------------------------------------------
// Slack plumbing. Local rather than shared with alerts.ts on purpose — the
// digest posts fire-and-forget messages, this needs threads and replies.

function teamChannel(): string | undefined {
  return process.env.SLACK_ALERTS_CHANNEL_ID;
}
function dataChannel(): string | undefined {
  return process.env.SLACK_DIGEST_CHANNEL_ID || process.env.SLACK_CHANNEL_ID;
}

async function slack(method: string, params: Record<string, unknown>) {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) throw new Error("SLACK_BOT_TOKEN not set");
  const res = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(params),
  });
  const body = await res.json();
  if (!body.ok) throw new Error(`${method}: ${body.error}`);
  return body;
}

// ---------------------------------------------------------------------------
// State rides in the Slack data channel, same pattern as PULSE_SCORES: there
// is no database here, and losing the message only means a call might be
// asked about twice, which a human can shrug off.

export async function readCaptureState(): Promise<CaptureState> {
  const channel = dataChannel();
  if (!channel) return { asks: {} };
  try {
    const body = await slack("conversations.history", { channel, limit: 80 });
    for (const msg of body.messages ?? []) {
      const text: string = msg.text || "";
      if (!text.trimStart().startsWith(STATE_TAG)) continue;
      const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (!fenced) continue;
      try {
        const parsed = JSON.parse(fenced[1]);
        if (parsed && typeof parsed.asks === "object") return { asks: parsed.asks };
      } catch {
        // Malformed — keep looking at older messages.
      }
    }
  } catch {
    // No baseline is recoverable; worst case a duplicate ask.
  }
  return { asks: {} };
}

async function writeCaptureState(state: CaptureState): Promise<void> {
  const channel = dataChannel();
  if (!channel) return;

  // Drop expired entries so the state message never grows without bound.
  const cutoff = Date.now() - ASK_EXPIRY_DAYS * DAY_MS;
  const asks: CaptureState["asks"] = {};
  for (const [id, ask] of Object.entries(state.asks)) {
    if (new Date(ask.askedAt).getTime() >= cutoff || !ask.done) asks[id] = ask;
  }

  const payload = JSON.stringify({ run: new Date().toISOString(), asks });
  await slack("chat.postMessage", {
    channel,
    text: `${STATE_TAG} | run: ${new Date().toISOString()}\n\`\`\`${payload}\`\`\``,
    unfurl_links: false,
  });
}

// ---------------------------------------------------------------------------

function clubOf(dealName: string): string {
  return dealName.replace(/\s+[-–]\s+.*$/, "").trim();
}

function fmtDay(iso: string): string {
  const d = new Date(iso);
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - DAY_MS).toISOString().slice(0, 10);
  if (iso.slice(0, 10) === today) return "today";
  if (iso.slice(0, 10) === yesterday) return "yesterday";
  return d.toLocaleDateString("en-GB", { weekday: "long" });
}

/**
 * The ask itself. One message, questions bundled, and it tells the reader
 * exactly what their reply does — nobody should have to know how the loop
 * works to use it.
 */
function composeAsk(
  club: string,
  meeting: AttioMeeting,
  unnamedEmail: string | null,
  dealId: string
): string {
  const lines = [
    `:speech_balloon: *${club}* — call ${fmtDay(meeting.startsAt)}${
      meeting.title ? ` (“${meeting.title.trim()}”)` : ""
    } has no notes yet.`,
    `Did it move forward, and what's next? Reply in this thread and it's saved to Attio.`,
  ];
  if (unnamedEmail) {
    lines.push(
      `Also: *${unnamedEmail}* was on the call but has no name in Attio — include \`name: Their Name\` in your reply and I'll fix the record.`
    );
  }
  const slug = process.env.ATTIO_WORKSPACE_SLUG;
  if (slug) {
    lines.push(`<https://app.attio.com/${slug}/deals/record/${dealId}|Open the deal>`);
  }
  return lines.join("\n");
}

/**
 * Finds client calls in the ask window with no note and no prior ask.
 * Exported separately so the route's dry mode can show what would be asked
 * without posting anything.
 */
export async function findUnloggedCalls(state: CaptureState) {
  const [snapshot, meetings, notes] = await Promise.all([
    getAttioSnapshot(),
    getMeetings(),
    fetchNotes(),
  ]);

  const now = Date.now();
  const dealById = new Map(snapshot.deals.map((d) => [d.id, d]));
  const peopleByEmail = new Map(
    snapshot.people
      .filter((p) => p.email)
      .map((p) => [p.email!.toLowerCase(), p])
  );

  // Human notes per deal, for the "already written up" check. The deal, its
  // company and its people are all attachment points, same as everywhere else.
  const noteKeys = new Map<string, string[]>();
  for (const n of notes) {
    if (!n.human) continue;
    const arr = noteKeys.get(n.parentRecordId) ?? [];
    arr.push(n.createdAt);
    noteKeys.set(n.parentRecordId, arr);
  }
  const hasNoteNear = (dealId: string, at: string): boolean => {
    const deal = dealById.get(dealId);
    if (!deal) return false;
    const keys = [dealId, deal.associatedCompanyId, ...deal.personIds].filter(
      Boolean
    ) as string[];
    const t = new Date(at).getTime();
    return keys.some((k) =>
      (noteKeys.get(k) ?? []).some(
        (n) => Math.abs(new Date(n).getTime() - t) <= NOTE_WINDOW_DAYS * DAY_MS
      )
    );
  };

  const candidates: {
    meeting: AttioMeeting;
    club: string;
    unnamedEmail: string | null;
  }[] = [];
  const skipped: { club: string; reason: string }[] = [];

  for (const m of meetings) {
    if (m.kind !== "client" || !m.dealId) continue;
    const age = now - new Date(m.startsAt).getTime();
    if (age < MIN_AGE_HOURS * 3_600_000 || age > MAX_AGE_HOURS * 3_600_000) continue;

    const club = clubOf(dealById.get(m.dealId)?.name ?? "Unknown deal");
    if (state.asks[m.id]) {
      skipped.push({ club, reason: "already asked" });
      continue;
    }
    if (hasNoteNear(m.dealId, m.startsAt)) {
      skipped.push({ club, reason: "already written up" });
      continue;
    }

    // The hygiene rider: an attendee whose record has no name, or no record
    // at all. One per ask — a message with three questions gets no answers.
    const unnamedEmail =
      m.externalEmails.find((e) => {
        const p = peopleByEmail.get(e.toLowerCase());
        return !p || !p.name || p.name === "Unknown";
      }) ?? null;

    candidates.push({ meeting: m, club, unnamedEmail });
  }

  // Newest first: if the cap bites, the freshest memory wins.
  candidates.sort((a, b) => b.meeting.startsAt.localeCompare(a.meeting.startsAt));
  return { candidates, skipped };
}

/** Posts asks for unlogged calls. Mutates and persists state. */
async function postAsks(
  state: CaptureState,
  result: CaptureRunResult
): Promise<void> {
  const channel = teamChannel();
  if (!channel) {
    result.errors.push("SLACK_ALERTS_CHANNEL_ID not set");
    return;
  }

  const { candidates, skipped } = await findUnloggedCalls(state);
  result.skipped.push(...skipped);

  for (const c of candidates.slice(0, MAX_ASKS_PER_RUN)) {
    try {
      const posted = await slack("chat.postMessage", {
        channel,
        text: composeAsk(c.club, c.meeting, c.unnamedEmail, c.meeting.dealId!),
        unfurl_links: false,
      });
      state.asks[c.meeting.id] = {
        ts: posted.ts,
        dealId: c.meeting.dealId!,
        club: c.club,
        askedAt: new Date().toISOString(),
        unnamedEmail: c.unnamedEmail ?? undefined,
      };
      result.asked.push({ club: c.club, title: c.meeting.title, posted: true });
    } catch (err: any) {
      result.errors.push(`ask ${c.club}: ${err.message}`);
    }
  }
}

/**
 * Reads open ask threads and writes replies back to Attio.
 *
 * Any human reply counts — this is deliberately not a form. A `name:` line
 * additionally fixes the unnamed contact the ask flagged.
 */
async function processReplies(
  state: CaptureState,
  result: CaptureRunResult
): Promise<void> {
  const channel = teamChannel();
  if (!channel) return;

  for (const [meetingId, ask] of Object.entries(state.asks)) {
    if (ask.done) continue;
    try {
      const thread = await slack("conversations.replies", {
        channel,
        ts: ask.ts,
        limit: 20,
      });
      // First message is the ask itself; bot messages carry bot_id.
      const humanReplies = (thread.messages ?? [])
        .slice(1)
        .filter((m: any) => !m.bot_id && m.text?.trim());
      if (humanReplies.length === 0) continue;

      const text = humanReplies.map((m: any) => m.text.trim()).join("\n\n");

      // The name fix, when the ask requested one.
      let namedContact: string | null = null;
      const nameMatch = text.match(/^\s*name:\s*(.+)$/im);
      if (nameMatch && ask.unnamedEmail) {
        namedContact = await nameContact(ask.unnamedEmail, nameMatch[1].trim());
      }

      const debrief = text.replace(/^\s*name:.*$/im, "").trim();
      if (debrief) {
        await attioFetch("/notes", {
          method: "POST",
          body: JSON.stringify({
            data: {
              parent_object: "deals",
              parent_record_id: ask.dealId,
              title: `Call debrief — ${ask.club} — ${new Date(ask.askedAt).toLocaleDateString("en-GB")}`,
              format: "plaintext",
              content: `${debrief}\n\n(captured from Slack #sentrum-sales)`,
            },
          }),
        });
      }

      await slack("chat.postMessage", {
        channel,
        thread_ts: ask.ts,
        text: `Saved to Attio${namedContact ? ` — and ${ask.unnamedEmail} is now ${namedContact}` : ""}. :white_check_mark:`,
        unfurl_links: false,
      });

      state.asks[meetingId] = { ...ask, done: true };
      result.replies.push({ club: ask.club, savedNote: Boolean(debrief), namedContact });
    } catch (err: any) {
      result.errors.push(`reply ${ask.club}: ${err.message}`);
    }
  }
}

/** Writes a name onto the person record behind an email. Returns the name written. */
async function nameContact(email: string, fullName: string): Promise<string | null> {
  const snapshot = await getAttioSnapshot();
  const person = snapshot.people.find(
    (p) => p.email?.toLowerCase() === email.toLowerCase()
  );
  if (!person) return null;

  const parts = fullName.split(/\s+/);
  await attioFetch(`/objects/people/records/${person.id}`, {
    method: "PATCH",
    body: JSON.stringify({
      data: {
        values: {
          name: [
            {
              first_name: parts[0] ?? fullName,
              last_name: parts.slice(1).join(" ") || fullName,
              full_name: fullName,
            },
          ],
        },
      },
    }),
  });
  return fullName;
}

/** One capture run: harvest replies first, then post new asks, then persist. */
export async function runCapture(): Promise<CaptureRunResult> {
  const result: CaptureRunResult = { asked: [], replies: [], skipped: [], errors: [] };
  const state = await readCaptureState();

  // Replies before asks: a reply that arrived since the last run should be
  // saved even if this run then finds nothing new to ask about.
  await processReplies(state, result);
  await postAsks(state, result);

  if (result.asked.length > 0 || result.replies.length > 0) {
    try {
      await writeCaptureState(state);
    } catch (err: any) {
      result.errors.push(`state write: ${err.message}`);
    }
  }
  return result;
}
