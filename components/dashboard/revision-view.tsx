"use client";

import { ArrowRight, BrainCircuit, CalendarClock, CheckCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { daysUntil, formatDayFr, localTodayIso } from "@/components/dashboard/dates";
import { QuestionCard } from "@/components/quiz/question-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { SRS_INTERVALS_DAYS } from "@/content/data/reglementation";
import { dueCards, reviewCard } from "@/lib/calc/sm2";
import { useProgressStore } from "@/lib/progress";
import type { Question, SrsCard, SrsQuality } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RevisionViewProps {
  /** Toutes les questions connues (toutes banques confondues). */
  questions: Question[];
}

interface QualityChoice {
  quality: SrsQuality;
  label: string;
  className: string;
}

const QUALITY_CHOICES: QualityChoice[] = [
  {
    quality: 0,
    label: "Oublié",
    className:
      "border-red-600/40 text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40",
  },
  {
    quality: 1,
    label: "Difficile",
    className:
      "border-amber-600/40 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40",
  },
  {
    quality: 2,
    label: "Correct",
    className:
      "border-sky-600/40 text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40",
  },
  {
    quality: 3,
    label: "Facile",
    className:
      "border-emerald-600/40 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40",
  },
];

const INTERVALS_LABEL = SRS_INTERVALS_DAYS.map((d) => `J+${d}`).join(", ");

export function RevisionView({ questions }: RevisionViewProps) {
  const { store, loading } = useProgressStore();
  const todayIso = React.useMemo(() => localTodayIso(), []);

  const questionById = React.useMemo(() => {
    const map = new Map<string, Question>();
    for (const q of questions) map.set(q.id, q);
    return map;
  }, [questions]);

  /** Toutes les cartes SRS (mises à jour au fil de la session). */
  const [cards, setCards] = React.useState<SrsCard[] | null>(null);
  /** File de la session : cartes dues aujourd'hui dont la question existe. */
  const [queue, setQueue] = React.useState<SrsCard[]>([]);
  const [index, setIndex] = React.useState(0);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [revealed, setRevealed] = React.useState(false);

  React.useEffect(() => {
    if (loading) return;
    let cancelled = false;
    store.getSnapshot().then(
      (snapshot) => {
        if (cancelled) return;
        const known = snapshot.srsCards.filter((c) => questionById.has(c.questionId));
        setCards(known);
        setQueue(dueCards(known, todayIso));
        setIndex(0);
        setSelectedIds([]);
        setRevealed(false);
      },
      () => {
        if (!cancelled) {
          setCards([]);
          setQueue([]);
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [store, loading, questionById, todayIso]);

  const current = queue[index];
  const currentQuestion = current ? questionById.get(current.questionId) : undefined;

  const grade = (quality: SrsQuality) => {
    if (!current) return;
    const updated = reviewCard(current, quality, todayIso);
    setCards((prev) => (prev ? prev.map((c) => (c.id === updated.id ? updated : c)) : prev));
    store.upsertSrsCard(updated).catch(() => undefined);
    setSelectedIds([]);
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  /** 3 prochaines échéances (date + nombre de cartes), hors cartes encore dues. */
  const upcoming = React.useMemo(() => {
    if (!cards) return [];
    const byDate = new Map<string, number>();
    for (const card of cards) {
      if (card.dueDate <= todayIso) continue;
      byDate.set(card.dueDate, (byDate.get(card.dueDate) ?? 0) + 1);
    }
    return [...byDate.entries()]
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .slice(0, 3)
      .map(([dateIso, count]) => ({ dateIso, count }));
  }, [cards, todayIso]);

  // ----- Chargement ---------------------------------------------------------
  if (loading || cards === null) {
    return (
      <div className="space-y-4" aria-busy="true" aria-label="Chargement des révisions">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  // ----- Aucune carte due ---------------------------------------------------
  if (queue.length === 0) {
    return (
      <EmptyState
        title={"Aucune révision aujourd'hui"}
        upcoming={upcoming}
        hasCards={cards.length > 0}
      />
    );
  }

  // ----- Session terminée ---------------------------------------------------
  if (index >= queue.length) {
    return (
      <Card>
        <CardHeader className="items-center text-center">
          <div className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-full">
            <CheckCheck aria-hidden className="size-6" />
          </div>
          <CardTitle className="text-xl">Révisions à jour !</CardTitle>
          <CardDescription className="leading-relaxed">
            Vous avez révisé {queue.length} {queue.length > 1 ? "cartes" : "carte"} aujourd&apos;hui.
            Revenez demain : la régularité fait la mémorisation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UpcomingList upcoming={upcoming} todayIso={todayIso} />
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild variant="outline">
              <Link href="/dashboard">Retour au tableau de bord</Link>
            </Button>
            <Button asChild>
              <Link href="/entrainement">
                Continuer à s&apos;entraîner
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ----- Flux de révision ---------------------------------------------------
  const remaining = queue.length - index;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm">
          Carte {index + 1} sur {queue.length}
        </p>
        <p className="text-sm font-medium tabular-nums">
          {remaining} {remaining > 1 ? "restantes" : "restante"}
        </p>
      </div>
      <Progress value={(index / queue.length) * 100} />

      {currentQuestion ? (
        <QuestionCard
          question={currentQuestion}
          index={index}
          total={queue.length}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          revealed={revealed}
        />
      ) : null}

      {!revealed ? (
        <Button className="w-full" size="lg" onClick={() => setRevealed(true)}>
          Vérifier ma réponse
        </Button>
      ) : current ? (
        <div className="space-y-2">
          <p className="text-muted-foreground text-center text-sm">
            Comment avez-vous retenu cette notion ?
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {QUALITY_CHOICES.map(({ quality, label, className }) => {
              const nextInterval = reviewCard(current, quality, todayIso).intervalDays;
              return (
                <Button
                  key={quality}
                  variant="outline"
                  className={cn("h-auto flex-col gap-0.5 py-2", className)}
                  onClick={() => grade(quality)}
                >
                  <span className="text-sm font-semibold">{label}</span>
                  <span className="text-xs opacity-80">
                    J+{nextInterval}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sous-composants
// ---------------------------------------------------------------------------

function UpcomingList({
  upcoming,
  todayIso,
}: {
  upcoming: { dateIso: string; count: number }[];
  todayIso: string;
}) {
  if (upcoming.length === 0) return null;
  return (
    <div className="rounded-lg border p-4">
      <p className="flex items-center gap-2 text-sm font-medium">
        <CalendarClock aria-hidden className="text-primary size-4" />
        Prochaines échéances
      </p>
      <ul className="mt-2 space-y-1.5">
        {upcoming.map(({ dateIso, count }) => {
          const days = daysUntil(dateIso, todayIso);
          return (
            <li key={dateIso} className="text-muted-foreground flex items-center justify-between gap-3 text-sm">
              <span className="capitalize">{formatDayFr(dateIso)}</span>
              <span className="tabular-nums">
                {count} {count > 1 ? "cartes" : "carte"}
                {days === 1 ? " (demain)" : ` (J+${days})`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function EmptyState({
  title,
  upcoming,
  hasCards,
}: {
  title: string;
  upcoming: { dateIso: string; count: number }[];
  hasCards: boolean;
}) {
  const todayIso = localTodayIso();
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <div className="bg-primary/10 text-primary mx-auto flex size-12 items-center justify-center rounded-full">
          {hasCards ? (
            <Sparkles aria-hidden className="size-6" />
          ) : (
            <BrainCircuit aria-hidden className="size-6" />
          )}
        </div>
        <CardTitle className="text-xl">
          {hasCards ? "Révisions à jour, revenez demain !" : title}
        </CardTitle>
        <CardDescription className="leading-relaxed">
          {hasCards
            ? "Toutes vos cartes sont programmées : la révision espacée fait remonter chaque notion juste avant que vous ne l'oubliiez."
            : "Vous n'avez pas encore de carte de révision."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4 text-sm leading-relaxed">
          <p className="font-medium">Comment ça marche ?</p>
          <p className="text-muted-foreground mt-1">
            Chaque question ratée en entraînement rejoint automatiquement vos révisions. Elle
            revient à intervalles croissants — {INTERVALS_LABEL} — tant que vous la réussissez, et
            repart de J+1 en cas d&apos;oubli. C&apos;est le moyen le plus efficace d&apos;ancrer la
            théorie à long terme.
          </p>
        </div>
        <UpcomingList upcoming={upcoming} todayIso={todayIso} />
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild variant="outline">
            <Link href="/dashboard">Retour au tableau de bord</Link>
          </Button>
          <Button asChild>
            <Link href="/entrainement">
              Faire un quiz d&apos;entraînement
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
