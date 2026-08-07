import {
  ArrowAnnotated,
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  flowBoxHeight,
} from "@/components/schemas/primitives";

// Colonne principale (boucle) — repère du viewBox 540 de large.
const CHAINE_X = 56;
const CHAINE_W = 170;
const CHAINE_CX = CHAINE_X + CHAINE_W / 2; // 141
const RETOUR_X = 26; // tronc vertical de la flèche de retour
const ESPACE = 34; // espace vertical entre deux briques de la boucle

// Encart « les 4 temps de la séance ».
const ENCART_X = 272;
const ENCART_W = 248;
const INTERNE_X = 286;
const INTERNE_W = 220;
const INTERNE_CX = INTERNE_X + INTERNE_W / 2; // 396

/**
 * Boucle pédagogique de la séance (MF1, pédagogie préparatoire) : l'objectif
 * opérationnel commande le contenu et la méthode, la séance est animée puis
 * évaluée ; si l'objectif n'est pas atteint, la remédiation ramène à
 * l'objectif (régulation). En encart : la structure interne de la séance en
 * quatre temps — introduction, développement, synthèse, évaluation formative.
 */
export function SchemaBoucleSeance() {
  const h2 = flowBoxHeight(2);
  const h3 = flowBoxHeight(3);

  // Ordonnées de la boucle (colonne de gauche).
  const yObjectif = 40;
  const yContenu = yObjectif + h2 + ESPACE;
  const yAnimation = yContenu + h2 + ESPACE;
  const yEvaluation = yAnimation + h2 + ESPACE;
  const yRemediation = yEvaluation + h2 + ESPACE;

  // Ordonnées de l'encart (colonne de droite).
  const yIntro = 108;
  const yDeveloppement = yIntro + h3 + 14;
  const ySynthese = yDeveloppement + h3 + 14;
  const yEvalFormative = ySynthese + h3 + 14;
  const encartY = 76;
  const encartH = yEvalFormative + h3 + 10 - encartY;

  // Points de départ / arrivée de la flèche de retour (régulation).
  const yMilieuRemediation = yRemediation + h2 / 2;
  const yMilieuObjectif = yObjectif + h2 / 2;

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={440}
        titre="Boucle pédagogique de la séance : de l'objectif à la remédiation"
        description="Boucle fléchée : objectif opérationnel, contenu et méthode, animation de la séance, évaluation puis remédiation qui ramène à l'objectif ; en encart, les quatre temps internes de la séance (introduction, développement, synthèse, évaluation)."
      >
        {/* ---- Boucle : objectif → contenu → animation → évaluation → remédiation ---- */}
        <FlowBox
          x={CHAINE_X}
          y={yObjectif}
          lignes={["Objectif opérationnel", "« sera capable de… »"]}
          color={SCHEMA_COLORS.securite}
        />
        <FlowArrow x1={CHAINE_CX} y1={yObjectif + h2} x2={CHAINE_CX} y2={yContenu} />
        <FlowBox
          x={CHAINE_X}
          y={yContenu}
          lignes={["Contenu et méthode", "quoi et comment ?"]}
          color={SCHEMA_COLORS.neutre}
        />
        <FlowArrow x1={CHAINE_CX} y1={yContenu + h2} x2={CHAINE_CX} y2={yAnimation} />
        <FlowBox
          x={CHAINE_X}
          y={yAnimation}
          lignes={["Animation de la séance", "conduite des 4 temps"]}
          color={SCHEMA_COLORS.neutre}
        />
        <FlowArrow x1={CHAINE_CX} y1={yAnimation + h2} x2={CHAINE_CX} y2={yEvaluation} />
        <FlowBox
          x={CHAINE_X}
          y={yEvaluation}
          lignes={["Évaluation", "objectif atteint ?"]}
          color={SCHEMA_COLORS.vigilance}
        />
        <FlowArrow
          x1={CHAINE_CX}
          y1={yEvaluation + h2}
          x2={CHAINE_CX}
          y2={yRemediation}
          label="pas atteint"
          labelDx={47}
        />
        <FlowBox
          x={CHAINE_X}
          y={yRemediation}
          lignes={["Remédiation", "reprendre autrement"]}
          color={SCHEMA_COLORS.vigilance}
        />

        {/* Flèche de retour (régulation) : remédiation → objectif.
            Tracé en 3 segments : chemin brut + pointe finale ArrowAnnotated. */}
        <path
          d={`M ${CHAINE_X} ${yMilieuRemediation} L ${RETOUR_X} ${yMilieuRemediation} L ${RETOUR_X} ${yMilieuObjectif}`}
          fill="none"
          stroke={SCHEMA_COLORS.vigilance}
          strokeWidth={1.5}
          strokeDasharray="5 4"
          strokeLinejoin="round"
        />
        <ArrowAnnotated
          x1={RETOUR_X}
          y1={yMilieuObjectif}
          x2={CHAINE_X}
          y2={yMilieuObjectif}
          color={SCHEMA_COLORS.vigilance}
          strokeWidth={1.5}
          pointilles
        />
        <text
          x={14}
          y={233}
          transform="rotate(-90 14 233)"
          fill={SCHEMA_COLORS.vigilance}
          fontSize={11}
          textAnchor="middle"
        >
          réguler : repartir de l&apos;objectif
        </text>

        {/* Lien : l'animation de la séance suit les 4 temps de l'encart. */}
        <ArrowAnnotated
          x1={CHAINE_X + CHAINE_W}
          y1={yAnimation + h2 / 2}
          x2={ENCART_X}
          y2={yAnimation + h2 / 2}
          strokeWidth={1.5}
          pointilles
        />

        {/* ---- Encart : structure interne de la séance en 4 temps ---- */}
        <rect
          x={ENCART_X}
          y={encartY}
          width={ENCART_W}
          height={encartH}
          rx={10}
          fill="none"
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.8}
        />
        <text
          x={INTERNE_CX}
          y={encartY + 20}
          fill="currentColor"
          fontSize={12}
          fontWeight={700}
          textAnchor="middle"
        >
          Dans la séance : les 4 temps
        </text>
        <FlowBox
          x={INTERNE_X}
          y={yIntro}
          width={INTERNE_W}
          lignes={["Introduction", "accroche, prérequis,", "annonce de l'objectif"]}
          color={SCHEMA_COLORS.neutre}
        />
        <FlowArrow x1={INTERNE_CX} y1={yIntro + h3} x2={INTERNE_CX} y2={yDeveloppement} />
        <FlowBox
          x={INTERNE_X}
          y={yDeveloppement}
          width={INTERNE_W}
          lignes={["Développement", "du simple au complexe,", "alterner apport / exercice"]}
          color={SCHEMA_COLORS.neutre}
        />
        <FlowArrow x1={INTERNE_CX} y1={yDeveloppement + h3} x2={INTERNE_CX} y2={ySynthese} />
        <FlowBox
          x={INTERNE_X}
          y={ySynthese}
          width={INTERNE_W}
          lignes={["Synthèse", "faire reformuler,", "dégager les points clés"]}
          color={SCHEMA_COLORS.neutre}
        />
        <FlowArrow x1={INTERNE_CX} y1={ySynthese + h3} x2={INTERNE_CX} y2={yEvalFormative} />
        <FlowBox
          x={INTERNE_X}
          y={yEvalFormative}
          width={INTERNE_W}
          lignes={["Évaluation formative", "vérifier et ajuster", "avant de clore"]}
          color={SCHEMA_COLORS.vigilance}
        />
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "securite", libelle: "Objectif — point de départ et de retour" },
          { couleur: "vigilance", libelle: "Évaluation, remédiation, régulation" },
          { couleur: "neutre", libelle: "Contenus et déroulé de la séance" },
        ]}
      />
    </>
  );
}
