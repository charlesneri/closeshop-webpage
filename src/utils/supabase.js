import { createClient } from '@supabase/supabase-js'

// Use fallback values for production if needed
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Add this debug log
console.log('Supabase URL loaded:', !!supabaseUrl)
console.log('Supabase Key loaded:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  // For production, you might want to show a user-friendly error
  throw new Error('Supabase configuration is missing')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
