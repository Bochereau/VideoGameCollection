import type { ColorTheme } from '@/types/theme'

type Props = {
  value: ColorTheme
  onChange: (value: ColorTheme) => void
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M12 2.5v2.25M12 19.25V21.5M21.5 12h-2.25M4.75 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19.5 13.2A7.5 7.5 0 0 1 10.8 4.5 6.5 6.5 0 1 0 19.5 13.2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ThemeToggle({ value, onChange }: Props) {
  return (
    <div className="flex w-full shrink-0 items-center" role="group" aria-label="Thème">
      <div className="flex w-full gap-1 rounded-xl border border-line bg-bg/50 p-1">
        <button
          type="button"
          onClick={() => onChange('light')}
          aria-pressed={value === 'light'}
          aria-label="Thème clair"
          title="Clair"
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition ${
            value === 'light'
              ? 'bg-accent text-bg shadow-sm'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <SunIcon />
          Clair
        </button>
        <button
          type="button"
          onClick={() => onChange('dark')}
          aria-pressed={value === 'dark'}
          aria-label="Thème nuit"
          title="Nuit"
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition ${
            value === 'dark'
              ? 'bg-accent text-bg shadow-sm'
              : 'text-ink-muted hover:text-ink'
          }`}
        >
          <MoonIcon />
          Nuit
        </button>
      </div>
    </div>
  )
}
