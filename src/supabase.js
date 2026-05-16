import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://gjdlviuvbohhzrzlilkg.supabase.co'
const supabaseKey = 'sb_publishable_kjWOi6jdGEvb1un63meOsQ_32x5THHp'
export const supabase = createClient(supabaseUrl, supabaseKey)
