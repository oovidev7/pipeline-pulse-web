import React from 'react'

// Coordinates in 220 × 130 viewBox, attacking-right convention.
const POSITION_COORDS = {
  GK: { x: 14, y: 65 },
  LB: { x: 38, y: 28 },
  CB: { x: 38, y: 65 },
  RB: { x: 38, y: 102 },
  LM: { x: 75, y: 28 },
  CM: { x: 75, y: 65 },
  RM: { x: 75, y: 102 },
  AM: { x: 110, y: 65 },
  LW: { x: 152, y: 22 },
  ST: { x: 175, y: 65 },
  RW: { x: 152, y: 108 },
}

function dotRadius(percentage) {
  const pct = Math.max(0, Math.min(100, percentage == null ? 33 : percentage))
  return 4 + Math.sqrt(pct / 100) * 12
}

/**
 * Pitch — compact position visualisation from the player profile hero.
 * Navy striped field, white hairline markings, emerald dots sized by
 * share of minutes; the primary position gets a halo + direction arrow.
 */
export function Pitch({
  width = 220,
  primary,
  dots = [],
  attacking = 'right',
  rounded = 4,
  className,
  ariaLabel,
}) {
  const height = Math.round((width * 130) / 220)
  const mirrorX = x => (attacking === 'right' ? x : 220 - x)
  const glowId = `pitch-glow-${primary || 'none'}-${attacking}`

  const primaryCoords = primary ? POSITION_COORDS[primary] : null
  const primaryDot = primary ? dots.find(d => d.position === primary) : null

  return (
    <svg
      viewBox="0 0 220 130"
      width={width}
      height={height}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={className}
      style={{ borderRadius: rounded, display: 'block' }}
    >
      <defs>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.6"></stop>
          <stop offset="100%" stopColor="#10b981" stopOpacity="0"></stop>
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="220" height="130" fill="#1e3a5f"></rect>
      <g opacity="0.06">
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={i * 22} y={0} width={11} height={130} fill="white"></rect>
        ))}
      </g>

      <g stroke="rgba(255,255,255,0.78)" strokeWidth="1" fill="none">
        <rect x="0.5" y="0.5" width="219" height="129"></rect>
        <line x1="110" y1="0" x2="110" y2="130"></line>
        <circle cx="110" cy="65" r="14"></circle>
        <circle cx="110" cy="65" r="0.9" fill="rgba(255,255,255,0.78)"></circle>
        <rect x="0" y="26" width="34" height="78"></rect>
        <rect x="0" y="47" width="12" height="36"></rect>
        <rect x="186" y="26" width="34" height="78"></rect>
        <rect x="208" y="47" width="12" height="36"></rect>
      </g>

      {primaryCoords && (
        <circle
          cx={mirrorX(primaryCoords.x)}
          cy={primaryCoords.y}
          r={dotRadius(primaryDot ? primaryDot.percentage : undefined) + 10}
          fill={`url(#${glowId})`}
        ></circle>
      )}

      {dots.map(dot => {
        const coords = POSITION_COORDS[dot.position]
        if (!coords) return null
        const isPrimary = dot.position === primary
        return (
          <circle
            key={`dot-${dot.position}`}
            cx={mirrorX(coords.x)}
            cy={coords.y}
            r={dotRadius(dot.percentage)}
            fill="#10b981"
            stroke={isPrimary ? 'white' : 'rgba(255,255,255,0.55)'}
            strokeWidth={isPrimary ? 1.6 : 0.9}
          ></circle>
        )
      })}

      {primaryCoords &&
        (() => {
          const r = dotRadius(primaryDot ? primaryDot.percentage : undefined)
          const x = mirrorX(primaryCoords.x)
          const y = primaryCoords.y
          const dir = attacking === 'right' ? 1 : -1
          const stemStart = x + dir * (r + 3)
          const stemEnd = stemStart + dir * 13
          const headBack = stemEnd - dir * 3
          return (
            <g stroke="rgba(255,255,255,0.7)" strokeWidth="1" fill="none" strokeLinecap="round">
              <line x1={stemStart} y1={y} x2={stemEnd} y2={y}></line>
              <path d={`M ${headBack} ${y - 3} L ${stemEnd} ${y} L ${headBack} ${y + 3}`}></path>
            </g>
          )
        })()}
    </svg>
  )
}
