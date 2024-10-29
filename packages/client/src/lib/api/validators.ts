// lib/api/validators.ts
import { supabase } from '@/lib/supabase'
import { PizzaWithToppings } from './pizzas'

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export async function validateUniqueTopping(storeId: string, name: string, excludeToppingId?: string) {
  const query = supabase
    .from('toppings')
    .select('id, name')
    .eq('store_id', storeId)
    .ilike('name', name) // case insensitive comparison

  // If we're updating, exclude the current topping
  if (excludeToppingId) {
    query.neq('id', excludeToppingId)
  }

  const { data, error } = await query

  if (error) throw error

  if (data && data.length > 0) {
    throw new ValidationError(`A topping named "${name}" already exists in this store`)
  }
}

export async function validateUniquePizza(storeId: string, name: string, excludePizzaId?: string) {
  const query = supabase
    .from('pizzas')
    .select('id, name')
    .eq('store_id', storeId)
    .ilike('name', name) // case insensitive comparison

  // If we're updating, exclude the current pizza
  if (excludePizzaId) {
    query.neq('id', excludePizzaId)
  }

  const { data, error } = await query

  if (error) throw error

  if (data && data.length > 0) {
    throw new ValidationError(`A pizza named "${name}" already exists in this store`)
  }
}

export async function validateUniquePizzaToppings(storeId: string, toppingIds: string[], excludePizzaId?: string) {
  let response;
  if (excludePizzaId) {
    response = await supabase
      .from('pizzas')
      .select(`
      *,
      pizza_toppings (
        topping:toppings (
          id,
          name
        )
      )
    `)
      .eq('store_id', storeId)
      .neq('id', excludePizzaId)
  } else {
    response = await supabase
      .from('pizzas')
      .select(`
        *,
        pizza_toppings (
          topping:toppings (
            id,
            name
          )
        )
      `)
      .eq('store_id', storeId)
  }
  const { data: pizzas, error: pizzasError } = response;
  if (pizzasError) throw pizzasError

  // Sort the new topping IDs for comparison
  const newToppingsSet = new Set(toppingIds.sort())

  // Check each existing pizza's toppings
  for (const pizza of (pizzas as PizzaWithToppings[])) {
    const existingToppingsSet = new Set(
      pizza.pizza_toppings
        .map(pt => pt.topping.id)
        .sort()
    )

    // Compare sets
    if (areSetsEqual(newToppingsSet, existingToppingsSet)) {
      throw new ValidationError(
        `A pizza with these exact toppings already exists (${pizza.name})`
      )
    }
  }
}

// Helper function to compare sets
function areSetsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false
  for (const item of a) {
    if (!b.has(item)) return false
  }
  return true
}