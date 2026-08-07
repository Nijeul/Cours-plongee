import { SCHEMA_COLORS, type SchemaColor } from "./palette";

import { cn } from "@/lib/utils";

/** Entrée de légende : puce colorée + libellé. */
export interface LegendItem {
  /** Couleur sémantique de la puce. */
  couleur: SchemaColor;
  /** Libellé affiché à côté de la puce. */
  libelle: string;
}

/** Props de l'encadré de légende. */
export interface LegendBoxProps {
  /** Entrées de la légende, dans l'ordre d'affichage. */
  items: LegendItem[];
  /** Classes additionnelles fusionnées sur le conteneur. */
  className?: string;
}

/**
 * Légende du schéma rendue en HTML (sous le SVG, dans le même conteneur
 * `<Figure>`) : plus lisible qu'une légende dessinée dans le SVG, surtout
 * en mobile où le texte SVG rétrécit avec le schéma.
 *
 * Composant serveur, sans état.
 */
export function LegendBox({ items, className }: LegendBoxProps) {
  return (
    <ul
      className={cn(
        "text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs",
        className
      )}
    >
      {items.map((item) => (
        <li key={item.libelle} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="inline-block size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: SCHEMA_COLORS[item.couleur] }}
          />
          {item.libelle}
        </li>
      ))}
    </ul>
  );
}
