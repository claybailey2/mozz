import { useMutation } from '@tanstack/react-query'
import { resetPassword, updatePassword } from '@/lib/api/auth'

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword
  })
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: updatePassword
  })
}
