import { ArrowAnnotated, LegendBox, SCHEMA_COLORS, SchemaSvg } from "@/components/schemas/primitives";

/**
 * La réfraction au dioptre du masque : un rayon lumineux issu de l'objet se
 * courbe en traversant la vitre (passage eau → air), si bien que le cerveau,
 * qui suppose une propagation rectiligne, situe une image plus grosse
 * (× 4/3) et plus proche (aux 3/4 de la distance réelle : un objet à 4 m
 * semble à 3 m). Construction stylisée, non tracée à l'échelle optique.
 */
export function SchemaRefraction() {
  // Repères : œil en (78, 150), vitre du masque en x = 140,
  // objet réel en x = 455, image perçue aux 3/4 de la distance (x = 376).
  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={295}
        titre="La réfraction : l'objet paraît plus gros et plus proche"
        description="Derrière la vitre du masque, le rayon lumineux issu d'un objet se courbe en passant de l'eau à l'air : le plongeur perçoit une image plus grosse d'un tiers et située aux trois quarts de la distance réelle."
      >
        {/* Eau à droite de la vitre */}
        <rect x={140} y={0} width={400} height={295} fill={SCHEMA_COLORS.eau} fillOpacity={0.08} />
        <text x={104} y={20} fill={SCHEMA_COLORS.neutre} fontSize={11} textAnchor="end">
          Air (masque)
        </text>
        <text x={520} y={20} fill={SCHEMA_COLORS.eau} fontSize={11} fontWeight={600} textAnchor="end">
          Eau
        </text>

        {/* Vitre du masque */}
        <line x1={140} y1={50} x2={140} y2={250} stroke={SCHEMA_COLORS.neutre} strokeWidth={3} />
        <text x={140} y={40} fill={SCHEMA_COLORS.neutre} fontSize={11} textAnchor="middle">
          vitre du masque
        </text>

        {/* Œil du plongeur */}
        <g aria-hidden="true">
          <circle cx={78} cy={150} r={11} fill="none" stroke="currentColor" strokeWidth={2} />
          <circle cx={84} cy={150} r={3.5} fill="currentColor" />
        </g>
        <text x={78} y={178} fill="currentColor" fontSize={11} textAnchor="middle">
          œil
        </text>

        {/* Rayon lumineux réel : dévié à la vitre */}
        <path
          d="M 455 130 L 140 116 L 92 144"
          fill="none"
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <circle cx={140} cy={116} r={3} fill={SCHEMA_COLORS.neutre} />

        {/* Direction perçue par le cerveau (ligne droite vers l'image) */}
        <line
          x1={90}
          y1={148}
          x2={376}
          y2={110}
          stroke={SCHEMA_COLORS.vigilance}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />

        {/* Objet réel */}
        <ArrowAnnotated x1={455} y1={190} x2={455} y2={132} color={SCHEMA_COLORS.eau} />
        <text x={455} y={208} fill={SCHEMA_COLORS.eau} fontSize={11} fontWeight={600} textAnchor="middle">
          Objet réel
        </text>

        {/* Image perçue : plus grosse, plus proche */}
        <ArrowAnnotated
          x1={376}
          y1={190}
          x2={376}
          y2={112}
          color={SCHEMA_COLORS.vigilance}
          pointilles
        />
        <text x={370} y={90} fill={SCHEMA_COLORS.vigilance} fontSize={11} fontWeight={600} textAnchor="middle">
          Image perçue
        </text>
        <text x={370} y={104} fill={SCHEMA_COLORS.vigilance} fontSize={11} textAnchor="middle">
          × 4/3 plus grosse
        </text>

        {/* Distances comparées */}
        <ArrowAnnotated
          x1={140}
          y1={232}
          x2={455}
          y2={232}
          color={SCHEMA_COLORS.eau}
          label="distance réelle (ex. 4 m)"
          labelDy={-7}
        />
        <ArrowAnnotated
          x1={140}
          y1={262}
          x2={376}
          y2={262}
          color={SCHEMA_COLORS.vigilance}
          label="distance perçue : × 3/4 (ex. 3 m)"
          labelDy={-7}
          pointilles
        />
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "eau", libelle: "Objet réel et trajet réel du rayon (dévié à la vitre)" },
          { couleur: "vigilance", libelle: "Ce que perçoit le plongeur (plus gros, plus près)" },
        ]}
      />
    </>
  );
}
