import { LegendBox, SCHEMA_COLORS, SchemaSvg } from "@/components/schemas/primitives";

/**
 * Appareil respiratoire stylisé : voies aériennes supérieures, trachée,
 * bronches et bronchioles dans les deux poumons, diaphragme en coupole, et
 * zoom encadré sur une grappe d'alvéoles entourées de capillaires (surface
 * d'échange d'environ 70 à 100 m²).
 */
export function SchemaAppareilRespiratoire() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={430}
        titre="L'appareil respiratoire : des voies aériennes aux alvéoles"
        description="Silhouette avec trachée, bronches, poumons et diaphragme, et zoom encadré sur une grappe d'alvéoles entourées de capillaires."
      >
        {/* Tête */}
        <circle cx={150} cy={60} r={30} fill="none" stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />

        {/* Pharynx / larynx puis trachée */}
        <path d="M 144 115 C 142 100 146 92 148 84" fill="none" stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <path d="M 156 115 C 158 100 154 92 152 84" fill="none" stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <line x1={144} y1={115} x2={144} y2={185} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <line x1={156} y1={115} x2={156} y2={185} stroke={SCHEMA_COLORS.air} strokeWidth={2} />

        {/* Bronches souches puis bronchioles */}
        <line x1={147} y1={186} x2={115} y2={220} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <line x1={153} y1={186} x2={185} y2={220} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <line x1={115} y1={220} x2={100} y2={242} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
        <line x1={115} y1={220} x2={126} y2={248} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
        <line x1={100} y1={242} x2={92} y2={265} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
        <line x1={185} y1={220} x2={200} y2={242} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
        <line x1={185} y1={220} x2={174} y2={248} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
        <line x1={200} y1={242} x2={208} y2={265} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />

        {/* Poumons */}
        <path
          d="M 138 195 C 100 200 78 240 80 285 C 82 320 100 340 130 338 C 140 337 142 330 142 320 L 142 210 C 142 200 140 195 138 195 Z"
          fill={SCHEMA_COLORS.tissu}
          fillOpacity={0.08}
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={2}
        />
        <path
          d="M 162 195 C 200 200 222 240 220 285 C 218 320 200 340 170 338 C 160 337 158 330 158 320 L 158 210 C 158 200 160 195 162 195 Z"
          fill={SCHEMA_COLORS.tissu}
          fillOpacity={0.08}
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={2}
        />

        {/* Diaphragme */}
        <path d="M 70 348 Q 150 316 230 348" fill="none" stroke={SCHEMA_COLORS.tissu} strokeWidth={4} strokeLinecap="round" />
        <text x={150} y={372} fontSize={11} fill="currentColor" textAnchor="middle">
          Diaphragme
        </text>
        <text x={150} y={386} fontSize={11} fill="currentColor" textAnchor="middle">
          (muscle inspirateur principal)
        </text>

        {/* Étiquettes gauche */}
        <text x={250} y={40} fontSize={11} fill="currentColor" textAnchor="middle">
          Nez, bouche,
        </text>
        <text x={250} y={54} fontSize={11} fill="currentColor" textAnchor="middle">
          pharynx, larynx
        </text>
        <line x1={218} y1={48} x2={172} y2={66} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />

        <text x={55} y={148} fontSize={11} fill="currentColor" textAnchor="end">
          Trachée
        </text>
        <line x1={60} y1={144} x2={140} y2={150} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />

        <text x={55} y={208} fontSize={11} fill="currentColor" textAnchor="end">
          Bronches
        </text>
        <line x1={60} y1={204} x2={124} y2={210} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />

        <text x={55} y={256} fontSize={11} fill="currentColor" textAnchor="end">
          Bronchioles
        </text>
        <line x1={60} y1={252} x2={98} y2={244} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />

        <text x={55} y={302} fontSize={11} fill="currentColor" textAnchor="end">
          Poumons
        </text>
        <line x1={60} y1={298} x2={80} y2={292} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />

        {/* Liaison vers le zoom */}
        <circle cx={200} cy={300} r={10} fill="none" stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} strokeDasharray="3 3" />
        <line x1={209} y1={294} x2={312} y2={244} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} strokeDasharray="3 3" />

        {/* Zoom : grappe d'alvéoles */}
        <text x={415} y={122} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          Zoom : la grappe d&apos;alvéoles
        </text>
        <circle cx={415} cy={240} r={105} fill="none" stroke={SCHEMA_COLORS.neutre} strokeWidth={1.5} strokeDasharray="5 4" />
        {/* Bronchiole terminale */}
        <line x1={415} y1={138} x2={415} y2={178} stroke={SCHEMA_COLORS.air} strokeWidth={3} />
        <line x1={415} y1={178} x2={390} y2={198} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <line x1={415} y1={178} x2={440} y2={200} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        {/* Alvéoles */}
        <circle cx={385} cy={212} r={15} fill={SCHEMA_COLORS.air} fillOpacity={0.15} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
        <circle cx={415} cy={205} r={15} fill={SCHEMA_COLORS.air} fillOpacity={0.15} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
        <circle cx={447} cy={216} r={15} fill={SCHEMA_COLORS.air} fillOpacity={0.15} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
        <circle cx={375} cy={245} r={15} fill={SCHEMA_COLORS.air} fillOpacity={0.15} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
        <circle cx={408} cy={240} r={15} fill={SCHEMA_COLORS.air} fillOpacity={0.15} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
        <circle cx={440} cy={250} r={15} fill={SCHEMA_COLORS.air} fillOpacity={0.15} stroke={SCHEMA_COLORS.air} strokeWidth={1.5} />
        {/* Capillaires autour d'une alvéole */}
        <path d="M 424 260 A 19 19 0 0 0 458 253" fill="none" stroke={SCHEMA_COLORS.oxygene} strokeWidth={1.5} />
        <path d="M 422 264 A 22 22 0 0 0 461 257" fill="none" stroke={SCHEMA_COLORS.oxygene} strokeWidth={1.5} />
        <text x={472} y={282} fontSize={11} fill={SCHEMA_COLORS.oxygene} textAnchor="middle">
          Capillaires
        </text>
        <text x={415} y={305} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          Alvéoles
        </text>
        <text x={415} y={321} fontSize={11} fill="currentColor" textAnchor="middle">
          surface d&apos;échange ≈ 70-100 m²
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "air", libelle: "Air et voies aériennes" },
          { couleur: "tissu", libelle: "Poumons, diaphragme" },
          { couleur: "oxygene", libelle: "Capillaires sanguins" },
          { couleur: "neutre", libelle: "Repères et zoom" },
        ]}
      />
    </>
  );
}
