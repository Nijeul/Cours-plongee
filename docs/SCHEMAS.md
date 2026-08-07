# Registre des schémas pédagogiques

Généré depuis les sorties structurées des agents de production (phase 3). Chaque schéma est un composant SVG statique de `components/schemas/<domaine>/`, exporté par `components/schemas/index.ts` et utilisable tel quel dans les cours MDX (enveloppé dans `<Figure>`).

## Physique (`components/schemas/physique/`)

| Export | Fichier | Titre | Prop `level` | Modules utilisateurs |
|---|---|---|---|---|
| `SchemaEchellePression` | `components/schemas/physique/echelle-pression.tsx` | Échelle des pressions (0-60 m) | — | `n1-flottabilite-pression`, `n2-pression-mariotte`, `n3-physique-appliquee`, `n4-pressions-gaz`, `mf1-physique-expert` |
| `SchemaMariotteBallon` | `components/schemas/physique/mariotte-ballon.tsx` | Boyle-Mariotte : le ballon de 6 L aux profondeurs repères | — | `n1-flottabilite-pression`, `n2-pression-mariotte`, `n4-pressions-gaz` |
| `SchemaBilanForcesArchimede` | `components/schemas/physique/bilan-forces-archimede.tsx` | Bilan des forces : les trois flottabilités | — | `n1-flottabilite-pression`, `n2-archimede`, `n4-flottabilite-optique-acoustique` |
| `SchemaDaltonPressionsPartielles` | `components/schemas/physique/dalton-pressions-partielles.tsx` | Dalton : pressions partielles N₂/O₂ et seuils | — | `n2-dalton-henry`, `n4-pressions-gaz` |
| `SchemaHenryBouteilleGazeuse` | `components/schemas/physique/henry-bouteille-gazeuse.tsx` | Henry : l'analogie de la bouteille d'eau gazeuse | — | `n1-risques-du-plongeur`, `n2-dalton-henry`, `n4-pressions-gaz` |
| `SchemaFriseAutonomie` | `components/schemas/physique/frise-autonomie.tsx` | Autonomie en air : la méthode en 3 étapes | oui | `n2-consommation-autonomie`, `n3-planification-air` |
| `SchemaRefraction` | `components/schemas/physique/refraction.tsx` | La réfraction : plus gros et plus près | — | `n4-flottabilite-optique-acoustique` |
| `SchemaAbsorptionCouleurs` | `components/schemas/physique/absorption-couleurs.tsx` | L'absorption des couleurs selon la profondeur | — | `n4-flottabilite-optique-acoustique` |

## Physiologie, accidents & secours (`components/schemas/physiologie/`)

