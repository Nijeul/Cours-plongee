/**
 * Moteur de tables MN90 (Marine Nationale 1990, édition FFESSM).
 *
 * Toutes les lectures se font STRICTEMENT dans `content/data/mn90.json`,
 * jeu de données d'amorçage marqué « À VÉRIFIER » : toute valeur absente ou
 * hors bornes lève une {@link Mn90DataError} avec un message français explicite.
 * Le moteur n'extrapole JAMAIS et n'invente JAMAIS de valeur.
 *
 * Conventions pédagogiques appliquées (documentées fonction par fonction) :
 * - Table I  : profondeur et durée arrondies à l'entrée immédiatement supérieure.
 * - Table II : intervalle de surface arrondi à l'intervalle immédiatement
 *   inférieur (lecture pénalisante).
 * - Table III : azote résiduel et profondeur arrondis à la valeur
 *   immédiatement supérieure (lecture pénalisante).
 */

import mn90Json from "@/content/data/mn90.json";
import {
  Mn90DataError,
  type Mn90SimpleResult,
  type Mn90Stop,
  type Mn90SuccessiveInput,
  type Mn90SuccessiveResult,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Typage local du fichier de données
// ---------------------------------------------------------------------------

interface Mn90Row {
  duration: number;
  /** Minutes de palier par profondeur de palier (clé en mètres, ex. "3"). */
  stops: Record<string, number>;
  gps: string;
}

interface Mn90Entry {
  depth: number;
  rows: Mn90Row[];
}

interface Mn90Data {
  meta: {
    ascentSpeedMeters: { min: number; max: number };
    interStopSpeed: number;
  };
  tableI: { entries: Mn90Entry[] };
  tableII: { intervals: number[]; residualNitrogen: Record<string, number[]> };
  tableIII: { nitrogenLevels: number[]; depths: number[]; majorations: number[][] };
}

const DATA = mn90Json as unknown as Mn90Data;

/** Vitesse de remontée du fond jusqu'au premier palier (m/min). */
const ASCENT_SPEED = DATA.meta.ascentSpeedMeters.min; // 15 m/min
/** Vitesse entre les paliers et du dernier palier à la surface (m/min). */
const INTER_STOP_SPEED = DATA.meta.interStopSpeed; // 6 m/min

/** Azote résiduel « de base » : au-delà de 12 h d'intervalle, plongée simple. */
const BASE_RESIDUAL_NITROGEN = 0.81;

// ---------------------------------------------------------------------------
// Plongée simple (table I)
// ---------------------------------------------------------------------------

/**
 * Calcule les paliers, le GPS et la DTR d'une plongée simple à l'air
 * d'après la table I des tables MN90.
 *
 * Règles de lecture (MN90) :
 * - la profondeur est arrondie à l'entrée de table immédiatement supérieure
 *   (ex. 17 m → table 20 m) ;
 * - la durée est arrondie à la durée immédiatement supérieure de cette entrée
 *   (ex. 42 min → 45 min).
 *
 * Convention DTR (durée totale de remontée) :
 * - remontée à 15 m/min depuis la profondeur RÉELLE saisie (`depthMeters`,
 *   et non la profondeur de table) jusqu'au premier palier, ou jusqu'à la
 *   surface s'il n'y a aucun palier ;
 * - puis 6 m/min entre les paliers et du dernier palier à la surface ;
 * - plus la durée de tous les paliers ;
 * - le total est arrondi à la minute SUPÉRIEURE.
 *
 * Les paliers sont retournés dans l'ordre chronologique de la remontée
 * (du plus profond au moins profond).
 *
 * @throws {Mn90DataError} si la profondeur ou la durée sort de la couverture
 *   du fichier de données (aucune extrapolation).
 */
export function computeSimpleDive(input: {
  depthMeters: number;
  durationMinutes: number;
}): Mn90SimpleResult {
  const { depthMeters, durationMinutes } = input;

  if (!Number.isFinite(depthMeters) || depthMeters <= 0) {
    throw new Mn90DataError(
      `Profondeur invalide : ${depthMeters} m. La profondeur doit être un nombre strictement positif.`,
    );
  }
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    throw new Mn90DataError(
      `Durée invalide : ${durationMinutes} min. La durée doit être un nombre strictement positif.`,
    );
  }

  const entries = [...DATA.tableI.entries].sort((a, b) => a.depth - b.depth);
  const entry = entries.find((e) => e.depth >= depthMeters);
  if (!entry) {
    const maxDepth = entries[entries.length - 1]?.depth ?? 0;
    throw new Mn90DataError(
      `Profondeur demandée : ${depthMeters} m — hors couverture des tables MN90 chargées ` +
        `(profondeur maximale disponible : ${maxDepth} m). ` +
        `Le fichier de données est un jeu d'amorçage marqué « À VÉRIFIER » : aucune extrapolation n'est effectuée.`,
    );
  }

  const rows = [...entry.rows].sort((a, b) => a.duration - b.duration);
  const row = rows.find((r) => r.duration >= durationMinutes);
  if (!row) {
    const maxDuration = rows[rows.length - 1]?.duration ?? 0;
    throw new Mn90DataError(
      `Durée demandée : ${durationMinutes} min — hors couverture pour l'entrée ${entry.depth} m ` +
        `(durée maximale disponible : ${maxDuration} min). ` +
        `Le fichier de données est un jeu d'amorçage marqué « À VÉRIFIER » : aucune extrapolation n'est effectuée.`,
    );
  }

  const stops: Mn90Stop[] = Object.entries(row.stops)
    .map(([depth, minutes]) => ({ depth: Number(depth), minutes }))
    .sort((a, b) => b.depth - a.depth);

  const firstStopDepth = stops.length > 0 ? stops[0].depth : 0;
  const stopMinutes = stops.reduce((total, s) => total + s.minutes, 0);
  const mainAscentMinutes = Math.max(0, depthMeters - firstStopDepth) / ASCENT_SPEED;
  const interStopMinutes = firstStopDepth / INTER_STOP_SPEED;
  const dtrMinutes = Math.ceil(mainAscentMinutes + interStopMinutes + stopMinutes);

  return {
    tableDepth: entry.depth,
    tableDuration: row.duration,
    stops,
    gps: row.gps,
    dtrMinutes,
  };
}

