import React from 'react'

/**
 * StatCard — plain bordered card primitive from the v2 player profile.
 * No decorative chrome; hover lifts the border color.
 */
export function StatCard({ children, emphasis = false, className, style, ...rest }) {
  const [hover, setHover] = React.useState(false)
  const border = hover
    ? 'var(--zinc-400)'
    : emphasis
      ? 'var(--zinc-300)'
      : 'var(--zinc-200)'
  return (
    <div
      className={className}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 8,
        border: `1px solid ${border}`,
        background: '#fff',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
