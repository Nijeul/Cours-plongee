import { LegendBox, SCHEMA_COLORS, SchemaSvg } from "@/components/schemas/primitives";

/**
 * Face stylisée de face montrant les sinus frontaux (au-dessus des sourcils)
 * et maxillaires (sous les yeux, de part et d'autre du nez), reliés aux
 * fosses nasales par de fins canaux de communication. Rappelle qu'un canal
 * bouché (rhume, sinusite) rend l'équilibrage impossible.
 */
export function SchemaCoupeSinus() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={480}
        viewBoxHeight={400}
        titre="Les sinus frontaux et maxillaires et leurs canaux"
        description="Visage stylisé de face avec les sinus frontaux et maxillaires reliés aux fosses nasales par de fins canaux de communication."
      >
        {/* Visage */}
        <ellipse
          cx={190}
          cy={200}
          rx={115}
          ry={155}
          fill={SCHEMA_COLORS.tissu}
          fillOpacity={0.05}
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={2.5}
        />
        {/* Sourcils */}
        <path d="M 130 142 Q 152 130 175 138" fill="none" stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <path d="M 205 138 Q 228 130 250 142" fill="none" stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        {/* Yeux */}
        <ellipse cx={152} cy={160} rx={13} ry={8} fill="none" stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <ellipse cx={228} cy={160} rx={13} ry={8} fill="none" stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        {/* Nez et fosses nasales */}
        <path
          d="M 186 175 L 178 230 Q 190 240 202 230 L 194 175 Z"
          fill={SCHEMA_COLORS.air}
          fillOpacity={0.15}
          stroke="none"
        />
        <path
          d="M 186 170 L 176 232 Q 190 244 204 232 L 194 170"
          fill="none"
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={2}
        />
        {/* Bouche */}
        <path d="M 160 295 Q 190 308 220 295" fill="none" stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />

        {/* Sinus frontaux */}
        <ellipse cx={158} cy={110} rx={22} ry={15} fill={SCHEMA_COLORS.air} fillOpacity={0.18} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <ellipse cx={222} cy={110} rx={22} ry={15} fill={SCHEMA_COLORS.air} fillOpacity={0.18} stroke={SCHEMA_COLORS.air} strokeWidth={2} />

        {/* Sinus maxillaires */}
        <ellipse cx={140} cy={215} rx={20} ry={16} fill={SCHEMA_COLORS.air} fillOpacity={0.18} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <ellipse cx={240} cy={215} rx={20} ry={16} fill={SCHEMA_COLORS.air} fillOpacity={0.18} stroke={SCHEMA_COLORS.air} strokeWidth={2} />

        {/* Canaux de communication (fins, faciles à boucher) */}
        <line x1={165} y1={124} x2={184} y2={180} stroke={SCHEMA_COLORS.air} strokeWidth={3} strokeLinecap="round" />
        <line x1={215} y1={124} x2={196} y2={180} stroke={SCHEMA_COLORS.air} strokeWidth={3} strokeLinecap="round" />
        <line x1={158} y1={210} x2={179} y2={218} stroke={SCHEMA_COLORS.air} strokeWidth={3} strokeLinecap="round" />
        <line x1={222} y1={210} x2={201} y2={218} stroke={SCHEMA_COLORS.air} strokeWidth={3} strokeLinecap="round" />

        {/* Étiquettes */}
        <text x={390} y={98} fontSize={12} fill="currentColor" textAnchor="middle">
          Sinus frontaux
        </text>
        <line x1={246} y1={108} x2={330} y2={96} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />

        <text x={390} y={160} fontSize={12} fill="currentColor" textAnchor="middle">
          Canaux de
        </text>
        <text x={390} y={174} fontSize={12} fill="currentColor" textAnchor="middle">
          communication
        </text>
        <line x1={208} y1={150} x2={332} y2={163} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <line x1={212} y1={214} x2={332} y2={170} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />

        <text x={390} y={232} fontSize={12} fill="currentColor" textAnchor="middle">
          Sinus maxillaires
        </text>
        <line x1={262} y1={218} x2={328} y2={230} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />

        <text x={390} y={292} fontSize={12} fill="currentColor" textAnchor="middle">
          Fosses nasales
        </text>
        <line x1={198} y1={234} x2={330} y2={289} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />

        {/* Point de vigilance */}
        <text x={240} y={368} fontSize={12} fill={SCHEMA_COLORS.vigilance} textAnchor="middle" fontWeight={600}>
          Canal bouché (rhume, sinusite) :
        </text>
        <text x={240} y={384} fontSize={12} fill={SCHEMA_COLORS.vigilance} textAnchor="middle" fontWeight={600}>
          équilibrage impossible, douleur assurée
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "air", libelle: "Cavités et canaux remplis d'air" },
          { couleur: "tissu", libelle: "Visage (os et tissus)" },
          { couleur: "vigilance", libelle: "Point de vigilance" },
        ]}
      />
    </>
  );
}
