import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PizzasList } from '@/features/pizzas/components/PizzasList'

export function PizzasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/stores">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Stores
          </Link>
        </Button>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold">Manage Pizzas</h1>
        <p className="text-muted-foreground">
          Create and customize pizzas using available toppings
        </p>
      </div>

      <PizzasList />
    </div>
  )
}