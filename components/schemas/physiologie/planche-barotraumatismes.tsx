import type { ReactNode } from "react";

import { Bubble, LegendBox, SCHEMA_COLORS, SchemaSvg } from "@/components/schemas/primitives";

/** Sens de variation de pression concerné par la vignette. */
type SensMoment = "descente" | "remontee";

/** Ligne « moment » d'une vignette (flèche + libellé). */
interface Moment {
  sens: SensMoment;
  label: string;
}

/** Petite flèche verticale de moment (descente vers le bas, remontée vers le haut). */
function FlecheMoment({ x, y, sens, color }: { x: number; y: number; sens: SensMoment; color: string }) {
  const haut = sens === "remontee";
  return (
    <g aria-hidden="true">
      <line x1={x} y1={y - 6} x2={x} y2={y + 4} stroke={color} strokeWidth={2} />
      {haut ? (
        <path d={`M ${x - 4} ${y - 4} L ${x} ${y - 11} L ${x + 4} ${y - 4} Z`} fill={color} />
      ) : (
        <path d={`M ${x - 4} ${y + 2} L ${x} ${y + 9} L ${x + 4} ${y + 2} Z`} fill={color} />
      )}
    </g>
  );
}

/** Contenu d'une vignette de la planche. */
interface VignetteData {
  titre: string;
  moments: Moment[];
  prevention: string[];
  accent?: boolean;
  picto: ReactNode;
}

/** Vignette : cadre, titre, pictogramme, moment(s) et prévention. */
function Vignette({ x, y, data }: { x: number; y: number; data: VignetteData }) {
  const couleurCadre = data.accent ? SCHEMA_COLORS.danger : SCHEMA_COLORS.neutre;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={240}
        height={175}
        rx={10}
        fill={couleurCadre}
        fillOpacity={0.05}
        stroke={couleurCadre}
        strokeWidth={1.5}
      />
      <text
        x={x + 120}
        y={y + 24}
        fontSize={13}
        fontWeight={600}
        fill={data.accent ? SCHEMA_COLORS.danger : "currentColor"}
        textAnchor="middle"
      >
        {data.titre}
      </text>
      <g transform={`translate(${x + 16} ${y + 44})`}>{data.picto}</g>
      {data.moments.map((m, i) => {
        const my = y + 66 + i * 24;
        const couleur = m.sens === "descente" ? SCHEMA_COLORS.pression : SCHEMA_COLORS.vigilance;
        return (
          <g key={m.label}>
            <FlecheMoment x={x + 96} y={my} sens={m.sens} color={couleur} />
            <text x={x + 108} y={my + 4} fontSize={11} fill={couleur} textAnchor="start">
              {m.label}
            </text>
          </g>
        );
      })}
      {data.prevention.map((ligne, i) => (
        <text
          key={ligne}
          x={x + 120}
          y={y + 140 + i * 15}
          fontSize={11}
          fontWeight={500}
          fill={SCHEMA_COLORS.securite}
          textAnchor="middle"
        >
          {ligne}
        </text>
      ))}
    </g>
  );
}

/**
 * Planche de synthèse des barotraumatismes en six vignettes (grille 2 × 3) :
 * oreilles, sinus, dents, plaquage de masque, estomac/intestins et poumons
 * (surpression pulmonaire). Chaque vignette porte un mini-pictogramme, le
 * moment de survenue (descente et/ou remontée) et la prévention en une ligne.
 */
