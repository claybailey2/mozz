import { supabase } from '../supabase'
import type { Database } from '@/lib/supabase'
import { validateUniqueTopping } from './validators'

export type Topping = Database['public']['Tables']['toppings']['Row']

export async function getToppings(storeId: string) {
  const { data, error } = await supabase
    .from('toppings')
    .select('*')
    .eq('store_id', storeId)
    .order('name')

  if (error) throw error
  return data
}

export async function createTopping(storeId: string, name: string) {
  // Validate before creating
  await validateUniqueTopping(storeId, name)

  const { data, error } = await supabase
    .from('toppings')
    .insert({
      store_id: storeId,
      name
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTopping(id: string, storeId: string, name: string) {
  // Validate before updating
  await validateUniqueTopping(storeId, name, id)

  const { data, error } = await supabase
    .from('toppings')
    .update({ name })
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