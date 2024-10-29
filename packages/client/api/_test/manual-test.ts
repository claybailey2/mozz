// packages/client/api/_test/manual-test.ts
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.development') })

async function testInvitation() {
  try {
    const response = await fetch('http://localhost:3000/api/invitations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        storeId: 'test-store-id',
        inviterId: 'test-user-id',
        role: 'chef'
      })
    })

    const data = await response.json()
    console.log('Response:', data)
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testInvitation()