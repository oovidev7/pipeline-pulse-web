/** Toggle switch — 32×18px pill, primary fill when checked. */
export interface SwitchProps {
  /** Controlled checked state. */
  checked?: boolean
  /** Uncontrolled initial state. @default false */
  defaultChecked?: boolean
  /** Called with the next state on toggle. */
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}
