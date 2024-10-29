import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/zustand/auth-store'
import { useToast } from '@/hooks/use-toast'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const signUp = useAuthStore((state) => state.signUp)
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signUp(email, password)
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account.",
      })
      navigate('/stores')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error instanceof Error ? error.message : "Please try again",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Get Started Free</h2>
        <p className="text-cool-gray">No credit card required</p>
      </div>
      
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
            placeholder="Choose a password"
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
          {loading ? 'Creating Account...' : 'Create Free Account'}
        </Button>
      </form>
      
      <div className="text-center text-sm text-cool-gray">
        Already have an account?{' '}
        <Link to="/login" className="text-crimson hover:text-burnt-sienna">
          Sign in
        </Link>
      </div>
    </div>
  )
}