import React from 'react'

/**
 * Sentrum button — shadcn-derived. Primary is near-black stone; `accent` is the
 * slate-600 used for the chat Send CTA.
 */
export function Button({
  variant = 'primary',
  size = 'default',
  children,
  className = '',
  ...props
}) {
  const cls = [
    'snt-btn',
    `snt-btn--${variant}`,
    size !== 'default' ? `snt-btn--${size}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <button type="button" className={cls} {...props}>
      {children}
    </button>
  )
}
