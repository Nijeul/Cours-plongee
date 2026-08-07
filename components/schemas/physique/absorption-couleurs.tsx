import {
  createDepthScale,
  DepthAxis,
  SCHEMA_COLORS,
  SchemaSvg,
  WaterBackground,
} from "@/components/schemas/primitives";

/**
 * Bandes du spectre et profondeur d'extinction (valeurs du cours : le rouge
 * s'éteint vers 5-10 m, puis l'orange, le jaune, le vert ; le bleu persiste).
 *
 * EXCEPTION à la palette sémantique, volontaire et limitée à ce schéma :
 * les couleurs réelles du spectre sont le sujet même de la figure, elles
 * sont donc codées en dur (teintes moyennement saturées, opacité 0,85,
 * lisibles sur les deux thèmes).
 */
const BANDES = [
  { nom: "Rouge", hex: "#d84b3a", finMetres: 9, label: "≈ 5-10 m" },
  { nom: "Orange", hex: "#e8842c", finMetres: 12, label: "≈ 10 m" },
  { nom: "Jaune", hex: "#dcb32e", finMetres: 22, label: "≈ 20 m" },
  { nom: "Vert", hex: "#3f9b57", finMetres: 32, label: "≈ 30 m" },
  { nom: "Bleu", hex: "#2f6fbd", finMetres: null, label: "persiste au-delà" },
] as const;

/** Abscisse gauche de chaque bande (largeur 56). */
const XS = [110, 180, 250, 320, 390] as const;

/**
 * Absorption sélective des couleurs par l'eau : cinq bandes verticales du
 * spectre plongent depuis la surface et s'éteignent tour à tour avec la
 * profondeur — le rouge vers 5-10 m, puis l'orange, le jaune vers 20 m, le
 * vert vers 30 m ; seul le bleu persiste, d'où la dominante bleu-vert des
 * profondeurs.
 */
export function SchemaAbsorptionCouleurs() {
  const profondeur = createDepthScale({
    minMetres: 0,
    maxMetres: 40,
    yTop: 60,
    yBottom: 420,
  });

  return (
    <SchemaSvg
      viewBoxWidth={500}
      viewBoxHeight={460}
      titre="L'absorption des couleurs selon la profondeur"
      description="Cinq bandes de couleur plongent depuis la surface : le rouge disparaît vers 5 à 10 mètres, l'orange vers 10 mètres, le jaune vers 20 mètres, le vert vers 30 mètres ; le bleu persiste au-delà."
    >
      <WaterBackground x={0} width={500} surfaceY={60} bottomY={445} />

      <DepthAxis
        x={64}
        minMetres={0}
        maxMetres={40}
        yTop={60}
        yBottom={420}
        pas={10}
        labelCote="gauche"
      />

      {BANDES.map((bande, i) => {
        const x = XS[i];
        const cx = x + 28;
        const yFin = bande.finMetres === null ? 420 : profondeur(bande.finMetres) + 12;
        const h = yFin - 62;
        // Fondu sur les ~50 dernières unités (sauf pour le bleu, qui persiste).
        const debutFondu = bande.finMetres === null ? 1 : Math.max(0, 1 - 50 / h);
        const gradId = `schema-absorption-${bande.nom.toLowerCase()}`;
        return (
          <g key={bande.nom}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={bande.hex} stopOpacity={0.85} />
                <stop offset={debutFondu} stopColor={bande.hex} stopOpacity={0.85} />
                <stop offset="1" stopColor={bande.hex} stopOpacity={0} />
              </linearGradient>
            </defs>
            <rect x={x} y={62} width={56} height={h} fill={`url(#${gradId})`} />
            <text
              x={cx}
              y={48}
              fill="currentColor"
              fontSize={11}
              fontWeight={600}
              textAnchor="middle"
            >
              {bande.nom}
            </text>
            <text
              x={cx}
              y={yFin + 22}
              fill="currentColor"
              fontSize={11}
              textAnchor="middle"
            >
              {bande.label}
            </text>
          </g>
        );
      })}

      <text x={16} y={456} fill={SCHEMA_COLORS.neutre} fontSize={11}>
        En profondeur : dominante bleu-vert
      </text>
    </SchemaSvg>
  );
}
