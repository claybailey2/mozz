import { supabase } from '../supabase'
import type { Database } from '@pizza-management/shared'

type Store = Database['public']['Tables']['stores']['Row']

export async function getStores() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  console.log('Fetching stores for user:', user.id)

  const { data: stores, error } = await supabase
    .from('stores')
    .select(`
      *,
      store_members!inner (
        role,
        user_id
      )
    `)
    .eq('store_members.user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error

  return stores.map(store => ({
    ...store,
    userRole: store.store_members[0].role
  }))
}

export async function getStore(id: string) {
  const { data, error } = await supabase
    .from('stores')
    .select(`
      *,
      store_members!inner (
        role
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createStore(name: string, creatorEmail: string) {
  // Start a Supabase transaction using stored procedures
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // First create the store
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .insert({ name })
    .select()
    .single()

  if (storeError) throw storeError

  // Then create the owner membership
  const { error: memberError } = await supabase
    .from('store_members')
    .insert({
      store_id: store.id,
      user_id: user.id,
      email: creatorEmail.toLowerCase(),
      role: 'owner',
      status: 'active'
    })

  if (memberError) {
    // If member creation fails, we should delete the store
    await supabase.from('stores').delete().eq('id', store.id)
    throw memberError
  }

  return store
}

export async function updateStore(id: string, updates: Partial<Store>) {
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (storeError) throw storeError
  return store
}

export async function deleteStore(id: string) {
  const { error } = await supabase
    .from('stores')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function isStoreOwner(storeId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('store_members')
    .select('role')
    .eq('store_id', storeId)
    .eq('user_id', user.id)
    .eq('role', 'owner')
    .single()

  if (error) return false
  return !!data
}