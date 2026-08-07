import {
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Logigramme de la remontée rapide (vitesse supérieure à 17 m/min),
 * conforme à la procédure MN90 des cours N2/N3 : redescendre toute la
 * palanquée à la mi-profondeur dans les 3 minutes, y rester 5 minutes,
 * effectuer les paliers de la table (durée comptée de l'immersion à la
 * fin du palier à mi-profondeur, profondeur maximale), au minimum
 * 2 min à 3 m si la table n'impose rien, puis surveillance ADD sans
 * replongée. Hors délai ou en cas de symptôme : conduite à tenir ADD.
 */
export function SchemaLogigrammeRemonteeRapide() {
  const colX = 40;
  const colW = 210;
  const cx = colX + colW / 2;

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={548}
        titre="Procédure de rattrapage après une remontée rapide"
        description="Logigramme : après une remontée à plus de 17 mètres par minute, si toute la palanquée peut se ré-immerger en moins de 3 minutes, elle redescend à la mi-profondeur pendant 5 minutes puis effectue les paliers de la table avec la durée comptée jusqu'à la fin du palier à mi-profondeur, au minimum 2 minutes à 3 mètres ; sinon, conduite à tenir de l'accident de désaturation."
      >
        <FlowBox
          x={colX}
          y={8}
          width={colW}
          lignes={["Remontée rapide", "vitesse > 17 m/min"]}
          color={SCHEMA_COLORS.danger}
        />
        <FlowArrow x1={cx} y1={58} x2={cx} y2={78} />
        <FlowBox
          x={colX}
          y={78}
          width={colW}
          lignes={["Toute la palanquée peut", "redescendre en < 3 min ?"]}
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
            "Impossible ou hors délai :",
            "conduite à tenir ADD —",
            "O₂, alerte, évacuation,",
            "aucune replongée",
          ]}
          color={SCHEMA_COLORS.danger}
        />
        <FlowArrow x1={cx} y1={128} x2={cx} y2={150} label="Oui" labelDx={-18} labelDy={4} />
        <FlowBox
          x={colX}
          y={150}
          width={colW}
          lignes={["Redescendre à la", "mi-profondeur (moitié", "de la prof. maximale)"]}
          color={SCHEMA_COLORS.securite}
        />
        <FlowArrow x1={cx} y1={215} x2={cx} y2={235} />
        <FlowBox x={colX} y={235} width={colW} lignes={["Y rester 5 minutes"]} color={SCHEMA_COLORS.securite} />
        <FlowArrow x1={cx} y1={270} x2={cx} y2={290} />
        <FlowBox
          x={colX}
          y={290}
          width={colW}
          lignes={[
            "Paliers de la table pour :",
            "durée = immersion → fin",
            "du palier à mi-profondeur,",
            "prof. = prof. maximale",
          ]}
          color={SCHEMA_COLORS.securite}
        />
        <FlowArrow x1={cx} y1={370} x2={cx} y2={390} />
        <FlowBox
          x={colX}
          y={390}
          width={colW}
          lignes={["Aucun palier imposé ?", "Minimum 2 min à 3 m"]}
          color={SCHEMA_COLORS.securite}
        />
        <FlowArrow x1={cx} y1={440} x2={cx} y2={460} />
        <FlowBox
          x={colX}
          y={460}
          width={colW}
          lignes={[
            "Après la sortie :",
            "surveillance ADD, alerte",
            "au moindre signe, pas de",
            "replongée dans les 24 h",
          ]}
          color={SCHEMA_COLORS.vigilance}
        />
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "danger", libelle: "Situation à risque d'ADD" },
          { couleur: "vigilance", libelle: "Décision et surveillance" },
          { couleur: "securite", libelle: "Procédure de rattrapage (dans les 3 min, sans symptôme)" },
        ]}
      />
    </>
  );
}
