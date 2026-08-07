import {
  ArrowAnnotated,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/** Niveau de détail du schéma (variantes selon le cursus). */
type NiveauSchema = "n1" | "n2" | "n3" | "n4" | "mf1";

/** Props de la coupe de l'oreille. */
export interface SchemaCoupeOreilleProps {
  /**
   * Niveau du cours : `"n1"`/`"n2"`/`"n3"` (défaut) = oreille interne
   * simplifiée ; `"n4"`/`"mf1"` = cochlée, vestibule et canaux
   * semi-circulaires nommés.
   */
  level?: NiveauSchema;
}

/**
 * Coupe stylisée de l'oreille du plongeur : pavillon et conduit auditif
 * (oreille externe), tympan, caisse remplie d'air avec les osselets et la
 * trompe d'Eustache descendant vers le pharynx (oreille moyenne, sens de
 * l'équilibrage fléché en vert), fenêtres ovale et ronde, oreille interne.
 * En version N4/MF1, l'oreille interne détaille la cochlée, le vestibule
 * et les canaux semi-circulaires.
 */
export function SchemaCoupeOreille({ level = "n1" }: SchemaCoupeOreilleProps) {
  const detaille = level === "n4" || level === "mf1";

  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={380}
        titre="Coupe de l'oreille : externe, moyenne et interne"
        description="Coupe stylisée de l'oreille montrant le tympan, les osselets, la trompe d'Eustache vers le pharynx avec le sens de l'équilibrage, les fenêtres et l'oreille interne."
      >
        {/* Séparations des trois zones */}
        <line
          x1={215}
          y1={30}
          x2={215}
          y2={340}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <line
          x1={335}
          y1={30}
          x2={335}
          y2={340}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <text x={110} y={22} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          Oreille externe
        </text>
        <text x={275} y={22} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          Oreille moyenne
        </text>
        <text x={437} y={22} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          Oreille interne
        </text>

        {/* Pavillon */}
        <path
          d="M 120 80 C 65 85 40 140 55 190 C 63 218 90 235 118 224"
          fill="none"
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <path
          d="M 105 120 C 80 130 75 165 90 185"
          fill="none"
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <text x={70} y={65} fontSize={11} fill="currentColor" textAnchor="middle">
          Pavillon
        </text>

        {/* Conduit auditif (ouvert : l'eau y entre, équilibrage automatique) */}
        <rect x={115} y={150} width={95} height={35} fill={SCHEMA_COLORS.eau} fillOpacity={0.1} />
        <line x1={115} y1={150} x2={210} y2={150} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <line x1={115} y1={185} x2={210} y2={185} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <text x={155} y={205} fontSize={11} fill="currentColor" textAnchor="middle">
          Conduit auditif
        </text>

        {/* Tympan */}
        <line
          x1={213}
          y1={143}
          x2={221}
          y2={193}
          stroke={SCHEMA_COLORS.vigilance}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        <text x={228} y={215} fontSize={11} fill={SCHEMA_COLORS.vigilance} textAnchor="middle">
          Tympan
        </text>

        {/* Caisse du tympan (oreille moyenne, remplie d'air) */}
        <rect
          x={221}
          y={120}
          width={114}
          height={95}
          rx={18}
          fill={SCHEMA_COLORS.air}
          fillOpacity={0.12}
          stroke={SCHEMA_COLORS.air}
          strokeWidth={1.5}
        />

        {/* Osselets : marteau, enclume, étrier */}
        <line x1={218} y1={158} x2={235} y2={160} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <circle cx={235} cy={160} r={5} fill={SCHEMA_COLORS.tissu} fillOpacity={0.35} stroke={SCHEMA_COLORS.tissu} strokeWidth={1.5} />
        <line x1={239} y1={157} x2={252} y2={151} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <circle cx={255} cy={150} r={5} fill={SCHEMA_COLORS.tissu} fillOpacity={0.35} stroke={SCHEMA_COLORS.tissu} strokeWidth={1.5} />
        <line x1={259} y1={152} x2={274} y2={154} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <circle cx={277} cy={155} r={5} fill={SCHEMA_COLORS.tissu} fillOpacity={0.35} stroke={SCHEMA_COLORS.tissu} strokeWidth={1.5} />
        <line x1={282} y1={155} x2={331} y2={155} stroke={SCHEMA_COLORS.tissu} strokeWidth={1.5} strokeDasharray="3 3" />
        <text x={258} y={138} fontSize={11} fill="currentColor" textAnchor="middle">
          Osselets
        </text>

        {/* Fenêtres ovale et ronde (sur la paroi de l'oreille interne) */}
        <ellipse cx={335} cy={155} rx={4} ry={8} fill={SCHEMA_COLORS.vigilance} />
        <ellipse cx={335} cy={195} rx={4} ry={7} fill={SCHEMA_COLORS.vigilance} />
        <line x1={337} y1={162} x2={382} y2={288} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <line x1={337} y1={200} x2={382} y2={288} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <text x={395} y={303} fontSize={11} fill="currentColor" textAnchor="middle">
          Fenêtres ovale et ronde
        </text>

        {/* Trompe d'Eustache, vers le pharynx */}
        <path
          d="M 240 215 C 230 260 205 300 170 330 L 196 340 C 231 307 258 262 268 215 Z"
          fill={SCHEMA_COLORS.air}
          fillOpacity={0.12}
          stroke={SCHEMA_COLORS.air}
          strokeWidth={1.5}
        />
        <text x={140} y={285} fontSize={11} fill="currentColor" textAnchor="middle">
          Trompe
        </text>
        <text x={140} y={299} fontSize={11} fill="currentColor" textAnchor="middle">
          d&apos;Eustache
        </text>
        <text x={190} y={362} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="middle">
          vers le pharynx
        </text>

        {/* Sens de l'équilibrage : l'air monte du pharynx vers la caisse */}
        <ArrowAnnotated
          x1={210}
          y1={322}
          x2={252}
          y2={224}
          color={SCHEMA_COLORS.securite}
          strokeWidth={2}
          label="Air (équilibrage)"
          labelDx={58}
          labelDy={2}
        />

        {/* Oreille interne */}
        {detaille ? (
          <g>
            {/* Canaux semi-circulaires (trois plans de l'espace) */}
            <circle cx={385} cy={100} r={22} fill="none" stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
            <ellipse cx={385} cy={100} rx={22} ry={10} fill="none" stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
            <ellipse cx={385} cy={100} rx={10} ry={22} fill="none" stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
            <text x={440} y={48} fontSize={11} fill="currentColor" textAnchor="middle">
              Canaux semi-circulaires
            </text>
            <text x={440} y={62} fontSize={11} fill="currentColor" textAnchor="middle">
              (équilibre)
            </text>
            <line x1={402} y1={84} x2={428} y2={66} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />

            {/* Vestibule */}
            <ellipse
              cx={380}
              cy={152}
              rx={22}
              ry={16}
              fill={SCHEMA_COLORS.tissu}
              fillOpacity={0.15}
              stroke={SCHEMA_COLORS.tissu}
              strokeWidth={2}
            />
            <text x={380} y={188} fontSize={11} fill="currentColor" textAnchor="middle">
              Vestibule
            </text>

            {/* Cochlée : spirale stylisée */}
            <path
              d="M 447 225 A 26 26 0 1 0 421 251"
              fill="none"
              stroke={SCHEMA_COLORS.tissu}
              strokeWidth={2.5}
            />
            <path
              d="M 439 225 A 16 16 0 1 0 423 241"
              fill="none"
              stroke={SCHEMA_COLORS.tissu}
              strokeWidth={2}
            />
            <circle cx={427} cy={225} r={5} fill={SCHEMA_COLORS.tissu} fillOpacity={0.3} stroke={SCHEMA_COLORS.tissu} strokeWidth={1.5} />
            <text x={440} y={272} fontSize={11} fill="currentColor" textAnchor="middle">
              Cochlée (audition)
            </text>
          </g>
        ) : (
          <g>
            <ellipse
              cx={405}
              cy={172}
              rx={62}
              ry={72}
              fill={SCHEMA_COLORS.tissu}
              fillOpacity={0.1}
              stroke={SCHEMA_COLORS.tissu}
              strokeWidth={2}
            />
            <text x={405} y={168} fontSize={12} fill="currentColor" textAnchor="middle">
              Oreille interne
            </text>
            <text x={405} y={184} fontSize={11} fill="currentColor" textAnchor="middle">
              (remplie de liquide)
            </text>
          </g>
        )}
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "eau", libelle: "Eau (conduit ouvert)" },
          { couleur: "air", libelle: "Cavités remplies d'air" },
          { couleur: "vigilance", libelle: "Tympan et fenêtres" },
          { couleur: "securite", libelle: "Sens de l'équilibrage" },
          { couleur: "tissu", libelle: "Structures anatomiques" },
        ]}
      />
    </>
  );
}
