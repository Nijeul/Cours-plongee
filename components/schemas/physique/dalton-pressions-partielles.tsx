import { LegendBox, SCHEMA_COLORS, SchemaSvg } from "@/components/schemas/primitives";

/** Valeurs du cours (convention 80 % N₂ / 20 % O₂) aux profondeurs repères. */
const BARRES = [
  { label: "Surface", pabs: 1, n2: 0.8, o2: 0.2, n2Txt: "0,8", o2Txt: "0,2", cx: 150 },
  { label: "20 m", pabs: 3, n2: 2.4, o2: 0.6, n2Txt: "2,4", o2Txt: "0,6", cx: 250 },
  { label: "40 m", pabs: 5, n2: 4, o2: 1, n2Txt: "4", o2Txt: "1", cx: 350 },
  { label: "60 m", pabs: 7, n2: 5.6, o2: 1.4, n2Txt: "5,6", o2Txt: "1,4", cx: 450 },
] as const;

/** Demi-largeur des barres. */
const DEMI = 30;

/** Échelle pression (bar) → ordonnée : 0 bar en bas (y = 320), 38 px par bar. */
function yBar(p: number): number {
  return 320 - p * 38;
}

/**
 * Loi de Dalton : barres empilées azote/oxygène (80/20) en surface, à 20,
 * 40 et 60 m. Chaque segment est chiffré (PpN₂ et PpO₂ en bar) et la somme
 * vaut la pression absolue. Le seuil de narcose (PpN₂ ≈ 3,2 bar, soit
 * ≈ 30 m) est tracé en ligne de vigilance ; le seuil d'hyperoxie
 * (PpO₂ ≈ 1,6 bar, ≈ 70 m à l'air) est rappelé en note.
 */
export function SchemaDaltonPressionsPartielles() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={375}
        titre="Pressions partielles de l'azote et de l'oxygène selon la profondeur"
        description="Barres empilées azote-oxygène en surface, à 20, 40 et 60 mètres : la pression partielle d'azote passe de 0,8 à 5,6 bar et celle d'oxygène de 0,2 à 1,4 bar. Le seuil de narcose de 3,2 bar d'azote est dépassé au-delà de 30 mètres."
      >
        {/* Axe des pressions */}
        <text x={44} y={40} fill={SCHEMA_COLORS.neutre} fontSize={11} textAnchor="middle">
          bar
        </text>
        <line x1={70} y1={50} x2={70} y2={320} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        <line x1={70} y1={320} x2={510} y2={320} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((p) => (
          <g key={p}>
            <line
              x1={64}
              y1={yBar(p)}
              x2={70}
              y2={yBar(p)}
              stroke={SCHEMA_COLORS.neutre}
              strokeWidth={1.5}
            />
            <text
              x={58}
              y={yBar(p) + 4}
              fill={SCHEMA_COLORS.neutre}
              fontSize={11}
              textAnchor="end"
            >
              {p}
            </text>
          </g>
        ))}

        {/* Note hyperoxie */}
        <text
          x={530}
          y={32}
          fill={SCHEMA_COLORS.danger}
          fontSize={11}
          fontWeight={600}
          textAnchor="end"
        >
          Hyperoxie : PpO₂ ≥ 1,6 bar (≈ 70 m à l&apos;air)
        </text>

        {/* Barres empilées */}
        {BARRES.map((b) => (
          <g key={b.label}>
            {/* Azote (bas de la pile) */}
            <rect
              x={b.cx - DEMI}
              y={yBar(b.n2)}
              width={DEMI * 2}
              height={yBar(0) - yBar(b.n2)}
              fill={SCHEMA_COLORS.azote}
              fillOpacity={0.32}
              stroke={SCHEMA_COLORS.azote}
              strokeWidth={1.5}
            />
            {/* Oxygène (haut de la pile) */}
            <rect
              x={b.cx - DEMI}
              y={yBar(b.pabs)}
              width={DEMI * 2}
              height={yBar(b.n2) - yBar(b.pabs)}
              fill={SCHEMA_COLORS.oxygene}
              fillOpacity={0.32}
              stroke={SCHEMA_COLORS.oxygene}
              strokeWidth={1.5}
            />
            {/* Valeurs chiffrées */}
            <text
              x={b.cx}
              y={(yBar(0) + yBar(b.n2)) / 2 + 4}
              fill="currentColor"
              fontSize={11}
              fontWeight={600}
              textAnchor="middle"
            >
              N₂ {b.n2Txt}
            </text>
            <text
              x={b.cx}
              y={yBar(b.pabs) - 6}
              fill={SCHEMA_COLORS.oxygene}
              fontSize={11}
              fontWeight={600}
              textAnchor="middle"
            >
              O₂ {b.o2Txt}
            </text>
            {/* Libellés sous la barre */}
            <text
              x={b.cx}
              y={340}
              fill="currentColor"
              fontSize={12}
              fontWeight={600}
              textAnchor="middle"
            >
              {b.label}
            </text>
            <text
              x={b.cx}
              y={356}
              fill={SCHEMA_COLORS.pression}
              fontSize={11}
              textAnchor="middle"
            >
              Pabs {b.pabs} bar
            </text>
          </g>
        ))}

        {/* Seuil de narcose : PpN₂ ≈ 3,2 bar */}
        <line
          x1={90}
          y1={yBar(3.2)}
          x2={510}
          y2={yBar(3.2)}
          stroke={SCHEMA_COLORS.vigilance}
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />
        <text
          x={92}
          y={yBar(3.2) - 6}
          fill={SCHEMA_COLORS.vigilance}
          fontSize={11}
          fontWeight={600}
          paintOrder="stroke"
          stroke="var(--card, transparent)"
          strokeWidth={4}
          strokeLinejoin="round"
        >
          Narcose : PpN₂ ≈ 3,2 bar (≈ 30 m)
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "azote", libelle: "Azote — 80 % du mélange" },
          { couleur: "oxygene", libelle: "Oxygène — 20 % du mélange" },
          { couleur: "vigilance", libelle: "Seuil de narcose (PpN₂)" },
          { couleur: "danger", libelle: "Seuil d'hyperoxie (PpO₂)" },
        ]}
      />
    </>
  );
}
