import React from 'react'

/**
 * Tabs — muted pill list with white active segment (controlled or uncontrolled).
 */
export function Tabs({ tabs, value, defaultValue, onValueChange, className = '', style }) {
  const [internal, setInternal] = React.useState(defaultValue ?? (tabs[0] && tabs[0].value))
  const active = value !== undefined ? value : internal

  const select = v => {
    if (value === undefined) setInternal(v)
    if (onValueChange) onValueChange(v)
  }

  return (
    <div className={`snt-tabs__list ${className}`} style={style} role="tablist">
      {tabs.map(t => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={active === t.value}
          className="snt-tabs__trigger"
          data-active={active === t.value ? 'true' : 'false'}
          onClick={() => select(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
