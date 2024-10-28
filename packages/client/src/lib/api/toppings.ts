import { supabase } from '../supabase'
import type { Database } from '@pizza-management/shared'

export type Topping = Database['public']['Tables']['toppings']['Row']
type ToppingInsert = Database['public']['Tables']['toppings']['Insert']

export async function getToppings(storeId: string) {
  const { data, error } = await supabase
    .from('toppings')
    .select('*')
    .eq('store_id', storeId)
    .order('name')

  if (error) throw error
  return data
}

export async function createTopping(topping: ToppingInsert) {
  const { data, error } = await supabase
    .from('toppings')
    .insert(topping)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTopping(id: string, updates: Partial<Topping>) {
  const { data, error } = await supabase
    .from('toppings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTopping(id: string) {
  const { error } = await supabase
    .from('toppings')
    .delete()
    .eq('id', id)

  if (error) throw error
}