import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LevelBadge } from "@/components/layout/level-badge";
import { ExamSession } from "@/components/quiz/exam-session";
import { DISCLAIMER, EXAM_CONFIGS } from "@/content/data/reglementation";
import { getLevel, isLevelSlug, LEVELS } from "@/lib/catalog";
import { loadQuestions } from "@/lib/content";

interface PageParams {
  params: Promise<{ level: string }>;
}

export function generateStaticParams() {
  return LEVELS.map((l) => ({ level: l.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { level } = await params;
  if (!isLevelSlug(level)) return { title: "Examen blanc" };
  const config = EXAM_CONFIGS[level];
  return {
    title: config.title,
    description: `${config.title} : ${config.questionCount} questions en ${config.durationMinutes} minutes, correction détaillée et relevé par domaine.`,
  };
}

export default async function ExamenNiveauPage({ params }: PageParams) {
  const { level } = await params;
  if (!isLevelSlug(level)) notFound();

  const info = getLevel(level);
  const config = EXAM_CONFIGS[level];
  const questions = loadQuestions(level);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <Link
          href="/examen"
          className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Tous les examens blancs
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{config.title}</h1>
          <LevelBadge level={level} />
        </div>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{info.subtitle}</p>
      </header>

      {questions.length === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm leading-relaxed">
          Les questions de ce niveau sont en cours de rédaction : l&apos;examen blanc sera bientôt
          disponible. En attendant, entraînez-vous sur les{" "}
          <Link href="/simulateurs" className="text-primary underline-offset-4 hover:underline">
            simulateurs
          </Link>
          .
        </p>
      ) : (
        <ExamSession config={config} questions={questions} />
      )}

      <p className="text-muted-foreground mt-10 border-t pt-4 text-xs leading-relaxed">
        {DISCLAIMER}
      </p>
    </div>
  );
}
