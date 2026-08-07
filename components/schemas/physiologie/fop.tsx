import {
  ArrowAnnotated,
  Bubble,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Zoom sur le septum inter-auriculaire : le foramen ovale perméable
 * (présent chez environ une personne sur quatre) laisse passer des bulles
 * veineuses de l'oreillette droite vers l'oreillette gauche lors d'un
 * effort à glotte fermée (shunt droit-gauche), avec la conséquence fléchée :
 * bulles artérialisées vers le cerveau ou la moelle, ADD neurologique
 * « immérité ».
 */
export function SchemaFOP() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={520}
        viewBoxHeight={365}
        titre="Le foramen ovale perméable et le shunt droit-gauche"
        description="Coupe des deux oreillettes séparées par le septum : le clapet du foramen ovale entrouvert laisse passer des bulles veineuses vers la circulation artérielle."
      >
        {/* Titres des cavités */}
        <text x={145} y={30} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          Oreillette droite
        </text>
        <text x={145} y={46} fontSize={11} fill={SCHEMA_COLORS.azote} textAnchor="middle">
          (sang veineux)
        </text>
        <text x={375} y={30} fontSize={12} fontWeight={600} fill="currentColor" textAnchor="middle">
          Oreillette gauche
        </text>
        <text x={375} y={46} fontSize={11} fill={SCHEMA_COLORS.oxygene} textAnchor="middle">
          (sang artériel)
        </text>

        {/* Cavités */}
        <rect x={50} y={60} width={190} height={220} rx={16} fill={SCHEMA_COLORS.azote} fillOpacity={0.08} stroke={SCHEMA_COLORS.azote} strokeWidth={2} />
        <rect x={280} y={60} width={190} height={220} rx={16} fill={SCHEMA_COLORS.oxygene} fillOpacity={0.08} stroke={SCHEMA_COLORS.oxygene} strokeWidth={2} />

        {/* Septum inter-auriculaire avec l'orifice du foramen */}
        <rect x={240} y={60} width={40} height={90} fill={SCHEMA_COLORS.tissu} fillOpacity={0.25} stroke={SCHEMA_COLORS.tissu} strokeWidth={1.5} />
        <rect x={240} y={190} width={40} height={90} fill={SCHEMA_COLORS.tissu} fillOpacity={0.25} stroke={SCHEMA_COLORS.tissu} strokeWidth={1.5} />
        {/* Clapet entrouvert vers l'oreillette gauche */}
        <line x1={245} y1={150} x2={300} y2={185} stroke={SCHEMA_COLORS.tissu} strokeWidth={5} strokeLinecap="round" />

        {/* Bulles veineuses côté droit */}
        <Bubble x={100} y={140} r={7} color={SCHEMA_COLORS.azote} />
        <Bubble x={140} y={180} r={6} color={SCHEMA_COLORS.azote} />
        <Bubble x={180} y={158} r={6} color={SCHEMA_COLORS.azote} />
        <Bubble x={212} y={175} r={5} color={SCHEMA_COLORS.azote} />

        {/* Shunt droit → gauche */}
        <ArrowAnnotated
          x1={190}
          y1={168}
          x2={330}
          y2={168}
          color={SCHEMA_COLORS.danger}
          strokeWidth={2.5}
          label="shunt droit → gauche"
          labelDy={-14}
        />

        {/* Bulles passées côté artériel */}
        <Bubble x={352} y={148} r={5} color={SCHEMA_COLORS.azote} />
        <Bubble x={386} y={138} r={4} color={SCHEMA_COLORS.azote} />

        {/* Étiquette du foramen */}
        <line x1={265} y1={185} x2={310} y2={238} stroke={SCHEMA_COLORS.neutre} strokeWidth={1} />
        <text x={340} y={252} fontSize={11} fill="currentColor" textAnchor="middle">
          Foramen ovale perméable
        </text>
        <text x={340} y={266} fontSize={11} fill="currentColor" textAnchor="middle">
          (≈ 1 personne sur 4)
        </text>

        {/* Conséquence fléchée */}
        <ArrowAnnotated
          x1={390}
          y1={185}
          x2={432}
          y2={242}
          color={SCHEMA_COLORS.danger}
          strokeWidth={2}
          pointilles
        />

        {/* Condition d'ouverture */}
        <text x={260} y={300} fontSize={11} fill={SCHEMA_COLORS.vigilance} textAnchor="middle">
          Effort à glotte fermée (Valsalva puissant, toux) :
        </text>
        <text x={260} y={314} fontSize={11} fill={SCHEMA_COLORS.vigilance} textAnchor="middle">
          la pression de l&apos;oreillette droite ouvre le clapet
        </text>

        {/* Conséquence */}
        <text x={260} y={338} fontSize={12} fontWeight={600} fill={SCHEMA_COLORS.danger} textAnchor="middle">
          Bulles artérialisées → cerveau, moelle :
        </text>
        <text x={260} y={354} fontSize={12} fontWeight={600} fill={SCHEMA_COLORS.danger} textAnchor="middle">
          ADD neurologique « immérité »
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "azote", libelle: "Sang veineux et bulles d'azote" },
          { couleur: "oxygene", libelle: "Sang artériel" },
          { couleur: "tissu", libelle: "Septum inter-auriculaire" },
          { couleur: "danger", libelle: "Shunt et conséquence" },
          { couleur: "vigilance", libelle: "Condition d'ouverture" },
        ]}
      />
    </>
  );
}
