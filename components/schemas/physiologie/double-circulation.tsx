import {
  ArrowAnnotated,
  Bubble,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Les deux circulations : cœur stylisé à quatre cavités (OD/VD à gauche du
 * dessin, OG/VG à droite), petite circulation vers les poumons (VD →
 * poumons → OG) et grande circulation vers les organes (VG → corps → OD),
 * sens fléchés. Le sang oxygéné est en turquoise, le sang veineux en
 * violet ; les poumons jouent le rôle de filtre à bulles veineuses.
 */
export function SchemaDoubleCirculation() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={520}
        viewBoxHeight={450}
        titre="Petite et grande circulation autour du cœur"
        description="Cœur à quatre cavités relié aux poumons par la petite circulation et aux organes par la grande circulation, avec le sens du sang fléché."
      >
        {/* Poumons */}
        <rect x={160} y={20} width={200} height={60} rx={10} fill={SCHEMA_COLORS.air} fillOpacity={0.08} stroke={SCHEMA_COLORS.air} strokeWidth={2} />
        <text x={260} y={44} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          POUMONS
        </text>
        <text x={260} y={62} fontSize={11} fill="currentColor" textAnchor="middle">
          recharge en O₂, rejet du CO₂
        </text>
        {/* Bulles veineuses piégées par le filtre pulmonaire */}
        <Bubble x={185} y={55} r={4} color={SCHEMA_COLORS.azote} />
        <Bubble x={198} y={48} r={3} color={SCHEMA_COLORS.azote} />
        <text x={260} y={100} fontSize={11} fill={SCHEMA_COLORS.vigilance} textAnchor="middle">
          filtre : les bulles veineuses y sont piégées
        </text>

        {/* Cœur : quatre cavités */}
        <rect x={190} y={170} width={70} height={120} fill={SCHEMA_COLORS.azote} fillOpacity={0.07} stroke="none" />
        <rect x={260} y={170} width={70} height={120} fill={SCHEMA_COLORS.oxygene} fillOpacity={0.07} stroke="none" />
        <rect x={190} y={170} width={140} height={120} rx={12} fill="none" stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <line x1={260} y1={170} x2={260} y2={290} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <line x1={190} y1={230} x2={330} y2={230} stroke={SCHEMA_COLORS.tissu} strokeWidth={1} strokeDasharray="4 3" />
        <text x={218} y={200} fontSize={13} fontWeight={600} fill="currentColor" textAnchor="middle">
          OD
        </text>
        <text x={218} y={270} fontSize={13} fontWeight={600} fill="currentColor" textAnchor="middle">
          VD
        </text>
        <text x={302} y={200} fontSize={13} fontWeight={600} fill="currentColor" textAnchor="middle">
          OG
        </text>
        <text x={302} y={270} fontSize={13} fontWeight={600} fill="currentColor" textAnchor="middle">
          VG
        </text>
        {/* Passage oreillette → ventricule */}
        <ArrowAnnotated x1={240} y1={208} x2={240} y2={252} color={SCHEMA_COLORS.azote} strokeWidth={2} />
        <ArrowAnnotated x1={280} y1={208} x2={280} y2={252} color={SCHEMA_COLORS.oxygene} strokeWidth={2} />

        {/* Artère pulmonaire : VD → poumons (sang veineux) */}
        <path
          d="M 190 262 L 137 262 Q 127 262 127 252 L 127 62 Q 127 52 137 52 L 145 52"
          fill="none"
          stroke={SCHEMA_COLORS.azote}
          strokeWidth={3}
        />
        <ArrowAnnotated x1={143} y1={52} x2={158} y2={52} color={SCHEMA_COLORS.azote} strokeWidth={3} />
        <text x={119} y={150} fontSize={11} fill={SCHEMA_COLORS.azote} textAnchor="end">
          artère
        </text>
        <text x={119} y={164} fontSize={11} fill={SCHEMA_COLORS.azote} textAnchor="end">
          pulmonaire
        </text>

        {/* Veines pulmonaires : poumons → OG (sang artériel) */}
        <path
          d="M 360 52 L 383 52 Q 393 52 393 62 L 393 192 Q 393 202 383 202 L 345 202"
          fill="none"
          stroke={SCHEMA_COLORS.oxygene}
          strokeWidth={3}
        />
        <ArrowAnnotated x1={347} y1={202} x2={332} y2={202} color={SCHEMA_COLORS.oxygene} strokeWidth={3} />
        <text x={401} y={150} fontSize={11} fill={SCHEMA_COLORS.oxygene} textAnchor="start">
          veines
        </text>
        <text x={401} y={164} fontSize={11} fill={SCHEMA_COLORS.oxygene} textAnchor="start">
          pulmonaires
        </text>

        {/* Aorte : VG → organes */}
        <ArrowAnnotated x1={302} y1={292} x2={302} y2={376} color={SCHEMA_COLORS.oxygene} strokeWidth={3} />
        <text x={318} y={334} fontSize={11} fill={SCHEMA_COLORS.oxygene} textAnchor="start">
          aorte
        </text>

        {/* Veines caves : organes → OD (avec pont au croisement) */}
        <path
          d="M 160 410 L 90 410 Q 80 410 80 400 L 80 212 Q 80 202 90 202 L 119 202 A 8 8 0 0 1 135 202 L 176 202"
          fill="none"
          stroke={SCHEMA_COLORS.azote}
          strokeWidth={3}
        />
        <ArrowAnnotated x1={174} y1={202} x2={188} y2={202} color={SCHEMA_COLORS.azote} strokeWidth={3} />
        <text x={74} y={330} fontSize={11} fill={SCHEMA_COLORS.azote} textAnchor="end">
          veines caves
        </text>

        {/* Organes et tissus */}
        <rect x={160} y={380} width={200} height={60} rx={10} fill={SCHEMA_COLORS.tissu} fillOpacity={0.08} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <text x={260} y={404} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          ORGANES ET TISSUS
        </text>
        <text x={260} y={422} fontSize={11} fill="currentColor" textAnchor="middle">
          livraison d&apos;O₂, collecte du CO₂
        </text>

        {/* Noms des deux boucles */}
        <text x={8} y={130} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="start">
          petite
        </text>
        <text x={8} y={144} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="start">
          circulation
        </text>
        <text x={405} y={320} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="start">
          grande
        </text>
        <text x={405} y={334} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="start">
          circulation
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "oxygene", libelle: "Sang oxygéné (artériel)" },
          { couleur: "azote", libelle: "Sang veineux (chargé en CO₂)" },
          { couleur: "air", libelle: "Poumons" },
          { couleur: "vigilance", libelle: "Filtre à bulles" },
        ]}
      />
    </>
  );
}
