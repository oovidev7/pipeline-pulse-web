import React from 'react'

const ChevronIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="snt-nav-section__chevron"
    aria-hidden="true"
  >
    <path d="m9 18 6-6-6-6"></path>
  </svg>
)

/**
 * Collapsible sidebar section — header row (icon + title + chevron) that
 * toggles a list of SidebarNavItems.
 */
export function SidebarSection({ icon, title, defaultOpen = true, children, className = '', style }) {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <div className={className} style={style}>
      <button
        type="button"
        className="snt-nav-section"
        data-open={open ? 'true' : 'false'}
        onClick={() => setOpen(!open)}
      >
        {icon}
        {title}
        <ChevronIcon />
      </button>
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 8 }}>
          {children}
        </div>
      )}
    </div>
  )
}
