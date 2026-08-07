import {
  ArrowAnnotated,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Zoom sur la membrane alvéolo-capillaire : une alvéole remplie d'air au
 * contact d'un capillaire. L'oxygène diffuse de l'alvéole vers le sang
 * (flèche turquoise), le gaz carbonique fait le trajet inverse (flèche
 * grise). Le sang veineux entre à gauche et ressort artériel à droite.
 */
export function SchemaAlveoleEchanges() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={520}
        viewBoxHeight={350}
        titre="Les échanges gazeux entre l'alvéole et le capillaire"
        description="Une alvéole au contact d'un capillaire : l'oxygène passe de l'air alvéolaire vers le sang, le gaz carbonique du sang vers l'alvéole."
      >
        {/* Bronchiole d'entrée */}
        <line x1={150} y1={28} x2={150} y2={58} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <line x1={180} y1={28} x2={180} y2={58} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <text x={255} y={40} fontSize={11} fill={SCHEMA_COLORS.air} textAnchor="middle">
          air inspiré / expiré
        </text>

        {/* Alvéole */}
        <circle
          cx={165}
          cy={140}
          r={85}
          fill={SCHEMA_COLORS.air}
          fillOpacity={0.1}
          stroke={SCHEMA_COLORS.air}
          strokeWidth={2.5}
        />
        <text x={165} y={110} fontSize={13} fontWeight={600} fill="currentColor" textAnchor="middle">
          Alvéole (air)
        </text>
        <text x={165} y={130} fontSize={11} fill="currentColor" textAnchor="middle">
          PpO₂ élevée
        </text>
        <text x={165} y={146} fontSize={11} fill="currentColor" textAnchor="middle">
          PpCO₂ faible
        </text>

        {/* Membrane alvéolo-capillaire */}
        <text x={300} y={240} fontSize={11} fill="currentColor" textAnchor="start">
          membrane alvéolo-capillaire (&lt; 1 µm)
        </text>
        <line x1={296} y1={237} x2={225} y2={247} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />

        {/* Capillaire : sang veineux à gauche, artériel à droite */}
        <rect x={30} y={255} width={220} height={45} fill={SCHEMA_COLORS.azote} fillOpacity={0.12} />
        <rect x={250} y={255} width={240} height={45} fill={SCHEMA_COLORS.oxygene} fillOpacity={0.12} />
        <line x1={30} y1={255} x2={490} y2={255} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <line x1={30} y1={300} x2={490} y2={300} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        {/* Globules rouges */}
        <ellipse cx={70} cy={278} rx={10} ry={6} fill={SCHEMA_COLORS.azote} fillOpacity={0.45} stroke={SCHEMA_COLORS.azote} strokeWidth={1} />
        <ellipse cx={120} cy={278} rx={10} ry={6} fill={SCHEMA_COLORS.azote} fillOpacity={0.45} stroke={SCHEMA_COLORS.azote} strokeWidth={1} />
        <ellipse cx={310} cy={278} rx={10} ry={6} fill={SCHEMA_COLORS.oxygene} fillOpacity={0.45} stroke={SCHEMA_COLORS.oxygene} strokeWidth={1} />
        <ellipse cx={370} cy={278} rx={10} ry={6} fill={SCHEMA_COLORS.oxygene} fillOpacity={0.45} stroke={SCHEMA_COLORS.oxygene} strokeWidth={1} />
        <ellipse cx={430} cy={278} rx={10} ry={6} fill={SCHEMA_COLORS.oxygene} fillOpacity={0.45} stroke={SCHEMA_COLORS.oxygene} strokeWidth={1} />

        {/* Échanges : O2 vers le sang, CO2 vers l'alvéole */}
        <ArrowAnnotated
          x1={140}
          y1={225}
          x2={140}
          y2={276}
          color={SCHEMA_COLORS.oxygene}
          strokeWidth={2.5}
          label="O₂"
          labelDx={-16}
          labelDy={6}
        />
        <ArrowAnnotated
          x1={210}
          y1={272}
          x2={210}
          y2={218}
          color={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
          label="CO₂"
          labelDx={22}
          labelDy={6}
        />

        {/* Sens du sang et états */}
        <text x={100} y={322} fontSize={11} fill={SCHEMA_COLORS.azote} textAnchor="middle">
          Sang veineux
        </text>
        <text x={100} y={336} fontSize={11} fill={SCHEMA_COLORS.azote} textAnchor="middle">
          (pauvre en O₂, riche en CO₂)
        </text>
        <ArrowAnnotated
          x1={185}
          y1={330}
          x2={320}
          y2={330}
          color={SCHEMA_COLORS.neutre}
          strokeWidth={2}
          label="sens de la circulation"
          labelDy={-8}
        />
        <text x={410} y={322} fontSize={11} fill={SCHEMA_COLORS.oxygene} textAnchor="middle">
          Sang artériel
        </text>
        <text x={410} y={336} fontSize={11} fill={SCHEMA_COLORS.oxygene} textAnchor="middle">
          (riche en O₂)
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "air", libelle: "Air alvéolaire" },
          { couleur: "oxygene", libelle: "O₂ / sang artériel" },
          { couleur: "azote", libelle: "Sang veineux" },
          { couleur: "neutre", libelle: "CO₂ (vers l'expiration)" },
          { couleur: "tissu", libelle: "Paroi du capillaire" },
        ]}
      />
    </>
  );
}
