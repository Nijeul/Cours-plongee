import {
  Bubble,
  DiverSilhouette,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  ValueCursor,
} from "@/components/schemas/primitives";

/** Niveau de détail du schéma (variantes selon le cursus). */
type NiveauSchema = "n1" | "n2" | "n3" | "n4" | "mf1";

/** Props du circuit de l'air. */
export interface SchemaCircuitAirProps {
  /**
   * Niveau du cours : `"n1"` = version simple (chaîne bloc → 1er étage →
   * 2e étage → plongeur, sans valeur de moyenne pression) ; `"n2"` et
   * au-delà (défaut) = version complète avec la valeur de la moyenne
   * pression (ambiante + 8 à 10 bar).
   */
  level?: NiveauSchema;
}

/**
 * Circuit de l'air du bloc au plongeur : bloc à 200 bar, robinetterie,
 * premier étage (haute pression → moyenne pression), flexible MP,
 * deuxième étage (moyenne pression → pression ambiante) et plongeur.
 * Le manomètre est branché en dérivation sur un flexible haute pression.
 * La haute pression est figurée par un trait épais, la moyenne pression
 * par un trait plus fin, les valeurs par des pastilles.
 */
export function SchemaCircuitAir({ level = "n2" }: SchemaCircuitAirProps) {
  const complet = level !== "n1";

  return (
    <>
      <SchemaSvg
        viewBoxWidth={560}
        viewBoxHeight={290}
        titre="Circuit de l'air : du bloc à 200 bar au plongeur"
        description="Chaîne de détente : le bloc à 200 bar alimente le premier étage qui abaisse la haute pression à la moyenne pression, puis le deuxième étage délivre l'air à la pression ambiante au plongeur ; le manomètre est branché en dérivation haute pression."
      >
        {/* Bloc */}
        <rect
          x={28}
          y={110}
          width={68}
          height={160}
          rx={16}
          fill={SCHEMA_COLORS.air}
          fillOpacity={0.1}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
        />
        <text x={62} y={200} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          Bloc
        </text>
        <ValueCursor x={62} y={150} label="200 bar" cote="droite" />

        {/* Robinetterie et volant */}
        <rect
          x={48}
          y={78}
          width={30}
          height={32}
          rx={4}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.15}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2}
        />
        <circle cx={40} cy={88} r={8} fill="none" stroke={SCHEMA_COLORS.neutre} strokeWidth={2} />
        <text x={40} y={68} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="middle">
          robinet
        </text>

        {/* Haute pression : trait épais */}
        <line x1={78} y1={92} x2={162} y2={92} stroke={SCHEMA_COLORS.air} strokeWidth={5} />
        <text x={120} y={78} fontSize={12} fontWeight={600} fill={SCHEMA_COLORS.air} textAnchor="middle">
          HP
        </text>

        {/* Premier étage */}
        <rect
          x={162}
          y={64}
          width={76}
          height={48}
          rx={8}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.06}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
        />
        <text x={200} y={92} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          1er étage
        </text>

        {/* Moyenne pression : trait plus fin */}
        <line x1={238} y1={92} x2={355} y2={92} stroke={SCHEMA_COLORS.air} strokeWidth={3} />
        <text x={295} y={78} fontSize={12} fontWeight={600} fill={SCHEMA_COLORS.air} textAnchor="middle">
          MP
        </text>

        {complet ? (
          <>
            <line
              x1={295}
              y1={96}
              x2={295}
              y2={150}
              stroke={SCHEMA_COLORS.neutre}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <ValueCursor x={295} y={150} label="ambiante + 8 à 10 bar" cote="droite" />
          </>
        ) : (
          <text x={295} y={128} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="middle">
            moyenne pression
          </text>
        )}

        {/* Deuxième étage */}
        <rect
          x={355}
          y={64}
          width={80}
          height={48}
          rx={8}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.06}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
        />
        <text x={395} y={92} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          2e étage
        </text>

        {/* Embout vers le plongeur */}
        <line x1={435} y1={88} x2={468} y2={84} stroke={SCHEMA_COLORS.air} strokeWidth={3} />
        <DiverSilhouette x={505} y={86} orientation="gauche" scale={0.7} />
        <text x={505} y={135} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="middle">
          plongeur
        </text>
        <Bubble x={478} y={58} r={3.5} />
        <Bubble x={486} y={42} r={4.5} />
        <Bubble x={495} y={26} r={5.5} />

        {/* Pression ambiante à la sortie du 2e étage */}
        <line
          x1={462}
          y1={92}
          x2={462}
          y2={125}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <ValueCursor x={462} y={125} label="pression ambiante" cote="gauche" />

        {/* Manomètre en dérivation HP */}
        <line x1={220} y1={112} x2={220} y2={187} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <text x={212} y={150} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="end">
          flexible HP
        </text>
        <circle
          cx={220}
          cy={215}
          r={26}
          fill={SCHEMA_COLORS.neutre}
          fillOpacity={0.06}
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
        />
        {/* Graduations et aiguille (bloc plein) */}
        <line x1={200} y1={215} x2={206} y2={215} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        <line x1={220} y1={195} x2={220} y2={201} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        <line x1={240} y1={215} x2={234} y2={215} stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} />
        <line x1={220} y1={215} x2={236} y2={200} stroke={SCHEMA_COLORS.pression} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={220} cy={215} r={3} fill={SCHEMA_COLORS.pression} />
        <text x={220} y={262} fontSize={12} fill="currentColor" textAnchor="middle">
          Manomètre
        </text>
        <text x={220} y={277} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="middle">
          (pression du bloc)
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "air", libelle: "Trajet de l'air (HP épais, MP fin)" },
          { couleur: "pression", libelle: "Valeurs de pression" },
          { couleur: "neutre", libelle: "Éléments du scaphandre" },
        ]}
      />
    </>
  );
}
