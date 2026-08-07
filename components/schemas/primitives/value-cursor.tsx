import { SCHEMA_COLORS } from "./palette";

/** Props du curseur de valeur. */
export interface ValueCursorProps {
  /** Abscisse du point visé (sur l'axe ou la courbe). */
  x: number;
  /** Ordonnée du point visé. */
  y: number;
  /** Texte de la pastille (ex. « 3 bar », « 20 m », « palier 3 min »). */
  label: string;
  /** Côté où poser la pastille par rapport au point. Par défaut `"droite"`. */
  cote?: "droite" | "gauche";
  /** Couleur du curseur. Par défaut `SCHEMA_COLORS.pression`. */
  color?: string;
}

/** Largeur approximative de la pastille selon la longueur du libellé. */
function largeurPastille(label: string): number {
  return Math.max(34, Math.round(label.length * 6.8) + 16);
}

/**
 * Curseur de valeur : point marqué sur un axe ou une courbe, relié à une
 * pastille arrondie contenant la valeur. Pastille sur fond carte avec trait
 * et texte colorés (lisible dans les deux thèmes).
 *
 * Composant serveur, sans état.
 */
export function ValueCursor({
  x,
  y,
  label,
  cote = "droite",
  color = SCHEMA_COLORS.pression,
}: ValueCursorProps) {
  const sens = cote === "droite" ? 1 : -1;
  const largeur = largeurPastille(label);
  const debutPastille = x + sens * 11;
  const rectX = cote === "droite" ? debutPastille : debutPastille - largeur;

  return (
    <g>
      <circle cx={x} cy={y} r={3.5} fill={color} stroke="none" />
      <line
        x1={x + sens * 3.5}
        y1={y}
        x2={debutPastille}
        y2={y}
        stroke={color}
        strokeWidth={1.5}
      />
      <rect
        x={rectX}
        y={y - 10}
        width={largeur}
        height={20}
        rx={10}
        fill="var(--card, transparent)"
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={rectX + largeur / 2}
        y={y + 4}
        fill={color}
        fontSize={12}
        fontWeight={600}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
}
