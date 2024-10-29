import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { PizzaForm } from './PizzasForm'
import { usePizzas, useCreatePizza, useUpdatePizza, useDeletePizza } from '../hooks/use-pizzas'
import { Topping } from '@/lib/api/toppings'
import { ToppingBadge } from '@/features/toppings/components/ToppingBadge'

export function PizzasList() {
  const { storeId } = useParams<{ storeId: string }>()
  if (!storeId) throw new Error('Store ID is required')

  const { data: pizzas, isLoading } = usePizzas(storeId)
  const createPizza = useCreatePizza(storeId)
  const updatePizza = useUpdatePizza(storeId)
  const deletePizza = useDeletePizza(storeId)


  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPizza, setEditingPizza] = useState<any | null>(null)
  const [pizzaToDelete, setPizzaToDelete] = useState<string | null>(null)

  if (isLoading) {
    return <div>Loading pizzas...</div>
  }

  const handleCreatePizza = async (data: { name: string; toppingIds: string[] }) => {
    try {
      await createPizza.mutateAsync(data)
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Failed to create pizza:', error)
    }
  }

  const handleUpdatePizza = async (data: { name: string; toppingIds: string[] }) => {
    if (!editingPizza) return

    try {
      await updatePizza.mutateAsync({
        id: editingPizza.id,
        ...data
      })
      setEditingPizza(null)
    } catch (error) {
      console.error('Failed to update pizza:', error)
    }
  }

  const handleDeletePizza = async () => {
    if (!pizzaToDelete) return

    try {
      await deletePizza.mutateAsync(pizzaToDelete)
      setPizzaToDelete(null)
    } catch (error) {
      console.error('Failed to delete pizza:', error)
    }
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Create New Pizza
      </Button>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pizzas?.map((pizza) => {
          return (
            <Card key={pizza.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {pizza.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setEditingPizza(pizza)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setPizzaToDelete(pizza.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {pizza.pizza_toppings.map(({ topping }: { topping: Topping }) => (
                    <ToppingBadge key={topping.id} topping={topping} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Pizza</DialogTitle>
          </DialogHeader>
          <PizzaForm
            storeId={storeId}
            onSubmit={handleCreatePizza}
            isSubmitting={createPizza.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingPizza} onOpenChange={() => setEditingPizza(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pizza</DialogTitle>
          </DialogHeader>
          {editingPizza && (
            <PizzaForm
              storeId={storeId}
              initialName={editingPizza.name}
              initialToppingIds={editingPizza?.pizza_toppings?.map((pt: any) => pt.topping.id)}
              onSubmit={handleUpdatePizza}
              isSubmitting={updatePizza.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pizzaToDelete} onOpenChange={() => setPizzaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the pizza.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePizza}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}