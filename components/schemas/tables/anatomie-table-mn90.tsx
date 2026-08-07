import {
  ArrowAnnotated,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/** Pastille numérotée d'étape de lecture (cercle + chiffre). */
function EtapeNumero({ x, y, n, color }: { x: number; y: number; n: number; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9} fill="var(--card, transparent)" stroke={color} strokeWidth={1.5} />
      <text x={x} y={y + 4} fill={color} fontSize={11} fontWeight={700} textAnchor="middle">
        {n}
      </text>
    </g>
  );
}

/** Géométrie de l'extrait de table (profondeur 20 m du jeu de données du site). */
const TABLE_X = 160;
const TABLE_Y = 48;
const COL_PROF = 62;
const COL_DUREE = 86;
const COL_PALIER = 122;
const COL_GPS = 58;
const HEADER_H = 28;
const ROW_H = 30;

const LIGNES: Array<{ duree: string; palier: string; gps: string }> = [
  { duree: "35 min", palier: "—", gps: "G" },
  { duree: "40 min", palier: "—", gps: "H" },
  { duree: "45 min", palier: "4 min", gps: "I" },
  { duree: "50 min", palier: "9 min", gps: "I" },
];

/**
 * Anatomie de la table MN90 : extrait stylisé de la table I (profondeur
 * 20 m, colonnes durée / palier à 3 m / GPS) avec les quatre étapes de
 * lecture numérotées sur l'exemple 18 m / 42 min → table 20 m / 45 min →
 * 4 min à 3 m, GPS I. Les valeurs proviennent du jeu de données du site
 * (non vérifié) et sont à contrôler sur un exemplaire officiel.
 */
