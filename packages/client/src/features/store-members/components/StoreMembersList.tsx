import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Badge } from '@/components/ui/badge'
import { useStoreMembers, useInviteChef, useRemoveStoreMember } from '../hooks/use-store-members'

export function StoreMembersList() {
  const { storeId } = useParams<{ storeId: string }>()
  if (!storeId) throw new Error('Store ID is required')

  const { data: members, isLoading } = useStoreMembers(storeId)
  const inviteChef = useInviteChef(storeId)
  const removeMember = useRemoveStoreMember(storeId)

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<{ id: string, email: string } | null>(null)
  const [email, setEmail] = useState('')

  if (isLoading) {
    return <div>Loading members...</div>
  }

  const handleInviteChef = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    try {
      await inviteChef.mutateAsync(email)
      setEmail('')
      setIsInviteDialogOpen(false)
    } catch (error) {
      console.error('Failed to invite chef:', error)
    }
  }

  const handleRemoveMember = async () => {
    if (!memberToRemove) return

    try {
      await removeMember.mutateAsync(memberToRemove.email)
      setMemberToRemove(null)
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => setIsInviteDialogOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        Invite Chef
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members?.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.user_email}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>
                <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                  {member.status}
                </Badge>
              </TableCell>
              <TableCell>
                {member.role !== 'owner' && (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setMemberToRemove({ 
                      id: member.id, 
                      email: member.user_email 
                    })}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Chef</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInviteChef} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter chef's email"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInviteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={inviteChef.isPending}>
                {inviteChef.isPending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {memberToRemove?.email} from this store. 
              They will no longer have access to any store features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveMember}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}