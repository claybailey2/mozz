import { supabase } from '../supabase'
import type { Database } from '@pizza-management/shared'

type StoreMember = Database['public']['Tables']['store_members']['Row']

export async function checkEmailRegistered(email: string): Promise<boolean> {
  try {
    // Try to select the email from registered_emails
    const { error } = await supabase
      .from('registered_emails')
      .select('email')
      .eq('email', email.toLowerCase())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {  // not_found error
        return false
      }
      throw error
    }

    return true
  } catch (error) {
    console.error('Error checking email registration:', error)
    throw error
  }
}

export async function getStoreMembers(storeId: string) {
  const { data, error } = await supabase
    .from('store_members')
    .select('*')
    .eq('store_id', storeId)
    .order('role', { ascending: false })
    .order('email', { ascending: true })

  if (error) throw error
  return data as StoreMember[]
}

export interface InviteChefData {
  email: string;
  role: 'chef' | 'owner';
}

// Update the accept invitation logic to handle both new and existing users
export async function acceptStoreInvitation({ 
  email, 
  storeId 
}: { 
  email: string
  storeId: string 
}) {
  // Update invitation status
  const { error: updateError } = await supabase
    .from('store_members')
    .update({ 
      status: 'active',
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
    .eq('email', email.toLowerCase())
    .eq('store_id', storeId)
    .eq('status', 'invited')

  if (updateError) throw updateError
}
export interface InviteChefData {
  email: string;
  role: 'chef' | 'owner';
}

export async function signUpFromInvitation({ 
  email, 
  password, 
  storeId 
}: { 
  email: string
  password: string
  storeId: string 
}) {
  // Sign up the user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signUpError) throw signUpError
  if (!signUpData.user) throw new Error('Failed to create account')

  // Update store member with new user_id
  const { error: updateError } = await supabase
    .from('store_members')
    .update({ 
      user_id: signUpData.user.id,
      status: 'active'
    })
    .eq('email', email.toLowerCase())
    .eq('store_id', storeId)
    .eq('status', 'invited')

  if (updateError) throw updateError

  return signUpData.user
}

export async function removeStoreMember(storeId: string, email: string) {
  const { error } = await supabase
    .from('store_members')
    .delete()
    .eq('store_id', storeId)
    .eq('email', email)

  if (error) throw error
}

export async function checkStoreMembership(storeId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('store_members')
    .select('id')
    .eq('store_id', storeId)
    .eq('email', user.email)
    .single()

  if (error || !data) return false
  return true
}