/**
 * Sélection et notation des questions de quiz — fonctions pures.
 *
 * Aucune dépendance au DOM ni au store : tout est testable isolément.
 * Le tirage aléatoire est déterministe (mulberry32) : même graine → même tirage.
 */

import { mulberry32 } from "@/lib/calc/random";
import type {
  DomainSlug,
  ExamConfig,
  ExamDomainResult,
  Question,
  QuizAnswer,
} from "@/lib/types";
import { DOMAIN_SLUGS } from "@/lib/types";

/** Réponses de l'utilisateur : id de question → ids des options cochées. */
export type AnswerMap = Record<string, string[]>;

export interface TrainingSelectionOptions {
  /** Restreint le tirage à un module (slug du catalogue). */
  moduleSlug?: string;
  /** Nombre de questions souhaité (borné par le vivier disponible). */
  count: number;
  /** Graine du tirage (par défaut : Date.now()). */
  seed?: number;
}

/** Mélange de Fisher-Yates, sans modifier le tableau d'origine. */
export function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Tire des questions d'entraînement au hasard, sans doublon.
 * Si `moduleSlug` est fourni, seul ce module est concerné.
 */
export function pickTrainingQuestions(
  questions: readonly Question[],
  options: TrainingSelectionOptions,
): Question[] {
  const pool = options.moduleSlug
    ? questions.filter((q) => q.moduleSlug === options.moduleSlug)
    : [...questions];
  if (options.count <= 0 || pool.length === 0) return [];
  const rng = mulberry32(options.seed ?? Date.now());
  return shuffle(pool, rng).slice(0, Math.min(options.count, pool.length));
}

/**
 * Tire les questions d'un examen blanc : tirage pondéré par `domainWeights`,
 * sans doublon, équilibré par la méthode des plus forts restes.
 *
 * - Les quotas par domaine sont proportionnels aux poids, bornés par le nombre
 *   de questions réellement disponibles dans chaque domaine.
 * - Si un domaine manque de questions, le déficit est comblé par les autres
 *   questions disponibles (tous domaines confondus).
 * - L'ordre final est mélangé pour entrelacer les domaines.
 */
export function pickExamQuestions(
  questions: readonly Question[],
  config: ExamConfig,
  seed: number,
): Question[] {
  const rng = mulberry32(seed);
  const total = Math.min(config.questionCount, questions.length);
  if (total <= 0) return [];

  // Regroupe le vivier par domaine.
  const byDomain = new Map<DomainSlug, Question[]>();
  for (const q of questions) {
    const list = byDomain.get(q.domain);
    if (list) list.push(q);
    else byDomain.set(q.domain, [q]);
  }

  // Domaines pondérés effectivement représentés dans le vivier.
  const weighted = (Object.entries(config.domainWeights) as [DomainSlug, number][]).filter(
    ([domain, weight]) => weight > 0 && (byDomain.get(domain)?.length ?? 0) > 0,
  );

  if (weighted.length === 0) {
    return shuffle(questions, rng).slice(0, total);
  }

  const weightSum = weighted.reduce((sum, [, w]) => sum + w, 0);
  const quotas = weighted.map(([domain, weight]) => {
    const exact = (total * weight) / weightSum;
    const available = byDomain.get(domain)?.length ?? 0;
    return { domain, exact, available, taken: Math.min(Math.floor(exact), available) };
  });

  // Plus forts restes : distribue les places restantes aux domaines les plus
  // « en manque » par rapport à leur quota exact, dans la limite du disponible.
  let remaining = total - quotas.reduce((sum, q) => sum + q.taken, 0);
  while (remaining > 0) {
    const candidates = quotas
      .filter((q) => q.taken < q.available)
      .sort((a, b) => b.exact - b.taken - (a.exact - a.taken));
    if (candidates.length === 0) break;
    candidates[0].taken += 1;
    remaining -= 1;
  }

  const selected: Question[] = [];
  const selectedIds = new Set<string>();
  for (const quota of quotas) {
    const pool = shuffle(byDomain.get(quota.domain) ?? [], rng);
    for (const q of pool.slice(0, quota.taken)) {
      selected.push(q);
      selectedIds.add(q.id);
    }
  }

  // Complète si les domaines pondérés ne suffisent pas (vivier trop petit).
  if (selected.length < total) {
    const leftovers = shuffle(
      questions.filter((q) => !selectedIds.has(q.id)),
      rng,
    );
    for (const q of leftovers) {
      if (selected.length >= total) break;
      selected.push(q);
      selectedIds.add(q.id);
    }
  }

  return shuffle(selected, rng);
}

/** Compare la sélection de l'utilisateur aux bonnes réponses (ensembles égaux). */
export function isAnswerCorrect(question: Question, selectedOptionIds: readonly string[]): boolean {
  const selected = [...new Set(selectedOptionIds)].sort();
  const correct = [...new Set(question.correctOptionIds)].sort();
  return selected.length === correct.length && selected.every((id, i) => id === correct[i]);
}

export interface ScoreResult {
  /** Nombre de questions justes. */
  score: number;
  /** Nombre de questions posées. */
  maxScore: number;
  /** Pourcentage entier 0..100 (0 si aucune question). */
  percent: number;
}

/** Note une série de réponses : 1 point par question entièrement juste. */
export function scoreAnswers(questions: readonly Question[], answers: AnswerMap): ScoreResult {
  const maxScore = questions.length;
  const score = questions.reduce(
    (sum, q) => sum + (isAnswerCorrect(q, answers[q.id] ?? []) ? 1 : 0),
    0,
  );
  return {
    score,
    maxScore,
    percent: maxScore === 0 ? 0 : Math.round((score / maxScore) * 100),
  };
}

/**
 * Relevé par domaine (ordre canonique des domaines), limité aux domaines
 * effectivement présents dans la série de questions.
 */
export function buildDomainResults(
  questions: readonly Question[],
  answers: AnswerMap,
): ExamDomainResult[] {
  const results = new Map<DomainSlug, ExamDomainResult>();
  for (const q of questions) {
    const entry = results.get(q.domain) ?? { domain: q.domain, score: 0, maxScore: 0 };
    entry.maxScore += 1;
    if (isAnswerCorrect(q, answers[q.id] ?? [])) entry.score += 1;
    results.set(q.domain, entry);
  }
  return DOMAIN_SLUGS.filter((d) => results.has(d)).map((d) => results.get(d) as ExamDomainResult);
}

/** Convertit les réponses brutes en `QuizAnswer[]` prêts à être persistés. */
export function toQuizAnswers(
  questions: readonly Question[],
  answers: AnswerMap,
  timeSeconds = 0,
): QuizAnswer[] {
  return questions.map((q) => ({
    questionId: q.id,
    selectedOptionIds: answers[q.id] ?? [],
    correct: isAnswerCorrect(q, answers[q.id] ?? []),
    timeSeconds,
  }));
}
