/**
 * Silhouette de plongeur stylisée, dessinée dans un repère local de
 * 120 × 44 unités (centre ≈ (60, 22)), tête vers la droite.
 */

/** Orientations prédéfinies de la silhouette. */
export type DiverOrientation = "droite" | "gauche" | "descente" | "montee";

/** Props de la silhouette de plongeur. */
export interface DiverSilhouetteProps {
  /** Abscisse du centre du plongeur (unités du viewBox). */
  x: number;
  /** Ordonnée du centre du plongeur. */
  y: number;
  /**
   * Orientation : `"droite"` (horizontal, tête à droite, défaut),
   * `"gauche"` (miroir), `"descente"` (piqué vers le bas-droite),
   * `"montee"` (remontée vers le haut-droite).
   */
  orientation?: DiverOrientation;
  /** Rotation additionnelle en degrés (appliquée après l'orientation). */
  angle?: number;
  /** Facteur d'échelle. `1` ≈ 120 unités de long. Par défaut 0.8. */
  scale?: number;
  /** Couleur de remplissage. Par défaut `currentColor`. */
  color?: string;
}

const ANGLES: Record<DiverOrientation, number> = {
  droite: 0,
  gauche: 0,
  descente: 40,
  montee: -40,
};

/**
 * Silhouette de plongeur (tracé simple, remplissage `currentColor` par
 * défaut) : corps profilé, tête, bras replié et palmes. Orientable et
 * redimensionnable via `orientation`, `angle` et `scale`.
 *
 * Composant serveur, sans état.
 */
export function DiverSilhouette({
  x,
  y,
  orientation = "droite",
  angle = 0,
  scale = 0.8,
  color = "currentColor",
}: DiverSilhouetteProps) {
  const miroir = orientation === "gauche" ? -1 : 1;
  const rotation = ANGLES[orientation] + angle;
  const transform = `translate(${x} ${y}) rotate(${rotation}) scale(${miroir * scale} ${scale}) translate(-60 -22)`;

  return (
    <g transform={transform} fill={color} stroke="none" aria-hidden="true">
      {/* Tête */}
      <circle cx={103} cy={16} r={7} />
      {/* Corps, jambes et palmes */}
      <path
        d="M 94 15
           C 86 10 72 10 60 14
           C 48 18 36 20 26 18
           L 10 14
           C 4 13 2 16 7 19
           L 16 22
           C 8 24 4 28 8 31
           L 26 26
           C 38 28 50 28 62 26
           C 76 24 86 26 94 24
           C 97 22 97 17 94 15
           Z"
      />
      {/* Bras replié sous le buste */}
      <path
        d="M 88 22 C 84 28 76 31 68 30"
        fill="none"
        stroke={color}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
    </g>
  );
}
