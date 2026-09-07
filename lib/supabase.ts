import { createClient } from "@supabase/supabase-js";

const correctSupabaseUrl =
  "https://ljzrqrrmesqboidfoilw.supabase.co";

const configuredSupabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

const supabaseUrl =
  configuredSupabaseUrl === correctSupabaseUrl
    ? configuredSupabaseUrl
    : correctSupabaseUrl;

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY não está configurada."
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
