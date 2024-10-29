import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../zustand/auth-store';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserCircle, Store } from 'lucide-react';

interface RootLayoutProps {
  showAuthNav?: boolean;
  children?: React.ReactNode;
}

const Logo = ({ className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
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
  </div>
);

export function RootLayout({ showAuthNav = false, children }: RootLayoutProps) {
  const { user, signOut } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-foreground">
        <div className="container h-24 flex justify-between items-center">
          {/* Logo and Brand - Centered on mobile when signed in, left-aligned when signed out or desktop */}
          <div className={`flex items-center gap-16 ${user ? 'md:w-auto w-full justify-center md:justify-start' : ''}`}>
            <Link to={user ? "/stores" : "/"}>
              <Logo />
            </Link>

            {/* Desktop Navigation Links */}
            {!showAuthNav && user && (
              <NavLink
                to="/stores"
                className={({ isActive }) =>
                  `hidden md:flex items-center gap-2 text-md font-medium transition-colors hover:text-crimson
                  ${isActive ? 'text-crimson' : 'text-muted-foreground'}`
                }
              >
                <Store className="h-4 w-4" />
                Stores
              </NavLink>
            )}
          </div>

          {/* User/Auth Section */}
          {user ? (
            // Mobile menu button and desktop user info
            <div className="md:flex items-center gap-4 hidden">
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
            </div>
          ) : showAuthNav && (
            // Sign in/up buttons for non-authenticated users
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" className="hidden md:inline-flex">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-crimson to-burnt-sienna hover:from-crimson/90 hover:to-burnt-sienna/90"
              >
                <Link to="/">Sign Up Free</Link>
              </Button>
            </div>
          )}

          {/* Mobile Drawer */}
          {user && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="md:hidden w-12 h-12"
                >
                  <UserCircle className="text-background" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-6 mt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserCircle className="h-10 w-10" />
                    <span className='text-lg'>{user.email}</span>
                  </div>
                  {!showAuthNav && (
                    <NavLink
                      to="/stores"
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-2 text-md font-medium transition-colors hover:text-crimson
                        ${isActive ? 'text-crimson' : 'text-muted-foreground'}`
                      }
                    >
                      <Store className="h-4 w-4" />
                      Stores
                    </NavLink>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="border-burnt-sienna text-burnt-sienna hover:bg-burnt-sienna/10"
                  >
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </nav>
      <main className='container py-8'>
        {children || <Outlet />}
      </main>
    </div>
  );
}