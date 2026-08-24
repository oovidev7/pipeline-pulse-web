import React from 'react'

const UserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ width: 16, height: 16 }}
    aria-hidden="true"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

/**
 * User chat message — gray bubble with the avatar inside. Assistant replies
 * render as plain prose with no bubble; only user messages get this container.
 */
export function UserMessage({ children, className = '', style }) {
  return (
    <div className={`snt-user-bubble ${className}`} style={style}>
      <span className="snt-avatar">
        <UserIcon />
      </span>
      <p>{children}</p>
    </div>
  )
}
