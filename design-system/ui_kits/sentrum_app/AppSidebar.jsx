// Sentrum app sidebar — recreation of components/chat/sidebar/ChatSidebar.tsx
const { Logo, SentrumAttribution, SidebarSection, SidebarNavItem } =
  window.SentrumDesignSystem_fd9502

// Lucide icon helper (icons render via lucide.createIcons on an effect)
function LIcon({ name, size = 14 }) {
  const ref = React.useRef(null)
  React.useEffect(() => {
    if (window.lucide && ref.current) {
      window.lucide.createIcons({
        root: ref.current.parentElement || undefined,
      })
    }
  })
  return (
    <i
      ref={ref}
      data-lucide={name}
      style={{ width: size, height: size, display: 'inline-flex', flexShrink: 0 }}
    ></i>
  )
}

function AppSidebar({ collapsed, onToggle, onNewChat, conversations, activeId, onSelect }) {
  if (collapsed) {
    return (
      <aside className="app-sidebar app-sidebar--collapsed">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 8px' }}>
          <button className="icon-btn" title="Expand sidebar" onClick={onToggle}>
            <LIcon name="panel-left-open" size={16} />
          </button>
        </div>
        <button className="icon-btn icon-btn--wide" title="New chat" onClick={onNewChat}>
          <LIcon name="square-pen" size={20} />
        </button>
        <div className="collapsed-icons">
          <button className="icon-btn" title="My Dashboard"><LIcon name="layout-dashboard" size={20} /></button>
          <button className="icon-btn" title="My Club(s)"><LIcon name="shield" size={20} /></button>
          <button className="icon-btn" title="Scouting"><LIcon name="clipboard-list" size={20} /></button>
          <button className="icon-btn" title="Recruitment"><LIcon name="crosshair" size={20} /></button>
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 10, opacity: 0.4 }}>
          <Logo variant="icon" size="xs" />
        </div>
      </aside>
    )
  }

  return (
    <aside className="app-sidebar">
      {/* Brand header */}
      <div className="sidebar-header">
        <button className="brand-btn" title="New chat" onClick={onNewChat}>
          <Logo size="md" />
        </button>
        <button className="icon-btn" title="Collapse sidebar" onClick={onToggle}>
          <LIcon name="panel-left-close" size={16} />
        </button>
      </div>

      {/* New chat */}
      <button className="new-chat-btn" onClick={onNewChat}>
        <LIcon name="square-pen" size={20} />
        <span>New chat</span>
      </button>

      <div className="sidebar-sep"></div>

      {/* Nav sections */}
      <div className="sidebar-scroll">
        <SidebarNavItem
          icon={<LIcon name="layout-dashboard" />}
          label="My Dashboard"
          style={{ padding: '8px' }}
        />
        <SidebarSection icon={<LIcon name="shield" size={16} />} title="My Club(s)" defaultOpen={false}>
          <SidebarNavItem icon={<LIcon name="users" />} label="Squad" />
          <SidebarNavItem icon={<LIcon name="calendar-clock" />} label="Fixtures" />
        </SidebarSection>
        <SidebarSection icon={<LIcon name="clipboard-list" size={16} />} title="Scouting" defaultOpen={false}>
          <SidebarNavItem icon={<LIcon name="file-text" />} label="Reports" />
          <SidebarNavItem icon={<LIcon name="file-plus" />} label="New Report" />
        </SidebarSection>
        <SidebarSection icon={<LIcon name="crosshair" size={16} />} title="Recruitment" defaultOpen={false}>
          <SidebarNavItem icon={<LIcon name="layout-grid" />} label="Board" />
          <SidebarNavItem icon={<LIcon name="list" />} label="Short Lists" />
        </SidebarSection>
        <SidebarSection icon={<LIcon name="users" size={16} />} title="Shadow Teams" defaultOpen={false}>
          <SidebarNavItem icon={<LIcon name="shield" />} label="All Teams" />
        </SidebarSection>

        {/* Chat history */}
        {conversations.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div className="snt-microlabel" style={{ padding: '0 8px', marginBottom: 6 }}>
              Recent
            </div>
            {conversations.map(c => (
              <button
                key={c.id}
                className="snt-nav-item"
                data-active={c.id === activeId ? 'true' : 'false'}
                onClick={() => onSelect(c.id)}
                style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}
              >
                {c.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-row">
          <span className="snt-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>AK</span>
          <span className="user-email">anna@club.com</span>
        </div>
        <SentrumAttribution />
      </div>
    </aside>
  )
}

Object.assign(window, { AppSidebar, LIcon })
