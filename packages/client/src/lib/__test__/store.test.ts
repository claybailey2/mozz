// src/lib/__tests__/stores.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { getStores, getStore, createStore, updateStore, deleteStore, isStoreOwner } from '@/lib/api/stores'
import { 
  mockSupabaseClient, 
  createMockResponse,
  STORES, 
  USERS,
  MOCK_USER,
  MOCK_STORES
} from './setup'

describe('Stores API', () => {
  beforeEach(() => {
    mockSupabaseClient.from.mockClear()
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: MOCK_USER },
      error: null
    })
  })

  describe('getStores', () => {
    it('should fetch stores for authenticated user with roles', async () => {
      const mockStores = [
        {
          id: STORES.DOWNTOWN,
          name: 'Downtown Pizzeria',
          created_at: '2024-01-01T00:00:00Z',
          store_members: [{ role: 'owner', user_id: USERS.DOWNTOWN_OWNER }]
        }
      ]

      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(mockStores)
      )

      const result = await getStores()
      
      expect(result[0]).toMatchObject({
        id: STORES.DOWNTOWN,
        name: 'Downtown Pizzeria',
        userRole: 'owner'
      })
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('stores')
    })

    it('should throw error if user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: null
      })

      await expect(getStores()).rejects.toThrow('Not authenticated')
    })

    it('should handle database errors', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null, new Error('Database error'))
      )

      await expect(getStores()).rejects.toThrow('Database error')
    })
  })

  describe('getStore', () => {
    it('should fetch a single store with membership info', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(MOCK_STORES.DOWNTOWN)
      )

      const result = await getStore(STORES.DOWNTOWN)
      
      expect(result).toMatchObject({
        id: STORES.DOWNTOWN,
        name: 'Downtown Pizzeria',
        store_members: expect.arrayContaining([
          expect.objectContaining({ role: 'owner' })
        ])
      })
    })

    it('should handle non-existent store', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null, { code: 'PGRST116', message: 'Not found' })
      )

      await expect(getStore('non-existent')).rejects.toThrow()
    })
  })

  describe('createStore', () => {
    const newStore = {
      id: 'new-store-id',
      name: 'New Pizzeria',
      created_at: '2024-01-03T00:00:00Z'
    }

    it('should create new store with owner membership', async () => {
      // Mock store creation
      mockSupabaseClient.from
        .mockReturnValueOnce(createMockResponse(newStore)) // store creation
        .mockReturnValueOnce(createMockResponse(null)) // member creation

      const result = await createStore('New Pizzeria', MOCK_USER.email)
      
      expect(result).toEqual(newStore)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('stores')
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('store_members')
    })

    it('should handle store creation failure', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null, new Error('Creation failed'))
      )

      await expect(
        createStore('New Pizzeria', MOCK_USER.email)
      ).rejects.toThrow('Creation failed')
    })

    it('should clean up store if member creation fails', async () => {
      mockSupabaseClient.from
        .mockReturnValueOnce(createMockResponse(newStore)) // store succeeds
        .mockReturnValueOnce(createMockResponse(null, new Error('Member creation failed'))) // member fails
        .mockReturnValueOnce(createMockResponse(null)) // cleanup succeeds

      await expect(
        createStore('New Pizzeria', MOCK_USER.email)
      ).rejects.toThrow('Member creation failed')

      // Verify cleanup was called
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('stores')
      expect(mockSupabaseClient.from).toHaveBeenCalledTimes(3)
    })

    it('should require authentication', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: null
      })

      await expect(
        createStore('New Pizzeria', MOCK_USER.email)
      ).rejects.toThrow('User not authenticated')
    })
  })

  describe('updateStore', () => {
    it('should update store details', async () => {
      const updatedStore = {
        id: STORES.DOWNTOWN,
        name: 'Updated Downtown Pizzeria',
        created_at: '2024-01-01T00:00:00Z'
      }

      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(updatedStore)
      )

      const result = await updateStore(STORES.DOWNTOWN, { 
        name: 'Updated Downtown Pizzeria' 
      })
      
      expect(result).toEqual(updatedStore)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('stores')
    })

    it('should handle update failures', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null, new Error('Update failed'))
      )

      await expect(
        updateStore(STORES.DOWNTOWN, { name: 'New Name' })
      ).rejects.toThrow('Update failed')
    })
  })

  describe('deleteStore', () => {
    it('should delete a store', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null)
      )

      await expect(deleteStore(STORES.DOWNTOWN))
        .resolves.not.toThrow()
      
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('stores')
    })

    it('should handle deletion failures', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null, new Error('Deletion failed'))
      )

      await expect(deleteStore(STORES.DOWNTOWN))
        .rejects.toThrow('Deletion failed')
    })
  })

  describe('isStoreOwner', () => {
    it('should return true for store owner', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse({ role: 'owner' })
      )

      const result = await isStoreOwner(STORES.DOWNTOWN)
      expect(result).toBe(true)
    })

    it('should return false for non-owners', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null, { code: 'PGRST116', message: 'No data found' })
      )
    
      const result = await isStoreOwner(STORES.DOWNTOWN)
      expect(result).toBe(false)
    })

    it('should return false when not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: null
      })

      const result = await isStoreOwner(STORES.DOWNTOWN)
      expect(result).toBe(false)
    })

    it('should return false when membership check fails', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null, new Error('Query failed'))
      )

      const result = await isStoreOwner(STORES.DOWNTOWN)
      expect(result).toBe(false)
    })
  })
})