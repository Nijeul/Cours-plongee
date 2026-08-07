import { SCHEMA_COLORS } from "./palette";

/** Configuration d'une échelle horizontale minutes → abscisse (unités du viewBox). */
export interface TimeScaleConfig {
  /** Temps minimal en minutes (souvent 0). */
  minMinutes: number;
  /** Temps maximal en minutes. */
  maxMinutes: number;
  /** Abscisse correspondant à `minMinutes` (gauche de l'axe). */
  xLeft: number;
  /** Abscisse correspondant à `maxMinutes` (droite de l'axe). */
  xRight: number;
}

/**
 * Crée une fonction d'échelle linéaire `temps (min) → x (viewBox)`.
 * À partager entre le `<TimeAxis>` et les courbes/curseurs d'une frise.
 */
export function createTimeScale(config: TimeScaleConfig): (minutes: number) => number {
  const { minMinutes, maxMinutes, xLeft, xRight } = config;
  const pente = (xRight - xLeft) / (maxMinutes - minMinutes);
  return (minutes: number) => xLeft + (minutes - minMinutes) * pente;
}

/**
 * Props de l'axe horizontal de temps.
 */
export interface TimeAxisProps extends TimeScaleConfig {
  /** Ordonnée de l'axe. */
  y: number;
  /** Pas des graduations en minutes. Par défaut 10. */
  pas?: number;
  /** Unité affichée après chaque valeur. Par défaut `"min"`. */
  unite?: string;
  /** Couleur de l'axe et des libellés. Par défaut `SCHEMA_COLORS.neutre`. */
  color?: string;
}

/**
 * Axe horizontal de temps pour les frises et profils de plongée :
 * trait principal, graduations vers le bas et libellés `<text>` (« 10 min »…).
 *
 * Composant serveur, sans état.
 */
export function TimeAxis({
  y,
  minMinutes,
  maxMinutes,
  xLeft,
  xRight,
  pas = 10,
  unite = "min",
  color = SCHEMA_COLORS.neutre,
}: TimeAxisProps) {
  const echelle = createTimeScale({ minMinutes, maxMinutes, xLeft, xRight });
  const graduations: number[] = [];
  for (let t = minMinutes; t <= maxMinutes; t += pas) {
    graduations.push(t);
  }

  return (
    <g stroke="none" fill="none">
      <line x1={xLeft} y1={y} x2={xRight} y2={y} stroke={color} strokeWidth={1.5} />
      {graduations.map((t) => {
        const x = echelle(t);
        return (
          <g key={t}>
            <line x1={x} y1={y} x2={x} y2={y + 6} stroke={color} strokeWidth={1.5} />
            <text x={x} y={y + 20} fill={color} fontSize={11} textAnchor="middle">
              {t}
              {unite ? ` ${unite}` : null}
            </text>
          </g>
        );
      })}
    </g>
  );
}
