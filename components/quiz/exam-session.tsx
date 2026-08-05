"use client";

import {
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  CircleX,
  Flag,
  Play,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { QuestionCard } from "@/components/quiz/question-card";
import { Timer } from "@/components/quiz/timer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { newCard, reviewCard } from "@/lib/calc/sm2";
import { getDomain, getLevel } from "@/lib/catalog";
import { uuid } from "@/lib/ids";
import { useProgressStore } from "@/lib/progress";
import {
  buildDomainResults,
  pickExamQuestions,
  scoreAnswers,
  toQuizAnswers,
  type AnswerMap,
} from "@/lib/quiz/selection";
import type { ExamConfig, ExamSession as ExamSessionRecord, Question, QuizAttempt } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ExamSessionProps {
  config: ExamConfig;
  /** Banque complète du niveau (le tirage pondéré est fait au démarrage). */
  questions: Question[];
}

type Phase = "intro" | "running" | "finished";

/**
 * Session d'examen blanc chronométrée : écran d'intro, questions en navigation
 * libre (grille d'accès direct), chronomètre sans dérive avec soumission
 * automatique à 0, puis correction complète uniquement à la fin.
 */
export function ExamSession({ config, questions }: ExamSessionProps) {
  const { store } = useProgressStore();
  const storeRef = React.useRef(store);
  React.useEffect(() => {
    storeRef.current = store;
  }, [store]);

  const [phase, setPhase] = React.useState<Phase>("intro");
  const [drawn, setDrawn] = React.useState<Question[]>([]);
  const [answers, setAnswers] = React.useState<AnswerMap>({});
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [endsAt, setEndsAt] = React.useState(0);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const startedAtRef = React.useRef("");
  const savedRef = React.useRef(false);

  const level = getLevel(config.level);
  const total = drawn.length;
  const answeredCount = drawn.filter((q) => (answers[q.id] ?? []).length > 0).length;
  const shortBank = questions.length < config.questionCount;

  const start = () => {
    // Tirage côté client, graine horodatée : jamais exécuté au rendu serveur.
    setDrawn(pickExamQuestions(questions, config, Date.now()));
    setAnswers({});
    setCurrentIndex(0);
    startedAtRef.current = new Date().toISOString();
    setEndsAt(Date.now() + config.durationMinutes * 60_000);
    savedRef.current = false;
    setPhase("running");
  };

  // Références toujours à jour (le chronomètre peut soumettre à tout moment).
  const drawnRef = React.useRef<Question[]>(drawn);
  const answersRef = React.useRef<AnswerMap>(answers);
  React.useEffect(() => {
    drawnRef.current = drawn;
    answersRef.current = answers;
  }, [drawn, answers]);

  const submit = React.useCallback(() => {
    setConfirmOpen(false);
    setPhase("finished");
    if (savedRef.current) return;
    savedRef.current = true;

    void (async () => {
      const activeStore = storeRef.current;
      const finishedAt = new Date().toISOString();
      const series = drawnRef.current;
      const finalAnswers = answersRef.current;
      const { score, maxScore, percent } = scoreAnswers(series, finalAnswers);
      const quizAnswers = toQuizAnswers(series, finalAnswers);
      const session: ExamSessionRecord = {
        id: uuid(),
        level: config.level,
        startedAt: startedAtRef.current,
        finishedAt,
        durationMinutes: config.durationMinutes,
        score,
        maxScore,
        passed: percent >= config.passThreshold,
        byDomain: buildDomainResults(series, finalAnswers),
        answers: quizAnswers,
      };
      const attempt: QuizAttempt = {
        id: uuid(),
        kind: "examen",
        level: config.level,
        moduleSlug: null,
        score,
        maxScore,
        startedAt: startedAtRef.current,
        finishedAt,
        answers: quizAnswers,
      };
      try {
        await activeStore.saveExamSession(session);
        await activeStore.saveAttempt(attempt);
        const failed = series.filter(
          (q) => !quizAnswers.find((a) => a.questionId === q.id)?.correct,
        );
        if (failed.length > 0) {
          const todayIso = new Date().toISOString().slice(0, 10);
          const snapshot = await activeStore.getSnapshot();
          for (const question of failed) {
            const existing = snapshot.srsCards.find((c) => c.questionId === question.id);
            const card = existing
              ? reviewCard(existing, 0, todayIso)
              : newCard(question.id, question.level, question.domain, question.moduleSlug, todayIso);
            await activeStore.upsertSrsCard(card);
          }
        }
      } catch (error) {
        console.error("Échec de l'enregistrement de l'examen blanc :", error);
      }
    })();
  }, [config]);

  // ------------------------------------------------------------------ Intro
  if (phase === "intro") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Avant de commencer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="text-sm leading-relaxed [&>li]:mt-1.5">
            <li>
              <strong>{Math.min(config.questionCount, questions.length)} questions</strong> tirées
              au sort, pondérées par domaine comme à l&apos;examen.
            </li>
            <li>
              <strong>{config.durationMinutes} minutes</strong> chrono : à zéro, la copie est rendue
              automatiquement.
            </li>
            <li>
              Aucune correction avant la fin : vous naviguez librement entre les questions et pouvez
              revenir en arrière.
            </li>
            <li>
              Seuil de réussite : <strong>{config.passThreshold} %</strong>.
            </li>
          </ul>
          <p className="text-muted-foreground border-l-2 pl-3 text-xs leading-relaxed">
            {config.note}
          </p>
          {shortBank ? (
            <p className="rounded-md border border-amber-600/30 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-800 dark:border-amber-400/25 dark:bg-amber-950/30 dark:text-amber-300">
              La banque de questions du {level.title} compte pour l&apos;instant{" "}
              {questions.length} question{questions.length > 1 ? "s" : ""} : la session portera sur
              l&apos;ensemble disponible.
            </p>
          ) : null}
          <Button size="lg" className="w-full sm:w-auto" onClick={start}>
            <Play aria-hidden className="size-4" />
            Démarrer l&apos;examen blanc
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ------------------------------------------------------------------ Résultats
  if (phase === "finished") {
    const result = scoreAnswers(drawn, answers);
    const domainResults = buildDomainResults(drawn, answers);
    const passed = result.percent >= config.passThreshold;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Résultat de l&apos;examen blanc</CardTitle>
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

            {passed ? (
              <div className="flex items-start gap-2 rounded-lg border border-emerald-600/30 bg-emerald-50/70 p-4 text-sm text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-950/30 dark:text-emerald-300">
                <CircleCheck aria-hidden className="mt-0.5 size-4 shrink-0" />
                <p>
                  <strong>Réussi !</strong> Vous dépassez le seuil de {config.passThreshold} % sur
                  cette simulation. Consolidez les domaines les plus faibles ci-dessous.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2 rounded-lg border border-red-600/30 bg-red-50/70 p-4 text-sm text-red-800 dark:border-red-400/25 dark:bg-red-950/30 dark:text-red-300">
                <CircleX aria-hidden className="mt-0.5 size-4 shrink-0" />
                <p>
                  <strong>En dessous du seuil de {config.passThreshold} %.</strong> Repérez vos
                  domaines faibles dans le relevé ci-dessous, revoyez les cours liés puis retentez :
                  les questions ratées reviendront dans vos révisions espacées.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Relevé par domaine</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domaine</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="w-[40%]">Réussite</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {domainResults.map((d) => {
                      const percent =
                        d.maxScore === 0 ? 0 : Math.round((d.score / d.maxScore) * 100);
                      return (
                        <TableRow key={d.domain}>
                          <TableCell className="whitespace-normal">
                            {getDomain(d.domain).shortTitle}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {d.score} / {d.maxScore}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={percent}
                                className="h-1.5 min-w-16"
                                aria-label={`${getDomain(d.domain).shortTitle} : ${percent} %`}
                              />
                              <span className="text-muted-foreground text-xs tabular-nums">
                                {percent} %
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={start}>
                <RotateCcw aria-hidden className="size-4" />
                Nouvel examen blanc
              </Button>
              <Button variant="outline" asChild>
                <Link href="/examen">Tous les examens blancs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <section aria-label="Revue des questions" className="space-y-4">
          <h2 className="text-lg font-semibold">Revue détaillée</h2>
          {drawn.map((question, i) => (
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

  // ------------------------------------------------------------------ En cours
  const current = drawn[currentIndex];
  const isLast = currentIndex === total - 1;

  return (
    <div className="space-y-4">
      <div className="bg-background/95 sticky top-14 z-10 -mx-4 space-y-2 border-b px-4 py-2 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-xs font-medium tabular-nums">
            {answeredCount} / {total} répondue{answeredCount > 1 ? "s" : ""}
          </span>
          <Timer endsAt={endsAt} onExpire={submit} />
        </div>
        <nav aria-label="Accès direct aux questions">
          <ol className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible sm:pb-0">
            {drawn.map((q, i) => {
              const answered = (answers[q.id] ?? []).length > 0;
              const isCurrent = i === currentIndex;
              return (
                <li key={q.id}>
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    aria-current={isCurrent ? "true" : undefined}
                    aria-label={`Question ${i + 1}${answered ? " (répondue)" : ""}`}
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-md border text-xs font-medium tabular-nums transition-colors",
                      isCurrent
                        ? "border-primary bg-primary text-primary-foreground"
                        : answered
                          ? "border-emerald-600/40 bg-emerald-50 text-emerald-800 dark:border-emerald-400/30 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground hover:bg-accent",
                    )}
                  >
                    {i + 1}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <QuestionCard
        question={current}
        index={currentIndex}
        total={total}
        selectedIds={answers[current.id] ?? []}
        onSelectionChange={(ids) => setAnswers((prev) => ({ ...prev, [current.id]: ids }))}
        revealed={false}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
        >
          <ArrowLeft aria-hidden className="size-4" />
          Précédente
        </Button>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
            <Flag aria-hidden className="size-4" />
            Rendre ma copie
          </Button>
          {!isLast ? (
            <Button onClick={() => setCurrentIndex((i) => Math.min(total - 1, i + 1))}>
              Suivante
              <ArrowRight aria-hidden className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rendre votre copie ?</DialogTitle>
            <DialogDescription>
              {answeredCount < total
                ? `Il reste ${total - answeredCount} question${total - answeredCount > 1 ? "s" : ""} sans réponse. Une question sans réponse compte comme fausse.`
                : "Toutes les questions ont une réponse. La correction sera affichée immédiatement."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Continuer l&apos;examen
            </Button>
            <Button variant="destructive" onClick={submit}>
              Rendre ma copie
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
