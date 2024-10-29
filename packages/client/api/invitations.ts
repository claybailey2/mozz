// packages/client/api/invitations.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { allowCors } from './util/cors'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, storeId, inviterId, role = 'chef' } = req.body
    
    // Verify the inviter has permission
    const { data: membership, error: membershipError } = await supabase
      .from('store_members')
      .select('role')
      .eq('store_id', storeId)
      .eq('user_id', inviterId)
      .single()

    if (membershipError || !membership) {
      return res.status(403).json({ error: 'Not authorized to invite to this store' })
    }

    // Check if user exists in auth.users
    const { data } = await supabase.auth.admin.listUsers();
    console.log( data )
    const existingUser = data?.users.filter(user => user.email === email.toLowerCase()) || []
    const isExistingUser = existingUser.length > 0

    // Create store member record
    const { error: memberError } = await supabase
      .from('store_members')
      .insert({
        store_id: storeId,
        email: email.toLowerCase(),
        role,
        status: 'invited'
      })

    if (memberError) throw memberError

    // Send magic link for existing users, signup link for new users
    const redirectPath = isExistingUser ? 'join-store' : 'signup'
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase(),
      options: {
        emailRedirectTo: `${process.env.VERCEL_URL}/${redirectPath}?store_id=${storeId}`,
        data: {
          store_id: storeId,
          invitation_type: isExistingUser ? 'store' : 'signup'
        }
      }
    })

    if (otpError) throw otpError

    return res.status(200).json({ success: true, isExistingUser })
  } catch (error) {
    console.error('Invitation error:', error)
    return res.status(500).json({ error: 'Failed to send invitation' })
  }
}

// Export the handler wrapped with CORS
export default allowCors(handler)