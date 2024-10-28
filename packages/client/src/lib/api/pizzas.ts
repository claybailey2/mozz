import { supabase } from '../supabase'
import type { Database } from '@pizza-management/shared'
import { Topping } from './toppings'

type Pizza = Database['public']['Tables']['pizzas']['Row']
type PizzaInsert = Database['public']['Tables']['pizzas']['Insert']

// First, let's create a type for the response
type PizzaWithToppings = Pizza & {
  pizza_toppings: Array<{
    topping: Topping
  }>
}

export async function getPizzas(storeId: string) {
  const { data: pizzas, error: pizzasError } = await supabase
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
    .order('created_at', { ascending: false })

  if (pizzasError) throw pizzasError
  return pizzas as PizzaWithToppings[]
}
export async function createPizza(pizza: PizzaInsert, toppingIds: string[]) {
  // Start a transaction by creating the pizza first
  const { data: newPizza, error: pizzaError } = await supabase
    .from('pizzas')
    .insert(pizza)
    .select()
    .single()

  if (pizzaError) throw pizzaError

  // Then create the pizza-topping relationships
  if (toppingIds.length > 0) {
    const { error: toppingsError } = await supabase
      .from('pizza_toppings')
      .insert(
        toppingIds.map(toppingId => ({
          pizza_id: newPizza.id,
          topping_id: toppingId
        }))
      )

    if (toppingsError) throw toppingsError
  }

  return newPizza
}

export async function updatePizza(
  pizzaId: string, 
  updates: { name: string }, 
  toppingIds: string[]
) {
  // Update pizza name
  const { error: pizzaError } = await supabase
    .from('pizzas')
    .update(updates)
    .eq('id', pizzaId)

  if (pizzaError) throw pizzaError

  // Delete existing toppings
  const { error: deleteError } = await supabase
    .from('pizza_toppings')
    .delete()
    .eq('pizza_id', pizzaId)

  if (deleteError) throw deleteError

  // Add new toppings
  if (toppingIds.length > 0) {
    const { error: toppingsError } = await supabase
      .from('pizza_toppings')
      .insert(
        toppingIds.map(toppingId => ({
          pizza_id: pizzaId,
          topping_id: toppingId
        }))
      )

    if (toppingsError) throw toppingsError
  }
}

export async function deletePizza(id: string) {
  const { error } = await supabase
    .from('pizzas')
    .delete()
    .eq('id', id)

  if (error) throw error
}