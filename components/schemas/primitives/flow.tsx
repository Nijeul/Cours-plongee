import { ArrowAnnotated, type ArrowCoude } from "./arrow-annotated";
import { SCHEMA_COLORS } from "./palette";

/** Hauteur de ligne du texte des briques de logigramme (unités du viewBox). */
export const FLOW_LINE_HEIGHT = 15;
/** Marge verticale interne des briques de logigramme. */
export const FLOW_PADDING_Y = 10;
/** Largeur par défaut d'une brique de logigramme. */
export const FLOW_BOX_WIDTH = 170;

/**
 * Hauteur approximée d'une `<FlowBox>` selon son nombre de lignes.
 * À utiliser pour positionner les briques suivantes et les connecteurs.
 */
export function flowBoxHeight(nbLignes: number): number {
  return nbLignes * FLOW_LINE_HEIGHT + FLOW_PADDING_Y * 2;
}

/** Props d'une brique de logigramme. */
export interface FlowBoxProps {
  /** Abscisse du coin supérieur gauche. */
  x: number;
  /** Ordonnée du coin supérieur gauche. */
  y: number;
  /**
   * Lignes de texte (le découpage est à la charge de l'appelant :
   * ~24 caractères max par ligne pour la largeur par défaut).
   */
  lignes: string[];
  /** Largeur fixe de la brique. Par défaut `FLOW_BOX_WIDTH` (170). */
  width?: number;
  /** Couleur du cadre. Par défaut `SCHEMA_COLORS.neutre`. */
  color?: string;
  /** Remplissage léger de la couleur du cadre. Par défaut `true`. */
  fondColore?: boolean;
}

/**
 * Brique de logigramme : rectangle arrondi de largeur fixe, hauteur
 * approximée d'après le nombre de lignes (`flowBoxHeight`), texte centré
 * multi-ligne via `<tspan>` en `currentColor`.
 *
 * Composant serveur, sans état.
 */
export function FlowBox({
  x,
  y,
  lignes,
  width = FLOW_BOX_WIDTH,
  color = SCHEMA_COLORS.neutre,
  fondColore = true,
}: FlowBoxProps) {
  const height = flowBoxHeight(lignes.length);
  const cx = x + width / 2;
  // Première ligne de texte : centrage vertical du bloc de texte.
  const premiereLigneY = y + FLOW_PADDING_Y + FLOW_LINE_HEIGHT / 2 + 5;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill={fondColore ? color : "var(--card, transparent)"}
        fillOpacity={fondColore ? 0.09 : 1}
        stroke={color}
        strokeWidth={1.5}
      />
      <text x={cx} y={premiereLigneY} fill="currentColor" fontSize={12} textAnchor="middle">
        {lignes.map((ligne, i) => (
          <tspan key={i} x={cx} dy={i === 0 ? 0 : FLOW_LINE_HEIGHT}>
            {ligne}
          </tspan>
        ))}
      </text>
    </g>
  );
}

/** Props d'un connecteur fléché de logigramme. */
export interface FlowArrowProps {
  /** Abscisse du point de départ (bord de la brique amont). */
  x1: number;
  /** Ordonnée du point de départ. */
  y1: number;
  /** Abscisse de la pointe (bord de la brique aval). */
  x2: number;
  /** Ordonnée de la pointe. */
  y2: number;
  /** Libellé optionnel (« Oui », « Non »…). */
  label?: string;
  /** Forme du tracé. Par défaut `"aucun"` (segment droit). */
  coude?: ArrowCoude;
  /** Couleur. Par défaut `SCHEMA_COLORS.neutre`. */
  color?: string;
  /** Décalage horizontal du libellé. */
  labelDx?: number;
  /** Décalage vertical du libellé. */
  labelDy?: number;
}

/**
 * Connecteur fléché entre deux briques de logigramme : simple habillage
 * d'`<ArrowAnnotated>` avec les réglages adaptés aux arbres de décision.
 *
 * Composant serveur, sans état.
 */
export function FlowArrow({
  x1,
  y1,
  x2,
  y2,
  label,
  coude = "aucun",
  color = SCHEMA_COLORS.neutre,
  labelDx,
  labelDy,
}: FlowArrowProps) {
  return (
    <ArrowAnnotated
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      coude={coude}
      label={label}
      labelDx={labelDx}
      labelDy={labelDy}
      color={color}
      strokeWidth={1.5}
    />
  );
}
