// packages/client/api/invitations.ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient, User } from '@supabase/supabase-js'

// CORS configuration
export const allowCors = (fn: (req: VercelRequest, res: VercelResponse) => Promise<VercelResponse>) => async (
  req: VercelRequest,
  res: VercelResponse
) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
    ? 'https://www.mozz.online'
    : 'http://localhost:5179')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Call the actual handler
  return await fn(req, res)
}
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
    const existingUser = data?.users.filter((user: User) => user.email === email.toLowerCase()) || []
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