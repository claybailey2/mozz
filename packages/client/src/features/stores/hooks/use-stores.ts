import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getStores, createStore, updateStore, deleteStore } from '@/lib/api/stores'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/stores/auth-store'

export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: getStores,
  })
}

export function useCreateStore() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const user = useAuthStore(state => state.user)

  return useMutation({
    mutationFn: (name: string) => createStore({ name, owner_id: user!.id }),
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