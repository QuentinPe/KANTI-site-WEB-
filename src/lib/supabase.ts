import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zoqpsjodmlazmottqshl.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_GLFFA7Uvvu7ZxM1pqWO4lQ_4XIQ2Sdy'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY
)
