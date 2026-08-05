"use client";

import * as React from "react";

import { QuizRunner, type QuizRunnerMode } from "@/components/quiz/quiz-runner";
import { pickTrainingQuestions } from "@/lib/quiz/selection";
import type { LevelSlug, Question } from "@/lib/types";

/** Nombre de questions tirées pour un test de validation quand le module en compte davantage. */
const VALIDATION_COUNT = 15;
/** Graine du premier tirage — identique pour tous, remplacée à chaque « Rejouer ». */
const INITIAL_SEED = 1;

interface ModuleQuizProps {
  level: LevelSlug;
  moduleSlug: string;
  /** Questions du module (déjà filtrées côté serveur). */
  questions: Question[];
  mode: QuizRunnerMode;
  /** Lien de retour affiché sur l'écran de résultats. */
  backHref: string;
  backLabel: string;
  nextHref?: string;
  nextLabel?: string;
  validationHref?: string;
}

/**
 * Lance le quiz d'un module : en entraînement, toutes les questions du module
 * dans un ordre aléatoire ; en validation, 15 questions tirées au sort (ou
 * toutes si le module en compte moins), sans correction avant la fin.
 *
 * Premier tirage avec une graine fixe : rendu identique serveur/client (pas
 * d'écart d'hydratation, pas d'état de chargement). « Rejouer » retire ensuite
 * avec une graine horodatée, dans le gestionnaire d'événement.
 */
export function ModuleQuiz({
  level,
  moduleSlug,
  questions,
  mode,
  backHref,
  backLabel,
  nextHref,
  nextLabel,
  validationHref,
}: ModuleQuizProps) {
  const [seed, setSeed] = React.useState(INITIAL_SEED);

  const series = React.useMemo(() => {
    const count = mode === "validation" ? VALIDATION_COUNT : questions.length;
    return { seed, questions: pickTrainingQuestions(questions, { count, seed }) };
  }, [questions, mode, seed]);

  return (
    <QuizRunner
      key={series.seed}
      questions={series.questions}
      mode={mode}
      level={level}
      moduleSlug={moduleSlug}
      onRestart={() => setSeed(Date.now())}
      backHref={backHref}
      backLabel={backLabel}
      nextHref={nextHref}
      nextLabel={nextLabel}
      validationHref={validationHref}
    />
  );
}
