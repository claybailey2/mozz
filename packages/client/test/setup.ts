import { beforeAll, afterEach, vi } from 'vitest'
import { createClient } from '@supabase/supabase-js'

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
      neq: vi.fn(),
      single: vi.fn(),
      order: vi.fn(),
      maybeSingle: vi.fn(),
    })),
    auth: {
      getUser: vi.fn(() => ({
        data: { user: { id: 'test-user-id', email: 'test@example.com' } },
        error: null
      }))
    }
  }
}))

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks()
})