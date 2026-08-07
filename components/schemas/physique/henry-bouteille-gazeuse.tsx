import {
  Bubble,
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/** Positions (dx, dy) des points de gaz dissous dans le liquide (déterministes). */
const GAZ_DISSOUS: ReadonlyArray<readonly [number, number]> = [
  [-14, 58], [4, 66], [15, 78], [-8, 84], [10, 96], [-16, 104],
  [2, 112], [16, 118], [-10, 124], [8, 60], [-4, 74], [14, 100],
];

/** Silhouette de bouteille d'eau gazeuse (repère local : goulot en (cx, y)). */
function Bouteille({
  cx,
  y,
  fermee,
}: {
  /** Abscisse de l'axe de la bouteille. */
  cx: number;
  /** Ordonnée du haut du goulot. */
  y: number;
  /** Bouchon présent (bouteille fermée). */
  fermee: boolean;
}) {
  return (
    <g aria-hidden="true">
      {fermee ? (
        <rect
          x={cx - 10}
          y={y - 8}
          width={20}
          height={9}
          rx={2}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.35}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
        />
      ) : null}
      {/* Goulot puis corps */}
      <path
        d={`M ${cx - 8} ${y} L ${cx - 8} ${y + 14}
            C ${cx - 8} ${y + 26} ${cx - 26} ${y + 28} ${cx - 26} ${y + 42}
            L ${cx - 26} ${y + 128}
            Q ${cx - 26} ${y + 136} ${cx - 18} ${y + 136}
            L ${cx + 18} ${y + 136}
            Q ${cx + 26} ${y + 136} ${cx + 26} ${y + 128}
            L ${cx + 26} ${y + 42}
            C ${cx + 26} ${y + 28} ${cx + 8} ${y + 26} ${cx + 8} ${y + 14}
            L ${cx + 8} ${y}`}
        fill="none"
        stroke={SCHEMA_COLORS.neutre}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {/* Liquide */}
      <rect
        x={cx - 22}
        y={y + 46}
        width={44}
        height={86}
        rx={5}
        fill={SCHEMA_COLORS.eau}
        fillOpacity={0.18}
      />
    </g>
  );
}

/**
 * Loi de Henry, l'analogie du cours : une bouteille d'eau gazeuse fermée
 * contient du gaz dissous invisible (le plongeur qui sature) ; ouverte
 * lentement, elle dégaze en douceur (remontée lente) ; secouée puis ouverte,
 * le gaz forme des bulles massives dans le liquide (remontée rapide, risque
 * d'accident de désaturation).
 */
export function SchemaHenryBouteilleGazeuse() {
  const yBouteille = 70;
  const basBouteille = yBouteille + 136;

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={330}
        titre="La loi de Henry : l'analogie de la bouteille d'eau gazeuse"
        description="Trois bouteilles d'eau gazeuse : fermée, le gaz reste dissous et invisible ; ouverte lentement, il s'échappe en douceur ; secouée puis ouverte, il forme des bulles massives — comme l'azote du plongeur selon la vitesse de remontée."
      >
        {/* Vignette 1 — fermée */}
        <text
          x={100}
          y={48}
          fill={SCHEMA_COLORS.neutre}
          fontSize={12}
          fontWeight={600}
          textAnchor="middle"
        >
          1. Fermée
        </text>
        <Bouteille cx={100} y={yBouteille} fermee />
        <g aria-hidden="true">
          {GAZ_DISSOUS.map(([dx, dy], i) => (
            <circle
              key={i}
              cx={100 + dx}
              cy={yBouteille + dy}
              r={1.8}
              fill={SCHEMA_COLORS.air}
              opacity={0.9}
            />
          ))}
        </g>

        {/* Vignette 2 — ouverte lentement */}
        <text
          x={270}
          y={48}
          fill={SCHEMA_COLORS.securite}
          fontSize={12}
          fontWeight={600}
          textAnchor="middle"
        >
          2. Ouverte lentement
        </text>
        <Bouteille cx={270} y={yBouteille} fermee={false} />
        <Bubble x={264} y={yBouteille + 110} r={2.2} />
        <Bubble x={276} y={yBouteille + 84} r={2.6} />
        <Bubble x={268} y={yBouteille + 58} r={3} />
        <Bubble x={272} y={yBouteille + 28} r={3.2} />
        <Bubble x={267} y={yBouteille - 6} r={3.5} />

        {/* Vignette 3 — secouée puis ouverte */}
        <text
          x={440}
          y={48}
          fill={SCHEMA_COLORS.danger}
          fontSize={12}
          fontWeight={600}
          textAnchor="middle"
        >
          3. Secouée + ouverte
        </text>
        <Bouteille cx={440} y={yBouteille} fermee={false} />
        {[
          [-14, 122, 3], [2, 116, 3.6], [15, 120, 2.8], [-8, 102, 3.4],
          [10, 98, 4], [-16, 86, 3], [4, 82, 3.8], [16, 72, 3.2],
          [-10, 64, 4], [8, 56, 3.4], [-2, 34, 3.6], [4, 16, 3.8],
          [-3, -8, 4.2], [7, -16, 3.4],
        ].map(([dx, dy, r], i) => (
          <Bubble key={i} x={440 + dx} y={yBouteille + dy} r={r} color={SCHEMA_COLORS.danger} />
        ))}

        {/* Parallèle plongée */}
        <FlowArrow x1={100} y1={basBouteille + 6} x2={100} y2={244} />
        <FlowArrow
          x1={270}
          y1={basBouteille + 6}
          x2={270}
          y2={244}
          color={SCHEMA_COLORS.securite}
        />
        <FlowArrow
          x1={440}
          y1={basBouteille + 6}
          x2={440}
          y2={244}
          color={SCHEMA_COLORS.danger}
        />
        <FlowBox
          x={20}
          y={248}
          width={160}
          lignes={["Bouteille fermée :", "gaz dissous, invisible", "= plongeur qui sature"]}
          color={SCHEMA_COLORS.neutre}
        />
        <FlowBox
          x={190}
          y={248}
          width={160}
          lignes={["Ouverture lente :", "dégazage contrôlé", "= remontée lente"]}
          color={SCHEMA_COLORS.securite}
        />
        <FlowBox
          x={360}
          y={248}
          width={160}
          lignes={["Ouverture brutale :", "bulles massives", "= remontée rapide, ADD"]}
          color={SCHEMA_COLORS.danger}
        />
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "air", libelle: "Gaz dissous (invisible)" },
          { couleur: "securite", libelle: "Dégazage contrôlé" },
          { couleur: "danger", libelle: "Bulles massives = accident" },
        ]}
      />
    </>
  );
}
