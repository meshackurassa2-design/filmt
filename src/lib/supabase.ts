import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tczatqwqeoxtohvpytxr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjemF0cXdxZW94dG9odnB5dHhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2NTQ1NjMsImV4cCI6MjA5MDIzMDU2M30._tcsW3COfV5ebKGUbAhBo-MhUc5-BuAuyPlwpj9SjHg';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Critical Error: Supabase credentials could not be initialized.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
