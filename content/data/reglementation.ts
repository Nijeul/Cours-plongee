/**
 * VALEURS RÉGLEMENTAIRES CENTRALISÉES — à mettre à jour ici uniquement.
 *
 * Références : Code du sport (articles A.322-71 à A.322-101 et annexes),
 * Manuel de Formation Technique FFESSM.
 * Dernière vérification : 2026-08-05 — À VÉRIFIER avant toute échéance d'examen,
 * les textes évoluent.
 */

import type { DomainSlug, ExamConfig, LevelSlug } from "@/lib/types";

export const REGLEMENTATION_DATE = "2026-08-05";

export const DISCLAIMER =
  "Contenu de révision — ne remplace pas la formation dispensée en club par un moniteur qualifié. Vérifiez les textes réglementaires en vigueur.";

// ---------------------------------------------------------------------------
// Aptitudes et espaces d'évolution (Code du sport, plongée à l'air)
// ---------------------------------------------------------------------------

export interface Aptitude {
  code: string;
  label: string;
  maxDepthMeters: number;
  autonomous: boolean;
}

export const APTITUDES: Aptitude[] = [
  { code: "PE12", label: "Plongeur Encadré 12 m", maxDepthMeters: 12, autonomous: false },
  { code: "PA12", label: "Plongeur Autonome 12 m", maxDepthMeters: 12, autonomous: true },
  { code: "PE20", label: "Plongeur Encadré 20 m", maxDepthMeters: 20, autonomous: false },
  { code: "PA20", label: "Plongeur Autonome 20 m", maxDepthMeters: 20, autonomous: true },
  { code: "PE40", label: "Plongeur Encadré 40 m", maxDepthMeters: 40, autonomous: false },
  { code: "PA40", label: "Plongeur Autonome 40 m", maxDepthMeters: 40, autonomous: true },
  { code: "PE60", label: "Plongeur Encadré 60 m", maxDepthMeters: 60, autonomous: false },
  { code: "PA60", label: "Plongeur Autonome 60 m", maxDepthMeters: 60, autonomous: true },
];

/** Aptitudes délivrées par chaque brevet FFESSM. */
export const BREVET_APTITUDES: Record<LevelSlug, string[]> = {
  n1: ["PE20"],
  n2: ["PA20", "PE40"],
  n3: ["PA60"],
  n4: ["PA60"],
  mf1: ["PA60"],
};

/** Effectif maximal d'une palanquée encadrée (plongeurs encadrés, hors GP). */
export const PALANQUEE_MAX_ENCADRES = 4;
/** Effectif maximal d'une palanquée autonome. */
export const PALANQUEE_MAX_AUTONOMES = 3;

/** Profondeur maximale de la plongée à l'air en France (exploration). */
export const PROFONDEUR_MAX_AIR = 60;

/** Vitesse de remontée préconisée par les tables MN90 (m/min), hors paliers. */
export const VITESSE_REMONTEE_MN90 = { min: 15, max: 17 };
/** Vitesse de remontée entre les paliers et vers la surface (m/min). */
export const VITESSE_REMONTEE_PALIERS = 6;

/** Pression de réserve usuelle (bars) — convention d'enseignement. */
export const RESERVE_BAR = 50;

// ---------------------------------------------------------------------------
// Matériel obligatoire (Code du sport, synthèse)
// ---------------------------------------------------------------------------

export const MATERIEL_OBLIGATOIRE = {
  encadre: [
    "Gilet stabilisateur avec système de gonflage au gaz",
    "Détendeur avec manomètre (ou équivalent) permettant de contrôler la pression",
    "Moyen de contrôler personnellement les caractéristiques de la plongée et de la remontée (à partir du PE40 : profondimètre + montre, ou ordinateur)",
  ],
  autonome: [
    "Gilet stabilisateur avec système de gonflage au gaz",
    "Deux sorties de bloc indépendantes, deux détendeurs complets (deuxième étage de secours)",
    "Manomètre ou gestion d'air",
    "Moyen de contrôler les caractéristiques de la plongée et de la remontée (tables + profondimètre + montre, ou ordinateur)",
    "Par palanquée : un parachute de palier",
  ],
  directeurPlongee: [
    "Plan de secours et moyen de communication pour alerter",
    "Trousse de secours",
    "Oxygénothérapie : bouteille d'O₂ avec détendeur et masque, capacité adaptée",
    "Eau douce non gazeuse, couverture isothermique",
    "Fiche d'évacuation",
  ],
} as const;

