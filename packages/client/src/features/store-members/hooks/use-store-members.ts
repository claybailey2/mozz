import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  getStoreMembers, 
  signUpAndAcceptInvite,
  signInAndAcceptInvite,
  inviteChef,
  removeStoreMember,
  InviteChefData,
  checkStoreMembership,
} from '@/lib/api/store-members'
import { useToast } from '@/hooks/use-toast'

export function useStoreMembers(storeId: string) {
  return useQuery({
    queryKey: ['store-members', storeId],
    queryFn: () => getStoreMembers(storeId),
  })
}

export function useInviteChef(storeId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({email, role}: InviteChefData) => inviteChef(storeId, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-members', storeId] })
      toast({
        title: 'Success',
        description: 'Chef invitation sent successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to invite chef',
      })
    },
  })
}

export function useSignUpAndAcceptInvite() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: signUpAndAcceptInvite,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Account created and invitation accepted.',
      })
    },
    onError: (error: any) => { // type as any to access status
      console.log( error )
      if (error?.status === 409) {
        toast({
          variant: 'destructive',
          title: 'Account Already Exists',
          description: 'Please use the "Sign In Instead" button to log in with your existing account.',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to create account',
        })
      }
    },
  })
}

export function useSignInAndAcceptInvite() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: signInAndAcceptInvite,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Signed in and accepted invitation.',
      })
    },
    onError: (error) => {
      console.log( error )
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to sign in',
      })
    },
  })
}

export function useRemoveStoreMember(storeId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (email: string) => removeStoreMember(storeId, email),
    onSuccess: () => {
      // Invalidate and refetch store members
      queryClient.invalidateQueries({ queryKey: ['store-members', storeId] })
      toast({
        title: 'Success',
        description: 'Member removed successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to remove member',
      })
    },
  })
}

export function useCheckStoreMembership(storeId: string | undefined) {
  return useQuery({
    queryKey: ['store-membership', storeId],
    queryFn: () => storeId ? checkStoreMembership(storeId) : false,
    enabled: !!storeId,
  })
}
