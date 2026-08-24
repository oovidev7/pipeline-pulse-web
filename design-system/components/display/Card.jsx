import React from 'react'

/**
 * Sentrum card — rounded-xl bordered surface with header/content/footer slots.
 */
export function Card({ title, description, footer, children, className = '', style }) {
  return (
    <div className={`snt-card ${className}`} style={style}>
      {(title || description) && (
        <div className="snt-card__header">
          {title && <div className="snt-card__title">{title}</div>}
          {description && <div className="snt-card__desc">{description}</div>}
        </div>
      )}
      {children && <div className="snt-card__content">{children}</div>}
      {footer && <div className="snt-card__footer">{footer}</div>}
    </div>
  )
}
