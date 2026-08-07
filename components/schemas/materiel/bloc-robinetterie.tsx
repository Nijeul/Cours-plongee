import { LegendBox, SCHEMA_COLORS, SchemaSvg } from "@/components/schemas/primitives";

/**
 * Bloc de plongée annoté : ogive, robinetterie (volant, sortie mono ou
 * bi-sortie), filetage normalisé, marquages gravés réglementaires
 * (PS, PE = 1,5 × PS, volume, numéro de série, dates et poinçons
 * d'épreuve, conformité CE/π) et tirette de réserve mécanique en notion
 * historique (pointillés).
 */
export function SchemaBlocRobinetterie() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={560}
        viewBoxHeight={415}
        titre="Bloc et robinetterie : éléments et marquages réglementaires"
        description="Bloc de plongée annoté montrant le volant d'ouverture, la sortie vers le premier étage, le filetage normalisé, l'ogive, les marquages gravés (pression de service, pression d'épreuve égale à 1,5 fois la pression de service, volume, dates et poinçons) et l'ancienne tirette de réserve mécanique."
      >
        {/* Corps du bloc (ogive + fût) */}
        <path
          d="M 185 96 C 165 100 135 122 135 170 L 135 356 C 135 372 149 380 165 380 L 235 380 C 251 380 265 372 265 356 L 265 170 C 265 122 235 100 215 96 Z"
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.06}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
        />

        {/* Col fileté */}
        <rect
          x={185}
          y={68}
          width={30}
          height={28}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.12}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2}
        />
        <line x1={186} y1={74} x2={214} y2={74} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <line x1={186} y1={80} x2={214} y2={80} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <line x1={186} y1={86} x2={214} y2={86} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <line x1={186} y1={92} x2={214} y2={92} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />

        {/* Robinetterie */}
        <rect
          x={172}
          y={36}
          width={56}
          height={32}
          rx={6}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.12}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
        />
        {/* Volant d'ouverture */}
        <rect x={196} y={22} width={8} height={14} fill={SCHEMA_COLORS.neutre} fillOpacity={0.3} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        <ellipse
          cx={200}
          cy={18}
          rx={18}
          ry={7}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.15}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2}
        />
        {/* Sortie vers le premier étage (et 2e sortie en pointillés) */}
        <rect
          x={228}
          y={42}
          width={22}
          height={16}
          rx={3}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.15}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2}
        />
        <rect
          x={150}
          y={42}
          width={22}
          height={16}
          rx={3}
          fill="none"
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
          strokeDasharray="4 3"
        />

        {/* Tirette de réserve mécanique (système historique) */}
        <path
          d="M 252 54 C 272 60 278 90 278 130 L 278 340"
          fill="none"
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
          strokeDasharray="5 4"
        />
        <circle
          cx={278}
          cy={346}
          r={5}
          fill="none"
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
          strokeDasharray="3 3"
        />

        {/* Marquages gravés (valeurs d'exemple) */}
        <text x={200} y={202} fontSize={11} fill="currentColor" textAnchor="middle">
          N° 12345 — 12 L
        </text>
        <text x={200} y={219} fontSize={11} fontWeight={600} fill="currentColor" textAnchor="middle">
          PS 200 bar · PE 300 bar
        </text>
        <text x={200} y={236} fontSize={11} fill="currentColor" textAnchor="middle">
          dates d&apos;épreuve
        </text>

        {/* Annotations à droite */}
        <line x1={220} y1={18} x2={315} y2={18} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <text x={320} y={22} fontSize={12} fill="currentColor">
          volant d&apos;ouverture
        </text>

        <line x1={252} y1={50} x2={315} y2={46} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <text x={320} y={50} fontSize={12} fill="currentColor">
          sortie vers le 1er étage
        </text>
        <text x={320} y={65} fontSize={11} fill={SCHEMA_COLORS.neutre}>
          (mono ou bi-sortie)
        </text>

        <line x1={216} y1={82} x2={315} y2={88} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <text x={320} y={92} fontSize={12} fill="currentColor">
          filetage normalisé
        </text>

        <line x1={252} y1={132} x2={315} y2={119} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <text x={320} y={123} fontSize={12} fill="currentColor">
          ogive
        </text>

        <line x1={248} y1={215} x2={315} y2={185} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <text x={320} y={172} fontSize={12} fontWeight={600} fill="currentColor">
          marquages gravés :
        </text>
        <text x={320} y={190} fontSize={11} fill="currentColor">
          PS : pression de service
        </text>
        <text x={320} y={206} fontSize={11} fill="currentColor">
          PE : épreuve = 1,5 × PS
        </text>
        <text x={320} y={222} fontSize={11} fill="currentColor">
          volume, n° de série, masse
        </text>
        <text x={320} y={238} fontSize={11} fill="currentColor">
          dates + poinçons, CE / π
        </text>

        <line x1={281} y1={298} x2={315} y2={292} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <text x={320} y={294} fontSize={12} fill="currentColor">
          réserve mécanique
        </text>
        <text x={320} y={309} fontSize={11} fill={SCHEMA_COLORS.neutre}>
          (système historique)
        </text>

        {/* Annotation à gauche */}
        <text x={125} y={262} fontSize={12} fill="currentColor" textAnchor="end">
          corps du bloc
        </text>
        <text x={125} y={277} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="end">
          (acier ou aluminium)
        </text>

        {/* Rappel réglementaire */}
        <text x={280} y={405} fontSize={11} fontWeight={600} fill={SCHEMA_COLORS.vigilance} textAnchor="middle">
          bloc hors validité (épreuve, TIV) = pas de gonflage
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "neutre", libelle: "Bloc et robinetterie (pointillés : réserve historique)" },
          { couleur: "vigilance", libelle: "Obligation réglementaire" },
        ]}
      />
    </>
  );
}
