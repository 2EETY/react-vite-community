import type { ButtonHTMLAttributes } from 'react'
import { buttonClass, type ButtonSize, type ButtonVariant } from './styles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  type = 'button',
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={buttonClass(variant, size, className)}
    {...rest}
  >
    {loading && (
      <span
        aria-hidden
        className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
      />
    )}
    {children}
  </button>
)
