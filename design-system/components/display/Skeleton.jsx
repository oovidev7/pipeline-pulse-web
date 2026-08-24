import React from 'react'

/** Loading skeleton — pulsing muted block. Size with style/className. */
export function Skeleton({ className = '', style }) {
  return <div className={`snt-skeleton ${className}`} style={style}></div>
}
