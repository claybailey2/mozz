import { supabase } from '../supabase'
import type { Database } from '@/lib/supabase'
import { Topping } from './toppings'
import { validateUniquePizza, validateUniquePizzaToppings } from './validators'

type Pizza = Database['public']['Tables']['pizzas']['Row']

export type PizzaWithToppings = Pizza & {
  pizza_toppings: Array<{
    topping: Topping
  }>
}

export async function createPizza(
  storeId: string,
  name: string,
  toppingIds: string[],
  createdById: string
) {
  // Validate first
  await validateUniquePizza(storeId, name)
  await validateUniquePizzaToppings(storeId, toppingIds)

  // Create the pizza
  const { data: newPizza, error: pizzaError } = await supabase
    .from('pizzas')
    .insert({
      store_id: storeId,
      name,
      created_by: createdById,
    })
    .select()
    .single()

  if (pizzaError) throw pizzaError

  // Create topping relationships
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

export async function updatePizza(id: string, storeId: string, name: string, toppingIds: string[]) {
  // Validate before updating
  await validateUniquePizza(storeId, name, id)
  await validateUniquePizzaToppings(storeId, toppingIds, id)

  // Update pizza name
  const { error: pizzaError } = await supabase
    .from('pizzas')
    .update({ name })
    .eq('id', id)

  if (pizzaError) throw pizzaError

  // Delete existing toppings
  const { error: deleteError } = await supabase
    .from('pizza_toppings')
    .delete()
    .eq('pizza_id', id)

  if (deleteError) throw deleteError

  // Add new toppings
  if (toppingIds.length > 0) {
    const { error: toppingsError } = await supabase
      .from('pizza_toppings')
      .insert(
        toppingIds.map(toppingId => ({
          pizza_id: id,
          topping_id: toppingId
        }))
      )

    if (toppingsError) throw toppingsError
  }
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

export async function deletePizza(id: string) {
  const { error } = await supabase
    .from('pizzas')
    .delete()
    .eq('id', id)

  if (error) throw error
}