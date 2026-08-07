import {
  ArrowAnnotated,
  Bubble,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/**
 * Les bulles de l'accident de désaturation : deux mécanismes pathogènes
 * (une bulle qui obstrue un vaisseau et bloque la circulation en aval, une
 * bulle formée dans un tissu qui comprime les structures voisines), puis
 * frise chronologique des délais d'apparition des signes après la sortie
 * (le plus souvent avant 1 h, presque toujours avant 24 h).
 */
export function SchemaBullesADD() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={420}
        titre="Bulles d'ADD : deux mécanismes et délais d'apparition"
        description="Bulle obstruant un vaisseau avec ischémie en aval, bulle comprimant un tissu, et frise des délais d'apparition des signes de la sortie à 24 heures."
      >
        {/* Mécanisme 1 : obstruction d'un vaisseau */}
        <text x={135} y={28} fontSize={12.5} fontWeight={600} fill="currentColor" textAnchor="middle">
          Obstruction d&apos;un vaisseau
        </text>
        <line x1={25} y1={95} x2={245} y2={95} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <line x1={25} y1={140} x2={245} y2={140} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <ArrowAnnotated x1={35} y1={117} x2={120} y2={117} color={SCHEMA_COLORS.neutre} strokeWidth={2} label="sang" labelDy={-10} />
        <Bubble x={170} y={117} r={21} color={SCHEMA_COLORS.azote} />
        {/* Zone privée de sang (ischémie) */}
        <line x1={205} y1={97} x2={196} y2={138} stroke={SCHEMA_COLORS.danger} strokeWidth={1} opacity={0.6} />
        <line x1={220} y1={97} x2={211} y2={138} stroke={SCHEMA_COLORS.danger} strokeWidth={1} opacity={0.6} />
        <line x1={235} y1={97} x2={226} y2={138} stroke={SCHEMA_COLORS.danger} strokeWidth={1} opacity={0.6} />
        <text x={170} y={80} fontSize={11} fill={SCHEMA_COLORS.azote} textAnchor="middle">
          bulle d&apos;azote
        </text>
        <text x={135} y={162} fontSize={11} fill={SCHEMA_COLORS.danger} textAnchor="middle">
          circulation bloquée :
        </text>
        <text x={135} y={176} fontSize={11} fill={SCHEMA_COLORS.danger} textAnchor="middle">
          ischémie en aval
        </text>

        {/* Mécanisme 2 : compression d'un tissu */}
        <text x={405} y={28} fontSize={12.5} fontWeight={600} fill="currentColor" textAnchor="middle">
          Compression d&apos;un tissu
        </text>
        <rect x={295} y={70} width={215} height={90} rx={14} fill={SCHEMA_COLORS.tissu} fillOpacity={0.1} stroke={SCHEMA_COLORS.tissu} strokeWidth={2} />
        <text x={330} y={88} fontSize={11} fill={SCHEMA_COLORS.tissu} textAnchor="middle">
          tissu
        </text>
        <Bubble x={400} y={115} r={20} color={SCHEMA_COLORS.azote} />
        <ArrowAnnotated x1={400} y1={92} x2={400} y2={78} color={SCHEMA_COLORS.danger} strokeWidth={2} />
        <ArrowAnnotated x1={400} y1={138} x2={400} y2={152} color={SCHEMA_COLORS.danger} strokeWidth={2} />
        <ArrowAnnotated x1={377} y1={115} x2={363} y2={115} color={SCHEMA_COLORS.danger} strokeWidth={2} />
        <ArrowAnnotated x1={423} y1={115} x2={437} y2={115} color={SCHEMA_COLORS.danger} strokeWidth={2} />
        <text x={405} y={180} fontSize={11} fill={SCHEMA_COLORS.danger} textAnchor="middle">
          la bulle comprime les structures
        </text>
        <text x={405} y={194} fontSize={11} fill={SCHEMA_COLORS.danger} textAnchor="middle">
          voisines (douleur, déficit)
        </text>

        {/* Frise des délais */}
        <text x={270} y={245} fontSize={12.5} fontWeight={600} fill="currentColor" textAnchor="middle">
          Délais d&apos;apparition des signes après la sortie
        </text>
        <ArrowAnnotated x1={50} y1={300} x2={505} y2={300} color={SCHEMA_COLORS.neutre} strokeWidth={2} />
        {[
          { x: 60, label: "sortie" },
          { x: 170, label: "30 min" },
          { x: 245, label: "1 h" },
          { x: 360, label: "6 h" },
          { x: 475, label: "24 h" },
        ].map((t) => (
          <g key={t.label}>
            <line x1={t.x} y1={295} x2={t.x} y2={305} stroke={SCHEMA_COLORS.neutre} strokeWidth={2} />
            <text x={t.x} y={322} fontSize={11} fill="currentColor" textAnchor="middle">
              {t.label}
            </text>
          </g>
        ))}
        {/* Le plus souvent avant 1 h */}
        <rect x={60} y={272} width={185} height={18} rx={4} fill={SCHEMA_COLORS.danger} fillOpacity={0.15} stroke={SCHEMA_COLORS.danger} strokeWidth={1} />
        <text x={152} y={265} fontSize={11} fill={SCHEMA_COLORS.danger} textAnchor="middle">
          le plus souvent avant 1 h
        </text>
        {/* Presque tous avant 24 h */}
        <rect x={60} y={340} width={415} height={18} rx={4} fill={SCHEMA_COLORS.vigilance} fillOpacity={0.15} stroke={SCHEMA_COLORS.vigilance} strokeWidth={1} />
        <text x={267} y={372} fontSize={11} fill={SCHEMA_COLORS.vigilance} textAnchor="middle">
          presque tous les ADD se déclarent avant 24 h
        </text>

        <text x={270} y={405} fontSize={12} fontWeight={600} fill={SCHEMA_COLORS.danger} textAnchor="middle">
          Tout signe anormal après une plongée est un ADD jusqu&apos;à preuve du contraire
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "azote", libelle: "Bulle d'azote" },
          { couleur: "tissu", libelle: "Vaisseau, tissu" },
          { couleur: "danger", libelle: "Conséquences (ischémie, compression)" },
          { couleur: "vigilance", libelle: "Fenêtre de surveillance" },
        ]}
      />
    </>
  );
}
