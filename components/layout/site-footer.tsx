import Link from "next/link";
import { Info } from "lucide-react";

import { DISCLAIMER, REGLEMENTATION_DATE } from "@/content/data/reglementation";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div
          role="note"
          aria-label="Avertissement réglementaire"
          className="border-primary/25 bg-primary/5 text-foreground flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
        >
          <Info aria-hidden="true" className="text-primary mt-0.5 size-4 shrink-0" />
          <p className="font-medium">{DISCLAIMER}</p>
        </div>

        <div className="text-muted-foreground mt-6 flex flex-col gap-4 text-sm sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md space-y-1">
            <p className="text-foreground font-semibold">Théorie Plongée</p>
            <p>
              Révision de la théorie de la plongée du Niveau 1 au MF1 : cours, entraînement,
              révision espacée et examens blancs.
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-foreground font-medium">Sources</p>
            <p>Manuel de Formation Technique FFESSM.</p>
            <p>Code du sport (art. A.322-71 à A.322-101 et annexes).</p>
            <p>Valeurs réglementaires vérifiées le {REGLEMENTATION_DATE}.</p>
          </div>
        </div>

        <div className="text-muted-foreground mt-6 flex flex-col gap-2 border-t pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Théorie Plongée — contenu de révision indépendant, non
            affilié à la FFESSM.
          </p>
          <Link href="/" className="hover:text-foreground underline-offset-4 hover:underline">
            Accueil
          </Link>
        </div>
      </div>
    </footer>
  );
}
