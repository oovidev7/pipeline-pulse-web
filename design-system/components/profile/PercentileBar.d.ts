/** Thin tier-colored percentile bar (elite ≥90 green → low <25 red). */
export interface PercentileBarProps {
  /** 0–100; drives both width and tier color. */
  percentile: number
  className?: string
  style?: React.CSSProperties
}
