import {
  ArrowAnnotated,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  flowBoxHeight,
} from "@/components/schemas/primitives";

/** Abscisse du centre de la pyramide. */
const PYRAMIDE_CX = 235;
/** Écart vertical entre deux étages. */
const ESPACE = 6;
/** Ordonnée du sommet (étage « créer »). */
const Y_SOMMET = 40;

/**
 * Étages de la pyramide, du sommet (créer) à la base (mémoriser).
 * Chaque étage porte le verbe taxonomique et un exemple plongée
 * repris du cours mf1-pedagogie-organisation.
 */
const ETAGES: Array<{ largeur: number; lignes: [string, string] }> = [
  { largeur: 250, lignes: ["Créer", "concevoir une séance"] },
  { largeur: 280, lignes: ["Évaluer", "juger une décision de palanquée"] },
  { largeur: 310, lignes: ["Analyser", "analyser un profil de plongée"] },
  { largeur: 340, lignes: ["Appliquer", "appliquer une consigne, une règle"] },
  { largeur: 370, lignes: ["Comprendre", "expliquer l'équilibrage avec ses mots"] },
  { largeur: 400, lignes: ["Mémoriser", "citer les barotraumatismes"] },
];

/** Accolade verticale de calibrage (niveau de plongeur) à droite de la pyramide. */
function AccoladeNiveau({ x, yTop, yBottom, label }: {
  x: number;
  yTop: number;
  yBottom: number;
  label: string;
}) {
  return (
    <g>
      <path
        d={`M ${x - 6} ${yTop} H ${x} V ${yBottom} H ${x - 6}`}
        fill="none"
        stroke={SCHEMA_COLORS.securite}
        strokeWidth={1.5}
      />
      <text
        x={x}
        y={yTop - 8}
        fill={SCHEMA_COLORS.securite}
        fontSize={12}
        fontWeight={700}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
}

/**
 * Taxonomie de Bloom appliquée à la plongée (MF1, pédagogie et organisation) :
 * pyramide des six niveaux cognitifs, de mémoriser (base) à créer (sommet),
 * avec un exemple plongée par niveau et le calibrage des objectifs par niveau
 * de plongeur — N1 jusqu'à appliquer, N4 jusqu'à analyser/évaluer, MF1
 * jusqu'à créer.
 */
export function SchemaTaxonomieBloom() {
  const h2 = flowBoxHeight(2);
  const yEtage = (indexDepuisSommet: number) => Y_SOMMET + indexDepuisSommet * (h2 + ESPACE);
  const yBase = yEtage(ETAGES.length - 1) + h2; // bas de « mémoriser »

  return (
    <>
      <SchemaSvg
        viewBoxWidth={560}
        viewBoxHeight={385}
        titre="Taxonomie de Bloom appliquée à la plongée"
        description="Pyramide des six niveaux cognitifs (mémoriser, comprendre, appliquer, analyser, évaluer, créer) avec un exemple plongée par niveau et les repères de calibrage N1, N4 et MF1."
      >
        {/* ---- Étages de la pyramide (du sommet à la base) ---- */}
        {ETAGES.map((etage, i) => (
          <FlowBox
            key={etage.lignes[0]}
            x={PYRAMIDE_CX - etage.largeur / 2}
            y={yEtage(i)}
            width={etage.largeur}
            lignes={etage.lignes}
            color={SCHEMA_COLORS.neutre}
          />
        ))}

        {/* ---- Flèche de complexité croissante, le long du flanc gauche ---- */}
        <ArrowAnnotated
          x1={20}
          y1={yBase}
          x2={88}
          y2={Y_SOMMET}
          color={SCHEMA_COLORS.vigilance}
          strokeWidth={1.5}
        />
        <text
          x={40}
          y={205}
          transform="rotate(-78 40 205)"
          fill={SCHEMA_COLORS.vigilance}
          fontSize={11}
          textAnchor="middle"
        >
          complexité croissante
        </text>

        {/* ---- Calibrage des objectifs par niveau de plongeur ----
            Accolades cumulatives : chaque niveau englobe les précédents. */}
        <AccoladeNiveau x={452} yTop={yEtage(3)} yBottom={yBase} label="N1" />
        <AccoladeNiveau x={492} yTop={yEtage(1)} yBottom={yBase} label="N4" />
        <AccoladeNiveau x={532} yTop={yEtage(0)} yBottom={yBase} label="MF1" />
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "neutre", libelle: "Niveaux taxonomiques, avec un exemple plongée" },
          { couleur: "vigilance", libelle: "Opérations mentales de plus en plus complexes" },
          { couleur: "securite", libelle: "Calibrage des objectifs : N1, N4, MF1" },
        ]}
      />
    </>
  );
}
