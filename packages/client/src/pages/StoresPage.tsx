import { StoresList } from '@/features/stores/components/StoresList'

export function StoresPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Your Stores</h1>
        <p className="text-muted-foreground">
          Create and manage your pizza stores
        </p>
      </div>
      <StoresList />
    </div>
  )
}