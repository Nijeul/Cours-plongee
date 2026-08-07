import {
  DepthAxis,
  DiverSilhouette,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  WaterBackground,
  createDepthScale,
} from "@/components/schemas/primitives";
import { BREVET_APTITUDES } from "@/content/data/reglementation";

/** Niveaux de brevet pouvant être surlignés sur le schéma. */
type Level = "n1" | "n2" | "n3" | "n4" | "mf1";

/** Props du schéma des espaces d'évolution. */
export interface SchemaEspacesEvolutionProps {
  /**
   * Niveau à mettre en avant : surligne l'espace accessible et les
   * aptitudes délivrées par le brevet (cohérent avec `BREVET_APTITUDES`).
   * Sans niveau, le schéma est rendu de façon neutre (vue d'ensemble).
   */
  level?: Level;
}

/** Libellé humain de chaque niveau (badge en haut à droite). */
const LEVEL_LABELS: Record<Level, string> = {
  n1: "Niveau 1",
  n2: "Niveau 2",
  n3: "Niveau 3",
  n4: "Niveau 4 / GP",
  mf1: "MF1",
};

/** Profondeur maximale (m) de chaque aptitude PE/PA du Code du sport. */
const APTITUDE_DEPTHS: Record<string, number> = {
  PE12: 12,
  PA12: 12,
  PE20: 20,
  PA20: 20,
  PE40: 40,
  PA40: 40,
  PE60: 60,
  PA60: 60,
};

// Géométrie générale du schéma (coupe verticale 0-60 m).
const VIEW_W = 540;
const VIEW_H = 660;
const AXIS_X = 64;
const SURFACE_Y = 90;
const BOTTOM_Y = 630;
const RIGHT_X = 530;
/** Abscisse centrale de la colonne « Encadré (PE) ». */
const PE_CX = 218;
/** Abscisse centrale de la colonne « Autonome (PA) ». */
const PA_CX = 408;
/** Dimensions d'une pastille d'aptitude. */
const CHIP_W = 62;
const CHIP_H = 24;

/** Frontières des espaces d'évolution (m) avec leurs aptitudes d'accès. */
const ESPACES: Array<{ metres: number; pe?: string; pa?: string }> = [
  { metres: 6 },
  { metres: 12, pe: "PE12", pa: "PA12" },
  { metres: 20, pe: "PE20", pa: "PA20" },
  { metres: 40, pe: "PE40", pa: "PA40" },
  { metres: 60, pe: "PE60", pa: "PA60" },
];

/** Pastille d'aptitude (PE12, PA20…), surlignée si elle appartient au niveau affiché. */
function AptitudeChip({
  cx,
  yLigne,
  code,
  baseColor,
  highlighted,
}: {
  cx: number;
  yLigne: number;
  code: string;
  baseColor: string;
  highlighted: boolean;
}) {
  const color = highlighted ? SCHEMA_COLORS.securite : baseColor;
  const y = yLigne - CHIP_H - 6;
  return (
    <g>
      <rect
        x={cx - CHIP_W / 2}
        y={y}
        width={CHIP_W}
        height={CHIP_H}
        rx={12}
        fill={color}
        fillOpacity={highlighted ? 0.16 : 0.07}
        stroke={color}
        strokeWidth={highlighted ? 2.5 : 1.5}
      />
      <text
        x={cx}
        y={y + CHIP_H / 2 + 4.5}
        fill={color}
        fontSize={12}
        fontWeight={highlighted ? 700 : 600}
        textAnchor="middle"
      >
        {code}
      </text>
    </g>
  );
}

/**
 * Coupe verticale des espaces d'évolution du Code du sport (0-6 m, 0-12 m,
 * 0-20 m, 0-40 m, 0-60 m) croisée avec les aptitudes qui y donnent accès :
 * colonne « Encadré (PE) » — palanquée conduite par un guide de palanquée —
 * et colonne « Autonome (PA) » — plongeurs majeurs sans guide. La prop
 * `level` surligne en vert l'espace accessible et les aptitudes délivrées
 * par le brevet correspondant (N1 → PE20, N2 → PA20 + PE40, N3/N4/MF1 → PA60),
 * en cohérence avec `BREVET_APTITUDES`. La limite de la plongée à l'air
 * (60 m) est rappelée sous la coupe.
 */
