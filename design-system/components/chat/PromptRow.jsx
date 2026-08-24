import React from 'react'

const SparklesIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
    <path d="M20 3v4"></path>
    <path d="M22 5h-4"></path>
  </svg>
)

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14"></path>
    <path d="m12 5 7 7-7 7"></path>
  </svg>
)

/**
 * Recommended-prompt row from the chat welcome screen ("For you, this week").
 * Sparkles icon chip, uppercase category, prompt text, "Edit & ask" CTA.
 */
export function PromptRow({ category, text, onClick, className = '', style }) {
  return (
    <button
      type="button"
      className={`snt-prompt-row ${className}`}
      style={style}
      onClick={onClick ? () => onClick(text) : undefined}
      aria-label={`Edit and ask: ${text}`}
    >
      <span className="snt-prompt-row__icon">
        <SparklesIcon />
      </span>
      <span style={{ minWidth: 0, flex: 1 }}>
        {category && <span className="snt-microlabel" style={{ display: 'block' }}>{category}</span>}
        <span
          style={{
            display: 'block',
            marginTop: 4,
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--leading-snug)',
            color: 'var(--text-body)',
          }}
        >
          {text}
        </span>
      </span>
      <span className="snt-prompt-row__cta">
        Edit &amp; ask
        <ArrowRightIcon />
      </span>
    </button>
  )
}
