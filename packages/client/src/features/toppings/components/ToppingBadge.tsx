import { Topping } from "@/lib/api/toppings"
import { Badge } from "@/components/ui/badge"
import { useToppingColor } from "../hooks/use-toppings"

export function ToppingBadge({ topping }: { topping: Topping }) {
  const toppingColor = useToppingColor()
  const { color: backgroundColor, isDark } = toppingColor(topping.id)
  return (
    <Badge key={topping.id} className={isDark ? 'text-white' : 'text-black'} style={{ backgroundColor }} >
      {topping.name}
    </Badge>
  )
}