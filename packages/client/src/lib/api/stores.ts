import { supabase } from '../supabase'
import type { Database } from '@pizza-management/shared'

type Store = Database['public']['Tables']['stores']['Row']
type StoreInsert = Database['public']['Tables']['stores']['Insert']

export async function getStores() {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createStore(store: StoreInsert) {
  const { data, error } = await supabase
    .from('stores')
    .insert(store)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateStore(id: string, updates: Partial<Store>) {
  const { data, error } = await supabase
    .from('stores')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteStore(id: string) {
  const { error } = await supabase
    .from('stores')
    .delete()
    .eq('id', id)

  if (error) throw error
}