import React from 'react'

/**
 * Sidebar navigation row — small icon + 14px label; gray pill when active.
 */
export function SidebarNavItem({ icon, label, active = false, onClick, href, className = '', style }) {
  const Tag = href ? 'a' : 'button'
  return (
    <Tag
      type={href ? undefined : 'button'}
      href={href}
      className={`snt-nav-item ${className}`}
      data-active={active ? 'true' : 'false'}
      onClick={onClick}
      style={style}
    >
      {icon}
      {label}
    </Tag>
  )
}
