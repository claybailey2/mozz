// src/lib/__tests__/setup.ts
import { afterEach, vi } from 'vitest'

export const STORES = {
  DOWNTOWN: '11111111-1111-1111-1111-111111111111',
  UPTOWN: '22222222-2222-2222-2222-222222222222'
} as const

export const USERS = {
  DOWNTOWN_OWNER: '98765432-1234-5678-1234-567812345678',
  UPTOWN_OWNER: '76543210-1234-5678-1234-567812345678',
  DOWNTOWN_CHEF1: '54321098-1234-5678-1234-567812345678',
  DOWNTOWN_CHEF2: '32109876-1234-5678-1234-567812345678',
} as const

export const MOCK_USER = {
  id: USERS.DOWNTOWN_OWNER,
  email: 'owner@downtown.com',
  aud: 'authenticated',
  role: 'authenticated'
}

export const MOCK_STORES = {
  DOWNTOWN: {
    id: STORES.DOWNTOWN,
    name: 'Downtown Pizzeria',
    created_at: '2024-01-01T00:00:00Z',
    store_members: [{
      user_id: USERS.DOWNTOWN_OWNER,
      email: 'owner@downtown.com',
      role: 'owner',
      status: 'active'
    }]
  },
  UPTOWN: {
    id: STORES.UPTOWN,
    name: 'Uptown Pizza Palace',
    created_at: '2024-01-02T00:00:00Z',
    store_members: [{
      user_id: USERS.UPTOWN_OWNER,
      email: 'owner@uptown.com',
      role: 'owner',
      status: 'active'
    }]
  }
} as const

export const TOPPINGS = {
  PEPPERONI: 'pepperoni-id',
  MUSHROOMS: 'mushrooms-id',
  BELL_PEPPERS: 'bell-peppers-id'
} as const

// Enhanced query builder that maintains chainable methods and response data
export function createQueryBuilder({ data = null, error = null } = {}) {
  const chain: any = {
    data,
    error,
    _filters: [], // Track applied filters
    _selections: [], // Track selected fields
  }

  // Core query methods
  const methods = [
    'select',
    'insert',
    'update',
    'delete',
    'eq',
    'neq',
    'ilike',
    'order',
    'single',
    'in',
    'filter',
    'match'
  ]

  methods.forEach(method => {
    chain[method] = vi.fn((...args) => {
      // Store the method call for later validation
      chain._filters.push({ method, args })
      return chain
    })
  })

  // Make the chain thenable to handle async operations
  chain.then = vi.fn((resolve) => {
    return Promise.resolve(resolve({ data, error }))
  })

  return chain
}

// Create mock Supabase client
export const mockSupabaseClient = {
  from: vi.fn((_table) => {
    return createQueryBuilder()
  }),
  auth: {
    getUser: vi.fn().mockResolvedValue({
      data: { user: MOCK_USER },
      error: null
    }),
    updateUser: vi.fn().mockResolvedValue({
      data: { user: MOCK_USER },
      error: null
    }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({
      data: {},
      error: null
    }),
    signUp: vi.fn().mockResolvedValue({
      data: { user: MOCK_USER },
      error: null
    })
  }
}

// Mock the supabase module
vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabaseClient
}))

// Helper to create specific query responses
export function createMockResponse(data: any = null, error: any = null) {
  return createQueryBuilder({ data, error })
}

// Mock window.location for auth
vi.stubGlobal('window', {
  location: {
    origin: 'http://localhost:3000',
    pathname: '/'
  }
})

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})