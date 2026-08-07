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

/**
 * Table contre ordinateur : deux lectures de la même plongée superposées.
 * La table raisonne en profil carré (toute la plongée réputée passée à la
 * profondeur maximale, ici 40 m), l'ordinateur intègre le profil réel
 * multi-niveaux minute par minute. L'aire hachurée entre les deux profils
 * représente la charge d'azote comptée en trop par la table — d'où ses
 * durées sans palier plus courtes et ses paliers plus longs.
 */
export function SchemaTableVsOrdinateur() {
  const temps = createTimeScale({ minMinutes: 0, maxMinutes: 46, xLeft: 56, xRight: 505 });
  const prof = createDepthScale({ minMetres: 0, maxMetres: 40, yTop: 40, yBottom: 240 });

  const versPoints = (profil: Array<[number, number]>) =>
    profil.map(([t, m]) => `${temps(t)},${prof(m)}`).join(" ");

  // Profil réel multi-niveaux (ordinateur).
  const profilReel: Array<[number, number]> = [
    [0, 0],
    [3, 40],
    [10, 40],
    [12, 20],
    [24, 20],
    [26, 12],
    [34, 12],
    [36, 3],
    [39, 3],
    [39.5, 0],
  ];
  // Profil carré équivalent (table) : 40 m jusqu'au début de la remontée,
  // décompression symboliquement plus longue.
  const profilCarre: Array<[number, number]> = [
    [0, 0],
    [1.5, 40],
    [34, 40],
    [36.5, 3],
    [45, 3],
    [45.5, 0],
  ];
  // Aire d'écart : entre le profil réel et le fond à 40 m (10 → 34 min).
  const aireEcart = versPoints([
    [10, 40],
    [12, 20],
    [24, 20],
    [26, 12],
    [34, 12],
    [34, 40],
  ]);

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={344}
        titre="Profil carré des tables contre profil réel de l'ordinateur"
        description="Deux profils superposés pour la même plongée : le profil carré des tables suppose toute la plongée à 40 mètres, le profil réel de l'ordinateur passe de 40 à 20 puis 12 mètres ; l'aire hachurée entre les deux représente la charge d'azote comptée en trop par la table, qui impose donc une décompression plus longue."
      >
        <defs>
          <pattern
            id="schema-hachures-ecart"
            width={8}
            height={8}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1={0} y1={0} x2={0} y2={8} stroke={SCHEMA_COLORS.vigilance} strokeWidth={2} opacity={0.45} />
          </pattern>
        </defs>

        <WaterBackground x={56} width={449} surfaceY={40} bottomY={240} />
        <DepthAxis x={56} minMetres={0} maxMetres={40} yTop={40} yBottom={240} pas={10} labelCote="gauche" />
        <TimeAxis y={260} minMinutes={0} maxMinutes={46} xLeft={56} xRight={505} pas={10} />

        {/* Aire d'écart hachurée */}
        <polygon points={aireEcart} fill="url(#schema-hachures-ecart)" stroke="none" />

        {/* Profil carré (table) */}
        <polyline
          points={versPoints(profilCarre)}
          fill="none"
          stroke={SCHEMA_COLORS.vigilance}
          strokeWidth={2.5}
          strokeDasharray="7 4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Profil réel (ordinateur) */}
        <polyline
          points={versPoints(profilReel)}
          fill="none"
          stroke={SCHEMA_COLORS.eau}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <text x={temps(18)} y={prof(20) - 22} fill={SCHEMA_COLORS.eau} fontSize={11.5} fontWeight={600} textAnchor="middle">
          Ordinateur : profil réel,
        </text>
        <text x={temps(18)} y={prof(20) - 8} fill={SCHEMA_COLORS.eau} fontSize={11} textAnchor="middle">
          intégré minute par minute
        </text>
        <text
          x={temps(17.5)}
          y={prof(40) - 10}
          fill={SCHEMA_COLORS.vigilance}
          fontSize={11.5}
          fontWeight={600}
          textAnchor="middle"
          paintOrder="stroke"
          stroke="var(--card, transparent)"
          strokeWidth={4}
          strokeLinejoin="round"
        >
          Table : profil carré — toute la plongée réputée à 40 m
        </text>
        <text
          x={temps(23)}
          y={prof(29)}
          fill={SCHEMA_COLORS.vigilance}
          fontSize={11}
          fontWeight={600}
          textAnchor="middle"
          paintOrder="stroke"
          stroke="var(--card, transparent)"
          strokeWidth={4}
          strokeLinejoin="round"
        >
          Charge d&apos;azote comptée
        </text>
        <text
          x={temps(23)}
          y={prof(29) + 15}
          fill={SCHEMA_COLORS.vigilance}
          fontSize={11}
          fontWeight={600}
          textAnchor="middle"
          paintOrder="stroke"
          stroke="var(--card, transparent)"
          strokeWidth={4}
          strokeLinejoin="round"
        >
          en trop par la table
        </text>
        <text x={temps(42)} y={prof(3) - 10} fill={SCHEMA_COLORS.vigilance} fontSize={11} textAnchor="middle">
          Paliers plus longs
        </text>

        <text x={280} y={300} fill="currentColor" fontSize={11.5} textAnchor="middle">
          Même plongée, deux logiques : l&apos;ordinateur crédite les niveaux moins profonds,
        </text>
        <text x={280} y={316} fill="currentColor" fontSize={11.5} textAnchor="middle">
          la table majore tout au profil carré. Ne jamais mélanger les deux en cours de plongée.
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "eau", libelle: "Profil réel multi-niveaux (ordinateur)" },
          { couleur: "vigilance", libelle: "Profil carré (table, pénalisant) et aire d'écart hachurée" },
        ]}
      />
    </>
  );
}
