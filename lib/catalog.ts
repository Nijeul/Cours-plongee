/**
 * CATALOGUE DE CONTENU — figé en phase 1.
 * Chaque module correspond exactement à un fichier `content/<level>/<slug>.mdx`.
 * Les agents Contenu et Banque de questions s'y conforment sans le modifier.
 */

import type { CatalogModule, DomainInfo, DomainSlug, LevelInfo, LevelSlug } from "@/lib/types";

export const LEVELS: LevelInfo[] = [
  {
    slug: "n1",
    title: "Niveau 1",
    subtitle: "PE20 — Plongeur Encadré 20 m",
    description:
      "Les bases indispensables pour plonger encadré jusqu'à 20 m : pression, barotraumatismes, matériel, signes et prérogatives.",
    order: 1,
  },
  {
    slug: "n2",
    title: "Niveau 2",
    subtitle: "PA20 / PE40 — Plongeur Autonome 20 m, Encadré 40 m",
    description:
      "Les lois physiques appliquées, les accidents, les tables MN90 et la réglementation pour devenir autonome.",
    order: 2,
  },
  {
    slug: "n3",
    title: "Niveau 3",
    subtitle: "PA60 — Plongeur Autonome 60 m",
    description:
      "Autonomie complète : planification, gestion de l'air, tables avancées, ordinateurs, secours et responsabilités.",
    order: 3,
  },
  {
    slug: "n4",
    title: "Niveau 4 / Guide de Palanquée",
    subtitle: "GP — Guide de Palanquée",
    description:
      "Le programme des épreuves théoriques écrites : physique, anatomie-physiologie, accidents, tables, réglementation et conduite de palanquée.",
    order: 4,
  },
  {
    slug: "mf1",
    title: "MF1",
    subtitle: "Moniteur Fédéral 1er degré",
    description:
      "Théorie experte (décompression, physiologie, réglementation) et pédagogie : préparer, conduire et évaluer un enseignement.",
    order: 5,
  },
];

export const DOMAINS: DomainInfo[] = [
  { slug: "physique", title: "Physique appliquée à la plongée", shortTitle: "Physique" },
  { slug: "physiologie", title: "Physiologie et accidents", shortTitle: "Physio / accidents" },
  { slug: "tables-deco", title: "Tables et décompression", shortTitle: "Tables & déco" },
  { slug: "reglementation", title: "Réglementation", shortTitle: "Réglementation" },
  { slug: "materiel", title: "Matériel", shortTitle: "Matériel" },
  { slug: "environnement", title: "Environnement et pratique", shortTitle: "Environnement" },
  { slug: "pedagogie", title: "Pédagogie", shortTitle: "Pédagogie" },
];

