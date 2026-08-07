import {
  ArrowAnnotated,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Compartiments illustrés : période (min) et fraction du gradient comblée
 * après 60 minutes à profondeur stable (1 − 0,5^(60/T), arrondie).
 */
const COMPARTIMENTS: Array<{ periode: number; pct: number; libelle: string }> = [
  { periode: 5, pct: 100, libelle: "≈ 100 %" },
  { periode: 10, pct: 98.4, libelle: "≈ 98 %" },
  { periode: 20, pct: 87.5, libelle: "87,5 %" },
  { periode: 40, pct: 64.6, libelle: "≈ 65 %" },
  { periode: 80, pct: 40.5, libelle: "≈ 40 %" },
  { periode: 120, pct: 29.3, libelle: "≈ 29 %" },
];

const BAR_X = 175;
const BAR_W = 285;
const BAR_H = 24;
const BAR_GAP = 14;
const BARS_Y = 78;

/**
 * Les compartiments et leurs périodes : six barres (périodes 5, 10, 20,
 * 40, 80 et 120 minutes) montrant la charge en azote atteinte après
 * 60 minutes à profondeur stable. À chaque période écoulée, un
 * compartiment comble la moitié de l'écart restant : le tissu court
 * (5 min) est déjà saturé quand le tissu long (120 min) n'a comblé
 * qu'environ un tiers du gradient.
 */
export function SchemaCompartimentsPeriodes() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={362}
        titre="Compartiments et périodes : des vitesses de saturation différentes"
        description="Six barres horizontales représentent les compartiments de périodes 5, 10, 20, 40, 80 et 120 minutes après 60 minutes à profondeur stable : le compartiment de période 5 minutes est saturé à près de 100 pour cent, celui de 20 minutes à 87,5 pour cent, celui de 120 minutes à environ 29 pour cent ; à chaque période, un compartiment comble la moitié de l'écart restant."
      >
        <text x={270} y={22} fill="currentColor" fontSize={12} fontWeight={600} textAnchor="middle">
          Charge en azote après 60 min à profondeur stable
        </text>
        <text x={270} y={40} fill="currentColor" fontSize={11} textAnchor="middle">
          À chaque période T écoulée, le compartiment comble la moitié de l&apos;écart restant.
        </text>

        <text x={BAR_X - 10} y={BARS_Y - 8} fill={SCHEMA_COLORS.tissu} fontSize={11} fontWeight={600} textAnchor="end">
          Période T
        </text>
        <text x={BAR_X + BAR_W} y={BARS_Y - 8} fill={SCHEMA_COLORS.azote} fontSize={11} fontWeight={600} textAnchor="end">
          Gradient comblé (100 % = saturation)
        </text>

        {COMPARTIMENTS.map((c, i) => {
          const y = BARS_Y + i * (BAR_H + BAR_GAP);
          const largeur = (c.pct / 100) * BAR_W;
          return (
            <g key={c.periode}>
              <text
                x={BAR_X - 10}
                y={y + BAR_H / 2 + 4}
                fill={SCHEMA_COLORS.tissu}
                fontSize={12}
                fontWeight={600}
                textAnchor="end"
              >
                {c.periode} min
              </text>
              {/* Piste : la capacité totale du compartiment */}
              <rect
                x={BAR_X}
                y={y}
                width={BAR_W}
                height={BAR_H}
                rx={4}
                fill="none"
                stroke={SCHEMA_COLORS.neutre}
                strokeWidth={1}
              />
              {/* Remplissage : azote dissous */}
              <rect
                x={BAR_X}
                y={y}
                width={largeur}
                height={BAR_H}
                rx={4}
                fill={SCHEMA_COLORS.azote}
                fillOpacity={0.55}
                stroke="none"
              />
              <text
                x={c.pct > 55 ? BAR_X + largeur - 8 : BAR_X + largeur + 8}
                y={y + BAR_H / 2 + 4}
                fill={c.pct > 55 ? "currentColor" : SCHEMA_COLORS.azote}
                fontSize={11.5}
                fontWeight={600}
                textAnchor={c.pct > 55 ? "end" : "start"}
              >
                {c.libelle}
              </text>
            </g>
          );
        })}

        {/* Tissu court vs tissu long */}
        <ArrowAnnotated
          x1={505}
          y1={BARS_Y + BAR_H / 2}
          x2={505}
          y2={BARS_Y + 5 * (BAR_H + BAR_GAP) + BAR_H / 2}
          color={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
          pointilles
        />
        <text x={505} y={BARS_Y + 4} fill="currentColor" fontSize={11} textAnchor="end">
          court
        </text>
        <text
          x={505}
          y={BARS_Y + 5 * (BAR_H + BAR_GAP) + BAR_H + 12}
          fill="currentColor"
          fontSize={11}
          textAnchor="end"
        >
          long
        </text>

        <text x={270} y={330} fill="currentColor" fontSize={11} textAnchor="middle">
          Tissu court (5, 10, 20 min) : sature vite, dirige les plongées courtes et profondes.
        </text>
        <text x={270} y={346} fill="currentColor" fontSize={11} textAnchor="middle">
          Tissu long (80, 120 min) : sature lentement, dirige les plongées longues.
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "azote", libelle: "Azote dissous (fraction du gradient comblée)" },
          { couleur: "tissu", libelle: "Compartiments (période de demi-saturation)" },
          { couleur: "neutre", libelle: "Capacité à saturation complète (100 %)" },
        ]}
      />
    </>
  );
}
