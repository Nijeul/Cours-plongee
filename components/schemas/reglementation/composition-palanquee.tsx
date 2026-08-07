import {
  DiverSilhouette,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";
import {
  PALANQUEE_MAX_AUTONOMES,
  PALANQUEE_MAX_ENCADRES,
} from "@/content/data/reglementation";

/**
 * Vignettes des deux palanquées types du Code du sport : la palanquée
 * encadrée (jusqu'à 4 plongeurs encadrés conduits par un guide de
 * palanquée, N4 minimum en exploration) et la palanquée autonome
 * (2 ou 3 plongeurs majeurs, sans guide — jamais 4). Les effectifs
 * proviennent de `PALANQUEE_MAX_ENCADRES` et `PALANQUEE_MAX_AUTONOMES` ;
 * le quatrième autonome barré matérialise le piège d'examen classique.
 */
export function SchemaCompositionPalanquee() {
  const encadresX = [180, 270, 360, 450];
  const autonomesX = [110, 220, 330];

  return (
    <>
      <SchemaSvg
        viewBoxWidth={520}
        viewBoxHeight={410}
        titre="Composition des palanquées : encadrée et autonome"
        description="Palanquée encadrée : un guide de palanquée et 4 plongeurs encadrés maximum. Palanquée autonome : 2 ou 3 plongeurs majeurs sans guide, le quatrième est interdit."
      >
        {/* ---- Vignette 1 : palanquée encadrée ---- */}
        <rect
          x={14}
          y={16}
          width={492}
          height={170}
          rx={10}
          fill={SCHEMA_COLORS.eau}
          fillOpacity={0.05}
          stroke={SCHEMA_COLORS.eau}
          strokeWidth={1.5}
        />
        <text x={30} y={42} fill={SCHEMA_COLORS.eau} fontSize={13} fontWeight={700}>
          Palanquée encadrée (PE)
        </text>
        <text
          x={490}
          y={42}
          fill={SCHEMA_COLORS.eau}
          fontSize={12}
          fontWeight={600}
          textAnchor="end"
        >
          {PALANQUEE_MAX_ENCADRES} encadrés max + GP
        </text>

        <DiverSilhouette x={78} y={102} orientation="droite" scale={0.7} color={SCHEMA_COLORS.eau} />
        <text
          x={78}
          y={146}
          fill={SCHEMA_COLORS.eau}
          fontSize={11}
          fontWeight={700}
          textAnchor="middle"
        >
          GP — N4 min.
        </text>
        <text x={78} y={161} fill={SCHEMA_COLORS.eau} fontSize={11} textAnchor="middle">
          conduit la plongée
        </text>

        <line
          x1={132}
          y1={62}
          x2={132}
          y2={168}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.6}
        />

        {encadresX.map((x) => (
          <DiverSilhouette key={x} x={x} y={102} orientation="droite" scale={0.6} />
        ))}
        <text x={315} y={150} fill="currentColor" fontSize={11} textAnchor="middle">
          {PALANQUEE_MAX_ENCADRES} plongeurs encadrés maximum
        </text>
        <text x={315} y={165} fill="currentColor" fontSize={11} textAnchor="middle" opacity={0.8}>
          mêmes profondeur, durée et trajet
        </text>

        {/* ---- Vignette 2 : palanquée autonome ---- */}
        <rect
          x={14}
          y={206}
          width={492}
          height={170}
          rx={10}
          fill={SCHEMA_COLORS.vigilance}
          fillOpacity={0.05}
          stroke={SCHEMA_COLORS.vigilance}
          strokeWidth={1.5}
        />
        <text x={30} y={232} fill={SCHEMA_COLORS.vigilance} fontSize={13} fontWeight={700}>
          Palanquée autonome (PA)
        </text>
        <text
          x={490}
          y={232}
          fill={SCHEMA_COLORS.vigilance}
          fontSize={12}
          fontWeight={600}
          textAnchor="end"
        >
          {PALANQUEE_MAX_AUTONOMES} max, sans guide
        </text>

        {autonomesX.map((x) => (
          <DiverSilhouette key={x} x={x} y={292} orientation="droite" scale={0.6} />
        ))}
        <text x={220} y={340} fill="currentColor" fontSize={11} textAnchor="middle">
          2 ou 3 plongeurs autonomes majeurs
        </text>
        <text x={220} y={355} fill="currentColor" fontSize={11} textAnchor="middle" opacity={0.8}>
          sur décision du directeur de plongée
        </text>

        {/* Quatrième plongeur barré : effectif interdit en autonomie. */}
        <g opacity={0.35}>
          <DiverSilhouette
            x={442}
            y={292}
            orientation="droite"
            scale={0.6}
            color={SCHEMA_COLORS.neutre}
          />
        </g>
        <g stroke={SCHEMA_COLORS.danger} strokeWidth={2.5} strokeLinecap="round">
          <line x1={416} y1={272} x2={468} y2={312} />
          <line x1={468} y1={272} x2={416} y2={312} />
        </g>
        <text
          x={442}
          y={340}
          fill={SCHEMA_COLORS.danger}
          fontSize={11}
          fontWeight={700}
          textAnchor="middle"
        >
          pas de 4ᵉ plongeur
        </text>

        {/* Rappel du piège d'examen. */}
        <text
          x={260}
          y={399}
          fill={SCHEMA_COLORS.vigilance}
          fontSize={12}
          fontWeight={600}
          textAnchor="middle"
        >
          Piège classique : {PALANQUEE_MAX_ENCADRES} encadrés + GP, mais{" "}
          {PALANQUEE_MAX_AUTONOMES} autonomes seulement
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "eau", libelle: "Palanquée encadrée — guide de palanquée (GP)" },
          { couleur: "vigilance", libelle: "Palanquée autonome — majeurs, sans guide" },
          { couleur: "danger", libelle: "Effectif interdit" },
        ]}
      />
    </>
  );
}
