import {
  ArrowAnnotated,
  DiverSilhouette,
  FlowBox,
  LegendBox,
  RegulatorIcon,
  SCHEMA_COLORS,
  SchemaSvg,
  TankIcon,
} from "@/components/schemas/primitives";

// Géométrie des deux colonnes (viewBox 540 de large).
const COL_PE_CX = 136;
const COL_PA_CX = 406;
const BOX_W = 225;
const BOX_PE_X = 24;
const BOX_PA_X = 291;

/**
 * Matériel obligatoire du Code du sport, en deux colonnes comparées :
 * plongeur encadré (gilet à gonflage au gaz, détendeur avec manomètre,
 * et dès le PE40 un moyen personnel de contrôler la remontée) et plongeur
 * autonome (gilet, deux sorties de bloc indépendantes avec deux détendeurs
 * complets, manomètre ou gestion d'air, tables + profondimètre + montre ou
 * ordinateur, et un parachute de palier par palanquée). Rappel en bas :
 * les secours de site (O₂, trousse, alerte) relèvent du directeur de plongée.
 */
export function SchemaMaterielObligatoire() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={486}
        titre="Matériel obligatoire : plongeur encadré et plongeur autonome"
        description="Deux colonnes comparant l'équipement minimal imposé par le Code du sport au plongeur encadré et au plongeur autonome, avec le parachute de palier par palanquée autonome."
      >
        {/* Séparateur central. */}
        <line
          x1={270}
          y1={14}
          x2={270}
          y2={436}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.6}
        />

        {/* ---- Colonne encadré ---- */}
        <text
          x={COL_PE_CX}
          y={26}
          fill={SCHEMA_COLORS.eau}
          fontSize={13}
          fontWeight={700}
          textAnchor="middle"
        >
          Plongeur encadré (PE)
        </text>
        <TankIcon x={40} y={48} scale={0.65} color={SCHEMA_COLORS.eau} />
        <DiverSilhouette x={120} y={80} orientation="droite" scale={0.7} />
        <DiverSilhouette
          x={210}
          y={66}
          orientation="droite"
          scale={0.4}
          color={SCHEMA_COLORS.eau}
        />
        <text
          x={210}
          y={92}
          fill={SCHEMA_COLORS.eau}
          fontSize={11}
          fontWeight={600}
          textAnchor="middle"
        >
          avec GP
        </text>
        <ArrowAnnotated
          x1={COL_PE_CX}
          y1={136}
          x2={124}
          y2={98}
          strokeWidth={1.5}
          pointilles
        />
        <FlowBox
          x={BOX_PE_X}
          y={140}
          width={BOX_W}
          lignes={["Gilet stabilisateur", "à gonflage au gaz"]}
          color={SCHEMA_COLORS.eau}
        />
        <FlowBox
          x={BOX_PE_X}
          y={200}
          width={BOX_W}
          lignes={["Détendeur avec manomètre", "(contrôle de la pression)"]}
          color={SCHEMA_COLORS.eau}
        />
        <FlowBox
          x={BOX_PE_X}
          y={260}
          width={BOX_W}
          lignes={["Dès PE40 : profondimètre", "et montre, ou ordinateur"]}
          color={SCHEMA_COLORS.vigilance}
        />
        <text x={COL_PE_CX} y={336} fill="currentColor" fontSize={11} textAnchor="middle">
          En zone 0-20 m encadrée,
        </text>
        <text x={COL_PE_CX} y={351} fill="currentColor" fontSize={11} textAnchor="middle">
          le guide contrôle les paramètres
        </text>
        <text x={COL_PE_CX} y={366} fill="currentColor" fontSize={11} textAnchor="middle">
          pour toute la palanquée.
        </text>

        {/* ---- Colonne autonome ---- */}
        <text
          x={COL_PA_CX}
          y={26}
          fill={SCHEMA_COLORS.vigilance}
          fontSize={13}
          fontWeight={700}
          textAnchor="middle"
        >
          Plongeur autonome (PA)
        </text>
        <TankIcon x={310} y={48} scale={0.65} color={SCHEMA_COLORS.vigilance} />
        <DiverSilhouette x={395} y={80} orientation="droite" scale={0.7} />
        {/* Deux détendeurs complets : la marque de l'autonome. */}
        <RegulatorIcon x={455} y={46} scale={0.7} color={SCHEMA_COLORS.vigilance} />
        <RegulatorIcon x={455} y={76} scale={0.7} color={SCHEMA_COLORS.vigilance} />
        <text
          x={487}
          y={116}
          fill={SCHEMA_COLORS.vigilance}
          fontSize={11}
          fontWeight={600}
          textAnchor="middle"
        >
          × 2
        </text>
        <ArrowAnnotated
          x1={COL_PA_CX}
          y1={136}
          x2={399}
          y2={98}
          strokeWidth={1.5}
          pointilles
        />
        <FlowBox
          x={BOX_PA_X}
          y={140}
          width={BOX_W}
          lignes={["Gilet stabilisateur", "à gonflage au gaz"]}
          color={SCHEMA_COLORS.vigilance}
        />
        <FlowBox
          x={BOX_PA_X}
          y={200}
          width={BOX_W}
          lignes={[
            "2 sorties de bloc indépendantes",
            "+ 2 détendeurs complets",
            "(secours d'un équipier)",
          ]}
          color={SCHEMA_COLORS.vigilance}
        />
        <FlowBox
          x={BOX_PA_X}
          y={275}
          width={BOX_W}
          lignes={["Manomètre ou gestion d'air"]}
          color={SCHEMA_COLORS.vigilance}
        />
        <FlowBox
          x={BOX_PA_X}
          y={320}
          width={BOX_W}
          lignes={["Tables + profondimètre", "+ montre, ou ordinateur"]}
          color={SCHEMA_COLORS.vigilance}
        />
        <FlowBox
          x={BOX_PA_X}
          y={380}
          width={BOX_W}
          lignes={["Par palanquée :", "1 parachute de palier"]}
          color={SCHEMA_COLORS.securite}
        />

        {/* Secours de site : responsabilité du directeur de plongée. */}
        <text
          x={270}
          y={462}
          fill={SCHEMA_COLORS.neutre}
          fontSize={11}
          textAnchor="middle"
        >
          {"Sur le site, sous la responsabilité du DP : plan de secours, moyen d'alerte,"}
        </text>
        <text
          x={270}
          y={476}
          fill={SCHEMA_COLORS.neutre}
          fontSize={11}
          textAnchor="middle"
        >
          {"trousse de secours, oxygénothérapie, eau douce, couverture, fiche d'évacuation."}
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "eau", libelle: "Plongeur encadré" },
          { couleur: "vigilance", libelle: "Plongeur autonome (exigences renforcées)" },
          { couleur: "securite", libelle: "Parachute de palier — un par palanquée" },
          { couleur: "neutre", libelle: "Secours de site (directeur de plongée)" },
        ]}
      />
    </>
  );
}
