import React from 'react'

const SendIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
    <path d="m21.854 2.147-10.94 10.939"></path>
  </svg>
)

/**
 * Chat composer — the rounded-2xl elevated input card with the slate Send CTA.
 * Submits on Enter (Shift+Enter for newline).
 */
export function Composer({
  placeholder = 'Ask anything about your football data…',
  onSend,
  autoFocus = false,
  className = '',
  style,
}) {
  const [value, setValue] = React.useState('')
  const ref = React.useRef(null)

  React.useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = Math.min(ref.current.scrollHeight, 200) + 'px'
    }
  }, [value])

  const submit = () => {
    if (!value.trim()) return
    if (onSend) onSend(value.trim())
    setValue('')
  }

  const onKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className={`snt-composer ${className}`} style={style}>
      <textarea
        ref={ref}
        rows={2}
        value={value}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={e => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      ></textarea>
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="snt-btn snt-btn--accent"
          disabled={!value.trim()}
          onClick={submit}
        >
          <SendIcon />
          Send
        </button>
      </div>
    </div>
  )
}
