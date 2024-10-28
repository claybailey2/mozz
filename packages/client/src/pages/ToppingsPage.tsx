import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToppingsList } from '@/features/toppings/components/ToppingsList'

export function ToppingsPage() {
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
        <h1 className="text-3xl font-bold">Manage Toppings</h1>
        <p className="text-muted-foreground">
          Add, edit, or remove toppings available for your pizzas
        </p>
      </div>

      <ToppingsList />
    </div>
  )
}