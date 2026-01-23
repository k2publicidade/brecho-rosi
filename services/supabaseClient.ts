import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!supabaseConfigured) {
  console.error('Supabase URL ou Key não encontrados. Verifique o arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
