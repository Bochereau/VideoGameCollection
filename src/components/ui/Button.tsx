import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const styles: Record<Variant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-strong shadow-sm shadow-teal-900/10',
  secondary:
    'bg-white text-ink border border-line hover:border-slate-300 hover:bg-slate-50',
  ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-white/70',
  danger: 'bg-red-50 text-danger hover:bg-red-100',
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
