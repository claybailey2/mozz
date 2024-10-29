import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/auth-store'
import { Button } from '@/components/ui/button'
import { UserCircle, Store } from 'lucide-react'

interface RootLayoutProps {
  showAuthNav?: boolean
  children?: React.ReactNode
}

export function RootLayout({ showAuthNav = false, children }: RootLayoutProps) {
  const { user, signOut } = useAuthStore()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-foreground">
        <div className="container h-24 flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center gap-16">
            <Link to={user ? "/stores" : "/"} className="flex items-center gap-3">
              <img 
                src="/logo_full.png" 
                alt="Mozz Logo" 
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-4xl font-bold font-serif bg-gradient-to-r from-burnt-sienna to-crimson bg-clip-text text-transparent">
                  Mozz
                </h1>
                <p className="text-md text-muted -mt-1">
                  Pizza Manager
                </p>
              </div>
            </Link>

            {/* Navigation Links */}
            {!showAuthNav && user && (
              <NavLink
                to="/stores"
                className={({ isActive }) =>
                  `flex items-center gap-2 text-md font-medium transition-colors hover:text-crimson
                  ${isActive ? 'text-crimson' : 'text-muted-foreground'}`
                }
              >
                <Store className="h-4 w-4" />
                Stores
              </NavLink>
            )}
          </div>

          {/* User/Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <UserCircle className="h-5 w-5" />
                  <span>{user.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="border-burnt-sienna text-burnt-sienna hover:bg-burnt-sienna/10"
                >
                  Sign Out
                </Button>
              </>
            ) : showAuthNav && (
              <>
                <Button asChild variant="outline">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button 
                  asChild
                  className="bg-gradient-to-r from-crimson to-burnt-sienna hover:from-crimson/90 hover:to-burnt-sienna/90"
                >
                  <Link to="/">Sign Up Free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className='container py-8'>
        {children || <Outlet />}
      </main>
    </div>
  )
}