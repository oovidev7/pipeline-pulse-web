/** Recommended-prompt row ("For you, this week") with sparkles chip and "Edit & ask" CTA. */
export interface PromptRowProps {
  /** Uppercase category eyebrow, e.g. "SQUAD PLANNING". */
  category?: string
  /** The prompt text. */
  text: string
  /** Called with the prompt text on click (fills the composer). */
  onClick?: (text: string) => void
  className?: string
  style?: React.CSSProperties
}
