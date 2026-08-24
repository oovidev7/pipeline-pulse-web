import React from 'react'

/** Compact status badge. */
export function Badge({ variant = 'default', children, className = '', ...props }) {
  return (
    <span className={`snt-badge snt-badge--${variant} ${className}`} {...props}>
      {children}
    </span>
  )
}
