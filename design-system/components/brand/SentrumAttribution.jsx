import React from 'react'
import { Logo } from './Logo'

/**
 * "Powered by Sentrum" attribution row — sits at the bottom of tenant-branded
 * chrome at reduced opacity so it never competes with the tenant's own brand.
 */
export function SentrumAttribution({ className, style }) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '4px 16px 12px',
        opacity: 0.5,
        transition: 'opacity 0.2s ease',
        ...style,
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--slate-500)',
        }}
      >
        powered by
      </span>
      <Logo variant="icon" size="xs" />
      <Logo variant="wordmark" size="xs" />
    </div>
  )
}
