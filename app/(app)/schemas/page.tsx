import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { getCatalogModule } from "@/lib/catalog";

import { SCHEMA_REGISTRY } from "./registry";

export const metadata: Metadata = {
  title: "Schémas",
  description:
    "Tous les schémas pédagogiques de la plateforme, classés par domaine : physique, physiologie, tables, réglementation, matériel et pédagogie.",
};

/**
 * Page registre des schémas : chaque schéma est affiché avec son titre et des
 * liens vers les modules de cours qui l'utilisent. Sert de planche de
 * révision visuelle et de page de contrôle (rendu clair/sombre, mobile).
 */
export default function SchemasPage() {
  const total = SCHEMA_REGISTRY.reduce((somme, d) => somme + d.entries.length, 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Schémas</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          Les {total} schémas pédagogiques de la plateforme, classés par domaine. Chacun est
          intégré dans les cours au fil du texte — cette page les rassemble pour réviser en un
          coup d&apos;œil et retrouver le module correspondant.
        </p>
      </header>

      <nav aria-label="Domaines" className="mb-10 flex flex-wrap gap-2">
        {SCHEMA_REGISTRY.map((domaine) => (
          <a
            key={domaine.domaine}
            href={`#${slugifyDomaine(domaine.domaine)}`}
            className="bg-muted hover:bg-muted/70 text-foreground rounded-full px-3 py-1 text-sm font-medium"
          >
            {domaine.domaine}
          </a>
        ))}
      </nav>

      <div className="space-y-14">
        {SCHEMA_REGISTRY.map((domaine) => (
          <section key={domaine.domaine} aria-labelledby={slugifyDomaine(domaine.domaine)}>
            <h2
              id={slugifyDomaine(domaine.domaine)}
              className="scroll-mt-20 border-b pb-2 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              {domaine.domaine}
              <span className="text-muted-foreground ml-2 text-base font-normal">
                {domaine.entries.length} schéma{domaine.entries.length > 1 ? "s" : ""}
              </span>
            </h2>

            <div className="mt-6 space-y-10">
              {domaine.entries.map(({ exportName, titre, Component, modules }) => (
                <article key={exportName}>
                  <h3 className="font-semibold">{titre}</h3>
                  <div className="bg-card text-card-foreground mt-3 overflow-hidden rounded-xl border p-4 shadow-sm sm:p-6">
                    <Component />
                  </div>
                  {modules.length > 0 ? (
                    <p className="text-muted-foreground mt-2.5 flex flex-wrap items-center gap-1.5 px-1 text-sm">
                      <span>Dans les cours :</span>
                      {modules.map((slug) => {
                        const cours = getCatalogModule(slug);
                        return (
                          <Link key={slug} href={`/cours/${slug}`} className="no-underline">
                            <Badge variant="outline" className="hover:bg-muted font-normal">
                              {cours ? cours.title : slug}
                            </Badge>
                          </Link>
                        );
                      })}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

/** Ancre stable et lisible pour chaque section de domaine. */
function slugifyDomaine(domaine: string): string {
  return domaine
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