// ---------------------------------------------------------------------------
// Azote résiduel (table II)
// ---------------------------------------------------------------------------

/**
 * Lit l'azote résiduel dans le tableau II en fonction du GPS de la première
 * plongée et de l'intervalle de surface.
 *
 * Règle de lecture (pénalisante) : l'intervalle de surface est arrondi à
 * l'intervalle de table immédiatement INFÉRIEUR (ex. 50 min → colonne 45 min).
 *
 * Au-delà du dernier intervalle du tableau (720 min, soit 12 h), la plongée
 * suivante est une plongée simple : la fonction retourne 0,81 (azote de base).
 *
 * @throws {Mn90DataError} si le GPS est inconnu ou si l'intervalle est
 *   inférieur au premier intervalle du tableau (cas de la plongée consécutive,
 *   non couvert par le tableau II).
 */
export function getResidualNitrogen(gps: string, surfaceIntervalMinutes: number): number {
  if (!Number.isFinite(surfaceIntervalMinutes) || surfaceIntervalMinutes <= 0) {
    throw new Mn90DataError(
      `Intervalle de surface invalide : ${surfaceIntervalMinutes} min. ` +
        `L'intervalle doit être un nombre strictement positif.`,
    );
  }

  const row = DATA.tableII.residualNitrogen[gps];
  if (!row) {
    const known = Object.keys(DATA.tableII.residualNitrogen).join(", ");
    throw new Mn90DataError(
      `GPS inconnu : « ${gps} ». Groupes couverts par le tableau II : ${known}.`,
    );
  }

  const intervals = DATA.tableII.intervals;
  const lastInterval = intervals[intervals.length - 1];
  if (surfaceIntervalMinutes > lastInterval) {
    return BASE_RESIDUAL_NITROGEN;
  }

  // Intervalle immédiatement inférieur (lecture pénalisante).
  let index = -1;
  for (let i = 0; i < intervals.length; i++) {
    if (intervals[i] <= surfaceIntervalMinutes) index = i;
  }
  if (index === -1) {
    throw new Mn90DataError(
      `Intervalle de surface demandé : ${surfaceIntervalMinutes} min — inférieur au premier intervalle ` +
        `du tableau II (${intervals[0]} min). Ce cas relève de la plongée consécutive, ` +
        `non couverte par ce moteur : aucune extrapolation n'est effectuée.`,
    );
  }

  return row[index];
}

// ---------------------------------------------------------------------------
// Majoration (table III)
// ---------------------------------------------------------------------------

