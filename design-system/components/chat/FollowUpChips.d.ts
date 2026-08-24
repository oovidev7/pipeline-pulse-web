/** "Keep exploring" follow-up chips shown under assistant replies. */
export interface FollowUpChipsProps {
  /** Chip definitions; query falls back to label when omitted. */
  suggestions: Array<{ label: string; query?: string }>
  /** Called with the chip's query on click. */
  onSelect?: (query: string) => void
  /** Eyebrow text. @default 'Keep exploring' */
  label?: string
  className?: string
  style?: React.CSSProperties
}