// ---------------------------------------------------------------------------
// Examens blancs — formats retenus (voir docs/DECISIONS.md, D-009)
// À VÉRIFIER selon le Manuel de Formation Technique en vigueur.
// ---------------------------------------------------------------------------

export const EXAM_CONFIGS: Record<LevelSlug, ExamConfig> = {
  n1: {
    level: "n1",
    title: "Test de connaissances Niveau 1",
    questionCount: 20,
    durationMinutes: 30,
    passThreshold: 50,
    domainWeights: { physique: 2, physiologie: 3, materiel: 2, environnement: 2, reglementation: 1 },
    note: "Le N1 ne comporte pas d'épreuve théorique formelle : test de connaissances indicatif.",
  },
  n2: {
    level: "n2",
    title: "Examen blanc théorie Niveau 2",
    questionCount: 30,
    durationMinutes: 45,
    passThreshold: 50,
    domainWeights: {
      physique: 3,
      physiologie: 3,
      "tables-deco": 2,
      reglementation: 1,
      materiel: 1,
      environnement: 1,
    },
    note: "Format indicatif : QCM et questions courtes, barème selon les commissions. Moyenne exigée sans note éliminatoire.",
  },
  n3: {
    level: "n3",
    title: "Examen blanc théorie Niveau 3",
    questionCount: 40,
    durationMinutes: 60,
    passThreshold: 50,
    domainWeights: {
      physique: 2,
      physiologie: 3,
      "tables-deco": 3,
      reglementation: 2,
      materiel: 1,
    },
    note: "Format indicatif. L'accent est mis sur l'autonomie : planification, tables, secours, réglementation.",
  },
  n4: {
    level: "n4",
    title: "Examen blanc théorie Niveau 4 / GP",
    questionCount: 60,
    durationMinutes: 120,
    passThreshold: 50,
    domainWeights: {
      physique: 3,
      physiologie: 3,
      "tables-deco": 3,
      reglementation: 3,
      materiel: 2,
      environnement: 1,
    },
    note: "L'examen réel comporte des épreuves écrites par domaine (≈20 pts chacune), note < 5/20 éliminatoire. Simulation regroupée ici en une session chronométrée avec relevé par domaine.",
  },
  mf1: {
    level: "mf1",
    title: "Examen blanc théorie MF1",
    questionCount: 60,
    durationMinutes: 120,
    passThreshold: 50,
    domainWeights: {
      physique: 2,
      physiologie: 3,
      "tables-deco": 3,
      reglementation: 3,
      materiel: 2,
      pedagogie: 3,
    },
    note: "Théorie niveau expert + pédagogie. L'examen réel comprend des épreuves pédagogiques pratiques non simulables ici.",
  },
};

/** Seuil de validation d'un module (auto-évaluation). */
export const MODULE_VALIDATION_THRESHOLD = 80;

/** Intervalles de révision espacée (jours) — SM-2 simplifié. */
export const SRS_INTERVALS_DAYS = [1, 3, 7, 16, 35];

/** Domaines affichés sur le radar de compétences, par niveau. */
export const RADAR_DOMAINS: Record<LevelSlug, DomainSlug[]> = {
  n1: ["physique", "physiologie", "materiel", "environnement", "reglementation"],
  n2: ["physique", "physiologie", "tables-deco", "reglementation", "materiel", "environnement"],
  n3: ["physique", "physiologie", "tables-deco", "reglementation", "materiel"],
  n4: ["physique", "physiologie", "tables-deco", "reglementation", "materiel", "environnement"],
  mf1: ["physique", "physiologie", "tables-deco", "reglementation", "materiel", "pedagogie"],
};