| Export | Fichier | Titre | Prop `level` | Modules utilisateurs |
|---|---|---|---|---|
| `SchemaCoupeOreille` | `components/schemas/physiologie/coupe-oreille.tsx` | Coupe de l'oreille | oui | `n1-barotraumatismes`, `n2-barotraumatismes`, `n4-circulation-oreille`, `mf1-physiologie` |
| `SchemaCoupeSinus` | `components/schemas/physiologie/coupe-sinus.tsx` | Les sinus et leurs canaux | — | `n1-barotraumatismes`, `n2-barotraumatismes` |
| `SchemaAppareilRespiratoire` | `components/schemas/physiologie/appareil-respiratoire.tsx` | L'appareil respiratoire | — | `n4-anatomie-ventilation` |
| `SchemaAlveoleEchanges` | `components/schemas/physiologie/alveole-echanges.tsx` | Échanges gazeux alvéole-capillaire | — | `n4-anatomie-ventilation` |
| `SchemaDoubleCirculation` | `components/schemas/physiologie/double-circulation.tsx` | Les deux circulations | — | `n4-circulation-oreille`, `mf1-physiologie` |
| `SchemaFOP` | `components/schemas/physiologie/fop.tsx` | Le foramen ovale perméable | — | `n4-circulation-oreille`, `mf1-physiologie` |
| `SchemaPlancheBarotraumatismes` | `components/schemas/physiologie/planche-barotraumatismes.tsx` | Planche des barotraumatismes | — | `n1-barotraumatismes`, `n2-barotraumatismes` |
| `SchemaSurpressionPulmonaire` | `components/schemas/physiologie/surpression-pulmonaire.tsx` | La surpression pulmonaire | — | `n1-barotraumatismes`, `n2-barotraumatismes`, `n4-accidents` |
| `SchemaBullesADD` | `components/schemas/physiologie/bulles-add.tsx` | Bulles d'ADD : mécanismes et délais | — | `n2-add`, `n4-accidents` |
| `SchemaCercleVicieuxCO2` | `components/schemas/physiologie/cercle-vicieux-co2.tsx` | Le cercle vicieux du CO₂ | — | `n1-risques-du-plongeur`, `n2-autres-accidents`, `n4-anatomie-ventilation`, `mf1-physiologie` |
| `SchemaDeperditionThermique` | `components/schemas/physiologie/deperdition-thermique.tsx` | La déperdition thermique | — | `n1-risques-du-plongeur`, `n2-autres-accidents` |
| `SchemaCatADD` | `components/schemas/physiologie/cat-add.tsx` | CAT : accident de désaturation | oui | `n2-add`, `n3-accidents-secours`, `n4-accidents` |
| `SchemaCatSurpression` | `components/schemas/physiologie/cat-surpression.tsx` | CAT : surpression pulmonaire | — | `n2-barotraumatismes` |
| `SchemaCatEssoufflement` | `components/schemas/physiologie/cat-essoufflement.tsx` | CAT : essoufflement | — | `n2-autres-accidents` |
| `SchemaCatNoyade` | `components/schemas/physiologie/cat-noyade.tsx` | CAT : noyade | — | `n2-autres-accidents` |
| `SchemaChaineAlerte` | `components/schemas/physiologie/chaine-alerte.tsx` | La chaîne des secours | — | `n3-accidents-secours` |

## Tables & décompression (`components/schemas/tables/`)

| Export | Fichier | Titre | Prop `level` | Modules utilisateurs |
|---|---|---|---|---|
| `SchemaAnatomieTableMN90` | `components/schemas/tables/anatomie-table-mn90.tsx` | Lire la table MN90 en quatre étapes | — | `n2-tables-mn90` |
| `SchemaProfilPlongeeAnnote` | `components/schemas/tables/profil-plongee-annote.tsx` | Profil de plongée annoté : durée de plongée, DTR, durée totale | — | `n2-tables-mn90`, `n3-tables-avancees`, `n4-tables-tous-cas` |
| `SchemaFriseSuccessive` | `components/schemas/tables/frise-successive.tsx` | La plongée successive en cinq étapes | — | `n2-tables-mn90`, `n3-tables-avancees`, `n4-tables-tous-cas` |
| `SchemaConsecutiveVsSuccessive` | `components/schemas/tables/consecutive-vs-successive.tsx` | Consécutive ou successive : l'intervalle de surface décide | — | `n2-tables-mn90`, `n3-tables-avancees` |
| `SchemaLogigrammeRemonteeRapide` | `components/schemas/tables/logigramme-remontee-rapide.tsx` | Procédure de rattrapage après une remontée rapide | — | `n2-tables-mn90`, `n3-tables-avancees`, `n4-tables-tous-cas` |
| `SchemaLogigrammePalierInterrompu` | `components/schemas/tables/logigramme-palier-interrompu.tsx` | Procédure du palier interrompu | — | `n2-tables-mn90`, `n3-tables-avancees` |
| `SchemaLogigrammePanneAir` | `components/schemas/tables/logigramme-panne-air.tsx` | Panne d'air : la réponse de la palanquée | — | `n2-materiel`, `n4-guide-palanquee` |
| `SchemaCourbeSecurite` | `components/schemas/tables/courbe-securite.tsx` | La courbe de sécurité : plonger sans palier obligatoire | — | `n2-tables-mn90` |
| `SchemaCompartimentsPeriodes` | `components/schemas/tables/compartiments-periodes.tsx` | Compartiments et périodes : des vitesses de saturation différentes | — | `n3-ordinateurs`, `mf1-decompression` |
| `SchemaCourbesSaturation` | `components/schemas/tables/courbes-saturation.tsx` | Saturation et désaturation exponentielles par périodes | — | `mf1-decompression` |
| `SchemaSursaturationCritique` | `components/schemas/tables/sursaturation-critique.tsx` | La sursaturation critique : jusqu'où peut-on remonter ? | — | `mf1-decompression` |
| `SchemaTableVsOrdinateur` | `components/schemas/tables/table-vs-ordinateur.tsx` | Profil carré des tables contre profil réel de l'ordinateur | — | `n3-ordinateurs` |

