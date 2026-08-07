import { SCHEMA_COLORS } from "./palette";

/** Forme du tracé d'une flèche annotée. */
export type ArrowCoude = "aucun" | "horizontal-vertical" | "vertical-horizontal";

/** Props de la flèche annotée. */
export interface ArrowAnnotatedProps {
  /** Abscisse du point de départ. */
  x1: number;
  /** Ordonnée du point de départ. */
  y1: number;
  /** Abscisse de la pointe. */
  x2: number;
  /** Ordonnée de la pointe. */
  y2: number;
  /**
   * Forme du tracé : `"aucun"` (segment droit, défaut),
   * `"horizontal-vertical"` (part à l'horizontale puis descend/monte),
   * `"vertical-horizontal"` (part à la verticale puis rejoint la pointe).
   */
  coude?: ArrowCoude;
  /** Libellé optionnel affiché près du milieu de la flèche. */
  label?: string;
  /** Décalage horizontal du libellé par rapport au milieu. Par défaut 0. */
  labelDx?: number;
  /** Décalage vertical du libellé par rapport au milieu. Par défaut −6. */
  labelDy?: number;
  /** Couleur du trait, de la pointe et du libellé. Par défaut `SCHEMA_COLORS.neutre`. */
  color?: string;
  /** Épaisseur du trait. Par défaut 2. */
  strokeWidth?: number;
  /** Trait en pointillés (flux hypothétique, retour…). Par défaut `false`. */
  pointilles?: boolean;
}

/** Dérive un identifiant de marqueur stable à partir de la couleur. */
function markerId(color: string): string {
  return `schema-fleche-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
}

/**
 * Flèche droite ou coudée avec pointe (marqueur `<defs>` encapsulé, partagé
 * entre flèches de même couleur) et libellé optionnel. Le libellé reçoit un
 * léger halo couleur carte pour rester lisible sur fond chargé.
 *
 * Composant serveur, sans état.
 */
export function ArrowAnnotated({
  x1,
  y1,
  x2,
  y2,
  coude = "aucun",
  label,
  labelDx = 0,
  labelDy = -6,
  color = SCHEMA_COLORS.neutre,
  strokeWidth = 2,
  pointilles = false,
}: ArrowAnnotatedProps) {
  const id = markerId(color);

  let d: string;
  if (coude === "horizontal-vertical") {
    d = `M ${x1} ${y1} L ${x2} ${y1} L ${x2} ${y2}`;
  } else if (coude === "vertical-horizontal") {
    d = `M ${x1} ${y1} L ${x1} ${y2} L ${x2} ${y2}`;
  } else {
    d = `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  const labelX = (x1 + x2) / 2 + labelDx;
  const labelY = (y1 + y2) / 2 + labelDy;

  return (
    <g>
      <defs>
        <marker
          id={id}
          viewBox="0 0 10 10"
          refX={8}
          refY={5}
          markerWidth={9}
          markerHeight={9}
          markerUnits="userSpaceOnUse"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 Z" fill={color} stroke="none" />
        </marker>
      </defs>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeDasharray={pointilles ? "5 4" : undefined}
        markerEnd={`url(#${id})`}
      />
      {label ? (
        <text
          x={labelX}
          y={labelY}
          fill={color}
          fontSize={12}
          fontWeight={500}
          textAnchor="middle"
          paintOrder="stroke"
          stroke="var(--card, transparent)"
          strokeWidth={4}
          strokeLinejoin="round"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}