export function SchemaPlancheBarotraumatismes() {
  const vignettes: VignetteData[] = [
    {
      titre: "Oreilles",
      moments: [{ sens: "descente", label: "Descente (surtout)" }],
      prevention: ["Équilibrer tôt et souvent,", "sans jamais forcer"],
      picto: (
        <g>
          <path
            d="M 40 8 C 20 8 12 24 16 38 C 19 48 28 54 36 50"
            fill="none"
            stroke={SCHEMA_COLORS.tissu}
            strokeWidth={3}
            strokeLinecap="round"
          />
          <path
            d="M 34 22 C 26 24 24 34 30 40"
            fill="none"
            stroke={SCHEMA_COLORS.tissu}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </g>
      ),
    },
    {
      titre: "Sinus",
      moments: [
        { sens: "descente", label: "Descente" },
        { sens: "remontee", label: "Remontée" },
      ],
      prevention: ["Jamais de plongée enrhumé"],
      picto: (
        <g>
          <circle cx={28} cy={30} r={22} fill="none" stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
          <ellipse cx={20} cy={22} rx={6} ry={4} fill={SCHEMA_COLORS.air} fillOpacity={0.3} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
          <ellipse cx={36} cy={22} rx={6} ry={4} fill={SCHEMA_COLORS.air} fillOpacity={0.3} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
          <ellipse cx={18} cy={38} rx={5} ry={4} fill={SCHEMA_COLORS.air} fillOpacity={0.3} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
          <ellipse cx={38} cy={38} rx={5} ry={4} fill={SCHEMA_COLORS.air} fillOpacity={0.3} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
        </g>
      ),
    },
    {
      titre: "Dents",
      moments: [
        { sens: "descente", label: "Descente" },
        { sens: "remontee", label: "Remontée" },
      ],
      prevention: ["Suivi dentaire régulier"],
      picto: (
        <g>
          <path
            d="M 18 12 C 26 6 38 6 46 12 C 52 18 50 30 46 40 C 44 48 40 52 38 46 C 36 40 34 40 32 46 C 30 52 26 48 24 40 C 20 30 16 18 18 12 Z"
            fill="none"
            stroke={SCHEMA_COLORS.tissu}
            strokeWidth={2}
          />
          <Bubble x={32} y={24} r={4} />
        </g>
      ),
    },
    {
      titre: "Plaquage de masque",
      moments: [{ sens: "descente", label: "Descente" }],
      prevention: ["Souffler par le nez", "dans le masque"],
      picto: (
        <g>
          <rect x={6} y={16} width={50} height={26} rx={10} fill={SCHEMA_COLORS.air} fillOpacity={0.1} stroke={SCHEMA_COLORS.tissu} strokeWidth={2.5} />
          <line x1={6} y1={28} x2={0} y2={26} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
          <line x1={56} y1={28} x2={62} y2={26} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
          <path d="M 25 42 Q 31 50 37 42" fill="none" stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        </g>
      ),
    },
    {
      titre: "Estomac, intestins",
      moments: [{ sens: "remontee", label: "Remontée" }],
      prevention: ["Éviter boissons gazeuses", "et aliments qui fermentent"],
      picto: (
        <path
          d="M 12 16 C 30 8 40 20 30 26 C 18 32 18 40 32 38 C 46 36 48 46 34 50 C 24 53 18 52 14 48"
          fill="none"
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ),
    },
    {
      titre: "Poumons — surpression",
      moments: [{ sens: "remontee", label: "Remontée (0-10 m !)" }],
      prevention: ["Ne jamais bloquer sa", "respiration à la remontée"],
      accent: true,
      picto: (
        <g>
          <line x1={32} y1={4} x2={32} y2={16} stroke={SCHEMA_COLORS.air} strokeWidth={3} />
          <path
            d="M 28 18 C 14 22 8 38 12 52 C 20 58 28 52 28 40 Z"
            fill={SCHEMA_COLORS.tissu}
            fillOpacity={0.1}
            stroke={SCHEMA_COLORS.tissu}
            strokeWidth={2}
          />
          <path
            d="M 36 18 C 50 22 56 38 52 52 C 44 58 36 52 36 40 Z"
            fill={SCHEMA_COLORS.tissu}
            fillOpacity={0.1}
            stroke={SCHEMA_COLORS.tissu}
            strokeWidth={2}
          />
        </g>
      ),
    },
  ];

  const positions: Array<[number, number]> = [
    [8, 8],
    [272, 8],
    [8, 196],
    [272, 196],
    [8, 384],
    [272, 384],
  ];

  return (
    <>
      <SchemaSvg
        viewBoxWidth={520}
        viewBoxHeight={570}
        titre="Planche des six barotraumatismes"
        description="Six vignettes : oreilles, sinus, dents, plaquage de masque, estomac et intestins, poumons — avec pour chacune le moment de survenue et la prévention."
      >
        {vignettes.map((v, i) => (
          <Vignette key={v.titre} x={positions[i][0]} y={positions[i][1]} data={v} />
        ))}
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "pression", libelle: "Accident de la descente" },
          { couleur: "vigilance", libelle: "Accident de la remontée" },
          { couleur: "securite", libelle: "Prévention" },
          { couleur: "danger", libelle: "Accident le plus grave" },
        ]}
      />
    </>
  );
}
