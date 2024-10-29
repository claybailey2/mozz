import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'
import { QueryClient } from '@tanstack/react-query'

// Create a queryClient instance that can be imported where needed
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

interface AuthStore {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  initialize: () => Promise<() => void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  },
  signUp: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    
    // Clear any existing queries when signing up
    queryClient.clear()
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    // Clear all queries when signing out
    queryClient.clear()
    set({ user: null })
  },
  initialize: async () => {
    try {
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession()
      
      // Clear queries if no session exists
      if (!session) {
        queryClient.clear()
      }
      
      set({ user: session?.user ?? null })

      // Set up auth state change listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null })
        
        // Clear queries when auth state changes
        if (!session?.user) {
          queryClient.clear()
        }
      })

      // Set loading to false after initial check
      set({ loading: false })

      // Cleanup subscription on unmount
      return () => subscription.unsubscribe()
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ loading: false })
      return () => {};
    }
  },
}))