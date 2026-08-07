import {
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Panorama des instruments du plongeur autonome : manomètre (pression
 * restante du bloc, zone de réserve à 50 bar), ordinateur de plongée
 * (profondeur, durée, vitesse de remontée, paliers), compas (cap) et
 * montre de plongée (durée, avec tables et profondimètre). Chaque
 * instrument est relié à la grandeur qu'il mesure.
 */
export function SchemaInstruments() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={530}
        titre="Les instruments du plongeur autonome et ce qu'ils mesurent"
        description="Quatre instruments reliés à ce qu'ils mesurent : le manomètre indique la pression restante du bloc avec la réserve à 50 bar, l'ordinateur la profondeur, la durée, la vitesse de remontée et les paliers, le compas le cap, la montre la durée de plongée avec les tables et le profondimètre."
      >
        {/* ===== Manomètre ===== */}
        <text x={140} y={24} fontSize={13} fontWeight={600} fill="currentColor" textAnchor="middle">
          Manomètre (sortie HP)
        </text>
        <circle
          cx={140}
          cy={100}
          r={52}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.05}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
        />
        {/* Graduations */}
        <line x1={92} y1={100} x2={102} y2={100} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        <line x1={140} y1={52} x2={140} y2={62} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        <line x1={188} y1={100} x2={178} y2={100} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        <line x1={106} y1={66} x2={113} y2={73} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        <line x1={174} y1={66} x2={167} y2={73} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        <line x1={106} y1={134} x2={113} y2={127} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        <line x1={174} y1={134} x2={167} y2={127} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        {/* Zone de réserve (0 à 50 bar) */}
        <path
          d="M 108 131 A 46 46 0 0 1 94 101"
          fill="none"
          stroke={SCHEMA_COLORS.vigilance}
          strokeWidth={6}
          strokeLinecap="round"
        />
        <text x={78} y={96} fontSize={11} fill={SCHEMA_COLORS.vigilance} textAnchor="end">
          50
        </text>
        <text x={62} y={130} fontSize={11} fill={SCHEMA_COLORS.vigilance} textAnchor="middle">
          réserve
        </text>
        {/* Aiguille : bloc plein */}
        <line
          x1={140}
          y1={100}
          x2={172}
          y2={66}
          stroke={SCHEMA_COLORS.pression}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={140} cy={100} r={4} fill={SCHEMA_COLORS.pression} />
        <text x={140} y={126} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="middle">
          bar
        </text>
        <FlowArrow x1={140} y1={158} x2={140} y2={192} />
        <FlowBox
          x={55}
          y={196}
          lignes={["Pression du bloc (bar)", "gestion de l'air,", "réserve : 50 bar"]}
          color={SCHEMA_COLORS.pression}
        />

        {/* ===== Ordinateur ===== */}
        <text x={400} y={24} fontSize={13} fontWeight={600} fill="currentColor" textAnchor="middle">
          Ordinateur de plongée
        </text>
        <rect x={344} y={70} width={8} height={14} rx={2} fill={SCHEMA_COLORS.neutre} />
        <rect x={448} y={70} width={8} height={14} rx={2} fill={SCHEMA_COLORS.neutre} />
        <rect
          x={352}
          y={48}
          width={96}
          height={110}
          rx={12}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.08}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
        />
        <rect
          x={362}
          y={58}
          width={76}
          height={90}
          rx={4}
          fill={SCHEMA_COLORS.eau}
          fillOpacity={0.08}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
        />
        <text x={400} y={80} fontSize={12} fontWeight={600} fill={SCHEMA_COLORS.eau} textAnchor="middle">
          20,4 m
        </text>
        <text x={400} y={100} fontSize={12} fill="currentColor" textAnchor="middle">
          32 min
        </text>
        <text x={400} y={120} fontSize={11} fill="currentColor" textAnchor="middle">
          15 m/min
        </text>
        <text x={400} y={139} fontSize={11} fill={SCHEMA_COLORS.securite} textAnchor="middle">
          palier 3 m
        </text>
        <FlowArrow x1={400} y1={162} x2={400} y2={192} />
        <FlowBox
          x={315}
          y={196}
          lignes={["Profondeur, durée,", "vitesse de remontée,", "paliers de décompression"]}
          color={SCHEMA_COLORS.eau}
        />

        {/* ===== Compas ===== */}
        <text x={140} y={300} fontSize={13} fontWeight={600} fill="currentColor" textAnchor="middle">
          Compas (boussole)
        </text>
        <circle
          cx={140}
          cy={378}
          r={52}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.05}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
        />
        <circle cx={140} cy={378} r={40} fill="none" stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <text x={140} y={340} fontSize={11} fontWeight={600} fill="currentColor" textAnchor="middle">
          N
        </text>
        <text x={140} y={424} fontSize={11} fill="currentColor" textAnchor="middle">
          S
        </text>
        <text x={182} y={382} fontSize={11} fill="currentColor" textAnchor="middle">
          E
        </text>
        <text x={98} y={382} fontSize={11} fill="currentColor" textAnchor="middle">
          O
        </text>
        {/* Aiguille : pointe nord pleine, pointe sud évidée */}
        <polygon points="140,344 132,378 148,378" fill={SCHEMA_COLORS.neutre} />
        <polygon
          points="140,412 132,378 148,378"
          fill="none"
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
        />
        <circle cx={140} cy={378} r={3} fill={SCHEMA_COLORS.neutre} />
        {/* Ligne de foi (le cap suivi) */}
        <line x1={140} y1={326} x2={140} y2={334} stroke={SCHEMA_COLORS.vigilance} strokeWidth={3} />
        <FlowArrow x1={140} y1={436} x2={140} y2={466} />
        <FlowBox
          x={55}
          y={470}
          lignes={["Le cap : s'orienter", "sous l'eau et en surface"]}
        />

        {/* ===== Montre ===== */}
        <text x={400} y={300} fontSize={13} fontWeight={600} fill="currentColor" textAnchor="middle">
          Montre de plongée
        </text>
        <rect
          x={382}
          y={310}
          width={36}
          height={24}
          rx={4}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.15}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
        />
        <rect
          x={382}
          y={422}
          width={36}
          height={24}
          rx={4}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.15}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
        />
        <circle
          cx={400}
          cy={378}
          r={46}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.05}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
        />
        <circle cx={400} cy={378} r={38} fill="none" stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        {/* Repère de lunette tournante (durée écoulée) */}
        <polygon points="396,336 404,336 400,344" fill={SCHEMA_COLORS.vigilance} />
        <line x1={434} y1={378} x2={428} y2={378} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        <line x1={400} y1={412} x2={400} y2={406} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        <line x1={366} y1={378} x2={372} y2={378} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        {/* Aiguilles */}
        <line
          x1={400}
          y1={378}
          x2={390}
          y2={362}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <line
          x1={400}
          y1={378}
          x2={422}
          y2={372}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx={400} cy={378} r={3} fill={SCHEMA_COLORS.neutre} />
        <FlowArrow x1={400} y1={436} x2={400} y2={466} />
        <FlowBox
          x={315}
          y={470}
          lignes={["La durée de plongée", "(tables + profondimètre)"]}
        />
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "pression", libelle: "Pression du bloc" },
          { couleur: "eau", libelle: "Profondeur et décompression" },
          { couleur: "vigilance", libelle: "Repères (réserve 50 bar, lunette, ligne de foi)" },
          { couleur: "neutre", libelle: "Instruments" },
        ]}
      />
    </>
  );
}
