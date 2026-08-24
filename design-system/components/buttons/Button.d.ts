/**
 * Sentrum button. Primary = near-black stone fill; accent = slate-600 (chat Send CTA).
 * @startingPoint section="Components" subtitle="Buttons in all variants" viewport="700x190"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant. @default 'primary' */
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  /** Size. 'icon' renders a square button for a lone icon. @default 'default' */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children?: React.ReactNode
}
