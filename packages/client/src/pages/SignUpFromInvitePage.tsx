import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { signUpFromInvitation } from "@/lib/api/store-members"
import { Label } from "@radix-ui/react-label"
import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

// Signup Page for new users with store invitation
export function SignupFromInvitePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    password: '',
    confirmPassword: ''
  })

  const storeId = searchParams.get('store_id')
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!storeId) return
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
      })
      return
    }

    setLoading(true)
    try {
      await signUpFromInvitation({
        email: formData.email,
        password: formData.password,
        storeId
      })
      navigate(`/stores/${storeId}/pizzas`)
      toast({
        title: "Welcome to Mozz! 🍕",
        description: "Your account has been created and you've joined the store.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error instanceof Error ? error.message : "Please try again",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!storeId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Invalid Invitation</CardTitle>
          <CardDescription>
            This invitation link appears to be invalid. Please contact the store owner.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-gradient-primary">Welcome to Mozz!</CardTitle>
        <CardDescription>
          Create your account to join the store and start crafting amazing pizzas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              readOnly={!!searchParams.get('email')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover-gradient"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-cool-gray">
          Already have an account?{' '}
          <Button 
            variant="link" 
            className="text-crimson hover:text-burnt-sienna p-0"
            onClick={() => navigate(`/join-store?store_id=${storeId}`)}
          >
            Sign in instead
          </Button>
        </p>
      </CardFooter>
    </Card>
  )
}