import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Users, Pizza, ShoppingBasket, ChevronRight,
  UserCircle, Crown, ChefHat,
  ChevronLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useIsStoreOwner, useStore } from '@/features/stores/hooks/use-stores'
import { useStoreDashboard } from '@/features/store-dashboard/hooks/use-store-dashboard'
import { cn } from '@/lib/utils'
import { RequireStoreOwner } from '@/features/stores/components/RequireStoreOwner'
import { ToppingBadge } from '@/features/toppings/components/ToppingBadge'
import { usePizzas } from '@/features/pizzas/hooks/use-pizzas'

export function StoreDashboardPage() {
  const navigate = useNavigate()
  const { storeId } = useParams<{ storeId: string }>()
  const { data: store } = useStore(storeId!)
  const { data: pizzas } = usePizzas(storeId!)
  const { members, toppings } = useStoreDashboard(storeId!)
  const { data: isOwner } = useIsStoreOwner(storeId)

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

      {/* Store Header */}
      <div>
        {store && (
          <h1 className={cn(
            "text-4xl font-bold mb-2",
            "bg-gradient-to-r from-crimson to-burnt-sienna bg-clip-text text-transparent"
          )}>
            {store.name}
          </h1>
        )}
        <p className="text-muted-foreground">
          Store Dashboard
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">

        {/* Pizzas Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex h-12 items-center gap-2">
              <Pizza className="h-5 w-5 text-burnt-sienna" />
              Pizzas
            </CardTitle>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-burnt-sienna hover:text-burnt-sienna hover:bg-burnt-sienna/10"
            >
              <Link to={`/stores/${storeId}/pizzas`}>
                Manage
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Toppings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pizzas?.map((pizza) => {
                  return (
                    <TableRow key={pizza.id} onClick={() => navigate(`pizzas`)}>
                      <TableCell className="font-medium">
                        {pizza.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">
                          {pizza.pizza_toppings.length}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Toppings Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex h-12 items-center gap-2">
              <ShoppingBasket className="h-5 w-5 text-crimson" />
              Toppings
            </CardTitle>
            <RequireStoreOwner>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-crimson hover:text-crimson hover:bg-crimson/10"
              >
                <Link to={`/stores/${storeId}/toppings`}>
                  Manage
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </RequireStoreOwner>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {toppings.data?.map((topping) => (
                  <TableRow key={topping.id} onClick={() => isOwner ? navigate(`toppings`) : null}>
                    <TableCell>
                      <ToppingBadge topping={topping} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Store Members Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex h-12 items-center gap-2">
              <Users className="h-5 w-5 text-cool-gray" />
              Store Members
            </CardTitle>
            <RequireStoreOwner>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-cool-gray hover:text-cool-gray hover:bg-cool-gray/10"
              >
                <Link to={`/stores/${storeId}/settings`}>
                  Manage
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </RequireStoreOwner>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.data?.map((member) => (
                  <TableRow key={member.id} onClick={() => isOwner ? navigate(`settings`) : null}>
                    <TableCell className="flex items-center gap-2">
                      <UserCircle className="h-4 w-4 text-cool-gray" />
                      <span className="text-sm">{member.user_email}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={member.role === 'owner' ? 'default' : 'secondary'}
                        className={cn(
                          "flex w-fit items-center gap-1",
                          member.role === 'owner' ? 'bg-crimson' : ''
                        )}
                      >
                        {member.role === 'owner' ? (
                          <Crown className="h-3 w-3" />
                        ) : (
                          <ChefHat className="h-3 w-3" />
                        )}
                        {member.role}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}