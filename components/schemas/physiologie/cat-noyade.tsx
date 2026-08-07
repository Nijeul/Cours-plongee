import {
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Logigramme de la conduite à tenir devant une noyade, conforme au cours
 * N2 : sortie de l'eau rapide en gardant les voies aériennes émergées,
 * bilan et libération des voies aériennes, puis selon la ventilation :
 * oxygène 15 L/min en inhalation, ou insufflations puis RCP ; protection
 * thermique, alerte (CROSS VHF 16 / 196 / 15 / 112) et évacuation avec
 * hospitalisation systématique.
 */
export function SchemaCatNoyade() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={480}
        viewBoxHeight={560}
        titre="Conduite à tenir devant une noyade"
        description="Logigramme : sortir la victime de l'eau, bilan et libération des voies aériennes, oxygène en inhalation si elle ventile ou RCP sinon, alerte et hospitalisation systématique."
      >
        <FlowBox
          x={115}
          y={12}
          width={250}
          lignes={["1. Sortir la victime de l'eau,", "voies aériennes hors de l'eau"]}
          color={SCHEMA_COLORS.neutre}
        />
        <FlowArrow x1={240} y1={62} x2={240} y2={85} color={SCHEMA_COLORS.neutre} />
        <FlowBox
          x={115}
          y={87}
          width={250}
          lignes={["2. Bilan des fonctions vitales,", "libération des voies aériennes"]}
          color={SCHEMA_COLORS.neutre}
        />
        <FlowArrow x1={240} y1={137} x2={240} y2={160} color={SCHEMA_COLORS.neutre} />
        <FlowBox
          x={115}
          y={162}
          width={250}
          lignes={["La victime ventile-t-elle ?"]}
          color={SCHEMA_COLORS.vigilance}
        />

        {/* Branche « oui » */}
        <FlowArrow
          x1={115}
          y1={180}
          x2={65}
          y2={230}
          coude="horizontal-vertical"
          label="Oui"
          labelDx={-12}
          labelDy={-10}
          color={SCHEMA_COLORS.neutre}
        />
        <FlowBox
          x={10}
          y={232}
          width={215}
          lignes={["Elle ventile : O₂ 15 L/min", "en inhalation continue"]}
          color={SCHEMA_COLORS.securite}
        />

        {/* Branche « non » */}
        <FlowArrow
          x1={365}
          y1={180}
          x2={415}
          y2={230}
          coude="horizontal-vertical"
          label="Non"
          labelDx={12}
          labelDy={-10}
          color={SCHEMA_COLORS.neutre}
        />
        <FlowBox
          x={255}
          y={232}
          width={215}
          lignes={["Elle ne ventile pas :", "insufflations puis RCP,", "O₂ 15 L/min (BAVU)"]}
          color={SCHEMA_COLORS.danger}
        />

        {/* Convergence */}
        <FlowArrow x1={117} y1={284} x2={117} y2={330} color={SCHEMA_COLORS.neutre} />
        <FlowArrow x1={362} y1={299} x2={362} y2={330} color={SCHEMA_COLORS.neutre} />
        <FlowBox
          x={115}
          y={332}
          width={250}
          lignes={["3. Protection thermique,", "surveillance continue"]}
          color={SCHEMA_COLORS.neutre}
        />
        <FlowArrow x1={240} y1={382} x2={240} y2={405} color={SCHEMA_COLORS.neutre} />
        <FlowBox
          x={115}
          y={407}
          width={250}
          lignes={["4. Alerter : CROSS VHF 16,", "tél. 196, 15 ou 112"]}
          color={SCHEMA_COLORS.vigilance}
        />
        <FlowArrow x1={240} y1={457} x2={240} y2={480} color={SCHEMA_COLORS.neutre} />
        <FlowBox
          x={115}
          y={482}
          width={250}
          lignes={["5. Évacuation et hospitalisation", "systématiques, même si", "la victime récupère"]}
          color={SCHEMA_COLORS.neutre}
        />
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "vigilance", libelle: "Point de décision / alerte" },
          { couleur: "securite", libelle: "Victime qui ventile" },
          { couleur: "danger", libelle: "Détresse : RCP" },
          { couleur: "neutre", libelle: "Étapes de la prise en charge" },
        ]}
      />
    </>
  );
}
