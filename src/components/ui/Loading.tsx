export function Loading({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center gap-3 py-20 text-ink-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
