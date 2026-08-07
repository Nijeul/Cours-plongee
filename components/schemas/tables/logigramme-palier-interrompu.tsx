import {
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Logigramme du palier interrompu, conforme aux cours N2/N3 : redescendre
 * à la profondeur du palier interrompu dans les 3 minutes et refaire ce
 * palier en entier (le temps déjà effectué est perdu), puis poursuivre la
 * décompression restante. Les paliers plus profonds déjà effectués ne
 * sont pas à refaire. Hors délai : conduite à tenir ADD, pas de
 * ré-immersion improvisée.
 */
export function SchemaLogigrammePalierInterrompu() {
  const colX = 40;
  const colW = 210;
  const cx = colX + colW / 2;

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={412}
        titre="Procédure du palier interrompu"
        description="Logigramme : si un palier est interrompu et que la redescente est possible en moins de 3 minutes, on redescend à la profondeur du palier et on le refait en entier avant de poursuivre la décompression ; sinon, oxygène, surveillance et alerte au moindre signe, sans ré-immersion improvisée."
      >
        <FlowBox
          x={colX}
          y={8}
          width={colW}
          lignes={["Palier interrompu", "(houle, gilet, panne d'air...)"]}
          color={SCHEMA_COLORS.danger}
        />
        <FlowArrow x1={cx} y1={58} x2={cx} y2={78} />
        <FlowBox
          x={colX}
          y={78}
          width={colW}
          lignes={["Redescente possible", "dans les 3 minutes ?"]}
          color={SCHEMA_COLORS.vigilance}
        />
        <FlowArrow
          x1={colX + colW}
          y1={103}
          x2={412}
          y2={148}
          coude="horizontal-vertical"
          label="Non"
          labelDy={-28}
        />
        <FlowBox
          x={300}
          y={148}
          width={225}
          lignes={[
            "Décompression incomplète :",
            "O₂, surveillance, alerte au",
            "moindre signe, pas de",
            "ré-immersion improvisée",
          ]}
          color={SCHEMA_COLORS.danger}
        />
        <FlowArrow x1={cx} y1={128} x2={cx} y2={150} label="Oui" labelDx={-18} labelDy={4} />
        <FlowBox
          x={colX}
          y={150}
          width={colW}
          lignes={["Redescendre à la", "profondeur du palier", "interrompu (< 3 min)"]}
          color={SCHEMA_COLORS.securite}
        />
        <FlowArrow x1={cx} y1={215} x2={cx} y2={235} />
        <FlowBox
          x={colX}
          y={235}
          width={colW}
          lignes={["Refaire ce palier", "EN ENTIER : le temps", "déjà effectué est perdu"]}
          color={SCHEMA_COLORS.securite}
        />
        <FlowArrow x1={cx} y1={300} x2={cx} y2={320} />
        <FlowBox
          x={colX}
          y={320}
          width={colW}
          lignes={["Poursuivre normalement", "la décompression restante"]}
          color={SCHEMA_COLORS.securite}
        />

        <text x={270} y={398} fill="currentColor" fontSize={11} textAnchor="middle">
          Les paliers plus profonds déjà effectués ne sont pas à refaire.
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "danger", libelle: "Interruption et décompression incomplète" },
          { couleur: "vigilance", libelle: "Décision : les 3 minutes" },
          { couleur: "securite", libelle: "Rattrapage : refaire le palier en entier" },
        ]}
      />
    </>
  );
}
