import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mqixllpuxgldwlqgetck.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xaXhsbHB1eGdsZHdscWdldGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NzkwMzYsImV4cCI6MjA3MTU1NTAzNn0.M5JiZvMS_Q-NTsuxCxqBWB_hezorqy2L8YbijO6gOmI';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Using placeholder values.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
