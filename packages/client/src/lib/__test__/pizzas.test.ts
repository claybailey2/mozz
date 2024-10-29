// src/lib/__tests__/pizzas.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { getPizzas, createPizza, updatePizza, deletePizza } from '@/lib/api/pizzas'
import { ValidationError } from '@/lib/api/validators'
import { mockSupabaseClient, createMockResponse, STORES, USERS, TOPPINGS } from './setup'

describe('Pizzas API', () => {
  const STORE_ID = STORES.DOWNTOWN
  const USER_ID = USERS.DOWNTOWN_OWNER

  beforeEach(() => {
    mockSupabaseClient.from.mockClear()
  })

  describe('getPizzas', () => {
    it('should fetch all pizzas with their toppings', async () => {
      const mockPizzas = [
        {
          id: 'pizza1',
          name: 'Margherita',
          store_id: STORE_ID,
          created_by: USER_ID,
          created_at: '2024-01-01T00:00:00Z',
          pizza_toppings: [
            { topping: { id: TOPPINGS.MUSHROOMS, name: 'Mushrooms' } }
          ]
        }
      ]

      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(mockPizzas)
      )

      const result = await getPizzas(STORE_ID)
      expect(result).toEqual(mockPizzas)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('pizzas')
    })
  })

  describe('createPizza', () => {
    const newPizza = {
      id: 'new-pizza',
      name: 'Hawaiian',
      store_id: STORE_ID,
      created_by: USER_ID,
      created_at: '2024-01-01T00:00:00Z'
    }

    it('should create a new pizza with toppings', async () => {
      // Mock all the validation and creation steps
      mockSupabaseClient.from
        // Name validation
        .mockReturnValueOnce(createMockResponse([]))
        // Toppings validation
        .mockReturnValueOnce(createMockResponse([]))
        // Pizza creation
        .mockReturnValueOnce(createMockResponse(newPizza))
        // Toppings creation
        .mockReturnValueOnce(createMockResponse(null))

      const result = await createPizza(
        STORE_ID,
        'Hawaiian',
        [TOPPINGS.PEPPERONI],
        USER_ID
      )

      expect(result).toEqual(newPizza)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('pizzas')
    })

    it('should prevent duplicate pizza names', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse([{ id: 'existing', name: 'Hawaiian' }])
      )

      await expect(
        createPizza(STORE_ID, 'Hawaiian', [TOPPINGS.PEPPERONI], USER_ID)
      ).rejects.toThrow(ValidationError)
    })
  })

  describe('updatePizza', () => {
    const pizzaId = 'pizza-to-update'

    it('should update pizza name and toppings', async () => {
      mockSupabaseClient.from
        // Name validation
        .mockReturnValueOnce(createMockResponse([]))
        // Toppings validation
        .mockReturnValueOnce(createMockResponse([]))
        // Update name
        .mockReturnValueOnce(createMockResponse(null))
        // Delete old toppings
        .mockReturnValueOnce(createMockResponse(null))
        // Add new toppings
        .mockReturnValueOnce(createMockResponse(null))

      await expect(
        updatePizza(pizzaId, STORE_ID, 'Updated Pizza', [TOPPINGS.MUSHROOMS])
      ).resolves.not.toThrow()
    })
  })

  describe('deletePizza', () => {
    it('should delete a pizza', async () => {
      mockSupabaseClient.from.mockReturnValue(
        createMockResponse(null)
      )

      await expect(deletePizza('pizza-to-delete'))
        .resolves.not.toThrow()
      
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('pizzas')
    })
  })
})