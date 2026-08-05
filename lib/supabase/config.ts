/**
 * Configuration Supabase.
 * L'application fonctionne sans variables d'environnement Supabase :
 * dans ce cas, la progression est stockée en localStorage (mode invité).
 */

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

/**
 * Retourne les variables d'environnement Supabase, ou null si absentes.
 * NB : les accès à process.env.NEXT_PUBLIC_* doivent rester littéraux
 * (remplacement statique au build par Next.js).
 */
export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

/** Vrai si les deux variables Supabase sont présentes et non vides. */
export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}
