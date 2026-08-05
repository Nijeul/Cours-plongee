import { ArrowRight, Clock, ListChecks, Target } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { LevelBadge } from "@/components/layout/level-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DISCLAIMER, EXAM_CONFIGS } from "@/content/data/reglementation";
import { LEVELS } from "@/lib/catalog";
import { loadQuestions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Examens blancs",
  description:
    "Examens blancs chronométrés du N1 au MF1 : tirage pondéré par domaine, correction détaillée et relevé de points par épreuve.",
};

export default function ExamenPage() {
  const exams = LEVELS.map((level) => ({
    level,
    config: EXAM_CONFIGS[level.slug],
    questionCount: loadQuestions(level.slug).length,
  }));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Examens blancs</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          Mettez-vous en conditions d&apos;examen : questions tirées au sort et pondérées par
          domaine, chronomètre, correction uniquement à la fin avec relevé détaillé par domaine.
        </p>
      </header>

      <div className="space-y-4">
        {exams.map(({ level, config, questionCount }) => (
          <Card key={level.slug}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <LevelBadge level={level.slug} />
                <CardTitle className="text-lg">{config.title}</CardTitle>
              </div>
              <CardDescription>{level.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <ListChecks aria-hidden className="text-muted-foreground size-4" />
                  <dt className="sr-only">Nombre de questions</dt>
                  <dd className="font-medium tabular-nums">{config.questionCount} questions</dd>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock aria-hidden className="text-muted-foreground size-4" />
                  <dt className="sr-only">Durée</dt>
                  <dd className="font-medium tabular-nums">{config.durationMinutes} min</dd>
                </div>
                <div className="flex items-center gap-1.5">
                  <Target aria-hidden className="text-muted-foreground size-4" />
                  <dt className="sr-only">Seuil de réussite</dt>
                  <dd className="font-medium tabular-nums">Seuil : {config.passThreshold} %</dd>
                </div>
              </dl>
              <p className="text-muted-foreground border-l-2 pl-3 text-xs leading-relaxed">
                {config.note}
              </p>
              {questionCount > 0 ? (
                <Link
                  href={`/examen/${level.slug}`}
                  className="text-primary inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
                >
                  Commencer l&apos;examen blanc
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Questions en cours de rédaction — cet examen blanc sera bientôt disponible.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-muted-foreground mt-10 border-t pt-4 text-xs leading-relaxed">
        {DISCLAIMER}
      </p>
    </div>
  );
}
