import {
  ArrowAnnotated,
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  flowBoxHeight,
} from "@/components/schemas/primitives";

// Colonnes du schéma (repère du viewBox 540 de large).
const COL_PLONGEUR_X = 12;
const COL_FEDERAL_X = 200;
const COL_PRO_X = 388;
const COL_PRO_W = 140;
/** Abscisse centrale d'une colonne de briques de largeur 170. */
const CX_PLONGEUR = COL_PLONGEUR_X + 85;
const CX_FEDERAL = COL_FEDERAL_X + 85;
const CX_PRO = COL_PRO_X + COL_PRO_W / 2;

/**
 * Arbre du cursus FFESSM : la filière plongeur (Niveau 1 → Niveau 2 →
 * Niveau 3 → Niveau 4 / Guide de Palanquée, avec l'option PA12 dès le N1
 * pour les majeurs), la filière d'encadrement fédéral bénévole
 * (Initiateur dès le N2, puis MF1 après le N4, puis MF2 et les
 * instructeurs) et la voie professionnelle rémunérée (BPJEPS puis DEJEPS,
 * diplômes d'État), reliées par des équivalences.
 */
export function SchemaCursusFfessm() {
  const h2 = flowBoxHeight(2);
  const h3 = flowBoxHeight(3);

  // Ordonnées des briques.
  const yN1 = 50;
  const yN2 = 140;
  const yN3 = 230;
  const yN4 = 320;
  const yInitiateur = 140;
  const yMf1 = 320;
  const yMf2 = 440;
  const yBpjeps = 320;
  const yDejeps = 440;

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={530}
        titre="Cursus FFESSM : du Niveau 1 au MF2 et la voie professionnelle"
        description="Arbre du cursus : brevets de plongeur N1 à N4/GP, encadrement fédéral bénévole (Initiateur, MF1, MF2) et diplômes d'État rémunérés (BPJEPS, DEJEPS) reliés par des équivalences."
      >
        {/* ---- Colonne 1 : brevets de plongeur ---- */}
        <text
          x={CX_PLONGEUR}
          y={32}
          fill={SCHEMA_COLORS.eau}
          fontSize={12}
          fontWeight={700}
          textAnchor="middle"
        >
          Cursus plongeur
        </text>
        <FlowBox
          x={COL_PLONGEUR_X}
          y={yN1}
          lignes={["Niveau 1", "PE20 — encadré 20 m"]}
          color={SCHEMA_COLORS.eau}
        />
        <FlowArrow
          x1={CX_PLONGEUR}
          y1={yN1 + h2}
          x2={CX_PLONGEUR}
          y2={yN2}
          label="théorie + expérience"
        />
        <FlowBox
          x={COL_PLONGEUR_X}
          y={yN2}
          lignes={["Niveau 2", "PA20 + PE40"]}
          color={SCHEMA_COLORS.eau}
        />
        <FlowArrow x1={CX_PLONGEUR} y1={yN2 + h2} x2={CX_PLONGEUR} y2={yN3} />
        <FlowBox
          x={COL_PLONGEUR_X}
          y={yN3}
          lignes={["Niveau 3", "PA60 — autonome 60 m"]}
          color={SCHEMA_COLORS.eau}
        />
        <FlowArrow x1={CX_PLONGEUR} y1={yN3 + h2} x2={CX_PLONGEUR} y2={yN4} />
        <FlowBox
          x={COL_PLONGEUR_X}
          y={yN4}
          lignes={["Niveau 4 / GP", "guide de palanquée"]}
          color={SCHEMA_COLORS.eau}
        />

        {/* Option PA12 dès le Niveau 1 (majeur, formation complémentaire). */}
        <ArrowAnnotated
          x1={COL_PLONGEUR_X + 170}
          y1={yN1 + 25}
          x2={COL_FEDERAL_X}
          y2={yN1 + 25}
          strokeWidth={1.5}
          pointilles
        />
        <FlowBox
          x={COL_FEDERAL_X}
          y={yN1}
          lignes={["PA12 (option)", "autonome 12 m, majeur"]}
          color={SCHEMA_COLORS.eau}
          fondColore={false}
        />

        {/* ---- Colonne 2 : encadrement fédéral bénévole ---- */}
        <text
          x={CX_FEDERAL}
          y={130}
          fill={SCHEMA_COLORS.neutre}
          fontSize={12}
          fontWeight={700}
          textAnchor="middle"
        >
          Encadrement fédéral (bénévole)
        </text>
        <FlowArrow
          x1={COL_PLONGEUR_X + 170}
          y1={yN2 + 25}
          x2={COL_FEDERAL_X}
          y2={yN2 + 25}
        />
        <FlowBox
          x={COL_FEDERAL_X}
          y={yInitiateur}
          lignes={["Initiateur (E1)", "enseigne en club", "prérequis : Niveau 2"]}
          color={SCHEMA_COLORS.neutre}
        />
        <FlowArrow
          x1={COL_PLONGEUR_X + 170}
          y1={yN4 + 25}
          x2={COL_FEDERAL_X}
          y2={yN4 + 25}
        />
        <FlowBox
          x={COL_FEDERAL_X}
          y={yMf1}
          lignes={["MF1 — moniteur fédéral", "1er degré, enseignement", "bénévole en club"]}
          color={SCHEMA_COLORS.neutre}
        />
        <FlowArrow x1={CX_FEDERAL} y1={yMf1 + h3} x2={CX_FEDERAL} y2={yMf2} />
        <FlowBox
          x={COL_FEDERAL_X}
          y={yMf2}
          lignes={["MF2 — moniteur", "fédéral 2e degré"]}
          color={SCHEMA_COLORS.neutre}
        />
        <text
          x={CX_FEDERAL}
          y={yMf2 + h2 + 18}
          fill={SCHEMA_COLORS.neutre}
          fontSize={11}
          textAnchor="middle"
        >
          puis instructeurs fédéraux
        </text>

        {/* ---- Colonne 3 : voie professionnelle (diplômes d'État) ---- */}
        <text
          x={CX_PRO}
          y={288}
          fill={SCHEMA_COLORS.vigilance}
          fontSize={12}
          fontWeight={700}
          textAnchor="middle"
        >
          Voie professionnelle
        </text>
        <text
          x={CX_PRO}
          y={302}
          fill={SCHEMA_COLORS.vigilance}
          fontSize={11}
          textAnchor="middle"
        >
          (rémunérée)
        </text>
        <FlowBox
          x={COL_PRO_X}
          y={yBpjeps}
          lignes={["BPJEPS", "diplôme d'État"]}
          width={COL_PRO_W}
          color={SCHEMA_COLORS.vigilance}
        />
        <FlowArrow x1={CX_PRO} y1={yBpjeps + h2} x2={CX_PRO} y2={yDejeps} />
        <FlowBox
          x={COL_PRO_X}
          y={yDejeps}
          lignes={["DEJEPS", "niveau supérieur"]}
          width={COL_PRO_W}
          color={SCHEMA_COLORS.vigilance}
        />

        {/* Passerelles entre cursus fédéral et professionnel. */}
        <ArrowAnnotated
          x1={COL_FEDERAL_X + 170}
          y1={yMf1 + 18}
          x2={COL_PRO_X}
          y2={yMf1 + 18}
          label="équivalences"
          labelDy={-22}
          strokeWidth={1.5}
          pointilles
        />
        <ArrowAnnotated
          x1={COL_PRO_X}
          y1={yMf1 + 34}
          x2={COL_FEDERAL_X + 170}
          y2={yMf1 + 34}
          strokeWidth={1.5}
          pointilles
        />
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "eau", libelle: "Brevets de plongeur (N1 → N4/GP)" },
          { couleur: "neutre", libelle: "Encadrement fédéral bénévole" },
          { couleur: "vigilance", libelle: "Diplômes d'État — enseignement rémunéré" },
        ]}
      />
    </>
  );
}
