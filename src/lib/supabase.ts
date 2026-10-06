// SPARE Supabase Driver Configuration
// Connects to PostgreSQL Supabase instance when environment variables are set.

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export interface SupabaseConfig {
  url: string;
  isReady: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => ({
  url: supabaseUrl,
  isReady: isSupabaseConfigured,
});
