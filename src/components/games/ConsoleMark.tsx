import { useState } from 'react'

type Props = {
  name: string
  logo?: string | null
  className?: string
  logoClassName?: string
}

export function ConsoleMark({
  name,
  logo,
  className = '',
  logoClassName = 'h-3.5 max-w-8',
}: Props) {
  const [failedLogo, setFailedLogo] = useState<string | null>(null)
  const showLogo = Boolean(logo) && failedLogo !== logo

  return (
    <span className={`inline-flex max-w-full min-w-0 items-center gap-1.5 ${className}`}>
      {showLogo ? (
        <span className="inline-flex shrink-0 items-center rounded bg-white px-0.5">
          <img
            src={logo ?? undefined}
            alt=""
            className={`w-auto object-contain ${logoClassName}`}
            onError={() => setFailedLogo(logo ?? null)}
          />
        </span>
      ) : null}
      <span className="truncate">{name}</span>
    </span>
  )
}
