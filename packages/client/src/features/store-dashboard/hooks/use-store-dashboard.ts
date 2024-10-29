import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useStoreDashboard(storeId: string) {
  const members = useQuery({
    queryKey: ['store-members', storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_members')
        .select('*')
        .eq('store_id', storeId)
        .order('role', { ascending: false }) // owners first
      if (error) throw error
      return data
    }
  })

  const toppings = useQuery({
    queryKey: ['toppings', storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('toppings')
        .select('*')
        .eq('store_id', storeId)
        .order('name')
      if (error) throw error
      return data
    }
  })

  return { members, toppings }
}