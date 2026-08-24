import React from 'react'

function tierColor(percentile) {
  if (percentile >= 90) return 'var(--tier-elite)'
  if (percentile >= 75) return 'var(--tier-above-avg)'
  if (percentile >= 50) return 'var(--tier-average)'
  if (percentile >= 25) return 'var(--tier-below-avg)'
  return 'var(--tier-low)'
}

/**
 * PercentileBar — thin tier-colored bar; width = clamped percentile,
 * color = tier (≥90 elite green … <25 red).
 */
export function PercentileBar({ percentile, className, style }) {
  const clamped = Math.max(0, Math.min(100, percentile))
  return (
    <div
      className={className}
      style={{
        height: 4,
        width: '100%',
        overflow: 'hidden',
        borderRadius: 2,
        background: 'var(--zinc-100)',
        ...style,
      }}
    >
      <div
        style={{
          height: '100%',
          borderRadius: 2,
          width: `${clamped}%`,
          background: tierColor(clamped),
        }}
      ></div>
    </div>
  )
}
