import {
  ArrowAnnotated,
  DiverSilhouette,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
} from "@/components/schemas/primitives";

/** Arrondit à une décimale (coordonnées de tracé lisibles). */
function arrondi(valeur: number): number {
  return Math.round(valeur * 10) / 10;
}

/**
 * Tracé d'un cône (secteur angulaire) figurant le champ de vision du
 * moniteur, depuis le point (x, y) vers la direction donnée (en degrés,
 * 0 = vers la droite), ouvert de ± demiAngle et de rayon donné.
 */
function coneDeVision(
  x: number,
  y: number,
  directionDeg: number,
  demiAngleDeg: number,
  rayon: number
): string {
  const a1 = ((directionDeg - demiAngleDeg) * Math.PI) / 180;
  const a2 = ((directionDeg + demiAngleDeg) * Math.PI) / 180;
  const x1 = arrondi(x + rayon * Math.cos(a1));
  const y1 = arrondi(y + rayon * Math.sin(a1));
  const x2 = arrondi(x + rayon * Math.cos(a2));
  const y2 = arrondi(y + rayon * Math.sin(a2));
  return `M ${x} ${y} L ${x1} ${y1} A ${rayon} ${rayon} 0 0 1 ${x2} ${y2} Z`;
}

/** Secteur de champ de vision : remplissage léger + bord en pointillés. */
function ChampDeVision(props: {
  x: number;
  y: number;
  direction: number;
  demiAngle: number;
  rayon: number;
}) {
  return (
    <path
      d={coneDeVision(props.x, props.y, props.direction, props.demiAngle, props.rayon)}
      fill={SCHEMA_COLORS.securite}
      fillOpacity={0.08}
      stroke={SCHEMA_COLORS.securite}
      strokeWidth={1.2}
      strokeDasharray="4 4"
    />
  );
}

/** Cadre et titre d'une vignette (vue de dessus). */
function CadreVignette({ y, titre }: { y: number; titre: string }) {
  return (
    <g>
      <text x={12} y={y + 14} fill="currentColor" fontSize={12} fontWeight={700}>
        {titre}
      </text>
      <rect
        x={10}
        y={y + 24}
        width={500}
        height={150}
        rx={10}
        fill="none"
        stroke={SCHEMA_COLORS.neutre}
        strokeWidth={1}
        opacity={0.6}
      />
    </g>
  );
}

/**
 * Positionnement du moniteur en atelier (MF1, pédagogie pratique) : trois
 * vues de dessus stylisées. 1. Démonstration face au groupe : le geste est
 * visible de tous. 2. Exercice individuel : à portée immédiate de l'élève
 * qui travaille, les autres posés restent dans le champ de vision.
 * 3. Groupe en évolution : le moniteur ferme la marche, aucun élève dans
 * son dos. Le secteur vert pointillé figure le champ de vision du moniteur.
 */
export function SchemaPositionnementMoniteur() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={520}
        viewBoxHeight={580}
        titre="Positionnement du moniteur selon l'exercice (vues de dessus)"
        description="Trois vignettes vues de dessus : démonstration face aux élèves, exercice individuel avec le moniteur à portée de l'élève qui travaille sans tourner le dos aux autres, et surveillance d'un groupe en évolution depuis l'arrière."
      >
        {/* ---- Vignette 1 : démonstration, face à face ---- */}
        <CadreVignette y={10} titre="1. Démonstration — face au groupe" />
        <ChampDeVision x={135} y={109} direction={0} demiAngle={16} rayon={260} />
        <DiverSilhouette x={100} y={109} orientation="droite" scale={0.7} color={SCHEMA_COLORS.securite} />
        <DiverSilhouette x={340} y={65} orientation="gauche" scale={0.55} color={SCHEMA_COLORS.neutre} />
        <DiverSilhouette x={370} y={109} orientation="gauche" scale={0.55} color={SCHEMA_COLORS.neutre} />
        <DiverSilhouette x={340} y={153} orientation="gauche" scale={0.55} color={SCHEMA_COLORS.neutre} />
        <text x={100} y={152} fill={SCHEMA_COLORS.securite} fontSize={11} textAnchor="middle">
          moniteur
        </text>
        <text x={395} y={70} fill={SCHEMA_COLORS.neutre} fontSize={11} textAnchor="middle">
          élèves
        </text>
        <text
          x={260}
          y={178}
          fill="currentColor"
          opacity={0.75}
          fontSize={11}
          fontStyle="italic"
          textAnchor="middle"
        >
          Le geste est visible de tous ; tous restent dans le champ du moniteur.
        </text>

        {/* ---- Vignette 2 : exercice individuel, en appui ---- */}
        <CadreVignette y={200} titre="2. Exercice individuel — à portée, sans tourner le dos" />
        <ChampDeVision x={130} y={299} direction={0} demiAngle={14} rayon={290} />
        <DiverSilhouette x={95} y={299} orientation="droite" scale={0.7} color={SCHEMA_COLORS.securite} />
        <DiverSilhouette x={215} y={299} orientation="droite" scale={0.65} color={SCHEMA_COLORS.vigilance} />
        <DiverSilhouette x={400} y={262} orientation="gauche" scale={0.5} color={SCHEMA_COLORS.neutre} />
        <DiverSilhouette x={410} y={336} orientation="gauche" scale={0.5} color={SCHEMA_COLORS.neutre} />
        <ArrowAnnotated
          x1={135}
          y1={272}
          x2={200}
          y2={290}
          color={SCHEMA_COLORS.securite}
          strokeWidth={1.5}
          pointilles
          label="à portée immédiate"
          labelDy={-10}
        />
        <text x={215} y={340} fill={SCHEMA_COLORS.vigilance} fontSize={11} textAnchor="middle">
          élève au travail
        </text>
        <text x={405} y={303} fill={SCHEMA_COLORS.neutre} fontSize={11} textAnchor="middle">
          élèves posés, en attente
        </text>
        <text
          x={260}
          y={366}
          fill="currentColor"
          opacity={0.75}
          fontSize={11}
          fontStyle="italic"
          textAnchor="middle"
        >
          Voir tous les élèves, à portée de celui qui travaille.
        </text>

        {/* ---- Vignette 3 : groupe en évolution ---- */}
        <CadreVignette y={390} titre="3. Groupe en évolution — surveillance" />
        <ChampDeVision x={155} y={489} direction={0} demiAngle={15} rayon={280} />
        <DiverSilhouette x={120} y={489} orientation="droite" scale={0.7} color={SCHEMA_COLORS.securite} />
        <DiverSilhouette x={300} y={455} orientation="droite" scale={0.55} color={SCHEMA_COLORS.neutre} />
        <DiverSilhouette x={360} y={489} orientation="droite" scale={0.55} color={SCHEMA_COLORS.neutre} />
        <DiverSilhouette x={300} y={523} orientation="droite" scale={0.55} color={SCHEMA_COLORS.neutre} />
        <ArrowAnnotated
          x1={390}
          y1={438}
          x2={470}
          y2={438}
          strokeWidth={1.5}
          pointilles
          label="sens de l'évolution"
        />
        <text
          x={260}
          y={556}
          fill="currentColor"
          opacity={0.75}
          fontSize={11}
          fontStyle="italic"
          textAnchor="middle"
        >
          Le moniteur ferme la marche : aucun élève dans son dos.
        </text>
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "securite", libelle: "Moniteur et son champ de vision" },
          { couleur: "vigilance", libelle: "Élève qui travaille" },
          { couleur: "neutre", libelle: "Autres élèves de l'atelier" },
        ]}
      />
    </>
  );
}
