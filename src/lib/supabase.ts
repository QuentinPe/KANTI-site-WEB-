import { createClient } from '@supabase/supabase-js'

// The anon key is a publishable client key · safe in client-side bundles.
// Env vars take precedence; the literals are fallbacks for environments that
// don't inject VITE_ vars (Lovable preview, local dev without .env, etc.).
const SUPABASE_URL = 'https://zoqpsjodmlazmottqshl.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_GLFFA7Uvvu7ZxM1pqWO4lQ_4XIQ2Sdy'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY
)
