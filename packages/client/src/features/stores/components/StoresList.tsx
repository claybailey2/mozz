import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import { useStores, useCreateStore, useUpdateStore, useDeleteStore } from '../hooks/use-stores'

export function StoresList() {
  const { data: stores, isLoading } = useStores()
  const createStore = useCreateStore()
  const updateStore = useUpdateStore()
  const deleteStore = useDeleteStore()

  const [newStoreName, setNewStoreName] = useState('')
  const [editingStore, setEditingStore] = useState<{ id: string; name: string } | null>(null)
  const [storeToDelete, setStoreToDelete] = useState<string | null>(null)

  if (isLoading) {
    return <div>Loading stores...</div>
  }

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStoreName.trim()) return

    try {
      await createStore.mutateAsync(newStoreName)
      setNewStoreName('')
    } catch (error) {
      console.error('Failed to create store:', error)
    }
  }

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStore || !editingStore.name.trim()) return

    try {
      await updateStore.mutateAsync({
        id: editingStore.id,
        name: editingStore.name
      })
      setEditingStore(null)
    } catch (error) {
      console.error('Failed to update store:', error)
    }
  }

  const handleDeleteStore = async () => {
    if (!storeToDelete) return

    try {
      await deleteStore.mutateAsync(storeToDelete)
      setStoreToDelete(null)
    } catch (error) {
      console.error('Failed to delete store:', error)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreateStore} className="flex gap-4">
        <Input
          placeholder="New store name"
          value={newStoreName}
          onChange={(e) => setNewStoreName(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit" disabled={createStore.isPending}>
          <Plus className="w-4 h-4 mr-2" />
          Add Store
        </Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stores?.map((store) => (
          <Card key={store.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {editingStore?.id === store.id ? (
                  <form onSubmit={handleUpdateStore} className="flex gap-2">
                    <Input
                      value={editingStore?.name}
                      onChange={(e) => setEditingStore(editingStore ? { ...editingStore, name: e.target.value } : null)}
                      className="h-8"
                    />
                    <Button type="submit" size="sm" disabled={updateStore.isPending}>
                      Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingStore(null)}
                    >
                      Cancel
                    </Button>
                  </form>
                ) : (
                  store.name
                )}
              </CardTitle>
              {editingStore?.id !== store.id && (
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setEditingStore(store)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setStoreToDelete(store.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/stores/${store.id}/toppings`}>
                    Manage Toppings
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/stores/${store.id}/pizzas`}>
                    View Pizzas
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/stores/${store.id}/settings`}>
                    Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!storeToDelete} onOpenChange={() => setStoreToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the store
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStore}
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