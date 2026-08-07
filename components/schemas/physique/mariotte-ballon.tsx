import {
  createDepthScale,
  DepthAxis,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  WaterBackground,
} from "@/components/schemas/primitives";

/**
 * Étapes du ballon de 6 L descendu aux profondeurs repères. Les rayons sont
 * proportionnels à la racine carrée du volume pour que l'AIRE des cercles
 * décroisse comme le volume (6 ; 3 ; 2 ; 1,5 ; 1,2 L).
 */
const ETAPES = [
  { prof: 0, pabs: 1, volume: "6 L", produit: "1 × 6 = 6", r: 30 },
  { prof: 10, pabs: 2, volume: "3 L", produit: "2 × 3 = 6", r: 21.2 },
  { prof: 20, pabs: 3, volume: "2 L", produit: "3 × 2 = 6", r: 17.3 },
  { prof: 30, pabs: 4, volume: "1,5 L", produit: "4 × 1,5 = 6", r: 15 },
  { prof: 40, pabs: 5, volume: "1,2 L", produit: "5 × 1,2 = 6", r: 13.4 },
] as const;

/** Abscisses des cinq ballons (descente en diagonale). */
const XS = [110, 200, 290, 380, 470] as const;

/**
 * Loi de Boyle-Mariotte : le même ballon souple de 6 litres, fermé en
 * surface puis descendu à 10, 20, 30 et 40 m. Son volume est divisé par la
 * pression absolue (6 ; 3 ; 2 ; 1,5 ; 1,2 L) et le produit P × V reste
 * constant, égal à 6. Figure de référence imprimable, en complément du
 * simulateur.
 */
export function SchemaMariotteBallon() {
  const profondeur = createDepthScale({
    minMetres: 0,
    maxMetres: 40,
    yTop: 50,
    yBottom: 450,
  });

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={520}
        titre="Le ballon de 6 litres aux profondeurs repères (loi de Boyle-Mariotte)"
        description="Un ballon de 6 litres fermé en surface rétrécit en descendant : 3 litres à 10 mètres, 2 litres à 20 mètres, 1,5 litre à 30 mètres, 1,2 litre à 40 mètres. Le produit pression par volume reste égal à 6."
      >
        <WaterBackground x={0} width={540} surfaceY={50} bottomY={515} />

        <DepthAxis
          x={54}
          minMetres={0}
          maxMetres={40}
          yTop={50}
          yBottom={450}
          pas={10}
          labelCote="gauche"
        />

        {/* Trajectoire de descente (sous les ballons) */}
        <polyline
          points={ETAPES.map((e, i) => `${XS[i]},${profondeur(e.prof)}`).join(" ")}
          fill="none"
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
          strokeDasharray="4 5"
          opacity={0.45}
        />

        {ETAPES.map((etape, i) => {
          const cx = XS[i];
          const cy = profondeur(etape.prof);
          const labelY = cy + etape.r + 16;
          return (
            <g key={etape.prof}>
              <circle
                cx={cx}
                cy={cy}
                r={etape.r}
                fill={SCHEMA_COLORS.air}
                fillOpacity={0.18}
                stroke={SCHEMA_COLORS.air}
                strokeWidth={2}
              />
              {/* Nœud du ballon */}
              <line
                x1={cx}
                y1={cy + etape.r}
                x2={cx}
                y2={cy + etape.r + 5}
                stroke={SCHEMA_COLORS.air}
                strokeWidth={2}
                strokeLinecap="round"
              />
              <text
                x={cx}
                y={labelY + 6}
                fill={SCHEMA_COLORS.pression}
                fontSize={11}
                fontWeight={600}
                textAnchor="middle"
              >
                {etape.pabs} bar
              </text>
              <text
                x={cx}
                y={labelY + 20}
                fill={SCHEMA_COLORS.air}
                fontSize={11}
                fontWeight={600}
                textAnchor="middle"
              >
                V = {etape.volume}
              </text>
              <text
                x={cx}
                y={labelY + 34}
                fill="currentColor"
                fontSize={11}
                textAnchor="middle"
              >
                {etape.produit}
              </text>
            </g>
          );
        })}

        {/* Rappel de la loi */}
        <text
          x={430}
          y={90}
          fill="currentColor"
          fontSize={12}
          fontWeight={600}
          textAnchor="middle"
        >
          P × V = constante
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "air", libelle: "Volume d'air du ballon (fermé)" },
          { couleur: "pression", libelle: "Pression absolue" },
          { couleur: "neutre", libelle: "Descente du même ballon" },
        ]}
      />
    </>
  );
}