## Réglementation & prérogatives (`components/schemas/reglementation/`)

| Export | Fichier | Titre | Prop `level` | Modules utilisateurs |
|---|---|---|---|---|
| `SchemaEspacesEvolution` | `components/schemas/reglementation/espaces-evolution.tsx` | Espaces d'évolution et aptitudes PE/PA | oui | `n1-prerogatives`, `n2-reglementation`, `n3-reglementation`, `n4-reglementation` |
| `SchemaCursusFfessm` | `components/schemas/reglementation/cursus-ffessm.tsx` | Cursus FFESSM : brevets, encadrement fédéral et voie professionnelle | — | `mf1-reglementation-structures`, `n1-prerogatives` |
| `SchemaCompositionPalanquee` | `components/schemas/reglementation/composition-palanquee.tsx` | Composition des palanquées : encadrée vs autonome | — | `n2-reglementation`, `n1-prerogatives`, `n4-reglementation` |
| `SchemaMaterielObligatoire` | `components/schemas/reglementation/materiel-obligatoire.tsx` | Matériel obligatoire : plongeur encadré vs plongeur autonome | — | `n2-reglementation`, `n3-materiel-entretien`, `n4-reglementation` |

## Matériel (`components/schemas/materiel/`)

| Export | Fichier | Titre | Prop `level` | Modules utilisateurs |
|---|---|---|---|---|
| `SchemaCircuitAir` | `components/schemas/materiel/circuit-air.tsx` | Circuit de l'air : du bloc au plongeur | oui | `n4-materiel`, `n2-materiel`, `n1-materiel` |
| `SchemaCoupePremierEtage` | `components/schemas/materiel/coupe-premier-etage.tsx` | Premier étage : coupes piston et membrane | — | `n4-materiel` |
| `SchemaCoupeDeuxiemeEtage` | `components/schemas/materiel/coupe-deuxieme-etage.tsx` | Deuxième étage : membrane, levier, clapet | — | `n2-materiel`, `n4-materiel` |
| `SchemaBlocRobinetterie` | `components/schemas/materiel/bloc-robinetterie.tsx` | Bloc et robinetterie : marquages réglementaires | — | `n2-materiel`, `n3-materiel-entretien`, `n4-materiel` |
| `SchemaCircuitGilet` | `components/schemas/materiel/circuit-gilet.tsx` | Circuit du gilet : direct system et purges | — | `n2-materiel`, `n1-materiel` |
| `SchemaInstruments` | `components/schemas/materiel/instruments.tsx` | Les instruments du plongeur autonome | — | `n2-materiel` |

## Pédagogie (MF1) (`components/schemas/pedagogie/`)

| Export | Fichier | Titre | Prop `level` | Modules utilisateurs |
|---|---|---|---|---|
| `SchemaBoucleSeance` | `/home/user/Cours-plongee/components/schemas/pedagogie/boucle-seance.tsx` | Boucle pédagogique de la séance | — | `mf1-pedagogie-preparatoire` |
| `SchemaTaxonomieBloom` | `/home/user/Cours-plongee/components/schemas/pedagogie/taxonomie-bloom.tsx` | Taxonomie de Bloom appliquée à la plongée | — | `mf1-pedagogie-organisation` |
| `SchemaPositionnementMoniteur` | `/home/user/Cours-plongee/components/schemas/pedagogie/positionnement-moniteur.tsx` | Positionnement du moniteur en atelier | — | `mf1-pedagogie-pratique` |
| `SchemaProgressionMilieux` | `/home/user/Cours-plongee/components/schemas/pedagogie/progression-milieux.tsx` | Progression d'une compétence à travers les milieux | — | `mf1-pedagogie-organisation` |

---

**Total : 50 schémas, 102 insertions dans les cours.**
