import React from 'react'

/** Avatar — image or initials fallback in a gray circle. */
export function Avatar({ src, alt = '', fallback, size = 32, className = '', style }) {
  return (
    <span
      className={`snt-avatar ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      {src ? <img src={src} alt={alt} /> : <span>{fallback}</span>}
    </span>
  )
}
