import {
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/** Repère d'intervalle de surface : segment à crochets avec libellé au-dessus. */
function IntervalleSurface({
  x1,
  x2,
  y,
  label,
  color,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
  color: string;
}) {
  return (
    <g>
      <path
        d={`M ${x1} ${y + 6} L ${x1} ${y} L ${x2} ${y} L ${x2} ${y + 6}`}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
      <text x={(x1 + x2) / 2} y={y - 6} fill={color} fontSize={11.5} fontWeight={600} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

/**
 * Plongée consécutive contre plongée successive : deux frises empilées.
 * En haut, un intervalle de surface inférieur à 15 minutes (exemple du
 * cours : 18 m / 30 min puis 15 m / 20 min après 10 min) → une seule
 * plongée pour la table (durées additionnées, profondeur maximale).
 * En bas, un intervalle de 15 minutes à 12 heures → plongée successive
 * (tableaux II et III, majoration). La frontière des 15 minutes est mise
 * en évidence entre les deux frises.
 */
export function SchemaConsecutiveVsSuccessive() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={498}
        titre="Consécutive ou successive : l'intervalle de surface décide"
        description="Deux frises empilées : avec moins de 15 minutes d'intervalle la plongée est consécutive et la table lit une seule plongée, durées additionnées et profondeur maximale ; entre 15 minutes et 12 heures la plongée est successive et se calcule avec les tableaux II et III via une majoration."
      >
        {/* ——— Frise du haut : consécutive ——— */}
        <text x={270} y={20} fill={SCHEMA_COLORS.vigilance} fontSize={12} fontWeight={700} textAnchor="middle">
          Intervalle &lt; 15 min → plongée CONSÉCUTIVE
        </text>
        <line x1={40} y1={46} x2={510} y2={46} stroke={SCHEMA_COLORS.eau} strokeWidth={2} opacity={0.85} />
        <polyline
          points="60,46 75,118 150,118 168,46"
          fill="none"
          stroke={SCHEMA_COLORS.eau}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <polyline
          points="215,46 230,106 300,106 318,46"
          fill="none"
          stroke={SCHEMA_COLORS.eau}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <IntervalleSurface x1={170} x2={213} y={38} label="10 min" color={SCHEMA_COLORS.vigilance} />
        <text x={112} y={132} fill={SCHEMA_COLORS.eau} fontSize={11} textAnchor="middle">
          18 m • 30 min
        </text>
        <text x={265} y={120} fill={SCHEMA_COLORS.eau} fontSize={11} textAnchor="middle">
          15 m • 20 min
        </text>
        <FlowBox
          x={140}
          y={138}
          width={260}
          lignes={[
            "Une seule plongée pour la table :",
            "durée 30 + 20 = 50 min,",
            "prof. max 18 m → table 20 m /",
            "50 min : 9 min à 3 m (GPS I)",
          ]}
          color={SCHEMA_COLORS.vigilance}
        />

        {/* ——— La frontière ——— */}
        <line
          x1={30}
          y1={234}
          x2={100}
          y2={234}
          stroke={SCHEMA_COLORS.pression}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <line
          x1={440}
          y1={234}
          x2={510}
          y2={234}
          stroke={SCHEMA_COLORS.pression}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <text x={270} y={238} fill={SCHEMA_COLORS.pression} fontSize={12} fontWeight={700} textAnchor="middle">
          La frontière : 15 minutes d&apos;intervalle
        </text>

        {/* ——— Frise du bas : successive ——— */}
        <text x={270} y={264} fill={SCHEMA_COLORS.securite} fontSize={12} fontWeight={700} textAnchor="middle">
          Intervalle de 15 min à 12 h → plongée SUCCESSIVE
        </text>
        <line x1={40} y1={288} x2={510} y2={288} stroke={SCHEMA_COLORS.eau} strokeWidth={2} opacity={0.85} />
        <polyline
          points="60,288 75,360 150,360 168,288"
          fill="none"
          stroke={SCHEMA_COLORS.eau}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <polyline
          points="330,288 345,360 415,360 433,288"
          fill="none"
          stroke={SCHEMA_COLORS.eau}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <IntervalleSurface x1={170} x2={328} y={278} label="Intervalle : 2 h" color={SCHEMA_COLORS.securite} />
        <text x={112} y={376} fill={SCHEMA_COLORS.eau} fontSize={11} textAnchor="middle">
          20 m • 40 min → GPS H
        </text>
        <text x={381} y={376} fill={SCHEMA_COLORS.eau} fontSize={11} textAnchor="middle">
          20 m • 25 min réelles
        </text>
        <FlowBox
          x={140}
          y={390}
          width={260}
          lignes={[
            "Deux plongées distinctes :",
            "tableaux II et III → majoration",
            "ajoutée à la durée réelle",
            "(durée fictive)",
          ]}
          color={SCHEMA_COLORS.securite}
        />

        <text x={270} y={490} fill={SCHEMA_COLORS.neutre} fontSize={11} textAnchor="middle">
          Plus de 12 h d&apos;intervalle : l&apos;azote résiduel est éliminé → plongée simple.
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "eau", libelle: "Profils des deux plongées" },
          { couleur: "vigilance", libelle: "Consécutive : une seule plongée pour la table" },
          { couleur: "securite", libelle: "Successive : majoration par les tableaux II et III" },
          { couleur: "pression", libelle: "Frontière des 15 minutes" },
        ]}
      />
    </>
  );
}
