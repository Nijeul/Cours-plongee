import {
  ArrowAnnotated,
  Bubble,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/** Pastille numérotée des étapes du mécanisme « à la demande ». */
function Etape({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={9}
        fill="var(--card, transparent)"
        stroke={SCHEMA_COLORS.pression}
        strokeWidth={1.5}
      />
      <text
        x={x}
        y={y + 4}
        fontSize={11}
        fontWeight={700}
        fill={SCHEMA_COLORS.pression}
        textAnchor="middle"
      >
        {n}
      </text>
    </g>
  );
}

/**
 * Coupe stylisée du deuxième étage (mécanisme « à la demande ») : la
 * membrane sépare l'eau ambiante de la chambre d'air ; à l'inspiration,
 * la dépression fléchit la membrane qui bascule le levier et ouvre le
 * clapet de l'arrivée moyenne pression ; l'air rejoint l'embout. Le
 * bouton de purge appuie manuellement sur la membrane, l'expiration
 * s'évacue par la soupape d'expiration.
 */
export function SchemaCoupeDeuxiemeEtage() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={560}
        viewBoxHeight={350}
        titre="Coupe du deuxième étage : membrane, levier, clapet"
        description="Coupe stylisée du deuxième étage : l'inspiration fléchit la membrane, qui bascule le levier et ouvre le clapet de l'arrivée moyenne pression ; l'air arrive à l'embout à la pression ambiante, l'expiration sort par la soupape d'expiration et le bouton de purge permet d'ouvrir le clapet manuellement."
      >
        {/* Flexible MP arrivant du premier étage */}
        <line x1={250} y1={15} x2={250} y2={55} stroke={SCHEMA_COLORS.air} strokeWidth={3} />
        <text x={262} y={30} fontSize={11} fill={SCHEMA_COLORS.air}>
          MP (du 1er étage)
        </text>

        {/* Boîtier */}
        <rect
          x={150}
          y={55}
          width={250}
          height={200}
          rx={18}
          fill={SCHEMA_COLORS.air}
          fillOpacity={0.08}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
        />

        {/* Eau ambiante derrière le couvercle avant, contre la membrane */}
        <path
          d="M 152 60 L 185 60 Q 172 155 185 250 L 152 250 Z"
          fill={SCHEMA_COLORS.eau}
          fillOpacity={0.15}
        />
        <ArrowAnnotated x1={105} y1={115} x2={145} y2={115} color={SCHEMA_COLORS.eau} strokeWidth={2} />
        <text x={95} y={102} fontSize={11} fill={SCHEMA_COLORS.eau} textAnchor="middle">
          eau ambiante
        </text>

        {/* Membrane */}
        <path
          d="M 185 60 Q 172 155 185 250"
          fill="none"
          stroke={SCHEMA_COLORS.vigilance}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        <line x1={145} y1={70} x2={176} y2={70} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <text x={140} y={73} fontSize={11} fill={SCHEMA_COLORS.vigilance} textAnchor="end">
          membrane
        </text>

        {/* Tube d'arrivée MP et clapet */}
        <rect
          x={244}
          y={57}
          width={12}
          height={40}
          fill={SCHEMA_COLORS.air}
          fillOpacity={0.3}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
        />
        <rect
          x={236}
          y={97}
          width={28}
          height={7}
          rx={2}
          fill={SCHEMA_COLORS.tissu}
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={1.5}
        />
        <line x1={266} y1={100} x2={278} y2={100} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <text x={282} y={104} fontSize={11} fill="currentColor">
          clapet
        </text>

        {/* Levier : de la membrane au clapet */}
        <line
          x1={238}
          y1={102}
          x2={192}
          y2={150}
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={238} cy={102} r={3} fill={SCHEMA_COLORS.tissu} />
        <text x={230} y={150} fontSize={11} fill="currentColor">
          levier
        </text>

        {/* Bouton de purge, sur le couvercle avant */}
        <rect
          x={120}
          y={195}
          width={30}
          height={16}
          rx={4}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.2}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2}
        />
        <line x1={150} y1={203} x2={174} y2={203} stroke={SCHEMA_COLORS.neutre} strokeWidth={2} />
        <text x={146} y={228} fontSize={11} fill="currentColor" textAnchor="end">
          bouton de purge
        </text>

        {/* Embout tenu en bouche */}
        <rect
          x={400}
          y={140}
          width={42}
          height={30}
          rx={6}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.1}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2}
        />
        <rect
          x={442}
          y={132}
          width={8}
          height={46}
          rx={3}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.2}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
        />
        <text x={428} y={192} fontSize={11} fill="currentColor" textAnchor="middle">
          embout
        </text>

        {/* Flux d'air : inspiration puis expiration */}
        <ArrowAnnotated
          x1={255}
          y1={115}
          x2={395}
          y2={152}
          color={SCHEMA_COLORS.air}
          strokeWidth={2.5}
          label="inspiration"
        />
        <ArrowAnnotated
          x1={400}
          y1={175}
          x2={330}
          y2={248}
          color={SCHEMA_COLORS.air}
          strokeWidth={2}
          pointilles
          label="expiration"
        />

        {/* Soupape d'expiration et bulles */}
        <path
          d="M 300 255 L 320 268 L 340 255"
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.15}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <text x={300} y={292} fontSize={11} fill="currentColor" textAnchor="middle">
          soupape d&apos;expiration
        </text>
        <Bubble x={352} y={266} r={3} />
        <Bubble x={372} y={272} r={3.5} />
        <Bubble x={392} y={264} r={4} />
        <Bubble x={412} y={248} r={4.5} />
        <Bubble x={428} y={226} r={5} />

        {/* Étapes du mécanisme à la demande */}
        <Etape x={166} y={152} n={1} />
        <Etape x={206} y={132} n={2} />
        <Etape x={222} y={86} n={3} />
        <text x={280} y={322} fontSize={11} fill="currentColor" textAnchor="middle">
          1 L&apos;inspiration fléchit la membrane · 2 le levier bascule · 3 le clapet s&apos;ouvre :
        </text>
        <text x={280} y={338} fontSize={11} fill="currentColor" textAnchor="middle">
          l&apos;air arrive à la pression ambiante, puis le clapet se referme
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "air", libelle: "Trajet de l'air (MP → ambiante)" },
          { couleur: "eau", libelle: "Eau ambiante" },
          { couleur: "vigilance", libelle: "Membrane" },
          { couleur: "tissu", libelle: "Levier et clapet" },
          { couleur: "neutre", libelle: "Boîtier, purge et soupape" },
        ]}
      />
    </>
  );
}
