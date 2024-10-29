// packages/client/api/_test/invitations.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import handler from '../invitations'

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { role: 'owner' },
            error: null
          }))
        }))
      })),
      insert: vi.fn(() => ({
        error: null
      }))
    })),
    auth: {
      admin: {
        listUsers: vi.fn(() => ({
          data: { users: [] },
          error: null
        }))
      },
      signInWithOtp: vi.fn(() => ({
        error: null
      }))
    }
  }))
}))

describe('Invitation API', () => {
  let req: any
  let res: any

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {
        email: 'test@example.com',
        storeId: 'store-123',
        inviterId: 'user-123',
        role: 'chef'
      }
    }
    res = {
      status: vi.fn(() => res),
      json: vi.fn()
    }
  })

  it('should handle new user invitations', async () => {
    await handler(req, res)
    
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      isExistingUser: false
    })
  })
})