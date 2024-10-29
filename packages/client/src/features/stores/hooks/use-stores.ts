import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  getStores, createStore, updateStore, deleteStore, 
  isStoreOwner, getStore 
} from '@/lib/api/stores'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/stores/auth-store'

export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: getStores,
  })
}

export function useStore(storeId: string) {
  return useQuery({
    queryKey: ['stores', storeId],
    queryFn: () => getStore(storeId),
  })
}

export function useIsStoreOwner(storeId: string | undefined) {
  return useQuery({
    queryKey: ['store-owner', storeId],
    queryFn: () => storeId ? isStoreOwner(storeId) : false,
  })
}

export function useCreateStore() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const user = useAuthStore(state => state.user)

  return useMutation({
    mutationFn: (name: string) => {
      if (!user?.email) throw new Error('User email not found')
      return createStore(name, user.email)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
      toast({
        title: 'Success',
        description: 'Store created successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create store',
      })
    },
  })
}

export function useUpdateStore() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      updateStore(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
      toast({
        title: 'Success',
        description: 'Store updated successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update store',
      })
    },
  })
}

export function useDeleteStore() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] })
      toast({
        title: 'Success',
        description: 'Store deleted successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete store',
      })
    },
  })
}