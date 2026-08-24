import React from 'react'

/** Form field label — 14px medium. */
export function Label({ children, className = '', ...props }) {
  return (
    <label className={`snt-label ${className}`} {...props}>
      {children}
    </label>
  )
}
