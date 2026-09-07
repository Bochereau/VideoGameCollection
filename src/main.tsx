import { ClerkProvider } from '@clerk/clerk-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const root = document.getElementById('root')!

if (!publishableKey) {
  createRoot(root).render(
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 520,
        margin: '4rem auto',
        padding: '0 1.5rem',
        lineHeight: 1.5,
      }}
    >
      <h1 style={{ fontSize: '1.5rem' }}>Configuration requise</h1>
      <p>
        Ajoutez <code>VITE_CLERK_PUBLISHABLE_KEY</code> dans un fichier{' '}
        <code>.env</code> (voir <code>.env.example</code>), puis relancez{' '}
        <code>npm run dev</code>.
      </p>
    </div>,
  )
} else {
  createRoot(root).render(
    <StrictMode>
      <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </StrictMode>,
  )
}
