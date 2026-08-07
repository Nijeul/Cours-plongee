import {
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  TimeAxis,
  createTimeScale,
} from "@/components/schemas/primitives";

/** Abscisse (périodes) → x et pourcentage du gradient → y du graphe. */
const x = createTimeScale({ minMinutes: 0, maxMinutes: 6, xLeft: 70, xRight: 480 });
const y = (pct: number) => 250 - pct * 2;

/** Échantillonne une courbe exponentielle (pas de 0,25 période). */
function courbe(fn: (t: number) => number): string {
  const points: string[] = [];
  for (let t = 0; t <= 6; t += 0.25) {
    points.push(`${x(t)},${y(fn(t))}`);
  }
  return points.join(" ");
}

const saturation = (t: number) => 100 * (1 - 2 ** -t);
const desaturation = (t: number) => 100 * 2 ** -t;

/**
 * Saturation et désaturation exponentielles d'un compartiment : à chaque
 * période écoulée, le compartiment comble (ou élimine) la moitié de
 * l'écart restant — 50 % après 1 période, 75 % après 2, 87,5 % après 3,
 * 93,75 % après 4, saturation pratiquement complète après 6 périodes
 * (≈ 99 %). La courbe de désaturation est le miroir de la charge :
 * il reste 50 %, puis 25 %, puis 12,5 % du gradient.
 */
export function SchemaCourbesSaturation() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={330}
        titre="Saturation et désaturation exponentielles par périodes"
        description="Deux courbes exponentielles sur un axe en périodes : la saturation comble 50 pour cent du gradient après une période, 75 après deux, 87,5 après trois, 93,75 après quatre et est pratiquement complète après six périodes ; la désaturation, en miroir, laisse 50 puis 25 puis 12,5 pour cent du gradient."
      >
        {/* Axe vertical : tension (% du gradient comblé) */}
        <line x1={70} y1={42} x2={70} y2={250} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        {[0, 25, 50, 75, 100].map((pct) => (
          <g key={pct}>
            <line x1={64} y1={y(pct)} x2={70} y2={y(pct)} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
            <text x={60} y={y(pct) + 4} fill={SCHEMA_COLORS.neutre} fontSize={11} textAnchor="end">
              {pct} %
            </text>
          </g>
        ))}
        <text x={16} y={34} fill={SCHEMA_COLORS.neutre} fontSize={11}>
          Gradient comblé
        </text>

        <TimeAxis y={250} minMinutes={0} maxMinutes={6} xLeft={70} xRight={480} pas={1} unite="" />
        <text x={275} y={292} fill={SCHEMA_COLORS.neutre} fontSize={11} textAnchor="middle">
          Périodes écoulées (T = période du compartiment)
        </text>

        {/* Saturation complète */}
        <line
          x1={70}
          y1={y(100)}
          x2={480}
          y2={y(100)}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1}
          strokeDasharray="5 4"
        />
        <text x={478} y={y(100) - 6} fill={SCHEMA_COLORS.neutre} fontSize={11} textAnchor="end">
          Saturation pratiquement complète après 6 périodes (≈ 99 %)
        </text>

        {/* Courbes */}
        <polyline
          points={courbe(saturation)}
          fill="none"
          stroke={SCHEMA_COLORS.azote}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <polyline
          points={courbe(desaturation)}
          fill="none"
          stroke={SCHEMA_COLORS.securite}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="7 4"
        />

        {/* Jalons de la saturation : les moitiés successives */}
        {[
          { t: 1, libelle: "50 %" },
          { t: 2, libelle: "75 %" },
          { t: 3, libelle: "87,5 %" },
          { t: 4, libelle: "93,75 %" },
        ].map(({ t, libelle }) => (
          <g key={t}>
            <circle cx={x(t)} cy={y(saturation(t))} r={4} fill={SCHEMA_COLORS.azote} stroke="none" />
            <text
              x={x(t) - 6}
              y={y(saturation(t)) - 9}
              fill={SCHEMA_COLORS.azote}
              fontSize={11.5}
              fontWeight={600}
              textAnchor="middle"
              paintOrder="stroke"
              stroke="var(--card, transparent)"
              strokeWidth={4}
            >
              {libelle}
            </text>
          </g>
        ))}

        {/* Jalons de la désaturation : ce qui reste */}
        {[
          { t: 1, libelle: "reste 50 %" },
          { t: 2, libelle: "reste 25 %" },
          { t: 3, libelle: "reste 12,5 %" },
        ].map(({ t, libelle }) => (
          <g key={t}>
            <circle cx={x(t)} cy={y(desaturation(t))} r={4} fill={SCHEMA_COLORS.securite} stroke="none" />
            <text
              x={x(t) + 10}
              y={y(desaturation(t)) + 13}
              fill={SCHEMA_COLORS.securite}
              fontSize={11.5}
              fontWeight={600}
              paintOrder="stroke"
              stroke="var(--card, transparent)"
              strokeWidth={4}
            >
              {libelle}
            </text>
          </g>
        ))}

        <text x={275} y={318} fill="currentColor" fontSize={11} textAnchor="middle">
          On n&apos;ajoute jamais un pourcentage fixe : on comble toujours la moitié de ce qui reste.
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "azote", libelle: "Saturation : charge du compartiment (descente, fond)" },
          { couleur: "securite", libelle: "Désaturation : décharge du compartiment (remontée, surface)" },
        ]}
      />
    </>
  );
}
