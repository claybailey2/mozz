import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/zustand/auth-store'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { acceptStoreInvitation } from '@/lib/api/store-members'

// Join Store Page for existing users
export function JoinStorePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuthStore()

  const storeId = searchParams.get('store_id')

  useEffect(() => {
    if (!storeId) return
    if (!user) {
      navigate(`/login?redirect=/join-store?store_id=${storeId}`)
      return
    }

    // Auto-accept invitation for logged-in users
    acceptStoreInvitation({ email: user.email!, storeId })
      .then(() => {
        navigate(`/stores/${storeId}/pizzas`)
        toast({
          title: "Welcome aboard! 🎉",
          description: "You've successfully joined the store.",
        })
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error accepting invitation",
          description: error instanceof Error ? error.message : "Please try again",
        })
      })
  }, [user, storeId])

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
    <Card>
      <CardHeader>
        <CardTitle>Joining Store...</CardTitle>
        <CardDescription>
          Please wait while we process your invitation.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

