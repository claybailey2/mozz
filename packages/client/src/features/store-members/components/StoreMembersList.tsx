import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, UserX, Crown, ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
import { cn } from '@/lib/utils'

interface InviteFormData {
  email: string;
  role: 'chef' | 'owner';
}

export function StoreMembersList() {
  const { storeId } = useParams<{ storeId: string }>()
  if (!storeId) throw new Error('Store ID is required')

  const { data: members, isLoading } = useStoreMembers(storeId)
  const inviteChef = useInviteChef(storeId)
  const removeMember = useRemoveStoreMember(storeId)

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<{ id: string, email: string } | null>(null)
  const [inviteData, setInviteData] = useState<InviteFormData>({
    email: '',
    role: 'chef'
  })

  if (isLoading) {
    return <div>Loading members...</div>
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteData.email.trim()) return

    try {
      await inviteChef.mutateAsync({
        email: inviteData.email,
        role: inviteData.role
      })
      setInviteData({ email: '', role: 'chef' })
      setIsInviteDialogOpen(false)
    } catch (error) {
      console.error('Failed to invite member:', error)
    }
  }

  const handleRemoveMember = async () => {
    if (!memberToRemove) return

    try {
      await removeMember.mutateAsync(memberToRemove.id)
      setMemberToRemove(null)
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
  }

  const getRoleBadgeStyles = (role: string) => {
    return role === 'owner' 
      ? 'bg-gradient-to-r from-crimson to-burnt-sienna text-white'
      : 'bg-cool-gray/10 text-cool-gray'
  }

  return (
    <div className="space-y-6">
      <Button 
        onClick={() => setIsInviteDialogOpen(true)}
        className="bg-gradient-to-r from-crimson to-burnt-sienna"
      >
        <Plus className="w-4 h-4 mr-2" />
        Invite Member
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
              <TableCell>
                <Badge 
                  variant="secondary"
                  className={cn(
                    "flex w-fit items-center gap-2",
                    getRoleBadgeStyles(member.role)
                  )}
                >
                  {member.role === 'owner' 
                    ? <Crown className="h-3 w-3" />
                    : <ChefHat className="h-3 w-3" />
                  }
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                  {member.status}
                </Badge>
              </TableCell>
              <TableCell>
                {member.role !== 'owner' && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setMemberToRemove({ 
                      id: member.id, 
                      email: member.user_email 
                    })}
                    className="hover:text-red-600 hover:bg-red-50"
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
            <DialogTitle>Invite Store Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={inviteData.email}
                onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Role</Label>
              <RadioGroup
                value={inviteData.role}
                onValueChange={(value: 'chef' | 'owner') => 
                  setInviteData(prev => ({ ...prev, role: value }))}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="chef" id="chef" />
                  <Label 
                    htmlFor="chef" 
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <ChefHat className="h-4 w-4 text-cool-gray" />
                    Chef
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="owner" id="owner" />
                  <Label 
                    htmlFor="owner" 
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Crown className="h-4 w-4 text-crimson" />
                    Owner
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInviteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={inviteChef.isPending}
                className="bg-gradient-to-r from-crimson to-burnt-sienna"
              >
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