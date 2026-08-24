// Attio notes — the record of what was actually said.
//
// The dashboard spent its first version reasoning entirely from metadata (days
// quiet, contacts linked, stage age) while the conversations themselves sat
// here unread. That produced confident falsehoods: a deal having calls every
// week was reported as "silent 47 days" because none of that activity reaches
// email.
//
// Notes are attached to whichever record the author happened to be looking at —
// the deal, its company, or a person — so all three are collected and mapped
// back to the deal.

import { attioFetch } from "./attio";

/** Where a note came from, which is also what it tells us about reachability. */
export type NoteChannel =
  | "meeting"
  | "linkedin"
  | "whatsapp"
  | "email"
  | "manual";

export interface AttioNote {
  id: string;
  title: string;
  /** First lines of the body, for showing "here's what was last said". */
  excerpt: string;
  createdAt: string;
  channel: NoteChannel;
  parentObject: string;
  parentRecordId: string;
  /** True for notes written by a person rather than an integration or agent. */
  human: boolean;
}

/**
 * Notes written by automation, which must never count as evidence that a
 * conversation happened.
 *
 * `[agent:pipeline-triage]` posts "Projected close date is N days past" on a
 * schedule and dominates the note stream — 14 of the 30 most recent notes in
 * this workspace on 2026-08-24. Left in, it would make every stale deal look
 * like it had recent contact, which is precisely the error this module exists
 * to stop.
 */
function isAgentNote(title: string): boolean {
  return /^\s*\[agent:/i.test(title);
}

/**
 * An outreach *trigger* records that we sent something, not that anyone
 * replied. It counts as a touch on the LinkedIn channel but is not a
 * conversation, so it never becomes "what was last said".
 */
function isOutreachTrigger(title: string): boolean {
  return /^\s*LinkedIn outreach trigger/i.test(title);
}

function classify(title: string, hasMeeting: boolean): NoteChannel {
  if (hasMeeting) return "meeting";
  const t = title.toLowerCase();
  if (t.includes("whatsapp")) return "whatsapp";
  if (t.includes("linkedin")) return "linkedin";
  if (t.includes("email") || t.includes("re:") || t.includes("fw:")) return "email";
  return "manual";
}

function excerptOf(body: string | null | undefined, limit = 240): string {
  if (!body) return "";
  const flat = body.replace(/\s+/g, " ").trim();
  return flat.length <= limit ? flat : `${flat.slice(0, limit - 1).trimEnd()}…`;
}

const PAGE = 50;
/** Enough to cover well over a year of this workspace's note volume. */
const MAX_PAGES = 12;
/**
 * How far back to keep. Applied after fetching, not as an early exit: this
 * endpoint returns notes *oldest* first, so stopping on the first old note
 * silently discarded every note in the workspace. Generous because "what was
 * last said" is often old — Aston Villa's most recent real note is February's.
 */
const HORIZON_DAYS = 540;

/**
 * Fetches notes newest-first. Automation notes are dropped here rather than
 * filtered downstream so no caller can accidentally treat them as contact.
 */
export async function fetchNotes(): Promise<AttioNote[]> {
  const out: AttioNote[] = [];
  const horizon = new Date(Date.now() - HORIZON_DAYS * 86_400_000).toISOString();

  for (let page = 0; page < MAX_PAGES; page++) {
    const body = await attioFetch(`/notes?limit=${PAGE}&offset=${page * PAGE}`);
    const rows: any[] = body?.data ?? [];
    if (rows.length === 0) break;

    for (const row of rows) {
      if ((row?.created_at ?? "") < horizon) continue;
      const title: string = row?.title ?? "";
      if (isAgentNote(title)) continue;

      const parentObject: string = row?.parent_object ?? "";
      const parentRecordId: string = row?.parent_record_id ?? "";
      const createdAt: string = row?.created_at ?? "";
      if (!parentRecordId || !createdAt) continue;

      out.push({
        id: row?.id?.note_id ?? row?.id ?? "",
        title,
        excerpt: excerptOf(row?.content_plaintext),
        createdAt,
        channel: classify(title, Boolean(row?.meeting_id)),
        parentObject,
        parentRecordId,
        human: !isOutreachTrigger(title),
      });
    }

    if (rows.length < PAGE) break;
  }

  return out;
}

export interface DealNotes {
  /** Every note reachable from this deal, newest first. */
  all: AttioNote[];
  /** Newest note that represents an actual exchange, for "last said". */
  lastConversation: AttioNote | null;
  /** Channels this deal has ever produced a note on. */
  channels: NoteChannel[];
}

/**
 * Maps notes onto deals through all three attachment points. A note on a
 * company reaches every deal for that company: imprecise where one club has two
 * deals, but the alternative — dropping it — is what produced the blind spots
 * in the first place.
 */
export function groupNotesByDeal(
  notes: AttioNote[],
  deals: { id: string; associatedCompanyId: string | null; personIds: string[] }[]
): Map<string, DealNotes> {
  const byRecord = new Map<string, AttioNote[]>();
  for (const note of notes) {
    const arr = byRecord.get(note.parentRecordId) || [];
    arr.push(note);
    byRecord.set(note.parentRecordId, arr);
  }

  const out = new Map<string, DealNotes>();
  for (const deal of deals) {
    const keys = [deal.id, deal.associatedCompanyId, ...deal.personIds].filter(
      (k): k is string => Boolean(k)
    );

    const seen = new Set<string>();
    const all: AttioNote[] = [];
    for (const key of keys) {
      for (const note of byRecord.get(key) ?? []) {
        if (seen.has(note.id)) continue;
        seen.add(note.id);
        all.push(note);
      }
    }
    all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    out.set(deal.id, {
      all,
      lastConversation: all.find((n) => n.human) ?? null,
      channels: [...new Set(all.map((n) => n.channel))],
    });
  }
  return out;
}
