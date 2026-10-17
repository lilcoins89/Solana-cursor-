import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createServerClient(options?: { serviceRole?: boolean }) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!
  const key = options?.serviceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY!
    : process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY!

  return createSupabaseClient(url, key)
}
