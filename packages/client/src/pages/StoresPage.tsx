import { StoresList } from '@/features/stores/components/StoresList'
import { Store } from 'lucide-react'

export function StoresPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-row items-center gap-4" >
          <Store className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Your Stores</h1>
        </div>
        <p className="text-muted-foreground">
          Create and manage your pizza stores
        </p>
      </div>
      <StoresList />
    </div>
  )
}