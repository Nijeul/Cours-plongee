import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { LevelBadge } from "@/components/layout/level-badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DISCLAIMER } from "@/content/data/reglementation";
import { LEVELS } from "@/lib/catalog";
import { loadQuestions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Entraînement",
  description:
    "Quiz corrigés question par question pour réviser la théorie de la plongée : séries au hasard ou par module, du N1 au MF1.",
};

export default function EntrainementPage() {
  const levels = LEVELS.map((level) => ({
    level,
    questionCount: loadQuestions(level.slug).length,
  }));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Entraînement</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          Des quiz corrigés immédiatement, question par question : choisissez votre niveau, puis une
          série au hasard ou un module précis. Chaque question ratée rejoint automatiquement vos
          révisions espacées.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {levels.map(({ level, questionCount }) =>
          questionCount > 0 ? (
            <Link
              key={level.slug}
              href={`/entrainement/${level.slug}`}
              className="group focus-visible:ring-ring rounded-xl outline-none focus-visible:ring-2"
            >
              <Card className="hover:border-primary/40 h-full transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <LevelBadge level={level.slug} />
                    <ArrowRight
                      aria-hidden
                      className="text-muted-foreground group-hover:text-foreground size-4 transition-colors"
                    />
                  </div>
                  <CardTitle className="text-lg">{level.title}</CardTitle>
                  <CardDescription>
                    {level.subtitle}
                    <span className="text-foreground/80 mt-1 block text-xs font-medium">
                      {questionCount} questions disponibles
                    </span>
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ) : (
            <Card key={level.slug} className="h-full opacity-70">
              <CardHeader>
                <LevelBadge level={level.slug} />
                <CardTitle className="text-lg">{level.title}</CardTitle>
                <CardDescription>
                  {level.subtitle}
                  <span className="mt-1 block text-xs font-medium">
                    Questions en cours de rédaction — bientôt disponibles.
                  </span>
                </CardDescription>
              </CardHeader>
            </Card>
          ),
        )}
      </div>

      <p className="text-muted-foreground mt-10 border-t pt-4 text-xs leading-relaxed">
        {DISCLAIMER}
      </p>
    </div>
  );
}
