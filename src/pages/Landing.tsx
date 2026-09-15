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
          <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <span className="font-display text-2xl tracking-wide text-amber">
              VGC
            </span>
            <SignInButton mode="redirect" forceRedirectUrl="/collection">
              <Button variant="secondary">Connexion</Button>
            </SignInButton>
          </header>

          <main className="relative z-10 mx-auto flex max-w-6xl flex-col px-6 pt-16 pb-24 sm:pt-28">
            <p className="animate-fade-up font-display text-sm tracking-[0.2em] text-accent uppercase">
              Video Game Collection
            </p>
            <h1 className="animate-fade-up font-display mt-4 max-w-3xl text-6xl leading-[1.05] tracking-wide text-ink sm:text-7xl lg:text-8xl">
              VGC
            </h1>
            <p
              className="animate-fade-up mt-5 max-w-xl text-lg text-ink-muted sm:text-xl"
              style={{ animationDelay: '80ms' }}
            >
              Gérez votre collection de jeux vidéo en quelques clics seulement. C'est facile, intuitif et rapide.
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
          </main>
        </div>
      </SignedOut>
    </>
  )
}
