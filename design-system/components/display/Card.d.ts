/**
 * Sentrum card — rounded-xl bordered surface with optional header/footer slots.
 * @startingPoint section="Components" subtitle="Card with header, content & footer" viewport="700x220"
 */
export interface CardProps {
  /** Header title (semibold). */
  title?: React.ReactNode
  /** Muted description under the title. */
  description?: React.ReactNode
  /** Footer row content. */
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}
