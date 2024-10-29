import { Routes, Route, Navigate } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout'
import { LoginForm } from '../pages/LoginPage'
import { HomePage } from '../pages/HomePage'
import { StoresPage } from '../pages/StoresPage'
import { StoreDashboardPage } from '../pages/StoreDashboardPage'
import { ToppingsPage } from '../pages/ToppingsPage'
import { PizzasPage } from '../pages/PizzasPage'
import { StoreSettingsPage } from '../pages/StoreSettingsPage'
import { AcceptInvitePage } from '../pages/AcceptInvitePage'
import { RequireStoreMember } from '../features/store-members/components/RequireStoreMember'
import { RequireStoreOwner } from '../features/stores/components/RequireStoreOwner'
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
      {/* Public routes with auth nav */}
      <Route element={<RootLayout showAuthNav={true} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
      </Route>
      
      {/* Protected routes */}
      <Route element={
        <ProtectedRoute>
          <RootLayout showAuthNav={false} />
        </ProtectedRoute>
      }>
        <Route path="/stores" element={<StoresPage />} />
        <Route path="/stores/:storeId" element={
          <RequireStoreMember>
            <StoreDashboardPage />
          </RequireStoreMember>
        } />
        <Route path="/stores/:storeId/pizzas" element={
          <RequireStoreMember>
            <PizzasPage />
          </RequireStoreMember>
        } />
        <Route path="/stores/:storeId/toppings" element={
          <RequireStoreMember>
            <RequireStoreOwner>
              <ToppingsPage />
            </RequireStoreOwner>
          </RequireStoreMember>
        } />
        <Route path="/stores/:storeId/settings" element={
          <RequireStoreMember>
            <RequireStoreOwner>
              <StoreSettingsPage />
            </RequireStoreOwner>
          </RequireStoreMember>
        } />
      </Route>
      
      <Route path="/accept-invite" element={<AcceptInvitePage />} />
    </Routes>
  )
}