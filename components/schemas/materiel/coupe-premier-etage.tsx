import {
  ArrowAnnotated,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Coupes stylisées des deux technologies de premier étage, côte à côte :
 * à piston (pièces mobiles au contact de l'eau) et à membrane (mécanisme
 * isolé de l'eau). Chaque coupe montre, de bas en haut, l'arrivée haute
 * pression depuis le bloc, la chambre HP fermée par le clapet, la chambre
 * moyenne pression avec sa sortie MP, puis la chambre humide en
 * communication avec l'eau ambiante où travaille le ressort taré.
 */
export function SchemaCoupePremierEtage() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={560}
        viewBoxHeight={355}
        titre="Premier étage à piston et à membrane (coupes stylisées)"
        description="Deux coupes côte à côte : le premier étage à piston expose le piston et le ressort à l'eau ambiante, le premier étage à membrane isole le mécanisme de l'eau ; dans les deux cas la haute pression du bloc est abaissée à la moyenne pression par l'équilibre entre le ressort, la pression ambiante et l'air moyenne pression."
      >
        {/* Titres des deux coupes */}
        <text x={145} y={22} fontSize={13} fontWeight={600} fill="currentColor" textAnchor="middle">
          À piston
        </text>
        <text x={415} y={22} fontSize={13} fontWeight={600} fill="currentColor" textAnchor="middle">
          À membrane
        </text>

        {/* ===== Coupe à piston ===== */}
        <rect
          x={45}
          y={40}
          width={200}
          height={215}
          rx={10}
          fill="none"
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
        />
        {/* Chambre humide (eau ambiante, au contact du piston) */}
        <rect x={47} y={42} width={196} height={68} fill={SCHEMA_COLORS.eau} fillOpacity={0.15} />
        <ArrowAnnotated x1={16} y1={75} x2={44} y2={75} color={SCHEMA_COLORS.eau} strokeWidth={2} />
        <text x={55} y={79} fontSize={11} fill={SCHEMA_COLORS.eau}>
          eau ambiante
        </text>
        {/* Ressort taré */}
        <path
          d="M 145 48 l 12 8 l -24 8 l 24 8 l -24 8 l 24 8 l -12 8"
          fill="none"
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <text x={168} y={58} fontSize={11} fill="currentColor">
          ressort
        </text>
        {/* Chambre MP */}
        <rect x={47} y={117} width={196} height={88} fill={SCHEMA_COLORS.air} fillOpacity={0.12} />
        <text x={55} y={150} fontSize={11} fill="currentColor">
          chambre MP
        </text>
        {/* Piston : tête + tige, la tige porte le clapet */}
        <rect
          x={95}
          y={105}
          width={100}
          height={12}
          fill={SCHEMA_COLORS.tissu}
          fillOpacity={0.3}
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={2}
        />
        <rect
          x={139}
          y={117}
          width={12}
          height={80}
          fill={SCHEMA_COLORS.tissu}
          fillOpacity={0.3}
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={2}
        />
        <text x={160} y={140} fontSize={11} fill="currentColor">
          piston
        </text>
        {/* Siège HP et clapet */}
        <rect x={47} y={202} width={86} height={6} fill={SCHEMA_COLORS.neutre} fillOpacity={0.5} />
        <rect x={157} y={202} width={86} height={6} fill={SCHEMA_COLORS.neutre} fillOpacity={0.5} />
        <rect
          x={131}
          y={196}
          width={28}
          height={7}
          rx={2}
          fill={SCHEMA_COLORS.tissu}
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={1.5}
        />
        <text x={167} y={193} fontSize={11} fill="currentColor">
          clapet
        </text>
        {/* Chambre HP */}
        <rect x={47} y={208} width={196} height={45} fill={SCHEMA_COLORS.air} fillOpacity={0.3} />
        <text x={100} y={233} fontSize={11} fill="currentColor" textAnchor="middle">
          chambre HP
        </text>
        {/* Arrivée HP et sortie MP */}
        <ArrowAnnotated
          x1={145}
          y1={305}
          x2={145}
          y2={260}
          color={SCHEMA_COLORS.air}
          strokeWidth={5}
          label="HP"
          labelDx={20}
          labelDy={4}
        />
        <ArrowAnnotated
          x1={245}
          y1={160}
          x2={285}
          y2={160}
          color={SCHEMA_COLORS.air}
          strokeWidth={3}
          label="MP"
          labelDy={-8}
        />

        {/* ===== Coupe à membrane ===== */}
        <rect
          x={315}
          y={40}
          width={200}
          height={215}
          rx={10}
          fill="none"
          stroke={SCHEMA_COLORS.neutre}
          strokeWidth={2.5}
        />
        {/* Chambre humide (eau + ressort), fermée par la membrane */}
        <rect x={317} y={42} width={196} height={70} fill={SCHEMA_COLORS.eau} fillOpacity={0.15} />
        <ArrowAnnotated x1={282} y1={60} x2={314} y2={60} color={SCHEMA_COLORS.eau} strokeWidth={2} />
        <text x={296} y={50} fontSize={11} fill={SCHEMA_COLORS.eau} textAnchor="middle">
          eau
        </text>
        <text x={325} y={79} fontSize={11} fill={SCHEMA_COLORS.eau}>
          eau ambiante
        </text>
        {/* Ressort taré, côté eau */}
        <path
          d="M 415 46 l 12 8 l -24 8 l 24 8 l -24 8 l 24 8 l -12 8"
          fill="none"
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <text x={437} y={58} fontSize={11} fill="currentColor">
          ressort
        </text>
        {/* Membrane : sépare l'eau du mécanisme */}
        <path
          d="M 317 112 Q 415 126 513 112"
          fill="none"
          stroke={SCHEMA_COLORS.vigilance}
          strokeWidth={3.5}
          strokeLinecap="round"
        />
        <text x={325} y={134} fontSize={11} fill={SCHEMA_COLORS.vigilance}>
          membrane
        </text>
        {/* Chambre MP et poussoir */}
        <rect x={317} y={120} width={196} height={82} fill={SCHEMA_COLORS.air} fillOpacity={0.12} />
        <rect
          x={409}
          y={122}
          width={12}
          height={76}
          fill={SCHEMA_COLORS.tissu}
          fillOpacity={0.3}
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={2}
        />
        <text x={438} y={168} fontSize={11} fill="currentColor">
          poussoir
        </text>
        <text x={325} y={192} fontSize={11} fill="currentColor">
          chambre MP
        </text>
        {/* Siège HP et clapet */}
        <rect x={317} y={202} width={86} height={6} fill={SCHEMA_COLORS.neutre} fillOpacity={0.5} />
        <rect x={427} y={202} width={86} height={6} fill={SCHEMA_COLORS.neutre} fillOpacity={0.5} />
        <rect
          x={401}
          y={196}
          width={28}
          height={7}
          rx={2}
          fill={SCHEMA_COLORS.tissu}
          stroke={SCHEMA_COLORS.tissu}
          strokeWidth={1.5}
        />
        <text x={437} y={193} fontSize={11} fill="currentColor">
          clapet
        </text>
        {/* Chambre HP */}
        <rect x={317} y={208} width={196} height={45} fill={SCHEMA_COLORS.air} fillOpacity={0.3} />
        <text x={370} y={233} fontSize={11} fill="currentColor" textAnchor="middle">
          chambre HP
        </text>
        {/* Arrivée HP et sortie MP */}
        <ArrowAnnotated
          x1={415}
          y1={305}
          x2={415}
          y2={260}
          color={SCHEMA_COLORS.air}
          strokeWidth={5}
          label="HP"
          labelDx={20}
          labelDy={4}
        />
        <ArrowAnnotated
          x1={515}
          y1={160}
          x2={550}
          y2={160}
          color={SCHEMA_COLORS.air}
          strokeWidth={3}
          label="MP"
          labelDx={-14}
          labelDy={-8}
        />

        {/* Légendes basses */}
        <text x={280} y={325} fontSize={11} fill={SCHEMA_COLORS.neutre} textAnchor="middle">
          arrivée haute pression depuis le bloc (200 bar)
        </text>
        <text x={145} y={347} fontSize={11} fill="currentColor" textAnchor="middle">
          pièces mobiles au contact de l&apos;eau
        </text>
        <text x={415} y={347} fontSize={11} fill="currentColor" textAnchor="middle">
          mécanisme isolé de l&apos;eau (froid, sable)
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "air", libelle: "Air (HP foncé, MP clair)" },
          { couleur: "eau", libelle: "Eau ambiante" },
          { couleur: "tissu", libelle: "Pièces mécaniques (piston, clapet, ressort)" },
          { couleur: "vigilance", libelle: "Membrane" },
        ]}
      />
    </>
  );
}
