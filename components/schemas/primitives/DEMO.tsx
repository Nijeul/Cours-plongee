import { Figure } from "@/components/schemas/figure";
import {
  ArrowAnnotated,
  Bubble,
  BubbleColumn,
  createDepthScale,
  createTimeScale,
  DepthAxis,
  DiverSilhouette,
  FlowArrow,
  FlowBox,
  flowBoxHeight,
  LegendBox,
  RegulatorIcon,
  SCHEMA_COLORS,
  SchemaSvg,
  TankIcon,
  TimeAxis,
  ValueCursor,
  WaterBackground,
} from "@/components/schemas/primitives";

/**
 * Démo visuelle de la fondation « schémas pédagogiques » : compose TOUTES
 * les primitives en trois figures d'exemple (scène sous-marine, logigramme,
 * frise temporelle). Sert de test visuel — ne pas référencer dans les cours.
 */

/** Figure 1 — scène sous-marine : eau, axe de profondeur, plongeur, bulles. */
function DemoScene() {
  const profondeur = createDepthScale({
    minMetres: 0,
    maxMetres: 40,
    yTop: 50,
    yBottom: 290,
  });

  return (
    <Figure
      n={1}
      titre="Pression et profondeur (démo des primitives de scène)"
      description="Un plongeur descend sous la surface le long d'un axe gradué de 0 à 40 mètres. Des pastilles indiquent la pression absolue : 1 bar en surface, 3 bar à 20 mètres, 5 bar à 40 mètres. Une flèche verticale rappelle que la pression augmente de 1 bar tous les 10 mètres. Des bulles d'air remontent du plongeur vers la surface en grossissant. En haut à droite, une bouteille et un détendeur symbolisent l'équipement."
    >
      <SchemaSvg
        viewBoxWidth={480}
        viewBoxHeight={320}
        titre="Plongeur sous la surface avec axe de profondeur et pressions"
        description="Scène sous-marine : surface, axe de profondeur, plongeur, bulles, pressions."
      >
        <WaterBackground x={0} width={480} surfaceY={50} bottomY={310} />

        {/* Équipement (au sec, au-dessus de la surface) */}
        <TankIcon x={388} y={2} scale={0.9} />
        <RegulatorIcon x={420} y={12} scale={0.9} />

        <DepthAxis
          x={56}
          minMetres={0}
          maxMetres={40}
          yTop={50}
          yBottom={290}
          pas={10}
          labelCote="gauche"
        />

        <ValueCursor x={56} y={profondeur(0)} label="1 bar" cote="droite" />
        <ValueCursor x={56} y={profondeur(20)} label="3 bar" cote="droite" />
        <ValueCursor x={56} y={profondeur(40)} label="5 bar" cote="droite" />

        <DiverSilhouette x={250} y={profondeur(15)} orientation="descente" scale={0.85} />

        <BubbleColumn x={272} yFrom={profondeur(13)} yTo={62} count={6} />

        <ArrowAnnotated
          x1={430}
          y1={80}
          x2={430}
          y2={260}
          color={SCHEMA_COLORS.pression}
          label="+1 bar / 10 m"
          labelDx={-52}
        />
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "eau", libelle: "Eau" },
          { couleur: "pression", libelle: "Pression absolue" },
          { couleur: "air", libelle: "Air expiré" },
          { couleur: "neutre", libelle: "Repères et axes" },
        ]}
      />
    </Figure>
  );
}

