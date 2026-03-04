// public/supabase.js
// Supabase auth client — reads credentials from window.__ENV__
// which is injected by index.html (set your real keys there or via Vercel env vars)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const env = window.__ENV__ || {};

if (!env.SUPABASE_URL || env.SUPABASE_URL === 'PASTE_SUPABASE_URL') {
  console.warn('⚠ Supabase URL not configured. Auth will not work.');
}

export const supabase = createClient(
  env.SUPABASE_URL  || '',
  env.SUPABASE_ANON_KEY || '',
  {
    auth: {
      persistSession: true,       // keeps user logged in across page reloads
      autoRefreshToken: true,
    }
  }
);

// Restore existing session on load (returns null if none)
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data?.session ?? null;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  await supabase.auth.signOut();
}
