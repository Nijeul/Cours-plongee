import { SCHEMA_COLORS } from "./palette";

/** Configuration d'une échelle verticale mètres → ordonnée (unités du viewBox). */
export interface DepthScaleConfig {
  /** Profondeur minimale en mètres (souvent 0, la surface). */
  minMetres: number;
  /** Profondeur maximale en mètres (le bas de l'axe). */
  maxMetres: number;
  /** Ordonnée correspondant à `minMetres` (haut de l'axe / surface). */
  yTop: number;
  /** Ordonnée correspondant à `maxMetres` (bas de l'axe). */
  yBottom: number;
}

/**
 * Crée une fonction d'échelle linéaire `profondeur (m) → y (viewBox)`.
 * À utiliser pour positionner plongeurs, curseurs et annotations de façon
 * cohérente avec le `<DepthAxis>` qui partage la même configuration.
 */
export function createDepthScale(config: DepthScaleConfig): (metres: number) => number {
  const { minMetres, maxMetres, yTop, yBottom } = config;
  const pente = (yBottom - yTop) / (maxMetres - minMetres);
  return (metres: number) => yTop + (metres - minMetres) * pente;
}

/**
 * Props de l'axe vertical de profondeur.
 */
export interface DepthAxisProps extends DepthScaleConfig {
  /** Abscisse de l'axe. */
  x: number;
  /** Pas des graduations en mètres. Par défaut 10. */
  pas?: number;
  /** Côté des libellés par rapport à l'axe. Par défaut `"gauche"`. */
  labelCote?: "gauche" | "droite";
  /** Couleur de l'axe et des libellés. Par défaut `SCHEMA_COLORS.neutre`. */
  color?: string;
}

/**
 * Axe vertical gradué en mètres (profondeur croissante vers le bas).
 * Trait principal, graduations et libellés `<text>` (« 10 m », « 20 m »…).
 *
 * Composant serveur, sans état.
 */
export function DepthAxis({
  x,
  minMetres,
  maxMetres,
  yTop,
  yBottom,
  pas = 10,
  labelCote = "gauche",
  color = SCHEMA_COLORS.neutre,
}: DepthAxisProps) {
  const echelle = createDepthScale({ minMetres, maxMetres, yTop, yBottom });
  const graduations: number[] = [];
  for (let m = minMetres; m <= maxMetres; m += pas) {
    graduations.push(m);
  }
  const versLabel = labelCote === "gauche" ? -1 : 1;

  return (
    <g stroke="none" fill="none">
      <line x1={x} y1={yTop} x2={x} y2={yBottom} stroke={color} strokeWidth={1.5} />
      {graduations.map((m) => {
        const y = echelle(m);
        return (
          <g key={m}>
            <line
              x1={x}
              y1={y}
              x2={x + versLabel * 6}
              y2={y}
              stroke={color}
              strokeWidth={1.5}
            />
            <text
              x={x + versLabel * 10}
              y={y + 4}
              fill={color}
              fontSize={11}
              textAnchor={labelCote === "gauche" ? "end" : "start"}
            >
              {m}&nbsp;m
            </text>
          </g>
        );
      })}
    </g>
  );
}
