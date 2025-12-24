import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && 
  !supabaseUrl.includes('placeholder');

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : new Proxy({} as SupabaseClient, {
      get: () => () => {
        console.warn('Supabase not configured properly. Operation ignored.');
        return { data: null, error: new Error('Supabase not configured') };
      }
    });
