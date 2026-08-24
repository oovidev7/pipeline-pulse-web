import React from 'react'

/**
 * Eyebrow — mono, uppercase, heavy-tracked section label with an optional
 * emerald dot. Marks every section of the v2 player profile.
 */
export function Eyebrow({ children, dot = true, size = 'default', className, style }) {
  const sm = size === 'sm'
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        textTransform: 'uppercase',
        color: 'var(--zinc-500)',
        fontSize: sm ? 9 : 10,
        letterSpacing: sm ? '0.18em' : '0.22em',
        lineHeight: 1.4,
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            display: 'inline-block',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'var(--emerald-500)',
            flexShrink: 0,
          }}
        ></span>
      )}
      <span>{children}</span>
    </div>
  )
}
