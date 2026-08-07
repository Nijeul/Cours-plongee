import type { ComponentType } from "react";

import * as Schemas from "@/components/schemas";

/** Entrée du registre : un schéma pédagogique et les modules qui l'utilisent. */
export interface SchemaRegistryEntry {
  exportName: string;
  titre: string;
  hasLevelProp: boolean;
  modules: string[];
  Component: ComponentType<Record<string, never>>;
}

export interface SchemaRegistryDomain {
  domaine: string;
  entries: SchemaRegistryEntry[];
}

/**
 * Registre généré depuis les sorties structurées des agents de production
 * (voir docs/SCHEMAS.md). Ordre : domaines du cursus, puis ordre de
 * production dans chaque domaine.
 */
export const SCHEMA_REGISTRY: SchemaRegistryDomain[] = [
  {
    domaine: "Physique",
    entries: [
      {
        exportName: "SchemaEchellePression",
        titre: "Échelle des pressions (0-60 m)",
        hasLevelProp: false,
        modules: ["n1-flottabilite-pression","n2-pression-mariotte","n3-physique-appliquee","n4-pressions-gaz","mf1-physique-expert"],
        Component: Schemas.SchemaEchellePression as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaMariotteBallon",
        titre: "Boyle-Mariotte : le ballon de 6 L aux profondeurs repères",
        hasLevelProp: false,
        modules: ["n1-flottabilite-pression","n2-pression-mariotte","n4-pressions-gaz"],
        Component: Schemas.SchemaMariotteBallon as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaBilanForcesArchimede",
        titre: "Bilan des forces : les trois flottabilités",
        hasLevelProp: false,
        modules: ["n1-flottabilite-pression","n2-archimede","n4-flottabilite-optique-acoustique"],
        Component: Schemas.SchemaBilanForcesArchimede as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaDaltonPressionsPartielles",
        titre: "Dalton : pressions partielles N₂/O₂ et seuils",
        hasLevelProp: false,
        modules: ["n2-dalton-henry","n4-pressions-gaz"],
        Component: Schemas.SchemaDaltonPressionsPartielles as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaHenryBouteilleGazeuse",
        titre: "Henry : l'analogie de la bouteille d'eau gazeuse",
        hasLevelProp: false,
        modules: ["n1-risques-du-plongeur","n2-dalton-henry","n4-pressions-gaz"],
        Component: Schemas.SchemaHenryBouteilleGazeuse as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaFriseAutonomie",
        titre: "Autonomie en air : la méthode en 3 étapes",
        hasLevelProp: true,
        modules: ["n2-consommation-autonomie","n3-planification-air"],
        Component: Schemas.SchemaFriseAutonomie as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaRefraction",
        titre: "La réfraction : plus gros et plus près",
        hasLevelProp: false,
        modules: ["n4-flottabilite-optique-acoustique"],
        Component: Schemas.SchemaRefraction as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaAbsorptionCouleurs",
        titre: "L'absorption des couleurs selon la profondeur",
        hasLevelProp: false,
        modules: ["n4-flottabilite-optique-acoustique"],
        Component: Schemas.SchemaAbsorptionCouleurs as ComponentType<Record<string, never>>,
      },
    ],
  },
  {
    domaine: "Physiologie, accidents et secours",
    entries: [
      {
        exportName: "SchemaCoupeOreille",
        titre: "Coupe de l'oreille",
        hasLevelProp: true,
        modules: ["n1-barotraumatismes","n2-barotraumatismes","n4-circulation-oreille","mf1-physiologie"],
        Component: Schemas.SchemaCoupeOreille as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaCoupeSinus",
        titre: "Les sinus et leurs canaux",
        hasLevelProp: false,
        modules: ["n1-barotraumatismes","n2-barotraumatismes"],
        Component: Schemas.SchemaCoupeSinus as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaAppareilRespiratoire",
        titre: "L'appareil respiratoire",
        hasLevelProp: false,
        modules: ["n4-anatomie-ventilation"],
        Component: Schemas.SchemaAppareilRespiratoire as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaAlveoleEchanges",
        titre: "Échanges gazeux alvéole-capillaire",
        hasLevelProp: false,
        modules: ["n4-anatomie-ventilation"],
        Component: Schemas.SchemaAlveoleEchanges as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaDoubleCirculation",
        titre: "Les deux circulations",
        hasLevelProp: false,
        modules: ["n4-circulation-oreille","mf1-physiologie"],
        Component: Schemas.SchemaDoubleCirculation as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaFOP",
        titre: "Le foramen ovale perméable",
        hasLevelProp: false,
        modules: ["n4-circulation-oreille","mf1-physiologie"],
        Component: Schemas.SchemaFOP as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaPlancheBarotraumatismes",
        titre: "Planche des barotraumatismes",
        hasLevelProp: false,
        modules: ["n1-barotraumatismes","n2-barotraumatismes"],
        Component: Schemas.SchemaPlancheBarotraumatismes as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaSurpressionPulmonaire",
        titre: "La surpression pulmonaire",
        hasLevelProp: false,
        modules: ["n1-barotraumatismes","n2-barotraumatismes","n4-accidents"],
        Component: Schemas.SchemaSurpressionPulmonaire as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaBullesADD",
        titre: "Bulles d'ADD : mécanismes et délais",
        hasLevelProp: false,
        modules: ["n2-add","n4-accidents"],
        Component: Schemas.SchemaBullesADD as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaCercleVicieuxCO2",
        titre: "Le cercle vicieux du CO₂",
        hasLevelProp: false,
        modules: ["n1-risques-du-plongeur","n2-autres-accidents","n4-anatomie-ventilation","mf1-physiologie"],
        Component: Schemas.SchemaCercleVicieuxCO2 as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaDeperditionThermique",
        titre: "La déperdition thermique",
        hasLevelProp: false,
        modules: ["n1-risques-du-plongeur","n2-autres-accidents"],
        Component: Schemas.SchemaDeperditionThermique as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaCatADD",
        titre: "CAT : accident de désaturation",
        hasLevelProp: true,
        modules: ["n2-add","n3-accidents-secours","n4-accidents"],
        Component: Schemas.SchemaCatADD as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaCatSurpression",
        titre: "CAT : surpression pulmonaire",
        hasLevelProp: false,
        modules: ["n2-barotraumatismes"],
        Component: Schemas.SchemaCatSurpression as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaCatEssoufflement",
        titre: "CAT : essoufflement",
        hasLevelProp: false,
        modules: ["n2-autres-accidents"],
        Component: Schemas.SchemaCatEssoufflement as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaCatNoyade",
        titre: "CAT : noyade",
        hasLevelProp: false,
        modules: ["n2-autres-accidents"],
        Component: Schemas.SchemaCatNoyade as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaChaineAlerte",
        titre: "La chaîne des secours",
        hasLevelProp: false,
        modules: ["n3-accidents-secours"],
        Component: Schemas.SchemaChaineAlerte as ComponentType<Record<string, never>>,
      },
    ],
  },
  {
    domaine: "Tables et décompression",
    entries: [
      {
        exportName: "SchemaAnatomieTableMN90",
        titre: "Lire la table MN90 en quatre étapes",
        hasLevelProp: false,
        modules: ["n2-tables-mn90"],
        Component: Schemas.SchemaAnatomieTableMN90 as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaProfilPlongeeAnnote",
        titre: "Profil de plongée annoté : durée de plongée, DTR, durée totale",
        hasLevelProp: false,
        modules: ["n2-tables-mn90","n3-tables-avancees","n4-tables-tous-cas"],
        Component: Schemas.SchemaProfilPlongeeAnnote as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaFriseSuccessive",
        titre: "La plongée successive en cinq étapes",
        hasLevelProp: false,
        modules: ["n2-tables-mn90","n3-tables-avancees","n4-tables-tous-cas"],
        Component: Schemas.SchemaFriseSuccessive as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaConsecutiveVsSuccessive",
        titre: "Consécutive ou successive : l'intervalle de surface décide",
        hasLevelProp: false,
        modules: ["n2-tables-mn90","n3-tables-avancees"],
        Component: Schemas.SchemaConsecutiveVsSuccessive as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaLogigrammeRemonteeRapide",
        titre: "Procédure de rattrapage après une remontée rapide",
        hasLevelProp: false,
        modules: ["n2-tables-mn90","n3-tables-avancees","n4-tables-tous-cas"],
        Component: Schemas.SchemaLogigrammeRemonteeRapide as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaLogigrammePalierInterrompu",
        titre: "Procédure du palier interrompu",
        hasLevelProp: false,
        modules: ["n2-tables-mn90","n3-tables-avancees"],
        Component: Schemas.SchemaLogigrammePalierInterrompu as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaLogigrammePanneAir",
        titre: "Panne d'air : la réponse de la palanquée",
        hasLevelProp: false,
        modules: ["n2-materiel","n4-guide-palanquee"],
        Component: Schemas.SchemaLogigrammePanneAir as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaCourbeSecurite",
        titre: "La courbe de sécurité : plonger sans palier obligatoire",
        hasLevelProp: false,
        modules: ["n2-tables-mn90"],
        Component: Schemas.SchemaCourbeSecurite as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaCompartimentsPeriodes",
        titre: "Compartiments et périodes : des vitesses de saturation différentes",
        hasLevelProp: false,
        modules: ["n3-ordinateurs","mf1-decompression"],
        Component: Schemas.SchemaCompartimentsPeriodes as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaCourbesSaturation",
        titre: "Saturation et désaturation exponentielles par périodes",
        hasLevelProp: false,
        modules: ["mf1-decompression"],
        Component: Schemas.SchemaCourbesSaturation as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaSursaturationCritique",
        titre: "La sursaturation critique : jusqu'où peut-on remonter ?",
        hasLevelProp: false,
        modules: ["mf1-decompression"],
        Component: Schemas.SchemaSursaturationCritique as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaTableVsOrdinateur",
        titre: "Profil carré des tables contre profil réel de l'ordinateur",
        hasLevelProp: false,
        modules: ["n3-ordinateurs"],
        Component: Schemas.SchemaTableVsOrdinateur as ComponentType<Record<string, never>>,
      },
    ],
  },
  {
    domaine: "Réglementation et prérogatives",
    entries: [
      {
        exportName: "SchemaEspacesEvolution",
        titre: "Espaces d'évolution et aptitudes PE/PA",
        hasLevelProp: true,
        modules: ["n1-prerogatives","n2-reglementation","n3-reglementation","n4-reglementation"],
        Component: Schemas.SchemaEspacesEvolution as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaCursusFfessm",
        titre: "Cursus FFESSM : brevets, encadrement fédéral et voie professionnelle",
        hasLevelProp: false,
        modules: ["mf1-reglementation-structures","n1-prerogatives"],
        Component: Schemas.SchemaCursusFfessm as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaCompositionPalanquee",
        titre: "Composition des palanquées : encadrée vs autonome",
        hasLevelProp: false,
        modules: ["n2-reglementation","n1-prerogatives","n4-reglementation"],
        Component: Schemas.SchemaCompositionPalanquee as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaMaterielObligatoire",
        titre: "Matériel obligatoire : plongeur encadré vs plongeur autonome",
        hasLevelProp: false,
        modules: ["n2-reglementation","n3-materiel-entretien","n4-reglementation"],
        Component: Schemas.SchemaMaterielObligatoire as ComponentType<Record<string, never>>,
      },
    ],
  },
  {
    domaine: "Matériel",
    entries: [
      {
        exportName: "SchemaCircuitAir",
        titre: "Circuit de l'air : du bloc au plongeur",
        hasLevelProp: true,
        modules: ["n4-materiel","n2-materiel","n1-materiel"],
        Component: Schemas.SchemaCircuitAir as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaCoupePremierEtage",
        titre: "Premier étage : coupes piston et membrane",
        hasLevelProp: false,
        modules: ["n4-materiel"],
        Component: Schemas.SchemaCoupePremierEtage as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaCoupeDeuxiemeEtage",
        titre: "Deuxième étage : membrane, levier, clapet",
        hasLevelProp: false,
        modules: ["n2-materiel","n4-materiel"],
        Component: Schemas.SchemaCoupeDeuxiemeEtage as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaBlocRobinetterie",
        titre: "Bloc et robinetterie : marquages réglementaires",
        hasLevelProp: false,
        modules: ["n2-materiel","n3-materiel-entretien","n4-materiel"],
        Component: Schemas.SchemaBlocRobinetterie as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaCircuitGilet",
        titre: "Circuit du gilet : direct system et purges",
        hasLevelProp: false,
        modules: ["n2-materiel","n1-materiel"],
        Component: Schemas.SchemaCircuitGilet as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaInstruments",
        titre: "Les instruments du plongeur autonome",
        hasLevelProp: false,
        modules: ["n2-materiel"],
        Component: Schemas.SchemaInstruments as ComponentType<Record<string, never>>,
      },
    ],
  },
  {
    domaine: "Pédagogie (MF1)",
    entries: [
      {
        exportName: "SchemaBoucleSeance",
        titre: "Boucle pédagogique de la séance",
        hasLevelProp: false,
        modules: ["mf1-pedagogie-preparatoire"],
        Component: Schemas.SchemaBoucleSeance as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaTaxonomieBloom",
        titre: "Taxonomie de Bloom appliquée à la plongée",
        hasLevelProp: false,
        modules: ["mf1-pedagogie-organisation"],
        Component: Schemas.SchemaTaxonomieBloom as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaPositionnementMoniteur",
        titre: "Positionnement du moniteur en atelier",
        hasLevelProp: false,
        modules: ["mf1-pedagogie-pratique"],
        Component: Schemas.SchemaPositionnementMoniteur as ComponentType<Record<string, never>>,
      },
      {
        exportName: "SchemaProgressionMilieux",
        titre: "Progression d'une compétence à travers les milieux",
        hasLevelProp: false,
        modules: ["mf1-pedagogie-organisation"],
        Component: Schemas.SchemaProgressionMilieux as ComponentType<Record<string, never>>,
      },
    ],
  },
];
