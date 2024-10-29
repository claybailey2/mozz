import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth-store'
import { useToast } from '@/hooks/use-toast'

function LoginCard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const signIn = useAuthStore((state) => state.signIn)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/stores')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error instanceof Error ? error.message : "Please try again",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-none shadow-xl">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-cool-gray/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-cool-gray/20"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-crimson to-burnt-sienna hover:from-crimson/90 hover:to-burnt-sienna/90" 
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-cool-gray">
          Don't have an account?{' '}
          <Link to="/" className="text-crimson hover:text-burnt-sienna">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export function LoginForm() {
  return (
    <div className="relative min-h-[calc(100vh-6rem)]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url("/background.jpg")' }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/80 z-10" />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto pt-16">
        <div className="space-y-12 max-w-lg mx-auto text-center">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold font-serif">
              <span className="bg-gradient-to-r from-crimson to-burnt-sienna bg-clip-text text-transparent">
                I'm Cheesed to See You!
              </span>
            </h1>
            <p className="text-xl text-cool-gray">
              Welcome back to your pizza paradise
            </p>
          </div>
          
          <LoginCard />
        </div>
      </div>
    </div>
  )
}