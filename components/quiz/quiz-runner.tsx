"use client";

import { ArrowLeft, ArrowRight, CircleCheck, CircleX, Flag, RotateCcw } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { QuestionCard } from "@/components/quiz/question-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MODULE_VALIDATION_THRESHOLD } from "@/content/data/reglementation";
import { newCard, reviewCard } from "@/lib/calc/sm2";
import { getDomain } from "@/lib/catalog";
import { useProgressStore } from "@/lib/progress";
import {
  buildDomainResults,
  scoreAnswers,
  toQuizAnswers,
  type AnswerMap,
} from "@/lib/quiz/selection";
import type { LevelSlug, ProgressStore, Question, QuizAttempt } from "@/lib/types";

function makeId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Enregistre les cartes de révision espacée pour les questions ratées :
 * nouvelle carte (échéance J+1) si la question n'en a pas encore,
 * sinon carte existante notée en échec (qualité 0).
 */
async function registerFailedQuestions(
  store: ProgressStore,
  failed: readonly Question[],
): Promise<void> {
  if (failed.length === 0) return;
  const todayIso = new Date().toISOString().slice(0, 10);
  const snapshot = await store.getSnapshot();
  for (const question of failed) {
    const existing = snapshot.srsCards.find((c) => c.questionId === question.id);
    const card = existing
      ? reviewCard(existing, 0, todayIso)
      : newCard(question.id, question.level, question.domain, question.moduleSlug, todayIso);
    await store.upsertSrsCard(card);
  }
}

export type QuizRunnerMode = "entrainement" | "validation";

interface QuizRunnerProps {
  questions: Question[];
  mode: QuizRunnerMode;
  level: LevelSlug;
  /** Module concerné (null pour une série multi-modules). */
  moduleSlug?: string | null;
  /** Seuil de réussite en % (mode validation ; défaut : 80). */
  threshold?: number;
  /** Recommencer avec un nouveau tirage (défaut : simple remise à zéro). */
  onRestart?: () => void;
  /** Lien de retour affiché sur l'écran de résultats. */
  backHref?: string;
  backLabel?: string;
}

/**
 * Déroule une série de questions en deux modes :
 * - « entrainement » : correction immédiate après chaque réponse ;
 * - « validation » : aucune correction avant la fin, seuil de réussite à 80 %.
 *
 * À la fin : écran de résultats (score, relevé par domaine, revue corrigée),
 * enregistrement de la tentative et cartes de révision espacée pour chaque
 * question ratée.
 */
