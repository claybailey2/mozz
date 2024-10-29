// src/lib/__tests__/store-members.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { 
  checkEmailRegistered, 
  getStoreMembers, 
  acceptStoreInvitation,
  signUpFromInvitation,
  removeStoreMember,
  checkStoreMembership
} from '@/lib/api/store-members'
import { 
  mockSupabaseClient, 
  createMockResponse,
  STORES, 
  USERS,
  MOCK_USER 
} from './setup'

describe('Store Members API', () => {
  beforeEach(() => {
    mockSupabaseClient.from.mockClear()
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: MOCK_USER },
      error: null
    })
  })

  describe('checkEmailRegistered', () => {
    it('should return true for registered email', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse({ email: 'test@example.com' })
      )

      const result = await checkEmailRegistered('test@example.com')
      expect(result).toBe(true)
    })

    it('should return false for unregistered email', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null, { code: 'PGRST116', message: 'Not found' })
      )

      const result = await checkEmailRegistered('new@example.com')
      expect(result).toBe(false)
    })

    it('should convert email to lowercase', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse({ email: 'test@example.com' })
      )

      await checkEmailRegistered('TEST@example.com')
      
      const query = mockSupabaseClient.from.mock.results[0].value
      expect(query._filters).toContainEqual({
        method: 'eq',
        args: ['email', 'test@example.com']
      })
    })
  })

  describe('getStoreMembers', () => {
    const mockMembers = [
      { 
        store_id: STORES.DOWNTOWN, 
        user_id: USERS.DOWNTOWN_OWNER,
        email: 'owner@downtown.com',
        role: 'owner',
        status: 'active'
      },
      {
        store_id: STORES.DOWNTOWN,
        user_id: USERS.DOWNTOWN_CHEF1,
        email: 'chef@downtown.com',
        role: 'chef',
        status: 'active'
      }
    ]

    it('should fetch all members for a store', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(mockMembers)
      )

      const result = await getStoreMembers(STORES.DOWNTOWN)
      expect(result).toEqual(mockMembers)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('store_members')
    })

    it('should order by role and email', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(mockMembers)
      )

      await getStoreMembers(STORES.DOWNTOWN)
      
      const query = mockSupabaseClient.from.mock.results[0].value
      expect(query._filters).toContainEqual({
        method: 'order',
        args: ['role', { ascending: false }]
      })
      expect(query._filters).toContainEqual({
        method: 'order',
        args: ['email', { ascending: true }]
      })
    })
  })

  describe('acceptStoreInvitation', () => {
    it('should update invitation status to active', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null)
      )

      await acceptStoreInvitation({ 
        email: 'chef@example.com', 
        storeId: STORES.DOWNTOWN 
      })

      const query = mockSupabaseClient.from.mock.results[0].value
      expect(query._filters).toContainEqual({
        method: 'eq',
        args: ['status', 'invited']
      })
      expect(query._filters).toContainEqual({
        method: 'eq',
        args: ['email', 'chef@example.com']
      })
    })

    it('should handle non-existent invitations', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null, { code: 'PGRST116', message: 'Not found' })
      )

      await expect(acceptStoreInvitation({
        email: 'nonexistent@example.com',
        storeId: STORES.DOWNTOWN
      })).rejects.toThrow()
    })
  })

  describe('signUpFromInvitation', () => {
    const newUser = {
      id: 'new-user-id',
      email: 'new@example.com'
    }

    it('should create account and update membership', async () => {
      // Mock successful signup
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: newUser },
        error: null
      })

      // Mock successful membership update
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null)
      )

      const result = await signUpFromInvitation({
        email: 'new@example.com',
        password: 'password123',
        storeId: STORES.DOWNTOWN
      })

      expect(result).toEqual(newUser)
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123'
      })
    })

    it('should handle signup failures', async () => {
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: new Error('Signup failed')
      })

      await expect(signUpFromInvitation({
        email: 'new@example.com',
        password: 'password123',
        storeId: STORES.DOWNTOWN
      })).rejects.toThrow()
    })
  })

  describe('removeStoreMember', () => {
    it('should delete store member', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null)
      )

      await removeStoreMember(STORES.DOWNTOWN, 'chef@example.com')
      
      const query = mockSupabaseClient.from.mock.results[0].value
      expect(query._filters).toContainEqual({
        method: 'eq',
        args: ['store_id', STORES.DOWNTOWN]
      })
      expect(query._filters).toContainEqual({
        method: 'eq',
        args: ['email', 'chef@example.com']
      })
    })

    it('should handle deletion failures', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null, new Error('Deletion failed'))
      )

      await expect(removeStoreMember(STORES.DOWNTOWN, 'chef@example.com'))
        .rejects.toThrow()
    })
  })

  describe('checkStoreMembership', () => {
    it('should return true for store member', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse({ id: 'member-id' })
      )

      const result = await checkStoreMembership(STORES.DOWNTOWN)
      expect(result).toBe(true)
    })

    it('should return false when not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: null
      })

      const result = await checkStoreMembership(STORES.DOWNTOWN)
      expect(result).toBe(false)
    })

    it('should return false when not a member', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null, { code: 'PGRST116', message: 'Not found' })
      )

      const result = await checkStoreMembership(STORES.DOWNTOWN)
      expect(result).toBe(false)
    })

    it('should check membership using user email', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse({ id: 'member-id' })
      )

      await checkStoreMembership(STORES.DOWNTOWN)
      
      const query = mockSupabaseClient.from.mock.results[0].value
      expect(query._filters).toContainEqual({
        method: 'eq',
        args: ['email', MOCK_USER.email]
      })
    })
  })
})