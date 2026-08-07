import {
  ArrowAnnotated,
  BubbleColumn,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  WaterBackground,
} from "@/components/schemas/primitives";

/**
 * La déperdition thermique du plongeur : silhouette de face avec les zones
 * de perte majeures (tête, cou, aisselles, aines), les deux modes de perte
 * (conduction par contact avec l'eau, convection par renouvellement de
 * l'eau dans la combinaison), la ventilation d'air froid et sec, et le
 * facteur clé : l'eau refroidit environ 25 fois plus vite que l'air.
 */
export function SchemaDeperditionThermique() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={500}
        viewBoxHeight={410}
        titre="Les zones et modes de déperdition thermique"
        description="Plongeur de face avec les zones de perte de chaleur (tête, cou, aisselles, aines), la conduction et la convection, et le rappel que l'eau refroidit 25 fois plus vite que l'air."
      >
        <WaterBackground x={0} width={500} surfaceY={28} bottomY={400} />

        {/* Badge × 25 */}
        <rect x={325} y={342} width={160} height={60} rx={10} fill={SCHEMA_COLORS.pression} fillOpacity={0.08} stroke={SCHEMA_COLORS.pression} strokeWidth={1.5} />
        <text x={405} y={362} fontSize={15} fontWeight={700} fill={SCHEMA_COLORS.pression} textAnchor="middle">
          × 25
        </text>
        <text x={405} y={380} fontSize={11} fill={SCHEMA_COLORS.pression} textAnchor="middle">
          l&apos;eau refroidit ≈ 25 fois
        </text>
        <text x={405} y={395} fontSize={11} fill={SCHEMA_COLORS.pression} textAnchor="middle">
          plus vite que l&apos;air
        </text>

        {/* Plongeur de face (combinaison) */}
        <circle cx={160} cy={85} r={24} fill={SCHEMA_COLORS.tissu} fillOpacity={0.1} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <rect x={150} y={109} width={20} height={14} fill={SCHEMA_COLORS.tissu} fillOpacity={0.1} stroke={SCHEMA_COLORS.tissu} strokeWidth={1.5} />
        <rect x={128} y={123} width={64} height={110} rx={16} fill={SCHEMA_COLORS.tissu} fillOpacity={0.1} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <line x1={134} y1={133} x2={112} y2={205} stroke={SCHEMA_COLORS.tissu} strokeWidth={10} strokeLinecap="round" />
        <line x1={186} y1={133} x2={208} y2={205} stroke={SCHEMA_COLORS.tissu} strokeWidth={10} strokeLinecap="round" />
        <line x1={146} y1={233} x2={140} y2={330} stroke={SCHEMA_COLORS.tissu} strokeWidth={12} strokeLinecap="round" />
        <line x1={174} y1={233} x2={180} y2={330} stroke={SCHEMA_COLORS.tissu} strokeWidth={12} strokeLinecap="round" />

        {/* Zones de perte majeures */}
        <ellipse cx={160} cy={70} rx={20} ry={14} fill={SCHEMA_COLORS.danger} fillOpacity={0.3} stroke={SCHEMA_COLORS.danger} strokeWidth={1.5} />
        <ellipse cx={160} cy={116} rx={14} ry={8} fill={SCHEMA_COLORS.danger} fillOpacity={0.3} stroke={SCHEMA_COLORS.danger} strokeWidth={1.5} />
        <ellipse cx={134} cy={140} rx={8} ry={10} fill={SCHEMA_COLORS.danger} fillOpacity={0.3} stroke={SCHEMA_COLORS.danger} strokeWidth={1.5} />
        <ellipse cx={186} cy={140} rx={8} ry={10} fill={SCHEMA_COLORS.danger} fillOpacity={0.3} stroke={SCHEMA_COLORS.danger} strokeWidth={1.5} />
        <ellipse cx={148} cy={238} rx={8} ry={9} fill={SCHEMA_COLORS.danger} fillOpacity={0.3} stroke={SCHEMA_COLORS.danger} strokeWidth={1.5} />
        <ellipse cx={172} cy={238} rx={8} ry={9} fill={SCHEMA_COLORS.danger} fillOpacity={0.3} stroke={SCHEMA_COLORS.danger} strokeWidth={1.5} />

        {/* Étiquettes des zones */}
        <text x={310} y={64} fontSize={12} fill={SCHEMA_COLORS.danger} textAnchor="start">
          Tête et cou
        </text>
        <text x={310} y={78} fontSize={11} fill={SCHEMA_COLORS.danger} textAnchor="start">
          (pertes majeures)
        </text>
        <line x1={183} y1={68} x2={305} y2={60} stroke={SCHEMA_COLORS.danger} strokeWidth={1} />
        <line x1={176} y1={116} x2={305} y2={68} stroke={SCHEMA_COLORS.danger} strokeWidth={1} />

        <text x={310} y={143} fontSize={12} fill={SCHEMA_COLORS.danger} textAnchor="start">
          Aisselles
        </text>
        <line x1={196} y1={140} x2={305} y2={139} stroke={SCHEMA_COLORS.danger} strokeWidth={1} />

        <text x={310} y={243} fontSize={12} fill={SCHEMA_COLORS.danger} textAnchor="start">
          Aines
        </text>
        <line x1={182} y1={238} x2={305} y2={239} stroke={SCHEMA_COLORS.danger} strokeWidth={1} />

        {/* Ventilation d'air froid et sec */}
        <BubbleColumn x={192} yFrom={72} yTo={36} count={4} />
        <text x={310} y={100} fontSize={11} fill={SCHEMA_COLORS.air} textAnchor="start">
          ventilation d&apos;air
        </text>
        <text x={310} y={114} fontSize={11} fill={SCHEMA_COLORS.air} textAnchor="start">
          détendu, froid et sec
        </text>

        {/* Conduction */}
        <text x={16} y={150} fontSize={11} fill={SCHEMA_COLORS.pression} textAnchor="start">
          Conduction :
        </text>
        <text x={16} y={164} fontSize={11} fill={SCHEMA_COLORS.pression} textAnchor="start">
          contact direct avec l&apos;eau
        </text>
        <ArrowAnnotated x1={60} y1={178} x2={122} y2={178} color={SCHEMA_COLORS.pression} strokeWidth={2} />

        {/* Convection */}
        <ArrowAnnotated x1={215} y1={300} x2={240} y2={215} color={SCHEMA_COLORS.eau} strokeWidth={2} pointilles />
        <ArrowAnnotated x1={198} y1={325} x2={225} y2={245} color={SCHEMA_COLORS.eau} strokeWidth={2} pointilles />
        <text x={300} y={300} fontSize={11} fill={SCHEMA_COLORS.eau} textAnchor="start">
          Convection : l&apos;eau
        </text>
        <text x={300} y={314} fontSize={11} fill={SCHEMA_COLORS.eau} textAnchor="start">
          renouvelée dans la combinaison
        </text>
        <text x={300} y={328} fontSize={11} fill={SCHEMA_COLORS.eau} textAnchor="start">
          emporte la chaleur
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "danger", libelle: "Zones de perte majeures" },
          { couleur: "pression", libelle: "Conduction (× 25 vs l'air)" },
          { couleur: "eau", libelle: "Convection" },
          { couleur: "air", libelle: "Ventilation" },
          { couleur: "tissu", libelle: "Plongeur en combinaison" },
        ]}
      />
    </>
  );
}
