import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { CollectionPage } from '@/pages/Collection'
import { LandingPage } from '@/pages/Landing'
import { SignInPage } from '@/pages/SignIn'
import { SignUpPage } from '@/pages/SignUp'
import { WishlistPage } from '@/pages/Wishlist'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
