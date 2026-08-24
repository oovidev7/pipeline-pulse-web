/** Data table — uppercase header row, tabular numerals, optional clickable rows. */
export interface DataTableProps {
  /** Column definitions, in display order. */
  columns: Array<{
    key: string
    label: React.ReactNode
    /** Use tabular numerals. */
    numeric?: boolean
    align?: 'left' | 'right'
  }>
  /** Row objects keyed by column key. Values may be ReactNodes. */
  rows: Array<Record<string, React.ReactNode>>
  /** When set, rows get hover background + pointer cursor. */
  onRowClick?: (row: Record<string, React.ReactNode>, index: number) => void
  className?: string
  style?: React.CSSProperties
}
