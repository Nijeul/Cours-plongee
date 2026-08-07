import {
  ArrowAnnotated,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/** Pression absolue (bar) → abscisse du graphe. */
const xS = (bar: number) => 70 + bar * 105;
/** Tension d'azote (bar) → ordonnée du graphe (vers le haut). */
const yS = (bar: number) => 260 - bar * 42;

/**
 * Le coefficient de sursaturation critique Sc : graphe tension d'azote
 * TN₂ en fonction de la pression absolue ambiante. Sous la diagonale
 * TN₂ = P. abs, le tissu se charge ; entre la diagonale et la droite
 * critique TN₂ = Sc × P. abs, la sursaturation est tolérée (c'est le
 * moteur de la désaturation) ; au-delà, des bulles se forment : risque
 * d'ADD. Exemple avec Sc = 2 (rapport historique de Haldane) : un
 * compartiment à TN₂ = 2,4 bar ne peut pas remonter au-dessus de
 * P. abs = 2,4 / 2 = 1,2 bar tant qu'il n'a pas désaturé.
 */
export function SchemaSursaturationCritique() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={332}
        titre="La sursaturation critique : jusqu'où peut-on remonter ?"
        description="Graphe de la tension d'azote en fonction de la pression absolue : la remontée est admissible tant que la tension reste sous la droite critique Sc fois la pression absolue ; au-delà, zone rouge de formation de bulles. Exemple avec Sc égal 2 : un compartiment à 2,4 bar d'azote ne peut pas remonter au-dessus de 1,2 bar de pression absolue."
      >
        {/* Zones */}
        <polygon
          points={`${xS(0)},${yS(0)} ${xS(2.5)},${yS(5)} ${xS(0)},${yS(5)}`}
          fill={SCHEMA_COLORS.danger}
          fillOpacity={0.12}
          stroke="none"
        />
        <polygon
          points={`${xS(0)},${yS(0)} ${xS(2.5)},${yS(5)} ${xS(4)},${yS(5)} ${xS(4)},${yS(4)}`}
          fill={SCHEMA_COLORS.securite}
          fillOpacity={0.1}
          stroke="none"
        />

        {/* Axes */}
        <line x1={70} y1={45} x2={70} y2={260} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        <line x1={70} y1={260} x2={500} y2={260} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        {[0, 1, 2, 3, 4].map((bar) => (
          <g key={`x${bar}`}>
            <line x1={xS(bar)} y1={260} x2={xS(bar)} y2={266} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
            <text x={xS(bar)} y={280} fill={SCHEMA_COLORS.neutre} fontSize={11} textAnchor="middle">
              {bar}
            </text>
          </g>
        ))}
        {[1, 2, 3, 4, 5].map((bar) => (
          <g key={`y${bar}`}>
            <line x1={64} y1={yS(bar)} x2={70} y2={yS(bar)} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
            <text x={60} y={yS(bar) + 4} fill={SCHEMA_COLORS.neutre} fontSize={11} textAnchor="end">
              {bar}
            </text>
          </g>
        ))}
        <text x={16} y={34} fill={SCHEMA_COLORS.neutre} fontSize={11}>
          TN₂ (bar)
        </text>
        <text x={500} y={298} fill={SCHEMA_COLORS.neutre} fontSize={11} textAnchor="end">
          P. absolue (bar)
        </text>

        {/* Diagonale d'équilibre TN2 = Pabs */}
        <line
          x1={xS(0)}
          y1={yS(0)}
          x2={xS(4)}
          y2={yS(4)}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <text
          x={xS(4) - 2}
          y={yS(4) - 8}
          fill={SCHEMA_COLORS.neutre}
          fontSize={11}
          textAnchor="end"
          paintOrder="stroke"
          stroke="var(--card, transparent)"
          strokeWidth={4}
        >
          TN₂ = P. abs (équilibre)
        </text>

        {/* Droite critique TN2 = Sc × Pabs */}
        <line x1={xS(0)} y1={yS(0)} x2={xS(2.5)} y2={yS(5)} stroke={SCHEMA_COLORS.danger} strokeWidth={2.5} />
        <text x={xS(2.5) + 8} y={yS(5) + 10} fill={SCHEMA_COLORS.danger} fontSize={11} fontWeight={600}>
          Droite critique (ici Sc = 2)
        </text>

        <text x={xS(0.75)} y={yS(4.2)} fill={SCHEMA_COLORS.danger} fontSize={11.5} fontWeight={700}>
          TN₂ &gt; Sc × P. abs
        </text>
        <text x={xS(0.75)} y={yS(4.2) + 15} fill={SCHEMA_COLORS.danger} fontSize={11}>
          Bulles : accident (ADD)
        </text>
        <text x={xS(2.55)} y={yS(3.9)} fill={SCHEMA_COLORS.securite} fontSize={11.5} fontWeight={700}>
          Sursaturation tolérée
        </text>
        <text x={xS(2.55)} y={yS(3.9) + 15} fill={SCHEMA_COLORS.securite} fontSize={11}>
          TN₂ ≤ Sc × P. abs
        </text>
        <text x={xS(2.6)} y={yS(0.9)} fill={SCHEMA_COLORS.neutre} fontSize={11}>
          Sous-saturation : le tissu se charge
        </text>

        {/* Exemple : compartiment à TN2 = 2,4 bar qui remonte */}
        <ArrowAnnotated
          x1={xS(3)}
          y1={yS(2.4)}
          x2={xS(1.2)}
          y2={yS(2.4)}
          color={SCHEMA_COLORS.pression}
          label="Remontée : P. abs diminue, TN₂ ne suit pas"
          labelDy={-10}
        />
        <circle cx={xS(3)} cy={yS(2.4)} r={4.5} fill={SCHEMA_COLORS.azote} stroke="none" />
        <text
          x={xS(3) + 8}
          y={yS(2.4) + 16}
          fill={SCHEMA_COLORS.azote}
          fontSize={11}
          fontWeight={600}
          textAnchor="middle"
        >
          TN₂ = 2,4 bar
        </text>
        <line
          x1={xS(1.2)}
          y1={yS(2.4)}
          x2={xS(1.2)}
          y2={260}
          stroke={SCHEMA_COLORS.vigilance}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <text x={xS(1.2)} y={298} fill={SCHEMA_COLORS.vigilance} fontSize={11} fontWeight={600} textAnchor="middle">
          P. abs mini = 2,4 / 2 = 1,2 bar
        </text>

        <text x={285} y={322} fill="currentColor" fontSize={11.5} textAnchor="middle">
          Remontée admissible tant que TN₂ ≤ Sc × P. abs, pour tous les compartiments.
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "danger", libelle: "Seuil critique dépassé : formation de bulles" },
          { couleur: "securite", libelle: "Sursaturation tolérée (moteur de la désaturation)" },
          { couleur: "azote", libelle: "Tension d'azote du compartiment" },
          { couleur: "pression", libelle: "Remontée : baisse de la pression ambiante" },
        ]}
      />
    </>
  );
}
