import {
  ArrowAnnotated,
  Bubble,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Mécanisme de la surpression pulmonaire en trois étapes : alvéole normale
 * à 10 m (l'air circule, glotte ouverte), expansion pendant la remontée
 * glotte fermée (l'air se dilate, loi de Mariotte), puis rupture alvéolaire
 * avec passage de bulles dans les vaisseaux (aéroembolisme). Le message de
 * prévention « à la remontée : expirez » est mis en avant en vert.
 */
export function SchemaSurpressionPulmonaire() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={372}
        titre="La surpression pulmonaire en trois étapes"
        description="Alvéole normale à 10 mètres, alvéole distendue pendant une remontée glotte fermée, puis rupture et passage de bulles dans la circulation ; le message expirer est rappelé en vert."
      >
        {/* Cadres des trois étapes */}
        <rect x={10} y={34} width={166} height={266} rx={10} fill={SCHEMA_COLORS.securite} fillOpacity={0.04} stroke={SCHEMA_COLORS.securite} strokeWidth={1.5} />
        <rect x={187} y={34} width={166} height={266} rx={10} fill={SCHEMA_COLORS.vigilance} fillOpacity={0.04} stroke={SCHEMA_COLORS.vigilance} strokeWidth={1.5} />
        <rect x={364} y={34} width={166} height={266} rx={10} fill={SCHEMA_COLORS.danger} fillOpacity={0.04} stroke={SCHEMA_COLORS.danger} strokeWidth={1.5} />

        <ArrowAnnotated x1={176} y1={160} x2={187} y2={160} color={SCHEMA_COLORS.neutre} strokeWidth={2} />
        <ArrowAnnotated x1={353} y1={160} x2={364} y2={160} color={SCHEMA_COLORS.neutre} strokeWidth={2} />

        {/* Étape 1 : à 10 m, tout va bien */}
        <text x={93} y={56} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          1. À 10 m
        </text>
        <line x1={85} y1={80} x2={85} y2={126} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <line x1={101} y1={80} x2={101} y2={126} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <Bubble x={93} y={72} r={3} />
        <Bubble x={97} y={60} r={2.5} />
        <text x={110} y={92} fontSize={11} fill={SCHEMA_COLORS.securite} textAnchor="start">
          glotte ouverte
        </text>
        <circle cx={93} cy={160} r={34} fill={SCHEMA_COLORS.air} fillOpacity={0.12} stroke={SCHEMA_COLORS.air} strokeWidth={2.5} />
        <text x={93} y={240} fontSize={11} fill="currentColor" textAnchor="middle">
          Alvéole normale,
        </text>
        <text x={93} y={255} fontSize={11} fill="currentColor" textAnchor="middle">
          l&apos;air circule librement
        </text>
        <text x={93} y={278} fontSize={11} fill={SCHEMA_COLORS.pression} textAnchor="middle" fontWeight={600}>
          10 m — 2 bar
        </text>

        {/* Étape 2 : remontée glotte fermée */}
        <text x={270} y={52} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          2. Remontée,
        </text>
        <text x={270} y={66} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          respiration bloquée
        </text>
        <line x1={262} y1={80} x2={262} y2={120} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <line x1={278} y1={80} x2={278} y2={120} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <rect x={256} y={86} width={28} height={6} fill={SCHEMA_COLORS.danger} />
        <text x={290} y={95} fontSize={11} fill={SCHEMA_COLORS.danger} textAnchor="start">
          glotte fermée
        </text>
        <circle cx={270} cy={175} r={48} fill={SCHEMA_COLORS.air} fillOpacity={0.12} stroke={SCHEMA_COLORS.vigilance} strokeWidth={2.5} />
        {/* Expansion */}
        <ArrowAnnotated x1={236} y1={141} x2={222} y2={127} color={SCHEMA_COLORS.vigilance} strokeWidth={2} />
        <ArrowAnnotated x1={304} y1={141} x2={318} y2={127} color={SCHEMA_COLORS.vigilance} strokeWidth={2} />
        <ArrowAnnotated x1={236} y1={209} x2={222} y2={223} color={SCHEMA_COLORS.vigilance} strokeWidth={2} />
        <ArrowAnnotated x1={304} y1={209} x2={318} y2={223} color={SCHEMA_COLORS.vigilance} strokeWidth={2} />
        {/* Sens de la remontée */}
        <ArrowAnnotated x1={203} y1={235} x2={203} y2={125} color={SCHEMA_COLORS.eau} strokeWidth={2} label="remontée" labelDy={0} />
        <text x={270} y={250} fontSize={11} fill="currentColor" textAnchor="middle">
          L&apos;air se dilate (Mariotte),
        </text>
        <text x={270} y={265} fontSize={11} fill="currentColor" textAnchor="middle">
          la pression interne monte
        </text>

        {/* Étape 3 : rupture et aéroembolisme */}
        <text x={447} y={56} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          3. Près de la surface
        </text>
        <circle cx={430} cy={145} r={45} fill={SCHEMA_COLORS.air} fillOpacity={0.12} stroke={SCHEMA_COLORS.danger} strokeWidth={2.5} />
        {/* Déchirure */}
        <polyline
          points="466,118 478,126 466,136 480,144"
          fill="none"
          stroke={SCHEMA_COLORS.danger}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {/* Bulles qui s'échappent vers le vaisseau */}
        <Bubble x={482} y={168} r={4} />
        <Bubble x={490} y={196} r={4} />
        <Bubble x={492} y={222} r={3} />
        <text x={447} y={210} fontSize={11} fill="currentColor" textAnchor="middle">
          Rupture : l&apos;air passe
        </text>
        <text x={447} y={224} fontSize={11} fill="currentColor" textAnchor="middle">
          dans les vaisseaux
        </text>
        {/* Vaisseau sanguin */}
        <line x1={380} y1={240} x2={520} y2={240} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <line x1={380} y1={262} x2={520} y2={262} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <Bubble x={410} y={251} r={5} />
        <Bubble x={440} y={251} r={4} />
        <Bubble x={468} y={251} r={4} />
        <ArrowAnnotated
          x1={396}
          y1={276}
          x2={500}
          y2={276}
          color={SCHEMA_COLORS.danger}
          strokeWidth={2}
          label="vers le cerveau : aéroembolisme"
          labelDy={16}
        />

        {/* Message de prévention */}
        <rect x={10} y={316} width={520} height={48} rx={8} fill={SCHEMA_COLORS.securite} fillOpacity={0.09} stroke={SCHEMA_COLORS.securite} strokeWidth={1.5} />
        <text x={270} y={336} fontSize={14} fontWeight={700} fill={SCHEMA_COLORS.securite} textAnchor="middle">
          À la remontée : EXPIREZ
        </text>
        <text x={270} y={354} fontSize={12} fill={SCHEMA_COLORS.securite} textAnchor="middle">
          ne jamais bloquer sa respiration — possible dès 2-3 m
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "air", libelle: "Air alvéolaire" },
          { couleur: "vigilance", libelle: "Alvéole distendue" },
          { couleur: "danger", libelle: "Rupture, aéroembolisme" },
          { couleur: "securite", libelle: "Prévention : expirer" },
          { couleur: "eau", libelle: "Sens de la remontée" },
        ]}
      />
    </>
  );
}
