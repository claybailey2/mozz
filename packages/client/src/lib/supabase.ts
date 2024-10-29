import { createClient } from '@supabase/supabase-js'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string
          created_at: string
          name: string
          owner_id: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          created_at?: string
        }
      }
      store_members: {
        Row: {
          id: string
          store_id: string
          user_id: string
          role: 'owner' | 'chef'
          status: 'invited' | 'active'
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          user_id: string
          role: 'owner' | 'chef'
          status?: 'invited' | 'active'
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          user_id?: string
          role?: 'owner' | 'chef'
          status?: 'invited' | 'active'
          created_at?: string
        }
      }
      toppings: {
        Row: {
          id: string
          store_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          name?: string
          created_at?: string
        }
      }
      pizzas: {
        Row: {
          id: string
          store_id: string
          name: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          name: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          name?: string
          created_by?: string
          created_at?: string
        }
      }
      pizza_toppings: {
        Row: {
          id: string
          pizza_id: string
          topping_id: string
        }
        Insert: {
          id?: string
          pizza_id: string
          topping_id: string
        }
        Update: {
          id?: string
          pizza_id?: string
          topping_id?: string
        }
      }
    }
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)