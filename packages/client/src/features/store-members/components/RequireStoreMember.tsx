import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCheckStoreMembership } from '@/features/store-members/hooks/use-store-members'
import { useToast } from '@/hooks/use-toast'

interface RequireStoreMemberProps {
  children: React.ReactNode
}

export function RequireStoreMember({ children }: RequireStoreMemberProps) {
  const { storeId } = useParams<{ storeId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: isMember, isLoading } = useCheckStoreMembership(storeId)

  useEffect(() => {
    if (!isLoading && !isMember) {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You are not a member of this store.',
      })
      navigate('/stores')
    }
  }, [isMember, isLoading, navigate, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Checking access...</p>
      </div>
    )
  }

  if (!isMember) {
    return null
  }

  return <>{children}</>
}