/**
 * Lit la majoration (en minutes) dans le tableau III.
 *
 * Règles de lecture (pénalisantes) :
 * - azote résiduel arrondi au niveau de la table immédiatement SUPÉRIEUR
 *   (ex. 0,88 → ligne 0,89) ;
 * - profondeur de la seconde plongée arrondie à la profondeur de la table
 *   immédiatement SUPÉRIEURE (ex. 18 m → colonne 20 m).
 *
 * @throws {Mn90DataError} si l'azote résiduel dépasse le dernier niveau du
 *   tableau, si la profondeur dépasse la dernière colonne, ou si la case lue
 *   est la sentinelle « 999 » (combinaison interdite par les tables :
 *   la plongée successive n'est pas réalisable dans ces conditions).
 */
export function getMajoration(residualNitrogen: number, secondDiveDepthMeters: number): number {
  if (!Number.isFinite(residualNitrogen) || residualNitrogen <= 0) {
    throw new Mn90DataError(
      `Azote résiduel invalide : ${residualNitrogen}. La valeur doit être un nombre strictement positif.`,
    );
  }
  if (!Number.isFinite(secondDiveDepthMeters) || secondDiveDepthMeters <= 0) {
    throw new Mn90DataError(
      `Profondeur de seconde plongée invalide : ${secondDiveDepthMeters} m. ` +
        `La profondeur doit être un nombre strictement positif.`,
    );
  }

  const { nitrogenLevels, depths, majorations } = DATA.tableIII;

  const levelIndex = nitrogenLevels.findIndex((level) => level >= residualNitrogen);
  if (levelIndex === -1) {
    throw new Mn90DataError(
      `Azote résiduel demandé : ${residualNitrogen} — supérieur au dernier niveau du tableau III ` +
        `(${nitrogenLevels[nitrogenLevels.length - 1]}). La plongée successive n'est pas couverte : ` +
        `aucune extrapolation n'est effectuée.`,
    );
  }

  const depthIndex = depths.findIndex((depth) => depth >= secondDiveDepthMeters);
  if (depthIndex === -1) {
    throw new Mn90DataError(
      `Profondeur de seconde plongée demandée : ${secondDiveDepthMeters} m — supérieure à la dernière ` +
        `colonne du tableau III (${depths[depths.length - 1]} m). Aucune extrapolation n'est effectuée.`,
    );
  }

  const value = majorations[levelIndex][depthIndex];
  if (value === undefined) {
    throw new Mn90DataError(
      `Donnée manquante dans le tableau III pour le niveau d'azote ${nitrogenLevels[levelIndex]} ` +
        `et la profondeur ${depths[depthIndex]} m. Fichier de données incomplet (« À VÉRIFIER »).`,
    );
  }
  if (value >= 999) {
    throw new Mn90DataError(
      `Combinaison hors table : azote résiduel ${nitrogenLevels[levelIndex]} à ${depths[depthIndex]} m. ` +
        `Les tables MN90 n'autorisent pas cette plongée successive (case sans valeur exploitable).`,
    );
  }

  return value;
}

// ---------------------------------------------------------------------------
// Plongée successive (tables II + III composées)
// ---------------------------------------------------------------------------

/**
 * Calcule l'azote résiduel puis la majoration d'une plongée successive en
 * composant strictement les tableaux II et III :
 *
 * 1. azote résiduel = {@link getResidualNitrogen}(gps, intervalle) ;
 * 2. majoration = {@link getMajoration}(azote résiduel, profondeur prévue).
 *
 * Note : au-delà de 720 min d'intervalle, le tableau II retourne l'azote de
 * base (0,81) ; la composition stricte lit alors la première ligne du
 * tableau III (0,84). En pratique pédagogique, une plongée après plus de
 * 12 h d'intervalle est traitée comme une plongée simple (sans majoration) —
 * la valeur retournée ici reste la lecture pénalisante des tables.
 *
 * @throws {Mn90DataError} dans tous les cas d'erreur des deux fonctions composées.
 */
export function computeSuccessiveDive(input: Mn90SuccessiveInput): Mn90SuccessiveResult {
  const residualNitrogen = getResidualNitrogen(input.gps, input.surfaceIntervalMinutes);
  const majorationMinutes = getMajoration(residualNitrogen, input.secondDiveDepth);
  return { residualNitrogen, majorationMinutes };
}
