import { createClient } from '@supabase/supabase-js'

// This client should ONLY be used in Server Actions or Route Handlers
// because it bypasses Row Level Security (RLS) policies completely.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
