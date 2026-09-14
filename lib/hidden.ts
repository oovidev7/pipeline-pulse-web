// Counterparts hidden from "Coming up".
//
// The diary is full of external meetings that are real but not sales —
// investors, funds, intros about Sentrum-the-company rather than
// Sentrum-the-product. Hiding is per *counterpart*, not per meeting: dismiss
// Cherry Ventures once and every future Cherry call stays gone, instead of
// the same VC being swatted weekly.
//
// State rides in the Slack data channel under its own tag, same pattern as
// PULSE_SCORES/PULSE_CAPTURE: shared across the team, survives deployments,
// and losing it merely resurfaces some cards.

const STATE_TAG = "PULSE_HIDDEN";

export interface HiddenCounterpart {
  companyId: string;
  name: string;
  hiddenAt: string;
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
    // Next caches fetches inside GET route handlers, POSTs included — a
    // cached read here would resurrect cards someone just dismissed.
    cache: "no-store",
  });
  const body = await res.json();
  if (!body.ok) throw new Error(`${method}: ${body.error}`);
  return body;
}

export async function readHiddenCounterparts(): Promise<HiddenCounterpart[]> {
  const channel = dataChannel();
  if (!channel) return [];
  try {
    const body = await slack("conversations.history", { channel, limit: 80 });
    for (const msg of body.messages ?? []) {
      const text: string = msg.text || "";
      if (!text.trimStart().startsWith(STATE_TAG)) continue;
      const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (!fenced) continue;
      try {
        const raw = fenced[1].replace(/<(?:mailto:)?([^|<>]+)(?:\|[^<>]*)?>/g, "$1");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.hidden)) return parsed.hidden;
      } catch {
        // Malformed — keep looking at older messages.
      }
    }
  } catch (err) {
    console.error("[hidden] state read failed:", (err as any)?.message);
  }
  return [];
}

export async function setCounterpartHidden(
  companyId: string,
  name: string,
  hide: boolean
): Promise<HiddenCounterpart[]> {
  const current = await readHiddenCounterparts();
  const next = hide
    ? [
        ...current.filter((h) => h.companyId !== companyId),
        { companyId, name, hiddenAt: new Date().toISOString() },
      ]
    : current.filter((h) => h.companyId !== companyId);

  const channel = dataChannel();
  if (channel) {
    const payload = JSON.stringify({ run: new Date().toISOString(), hidden: next });
    await slack("chat.postMessage", {
      channel,
      text: `${STATE_TAG} | run: ${new Date().toISOString()}\n\`\`\`${payload}\`\`\``,
      unfurl_links: false,
    });
  }
  return next;
}
