/** Compact football pitch with weighted position dots (player profile hero). */
export interface PitchProps {
  /** Rendered width in px; height keeps the 220:130 aspect. @default 220 */
  width?: number
  /** Position that gets the halo + direction arrow + white stroke. */
  primary?: 'GK' | 'LB' | 'CB' | 'RB' | 'LM' | 'CM' | 'RM' | 'AM' | 'LW' | 'ST' | 'RW'
  /** Dots to render (include the primary). percentage drives dot radius. */
  dots: Array<{ position: 'GK' | 'LB' | 'CB' | 'RB' | 'LM' | 'CM' | 'RM' | 'AM' | 'LW' | 'ST' | 'RW'; percentage?: number }>
  /** Which goal the player attacks toward. @default 'right' */
  attacking?: 'right' | 'left'
  /** SVG border radius. @default 4 */
  rounded?: number
  className?: string
  /** Accessible label, e.g. "Plays as Striker, Left Winger". */
  ariaLabel?: string
}
