import { supabase } from '../supabase'
import type { Database } from '@pizza-management/shared'

type StoreMember = Database['public']['Tables']['store_members']['Row']
type StoreMemberWithEmail = StoreMember & {
  user_email: string
}

export async function getStoreMembers(storeId: string) {
  const { data, error } = await supabase
    .from('store_members_with_email')
    .select('*')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as StoreMemberWithEmail[]
}

export interface InviteChefData {

  email: string;

  role: 'chef' | 'owner';

}

export async function inviteChef(storeId: string, email: string, role: 'chef' | 'owner' = 'chef') {
  // Create store member record with email
  const { error: memberError } = await supabase
    .from('store_members')
    .insert({
      store_id: storeId,
      email: email.toLowerCase(), // Store email in lowercase for consistency
      role,
      status: 'invited'
    })

  if (memberError) throw memberError

  // Send invitation email
  const { error: emailError } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: `${window.location.origin}/accept-invite?store_id=${storeId}`,
    }
  )

  // If email fails, we still keep the invitation record
  if (emailError) {
    console.error('Failed to send invitation email:', emailError)
  }
}

export async function signUpAndAcceptInvite({ 
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

  // Update any pending invitations with this email to include the user_id
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

export async function signInAndAcceptInvite({ 
  email, 
  password, 
  storeId 
}: { 
  email: string
  password: string
  storeId: string 
}) {
  // Sign in the user
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (signInError) throw signInError
  if (!signInData.user) throw new Error('Failed to sign in')

  // Update invitation status
  const { error: updateError } = await supabase
    .from('store_members')
    .update({ 
      user_id: signInData.user.id,
      status: 'active' 
    })
    .eq('email', email.toLowerCase())
    .eq('store_id', storeId)
    .eq('status', 'invited')

  if (updateError) throw updateError

  return signInData.user
}

// Function to check if user has pending invitations
export async function getPendingInvitations(email: string) {
  const { data, error } = await supabase
    .from('store_members')
    .select(`
      *,
      store:stores (
        name
      )
    `)
    .eq('email', email.toLowerCase())
    .eq('status', 'invited')

  if (error) throw error
  return data
}

export async function removeStoreMember(storeId: string, email: string) {
  const { error } = await supabase
    .from('store_members')
    .delete()
    .eq('store_id', storeId)
    .eq('email', email.toLowerCase())

  if (error) throw error
}

export async function checkStoreMembership(storeId: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('store_members')
    .select('id')
    .eq('store_id', storeId)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return false
  return true
}

