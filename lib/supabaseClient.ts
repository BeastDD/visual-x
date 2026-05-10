import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export type Database = {
  public: {
    Tables: {
      channels: {
        Row: {
          id: string
          name: string
          icon: string | null
          description: string | null
          is_nsfw: boolean
          is_custom: boolean
          owner_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          icon?: string | null
          description?: string | null
          is_nsfw?: boolean
          is_custom?: boolean
          owner_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          // ... partial
        }
      }
      // Add more tables as needed
    }
  }
}