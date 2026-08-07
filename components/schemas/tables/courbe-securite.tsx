import {
  DepthAxis,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  TimeAxis,
  createDepthScale,
  createTimeScale,
} from "@/components/schemas/primitives";

/**
 * Couples de la courbe de sécurité du jeu de données du site (non vérifié) :
 * durée maximale sans palier obligatoire pour chaque profondeur.
 */
const COUPLES: Array<{ prof: number; duree: number; libelle: string }> = [
  { prof: 12, duree: 135, libelle: "2 h 15" },
  { prof: 15, duree: 75, libelle: "1 h 15" },
  { prof: 20, duree: 40, libelle: "40 min" },
  { prof: 25, duree: 20, libelle: "20 min" },
  { prof: 30, duree: 10, libelle: "10 min" },
  { prof: 35, duree: 5, libelle: "5 min" },
  { prof: 40, duree: 5, libelle: "5 min" },
];

/**
 * La courbe de sécurité MN90 : durée maximale sans palier obligatoire en
 * fonction de la profondeur (12 m / 2 h 15 → 40 m / 5 min). La zone verte,
 * entre la surface et la courbe, est la zone « remontée directe possible
 * à vitesse contrôlée » ; au-delà, les paliers deviennent obligatoires.
 * La chute rapide (40 min à 20 m, 10 min à 30 m) devient visible.
 * Valeurs du jeu de données du site, à vérifier sur la table officielle.
 */
export function SchemaCourbeSecurite() {
  const temps = createTimeScale({ minMinutes: 0, maxMinutes: 140, xLeft: 60, xRight: 510 });
  const prof = createDepthScale({ minMetres: 0, maxMetres: 40, yTop: 40, yBottom: 262 });

  const pointsCourbe = COUPLES.map((c) => `${temps(c.duree)},${prof(c.prof)}`).join(" ");
  // Zone sans palier : à gauche/au-dessus de la courbe (surface → courbe).
  const zone = [
    `${temps(0)},${prof(0)}`,
    `${temps(135)},${prof(0)}`,
    pointsCourbe,
    `${temps(0)},${prof(40)}`,
  ].join(" ");

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={352}
        titre="La courbe de sécurité : plonger sans palier obligatoire"
        description="Graphique profondeur en fonction de la durée : la courbe relie les couples durée maximale sans palier de 12 mètres et 2 heures 15 à 40 mètres et 5 minutes ; la zone verte sous la surface et à gauche de la courbe est la zone sans palier obligatoire, au-delà les paliers sont obligatoires. La durée chute vite : 40 minutes à 20 mètres, 10 minutes seulement à 30 mètres."
      >
        <polygon points={zone} fill={SCHEMA_COLORS.securite} fillOpacity={0.12} stroke="none" />

        <DepthAxis x={60} minMetres={0} maxMetres={40} yTop={40} yBottom={262} pas={10} labelCote="gauche" />
        <TimeAxis y={282} minMinutes={0} maxMinutes={140} xLeft={60} xRight={510} pas={20} />

        <polyline
          points={pointsCourbe}
          fill="none"
          stroke={SCHEMA_COLORS.securite}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {COUPLES.map((c) => (
          <g key={c.prof}>
            <circle cx={temps(c.duree)} cy={prof(c.prof)} r={4} fill={SCHEMA_COLORS.securite} stroke="none" />
            <text
              x={temps(c.duree) + 8}
              y={prof(c.prof) + 4}
              fill={SCHEMA_COLORS.securite}
              fontSize={11}
              fontWeight={600}
              paintOrder="stroke"
              stroke="var(--card, transparent)"
              strokeWidth={4}
            >
              {c.libelle}
            </text>
          </g>
        ))}

        <text x={temps(58)} y={prof(6)} fill={SCHEMA_COLORS.securite} fontSize={12} fontWeight={700} textAnchor="middle">
          Zone sans palier obligatoire
        </text>
        <text x={temps(58)} y={prof(6) + 16} fill={SCHEMA_COLORS.securite} fontSize={11} textAnchor="middle">
          (palier de principe 3 min à 3 m recommandé)
        </text>
        <text x={temps(95)} y={prof(31)} fill={SCHEMA_COLORS.vigilance} fontSize={12} fontWeight={700} textAnchor="middle">
          Au-delà : paliers obligatoires
        </text>
        <text x={temps(95)} y={prof(31) + 16} fill={SCHEMA_COLORS.vigilance} fontSize={11} textAnchor="middle">
          La durée chute vite : 40 min à 20 m, 10 min à 30 m
        </text>

        <text x={285} y={340} fill={SCHEMA_COLORS.vigilance} fontSize={11} textAnchor="middle">
          Valeurs du jeu de données du site (non vérifié) — à contrôler sur la table MN90 officielle.
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "securite", libelle: "Courbe de sécurité et zone sans palier obligatoire" },
          { couleur: "vigilance", libelle: "Au-delà de la courbe : paliers obligatoires, données à vérifier" },
        ]}
      />
    </>
  );
}
