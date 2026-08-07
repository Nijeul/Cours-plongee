import {
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  flowBoxHeight,
} from "@/components/schemas/primitives";

/** Une brique du logigramme. */
interface Etape {
  lignes: string[];
  color: string;
}

const ETAPES: Etape[] = [
  {
    lignes: ["1. Sortir la victime de l'eau", "repos strict"],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: [
      "2. Position adaptée :",
      "demi-assise si elle respire,",
      "PLS si inconsciente ventilante,",
      "RCP si arrêt",
    ],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: ["3. O₂ 15 L/min au masque", "haute concentration"],
    color: SCHEMA_COLORS.securite,
  },
  {
    lignes: ["4. Alerter : DP, CROSS", "(VHF 16) en mer,", "15 ou 112 à terre"],
    color: SCHEMA_COLORS.vigilance,
  },
  {
    lignes: ["5. Évacuation vers un", "centre hyperbare"],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: ["Pas d'aspirine sans consigne", "médicale — jamais de", "réimmersion"],
    color: SCHEMA_COLORS.danger,
  },
];

const LARGEUR = 250;
const X = (480 - LARGEUR) / 2;
const GAP = 25;

/**
 * Logigramme de la conduite à tenir devant une surpression pulmonaire,
 * conforme au cours N2 : sortie de l'eau et repos strict, position adaptée
 * (demi-assise / PLS / RCP), oxygène 15 L/min au masque haute
 * concentration, alerte (DP, CROSS VHF 16, 15/112) et évacuation vers un
 * centre hyperbare — sans aspirine sans consigne médicale, sans réimmersion.
 */
export function SchemaCatSurpression() {
  let y = 12;
  const briques = ETAPES.map((etape) => {
    const boxY = y;
    y += flowBoxHeight(etape.lignes.length) + GAP;
    return { ...etape, y: boxY };
  });
  const hauteur = y - GAP + 12;

  return (
    <>
      <SchemaSvg
        viewBoxWidth={480}
        viewBoxHeight={hauteur}
        titre="Conduite à tenir devant une surpression pulmonaire"
        description="Logigramme : sortir la victime de l'eau, position adaptée, oxygène 15 litres par minute, alerte et évacuation vers un centre hyperbare."
      >
        {briques.map((brique, i) => (
          <g key={brique.lignes[0]}>
            {i > 0 ? (
              <FlowArrow
                x1={240}
                y1={brique.y - GAP}
                x2={240}
                y2={brique.y - 2}
                color={SCHEMA_COLORS.neutre}
              />
            ) : null}
            <FlowBox x={X} y={brique.y} width={LARGEUR} lignes={brique.lignes} color={brique.color} />
          </g>
        ))}
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "securite", libelle: "Oxygène : le geste clé" },
          { couleur: "vigilance", libelle: "Alerte" },
          { couleur: "danger", libelle: "Interdits" },
          { couleur: "neutre", libelle: "Étapes de la prise en charge" },
        ]}
      />
    </>
  );
}
