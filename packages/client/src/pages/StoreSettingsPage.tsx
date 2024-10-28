import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StoreMembersList } from '@/features/store-members/components/StoreMembersList'

export function StoreSettingsPage() {
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
        <h1 className="text-3xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground">
          Manage store members and configurations
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Store Members</h2>
        <StoreMembersList />
      </div>
    </div>
  )
}