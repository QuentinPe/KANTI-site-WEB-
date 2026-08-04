import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "https://zoqpsjodmlazmottqshl.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "sb_publishable_GLFFA7Uvvu7ZxM1pqWO4lQ_4XIQ2Sdy";

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
