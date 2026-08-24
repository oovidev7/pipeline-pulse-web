import React from 'react'

const CornerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m15 10 5 5-5 5"></path>
    <path d="M4 4v7a4 4 0 0 0 4 4h12"></path>
  </svg>
)

/**
 * "Keep exploring" follow-up suggestion chips, shown under assistant replies.
 */
export function FollowUpChips({ suggestions, onSelect, label = 'Keep exploring', className = '', style }) {
  if (!suggestions || suggestions.length === 0) return null
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        borderTop: '1px solid var(--surface-inset)',
        paddingTop: 16,
        ...style,
      }}
    >
      {label && <span className="snt-microlabel" style={{ color: 'var(--text-faint)' }}>{label}</span>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {suggestions.map((s, i) => (
          <button
            key={i}
            type="button"
            className="snt-chip"
            onClick={onSelect ? () => onSelect(s.query || s.label) : undefined}
          >
            <CornerIcon />
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
