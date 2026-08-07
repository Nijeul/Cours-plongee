import {
  ArrowAnnotated,
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Logigramme de la panne d'air, conforme au cours N2 matériel : quel que
 * soit le problème (fuite importante, débit continu, inspiration
 * impossible), la réponse de la palanquée est la même — signe « panne
 * d'air », deuxième étage de secours (octopus) de l'équipier, remontée
 * contrôlée à deux en respectant la procédure (vitesse, paliers). Une
 * note rappelle qu'un détendeur en débit continu reste respirable en
 * attendant, et que la vraie panne d'air est presque toujours une panne
 * de gestion (manomètre non consulté).
 */
export function SchemaLogigrammePanneAir() {
  const colX = 40;
  const colW = 230;
  const cx = colX + colW / 2;

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={452}
        titre="Panne d'air : la réponse de la palanquée"
        description="Logigramme : en cas de panne d'air (fuite, débit continu, plus d'air), le plongeur fait le signe panne d'air, respire sur le deuxième étage de secours de l'équipier, puis la palanquée remonte à deux de façon contrôlée en respectant vitesse et paliers ; un détendeur en débit continu reste respirable en attendant, et la réserve d'air fond très vite."
      >
        <FlowBox
          x={colX}
          y={8}
          width={colW}
          lignes={["Panne d'air : fuite importante,", "débit continu, inspiration", "impossible"]}
          color={SCHEMA_COLORS.danger}
        />
        {/* Note latérale : le débit continu reste respirable */}
        <FlowBox
          x={310}
          y={8}
          width={210}
          lignes={[
            "Débit continu (givrage,",
            "impureté) : on peut respirer",
            "dessus — embout en bouche",
            "sans le serrer, laisser fuir",
            "l'excédent, prélever l'air",
          ]}
          color={SCHEMA_COLORS.vigilance}
        />
        <ArrowAnnotated
          x1={310}
          y1={41}
          x2={colX + colW}
          y2={41}
          color={SCHEMA_COLORS.vigilance}
          strokeWidth={1.5}
          pointilles
        />

        <FlowArrow x1={cx} y1={73} x2={cx} y2={93} />
        <FlowBox
          x={colX}
          y={93}
          width={colW}
          lignes={["1. Signe « panne d'air »", "à l'équipier"]}
          color={SCHEMA_COLORS.securite}
        />
        <FlowArrow x1={cx} y1={143} x2={cx} y2={163} />
        <FlowBox
          x={colX}
          y={163}
          width={colW}
          lignes={["2. Air de l'équipier :", "son deuxième étage de", "secours (octopus)"]}
          color={SCHEMA_COLORS.securite}
        />
        <FlowArrow x1={cx} y1={228} x2={cx} y2={248} />
        <FlowBox
          x={colX}
          y={248}
          width={colW}
          lignes={["3. Remontée contrôlée à deux,", "en respectant la procédure", "(vitesse, paliers)"]}
          color={SCHEMA_COLORS.securite}
        />
        <FlowArrow x1={cx} y1={313} x2={cx} y2={333} />
        <FlowBox
          x={colX}
          y={333}
          width={colW}
          lignes={["La réserve d'air fond très", "vite : fin de plongée,", "manomètre surveillé"]}
          color={SCHEMA_COLORS.vigilance}
        />

        <text x={270} y={428} fill="currentColor" fontSize={11} textAnchor="middle">
          Prévention : la vraie « panne d&apos;air » est presque toujours une panne de gestion —
        </text>
        <text x={270} y={443} fill="currentColor" fontSize={11} textAnchor="middle">
          consulter régulièrement son manomètre.
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "danger", libelle: "Panne d'air (toutes causes)" },
          { couleur: "securite", libelle: "Réponse de la palanquée, identique dans tous les cas" },
          { couleur: "vigilance", libelle: "Points de vigilance (débit continu respirable, réserve)" },
        ]}
      />
    </>
  );
}
