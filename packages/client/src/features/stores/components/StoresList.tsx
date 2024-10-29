import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, Plus, Store, ChefHat, Crown, X } from 'lucide-react'
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
import { ShoppingBasket, Pizza, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { RequireStoreOwner } from './RequireStoreOwner'

function RoleBadge({ role }: { role: 'owner' | 'chef' }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "flex items-center gap-1",
        role === 'owner'
          ? "bg-gradient-to-r from-crimson to-burnt-sienna text-white"
          : "bg-cool-gray/10 text-cool-gray"
      )}
    >
      {role === 'owner' ? (
        <Crown className="h-3 w-3" />
      ) : (
        <ChefHat className="h-3 w-3" />
      )}
      {role}
    </Badge>
  )
}

export function StoresList() {
  const navigate = useNavigate()

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
          <Card key={store.id} className="group">
            <div
              className="cursor-pointer transition-colors hover:bg-slate-50"
              onClick={() => navigate(`/stores/${store.id}`)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1.5">
                  <CardTitle className="text-xl font-semibold text-crimson">
                    {editingStore && editingStore.id === store.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          handleUpdateStore(e)
                        }}
                        className="flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Input
                          value={editingStore.name} // Use editingStore.name instead of newStoreName
                          onChange={(e) => setEditingStore({
                            ...editingStore,
                            name: e.target.value
                          })}
                          className="h-8"
                          autoFocus
                        />
                        <Button
                          type="submit"
                          size="sm"
                          disabled={updateStore.isPending}
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingStore(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </form>
                    ) : (
                      <div className='flex flex-row gap-3 items-center hover:underline'>
                        <Store className="h-4 w-4" />
                        {store.name}
                      </div>
                    )}
                  </CardTitle>
                  <RoleBadge role={store.userRole} />
                </div>
                {editingStore?.id !== store.id && store.userRole === 'owner' && (
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
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
              <CardContent
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex gap-2">
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="bg-gradient-to-r from-crimson to-burnt-sienna hover:from-crimson/90 hover:to-burnt-sienna/90"
                  >
                    <Link to={`/stores/${store.id}/pizzas`}>
                      <Pizza className="h-4 w-4 mr-2" />
                      Pizzas
                    </Link>
                  </Button>
                  <RequireStoreOwner storeId={store.id}>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/stores/${store.id}/toppings`}>
                        <ShoppingBasket className="h-4 w-4 mr-2" />
                        Toppings
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/stores/${store.id}/settings`}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                  </RequireStoreOwner>
                </div>
              </CardContent>
            </div>
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