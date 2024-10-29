// src/lib/__tests__/validators.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { 
  validateUniqueTopping, 
  validateUniquePizza, 
  validateUniquePizzaToppings,
  ValidationError 
} from '@/lib/api/validators'
import { 
  mockSupabaseClient, 
  createMockResponse,
  STORES,
  TOPPINGS
} from './setup'

describe('Validators', () => {
  const STORE_ID = STORES.DOWNTOWN

  beforeEach(() => {
    mockSupabaseClient.from.mockClear()
  })

  describe('ValidationError', () => {
    it('should create error with correct name and message', () => {
      const error = new ValidationError('Test message')
      expect(error.name).toBe('ValidationError')
      expect(error.message).toBe('Test message')
    })
  })

  describe('validateUniqueTopping', () => {
    it('should pass for unique topping name', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse([])
      )

      await expect(validateUniqueTopping(STORE_ID, 'New Topping'))
        .resolves.not.toThrow()
    })

    it('should fail for duplicate topping name', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse([{ id: '1', name: 'Existing Topping' }])
      )

      await expect(validateUniqueTopping(STORE_ID, 'Existing Topping'))
        .rejects
        .toThrow('A topping named "Existing Topping" already exists in this store')
    })

    it('should be case insensitive', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse([{ id: '1', name: 'Pepperoni' }])
      )

      await expect(validateUniqueTopping(STORE_ID, 'PEPPERONI'))
        .rejects
        .toThrow(ValidationError)
      
      const query = mockSupabaseClient.from.mock.results[0].value
      expect(query._filters).toContainEqual({
        method: 'ilike',
        args: ['name', 'PEPPERONI']
      })
    })

    it('should allow updating existing topping', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse([])
      )

      await expect(
        validateUniqueTopping(STORE_ID, 'Updated Name', 'existing-id')
      ).resolves.not.toThrow()

      const query = mockSupabaseClient.from.mock.results[0].value
      expect(query._filters).toContainEqual({
        method: 'neq',
        args: ['id', 'existing-id']
      })
    })
  })

  describe('validateUniquePizza', () => {
    it('should pass for unique pizza name', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse([])
      )

      await expect(validateUniquePizza(STORE_ID, 'New Pizza'))
        .resolves.not.toThrow()
    })

    it('should fail for duplicate pizza name', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse([{ id: '1', name: 'Margherita' }])
      )

      await expect(validateUniquePizza(STORE_ID, 'Margherita'))
        .rejects
        .toThrow('A pizza named "Margherita" already exists in this store')
    })

    it('should be case insensitive', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse([{ id: '1', name: 'Margherita' }])
      )

      await expect(validateUniquePizza(STORE_ID, 'MARGHERITA'))
        .rejects
        .toThrow(ValidationError)
    })

    it('should allow updating existing pizza', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse([])
      )

      await expect(
        validateUniquePizza(STORE_ID, 'Updated Name', 'existing-id')
      ).resolves.not.toThrow()
    })
  })

  describe('validateUniquePizzaToppings', () => {
    const mockPizzas = [
      {
        id: 'pizza1',
        name: 'Mushroom Special',
        pizza_toppings: [
          { topping: { id: TOPPINGS.MUSHROOMS, name: 'Mushrooms' } }
        ]
      },
      {
        id: 'pizza2',
        name: 'Supreme',
        pizza_toppings: [
          { topping: { id: TOPPINGS.PEPPERONI, name: 'Pepperoni' } },
          { topping: { id: TOPPINGS.BELL_PEPPERS, name: 'Bell Peppers' } }
        ]
      }
    ]

    it('should pass for unique topping combination', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(mockPizzas)
      )

      // Try a new combination
      await expect(
        validateUniquePizzaToppings(STORE_ID, [TOPPINGS.PEPPERONI])
      ).resolves.not.toThrow()
    })

    it('should fail for duplicate topping combination', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(mockPizzas)
      )

      // Try the same toppings as Mushroom Special
      await expect(
        validateUniquePizzaToppings(STORE_ID, [TOPPINGS.MUSHROOMS])
      ).rejects.toThrow('A pizza with these exact toppings already exists (Mushroom Special)')
    })

    it('should consider topping order irrelevant', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(mockPizzas)
      )

      // Try Supreme's toppings in reverse order
      await expect(
        validateUniquePizzaToppings(
          STORE_ID, 
          [TOPPINGS.BELL_PEPPERS, TOPPINGS.PEPPERONI]
        )
      ).rejects.toThrow('A pizza with these exact toppings already exists (Supreme)')
    })

    it('should not allow updating an existing pizza\'s toppings to match another\s', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(mockPizzas)
      )

      await expect(
        validateUniquePizzaToppings(
          STORE_ID,
          [TOPPINGS.MUSHROOMS],
          'different-pizza-id'
        )
      ).rejects.toThrow('A pizza with these exact toppings already exists (Mushroom Special)')

      const query = mockSupabaseClient.from.mock.results[0].value
      expect(query._filters).toContainEqual({
        method: 'neq',
        args: ['id', 'different-pizza-id']
      })
    })

    it('should handle empty topping arrays', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse([
          {
            id: 'pizza1',
            name: 'Plain',
            pizza_toppings: []
          }
        ])
      )

      // Should fail because a pizza with no toppings already exists
      await expect(
        validateUniquePizzaToppings(STORE_ID, [])
      ).rejects.toThrow('A pizza with these exact toppings already exists (Plain)')
    })
  })
})