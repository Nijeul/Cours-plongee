import {
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/** Props de la frise d'autonomie. */
export interface SchemaFriseAutonomieProps {
  /**
   * Niveau d'affichage : à partir de `"n3"`, la frise ajoute la brique
   * « pression de demi-tour » (réserve + air de la remontée et des paliers),
   * conformément au module de planification N3.
   */
  level?: "n1" | "n2" | "n3" | "n4" | "mf1";
}

/**
 * Frise du calcul d'autonomie en air, avec l'exemple étalon du cours N2 :
 * bloc 12 L à 200 bar, réserve 50 bar, consommation 20 L/min en surface,
 * plongée à 20 m. Trois étapes : litres disponibles (1 800 L), consommation
 * au fond (60 L/min), autonomie (30 min). La variante N3 ajoute la pression
 * de demi-tour (réserve + air de la remontée et des paliers).
 */
export function SchemaFriseAutonomie({ level }: SchemaFriseAutonomieProps = {}) {
  const varianteN3 = level === "n3";
  const hauteur = varianteN3 ? 290 : 155;

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={hauteur}
        titre="Le calcul d'autonomie en air en trois étapes"
        description={
          varianteN3
            ? "Frise du calcul d'autonomie (litres disponibles, consommation au fond, minutes) avec l'exemple étalon 12 litres à 200 bar à 20 mètres, complétée par la pression de demi-tour du niveau 3 : réserve plus air de la remontée et des paliers."
            : "Frise du calcul d'autonomie : 150 bar utiles fois 12 litres donnent 1 800 litres ; la consommation à 20 mètres vaut 20 litres par minute fois 3 bar, soit 60 litres par minute ; l'autonomie est de 30 minutes."
        }
      >
        <text
          x={270}
          y={20}
          fill="currentColor"
          fontSize={11}
          fontWeight={600}
          textAnchor="middle"
        >
          Exemple étalon : bloc 12 L à 200 bar, réserve 50 bar, 20 L/min en surface
        </text>

        <FlowBox
          x={8}
          y={40}
          width={158}
          lignes={["1. Litres disponibles", "(200 − 50) × 12 L", "= 1 800 L"]}
          color={SCHEMA_COLORS.pression}
        />
        <FlowArrow x1={166} y1={72} x2={191} y2={72} />
        <FlowBox
          x={191}
          y={40}
          width={158}
          lignes={["2. Conso au fond", "20 L/min × 3 bar", "= 60 L/min à 20 m"]}
          color={SCHEMA_COLORS.vigilance}
        />
        <FlowArrow x1={349} y1={72} x2={374} y2={72} />
        <FlowBox
          x={374}
          y={40}
          width={158}
          lignes={["3. Autonomie", "1 800 L ÷ 60 L/min", "= 30 minutes"]}
          color={SCHEMA_COLORS.securite}
        />

        <text x={270} y={132} fill={SCHEMA_COLORS.neutre} fontSize={11} textAnchor="middle">
          Même bloc à 40 m : 20 × 5 = 100 L/min → 1 800 ÷ 100 = 18 min
        </text>

        {varianteN3 ? (
          <>
            <FlowArrow x1={270} y1={142} x2={270} y2={168} color={SCHEMA_COLORS.vigilance} />
            <FlowBox
              x={160}
              y={172}
              width={220}
              lignes={[
                "Pression de demi-tour (N3)",
                "= réserve + air de la",
                "remontée et des paliers",
                "Ex. bloc 15 L : 50 + 26 bar",
                "→ demi-tour à 76 bar mini",
              ]}
              color={SCHEMA_COLORS.vigilance}
            />
          </>
        ) : null}
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "pression", libelle: "Air réellement disponible (réserve déduite)" },
          { couleur: "vigilance", libelle: "Consommation multipliée par la pression absolue" },
          { couleur: "securite", libelle: "Autonomie théorique au fond (majorant)" },
        ]}
      />
    </>
  );
}
