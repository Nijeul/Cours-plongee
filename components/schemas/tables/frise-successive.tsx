import {
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Frise de la plongée successive : plongée 1 et son GPS, intervalle de
 * surface, azote résiduel (tableau II), majoration (tableau III), puis
 * plongée 2 lue avec sa durée fictive. Reprend l'exemple corrigé du cours
 * N2 (couvert par le jeu de données du site) : 20 m / 40 min → GPS H,
 * intervalle 2 h → azote 0,97, tableau III (1,01 × 20 m) → majoration
 * 16 min, plongée 2 de 25 min réelles → durée fictive 41 min → table
 * 20 m / 45 min : 4 min à 3 m, GPS I.
 */
export function SchemaFriseSuccessive() {
  const boxX = 160;
  const boxW = 220;
  const cx = boxX + boxW / 2;

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={430}
        titre="La plongée successive en cinq étapes"
        description="Frise chronologique de la plongée successive : plongée 1 à 20 mètres pendant 40 minutes donnant le GPS H, intervalle de surface de 2 heures, tableau II donnant l'azote résiduel 0,97, tableau III donnant la majoration de 16 minutes, puis plongée 2 lue avec la durée fictive de 41 minutes, soit 4 minutes de palier à 3 mètres et GPS I."
      >
        <text x={270} y={18} fill="currentColor" fontSize={12} fontWeight={600} textAnchor="middle">
          Exemple corrigé du cours (jeu de données du site)
        </text>

        <FlowBox
          x={boxX}
          y={30}
          width={boxW}
          lignes={["Plongée 1 : 20 m, 40 min", "Tableau I → GPS H"]}
          color={SCHEMA_COLORS.pression}
        />
        <FlowArrow x1={cx} y1={80} x2={cx} y2={98} />
        <FlowBox
          x={boxX}
          y={98}
          width={boxW}
          lignes={["Intervalle surface : 2 h", "(15 min à 12 h → successive)"]}
          color={SCHEMA_COLORS.neutre}
        />
        <FlowArrow x1={cx} y1={148} x2={cx} y2={166} />
        <FlowBox
          x={boxX}
          y={166}
          width={boxW}
          lignes={["Tableau II : H × 120 min", "→ azote résiduel 0,97"]}
          color={SCHEMA_COLORS.azote}
        />
        <FlowArrow x1={cx} y1={216} x2={cx} y2={234} />
        <FlowBox
          x={boxX}
          y={234}
          width={boxW}
          lignes={["Tableau III : 0,97 → 1,01", "et 20 m → majoration 16 min"]}
          color={SCHEMA_COLORS.vigilance}
        />
        <FlowArrow x1={cx} y1={284} x2={cx} y2={302} />
        <FlowBox
          x={boxX}
          y={302}
          width={boxW}
          lignes={[
            "Plongée 2 : 20 m, 25 min",
            "durée fictive 25 + 16 = 41 min",
            "Table 20 m / 45 min :",
            "4 min à 3 m — GPS I",
          ]}
          color={SCHEMA_COLORS.securite}
        />

        <text x={270} y={404} fill="currentColor" fontSize={11} textAnchor="middle">
          Arrondis conservateurs : intervalle en dessous ; azote résiduel et profondeur au-dessus.
        </text>
        <text x={270} y={420} fill={SCHEMA_COLORS.vigilance} fontSize={11} textAnchor="middle">
          Valeurs à vérifier sur un exemplaire officiel des tables MN90.
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "pression", libelle: "Plongée 1 et son GPS" },
          { couleur: "azote", libelle: "Azote résiduel (tableau II)" },
          { couleur: "vigilance", libelle: "Majoration (tableau III)" },
          { couleur: "securite", libelle: "Plongée 2 lue avec la durée fictive" },
        ]}
      />
    </>
  );
}
