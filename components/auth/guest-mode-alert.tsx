import { Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * Alerte affichée sur les pages d'authentification quand Supabase n'est pas
 * configuré : l'application fonctionne alors en mode invité.
 */
export function GuestModeAlert() {
  return (
    <Alert>
      <Info />
      <AlertTitle>Mode invité actif</AlertTitle>
      <AlertDescription>
        <p>
          Ce déploiement n’est pas relié à Supabase : la création de compte et la connexion sont
          désactivées. Votre progression est enregistrée localement dans ce navigateur et reste
          disponible tant que vous ne videz pas ses données.
        </p>
        <p className="mt-2">
          Pour activer les comptes et la synchronisation entre appareils, renseignez les variables
          d’environnement <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
          <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> en suivant le
          guide de déploiement (<code className="font-mono text-xs">docs/DEPLOY.md</code>).
        </p>
      </AlertDescription>
    </Alert>
  );
}
