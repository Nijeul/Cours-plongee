import {
  DepthAxis,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  TimeAxis,
  WaterBackground,
  createDepthScale,
  createTimeScale,
} from "@/components/schemas/primitives";

/** Accolade horizontale (crochets vers le haut) avec libellé en dessous. */
function Accolade({
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
        d={`M ${x1} ${y - 6} L ${x1} ${y} L ${x2} ${y} L ${x2} ${y - 6}`}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={(x1 + x2) / 2}
        y={y + 15}
        fill={color}
        fontSize={11.5}
        fontWeight={600}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
}

/**
 * Profil de plongée annoté (vocabulaire des tables MN90) : descente, fond,
 * remontée à 15-17 m/min, palier à 3 m, sortie, sur l'exemple du cours
 * 17 m / 48 min → lecture 20 m / 50 min (9 min à 3 m, GPS I). Trois durées
 * sont matérialisées : durée de plongée (immersion → début de remontée),
 * DTR (durée totale de remontée) et durée totale jusqu'à la sortie.
 */
export function SchemaProfilPlongeeAnnote() {
  const temps = createTimeScale({ minMinutes: 0, maxMinutes: 60, xLeft: 52, xRight: 510 });
  const prof = createDepthScale({ minMetres: 0, maxMetres: 20, yTop: 40, yBottom: 180 });

  const profil: Array<[number, number]> = [
    [0, 0],
    [1.5, 17],
    [48, 17],
    [49, 3],
    [58, 3],
    [58.5, 0],
  ];
  const points = profil.map(([t, m]) => `${temps(t)},${prof(m)}`).join(" ");

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={300}
        titre="Profil de plongée annoté : durée de plongée, DTR, durée totale"
        description="Profil temps-profondeur d'une plongée à 17 mètres pendant 48 minutes : descente, fond, remontée à 15-17 mètres par minute, palier de 9 minutes à 3 mètres puis sortie ; la durée de plongée court de l'immersion au début de la remontée, la DTR vaut environ 11 minutes et la durée totale environ 59 minutes."
      >
        <text x={281} y={22} fill="currentColor" fontSize={11.5} textAnchor="middle">
          Exemple : 17 m pendant 48 min → lecture 20 m / 50 min : 9 min à 3 m, GPS I
        </text>

        <WaterBackground x={52} width={458} surfaceY={40} bottomY={180} />
        <DepthAxis x={52} minMetres={0} maxMetres={20} yTop={40} yBottom={180} pas={5} labelCote="gauche" />
        <TimeAxis y={200} minMinutes={0} maxMinutes={60} xLeft={52} xRight={510} pas={10} />

        <polyline
          points={points}
          fill="none"
          stroke={SCHEMA_COLORS.eau}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <text x={temps(24)} y={prof(17) + 16} fill={SCHEMA_COLORS.pression} fontSize={11.5} textAnchor="middle">
          Prof. max 17 m → table 20 m
        </text>

        {/* Vitesse de remontée le long du segment fond → palier */}
        <text
          x={temps(50) + 8}
          y={prof(10) + 4}
          fill={SCHEMA_COLORS.securite}
          fontSize={11}
          fontWeight={600}
        >
          15 à 17 m/min
        </text>
        <text x={temps(53.5)} y={prof(3) - 10} fill={SCHEMA_COLORS.vigilance} fontSize={11.5} fontWeight={600} textAnchor="middle">
          Palier : 9 min à 3 m
        </text>

        {/* Les trois durées */}
        <Accolade
          x1={temps(0)}
          x2={temps(48)}
          y={236}
          label="Durée de plongée : 48 min (immersion → début de remontée)"
          color={SCHEMA_COLORS.pression}
        />
        <Accolade x1={temps(48) + 3} x2={temps(59)} y={236} label="DTR ≈ 11 min" color={SCHEMA_COLORS.vigilance} />
        <Accolade
          x1={temps(0)}
          x2={temps(59)}
          y={272}
          label="Durée totale ≈ 59 min → heure de sortie = heure d'immersion + 59 min"
          color={SCHEMA_COLORS.neutre}
        />
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "eau", libelle: "Profil de la plongée" },
          { couleur: "pression", libelle: "Durée de plongée (entrée de la table)" },
          { couleur: "vigilance", libelle: "DTR : remontée + paliers + trajets entre paliers" },
          { couleur: "securite", libelle: "Vitesse de remontée contrôlée" },
        ]}
      />
    </>
  );
}
