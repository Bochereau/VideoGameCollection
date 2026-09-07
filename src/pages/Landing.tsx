import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function LandingPage() {
  return (
    <>
      <SignedIn>
        <Navigate to="/collection" replace />
      </SignedIn>
      <SignedOut>
        <div className="relative min-h-screen overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <span className="font-display text-xl font-bold tracking-tight text-ink">
              VGC
            </span>
            <SignInButton mode="redirect" forceRedirectUrl="/collection">
              <Button variant="secondary">Connexion</Button>
            </SignInButton>
          </header>

          <main className="relative z-10 mx-auto flex max-w-6xl flex-col px-6 pt-16 pb-24 sm:pt-28">
            <p className="animate-fade-up font-display text-sm font-semibold tracking-[0.2em] text-accent uppercase">
              Video Game Collection
            </p>
            <h1 className="animate-fade-up font-display mt-4 max-w-3xl text-5xl leading-[1.05] font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl">
              VGC
            </h1>
            <p
              className="animate-fade-up mt-5 max-w-xl text-lg text-ink-muted sm:text-xl"
              style={{ animationDelay: '80ms' }}
            >
              Une collection claire, filtrable, à portée de main — consoles, progression
              et liste d&apos;envies, sans le bruit.
            </p>
            <div
              className="animate-fade-up mt-10 flex flex-wrap gap-3"
              style={{ animationDelay: '140ms' }}
            >
              <SignInButton mode="redirect" forceRedirectUrl="/collection">
                <Button className="px-5 py-2.5 text-base">Commencer</Button>
              </SignInButton>
              <Link to="/sign-up">
                <Button variant="secondary" className="px-5 py-2.5 text-base">
                  Créer un compte
                </Button>
              </Link>
            </div>

            <div
              className="animate-fade-up relative mt-20 overflow-hidden rounded-3xl border border-line bg-white/70 shadow-xl shadow-slate-900/5"
              style={{ animationDelay: '200ms' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50/80 via-transparent to-sky-50/60" />
              <div className="relative grid gap-px bg-line sm:grid-cols-3">
                {[
                  { label: 'Collection', value: 'Filtrez par console & statut' },
                  { label: 'Envies', value: 'Gardez ce que vous visez' },
                  { label: 'Compte', value: 'Sécurisé avec Clerk' },
                ].map((item) => (
                  <div key={item.label} className="bg-white/90 p-6 sm:p-8">
                    <p className="font-display text-sm font-semibold text-accent">
                      {item.label}
                    </p>
                    <p className="mt-2 text-ink-muted">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </SignedOut>
    </>
  )
}
