import { supabase } from "../supabase"

const apiUrl = import.meta.env.DEV 
  ? 'http://localhost:3000/api/invitations'
  : '/api/invitations'
  
export async function inviteToStore(storeId: string, email: string, role: 'chef' | 'owner' = 'chef') {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      storeId,
      inviterId: (await supabase.auth.getUser()).data.user?.id,
      role,
    })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to send invitation')
  }

  return response.json()
}