export function SchemaEspacesEvolution({ level }: SchemaEspacesEvolutionProps) {
  const profondeur = createDepthScale({
    minMetres: 0,
    maxMetres: 60,
    yTop: SURFACE_Y,
    yBottom: BOTTOM_Y,
  });

  const aptitudesNiveau = level ? BREVET_APTITUDES[level] : [];
  const profondeurMaxNiveau = level
    ? Math.max(...aptitudesNiveau.map((code) => APTITUDE_DEPTHS[code] ?? 0))
    : 0;

  const description = level
    ? `Coupe verticale de 0 à 60 mètres des espaces d'évolution, aptitudes du ${LEVEL_LABELS[level]} surlignées : ${aptitudesNiveau.join(" + ")}.`
    : "Coupe verticale de 0 à 60 mètres croisant les espaces d'évolution et les aptitudes plongeur encadré (PE) et plongeur autonome (PA).";

  return (
    <>
      <SchemaSvg
        viewBoxWidth={VIEW_W}
        viewBoxHeight={VIEW_H}
        titre="Espaces d'évolution et aptitudes PE/PA"
        description={description}
      >
        <WaterBackground x={0} width={VIEW_W} surfaceY={SURFACE_Y} bottomY={BOTTOM_Y} />

        {/* Zone accessible au niveau affiché (surface → profondeur max). */}
        {level ? (
          <rect
            x={AXIS_X + 2}
            y={SURFACE_Y}
            width={RIGHT_X - AXIS_X - 2}
            height={profondeur(profondeurMaxNiveau) - SURFACE_Y}
            fill={SCHEMA_COLORS.securite}
            fillOpacity={0.06}
          />
        ) : null}

        {/* En-têtes des colonnes d'aptitudes. */}
        <g>
          <DiverSilhouette
            x={PE_CX - 62}
            y={30}
            orientation="droite"
            scale={0.32}
            color={SCHEMA_COLORS.eau}
          />
          <text
            x={PE_CX + 4}
            y={26}
            fill={SCHEMA_COLORS.eau}
            fontSize={13}
            fontWeight={700}
            textAnchor="middle"
          >
            Encadré (PE)
          </text>
          <text x={PE_CX + 4} y={42} fill={SCHEMA_COLORS.eau} fontSize={11} textAnchor="middle">
            avec guide de palanquée
          </text>
          <text
            x={PA_CX}
            y={26}
            fill={SCHEMA_COLORS.vigilance}
            fontSize={13}
            fontWeight={700}
            textAnchor="middle"
          >
            Autonome (PA)
          </text>
          <text x={PA_CX} y={42} fill={SCHEMA_COLORS.vigilance} fontSize={11} textAnchor="middle">
            sans guide, majeurs
          </text>
        </g>

        {/* Badge du niveau affiché. */}
        {level ? (
          <g>
            <rect
              x={RIGHT_X - 168}
              y={54}
              width={168}
              height={24}
              rx={12}
              fill={SCHEMA_COLORS.securite}
              fillOpacity={0.12}
              stroke={SCHEMA_COLORS.securite}
              strokeWidth={1.5}
            />
            <text
              x={RIGHT_X - 84}
              y={70}
              fill={SCHEMA_COLORS.securite}
              fontSize={12}
              fontWeight={700}
              textAnchor="middle"
            >
              {LEVEL_LABELS[level]} : {aptitudesNiveau.join(" + ")}
            </text>
          </g>
        ) : null}

        <DepthAxis
          x={AXIS_X}
          minMetres={0}
          maxMetres={60}
          yTop={SURFACE_Y}
          yBottom={BOTTOM_Y}
          pas={10}
          labelCote="gauche"
        />

        {/* Frontières des espaces + pastilles d'aptitudes. */}
        {ESPACES.map(({ metres, pe, pa }) => {
          const y = profondeur(metres);
          return (
            <g key={metres}>
              <line
                x1={AXIS_X}
                y1={y}
                x2={RIGHT_X}
                y2={y}
                stroke={SCHEMA_COLORS.eau}
                strokeWidth={1.5}
                strokeDasharray="6 5"
                opacity={0.75}
              />
              <text
                x={RIGHT_X - 4}
                y={y - 5}
                fill={SCHEMA_COLORS.eau}
                fontSize={11}
                fontWeight={600}
                textAnchor="end"
              >
                {metres}&nbsp;m
              </text>
              <text x={AXIS_X + 8} y={y - 5} fill="currentColor" fontSize={11} opacity={0.8}>
                Espace 0-{metres}&nbsp;m
              </text>
              {pe ? (
                <AptitudeChip
                  cx={PE_CX}
                  yLigne={y}
                  code={pe}
                  baseColor={SCHEMA_COLORS.eau}
                  highlighted={aptitudesNiveau.includes(pe)}
                />
              ) : null}
              {pa ? (
                <AptitudeChip
                  cx={PA_CX}
                  yLigne={y}
                  code={pa}
                  baseColor={SCHEMA_COLORS.vigilance}
                  highlighted={aptitudesNiveau.includes(pa)}
                />
              ) : null}
            </g>
          );
        })}

        {/* Espace 0-6 m : découverte encadrée (baptême). */}
        <text
          x={(PE_CX + PA_CX) / 2 - 48}
          y={profondeur(6) - 12}
          fill={SCHEMA_COLORS.neutre}
          fontSize={11}
          textAnchor="middle"
        >
          Baptême (encadré)
        </text>

        {/* Barres verticales de portée des aptitudes du niveau affiché. */}
        {level
          ? aptitudesNiveau.map((code) => {
              const cx = code.startsWith("PE") ? PE_CX : PA_CX;
              const max = APTITUDE_DEPTHS[code] ?? 0;
              return (
                <g key={code}>
                  <rect
                    x={cx - CHIP_W / 2 - 14}
                    y={SURFACE_Y + 4}
                    width={5}
                    height={profondeur(max) - SURFACE_Y - 10}
                    rx={2.5}
                    fill={SCHEMA_COLORS.securite}
                    opacity={0.55}
                  />
                  <text
                    x={cx - CHIP_W / 2 - 20}
                    y={SURFACE_Y + (profondeur(max) - SURFACE_Y) / 2}
                    fill={SCHEMA_COLORS.securite}
                    fontSize={11}
                    fontWeight={600}
                    textAnchor="middle"
                    transform={`rotate(-90 ${cx - CHIP_W / 2 - 20} ${SURFACE_Y + (profondeur(max) - SURFACE_Y) / 2})`}
                  >
                    0-{max}&nbsp;m
                  </text>
                </g>
              );
            })
          : null}

        {/* Limite réglementaire de la plongée à l'air. */}
        <text
          x={(AXIS_X + RIGHT_X) / 2}
          y={BOTTOM_Y + 22}
          fill={SCHEMA_COLORS.danger}
          fontSize={12}
          fontWeight={700}
          textAnchor="middle"
        >
          {"Limite de la plongée à l'air en France : 60 m"}
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "eau", libelle: "Encadré (PE) — palanquée conduite par un guide" },
          { couleur: "vigilance", libelle: "Autonome (PA) — majeurs, sur décision du DP" },
          ...(level
            ? ([
                {
                  couleur: "securite",
                  libelle: `Aptitudes du ${LEVEL_LABELS[level]} et espace accessible`,
                },
              ] as const)
            : []),
          { couleur: "danger", libelle: "Limite air : 60 m" },
        ]}
      />
    </>
  );
}
