import { Link, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PizzasList } from '@/features/pizzas/components/PizzasList'
import { useStore } from '@/features/stores/hooks/use-stores'
import { cn } from '@/lib/utils'

export function PizzasPage() {
  const { storeId } = useParams<{ storeId: string }>()
  const { data: store, isLoading } = useStore(storeId!)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link to={`/stores/${storeId}`}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Store
          </Link>
        </Button>
      </div>

      <div>
        {!isLoading && store && (
          <h1 className={cn(
            "text-4xl font-bold mb-2",
            "bg-gradient-to-r from-crimson to-burnt-sienna bg-clip-text text-transparent"
          )}>
            {store.name}
          </h1>
        )}
        <h2 className="text-2xl font-semibold">Manage Pizzas</h2>
        <p className="text-muted-foreground">
          Create and customize pizzas using available toppings
        </p>
      </div>

      <PizzasList />
    </div>
  )
}