/** Figure 2 — mini-logigramme : briques et connecteurs de décision. */
function DemoLogigramme() {
  const largeur = 170;
  const question = { x: (480 - largeur) / 2, y: 10 };
  const hQuestion = flowBoxHeight(1);
  const oui = { x: 30, y: 110 };
  const non = { x: 280, y: 110 };

  return (
    <Figure
      n={2}
      titre="Arbre de décision (démo des primitives de logigramme)"
      description="Logigramme simple : la question « Remontée rapide ? » mène, si oui, à une brique rouge « Alerte : risque d'ADD, prévenir l'encadrant » et, si non, à une brique verte « Poursuivre la remontée à vitesse contrôlée »."
    >
      <SchemaSvg
        viewBoxWidth={480}
        viewBoxHeight={190}
        titre="Arbre de décision en cas de remontée rapide"
        description="Question centrale avec deux issues : alerte (oui) ou procédure normale (non)."
      >
        <FlowBox
          x={question.x}
          y={question.y}
          lignes={["Remontée rapide ?"]}
          color={SCHEMA_COLORS.vigilance}
        />
        {/* Les deux connecteurs partagent le même tronc vertical : couleur
            neutre pour éviter les chevauchements colorés. */}
        <FlowArrow
          x1={240}
          y1={question.y + hQuestion}
          x2={oui.x + largeur}
          y2={135}
          coude="vertical-horizontal"
          label="Oui"
          labelDx={-5}
          labelDy={37}
        />
        <FlowArrow
          x1={240}
          y1={question.y + hQuestion}
          x2={non.x}
          y2={135}
          coude="vertical-horizontal"
          label="Non"
          labelDx={5}
          labelDy={37}
        />
        <FlowBox
          x={oui.x}
          y={oui.y}
          lignes={["Alerte : risque d'ADD", "Prévenir l'encadrant"]}
          color={SCHEMA_COLORS.danger}
        />
        <FlowBox
          x={non.x}
          y={non.y}
          lignes={["Poursuivre la remontée", "à vitesse contrôlée"]}
          color={SCHEMA_COLORS.securite}
        />
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "vigilance", libelle: "Point de décision" },
          { couleur: "danger", libelle: "Situation à risque" },
          { couleur: "securite", libelle: "Procédure correcte" },
        ]}
      />
    </Figure>
  );
}

/** Figure 3 — frise/profil : axe de temps et courbe de plongée. */
function DemoFrise() {
  const temps = createTimeScale({ minMinutes: 0, maxMinutes: 40, xLeft: 56, xRight: 450 });
  const profondeur = createDepthScale({ minMetres: 0, maxMetres: 20, yTop: 40, yBottom: 160 });

  const profil: Array<[number, number]> = [
    [0, 0],
    [3, 20],
    [25, 20],
    [30, 3],
    [33, 3],
    [35, 0],
  ];
  const points = profil.map(([t, m]) => `${temps(t)},${profondeur(m)}`).join(" ");

  return (
    <Figure
      n={3}
      titre="Profil de plongée dans le temps (démo des primitives de frise)"
      description="Courbe d'un profil de plongée sur un axe horizontal de 0 à 40 minutes : descente à 20 mètres en 3 minutes, plateau jusqu'à 25 minutes, remontée lente, palier de sécurité de 3 minutes à 3 mètres (signalé par une pastille), puis retour en surface à 35 minutes."
    >
      <SchemaSvg
        viewBoxWidth={480}
        viewBoxHeight={220}
        titre="Profil de plongée : profondeur en fonction du temps"
        description="Frise temporelle avec courbe de descente, plateau, remontée et palier."
      >
        <DepthAxis
          x={56}
          minMetres={0}
          maxMetres={20}
          yTop={40}
          yBottom={160}
          pas={10}
          labelCote="gauche"
        />
        <TimeAxis
          y={180}
          minMinutes={0}
          maxMinutes={40}
          xLeft={56}
          xRight={450}
          pas={10}
        />
        <polyline
          points={points}
          fill="none"
          stroke={SCHEMA_COLORS.eau}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Flèche décalée à droite de la courbe pour ne pas la recouvrir. */}
        <ArrowAnnotated
          x1={temps(25) + 14}
          y1={profondeur(20) - 2}
          x2={temps(30) + 10}
          y2={profondeur(3) + 6}
          color={SCHEMA_COLORS.securite}
          label="≤ 15 m/min"
          labelDx={44}
          labelDy={10}
          pointilles
        />
        <ValueCursor
          x={temps(31.5)}
          y={profondeur(3)}
          label="palier 3 min"
          cote="droite"
          color={SCHEMA_COLORS.vigilance}
        />
        <Bubble x={temps(34)} y={profondeur(1) - 8} r={3.5} />
      </SchemaSvg>
      <LegendBox
        items={[
          { couleur: "eau", libelle: "Profil de plongée" },
          { couleur: "securite", libelle: "Vitesse de remontée" },
          { couleur: "vigilance", libelle: "Palier de sécurité" },
        ]}
      />
    </Figure>
  );
}

/**
 * Test visuel de la fondation : toutes les primitives composées en trois
 * figures. À monter temporairement sur une page pour vérifier le rendu
 * clair/sombre et mobile (375 px).
 */
export function PrimitivesDemo() {
  return (
    <div className="mx-auto max-w-2xl">
      <DemoScene />
      <DemoLogigramme />
      <DemoFrise />
    </div>
  );
}
