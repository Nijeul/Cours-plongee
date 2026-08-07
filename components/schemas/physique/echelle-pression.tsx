import {
  ArrowAnnotated,
  createDepthScale,
  DepthAxis,
  DiverSilhouette,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  WaterBackground,
} from "@/components/schemas/primitives";

/** Paliers de 10 m avec pressions relative et absolue (valeurs du cours). */
const PALIERS = [0, 10, 20, 30, 40, 50, 60] as const;

/**
 * Échelle verticale des pressions de 0 à 60 m : à chaque palier de 10 m,
 * la pression relative (poids de la colonne d'eau) et la pression absolue
 * (relative + 1 bar d'atmosphère) sont affichées côte à côte. Un plongeur
 * repère descend le long de l'axe et une flèche rappelle la règle d'or
 * « +1 bar tous les 10 m ».
 */
export function SchemaEchellePression() {
  const profondeur = createDepthScale({
    minMetres: 0,
    maxMetres: 60,
    yTop: 70,
    yBottom: 430,
  });

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={460}
        titre="Échelle des pressions de 0 à 60 mètres"
        description="Axe vertical gradué de 0 à 60 mètres avec, à chaque palier de 10 mètres, la pression relative (de 0 à 6 bar) et la pression absolue (de 1 à 7 bar)."
      >
        <WaterBackground x={0} width={540} surfaceY={70} bottomY={445} />

        {/* En-têtes de colonnes */}
        <text
          x={300}
          y={44}
          fill={SCHEMA_COLORS.eau}
          fontSize={12}
          fontWeight={600}
          textAnchor="middle"
        >
          Pression relative
        </text>
        <text
          x={440}
          y={44}
          fill={SCHEMA_COLORS.pression}
          fontSize={12}
          fontWeight={600}
          textAnchor="middle"
        >
          Pression absolue
        </text>
        <text x={150} y={62} fill={SCHEMA_COLORS.neutre} fontSize={11} textAnchor="middle">
          Atmosphère = 1 bar
        </text>

        <DepthAxis
          x={80}
          minMetres={0}
          maxMetres={60}
          yTop={70}
          yBottom={430}
          pas={10}
          labelCote="gauche"
        />

        {/* Lignes-guides et valeurs à chaque palier */}
        {PALIERS.map((m) => {
          const y = profondeur(m);
          return (
            <g key={m}>
              <line
                x1={92}
                y1={y}
                x2={490}
                y2={y}
                stroke={SCHEMA_COLORS.neutre}
                strokeWidth={1}
                strokeDasharray="2 5"
                opacity={0.35}
              />
              <text
                x={300}
                y={y - 5}
                fill={SCHEMA_COLORS.eau}
                fontSize={12}
                textAnchor="middle"
              >
                {m / 10} bar
              </text>
              <text
                x={440}
                y={y - 5}
                fill={SCHEMA_COLORS.pression}
                fontSize={12}
                fontWeight={600}
                textAnchor="middle"
              >
                {m / 10 + 1} bar
              </text>
            </g>
          );
        })}

        <DiverSilhouette x={175} y={profondeur(15)} orientation="descente" scale={0.75} />

        <ArrowAnnotated
          x1={150}
          y1={215}
          x2={150}
          y2={400}
          color={SCHEMA_COLORS.pression}
          label="+1 bar tous les 10 m"
        />
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "eau", libelle: "Pression relative (poids de l'eau)" },
          { couleur: "pression", libelle: "Pression absolue = relative + 1 bar" },
        ]}
      />
    </>
  );
}
