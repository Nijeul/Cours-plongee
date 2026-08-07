import { SCHEMA_COLORS } from "./palette";

/**
 * Props du fond aquatique (surface + dégradé de profondeur).
 */
export interface WaterBackgroundProps {
  /** Bord gauche de la zone d'eau (unités du viewBox). Par défaut 0. */
  x?: number;
  /** Largeur de la zone d'eau. */
  width: number;
  /** Ordonnée de la surface de l'eau. */
  surfaceY: number;
  /** Ordonnée du bas de la zone d'eau (fond du schéma). */
  bottomY: number;
  /** Couleur de l'eau. Par défaut `SCHEMA_COLORS.eau`. */
  color?: string;
  /**
   * Identifiant du dégradé SVG. À personnaliser uniquement si plusieurs
   * `WaterBackground` de couleurs différentes coexistent sur la même page
   * (des dégradés identiques peuvent partager le même id sans dommage).
   */
  gradientId?: string;
}

/** Construit le tracé des vaguelettes de surface (quadratiques alternées). */
function traceVaguelettes(x: number, width: number, y: number): string {
  const longueurOnde = 18;
  const amplitude = 1.8;
  const n = Math.max(2, Math.round(width / longueurOnde));
  const w = width / n;
  let d = `M ${x} ${y}`;
  for (let i = 0; i < n; i++) {
    d += ` q ${w / 4} ${-amplitude} ${w / 2} 0 q ${w / 4} ${amplitude} ${w / 2} 0`;
  }
  return d;
}

/**
 * Fond d'eau stylisé : ligne de surface avec vaguelettes discrètes et
 * dégradé vertical très léger suggérant la profondeur. À placer en premier
 * dans le `<SchemaSvg>` (dessiné sous le reste).
 *
 * Composant serveur, sans état.
 */
export function WaterBackground({
  x = 0,
  width,
  surfaceY,
  bottomY,
  color = SCHEMA_COLORS.eau,
  gradientId = "schema-degrade-eau",
}: WaterBackgroundProps) {
  return (
    <g aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0.16} />
          <stop offset="1" stopColor={color} stopOpacity={0.03} />
        </linearGradient>
      </defs>
      <rect
        x={x}
        y={surfaceY}
        width={width}
        height={bottomY - surfaceY}
        fill={`url(#${gradientId})`}
      />
      <path
        d={traceVaguelettes(x, width, surfaceY)}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.85}
      />
    </g>
  );
}
