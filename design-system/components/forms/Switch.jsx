import React from 'react'

/**
 * Toggle switch (controlled or uncontrolled). 32×18px pill; primary fill when on.
 */
export function Switch({ checked, defaultChecked = false, onCheckedChange, disabled, ...props }) {
  const [internal, setInternal] = React.useState(defaultChecked)
  const isControlled = checked !== undefined
  const on = isControlled ? checked : internal

  const toggle = () => {
    if (disabled) return
    if (!isControlled) setInternal(!on)
    if (onCheckedChange) onCheckedChange(!on)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className="snt-switch"
      data-checked={on ? 'true' : 'false'}
      onClick={toggle}
      disabled={disabled}
      style={disabled ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
      {...props}
    >
      <span className="snt-switch__thumb"></span>
    </button>
  )
}
