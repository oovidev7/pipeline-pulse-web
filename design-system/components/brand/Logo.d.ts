/**
 * Sentrum logo: "S" mark + lowercase "sentrum" wordmark in Outfit medium.
 * @startingPoint section="Brand" subtitle="Sentrum logo lockup" viewport="700x150"
 */
export interface LogoProps {
  /** Which lockup to render. @default 'full' */
  variant?: 'full' | 'icon' | 'wordmark'
  /** Logo size. @default 'md' */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** 'light' renders slate-900 ink, 'dark' renders white. @default 'light' */
  theme?: 'light' | 'dark'
  className?: string
  style?: React.CSSProperties
}
