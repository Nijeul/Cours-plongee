import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseEnv } from "@/lib/supabase/config";

/**
 * Rafraîchit la session Supabase (pattern officiel @supabase/ssr) :
 * relit les cookies de la requête, rafraîchit le jeton si nécessaire et
 * propage les cookies mis à jour dans la réponse.
 * No-op si Supabase n'est pas configuré (mode invité).
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let supabaseResponse = NextResponse.next({ request });

  const env = getSupabaseEnv();
  if (!env) return supabaseResponse;

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT : ne rien insérer entre la création du client et cet appel.
  // getUser() rafraîchit le jeton d'authentification si nécessaire.
  await supabase.auth.getUser();

  return supabaseResponse;
}
