import {
  ArrowAnnotated,
  Bubble,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Circuit du gilet stabilisateur : vessie gonflable, flexible moyenne
 * pression alimentant le direct system (bouton de gonflage), tuyau
 * annelé avec purge buccale, purge rapide haute et purge rapide basse,
 * soupape de surpression, sens de gonflage et de dégonflage fléchés,
 * et rappel de la règle du point haut (l'air s'échappe toujours par le
 * point le plus haut du gilet).
 */
export function SchemaCircuitGilet() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={380}
        titre="Circuit du gilet : direct system, purges et soupape"
        description="Gilet stabilisateur annoté : le flexible moyenne pression alimente le direct system dont le bouton gonfle la vessie ; le dégonflage passe par la purge buccale, la purge haute ou la purge basse, l'air s'échappant toujours par le point le plus haut ; une soupape de surpression protège la vessie."
      >
        {/* Règle du point haut */}
        <text x={230} y={22} fontSize={12} fontWeight={500} fill={SCHEMA_COLORS.securite} textAnchor="middle">
          l&apos;air s&apos;échappe par le point le plus haut
        </text>

        {/* Vessie du gilet (vue de face) */}
        <path
          d="M 225 70
             C 195 72 172 95 168 135
             C 162 195 168 258 190 295
             C 205 318 335 318 350 295
             C 372 258 378 195 372 135
             C 368 95 345 72 315 70
             C 312 100 305 140 298 172
             C 285 190 255 190 242 172
             C 235 140 228 100 225 70
             Z"
          fill={SCHEMA_COLORS.air}
          fillOpacity={0.08}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
        />
        <text x={270} y={250} fontSize={11} fill="currentColor" textAnchor="middle">
          vessie gonflable
        </text>

        {/* Tuyau annelé, de l'épaule gauche vers l'inflateur */}
        <path
          d="M 205 92 C 150 110 120 165 115 225"
          fill="none"
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={7}
          strokeDasharray="4 3"
        />
        <line x1={102} y1={150} x2={120} y2={150} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <text x={60} y={154} fontSize={11} fill="currentColor" textAnchor="middle">
          tuyau annelé
        </text>

        {/* Inflateur (direct system) et purge buccale */}
        <rect
          x={98}
          y={228}
          width={34}
          height={52}
          rx={8}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.12}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2}
        />
        <circle cx={92} cy={246} r={6} fill={SCHEMA_COLORS.air} />
        <rect
          x={104}
          y={280}
          width={22}
          height={12}
          rx={4}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.15}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1.5}
        />

        {/* Flexible MP : l'air arrive de la sortie MP du 1er étage */}
        <ArrowAnnotated
          x1={18}
          y1={246}
          x2={84}
          y2={246}
          color={SCHEMA_COLORS.air}
          strokeWidth={3}
        />
        <text x={18} y={228} fontSize={11} fill={SCHEMA_COLORS.air}>
          flexible MP
        </text>
        <text x={50} y={268} fontSize={11} fill="currentColor" textAnchor="middle">
          bouton de gonflage
        </text>
        <text x={50} y={282} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="middle">
          (direct system)
        </text>

        {/* Sens de gonflage : l'air monte dans la vessie par le tuyau annelé */}
        <ArrowAnnotated
          x1={130}
          y1={205}
          x2={192}
          y2={118}
          color={SCHEMA_COLORS.air}
          strokeWidth={2}
          pointilles
          label="gonflage"
          labelDx={34}
          labelDy={14}
        />

        {/* Purge buccale (embout de l'inflateur) */}
        <ArrowAnnotated
          x1={115}
          y1={296}
          x2={115}
          y2={312}
          color={SCHEMA_COLORS.vigilance}
          strokeWidth={2}
        />
        <text x={115} y={328} fontSize={11} fill="currentColor" textAnchor="middle">
          purge buccale
        </text>

        {/* Purge rapide haute (épaule droite) */}
        <rect
          x={344}
          y={80}
          width={18}
          height={12}
          rx={3}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.2}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2}
        />
        <ArrowAnnotated
          x1={353}
          y1={78}
          x2={353}
          y2={46}
          color={SCHEMA_COLORS.vigilance}
          strokeWidth={2.5}
        />
        <Bubble x={353} y={34} r={3.5} />
        <text x={368} y={64} fontSize={11} fill="currentColor">
          purge haute
        </text>
        {/* Dans la vessie, l'air rejoint le point le plus haut */}
        <ArrowAnnotated
          x1={330}
          y1={240}
          x2={348}
          y2={110}
          color={SCHEMA_COLORS.securite}
          strokeWidth={2}
          pointilles
        />

        {/* Purge rapide basse */}
        <rect
          x={332}
          y={304}
          width={18}
          height={12}
          rx={3}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.2}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2}
        />
        <ArrowAnnotated
          x1={345}
          y1={318}
          x2={370}
          y2={345}
          color={SCHEMA_COLORS.vigilance}
          strokeWidth={2.5}
        />
        <text x={385} y={342} fontSize={11} fill="currentColor">
          purge basse
        </text>

        {/* Soupape de surpression */}
        <circle
          cx={188}
          cy={302}
          r={7}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.15}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2}
        />
        <ArrowAnnotated
          x1={182}
          y1={308}
          x2={160}
          y2={330}
          color={SCHEMA_COLORS.vigilance}
          strokeWidth={2}
          pointilles
        />
        <text x={105} y={352} fontSize={11} fill="currentColor" textAnchor="middle">
          soupape de surpression
        </text>
        <text x={105} y={366} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="middle">
          (s&apos;ouvre si le gilet est trop gonflé)
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "air", libelle: "Gonflage (air MP par le direct system)" },
          { couleur: "vigilance", libelle: "Dégonflage (purges et soupape)" },
          { couleur: "securite", libelle: "Règle du point haut" },
          { couleur: "neutre", libelle: "Gilet et tuyau annelé" },
        ]}
      />
    </>
  );
}
