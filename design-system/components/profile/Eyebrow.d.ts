/** Mono uppercase section label with optional emerald dot (v2 profile style). */
export interface EyebrowProps {
  children?: React.ReactNode
  /** Show the emerald dot before the label. @default true */
  dot?: boolean
  /** 'default' = 10px/0.22em, 'sm' = 9px/0.18em. @default 'default' */
  size?: 'default' | 'sm'
  className?: string
  style?: React.CSSProperties
}
