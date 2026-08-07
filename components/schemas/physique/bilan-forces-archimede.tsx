import {
  ArrowAnnotated,
  DiverSilhouette,
  LegendBox,
  SCHEMA_COLORS,
  SchemaSvg,
  WaterBackground,
} from "@/components/schemas/primitives";

/**
 * Les trois états de flottabilité : longueur des vecteurs poids/poussée et
 * position du plongeur dans la colonne d'eau (résultat = celui du cours :
 * positif → je coule, nul → équilibré, négatif → je remonte).
 */
const ETATS = [
  {
    titre: "Flottabilité négative",
    x: 100,
    yPlongeur: 195,
    poids: 62,
    poussee: 38,
    resultat1: "Poids > Poussée",
    resultat2: "→ je coule",
  },
  {
    titre: "Flottabilité neutre",
    x: 270,
    yPlongeur: 165,
    poids: 50,
    poussee: 50,
    resultat1: "Poids = Poussée",
    resultat2: "→ stable, entre deux eaux",
  },
  {
    titre: "Flottabilité positive",
    x: 440,
    yPlongeur: 135,
    poids: 38,
    poussee: 62,
    resultat1: "Poids < Poussée",
    resultat2: "→ je remonte",
  },
] as const;

/**
 * Bilan des forces d'Archimède : trois plongeurs horizontaux côte à côte
 * soumis au poids (vers le bas) et à la poussée d'Archimède (vers le haut).
 * Selon la force qui l'emporte, la flottabilité est négative (je coule),
 * neutre (je suis stable) ou positive (je remonte) — le gilet et les poumons
 * permettent d'ajuster le volume, donc la poussée.
 */
export function SchemaBilanForcesArchimede() {
  return (
    <>
      <SchemaSvg
        viewBoxWidth={540}
        viewBoxHeight={340}
        titre="Les trois flottabilités : bilan poids / poussée d'Archimède"
        description="Trois plongeurs immergés : quand le poids dépasse la poussée d'Archimède le plongeur coule, quand les deux forces sont égales il reste stable, quand la poussée dépasse le poids il remonte."
      >
        <WaterBackground x={0} width={540} surfaceY={40} bottomY={330} />

        {ETATS.map((etat) => (
          <g key={etat.titre}>
            <text
              x={etat.x}
              y={66}
              fill="currentColor"
              fontSize={12}
              fontWeight={600}
              textAnchor="middle"
            >
              {etat.titre}
            </text>

            {/* Poussée d'Archimède (vers le haut) */}
            <ArrowAnnotated
              x1={etat.x}
              y1={etat.yPlongeur - 22}
              x2={etat.x}
              y2={etat.yPlongeur - 22 - etat.poussee}
              color={SCHEMA_COLORS.eau}
              label={etat.x === 100 ? "Poussée" : undefined}
              labelDx={-40}
              labelDy={4}
            />

            <DiverSilhouette x={etat.x} y={etat.yPlongeur} orientation="droite" scale={0.62} />

            {/* Poids (vers le bas) */}
            <ArrowAnnotated
              x1={etat.x}
              y1={etat.yPlongeur + 22}
              x2={etat.x}
              y2={etat.yPlongeur + 22 + etat.poids}
              color={SCHEMA_COLORS.vigilance}
              label={etat.x === 100 ? "Poids" : undefined}
              labelDx={-34}
              labelDy={4}
            />

            <text
              x={etat.x}
              y={302}
              fill="currentColor"
              fontSize={11.5}
              fontWeight={600}
              textAnchor="middle"
            >
              {etat.resultat1}
            </text>
            <text x={etat.x} y={317} fill="currentColor" fontSize={11.5} textAnchor="middle">
              {etat.resultat2}
            </text>
          </g>
        ))}
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "vigilance", libelle: "Poids réel (plongeur + lest)" },
          { couleur: "eau", libelle: "Poussée d'Archimède (eau déplacée)" },
          { couleur: "securite", libelle: "Gilet et poumons : on règle le volume, donc la poussée" },
        ]}
      />
    </>
  );
}
