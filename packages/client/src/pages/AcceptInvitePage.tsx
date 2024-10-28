import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { useSignUpAndAcceptInvite, useSignInAndAcceptInvite } from '../features/store-members/hooks/use-store-members'

export function AcceptInvitePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignIn, setIsSignIn] = useState(false)
  const user = useAuthStore((state) => state.user)
  const storeId = searchParams.get('store_id')

  const signUpAndAccept = useSignUpAndAcceptInvite()
  const signInAndAccept = useSignInAndAcceptInvite()

  useEffect(() => {
    // If user is already logged in, try to accept any pending invitations
    if (user?.email && storeId) {
      signInAndAccept.mutate({ 
        email: user.email, 
        password: '', // Not needed since we're already logged in
        storeId 
      })
    }
  }, [user, storeId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!storeId) return

    try {
      if (!isSignIn) {
        await signUpAndAccept.mutateAsync({ email, password, storeId })
      } else {
        await signInAndAccept.mutateAsync({ email, password, storeId })
      }
      
      navigate(`/stores/${storeId}/pizzas`)
    } catch (error: any) {
      if (error?.status === 409) {
        setIsSignIn(true)
      }
    }
  }

  if (!storeId) {
    return (
      <div className="container max-w-md mx-auto mt-20">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>
              Invalid invitation link. Please contact the store owner.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const isLoading = 
    signUpAndAccept.isPending || 
    signInAndAccept.isPending;

  return (
    <div className="container max-w-md mx-auto mt-20">
      <Card>
        <CardHeader>
          <CardTitle>{isSignIn ? 'Sign In' : 'Create Account'}</CardTitle>
          <CardDescription>
            {isSignIn 
              ? 'Sign in to accept the invitation' 
              : 'Create an account to accept the invitation'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? 'Processing...' 
                  : isSignIn 
                    ? 'Sign In' 
                    : 'Create Account'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsSignIn(!isSignIn)}
                disabled={isLoading}
              >
                {isSignIn 
                  ? 'Create New Account Instead' 
                  : 'Sign In Instead'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}