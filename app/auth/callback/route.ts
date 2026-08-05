import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Callback d'authentification Supabase (flux PKCE) : échange le code reçu
 * par email (confirmation, lien magique, réinitialisation) contre une session,
 * puis redirige vers la destination demandée (`next=`, par défaut /dashboard).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Destination sûre : uniquement un chemin relatif interne.
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/connexion?erreur=lien-invalide`);
}
