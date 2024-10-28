import { Routes, Route, Navigate } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout'
import { LoginForm } from '../features/auth/LoginForm'
import { SignupForm } from '../features/auth/SignupForm'
import { StoresPage } from '../pages/StoresPage'
import { ToppingsPage } from '../pages/ToppingsPage'
import { PizzasPage } from '../pages/PizzasPage'
import { StoreSettingsPage } from '../pages/StoreSettingsPage'
import { AcceptInvitePage } from '../pages/AcceptInvitePage'
import { useAuthStore } from '../stores/auth-store'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user)
  
  if (!user) {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/accept-invite" element={<AcceptInvitePage />} />
      <Route element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/stores" />} />
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/stores/:storeId">
          <Route path="toppings" element={<ToppingsPage />} />
          <Route path="pizzas" element={<PizzasPage />} />
          <Route path="settings" element={<StoreSettingsPage />} />
        </Route>
      </Route>
    </Routes>
  )
}