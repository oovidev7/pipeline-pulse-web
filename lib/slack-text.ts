/**
 * Slack rewrites text before storing it: HTML entities are escaped, and any URL
 * or email inside the message — including inside a fenced JSON payload — gets
 * wrapped in its own link syntax, e.g.
 *
 *   &lt;mailto:a@b.com|a@b.com&gt;
 *   &lt;https://example.com/article|example.com&gt;
 *
 * Rendering that verbatim leaks markup into the UI, so entities are decoded
 * first (turning the escaped angle brackets back into delimiters) and the link
 * wrappers are then reduced to their label.
 */
export function cleanSlackText(text: string): string {
  if (!text) return "";
  const decoded = text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  return decoded.replace(/<([^<>|]+)(?:\|([^<>]*))?>/g, (match, target, label) => {
    const t = String(target);
    // Only unwrap things that are actually Slack links; leave real angle
    // brackets (e.g. "Atlanta United <> Sentrum") untouched.
    if (!/^(https?:\/\/|mailto:|tel:)/i.test(t)) return match;
    if (label) return label;
    return t.replace(/^mailto:/i, "").replace(/^tel:/i, "");
  });
}

/**
 * Unwraps a Slack-wrapped URL to a plain href, or null if it isn't one.
 *
 * This decodes entities but deliberately does NOT run the link-unwrapping in
 * cleanSlackText — for `<https://site/path|site>` that would keep the display
 * label and discard the actual href, leaving nothing linkable.
 */
export function cleanSlackUrl(url: string | undefined | null): string | null {
  if (!url) return null;
  const decoded = url
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim()
    .replace(/^<|>$/g, "");
  // In Slack link syntax the target precedes the pipe and the label follows it.
  const [href] = decoded.split("|");
  return /^https?:\/\//.test(href.trim()) ? href.trim() : null;
}
