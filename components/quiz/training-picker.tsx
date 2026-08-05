"use client";

import { Dices } from "lucide-react";
import * as React from "react";

import { QuizRunner } from "@/components/quiz/quiz-runner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pickTrainingQuestions } from "@/lib/quiz/selection";
import type { LevelSlug, Question } from "@/lib/types";

interface TrainingPickerProps {
  level: LevelSlug;
  /** Banque complète du niveau. */
  questions: Question[];
}

interface Series {
  seed: number;
  count: number;
  questions: Question[];
}

/**
 * Choix d'une série d'entraînement au hasard (10 ou 20 questions) sur tout le
 * niveau, puis déroulé dans le QuizRunner en mode entraînement.
 *
 * Le tirage utilise une graine `Date.now()` et n'a lieu qu'au clic : aucun
 * rendu aléatoire côté serveur, donc aucun risque d'incohérence d'hydratation.
 */
export function TrainingPicker({ level, questions }: TrainingPickerProps) {
  const [series, setSeries] = React.useState<Series | null>(null);

  const draw = (count: number) => {
    const seed = Date.now();
    setSeries({ seed, count, questions: pickTrainingQuestions(questions, { count, seed }) });
  };

  if (series) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-sm">
            Série de {series.questions.length} questions — tous les modules du niveau.
          </p>
          <Button variant="ghost" size="sm" onClick={() => setSeries(null)}>
            Changer de série
          </Button>
        </div>
        <QuizRunner
          key={series.seed}
          questions={series.questions}
          mode="entrainement"
          level={level}
          onRestart={() => draw(series.count)}
        />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Dices aria-hidden className="size-5" />
          Série au hasard
        </CardTitle>
        <CardDescription>
          Des questions tirées au sort dans tous les modules du niveau, corrigées une par une.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 sm:flex-row">
        <Button className="flex-1" onClick={() => draw(10)} disabled={questions.length === 0}>
          10 questions
        </Button>
        <Button
          className="flex-1"
          variant="secondary"
          onClick={() => draw(20)}
          disabled={questions.length === 0}
        >
          20 questions
        </Button>
      </CardContent>
    </Card>
  );
}
