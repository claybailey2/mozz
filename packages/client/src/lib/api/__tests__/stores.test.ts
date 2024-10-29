import { describe, it, expect, vi } from 'vitest'
import { supabase } from '@/lib/supabase'
import { createStore, getStores, updateStore, deleteStore } from '../stores'
import { ValidationError } from '../validators'
import {mockData, mockResponses} from '../../../../test/utils'

describe('stores api', () => {
  describe('getStores', () => {
    it('should return stores successfully', async () => {
      const mockStores = [mockData.createStore(), mockData.createStore()]
      const selectMock = vi.fn().mockResolvedValue(mockResponses.success(mockStores))
      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      const result = await getStores()
      
      expect(result).toEqual(mockStores)
      expect(selectMock).toHaveBeenCalledOnce()
    })

    it('should throw error when query fails', async () => {
      const selectMock = vi.fn().mockResolvedValue(mockResponses.error('Database error'))
      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      await expect(getStores()).rejects.toThrow('Database error')
    })
  })
})