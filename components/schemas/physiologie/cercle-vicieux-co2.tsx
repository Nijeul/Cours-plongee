import {
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Le cercle vicieux du CO₂ (essoufflement) : effort → accumulation de CO₂ →
 * ventilation rapide et superficielle → seul l'espace mort est renouvelé,
 * le CO₂ monte encore → angoisse et panique → nouvel effort. La sortie de
 * boucle est fléchée en vert : stopper l'effort, se calmer, expirer à fond.
 */
export function SchemaCercleVicieuxCO2() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={520}
        viewBoxHeight={480}
        titre="Le cercle vicieux du CO₂ et sa sortie"
        description="Boucle fléchée de l'essoufflement : effort, accumulation de CO₂, ventilation rapide et superficielle, espace mort, panique — avec la sortie en vert : stop, se calmer, expirer à fond."
      >
        {/* Boucle (sens horaire, en rouge) */}
        <FlowBox x={175} y={20} lignes={["Effort, stress, froid"]} color={SCHEMA_COLORS.danger} />
        <FlowBox x={330} y={120} lignes={["Le CO₂ s'accumule"]} color={SCHEMA_COLORS.danger} />
        <FlowBox
          x={300}
          y={250}
          lignes={["Ventilation rapide", "et superficielle"]}
          color={SCHEMA_COLORS.danger}
        />
        <FlowBox
          x={20}
          y={250}
          lignes={["Seul l'espace mort est", "renouvelé : le CO₂", "monte encore"]}
          color={SCHEMA_COLORS.danger}
        />
        <FlowBox x={20} y={120} lignes={["Angoisse, panique"]} color={SCHEMA_COLORS.danger} />

        <FlowArrow x1={347} y1={45} x2={410} y2={118} color={SCHEMA_COLORS.danger} />
        <FlowArrow x1={415} y1={157} x2={395} y2={248} color={SCHEMA_COLORS.danger} />
        <FlowArrow x1={298} y1={275} x2={192} y2={275} color={SCHEMA_COLORS.danger} />
        <FlowArrow x1={105} y1={248} x2={105} y2={157} color={SCHEMA_COLORS.danger} />
        <FlowArrow x1={105} y1={118} x2={173} y2={45} color={SCHEMA_COLORS.danger} />

        {/* Centre de la boucle */}
        <text x={247} y={190} fontSize={13} fontWeight={700} fill={SCHEMA_COLORS.danger} textAnchor="middle">
          Cercle vicieux
        </text>
        <text x={247} y={206} fontSize={13} fontWeight={700} fill={SCHEMA_COLORS.danger} textAnchor="middle">
          du CO₂
        </text>

        {/* Sortie de la boucle, en vert */}
        <FlowArrow
          x1={105}
          y1={318}
          x2={105}
          y2={398}
          color={SCHEMA_COLORS.securite}
          label="casser la boucle"
          labelDx={62}
          labelDy={4}
        />
        <FlowBox
          x={70}
          y={400}
          width={290}
          lignes={["Stopper tout effort, se tenir,", "se calmer, expirer à fond :", "le CO₂ s'évacue à l'expiration"]}
          color={SCHEMA_COLORS.securite}
        />
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "danger", libelle: "Le cercle vicieux s'auto-entretient" },
          { couleur: "securite", libelle: "Sortie de la boucle" },
        ]}
      />
    </>
  );
}
