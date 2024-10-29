// src/lib/__tests__/toppings.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { getToppings, createTopping, updateTopping, deleteTopping } from '@/lib/api/toppings'
import { ValidationError } from '@/lib/api/validators'
import { mockSupabaseClient, STORES, createMockResponse } from './setup'

describe('Toppings API', () => {
  const STORE_ID = STORES.DOWNTOWN
  const mockToppings = [
    { id: '1', store_id: STORE_ID, name: 'Pepperoni' },
    { id: '2', store_id: STORE_ID, name: 'Mushrooms' }
  ]

  beforeEach(() => {
    mockSupabaseClient.from.mockClear()
  })

  describe('getToppings', () => {
    it('should fetch toppings for a store', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(mockToppings)
      )

      const toppings = await getToppings(STORE_ID)
      
      expect(toppings).toEqual(mockToppings)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('toppings')
    })

    it('should handle database errors', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null, new Error('Database error'))
      )

      await expect(getToppings(STORE_ID)).rejects.toThrow('Database error')
    })
  })

  describe('createTopping', () => {
    const newTopping = { id: '3', store_id: STORE_ID, name: 'Olives' }

    it('should create a new topping', async () => {
      // Mock validation check - no existing toppings
      mockSupabaseClient.from
        .mockReturnValueOnce(createMockResponse([]))
        .mockReturnValueOnce(createMockResponse(newTopping))

      const topping = await createTopping(STORE_ID, 'Olives')
      
      expect(topping).toEqual(newTopping)
      expect(mockSupabaseClient.from).toHaveBeenNthCalledWith(1, 'toppings')
      expect(mockSupabaseClient.from).toHaveBeenNthCalledWith(2, 'toppings')
    })

    it('should prevent duplicate toppings', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse([{ id: '1', name: 'Olives' }])
      )

      await expect(createTopping(STORE_ID, 'Olives'))
        .rejects
        .toThrow(ValidationError)
    })
  })

  describe('updateTopping', () => {
    it('should update an existing topping', async () => {
      const updatedTopping = { id: '1', store_id: STORE_ID, name: 'Super Pepperoni' }
      
      mockSupabaseClient.from
        .mockReturnValueOnce(createMockResponse([]))  // validation check
        .mockReturnValueOnce(createMockResponse(updatedTopping))

      const result = await updateTopping('1', STORE_ID, 'Super Pepperoni')
      
      expect(result).toEqual(updatedTopping)
    })
  })

  describe('deleteTopping', () => {
    it('should delete a topping', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null)
      )

      await expect(deleteTopping('1')).resolves.not.toThrow()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('toppings')
    })
  })
})