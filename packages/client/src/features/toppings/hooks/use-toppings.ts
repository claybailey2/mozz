import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getToppings, createTopping, updateTopping, deleteTopping } from '@/lib/api/toppings'
import { useToast } from '@/hooks/use-toast'

export function useToppings(storeId: string) {
  return useQuery({
    queryKey: ['toppings', storeId],
    queryFn: () => getToppings(storeId),
  })
}

export function useCreateTopping(storeId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (name: string) => 
      createTopping({ name, store_id: storeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toppings', storeId] })
      toast({
        title: 'Success',
        description: 'Topping created successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create topping',
      })
    },
  })
}

export function useUpdateTopping(storeId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      updateTopping(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toppings', storeId] })
      toast({
        title: 'Success',
        description: 'Topping updated successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update topping',
      })
    },
  })
}

export function useDeleteTopping(storeId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deleteTopping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toppings', storeId] })
      toast({
        title: 'Success',
        description: 'Topping deleted successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete topping',
      })
    },
  })
}