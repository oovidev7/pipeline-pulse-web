import React from 'react'

/** Sentrum multi-line textarea. */
export function Textarea({ className = '', ...props }) {
  return <textarea className={`snt-textarea ${className}`} {...props} />
}
