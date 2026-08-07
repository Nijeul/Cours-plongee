import {
  FlowArrow,
  FlowBox,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  flowBoxHeight,
} from "@/components/schemas/primitives";

/** Niveau de détail du schéma (variantes selon le cursus). */
type NiveauSchema = "n1" | "n2" | "n3" | "n4" | "mf1";

/** Props du logigramme de conduite à tenir devant un ADD. */
export interface SchemaCatADDProps {
  /**
   * Niveau du cours : `"n2"` (défaut) = CAT en six étapes du cours N2 ;
   * `"n3"` = variante « palanquée autonome » (VHF 16 / 196, fiche
   * d'évacuation, surveillance continue).
   */
  level?: NiveauSchema;
}

/** Une brique du logigramme. */
interface Etape {
  lignes: string[];
  color: string;
}

const ETAPES_N2: Etape[] = [
  {
    lignes: ["1. Sortir la victime de l'eau", "Repos allongé, au calme,", "protégée du froid et du soleil"],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: ["2. O₂ 15 L/min en continu", "au masque haute concentration"],
    color: SCHEMA_COLORS.securite,
  },
  {
    lignes: ["3. Faire boire de l'eau plate", "0,5 à 1 L, si parfaitement", "consciente"],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: ["4. Aspirine 500 mg maximum", "si consciente, ni allergie, ni", "contre-indication (protocole)"],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: ["5. Alerter : DP, puis CROSS", "VHF 16 ou 196 en mer,", "15 ou 112 à terre"],
    color: SCHEMA_COLORS.vigilance,
  },
  {
    lignes: ["6. Évacuation vers un caisson", "hyperbare + fiche", "d'évacuation"],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: ["Jamais de réimmersion,", "d'effort, ni d'alcool"],
    color: SCHEMA_COLORS.danger,
  },
];

const ETAPES_N3: Etape[] = [
  {
    lignes: ["1. Sortir de l'eau, sécher,", "déséquiper, protéger du froid"],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: ["2. Installer : allongée ;", "demi-assise si gêne respiratoire ;", "PLS si inconsciente et ventilante"],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: ["3. O₂ 15 L/min en continu", "masque haute concentration", "(BAVU si non ventilante)"],
    color: SCHEMA_COLORS.securite,
  },
  {
    lignes: ["4. Alerter : VHF canal 16", "(CROSS) ; tél. 196, 112 ou 15"],
    color: SCHEMA_COLORS.vigilance,
  },
  {
    lignes: ["5. Eau plate si parfaitement", "consciente ; médicaments", "uniquement sur avis médical"],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: ["6. Fiche d'évacuation +", "ordinateur de la victime"],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: ["7. Surveiller en continu ;", "RCP + O₂ si arrêt ventilatoire"],
    color: SCHEMA_COLORS.neutre,
  },
  {
    lignes: ["Jamais de ré-immersion ;", "pas de replongée pour", "la palanquée"],
    color: SCHEMA_COLORS.danger,
  },
];

const LARGEUR = 250;
const X = (480 - LARGEUR) / 2;
const GAP = 25;

/**
 * Logigramme de la conduite à tenir devant un accident de désaturation,
 * conforme au cours N2 (O₂ 15 L/min, eau plate, aspirine 500 mg max selon
 * protocole, alerte, évacuation vers un caisson) ; la variante N3 déroule
 * la prise en charge en palanquée autonome (installation, VHF 16 / 196,
 * fiche d'évacuation, surveillance continue).
 */
export function SchemaCatADD({ level = "n2" }: SchemaCatADDProps) {
  const etapes = level === "n3" ? ETAPES_N3 : ETAPES_N2;

  const hauteurs = etapes.map((etape) => flowBoxHeight(etape.lignes.length));
  const briques = etapes.map((etape, i) => ({
    ...etape,
    y: 12 + hauteurs.slice(0, i).reduce((somme, h) => somme + h + GAP, 0),
  }));
  const hauteur = 12 + hauteurs.reduce((somme, h) => somme + h + GAP, 0) - GAP + 12;

  return (
    <>
      <SchemaSvg
        viewBoxWidth={480}
        viewBoxHeight={hauteur}
        titre="Conduite à tenir devant un accident de désaturation"
        description="Logigramme de la conduite à tenir : sortie de l'eau, oxygène 15 litres par minute, eau plate, aspirine selon protocole, alerte et évacuation vers un caisson hyperbare."
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
          { couleur: "securite", libelle: "Le geste qui change le pronostic" },
          { couleur: "vigilance", libelle: "Alerte" },
          { couleur: "danger", libelle: "Interdits absolus" },
          { couleur: "neutre", libelle: "Étapes de la prise en charge" },
        ]}
      />
    </>
  );
}
