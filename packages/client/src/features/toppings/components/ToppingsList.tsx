import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { useToppings, useCreateTopping, useUpdateTopping, useDeleteTopping } from '../hooks/use-toppings'
import { ToppingBadge } from './ToppingBadge'

export function ToppingsList() {
  const { storeId } = useParams<{ storeId: string }>()
  if (!storeId) throw new Error('Store ID is required')

  const { data: toppings, isLoading } = useToppings(storeId)
  const createTopping = useCreateTopping(storeId)
  const updateTopping = useUpdateTopping(storeId)
  const deleteTopping = useDeleteTopping(storeId)
  
  const [newToppingName, setNewToppingName] = useState('')
  const [editingTopping, setEditingTopping] = useState<{ id: string; name: string } | null>(null)
  const [toppingToDelete, setToppingToDelete] = useState<string | null>(null)

  if (isLoading) {
    return <div>Loading toppings...</div>
  }

  const handleCreateTopping = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newToppingName.trim()) return

    try {
      await createTopping.mutateAsync(newToppingName)
      setNewToppingName('')
    } catch (error) {
      console.error('Failed to create topping:', error)
    }
  }

  const handleUpdateTopping = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTopping || !editingTopping.name.trim()) return

    try {
      await updateTopping.mutateAsync({ 
        id: editingTopping.id, 
        name: editingTopping.name 
      })
      setEditingTopping(null)
    } catch (error) {
      console.error('Failed to update topping:', error)
    }
  }

  const handleDeleteTopping = async () => {
    if (!toppingToDelete) return

    try {
      await deleteTopping.mutateAsync(toppingToDelete)
      setToppingToDelete(null)
    } catch (error) {
      console.error('Failed to delete topping:', error)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreateTopping} className="flex gap-4">
        <Input
          placeholder="New topping name"
          value={newToppingName}
          onChange={(e) => setNewToppingName(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit" disabled={createTopping.isPending}>
          <Plus className="w-4 h-4 mr-2" />
          Add Topping
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {toppings?.map((topping) => (
            <TableRow key={topping.id}>
              <TableCell>
                {editingTopping?.id === topping.id ? (
                  <form onSubmit={handleUpdateTopping} className="flex gap-2">
                    <Input
                      value={editingTopping?.name}
                      onChange={(e) => setEditingTopping(editingTopping ? { ...editingTopping, name: e.target.value } : null)}
                      className="h-8"
                    />
                    <Button type="submit" size="sm" disabled={updateTopping.isPending}>
                      Save
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="outline"
                      onClick={() => setEditingTopping(null)}
                    >
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <ToppingBadge topping={topping} />
                )}
              </TableCell>
              <TableCell>
                {editingTopping?.id !== topping.id && (
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setEditingTopping(topping)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setToppingToDelete(topping.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!toppingToDelete} onOpenChange={() => setToppingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the topping.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTopping}
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