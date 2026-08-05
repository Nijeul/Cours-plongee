/**
 * Révision espacée — algorithme SM-2 simplifié, conforme aux contrats
 * {@link SrsCard} / {@link SrsQuality} de `lib/types.ts`.
 *
 * Grille d'intervalles : `SRS_INTERVALS_DAYS` = [1, 3, 7, 16, 35] jours
 * (répétitions réussies 1 à 5), puis intervalle précédent × facteur de
 * facilité (arrondi à l'entier le plus proche).
 *
 * Facteur de facilité (easiness) : borné à [1,3 ; 2,8], initialisé à 2,5.
 * - qualité 0 (échec)     : easiness − 0,2 ;
 * - qualité 1 (difficile) : easiness − 0,15 ;
 * - qualité 2 (correct)   : inchangé ;
 * - qualité 3 (facile)    : easiness + 0,1.
 *
 * Toutes les fonctions sont pures : elles retournent de nouveaux objets sans
 * modifier leurs arguments.
 */

import { SRS_INTERVALS_DAYS } from "@/content/data/reglementation";
import type { DomainSlug, LevelSlug, SrsCard, SrsQuality } from "@/lib/types";

/** Facteur de facilité minimal (SM-2). */
export const EASINESS_MIN = 1.3;
/** Facteur de facilité maximal (plafond du SM-2 simplifié). */
export const EASINESS_MAX = 2.8;
/** Facteur de facilité initial d'une nouvelle carte. */
export const EASINESS_INITIAL = 2.5;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Arrondit à 2 décimales pour éviter la dérive des flottants (2,5 + 0,1 → 2,6). */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function assertIsoDate(iso: string, label: string): void {
  if (!ISO_DATE_PATTERN.test(iso)) {
    throw new Error(
      `Date invalide pour ${label} : « ${iso} ». Format attendu : AAAA-MM-JJ (ex. 2026-08-05).`,
    );
  }
}

/**
 * Ajoute un nombre de jours à une date ISO (AAAA-MM-JJ), en UTC pour éviter
 * tout décalage de fuseau horaire, et retourne une date ISO (date seule).
 */
export function addDaysIso(dateIso: string, days: number): string {
  assertIsoDate(dateIso, "addDaysIso");
  if (!Number.isFinite(days) || !Number.isInteger(days)) {
    throw new Error(`Nombre de jours invalide : ${days}. Un entier est attendu.`);
  }
  const [year, month, day] = dateIso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

/**
 * Crée une nouvelle carte de révision pour une question.
 *
 * La carte est initialisée avec easiness 2,5, aucun succès ni échec, et une
 * première échéance à J+1 (revue dès le lendemain de sa création).
 */
export function newCard(
  questionId: string,
  level: LevelSlug,
  domain: DomainSlug,
  moduleSlug: string,
  todayIso: string,
): SrsCard {
  assertIsoDate(todayIso, "newCard");
  return {
    id: `srs-${questionId}`,
    questionId,
    level,
    domain,
    moduleSlug,
    easiness: EASINESS_INITIAL,
    intervalDays: 1,
    repetitions: 0,
    lapses: 0,
    dueDate: addDaysIso(todayIso, 1),
    createdAt: todayIso,
    updatedAt: todayIso,
  };
}

/**
 * Applique une réponse à une carte et calcule la prochaine échéance (SM-2 simplifié).
 *
 * - Qualité 0 (échec) : `repetitions` remis à 0, `lapses` + 1,
 *   easiness = max(1,3 ; easiness − 0,2), intervalle 1 jour, échéance J+1.
 * - Qualité 1, 2, 3 (réussite) : `repetitions` + 1, easiness ajusté
 *   (1 : − 0,15 avec plancher 1,3 ; 2 : inchangé ; 3 : + 0,1 avec plafond 2,8),
 *   puis :
 *   - tant que le nombre de répétitions réussies reste dans la grille
 *     [1, 3, 7, 16, 35] (répétitions 1 à 5) : intervalle =
 *     `SRS_INTERVALS_DAYS[repetitions − 1]` ;
 *   - au-delà (6ᵉ succès consécutif et suivants) : intervalle =
 *     intervalle précédent × easiness, arrondi à l'entier le plus proche.
 *
 * `dueDate` = todayIso + intervalle (date ISO AAAA-MM-JJ), `updatedAt` = todayIso.
 *
 * @throws {Error} si `todayIso` n'est pas au format AAAA-MM-JJ ou si la
 *   qualité est hors de {0, 1, 2, 3}.
 */
export function reviewCard(card: SrsCard, quality: SrsQuality, todayIso: string): SrsCard {
  assertIsoDate(todayIso, "reviewCard");
  if (![0, 1, 2, 3].includes(quality)) {
    throw new Error(`Qualité de réponse invalide : ${quality}. Valeurs admises : 0, 1, 2, 3.`);
  }

  if (quality === 0) {
    const easiness = round2(Math.max(EASINESS_MIN, card.easiness - 0.2));
    return {
      ...card,
      repetitions: 0,
      lapses: card.lapses + 1,
      easiness,
      intervalDays: 1,
      dueDate: addDaysIso(todayIso, 1),
      updatedAt: todayIso,
    };
  }

  let easiness = card.easiness;
  if (quality === 1) easiness = Math.max(EASINESS_MIN, easiness - 0.15);
  if (quality === 3) easiness = Math.min(EASINESS_MAX, easiness + 0.1);
  easiness = round2(easiness);

  const repetitions = card.repetitions + 1;
  const intervalDays =
    repetitions <= SRS_INTERVALS_DAYS.length
      ? SRS_INTERVALS_DAYS[Math.min(repetitions - 1, SRS_INTERVALS_DAYS.length - 1)]
      : Math.round(card.intervalDays * easiness);

  return {
    ...card,
    repetitions,
    easiness,
    intervalDays,
    dueDate: addDaysIso(todayIso, intervalDays),
    updatedAt: todayIso,
  };
}

/**
 * Retourne les cartes arrivées à échéance (dueDate ≤ todayIso), triées par
 * échéance croissante (les plus en retard d'abord), puis par identifiant pour
 * un ordre stable et déterministe.
 */
export function dueCards(cards: SrsCard[], todayIso: string): SrsCard[] {
  assertIsoDate(todayIso, "dueCards");
  return cards
    .filter((card) => card.dueDate <= todayIso)
    .sort((a, b) =>
      a.dueDate === b.dueDate ? a.id.localeCompare(b.id) : a.dueDate < b.dueDate ? -1 : 1,
    );
}
