import { supabase } from "../supabase"

export async function inviteToStore(email: string, storeId: string, role: 'chef' | 'owner' = 'chef') {
  const response = await fetch('/api/invitations', {
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