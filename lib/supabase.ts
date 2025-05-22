import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Add environment variable check logs
console.log('Supabase URL:', supabaseUrl ? 'Configured' : 'Not configured');
console.log('Supabase Key:', supabaseKey ? 'Configured' : 'Not configured');

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase environment variable missing:', {
    url: supabaseUrl ? 'Configured' : 'Not configured',
    key: supabaseKey ? 'Configured' : 'Not configured'
  });
  throw new Error('Supabase URL or Key is missing! Please check if NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set correctly.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
