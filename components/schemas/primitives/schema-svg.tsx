import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Props du wrapper SVG commun à tous les schémas.
 */
export interface SchemaSvgProps {
  /** Largeur du viewBox (unités internes du schéma, ~480–560 recommandé). */
  viewBoxWidth: number;
  /** Hauteur du viewBox (unités internes du schéma). */
  viewBoxHeight: number;
  /** Titre accessible du schéma (rendu en `<title>` + `aria-label`). */
  titre: string;
  /** Description courte optionnelle (rendue en `<desc>`). */
  description?: string;
  /** Classes additionnelles fusionnées sur le `<svg>`. */
  className?: string;
  /** Contenu du schéma (primitives et formes). */
  children: ReactNode;
}

/**
 * Wrapper `<svg>` de base : viewBox paramétrable, largeur fluide
 * (100 % du conteneur, hauteur automatique), `role="img"` et titre/description
 * accessibles. Le texte hérite de la couleur du thème via `currentColor`
 * (classe `text-foreground`) et de la police de l'application.
 *
 * Composant serveur, sans état.
 */
export function SchemaSvg({
  viewBoxWidth,
  viewBoxHeight,
  titre,
  description,
  className,
  children,
}: SchemaSvgProps) {
  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      role="img"
      aria-label={titre}
      className={cn("text-foreground block h-auto w-full", className)}
      fontFamily="inherit"
      fontSize={12}
    >
      <title>{titre}</title>
      {description ? <desc>{description}</desc> : null}
      {children}
    </svg>
  );
}
