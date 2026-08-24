import React from 'react'

/** Sentrum text input — 36px, subtle border, ring focus. */
export function Input({ className = '', ...props }) {
  return <input className={`snt-input ${className}`} {...props} />
}
