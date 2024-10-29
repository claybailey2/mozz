import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { useIsStoreOwner } from '../hooks/use-stores'

interface RequireStoreOwnerProps {
  children: React.ReactNode
  storeId?: string
}

export function RequireStoreOwner({ children, storeId: storeIdFromProps }: RequireStoreOwnerProps) {
  const { storeId } = useParams<{ storeId: string }>()
  // get storeId from props if not available in params
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: isOwner, isLoading } = useIsStoreOwner(storeId ?? storeIdFromProps)

  useEffect(() => {
    if (!storeId) return
    if (!isLoading && !isOwner) {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'Only store owners can access this section.',
      })
      navigate(`/stores/${storeId ?? ''}`)
    }
  }, [isOwner, isLoading, navigate, storeId, toast])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Checking access...</p>
      </div>
    )
  }

  if (!isOwner) {
    return null
  }

  return <>{children}</>
}