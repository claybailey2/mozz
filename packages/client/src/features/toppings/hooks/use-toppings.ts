import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getToppings, createTopping, updateTopping, deleteTopping } from '@/lib/api/toppings'
import { useToast } from '@/hooks/use-toast'
import { useCallback } from 'react'
import tinycolor from 'tinycolor2'
import { ValidationError } from '@/lib/api/validators'

export function useToppings(storeId: string) {
  return useQuery({
    queryKey: ['toppings', storeId],
    queryFn: () => getToppings(storeId),
  })
}

export function useCreateTopping(storeId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: (name: string) => 
      createTopping(storeId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toppings', storeId] })
      toast({
        title: 'Success',
        description: 'Topping created successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof ValidationError ? error.message : 'Failed to create topping',
      })
    },
  })
}

export function useUpdateTopping(storeId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      updateTopping(id, storeId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toppings', storeId] })
      toast({
        title: 'Success',
        description: 'Topping updated successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof ValidationError ? error.message : 'Failed to update topping',
      })
    },
  })
}

export function useDeleteTopping(storeId: string) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: deleteTopping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toppings', storeId] })
      toast({
        title: 'Success',
        description: 'Topping deleted successfully',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof ValidationError ? error.message : 'Failed to delete topping',
      })
    },
  })
}

function luminance(color: tinycolor.Instance) {
  const { r, g, b } = color.toRgb()
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

function hashStringToColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const r = (hash >> 0) & 0xff
  const g = (hash >> 8) & 0xff
  const b = (hash >> 16) & 0xff
  return tinycolor({ r, g, b })
}

export function useToppingColor() {
  return useCallback((toppingId: string) => {
    const color = hashStringToColor(toppingId)
    const {h, s, v} = color.toHsv()
    const scaledH = -75 + (h / 360) * (75 + 75)
    const scaledS = 0.35 + s * (1 - 0.35)
    const scaledV = v
    const finalColor = tinycolor({ h: scaledH, s: scaledS, v: scaledV })
    const lum = luminance(finalColor)
    const isDark = lum < 0.5
    return { color: finalColor.toHexString(), isDark }
  }, [])
}
