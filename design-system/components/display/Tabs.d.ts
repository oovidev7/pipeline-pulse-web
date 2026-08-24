/** Tabs — muted pill list with a white active segment. */
export interface TabsProps {
  /** Tab definitions. */
  tabs: Array<{ value: string; label: React.ReactNode }>
  /** Controlled active tab value. */
  value?: string
  /** Uncontrolled initial tab. Defaults to the first tab. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  style?: React.CSSProperties
}
