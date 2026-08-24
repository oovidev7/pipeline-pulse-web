/** Plain bordered card from the v2 profile — hover lifts border to zinc-400. */
export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  /** Slightly darker resting border for anchor cards. @default false */
  emphasis?: boolean
}
