import {
  ArrowAnnotated,
  DiverSilhouette,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  WaterBackground,
} from "@/components/schemas/primitives";

/** Ordonnée de la surface de l'eau, commune aux trois milieux. */
const SURFACE_Y = 64;

/** Les trois étapes de la frise (panneaux de gauche à droite). */
const ETAPES: Array<{
  x: number;
  largeur: number;
  fondY: number;
  gradientId: string;
  titre: string;
  sousTitre: string;
  profondeur: string;
  plongeurY: number;
}> = [
  {
    x: 15,
    largeur: 145,
    fondY: 112,
    gradientId: "schema-eau-bassin",
    titre: "1. Bassin / fosse",
    sousTitre: "faible profondeur",
    profondeur: "≈ 2 m",
    plongeurY: 92,
  },
  {
    x: 197,
    largeur: 146,
    fondY: 146,
    gradientId: "schema-eau-protege",
    titre: "2. Milieu naturel",
    sousTitre: "protégé, peu profond",
    profondeur: "3 à 6 m",
    plongeurY: 110,
  },
  {
    x: 379,
    largeur: 146,
    fondY: 196,
    gradientId: "schema-eau-profond",
    titre: "3. Milieu naturel",
    sousTitre: "profondeur croissante",
    profondeur: "20 m puis au-delà",
    plongeurY: 138,
  },
];

/**
 * Progression d'une compétence à travers les milieux (MF1, organisation
 * d'une formation) : la frise bassin / faible profondeur, puis milieu
 * naturel protégé, puis milieu naturel à profondeur croissante — le fond
 * s'éloigne d'un panneau à l'autre. Un geste acquis en bassin est réinvesti
 * puis consolidé en milieu naturel, pendant que les variables didactiques
 * évoluent une à la fois : profondeur, visibilité et repères, effort et
 * conditions de milieu.
 */
export function SchemaProgressionMilieux() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={380}
        titre="Progression d'une compétence : du bassin au milieu naturel"
        description="Frise en trois étapes : bassin à faible profondeur, milieu naturel protégé, puis milieu naturel à profondeur croissante, avec les variables didactiques qui évoluent — profondeur, visibilité et effort."
      >
        {/* ---- Les trois milieux (le fond descend d'étape en étape) ---- */}
        {ETAPES.map((etape) => {
          const cx = etape.x + etape.largeur / 2;
          return (
            <g key={etape.gradientId}>
              <text x={cx} y={28} fill="currentColor" fontSize={12} fontWeight={700} textAnchor="middle">
                {etape.titre}
              </text>
              <text x={cx} y={43} fill="currentColor" opacity={0.8} fontSize={11} textAnchor="middle">
                {etape.sousTitre}
              </text>
              <WaterBackground
                x={etape.x}
                width={etape.largeur}
                surfaceY={SURFACE_Y}
                bottomY={etape.fondY}
                gradientId={etape.gradientId}
              />
              <line
                x1={etape.x}
                y1={etape.fondY}
                x2={etape.x + etape.largeur}
                y2={etape.fondY}
                stroke={SCHEMA_COLORS.neutre}
                strokeWidth={1.5}
                opacity={0.7}
              />
              <DiverSilhouette x={cx} y={etape.plongeurY} orientation="droite" scale={0.5} />
              <text x={cx} y={etape.fondY + 16} fill={SCHEMA_COLORS.eau} fontSize={11} textAnchor="middle">
                {etape.profondeur}
              </text>
            </g>
          );
        })}

        {/* ---- La même compétence passe d'un milieu au suivant ---- */}
        <ArrowAnnotated
          x1={163}
          y1={86}
          x2={194}
          y2={86}
          color={SCHEMA_COLORS.securite}
          label="réinvesti"
          labelDy={-10}
        />
        <ArrowAnnotated
          x1={346}
          y1={86}
          x2={376}
          y2={86}
          color={SCHEMA_COLORS.securite}
          label="consolidé"
          labelDy={-10}
        />

        {/* ---- Variables didactiques ---- */}
        <text x={270} y={242} fill="currentColor" fontSize={12} fontWeight={700} textAnchor="middle">
          Variables didactiques : une difficulté augmente à la fois
        </text>
        <ArrowAnnotated
          x1={20}
          y1={272}
          x2={520}
          y2={272}
          color={SCHEMA_COLORS.eau}
          label="Profondeur : faible → croissante"
          labelDy={-8}
        />
        <ArrowAnnotated
          x1={20}
          y1={308}
          x2={520}
          y2={308}
          color={SCHEMA_COLORS.vigilance}
          label="Visibilité, repères : maîtrisés → variables"
          labelDy={-8}
        />
        <ArrowAnnotated
          x1={20}
          y1={344}
          x2={520}
          y2={344}
          color={SCHEMA_COLORS.neutre}
          label="Effort, milieu : abrité → conditions réelles"
          labelDy={-8}
        />
        <text x={270} y={372} fill={SCHEMA_COLORS.securite} fontSize={11} textAnchor="middle">
          Chaque étape est validée avant d&apos;augmenter la difficulté.
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "eau", libelle: "Milieu aquatique et profondeur" },
          { couleur: "securite", libelle: "Compétence réinvestie puis consolidée" },
          { couleur: "vigilance", libelle: "Variables à surveiller (visibilité, repères)" },
          { couleur: "neutre", libelle: "Effort et conditions de milieu" },
        ]}
      />
    </>
  );
}
