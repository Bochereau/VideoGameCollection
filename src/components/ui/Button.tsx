import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const styles: Record<Variant, string> = {
  primary:
    'bg-accent text-bg hover:bg-accent-strong shadow-sm shadow-cyan-500/20',
  secondary:
    'bg-surface-elevated text-ink border border-line hover:border-accent/50 hover:bg-white/5',
  ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-white/5',
  danger: 'bg-danger/40 text-danger border border-danger/60 hover:bg-danger/55',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
