import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getPizzas, createPizza, updatePizza, deletePizza } from '@/lib/api/pizzas'
import { useToast } from '@/hooks/use-toast'
import { ValidationError } from '@/lib/api/validators'
import { useAuthStore } from '@/stores/auth-store'

export function usePizzas(storeId: string) {
  return useQuery({
    queryKey: ['pizzas', storeId],
    queryFn: () => getPizzas(storeId),
  })
}

export function useCreatePizza(storeId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const user = useAuthStore(state => state.user)

  return useMutation({
    mutationFn: ({ name, toppingIds }: { name: string; toppingIds: string[] }) => {
      if (!user?.id) throw new Error('User not authenticated')
      return createPizza(storeId, name, toppingIds, user.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzas', storeId] })
      toast({
        title: 'Success',
        description: 'Pizza created successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof ValidationError ? error.message : 'Failed to create pizza',
      })
    },
  })
}

export function useUpdatePizza(storeId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ 
      id, 
      name, 
      toppingIds 
    }: { 
      id: string; 
      name: string; 
      toppingIds: string[] 
    }) => updatePizza(id, storeId, name, toppingIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzas', storeId] })
      toast({
        title: 'Success',
        description: 'Pizza updated successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof ValidationError ? error.message : 'Failed to update pizza',
      })
    },
  })
}

export function useDeletePizza(storeId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deletePizza,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pizzas', storeId] })
      toast({
        title: 'Success',
        description: 'Pizza deleted successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof ValidationError ? error.message : 'Failed to delete pizza',
      })
    },
  })
}