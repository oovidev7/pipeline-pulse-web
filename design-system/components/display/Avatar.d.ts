/** Avatar — image or initials fallback in a gray circle. */
export interface AvatarProps {
  /** Image URL. Falls back to initials when absent. */
  src?: string
  alt?: string
  /** Initials (1–2 chars) shown when no image. */
  fallback?: React.ReactNode
  /** Pixel size. @default 32 */
  size?: number
  className?: string
  style?: React.CSSProperties
}
