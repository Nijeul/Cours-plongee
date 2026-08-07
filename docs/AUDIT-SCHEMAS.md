# Audit des besoins en schémas — Cours-plongee

- **Date** : 2026-08-07
- **Méthode** : lecture intégrale des 42 fichiers MDX de `content/` (n1 : 7, n2 : 11, n3 : 7, n4 : 9, mf1 : 8). Les ancres de section correspondent aux titres `h2` slugifiés façon github-slugger (accents conservés, ponctuation supprimée — un `:` entouré d'espaces produit un double tiret `--`). Les simulateurs déjà insérés (`<SimTables />`, `<SimAutonomie />`, `<SimLoisPhysiques />`, `<SimDesaturation />`, `<SimGenerateur />`) comptent comme couverture visuelle de leur notion ; les deux seuls SVG inline existants sont dans `content/n4/n4-materiel.mdx` (chaîne bloc → détendeur, et piston vs membrane, tous deux très schématiques).
- **Règle cardinale** : un schéma n'est proposé que s'il remplit au moins un critère — **(1)** rend visible du spatial/anatomique ; **(2)** rend visible une relation entre grandeurs ; **(3)** rend visible une chronologie ; **(4)** rend visible une arborescence de décision ; **(5)** remplace un paragraphe que l'élève relirait trois fois. Pas de décoration ; 1 à 3 schémas max par section dense ; zéro schéma pour les sections de définitions ou de réglementation simple ; pas de doublon statique d'un simulateur déjà présent, sauf réelle valeur ajoutée (figure de référence imprimable, lecture pas à pas).
- **Priorités** : **1** = indispensable ou exigé par le cahier des charges client ; **2** = forte valeur (dont réutilisations d'un schéma P1 dans un module où la notion est secondaire ou déjà partiellement couverte) ; **3** = confort.
- **Réutilisation** : un même nom de schéma désigne la même figure partagée entre modules/niveaux ; la mention « réut. » signale une insertion d'un schéma défini ailleurs (éventuellement avec une variante : zoom, valeurs enrichies).

---

## Niveau 1

| Module | Section (ancre) | Notion | Schéma existant ? | Schéma proposé | Justification (critère 1-5) | Priorité |
|---|---|---|---|---|---|---|
| n1-flottabilite-pression | `pression-atmosphérique-relative-et-absolue` | Pression atmosphérique / relative / absolue selon la profondeur | non | SchemaEchellePression | 2 — échelle verticale 0-60 m avec les 3 pressions, remplace le tableau relu trois fois | 1 |
| n1-flottabilite-pression | `lair-se-comprime-leau-non` | Compression/dilatation d'un volume d'air (ballon 6 L) | oui-simulateur (SimLoisPhysiques en fin de section) | SchemaMariotteBallon | 2 + 5 — figure fixe imprimable du ballon à 0/10/20/30/40 m, valeurs repères mémorisables en complément du simulateur | 1 |
| n1-flottabilite-pression | `la-poussée-darchimède-racontée-simplement` | Duel poids / poussée, 3 flottabilités | non | SchemaBilanForcesArchimede | 2 — bilan des forces (flèches) sur ballon, caillou, poisson/plongeur | 1 |
| n1-flottabilite-pression | `le-plongeur--un-équilibre-qui-change-pendant-la-plongée` | Combinaison, gilet, poumons, lestage | non | — (couvert par SchemaBilanForcesArchimede) | — | — |
| n1-barotraumatismes | `un-mécanisme-commun-à-tous-les-barotraumatismes` | Cavités aériennes du plongeur (oreilles, sinus, poumons, masque, dents) | non | SchemaPlancheBarotraumatismes | 1 — silhouette avec toutes les cavités, sens descente/remontée | 1 |
| n1-barotraumatismes | `les-oreilles--le-barotraumatisme-le-plus-fréquent` | Oreille moyenne, tympan, trompe d'Eustache, Valsalva | non | SchemaCoupeOreille | 1 — coupe anatomique, impossible à visualiser par le texte seul | 1 |
| n1-barotraumatismes | `les-sinus-et-les-dents` | Sinus frontaux/maxillaires et canaux | non | SchemaCoupeSinus | 1 — localisation des sinus et de leurs canaux | 1 |
| n1-barotraumatismes | `la-surpression-pulmonaire--rare-mais-gravissime` | Dilatation, déchirure alvéolaire, trajets de l'air | non | SchemaSurpressionPulmonaire | 1 — poumon qui se dilate à la remontée + destinations de l'air | 1 |
| n1-risques-du-plongeur | `lessoufflement--le-cercle-vicieux-du-co₂` | Boucle CO₂ → ventilation superficielle → CO₂ | non | SchemaCercleVicieuxCO2 | 4 + 5 — boucle circulaire avec point de rupture « stop effort + expirer » | 1 |
| n1-risques-du-plongeur | `le-froid--un-ennemi-silencieux` | Voies de perte de chaleur, escalade des signes | non | SchemaDeperditionThermique | 1 + 3 — silhouette (tête, ventilation, extrémités) et gradation des signes | 1 |
| n1-risques-du-plongeur | `lazote--un-invité-qui-sincruste` | Dissolution / bulles (analogie bouteille gazeuse) | non | SchemaHenryBouteilleGazeuse | 2 — bouteille fermée / ouverte lentement / secouée = tissus du plongeur | 1 |
| n1-materiel | `le-détendeur--respirer-à-la-pression-du-fond` | Trajet de l'air : bloc → 1er étage → 2e étage → poumons | non | SchemaCircuitAir (réut. n4-materiel, version avec pressions) | 1 + 2 — chaîne des pressions 200 bar → MP → ambiante | 1 |
| n1-materiel | `le-gilet-stabilisateur-et-le-lestage` | Direct system, purges haute/basse/buccale | non | SchemaCircuitGilet (réut. n2-materiel) | 1 — position des purges = geste de sécurité | 2 |
| n1-signes-communication | `les-signes-indispensables-du-niveau-1` | Signes conventionnels | non | SchemaPlancheSignes | 1 + 5 — un geste se dessine, le tableau textuel de 15 lignes se relit sans cesse | 2 |
| n1-milieu-naturel | `les-bateaux--le-danger-vient-den-haut` | Pavillon Alpha, croix de Saint-André | non | SchemaPavillons | 1 — reconnaissance visuelle des pavillons | 3 |
| n1-prerogatives | `le-brevet-niveau-1-et-laptitude-pe20` | Espaces d'évolution × aptitudes PE/PA | non | SchemaEspacesEvolution | 2 + 4 — coupe verticale 0-60 m croisant profondeurs et aptitudes (schéma le plus rentable du site) | 1 |
| n1-prerogatives | `la-palanquée--votre-cellule-de-plongée` | Effectifs de la palanquée encadrée | non | SchemaCompositionPalanquee (réut. n2-reglementation) | 1 — 4 encadrés + GP en une image | 2 |
| n1-prerogatives | `pa12-et-la-suite--vers-lautonomie` | Parcours N1 → PA12 → N2 | non | SchemaCursusFfessm (réut. mf1) | 4 — arbre du cursus | 3 |

## Niveau 2

| Module | Section (ancre) | Notion | Schéma existant ? | Schéma proposé | Justification (critère 1-5) | Priorité |
|---|---|---|---|---|---|---|
| n2-pression-mariotte | `pression-atmosphérique-relative-absolue` | Les trois pressions, profondeurs repères | non | SchemaEchellePression (réut. n1) | 2 — même échelle 0-60 m, support des calculs | 1 |
| n2-pression-mariotte | `la-loi-de-boyle-mariotte` | P×V constant, ballon aux profondeurs repères | oui-simulateur (SimLoisPhysiques plus bas dans le module) | SchemaMariotteBallon (réut. n1) | 2 + 5 — figure de référence imprimable 0/10/20/30/40 m avec valeurs | 1 |
| n2-pression-mariotte | `la-bouteille-retournée--lexpérience-de-la-cloche-à-air` | Cloche à air | oui-simulateur (SimLoisPhysiques juste après) | — | notion couverte par le simulateur | — |
| n2-archimede | `poids-réel-poussée-poids-apparent` | Bilan des forces, signe du poids apparent | non | SchemaBilanForcesArchimede (réut. n1) | 2 — flèches poids/poussée et les 3 cas | 1 |
| n2-dalton-henry | `la-loi-de-dalton--les-pressions-partielles` | Pp = Pabs × %, surface / 20 m / 40 m | non | SchemaDaltonPressionsPartielles | 2 — barres empilées N₂/O₂ qui grandissent avec la profondeur | 1 |
| n2-dalton-henry | `la-loi-de-henry--la-dissolution-des-gaz` | Saturation, tension, sous/sur-saturation | non | SchemaHenryBouteilleGazeuse (réut. n1, variante T vs Pp) | 2 — analogie bouteille + les 3 états T/Pp | 1 |
| n2-consommation-autonomie | `la-méthode-complète-de-calcul-dautonomie` | Litres disponibles → conso au fond → autonomie | oui-simulateur (SimAutonomie juste après) | SchemaFriseAutonomie | 5 — frise imprimable des 3 étapes avec l'exemple étalon 12 L / 200 bar | 1 |
| n2-barotraumatismes | `loreille--le-barotraumatisme-le-plus-fréquent` | Oreille moyenne, trompe d'Eustache | non | SchemaCoupeOreille (réut. n1) | 1 — coupe anatomique | 1 |
| n2-barotraumatismes | `sinus-dents-et-plaquage-de-masque` | Sinus et canaux | non | SchemaCoupeSinus (réut. n1) | 1 | 2 |
| n2-barotraumatismes | `la-surpression-pulmonaire--laccident-le-plus-grave` | Mécanisme alvéolaire, 3 destinations de l'air | non | SchemaSurpressionPulmonaire (réut. n1, enrichi aéroembolisme) | 1 — plèvre / médiastin / circulation | 1 |
| n2-barotraumatismes | `la-surpression-pulmonaire--laccident-le-plus-grave` | Conduite à tenir SP | non | SchemaCatSurpression | 4 — arbre CAT : sortir → position → O₂ 15 L/min → alerte → évacuation | 1 |
| n2-barotraumatismes | `synthèse-et-réflexes-de-prévention` | Récapitulatif de tous les barotraumatismes | non | SchemaPlancheBarotraumatismes (réut. n1) | 5 — planche de révision | 2 |
| n2-add | `saturation--la-loi-de-henry-appliquée-au-plongeur` | Charge/décharge des tissus | oui-simulateur (SimDesaturation) | — | notion couverte par le simulateur | — |
| n2-add | `le-mécanisme-de-laccident--la-formation-des-bulles` | Formation des bulles + délais d'apparition | non | SchemaBullesADD | 1 + 3 — bulle dans le vaisseau (obstruction/compression) + frise des délais (minutes → 24 h) | 1 |
| n2-add | `la-conduite-à-tenir--chaque-minute-compte` | CAT ADD en 6 étapes | non | SchemaCatADD | 4 — arbre : O₂ 15 L/min, eau, aspirine (protocole), alerte, évacuation, interdits | 1 |
| n2-autres-accidents | `lessoufflement-et-le-cercle-vicieux-du-co₂` | Cercle vicieux du CO₂ | non | SchemaCercleVicieuxCO2 (réut. n1) | 4 | 1 |
| n2-autres-accidents | `lessoufflement-et-le-cercle-vicieux-du-co₂` | CAT essoufflement (soi / équipier) | non | SchemaCatEssoufflement | 4 — arbre : stop effort → expirer → signaler → remonter doucement → fin de plongée | 1 |
| n2-autres-accidents | `le-froid` | Pertes de chaleur, signes de gravité | non | SchemaDeperditionThermique (réut. n1) | 1 + 3 | 2 |
| n2-autres-accidents | `hydrocution-et-noyade` | Stades de la noyade + CAT | non | SchemaCatNoyade | 3 + 4 — gradation aquastress → anoxique et arbre de prise en charge (O₂, RCP, alerte) | 1 |
| n2-tables-mn90 | `doù-viennent-les-tables-mn90-et-quand-sappliquent-elles` | Vocabulaire : durée, profondeur max, DTR, GPS, vitesses | non | SchemaProfilPlongeeAnnote | 3 — profil de plongée annoté, socle de tous les exercices | 1 |
| n2-tables-mn90 | `lire-une-plongée-simple-pas-à-pas` | Lecture de la table (entrées, arrondis, sorties) | oui-simulateur (SimTables juste après) | SchemaAnatomieTableMN90 | 5 — lecture annotée pas à pas, imprimable : la valeur ajoutée face au simulateur | 1 |
| n2-tables-mn90 | `la-courbe-de-sécurité` | Couples profondeur/durée sans palier | non | SchemaCourbeSecurite | 2 — courbe profondeur × durée, la chute 40 min → 5 min devient visible | 1 |
| n2-tables-mn90 | `la-plongée-successive--intervalle-azote-résiduel-majoration` | Intervalle, GPS, azote résiduel, majoration | non | SchemaFriseSuccessive | 3 — frise chronologique : plongée 1 → GPS → intervalle → tableau II → tableau III → durée fictive | 1 |
| n2-tables-mn90 | `la-plongée-consécutive--moins-de-15-minutes-dintervalle` | Consécutive vs successive vs simple | non | SchemaConsecutiveVsSuccessive | 3 — deux profils comparés selon l'intervalle (< 15 min / 15 min-12 h / > 12 h) | 1 |
| n2-tables-mn90 | `les-remontées-anormales--lente-et-rapide` | Procédure remontée rapide | non | SchemaLogigrammeRemonteeRapide | 4 — logigramme : 3 min ? → mi-profondeur 5 min → paliers recalculés / sinon CAT ADD | 1 |
| n2-tables-mn90 | `le-palier-interrompu` | Procédure palier interrompu | non | SchemaLogigrammePalierInterrompu | 4 — logigramme : redescendre < 3 min, refaire le palier en entier / sinon CAT ADD | 1 |
| n2-materiel | `le-détendeur--principe-des-deux-étages` | Chaîne des pressions HP → MP → ambiante | non | SchemaCircuitAir (réut. n4-materiel enrichi) | 1 + 2 | 1 |
| n2-materiel | `le-détendeur--principe-des-deux-étages` | Mécanisme du 2e étage (membrane, levier, clapet) | non | SchemaCoupeDeuxiemeEtage | 1 — le fonctionnement « à la demande » décrit sur 5 lignes devient une coupe | 1 |
| n2-materiel | `pannes-du-détendeur-et-conduite-à-tenir` | Débit continu, fuite, panne d'air : conduite | non | SchemaLogigrammePanneAir | 4 — arbre : type de panne → respirer sur débit / air de l'équipier → remontée | 1 |
| n2-materiel | `le-bloc--fabrication-et-marquages` | Marquages gravés, robinetterie | non | SchemaBlocRobinetterie | 1 — bloc annoté (PS, PE, volume, poinçons) + robinetterie | 1 |
| n2-materiel | `le-gilet-stabilisateur` | Direct system, purges, point haut | non | SchemaCircuitGilet | 1 — circuit du gilet et règle du point haut | 1 |
| n2-materiel | `les-instruments-du-plongeur-autonome` | Équipement PA20 complet | non (SimAutonomie présent mais autre notion) | SchemaInstruments | 1 + 5 — plongeur équipé annoté : 2 sorties/2 détendeurs, mano, ordinateur, parachute | 1 |
| n2-reglementation | `les-prérogatives-du-niveau-2--pa20-et-pe40` | Espaces × aptitudes PA20/PE40 | non | SchemaEspacesEvolution (réut. n1) | 2 + 4 | 1 |
| n2-reglementation | `la-palanquée-et-le-directeur-de-plongée` | Effectifs encadrée (4+GP) vs autonome (3) | non | SchemaCompositionPalanquee | 1 — piège d'examen classique rendu visible | 1 |
| n2-reglementation | `le-matériel-obligatoire` | Matériel encadré / autonome / site | non | SchemaMaterielObligatoire | 5 — trois colonnes visuelles (encadré, autonome, DP/site) | 1 |
| n2-orientation-milieu | `lorientation-avec-instruments--le-compas` | Cap, ligne de foi, cap inverse ±180° | non | SchemaCapInverse | 1 — rose des caps, tenue du compas | 3 |
| n2-orientation-milieu | `matelotage--les-nœuds-et-le-mouillage` | Nœuds usuels | non | SchemaNoeudsMarins | 1 + 5 — un nœud ne s'apprend pas en prose | 2 |

## Niveau 3

| Module | Section (ancre) | Notion | Schéma existant ? | Schéma proposé | Justification (critère 1-5) | Priorité |
|---|---|---|---|---|---|---|
| n3-physique-appliquee | `pressions--les-fondations-du-raisonnement` | Pressions jusqu'à 60 m / 7 bar | non | SchemaEchellePression (réut.) | 2 — même échelle, zone 40-60 m mise en avant | 2 |
| n3-physique-appliquee | `archimède--flottabilité-lestage-et-levage` | Relevage au parachute | oui-simulateur (SimLoisPhysiques en fin de module, autre notion) | SchemaRelevageParachute (réut. n4) | 2 — forces sur la charge + dilatation à la remontée | 3 |
| n3-planification-air | `chiffrer-le-profil-complet--lexemple-corrigé-de-référence` | Budget d'air complet : fond + remontée + palier + réserve | oui-simulateur (SimAutonomie juste après) | SchemaFriseAutonomie (réut. n2, variante « profil complet » avec déco et pression de demi-tour) | 3 + 5 — le calcul de référence en une frise annotée sur le profil | 1 |
| n3-tables-avancees | `plongée-simple--lecture-experte-et-dtr` | Chronométrage immersion → sortie, DTR | non | SchemaProfilPlongeeAnnote (réut. n2) | 3 | 2 |
| n3-tables-avancees | `plongée-successive--la-méthode-des-deux-tableaux` | Les 4 lectures et les 4 arrondis | oui-simulateur (SimTables juste après) | SchemaFriseSuccessive (réut. n2) | 3 — cœur de l'examen N3 | 1 |
| n3-tables-avancees | `la-plongée-consécutive` | Classement par intervalle de surface | non | SchemaConsecutiveVsSuccessive (réut. n2) | 3 | 2 |
| n3-tables-avancees | `remontée-rapide--la-procédure-exacte` | Procédure mi-profondeur / 3 min / 5 min | non | SchemaLogigrammeRemonteeRapide (réut. n2) | 4 | 1 |
| n3-tables-avancees | `remontée-lente-et-palier-interrompu` | Palier interrompu | non | SchemaLogigrammePalierInterrompu (réut. n2) | 4 | 2 |
| n3-ordinateurs | `ce-que-calcule-un-ordinateur--la-décompression-en-temps-réel` | Compartiments et périodes | non | SchemaCompartimentsPeriodes | 2 — jeu de compartiments 5 → 120 min qui se chargent à des vitesses différentes | 1 |
| n3-ordinateurs | `les-gradient-factors-en-notion` | GF bas / GF haut | non | SchemaGradientFactors | 2 — droites de sursaturation tolérée | 3 |
| n3-ordinateurs | `ordinateur-et-tables--deux-logiques-à-ne-pas-mélanger` | Profil carré vs profil réel | non | SchemaTableVsOrdinateur | 2 — deux profils superposés sur la même plongée | 1 |
| n3-ordinateurs | `successives-désaturation-résiduelle-et-avion` | Charge/décharge des compartiments | oui-simulateur (SimDesaturation en fin de module) | — | notion couverte par le simulateur | — |
| n3-accidents-secours | `la-conduite-à-tenir--un-déroulé-unique` | Déroulé protéger-examiner-oxygéner-alerter-surveiller | non | SchemaCatADD (réut. n2, variante « palanquée autonome ») | 4 | 1 |
| n3-accidents-secours | `loxygénothérapie-normobare--le-matériel` | Kit O₂ : bouteille, manodétendeur, masque HC, BAVU | non | SchemaOxygenotherapie | 1 — montage du kit, à refaire de mémoire sous stress | 2 |
| n3-accidents-secours | `la-chaîne-des-secours-et-lévacuation` | Palanquée → CROSS/SAMU → évacuation → caisson | non | SchemaChaineAlerte | 4 — chaîne d'alerte avec canaux (VHF 16, 196, 15/112) | 1 |
| n3-materiel-entretien | `le-parc-du-plongeur-autonome--ce-que-la-réglementation-impose` | Matériel obligatoire de l'autonome | non | SchemaMaterielObligatoire (réut. n2) | 5 | 2 |
| n3-materiel-entretien | `les-blocs--identification-et-marquages` | Marquages, PS/PE | non | SchemaBlocRobinetterie (réut. n2) | 1 | 2 |
| n3-materiel-entretien | `le-gonflage--stations-compresseurs-et-air-respirable` | Chaîne de gonflage et filtration | non | SchemaCompresseurEtages (réut. n4) | 1 | 3 |
| n3-reglementation | `aptitudes-et-brevets--où-se-situe-le-n3` | PA60 dans les espaces d'évolution | non | SchemaEspacesEvolution (réut.) | 2 + 4 | 1 |

## Niveau 4

| Module | Section (ancre) | Notion | Schéma existant ? | Schéma proposé | Justification (critère 1-5) | Priorité |
|---|---|---|---|---|---|---|
| n4-pressions-gaz | `rappel-des-pressions-et-unités` | Trois pressions, conversions | non | SchemaEchellePression (réut.) | 2 | 2 |
| n4-pressions-gaz | `la-loi-de-boyle-mariotte-et-sa-démonstration` | Cloche / volumes aux profondeurs repères | non | SchemaMariotteBallon (réut.) | 2 | 2 |
| n4-pressions-gaz | `la-loi-de-dalton-et-les-pressions-partielles` | Pp et seuils (narcose, hyperoxie, MOD nitrox) | non | SchemaDaltonPressionsPartielles (réut. n2, variante avec seuils) | 2 — barres empilées + lignes de seuil 3,2 b et 1,6 b | 1 |
| n4-pressions-gaz | `la-loi-de-henry-et-la-désaturation` | Tension / saturation / sursaturation | oui-simulateur (SimLoisPhysiques juste après, autre notion) | SchemaHenryBouteilleGazeuse (réut.) | 2 | 2 |
| n4-flottabilite-optique-acoustique | `le-théorème-darchimède` | Poussée, poids apparent | non | SchemaBilanForcesArchimede (réut.) | 2 | 1 |
| n4-flottabilite-optique-acoustique | `relevage-dun-objet-immergé` | Relevage : forces + dilatation du parachute | non | SchemaRelevageParachute | 1 + 2 — exercice de synthèse Archimède × Mariotte | 2 |
| n4-flottabilite-optique-acoustique | `loptique--la-réfraction` | Réfraction : plus gros, plus proche | non | SchemaRefraction | 1 — trajet des rayons à l'interface masque, image virtuelle | 1 |
| n4-flottabilite-optique-acoustique | `champ-visuel-couleurs-et-luminosité` | Absorption sélective des couleurs | non | SchemaAbsorptionCouleurs | 2 — disparition rouge → orange → jaune → vert selon la profondeur | 1 |
| n4-flottabilite-optique-acoustique | `lacoustique--le-son-sous-leau` | Non-localisation des sons | non | — | une phrase suffit, pas de valeur spatiale ajoutée | — |
| n4-anatomie-ventilation | `anatomie-de-lappareil-respiratoire` | Voies aériennes, poumons, plèvre, diaphragme | non | SchemaAppareilRespiratoire | 1 — anatomie exigée à l'examen | 1 |
| n4-anatomie-ventilation | `volumes-et-capacités-pulmonaires` | VC, VRI, VRE, VR, CV, CPT | non | SchemaVolumesPulmonaires | 2 — spirogramme empilé, remplace le tableau de 6 lignes | 2 |
| n4-anatomie-ventilation | `les-échanges-gazeux-et-le-transport-des-gaz` | Alvéole / capillaire, diffusion O₂-CO₂ | non | SchemaAlveoleEchanges | 1 — zoom membrane alvéolo-capillaire avec sens des gaz | 1 |
| n4-anatomie-ventilation | `la-commande-ventilatoire--le-rôle-du-co₂` | Commande par le CO₂, essoufflement, hyperventilation | non | SchemaCercleVicieuxCO2 (réut.) | 4 | 2 |
| n4-circulation-oreille | `les-deux-circulations` | Petite/grande circulation, filtre pulmonaire | non | SchemaDoubleCirculation | 1 — boucle VD→poumons→OG / VG→corps→OD, poumons = filtre à bulles | 1 |
| n4-circulation-oreille | `le-foramen-ovale-perméable` | FOP, shunt droit-gauche, bulles artérialisées | non | SchemaFOP | 1 — cœur en coupe, clapet inter-oreillettes, trajet des bulles | 1 |
| n4-circulation-oreille | `loreille-externe-et-moyenne` (et `loreille-interne--cochlée-et-vestibule`) | Oreille complète : tympan, osselets, trompe, cochlée, vestibule | non | SchemaCoupeOreille (réut. n1, version complète oreille interne) | 1 | 1 |
| n4-accidents | `laccident-de-désaturation--cinétique-des-bulles` | Cinétique des bulles, formes cliniques, délais | non | SchemaBullesADD (réut. n2) | 1 + 3 | 1 |
| n4-accidents | `la-surpression-pulmonaire--mécanisme-alvéolaire` | Déchirure alvéolaire, 3 portes de sortie de l'air | non | SchemaSurpressionPulmonaire (réut.) | 1 | 1 |
| n4-accidents | `lœdème-pulmonaire-dimmersion` | Redistribution sanguine, plasma dans les alvéoles | non | SchemaOPI | 1 — mécanisme non intuitif, distinct de l'essoufflement | 3 |
| n4-accidents | `conduite-à-tenir-et-cadre-réglementaire-du-secours` | Trame commune de CAT | non | SchemaCatADD (réut.) | 4 | 2 |
| n4-tables-tous-cas | `plongée-simple--lecture-complète` | Profil, DTR, heure de sortie | oui-simulateur (SimTables juste après) | SchemaProfilPlongeeAnnote (réut.) | 3 | 2 |
| n4-tables-tous-cas | `plongées-successives--méthode-des-deux-tableaux` | Frise successive | non | SchemaFriseSuccessive (réut.) | 3 | 2 |
| n4-tables-tous-cas | `procédures-de-rattrapage` | Remontée rapide, palier interrompu | non | SchemaLogigrammeRemonteeRapide (réut.) | 4 | 2 |
| n4-tables-tous-cas | `la-plongée-en-altitude` | Profondeur fictive, pression de surface réduite | non | SchemaAltitudeProfondeurFictive | 2 — lac d'altitude vs mer, correction du rapport des pressions | 2 |
| n4-tables-tous-cas | `notions-de-nitrox-et-de-désaturation` | Nitrox / désaturation | oui-simulateur (SimDesaturation juste après) | — | couvert (le seuil MOD est déjà sur SchemaDaltonPressionsPartielles) | — |
| n4-reglementation | `composition-des-palanquées-et-espaces-dévolution` | Espaces 0-6/12/20/40/60 × aptitudes | non | SchemaEspacesEvolution (réut.) | 2 + 4 | 1 |
| n4-reglementation | `composition-des-palanquées-et-espaces-dévolution` | Effectifs des palanquées | non | SchemaCompositionPalanquee (réut. n2) | 1 | 2 |
| n4-reglementation | `matériel-obligatoire-des-plongeurs-et-de-la-sécurité` | Matériel plongeurs + sécurité surface | non | SchemaMaterielObligatoire (réut. n2) | 5 | 2 |
| n4-materiel | `le-détendeur--principe-de-la-détente-en-deux-étages` | Circuit de l'air avec pressions | oui-svg (chaîne bloc→1er→2e étage, sans valeurs) | SchemaCircuitAir (enrichir le SVG : valeurs 200 bar / MP +8-10 bar / ambiante, sorties HP-MP) | 2 — le SVG existant montre la chaîne mais pas les pressions demandées | 1 |
| n4-materiel | `le-détendeur--principe-de-la-détente-en-deux-étages` | Mécanisme du 2e étage | non | SchemaCoupeDeuxiemeEtage (réut. n2) | 1 — membrane / levier / clapet / soupape | 1 |
| n4-materiel | `premier-étage--piston-et-membrane` | Coupes 1er étage piston vs membrane | oui-svg (boîtes très schématiques) | SchemaCoupePremierEtage (remplacement : vraies coupes HP/MP/ressort/eau) | 1 — le SVG actuel ne montre pas le mécanisme réel | 1 |
| n4-materiel | `compensé-ou-non--leffet-de-la-pression-du-bloc` | Compensation | non | — (variante compensée traitée par SchemaCoupePremierEtageCompense en MF1) | — | — |
| n4-materiel | `bloc-robinetterie-et-réglementation` | Marquages, mono/bi-sortie | non | SchemaBlocRobinetterie (réut. n2) | 1 | 2 |
| n4-materiel | `compresseur-et-filtration` | Étages de compression, refroidisseurs, filtration | non | SchemaCompresseurEtages | 1 — chaîne compresseur → filtres → prise d'air au vent | 2 |
| n4-guide-palanquee | `gérer-lair-dune-palanquée` | Panne d'air d'un équipier : procédure | non | SchemaLogigrammePanneAir (réut. n2) | 4 | 2 |
| n4-guide-palanquee | `matelotage-météo-et-marées` | Nœuds de base | non | SchemaNoeudsMarins (réut. n2) | 1 | 3 |

## MF1

| Module | Section (ancre) | Notion | Schéma existant ? | Schéma proposé | Justification (critère 1-5) | Priorité |
|---|---|---|---|---|---|---|
| mf1-decompression | `les-compartiments-et-la-saturation-exponentielle` | Saturation exponentielle par périodes (50/75/87,5 %) | non | SchemaCourbesSaturation (+ SchemaCompartimentsPeriodes réut. n3 en ouverture) | 2 — courbes de charge de compartiments 5/20/120 min, lecture « par moitiés » | 1 |
| mf1-decompression | `le-gradient-et-le-coefficient-de-sursaturation-critique` | Sc, TN₂ ≤ Sc × Pabs, profondeur mini | non | SchemaSursaturationCritique | 2 — graphe tension vs pression ambiante avec droite critique | 1 |
| mf1-decompression | `compartiment-directeur-et-construction-dune-table` | Compartiment directeur qui change | oui-simulateur (SimDesaturation plus bas dans le module) | SchemaCompartimentDirecteur | 2 + 3 — relais tissus rapides → lents selon le profil | 2 |
| mf1-physiologie | `la-régulation-de-la-ventilation` | Centres respiratoires, boucle CO₂ | non | SchemaCercleVicieuxCO2 (réut.) | 4 | 2 |
| mf1-physiologie | `circulation-shunts-et-foramen-ovale-perméable` | Filtre pulmonaire et shunt FOP | non | SchemaDoubleCirculation + SchemaFOP (réut. n4) | 1 | 2 |
| mf1-physiologie | `loreille-interne-en-détail` | Fenêtres ovale/ronde, fistule périlymphatique | non | SchemaCoupeOreille (réut., zoom oreille interne et fenêtres) | 1 | 2 |
| mf1-physique-expert | `pression--la-confusion-fondatrice` | Relative vs absolue | non | SchemaEchellePression (réut.) | 2 — support de la remédiation n°1 | 2 |
| mf1-physique-expert | `boyle-mariotte--démonstration-et-cas-limites` | Mariotte | oui-simulateur (SimLoisPhysiques) | — | couvert | — |
| mf1-materiel-avance | `détendeurs-compensés-et-surcompensés` | Compensation / surcompensation | non | SchemaCoupePremierEtageCompense | 1 + 2 — chambre de compensation, équilibre des forces sur le clapet | 2 |
| mf1-materiel-avance | `le-givrage--mécanisme-et-prévention` | Détente → refroidissement → gel du clapet | non | SchemaGivrage | 1 — localisation du givre et clapet bloqué ouvert | 3 |
| mf1-materiel-avance | `les-recycleurs-notions` | Circuit fermé : chaux, injection O₂ | non | SchemaRecycleur | 1 — boucle de recyclage, notions | 3 |
| mf1-reglementation-structures | `lorganisation-de-la-ffessm` | Clubs → comités → national ; CTN/CTR/CMPN | non | SchemaOrganigrammeFfessm | 4 — organigramme | 2 |
| mf1-reglementation-structures | `cursus-fédéral-et-cursus-professionnel-notions` | N1→N4→MF1→MF2 / BPJEPS-DEJEPS | non | SchemaCursusFfessm | 4 — arbre du cursus, deux voies parallèles avec passerelles | 1 |
| mf1-pedagogie-preparatoire | `structurer-la-séance--les-quatre-temps` | Introduction → développement → synthèse → évaluation | non | SchemaBoucleSeance | 3 + 4 — boucle de séance avec la régulation (évaluation → ajustement) | 1 |
| mf1-pedagogie-pratique | `sécurité-et-organisation-de-latelier` | Placement de l'encadrant / élèves / zone de travail | non | SchemaPositionnementMoniteur | 1 — vue spatiale de l'atelier : voir tous, à portée du travailleur | 1 |
| mf1-pedagogie-organisation | `organiser-une-formation-sur-une-saison` | Progression théorie / fosse-bassin / milieu naturel | non | SchemaProgressionMilieux | 3 — frise de saison croisant les trois milieux | 1 |
| mf1-pedagogie-organisation | `la-taxonomie-de-bloom-appliquée` | Mémoriser → … → créer, calibrage par niveau | non | SchemaTaxonomieBloom | 4 — pyramide avec repères N1/N4/MF1 | 1 |

---

## Synthèse

### Volumétrie

- **66 schémas uniques** proposés, pour environ **110 points d'insertion** (grâce à la réutilisation systématique du même composant entre niveaux).
- Par priorité (priorité la plus haute portée par chaque schéma unique) : **P1 : 50** · **P2 : 10** · **P3 : 6**.

| Domaine | P1 | P2 | P3 | Total |
|---|---|---|---|---|
| Physique | 8 | 1 (SchemaRelevageParachute) | 0 | 9 |
| Physiologie / accidents / secours | 16 | 2 (SchemaVolumesPulmonaires, SchemaOxygenotherapie) | 1 (SchemaOPI) | 19 |
| Tables & décompression | 12 | 2 (SchemaCompartimentDirecteur, SchemaAltitudeProfondeurFictive) | 1 (SchemaGradientFactors) | 15 |
| Réglementation | 4 | 1 (SchemaOrganigrammeFfessm) | 0 | 5 |
| Matériel | 6 | 2 (SchemaCompresseurEtages, SchemaCoupePremierEtageCompense) | 2 (SchemaGivrage, SchemaRecycleur) | 10 |
| Environnement / pratique | 0 | 2 (SchemaPlancheSignes, SchemaNoeudsMarins) | 2 (SchemaPavillons, SchemaCapInverse) | 4 |
| Pédagogie | 4 | 0 | 0 | 4 |
| **Total** | **50** | **10** | **6** | **66** |

### Liste dédupliquée des schémas P1 et leurs points d'insertion

**Physique**
1. **SchemaEchellePression** — n1-flottabilite-pression, n2-pression-mariotte (P1) ; n3-physique-appliquee, n4-pressions-gaz, mf1-physique-expert (réut. P2). Échelle 0-60 m, pressions relative/absolue.
2. **SchemaMariotteBallon** — n1-flottabilite-pression, n2-pression-mariotte (P1) ; n4-pressions-gaz (réut. P2). Ballon à 0/10/20/30/40 m ; complément imprimable de SimLoisPhysiques.
3. **SchemaBilanForcesArchimede** — n1-flottabilite-pression, n2-archimede, n4-flottabilite-optique-acoustique (P1).
4. **SchemaDaltonPressionsPartielles** — n2-dalton-henry, n4-pressions-gaz (P1). Barres empilées + seuils narcose/hyperoxie/MOD.
5. **SchemaHenryBouteilleGazeuse** — n1-risques-du-plongeur, n2-dalton-henry (P1) ; n4-pressions-gaz (réut. P2).
6. **SchemaFriseAutonomie** — n2-consommation-autonomie, n3-planification-air (P1). Frise des 3 étapes, variante N3 avec déco et pression de demi-tour.
7. **SchemaRefraction** — n4-flottabilite-optique-acoustique (P1).
8. **SchemaAbsorptionCouleurs** — n4-flottabilite-optique-acoustique (P1).

**Physiologie / accidents / secours**
9. **SchemaCoupeOreille** — n1-barotraumatismes, n2-barotraumatismes, n4-circulation-oreille (P1) ; mf1-physiologie (zoom fenêtres, P2). Version N4/MF1 avec cochlée/vestibule.
10. **SchemaCoupeSinus** — n1-barotraumatismes (P1) ; n2-barotraumatismes (P2).
11. **SchemaAppareilRespiratoire** — n4-anatomie-ventilation (P1).
12. **SchemaAlveoleEchanges** — n4-anatomie-ventilation (P1).
13. **SchemaDoubleCirculation** — n4-circulation-oreille (P1) ; mf1-physiologie (P2). Petite/grande circulation + filtre pulmonaire.
14. **SchemaFOP** — n4-circulation-oreille (P1) ; mf1-physiologie (P2).
15. **SchemaPlancheBarotraumatismes** — n1-barotraumatismes (P1) ; n2-barotraumatismes (planche de synthèse, P2).
16. **SchemaSurpressionPulmonaire** — n1-barotraumatismes, n2-barotraumatismes, n4-accidents (P1).
17. **SchemaBullesADD** — n2-add, n4-accidents (P1). Bulles (obstruction/compression) + frise chronologique des délais.
18. **SchemaCercleVicieuxCO2** — n1-risques-du-plongeur, n2-autres-accidents (P1) ; n4-anatomie-ventilation, mf1-physiologie (P2).
19. **SchemaDeperditionThermique** — n1-risques-du-plongeur (P1) ; n2-autres-accidents (P2).
20. **SchemaCatADD** — n2-add (P1) ; n3-accidents-secours (variante autonomie, P1) ; n4-accidents (P2).
21. **SchemaCatSurpression** — n2-barotraumatismes (P1).
22. **SchemaCatEssoufflement** — n2-autres-accidents (P1).
23. **SchemaCatNoyade** — n2-autres-accidents (P1).
24. **SchemaChaineAlerte** — n3-accidents-secours (P1).

**Tables & décompression**
25. **SchemaAnatomieTableMN90** — n2-tables-mn90 (P1). Lecture annotée pas à pas, imprimable (valeur ajoutée face à SimTables).
26. **SchemaProfilPlongeeAnnote** — n2-tables-mn90 (P1) ; n3-tables-avancees, n4-tables-tous-cas (P2).
27. **SchemaFriseSuccessive** — n2-tables-mn90, n3-tables-avancees (P1) ; n4-tables-tous-cas (P2).
28. **SchemaConsecutiveVsSuccessive** — n2-tables-mn90 (P1) ; n3-tables-avancees (P2).
29. **SchemaLogigrammeRemonteeRapide** — n2-tables-mn90, n3-tables-avancees (P1) ; n4-tables-tous-cas (P2).
30. **SchemaLogigrammePalierInterrompu** — n2-tables-mn90 (P1) ; n3-tables-avancees (P2).
31. **SchemaLogigrammePanneAir** — n2-materiel (P1) ; n4-guide-palanquee (P2).
32. **SchemaCourbeSecurite** — n2-tables-mn90 (P1).
33. **SchemaCompartimentsPeriodes** — n3-ordinateurs (P1) ; mf1-decompression (réut. en ouverture).
34. **SchemaCourbesSaturation** — mf1-decompression (P1).
35. **SchemaSursaturationCritique** — mf1-decompression (P1).
36. **SchemaTableVsOrdinateur** — n3-ordinateurs (P1). Profil carré vs profil réel.

**Réglementation**
37. **SchemaEspacesEvolution** — n1-prerogatives, n2-reglementation, n3-reglementation, n4-reglementation (P1 partout : le schéma le plus rentable du site, décliné en surlignant le niveau courant).
38. **SchemaCursusFfessm** — mf1-reglementation-structures (P1) ; n1-prerogatives (P3).
39. **SchemaCompositionPalanquee** — n2-reglementation (P1) ; n1-prerogatives, n4-reglementation (P2).
40. **SchemaMaterielObligatoire** — n2-reglementation (P1) ; n3-materiel-entretien, n4-reglementation (P2).

**Matériel**
41. **SchemaCircuitAir** — n4-materiel (P1, enrichissement du SVG existant avec les valeurs de pression) ; n1-materiel, n2-materiel (P1, réut.).
42. **SchemaCoupePremierEtage** — n4-materiel (P1, remplacement du SVG schématique existant).
43. **SchemaCoupeDeuxiemeEtage** — n2-materiel, n4-materiel (P1).
44. **SchemaBlocRobinetterie** — n2-materiel (P1) ; n3-materiel-entretien, n4-materiel (P2).
45. **SchemaCircuitGilet** — n2-materiel (P1) ; n1-materiel (P2).
46. **SchemaInstruments** — n2-materiel (P1).

**Pédagogie**
47. **SchemaBoucleSeance** — mf1-pedagogie-preparatoire (P1).
48. **SchemaTaxonomieBloom** — mf1-pedagogie-organisation (P1).
49. **SchemaPositionnementMoniteur** — mf1-pedagogie-pratique (P1).
50. **SchemaProgressionMilieux** — mf1-pedagogie-organisation (P1).

### Propositions écartées volontairement (et pourquoi)

Doublons de simulateurs (couverture déjà assurée, pas de valeur ajoutée statique) :
- n2-pression-mariotte `la-bouteille-retournée--lexpérience-de-la-cloche-à-air` — SimLoisPhysiques inséré immédiatement après.
- n2-add `saturation--la-loi-de-henry-appliquée-au-plongeur` — SimDesaturation inséré dans la section.
- n3-ordinateurs `successives-désaturation-résiduelle-et-avion` — SimDesaturation en fin de module.
- n4-tables-tous-cas `notions-de-nitrox-et-de-désaturation` — SimDesaturation présent ; le seuil MOD figure déjà sur SchemaDaltonPressionsPartielles.
- mf1-physique-expert `boyle-mariotte--démonstration-et-cas-limites` — SimLoisPhysiques inséré dans la section.

Sections textuelles ou tabulaires qui n'ont pas besoin de schéma :
- Toutes les sections « documents / licence / assurances / responsabilité civile-pénale » (n1-prerogatives, n2/n3/n4-reglementation, mf1-reglementation-structures) — réglementation simple, les tableaux existants suffisent.
- Sections « entretien du matériel » (n1-materiel, n2-materiel, n3-materiel-entretien) — checklists, pas de contenu spatial.
- n1-signes `pourquoi-un-langage-codifié`, `vivre-en-palanquée--...` — principes verbaux.
- n1-milieu-naturel `la-faune--regarder-sans-toucher`, sections écoresponsabilité — le tableau et des photos servent mieux que des schémas.
- n2-orientation-milieu `lorientation-sans-instruments`, `le-milieu-vivant--méditerranée-et-atlantique` — listes de repères et d'espèces (photos plus pertinentes) ; mouillage « 3 × hauteur d'eau » tient en une phrase.
- n2-dalton-henry `dalton-appliquée--narcose-toxicité-de-loxygène-essoufflement` et sections narcose (n2-autres-accidents, n4-accidents) — les seuils sont déjà portés par SchemaDaltonPressionsPartielles ; la narcose n'a pas de support spatial.
- n2-autres-accidents `hyperoxie-et-hypoxie--...` et hydrocution — seuils et listes de facteurs, pas de mécanisme dessinable utile.
- n4-flottabilite-optique-acoustique `lacoustique--le-son-sous-leau` — le message « on entend mais on ne localise pas » tient en une phrase.
- n4-pressions-gaz `compressibilité-gonflage-et-transvasement` — formule de conservation, un schéma n'apporterait rien au calcul.
- n4-guide-palanquee `le-briefing-type`, `orientation-et-surveillance-en-immersion` — listes de briefing déjà synthétisées en Memo.
- n3-reglementation `le-n3-hors-structure--...`, `les-assurances--...` — argumentaires juridiques.
- n3-tables-avancees `plongées-inversées-profils-à-risque-et-bonnes-pratiques` — règle de bon sens, pas de procédure à arborer.
- mf1-physique-expert `le-catalogue-des-erreurs-et-la-posture-du-moniteur` — remédiation verbale.
- mf1-pedagogie-preparatoire `formuler-des-objectifs-opérationnels` (formule en 3 éléments = texte court), `choisir-les-supports`, `un-plan-de-cours-n2-complet` (est déjà un plan).
- mf1-pedagogie-pratique `la-progression-complète-du-vidage-de-masque`, `diagnostiquer-et-remédier-...` — étapes et critères textuels efficaces tels quels.
- mf1-pedagogie-organisation `trois-fonctions-de-lévaluation`, `grilles-dévaluation-et-biais`, `gérer-un-groupe-hétérogène` — typologies verbales.
- mf1-decompression `le-problème-posé-par-la-désaturation`, `enseigner-la-désaturation` — introduction et discours pédagogique.
- n4-materiel `compensé-ou-non--leffet-de-la-pression-du-bloc` — la variante compensée est portée par SchemaCoupePremierEtageCompense (MF1) ; doubler au N4 serait redondant avec SchemaCoupePremierEtage.
