/**
 * Chat composer — rounded-2xl elevated input card with slate Send CTA.
 * @startingPoint section="Chat" subtitle="Chat input with Send CTA" viewport="700x190"
 */
export interface ComposerProps {
  /** @default 'Ask anything about your football data…' */
  placeholder?: string
  /** Called with the trimmed message on Enter or Send. */
  onSend?: (message: string) => void
  /** @default false */
  autoFocus?: boolean
  className?: string
  style?: React.CSSProperties
}
