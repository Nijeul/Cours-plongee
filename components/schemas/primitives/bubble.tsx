import { SCHEMA_COLORS } from "./palette";

/** Props d'une bulle d'air isolée. */
export interface BubbleProps {
  /** Abscisse du centre de la bulle. */
  x: number;
  /** Ordonnée du centre de la bulle. */
  y: number;
  /** Rayon. Par défaut 4. */
  r?: number;
  /** Couleur. Par défaut `SCHEMA_COLORS.air`. */
  color?: string;
}

/**
 * Bulle d'air stylisée : cercle au trait fin, remplissage translucide et
 * petit reflet en haut à gauche.
 *
 * Composant serveur, sans état.
 */
export function Bubble({ x, y, r = 4, color = SCHEMA_COLORS.air }: BubbleProps) {
  return (
    <g aria-hidden="true">
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={color}
        fillOpacity={0.12}
        stroke={color}
        strokeWidth={1.5}
      />
      {r >= 3 ? (
        <path
          d={`M ${x - r * 0.55} ${y - r * 0.1} A ${r * 0.6} ${r * 0.6} 0 0 1 ${x - r * 0.1} ${y - r * 0.55}`}
          fill="none"
          stroke={color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.7}
        />
      ) : null}
    </g>
  );
}

/** Props d'un chapelet de bulles remontant vers la surface. */
export interface BubbleColumnProps {
  /** Abscisse moyenne de la colonne. */
  x: number;
  /** Ordonnée de départ (en bas, près du plongeur). */
  yFrom: number;
  /** Ordonnée d'arrivée (en haut, vers la surface). `yTo < yFrom`. */
  yTo: number;
  /** Nombre de bulles. Par défaut 6. */
  count?: number;
  /** Couleur. Par défaut `SCHEMA_COLORS.air`. */
  color?: string;
}

/**
 * Colonne de bulles déterministe (aucun aléatoire, rendu stable côté
 * serveur) : léger zigzag horizontal et rayon croissant vers la surface,
 * comme des bulles qui se dilatent en remontant.
 *
 * Composant serveur, sans état.
 */
export function BubbleColumn({
  x,
  yFrom,
  yTo,
  count = 6,
  color = SCHEMA_COLORS.air,
}: BubbleColumnProps) {
  const bulles = Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count; // 0 → près du départ, 1 → près de la surface
    return {
      x: x + ((i % 3) - 1) * 5,
      y: yFrom + (yTo - yFrom) * t,
      r: 2 + t * 2.8,
    };
  });

  return (
    <g aria-hidden="true">
      {bulles.map((b, i) => (
        <Bubble key={i} x={b.x} y={b.y} r={b.r} color={color} />
      ))}
    </g>
  );
}
