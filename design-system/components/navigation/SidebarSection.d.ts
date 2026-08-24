/** Collapsible sidebar section — icon + title header with rotating chevron. */
export interface SidebarSectionProps {
  /** Section icon (16px Lucide SVG). */
  icon?: React.ReactNode
  title: React.ReactNode
  /** @default true */
  defaultOpen?: boolean
  /** SidebarNavItem rows. */
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}