export const CATALOG: CatalogModule[] = [
  // ------------------------------------------------------------------ N1
  {
    slug: "n1-flottabilite-pression",
    level: "n1",
    domain: "physique",
    title: "Flottabilité et pression",
    description:
      "Comprendre intuitivement la poussée d'Archimède, la pression et la compressibilité de l'air pour maîtriser sa stabilité.",
    order: 1,
    durationMinutes: 40,
    prerequisites: [],
  },
  {
    slug: "n1-barotraumatismes",
    level: "n1",
    domain: "physiologie",
    title: "Les barotraumatismes et leur prévention",
    description:
      "Oreilles, sinus, dents, plaquage de masque, surpression pulmonaire : reconnaître, prévenir, réagir.",
    order: 2,
    durationMinutes: 45,
    prerequisites: ["n1-flottabilite-pression"],
  },
  {
    slug: "n1-risques-du-plongeur",
    level: "n1",
    domain: "physiologie",
    title: "Essoufflement, froid et désaturation",
    description:
      "Les autres risques du plongeur débutant : essoufflement, froid, notions d'accident de désaturation.",
    order: 3,
    durationMinutes: 35,
    prerequisites: ["n1-barotraumatismes"],
  },
  {
    slug: "n1-materiel",
    level: "n1",
    domain: "materiel",
    title: "Le matériel du plongeur",
    description:
      "Palmes, masque, tuba, combinaison, gilet, détendeur, bloc : rôle, utilisation et entretien de base.",
    order: 4,
    durationMinutes: 35,
    prerequisites: [],
  },
  {
    slug: "n1-signes-communication",
    level: "n1",
    domain: "environnement",
    title: "Les signes et la communication",
    description:
      "Les signes conventionnels de plongée, la communication en palanquée et les règles de sécurité associées.",
    order: 5,
    durationMinutes: 30,
    prerequisites: [],
  },
  {
    slug: "n1-milieu-naturel",
    level: "n1",
    domain: "environnement",
    title: "Le milieu naturel et l'écoresponsabilité",
    description:
      "Dangers du milieu (courant, faune, bateaux), respect de l'environnement et comportement écoresponsable.",
    order: 6,
    durationMinutes: 30,
    prerequisites: [],
  },
  {
    slug: "n1-prerogatives",
    level: "n1",
    domain: "reglementation",
    title: "Prérogatives et organisation",
    description:
      "PE20, PA12, l'encadrement, les documents obligatoires et l'organisation d'une plongée en club.",
    order: 7,
    durationMinutes: 30,
    prerequisites: [],
  },

  // ------------------------------------------------------------------ N2
  {
    slug: "n2-pression-mariotte",
    level: "n2",
    domain: "physique",
    title: "Pressions et loi de Boyle-Mariotte",
    description:
      "Pression absolue et relative, compressibilité des gaz et applications directes en plongée (calculs).",
    order: 1,
    durationMinutes: 50,
    prerequisites: [],
  },
  {
    slug: "n2-archimede",
    level: "n2",
    domain: "physique",
    title: "La poussée d'Archimède",
    description:
      "Flottabilité, poids apparent, lestage : la loi d'Archimède et ses calculs appliqués au plongeur.",
    order: 2,
    durationMinutes: 45,
    prerequisites: ["n2-pression-mariotte"],
  },
  {
    slug: "n2-dalton-henry",
    level: "n2",
    domain: "physique",
    title: "Lois de Dalton et de Henry",
    description:
      "Pressions partielles et dissolution des gaz : les fondements physiques de la narcose, de la toxicité de l'O₂ et de la désaturation.",
    order: 3,
    durationMinutes: 50,
    prerequisites: ["n2-pression-mariotte"],
  },
  {
    slug: "n2-consommation-autonomie",
    level: "n2",
    domain: "physique",
    title: "Consommation et autonomie en air",
    description:
      "Calculer sa consommation et son autonomie selon la profondeur, la réserve et le bloc utilisé.",
    order: 4,
    durationMinutes: 45,
    prerequisites: ["n2-pression-mariotte"],
  },
  {
    slug: "n2-barotraumatismes",
    level: "n2",
    domain: "physiologie",
    title: "Les barotraumatismes",
    description:
      "Mécanismes, symptômes, conduite à tenir et prévention de tous les barotraumatismes, dont la surpression pulmonaire.",
    order: 5,
    durationMinutes: 50,
    prerequisites: ["n2-pression-mariotte"],
  },
  {
    slug: "n2-add",
    level: "n2",
    domain: "physiologie",
    title: "L'accident de désaturation",
    description:
      "Mécanisme de saturation/désaturation, symptômes, conduite à tenir et prévention de l'ADD.",
    order: 6,
    durationMinutes: 55,
    prerequisites: ["n2-dalton-henry"],
  },
  {
    slug: "n2-autres-accidents",
    level: "n2",
    domain: "physiologie",
    title: "Narcose, essoufflement et autres accidents",
    description:
      "Narcose à l'azote, essoufflement, hyperoxie, hypoxie, hydrocution, noyade et froid : reconnaître et prévenir.",
    order: 7,
    durationMinutes: 50,
    prerequisites: ["n2-dalton-henry"],
  },
  {
    slug: "n2-tables-mn90",
    level: "n2",
    domain: "tables-deco",
    title: "Les tables MN90",
    description:
      "Lire les tables, planifier une plongée simple ou successive, gérer paliers, remontées anormales et majorations.",
    order: 8,
    durationMinutes: 70,
    prerequisites: ["n2-add"],
  },
  {
    slug: "n2-materiel",
    level: "n2",
    domain: "materiel",
    title: "Le matériel du plongeur autonome",
    description:
      "Détendeur, bloc, gilet et instruments : fonctionnement, réglementation et entretien.",
    order: 9,
    durationMinutes: 45,
    prerequisites: [],
  },
  {
    slug: "n2-reglementation",
    level: "n2",
    domain: "reglementation",
    title: "Réglementation du plongeur Niveau 2",
    description:
      "Code du sport, prérogatives PA20/PE40, encadrement, matériel obligatoire et documents.",
    order: 10,
    durationMinutes: 40,
    prerequisites: [],
  },
  {
    slug: "n2-orientation-milieu",
    level: "n2",
    domain: "environnement",
    title: "Orientation, matelotage et milieu vivant",
    description:
      "S'orienter en plongée, connaître les bases du matelotage et respecter la faune et la flore.",
    order: 11,
    durationMinutes: 40,
    prerequisites: [],
  },

  // ------------------------------------------------------------------ N3
  {
    slug: "n3-physique-appliquee",
    level: "n3",
    domain: "physique",
    title: "Physique appliquée et calculs",
    description:
      "Maîtriser toutes les lois physiques avec leurs calculs : pressions, volumes, pressions partielles, flottabilité.",
    order: 1,
    durationMinutes: 60,
    prerequisites: [],
  },
  {
    slug: "n3-planification-air",
    level: "n3",
    domain: "physique",
    title: "Planification et gestion de l'air",
    description:
      "Planifier une plongée autonome : consommation, réserve, marges de sécurité et gestion d'équipe.",
    order: 2,
    durationMinutes: 55,
    prerequisites: ["n3-physique-appliquee"],
  },
  {
    slug: "n3-tables-avancees",
    level: "n3",
    domain: "tables-deco",
    title: "Tables MN90 : tous les cas",
    description:
      "Plongées successives, consécutives, remontée rapide ou lente, palier interrompu : toutes les procédures.",
    order: 3,
    durationMinutes: 70,
    prerequisites: [],
  },
  {
    slug: "n3-ordinateurs",
    level: "n3",
    domain: "tables-deco",
    title: "Les ordinateurs de plongée",
    description:
      "Principes de calcul, modèles, limites d'utilisation et gestion des plongées successives à l'ordinateur.",
    order: 4,
    durationMinutes: 45,
    prerequisites: ["n3-tables-avancees"],
  },
  {
    slug: "n3-accidents-secours",
    level: "n3",
    domain: "physiologie",
    title: "Accidents et secours en autonomie",
    description:
      "Conduites à tenir en autonomie, oxygénothérapie normobare, alerte et chaîne de secours.",
    order: 5,
    durationMinutes: 60,
    prerequisites: [],
  },
  {
    slug: "n3-materiel-entretien",
    level: "n3",
    domain: "materiel",
    title: "Matériel : entretien, TIV et gonflage",
    description:
      "Entretien du matériel, notions de TIV, réglementation des blocs et stations de gonflage.",
    order: 6,
    durationMinutes: 45,
    prerequisites: [],
  },
  {
    slug: "n3-reglementation",
    level: "n3",
    domain: "reglementation",
    title: "Réglementation du plongeur autonome",
    description:
      "Prérogatives PA60, espaces d'évolution, plongée en autonomie et responsabilités du plongeur N3.",
    order: 7,
    durationMinutes: 45,
    prerequisites: [],
  },

  // ------------------------------------------------------------------ N4
  {
    slug: "n4-pressions-gaz",
    level: "n4",
    domain: "physique",
    title: "Pressions et étude des gaz",
    description:
      "Mariotte, Dalton, Henry et leurs calculs d'examen : compressibilité, pressions partielles, dissolution.",
    order: 1,
    durationMinutes: 70,
    prerequisites: [],
  },
  {
    slug: "n4-flottabilite-optique-acoustique",
    level: "n4",
    domain: "physique",
    title: "Archimède, optique et acoustique",
    description:
      "Calculs complets de flottabilité, vision et audition sous l'eau : tout le programme physique de l'examen.",
    order: 2,
    durationMinutes: 60,
    prerequisites: ["n4-pressions-gaz"],
  },
  {
    slug: "n4-anatomie-ventilation",
    level: "n4",
    domain: "physiologie",
    title: "Anatomie et physiologie de la ventilation",
    description:
      "Appareil respiratoire, mécanique ventilatoire et échanges gazeux : les bases anatomiques de l'examen.",
    order: 3,
    durationMinutes: 65,
    prerequisites: [],
  },
  {
    slug: "n4-circulation-oreille",
    level: "n4",
    domain: "physiologie",
    title: "Circulation, ORL et système nerveux",
    description:
      "Appareil circulatoire, oreille et sphère ORL, adaptations à la plongée.",
    order: 4,
    durationMinutes: 60,
    prerequisites: ["n4-anatomie-ventilation"],
  },
  {
    slug: "n4-accidents",
    level: "n4",
    domain: "physiologie",
    title: "Les accidents de plongée : mécanismes et CAT",
    description:
      "Mécanismes fins, symptômes, prévention et conduites à tenir de tous les accidents, avec le cadre réglementaire du secours.",
    order: 5,
    durationMinutes: 75,
    prerequisites: ["n4-circulation-oreille"],
  },
  {
    slug: "n4-tables-tous-cas",
    level: "n4",
    domain: "tables-deco",
    title: "Tables MN90 : maîtrise complète",
    description:
      "Tous les cas d'examen : successives complexes, procédures de rattrapage, plongée en altitude, au nitrox (notions).",
    order: 6,
    durationMinutes: 80,
    prerequisites: [],
  },
  {
    slug: "n4-reglementation",
    level: "n4",
    domain: "reglementation",
    title: "Réglementation et responsabilité",
    description:
      "Code du sport, prérogatives, organisation des plongées, matériel obligatoire, responsabilité civile et pénale.",
    order: 7,
    durationMinutes: 70,
    prerequisites: [],
  },
  {
    slug: "n4-materiel",
    level: "n4",
    domain: "materiel",
    title: "Le matériel : fonctionnement et réglementation",
    description:
      "Détendeurs (schémas de principe), blocs et robinetterie, compresseurs, instruments : niveau examen.",
    order: 8,
    durationMinutes: 60,
    prerequisites: [],
  },
  {
    slug: "n4-guide-palanquee",
    level: "n4",
    domain: "environnement",
    title: "Conduite de palanquée et matelotage",
    description:
      "Organiser et guider une palanquée, sécurité surface, matelotage et météo : le rôle du GP.",
    order: 9,
    durationMinutes: 55,
    prerequisites: [],
  },

  // ------------------------------------------------------------------ MF1
  {
    slug: "mf1-decompression",
    level: "mf1",
    domain: "tables-deco",
    title: "Modèles de décompression",
    description:
      "Haldane, périodes des compartiments, coefficients de sursaturation critique et construction d'une table.",
    order: 1,
    durationMinutes: 80,
    prerequisites: [],
  },
  {
    slug: "mf1-physiologie",
    level: "mf1",
    domain: "physiologie",
    title: "Physiologie approfondie",
    description:
      "Ventilation, circulation, système nerveux, oreille interne : le niveau de détail attendu d'un moniteur.",
    order: 2,
    durationMinutes: 75,
    prerequisites: [],
  },
  {
    slug: "mf1-physique-expert",
    level: "mf1",
    domain: "physique",
    title: "Physique : niveau expert",
    description:
      "Tous les calculs, cas limites et démonstrations nécessaires pour enseigner la physique de la plongée.",
    order: 3,
    durationMinutes: 70,
    prerequisites: [],
  },
  {
    slug: "mf1-materiel-avance",
    level: "mf1",
    domain: "materiel",
    title: "Matériel avancé",
    description:
      "Détendeurs compensés, blocs et réglementation, compresseurs, recycleurs (notions) : matériel niveau moniteur.",
    order: 4,
    durationMinutes: 60,
    prerequisites: [],
  },
  {
    slug: "mf1-reglementation-structures",
    level: "mf1",
    domain: "reglementation",
    title: "Réglementation, structures et examens",
    description:
      "Organisation fédérale et professionnelle, cadre réglementaire complet, organisation des examens.",
    order: 5,
    durationMinutes: 65,
    prerequisites: [],
  },
  {
    slug: "mf1-pedagogie-preparatoire",
    level: "mf1",
    domain: "pedagogie",
    title: "Pédagogie préparatoire",
    description:
      "Construire une séance de cours théorique : objectifs, progression, supports, évaluation.",
    order: 6,
    durationMinutes: 70,
    prerequisites: [],
  },
  {
    slug: "mf1-pedagogie-pratique",
    level: "mf1",
    domain: "pedagogie",
    title: "Pédagogie pratique",
    description:
      "Concevoir et conduire des exercices en milieu naturel : critères de réussite, éducatifs, remédiation.",
    order: 7,
    durationMinutes: 70,
    prerequisites: ["mf1-pedagogie-preparatoire"],
  },
  {
    slug: "mf1-pedagogie-organisation",
    level: "mf1",
    domain: "pedagogie",
    title: "Pédagogie organisationnelle et évaluation",
    description:
      "Organiser l'enseignement, taxonomie des objectifs, évaluation et sécurité en situation d'enseignement.",
    order: 8,
    durationMinutes: 60,
    prerequisites: ["mf1-pedagogie-pratique"],
  },
];

// ---------------------------------------------------------------------------
// Accès pratiques
// ---------------------------------------------------------------------------

export function getLevel(slug: LevelSlug): LevelInfo {
  const level = LEVELS.find((l) => l.slug === slug);
  if (!level) throw new Error(`Niveau inconnu : ${slug}`);
  return level;
}

export function getDomain(slug: DomainSlug): DomainInfo {
  const domain = DOMAINS.find((d) => d.slug === slug);
  if (!domain) throw new Error(`Domaine inconnu : ${slug}`);
  return domain;
}

export function getModulesForLevel(level: LevelSlug): CatalogModule[] {
  return CATALOG.filter((m) => m.level === level).sort((a, b) => a.order - b.order);
}

export function getCatalogModule(slug: string): CatalogModule | undefined {
  return CATALOG.find((m) => m.slug === slug);
}

export function isLevelSlug(value: string): value is LevelSlug {
  return (LEVELS as { slug: string }[]).some((l) => l.slug === value);
}
