import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { getSupabaseEnv } from "@/lib/supabase/config";

/**
 * Client Supabase côté serveur (Server Components, Route Handlers, Server Actions).
 * Retourne null si Supabase n'est pas configuré (mode invité).
 *
 * À créer à chaque requête — ne jamais le stocker dans une variable globale.
 */
export async function createClient(): Promise<SupabaseClient | null> {
  const env = getSupabaseEnv();
  if (!env) return null;

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Appelé depuis un Server Component : les cookies ne peuvent pas
          // y être écrits. Sans gravité si le middleware rafraîchit la session.
        }
      },
    },
  });
}
