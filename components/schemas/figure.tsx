import type { ReactNode } from "react";

import "./primitives/schema-theme.css";

import { cn } from "@/lib/utils";

/** Props du conteneur de figure pédagogique. */
export interface FigureProps {
  /** Numéro de la figure dans le module (« Figure 3 — … »). */
  n: number;
  /** Titre court de la figure, affiché dans la légende. */
  titre: string;
  /**
   * Description textuelle complète du schéma pour les lecteurs d'écran et
   * les personnes non-voyantes : décrire ce que le schéma montre et la
   * conclusion à en tirer. Rendue dans un `<details>` repliable.
   */
  description: string;
  /** Le schéma lui-même (en général un `<SchemaSvg>` + `<LegendBox>`). */
  children: ReactNode;
  /** Classes additionnelles fusionnées sur le `<figure>`. */
  className?: string;
}

/**
 * Conteneur de présentation des schémas dans les MDX : carte bordée
 * contenant le schéma, légende « Figure n — titre », puis description
 * textuelle repliable (accessibilité).
 *
 * Composant serveur, sans état (`<details>`/`<summary>` natifs).
 *
 * @example
 * ```mdx
 * <Figure n={1} titre="Pression et profondeur" description="…">
 *   <SchemaSvg …>…</SchemaSvg>
 *   <LegendBox items={[…]} />
 * </Figure>
 * ```
 */
export function Figure({ n, titre, description, children, className }: FigureProps) {
  return (
    <figure className={cn("my-8", className)}>
      <div className="bg-card text-card-foreground overflow-hidden rounded-xl border p-4 shadow-sm sm:p-6">
        {children}
      </div>
      <figcaption className="text-muted-foreground mt-2.5 px-1 text-sm leading-6">
        <span className="text-foreground font-medium">Figure {n}</span>
        {" — "}
        {titre}
      </figcaption>
      <details className="group mt-1.5 px-1 text-sm">
        <summary className="text-muted-foreground hover:text-foreground w-fit cursor-pointer list-none rounded-md font-medium underline-offset-4 select-none hover:underline [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true" className="mr-1 inline-block transition-transform group-open:rotate-90">
            ›
          </span>
          Description du schéma
        </summary>
        <p className="text-muted-foreground mt-2 border-l-2 pl-3 leading-6">{description}</p>
      </details>
    </figure>
  );
}
