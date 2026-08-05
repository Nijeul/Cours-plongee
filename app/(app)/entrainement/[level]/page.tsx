import { ArrowLeft, ArrowRight, BadgeCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LevelBadge } from "@/components/layout/level-badge";
import { TrainingPicker } from "@/components/quiz/training-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DISCLAIMER } from "@/content/data/reglementation";
import { getLevel, getModulesForLevel, isLevelSlug, LEVELS } from "@/lib/catalog";
import { loadQuestions } from "@/lib/content";

interface PageParams {
  params: Promise<{ level: string }>;
}

export function generateStaticParams() {
  return LEVELS.map((l) => ({ level: l.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { level } = await params;
  if (!isLevelSlug(level)) return { title: "Entraînement" };
  const info = getLevel(level);
  return {
    title: `Entraînement ${info.title}`,
    description: `Quiz corrigés pour réviser la théorie du ${info.title} (${info.subtitle}) : séries au hasard ou par module.`,
  };
}

export default async function EntrainementNiveauPage({ params }: PageParams) {
  const { level } = await params;
  if (!isLevelSlug(level)) notFound();

  const info = getLevel(level);
  const questions = loadQuestions(level);
  const modules = getModulesForLevel(level)
    .map((m) => ({
      ...m,
      questionCount: questions.filter((q) => q.moduleSlug === m.slug).length,
    }))
    .filter((m) => m.questionCount > 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <Link
          href="/entrainement"
          className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Tous les niveaux
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Entraînement {info.title}
          </h1>
          <LevelBadge level={level} />
        </div>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          {questions.length} questions corrigées couvrent ce niveau. Lancez une série au hasard ou
          ciblez un module précis.
        </p>
      </header>

      {questions.length === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm leading-relaxed">
          Les questions de ce niveau sont en cours de rédaction. Revenez bientôt, ou explorez les{" "}
          <Link href="/simulateurs" className="text-primary underline-offset-4 hover:underline">
            simulateurs
          </Link>{" "}
          en attendant.
        </p>
      ) : (
        <div className="space-y-8">
          <TrainingPicker level={level} questions={questions} />

          {modules.length > 0 ? (
            <section aria-labelledby="modules-titre" className="space-y-3">
              <h2 id="modules-titre" className="text-lg font-semibold">
                Par module
              </h2>
              <Card>
                <CardContent className="divide-y p-0">
                  {modules.map((m) => (
                    <div
                      key={m.slug}
                      className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{m.title}</p>
                        <p className="text-muted-foreground text-xs">
                          {m.questionCount} question{m.questionCount > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Link
                          href={`/entrainement/module/${m.slug}`}
                          className="text-primary inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
                        >
                          S&apos;entraîner
                          <ArrowRight aria-hidden className="size-3.5" />
                        </Link>
                        <Link
                          href={`/entrainement/module/${m.slug}?mode=validation`}
                          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
                        >
                          <BadgeCheck aria-hidden className="size-3.5" />
                          Valider
                        </Link>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          ) : null}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prêt pour l&apos;examen blanc ?</CardTitle>
              <CardDescription>
                Testez-vous en conditions réelles : série pondérée par domaine, chronomètre et
                correction uniquement à la fin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/examen/${level}`}
                className="text-primary inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline"
              >
                Examen blanc {info.title}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      )}

      <p className="text-muted-foreground mt-10 border-t pt-4 text-xs leading-relaxed">
        {DISCLAIMER}
      </p>
    </div>
  );
}
