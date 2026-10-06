import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || 'https://ndjretqmgtxlnlrfmxtx.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_o1jfCV4NNi-uk7g08yVaJQ_zQThOgY7';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SupabaseConfig {
  url: string;
  isReady: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => ({
  url: supabaseUrl,
  isReady: isSupabaseConfigured,
});