export function SchemaAnatomieTableMN90() {
  const xDuree = TABLE_X + COL_PROF;
  const xPalier = xDuree + COL_DUREE;
  const xGps = xPalier + COL_PALIER;
  const xFin = xGps + COL_GPS;
  const yFin = TABLE_Y + HEADER_H + LIGNES.length * ROW_H;
  const yLigneSurbrillance = TABLE_Y + HEADER_H + 2 * ROW_H; // ligne 45 min

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={322}
        titre="Lire la table MN90 en quatre étapes"
        description="Extrait stylisé de la table MN90 à 20 mètres : on entre par la profondeur arrondie au-dessus, on descend à la durée arrondie au-dessus, on lit le palier puis le GPS ; exemple 18 mètres et 42 minutes lus 20 mètres et 45 minutes, soit 4 minutes à 3 mètres et GPS I."
      >
        <text x={274} y={20} fill="currentColor" fontSize={12} fontWeight={600} textAnchor="middle">
          Extrait stylisé de la table MN90 — colonne profondeur 20 m
        </text>

        {/* Ligne lue (45 min) mise en évidence */}
        <rect
          x={xDuree}
          y={yLigneSurbrillance}
          width={xFin - xDuree}
          height={ROW_H}
          fill={SCHEMA_COLORS.securite}
          fillOpacity={0.12}
          stroke="none"
        />

        {/* Grille */}
        <rect
          x={TABLE_X}
          y={TABLE_Y}
          width={xFin - TABLE_X}
          height={yFin - TABLE_Y}
          fill="none"
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
        />
        <line x1={xDuree} y1={TABLE_Y} x2={xDuree} y2={yFin} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <line x1={xPalier} y1={TABLE_Y} x2={xPalier} y2={yFin} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <line x1={xGps} y1={TABLE_Y} x2={xGps} y2={yFin} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <line
          x1={TABLE_X}
          y1={TABLE_Y + HEADER_H}
          x2={xFin}
          y2={TABLE_Y + HEADER_H}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
        />
        {LIGNES.slice(1).map((_, i) => {
          const y = TABLE_Y + HEADER_H + (i + 1) * ROW_H;
          return (
            <line
              key={y}
              x1={xDuree}
              y1={y}
              x2={xFin}
              y2={y}
              stroke={SCHEMA_COLORS.neutre}
              strokeWidth={1}
            />
          );
        })}

        {/* En-têtes */}
        <text x={TABLE_X + COL_PROF / 2} y={TABLE_Y + 19} fill="currentColor" fontSize={12} fontWeight={600} textAnchor="middle">
          Prof.
        </text>
        <text x={xDuree + COL_DUREE / 2} y={TABLE_Y + 19} fill="currentColor" fontSize={12} fontWeight={600} textAnchor="middle">
          Durée
        </text>
        <text x={xPalier + COL_PALIER / 2} y={TABLE_Y + 19} fill="currentColor" fontSize={12} fontWeight={600} textAnchor="middle">
          Palier à 3 m
        </text>
        <text x={xGps + COL_GPS / 2} y={TABLE_Y + 19} fill="currentColor" fontSize={12} fontWeight={600} textAnchor="middle">
          GPS
        </text>

        {/* Cellule profondeur fusionnée */}
        <text
          x={TABLE_X + COL_PROF / 2}
          y={(TABLE_Y + HEADER_H + yFin) / 2 + 12}
          fill={SCHEMA_COLORS.pression}
          fontSize={13}
          fontWeight={700}
          textAnchor="middle"
        >
          20 m
        </text>

        {/* Lignes de données */}
        {LIGNES.map((ligne, i) => {
          const yTexte = TABLE_Y + HEADER_H + i * ROW_H + ROW_H / 2 + 4;
          const enLecture = i === 2;
          return (
            <g key={ligne.duree} fontSize={12} fontWeight={enLecture ? 700 : 400}>
              <text x={xDuree + COL_DUREE / 2} y={yTexte} fill="currentColor" textAnchor="middle">
                {ligne.duree}
              </text>
              <text x={xPalier + COL_PALIER / 2} y={yTexte} fill="currentColor" textAnchor="middle">
                {ligne.palier}
              </text>
              <text x={xGps + COL_GPS / 2} y={yTexte} fill="currentColor" textAnchor="middle">
                {ligne.gps}
              </text>
            </g>
          );
        })}

        {/* Chemin de lecture : on descend la colonne durée puis on suit la ligne */}
        <ArrowAnnotated
          x1={xDuree + 11}
          y1={TABLE_Y + HEADER_H + 4}
          x2={xDuree + 11}
          y2={yLigneSurbrillance + 9}
          color={SCHEMA_COLORS.securite}
          strokeWidth={1.5}
        />
        <ArrowAnnotated
          x1={xDuree + 18}
          y1={yLigneSurbrillance + 26}
          x2={xGps + COL_GPS - 14}
          y2={yLigneSurbrillance + 26}
          color={SCHEMA_COLORS.securite}
          strokeWidth={1.5}
        />

        {/* Numéros d'étape */}
        <EtapeNumero x={TABLE_X + COL_PROF / 2} y={TABLE_Y + 60} n={1} color={SCHEMA_COLORS.pression} />
        <EtapeNumero x={xPalier - 11} y={yLigneSurbrillance + 7} n={2} color={SCHEMA_COLORS.pression} />
        <EtapeNumero x={xGps - 11} y={yLigneSurbrillance + 7} n={3} color={SCHEMA_COLORS.securite} />
        <EtapeNumero x={xFin - 11} y={yLigneSurbrillance + 7} n={4} color={SCHEMA_COLORS.securite} />

        {/* Mode d'emploi numéroté */}
        <text x={60} y={226} fill={SCHEMA_COLORS.pression} fontSize={11.5}>
          1. J&apos;entre par la profondeur, arrondie au-dessus : 18 m → colonne 20 m
        </text>
        <text x={60} y={244} fill={SCHEMA_COLORS.pression} fontSize={11.5}>
          2. Je descends à la durée, arrondie au-dessus : 42 min → ligne 45 min
        </text>
        <text x={60} y={262} fill={SCHEMA_COLORS.securite} fontSize={11.5}>
          3. Je lis les paliers : 4 min à 3 m
        </text>
        <text x={60} y={280} fill={SCHEMA_COLORS.securite} fontSize={11.5}>
          4. Je note le GPS : I (pour une éventuelle plongée successive)
        </text>

        <text x={274} y={308} fill={SCHEMA_COLORS.vigilance} fontSize={11} textAnchor="middle">
          Valeurs du jeu de données du site (non vérifié) — à contrôler sur la table MN90 officielle.
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "pression", libelle: "Entrées de la lecture (profondeur, durée arrondies au-dessus)" },
          { couleur: "securite", libelle: "Résultats lus (paliers, GPS)" },
          { couleur: "vigilance", libelle: "Données à vérifier sur la table officielle" },
        ]}
      />
    </>
  );
}
