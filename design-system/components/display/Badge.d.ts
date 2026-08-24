/** Compact status badge — rounded-md, 12px medium text. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default 'default' */
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  children?: React.ReactNode
}
