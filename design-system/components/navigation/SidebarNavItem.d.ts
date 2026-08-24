/** Sidebar navigation row — icon + 14px label; gray pill background when active. */
export interface SidebarNavItemProps {
  /** Leading icon (14px Lucide SVG). */
  icon?: React.ReactNode
  label: React.ReactNode
  /** Active route — gray pill, medium weight. @default false */
  active?: boolean
  onClick?: () => void
  /** Renders an <a> instead of <button>. */
  href?: string
  className?: string
  style?: React.CSSProperties
}
