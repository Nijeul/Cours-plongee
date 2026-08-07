import {
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/** Un maillon de la chaîne des secours. */
interface Maillon {
  titre: string;
  color: string;
  details: string[];
}

const MAILLONS: Maillon[] = [
  {
    titre: "1. Constat",
    color: SCHEMA_COLORS.danger,
    details: ["signes anormaux", "après la plongée", "= accident"],
  },
  {
    titre: "2. Alerte",
    color: SCHEMA_COLORS.vigilance,
    details: ["VHF 16 → CROSS", "tél. 196", "15 / 18 / 112"],
  },
  {
    titre: "3. Gestes",
    color: SCHEMA_COLORS.securite,
    details: ["O₂ 15 L/min,", "protection,", "fiche d'évacuation"],
  },
  {
    titre: "4. Évacuation",
    color: SCHEMA_COLORS.neutre,
    details: ["SNSM, hélicoptère", "ou ambulance"],
  },
  {
    titre: "5. Caisson",
    color: SCHEMA_COLORS.pression,
    details: ["recompression", "thérapeutique"],
  },
];

const LARGEUR = 100;
const XS = [8, 120, 232, 344, 456];
const Y = 52;

/**
 * La chaîne des secours en frise fléchée, conforme au cours N3 : constat de
 * l'accident, alerte (VHF canal 16 vers le CROSS, 196, 15/18/112), premiers
 * gestes (oxygène 15 L/min, fiche d'évacuation), évacuation (SNSM,
 * hélicoptère, ambulance) et recompression en caisson hyperbare.
 */
export function SchemaChaineAlerte() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={560}
        viewBoxHeight={190}
        titre="La chaîne des secours, du constat au caisson"
        description="Frise fléchée en cinq maillons : constat, alerte par VHF 16, 196 ou 15-18-112, premiers gestes dont l'oxygène, évacuation, puis caisson hyperbare."
      >
        {MAILLONS.map((maillon, i) => (
          <g key={maillon.titre}>
            {i > 0 ? (
              <FlowArrow
                x1={XS[i] - 12}
                y1={Y + 17}
                x2={XS[i] - 1}
                y2={Y + 17}
                color={SCHEMA_COLORS.neutre}
              />
            ) : null}
            <FlowBox x={XS[i]} y={Y} width={LARGEUR} lignes={[maillon.titre]} color={maillon.color} />
            {maillon.details.map((ligne, j) => (
              <text
                key={ligne}
                x={XS[i] + LARGEUR / 2}
                y={Y + 53 + j * 14}
                fontSize={11}
                fill="currentColor"
                textAnchor="middle"
              >
                {ligne}
              </text>
            ))}
          </g>
        ))}
        <text x={280} y={172} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="middle">
          La qualité du premier maillon conditionne toute la chaîne
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "danger", libelle: "Accident constaté" },
          { couleur: "vigilance", libelle: "Alerte" },
          { couleur: "securite", libelle: "Premiers gestes" },
          { couleur: "pression", libelle: "Recompression en caisson" },
        ]}
      />
    </>
  );
}
