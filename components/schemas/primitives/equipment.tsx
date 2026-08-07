import { SCHEMA_COLORS } from "./palette";

/** Props communes aux icônes d'équipement. */
export interface EquipmentIconProps {
  /** Abscisse du coin supérieur gauche du repère local de l'icône. */
  x: number;
  /** Ordonnée du coin supérieur gauche du repère local de l'icône. */
  y: number;
  /** Facteur d'échelle. Par défaut 1. */
  scale?: number;
  /** Couleur du trait. Par défaut `SCHEMA_COLORS.neutre`. */
  color?: string;
}

/**
 * Bloc (bouteille) de plongée stylisé : corps arrondi, col et robinet.
 * Repère local : 26 × 44 unités.
 *
 * Composant serveur, sans état.
 */
export function TankIcon({
  x,
  y,
  scale = 1,
  color = SCHEMA_COLORS.neutre,
}: EquipmentIconProps) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={color}
      fill={color}
      aria-hidden="true"
    >
      {/* Corps de la bouteille */}
      <rect
        x={5}
        y={10}
        width={16}
        height={30}
        rx={7}
        fill={color}
        fillOpacity={0.15}
        strokeWidth={2}
      />
      {/* Col */}
      <rect x={11} y={4.5} width={4} height={6} rx={1} strokeWidth={1.5} fillOpacity={0.15} />
      {/* Robinet */}
      <line x1={15} y1={6.5} x2={22} y2={6.5} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

/**
 * Détendeur stylisé : premier étage, flexible et embout.
 * Repère local : 44 × 26 unités.
 *
 * Composant serveur, sans état.
 */
export function RegulatorIcon({
  x,
  y,
  scale = 1,
  color = SCHEMA_COLORS.neutre,
}: EquipmentIconProps) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={color}
      fill="none"
      aria-hidden="true"
    >
      {/* Premier étage */}
      <circle cx={8} cy={8} r={6} strokeWidth={2} fill={color} fillOpacity={0.15} />
      <line x1={8} y1={2} x2={8} y2={-1} strokeWidth={2} strokeLinecap="round" />
      {/* Flexible */}
      <path d="M 13 11 C 24 15 28 17 34 19" strokeWidth={2} strokeLinecap="round" />
      {/* Embout (deuxième étage) */}
      <rect
        x={31}
        y={17}
        width={11}
        height={8}
        rx={3}
        strokeWidth={2}
        fill={color}
        fillOpacity={0.15}
      />
    </g>
  );
}