export function QuizRunner({
  questions,
  mode,
  level,
  moduleSlug = null,
  threshold = MODULE_VALIDATION_THRESHOLD,
  onRestart,
  backHref,
  backLabel,
}: QuizRunnerProps) {
  const { store } = useProgressStore();
  const storeRef = React.useRef(store);
  React.useEffect(() => {
    storeRef.current = store;
  }, [store]);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<AnswerMap>({});
  const [revealedIds, setRevealedIds] = React.useState<Set<string>>(new Set());
  const [finished, setFinished] = React.useState(false);
  const startedAtRef = React.useRef<string>(new Date().toISOString());
  const savedRef = React.useRef(false);

  const total = questions.length;
  const current = questions[currentIndex];
  const currentSelection = current ? (answers[current.id] ?? []) : [];
  const currentRevealed = current ? revealedIds.has(current.id) : false;
  const answeredCount = questions.filter((q) => (answers[q.id] ?? []).length > 0).length;

  const result = scoreAnswers(questions, answers);
  const domainResults = buildDomainResults(questions, answers);
  const passed = result.percent >= threshold;

  const persistResults = React.useCallback(async () => {
    if (savedRef.current || total === 0) return;
    savedRef.current = true;
    const activeStore = storeRef.current;
    const finishedAt = new Date().toISOString();
    const { score, maxScore, percent } = scoreAnswers(questions, answers);
    const attempt: QuizAttempt = {
      id: makeId("quiz"),
      kind: mode,
      level,
      moduleSlug,
      score,
      maxScore,
      startedAt: startedAtRef.current,
      finishedAt,
      answers: toQuizAnswers(questions, answers),
    };
    try {
      await activeStore.saveAttempt(attempt);
      await registerFailedQuestions(
        activeStore,
        questions.filter((q) => !attempt.answers.find((a) => a.questionId === q.id)?.correct),
      );
      if (mode === "validation" && moduleSlug) {
        const snapshot = await activeStore.getSnapshot();
        const existing = snapshot.modules.find((m) => m.moduleSlug === moduleSlug);
        await activeStore.upsertModuleProgress({
          moduleSlug,
          status: percent >= threshold ? "completed" : (existing?.status ?? "in_progress"),
          percent: existing?.percent ?? 0,
          lastAnchor: existing?.lastAnchor ?? null,
          bestValidationScore: Math.max(existing?.bestValidationScore ?? 0, percent),
          updatedAt: finishedAt,
        });
      }
    } catch (error) {
      console.error("Échec de l'enregistrement de la tentative :", error);
    }
  }, [answers, level, mode, moduleSlug, questions, threshold, total]);

  const finish = React.useCallback(() => {
    setFinished(true);
    void persistResults();
  }, [persistResults]);

  const reset = React.useCallback(() => {
    setCurrentIndex(0);
    setAnswers({});
    setRevealedIds(new Set());
    setFinished(false);
    startedAtRef.current = new Date().toISOString();
    savedRef.current = false;
  }, []);

  if (total === 0) {
    return (
      <p className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
        Aucune question disponible pour cette série.
      </p>
    );
  }

  // ------------------------------------------------------------ Résultats
  if (finished) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {mode === "validation" ? "Résultat du test de validation" : "Résultats de la série"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-3xl font-bold tabular-nums">
                {result.score} / {result.maxScore}
              </span>
              <span className="text-muted-foreground text-lg font-semibold tabular-nums">
                {result.percent} %
              </span>
            </div>
            <Progress value={result.percent} aria-label={`Score : ${result.percent} %`} />

            {mode === "validation" ? (
              passed ? (
                <div className="flex items-start gap-2 rounded-lg border border-emerald-600/30 bg-emerald-50/70 p-4 text-sm text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
                  <p>
                    <strong>Module validé !</strong> Score supérieur ou égal au seuil de {threshold}{" "}
                    % : ce module est marqué comme acquis dans votre progression.
                  </p>
                </div>
              ) : (
                <div className="flex items-start gap-2 rounded-lg border border-amber-600/30 bg-amber-50/70 p-4 text-sm text-amber-800 dark:border-amber-400/25 dark:bg-amber-950/30 dark:text-amber-300">
                  <CircleX aria-hidden className="mt-0.5 size-4 shrink-0" />
                  <p>
                    <strong>Pas encore validé</strong> (seuil : {threshold} %). Relisez les sections
                    du cours liées aux questions ratées ci-dessous, puis retentez le test : les
                    notions ratées reviendront aussi dans vos révisions espacées.
                  </p>
                </div>
              )
            ) : (
              <p className="text-muted-foreground text-sm leading-relaxed">
                Les questions ratées ont été ajoutées à vos révisions espacées : elles vous seront
                reproposées au bon moment.
              </p>
            )}

            {domainResults.length > 1 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Par domaine</h3>
                {domainResults.map((d) => {
                  const percent =
                    d.maxScore === 0 ? 0 : Math.round((d.score / d.maxScore) * 100);
                  return (
                    <div key={d.domain} className="space-y-1">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span>{getDomain(d.domain).shortTitle}</span>
                        <span className="text-muted-foreground tabular-nums">
                          {d.score} / {d.maxScore}
                        </span>
                      </div>
                      <Progress
                        value={percent}
                        className="h-1.5"
                        aria-label={`${getDomain(d.domain).shortTitle} : ${percent} %`}
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={onRestart ?? reset}>
                <RotateCcw aria-hidden className="size-4" />
                Recommencer
              </Button>
              {backHref ? (
                <Button variant="outline" asChild>
                  <Link href={backHref}>{backLabel ?? "Retour"}</Link>
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <section aria-label="Revue des questions" className="space-y-4">
          <h2 className="text-lg font-semibold">Revue question par question</h2>
          {questions.map((question, i) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={i}
              total={total}
              selectedIds={answers[question.id] ?? []}
              revealed
              disabled
            />
          ))}
        </section>
      </div>
    );
  }

  // ------------------------------------------------------------ En cours
  const isLast = currentIndex === total - 1;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="text-muted-foreground flex items-center justify-between gap-2 text-xs">
          <span className="font-medium tabular-nums">
            Question {currentIndex + 1} / {total}
          </span>
          <span className="tabular-nums">
            {answeredCount} répondue{answeredCount > 1 ? "s" : ""}
          </span>
        </div>
        <Progress
          value={(currentIndex / total) * 100}
          aria-label={`Progression : question ${currentIndex + 1} sur ${total}`}
        />
      </div>

      <QuestionCard
        question={current}
        index={currentIndex}
        total={total}
        selectedIds={currentSelection}
        onSelectionChange={(ids) => setAnswers((prev) => ({ ...prev, [current.id]: ids }))}
        revealed={mode === "entrainement" && currentRevealed}
      />

      <div className="flex flex-wrap items-center justify-end gap-2">
        {mode === "validation" && currentIndex > 0 ? (
          <Button
            variant="outline"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="mr-auto"
          >
            <ArrowLeft aria-hidden className="size-4" />
            Précédente
          </Button>
        ) : null}

        {mode === "entrainement" && !currentRevealed ? (
          <Button
            disabled={currentSelection.length === 0}
            onClick={() => setRevealedIds((prev) => new Set(prev).add(current.id))}
          >
            Valider ma réponse
          </Button>
        ) : isLast ? (
          <Button onClick={finish} disabled={mode === "validation" && answeredCount === 0}>
            <Flag aria-hidden className="size-4" />
            {mode === "validation" ? "Terminer le test" : "Voir les résultats"}
          </Button>
        ) : (
          <Button onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}>
            Question suivante
            <ArrowRight aria-hidden className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
