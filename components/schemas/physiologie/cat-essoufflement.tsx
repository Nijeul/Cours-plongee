import {
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  flowBoxHeight,
} from "@/components/schemas/primitives";

/** Une brique du logigramme. */
interface Etape {
  lignes: string[];
  color: string;
}

const ETAPES: Etape[] = [
  {
    lignes: ["Signe « je suis essoufflé »", "dès les premiers signes"],
    color: SCHEMA_COLORS.vigilance,
  },
  {
    lignes: ["Stopper tout effort,", "se tenir à un point fixe"],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: ["Expirer longuement et", "profondément : l'expiration", "élimine le CO₂"],
    color: SCHEMA_COLORS.securite,
  },
  {
    lignes: ["L'équipier stabilise, rassure,", "incite à expirer"],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: ["Remonter doucement de", "quelques mètres", "(air moins dense)"],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: ["Fin de plongée, en respectant", "la procédure de remontée"],
    color: SCHEMA_COLORS.securite,
  },
];

const LARGEUR = 250;
const X = (480 - LARGEUR) / 2;
const GAP = 25;

/**
 * Logigramme de la conduite à tenir devant un essoufflement, conforme au
 * cours N2 : signaler, stopper tout effort, forcer l'expiration (le geste
 * qui casse le cercle vicieux du CO₂), assistance de l'équipier, remontée
 * douce de quelques mètres et fin de plongée.
 */
export function SchemaCatEssoufflement() {
  let y = 12;
  const briques = ETAPES.map((etape) => {
    const boxY = y;
    y += flowBoxHeight(etape.lignes.length) + GAP;
    return { ...etape, y: boxY };
  });
  const hauteur = y - GAP + 12;

  return (
    <>
      <SchemaSvg
        viewBoxWidth={480}
        viewBoxHeight={hauteur}
        titre="Conduite à tenir devant un essoufflement"
        description="Logigramme : signaler, stopper tout effort, expirer à fond, assistance de l'équipier, remontée douce et fin de plongée."
      >
        {briques.map((brique, i) => (
          <g key={brique.lignes[0]}>
            {i > 0 ? (
              <FlowArrow
                x1={240}
                y1={brique.y - GAP}
                x2={240}
                y2={brique.y - 2}
                color={SCHEMA_COLORS.neutre}
              />
            ) : null}
            <FlowBox x={X} y={brique.y} width={LARGEUR} lignes={brique.lignes} color={brique.color} />
          </g>
        ))}
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "vigilance", libelle: "Signaler tôt" },
          { couleur: "securite", libelle: "Gestes qui cassent le cercle vicieux" },
          { couleur: "neutre", libelle: "Étapes de la prise en charge" },
        ]}
      />
    </>
  );
}
