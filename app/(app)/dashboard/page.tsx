import type { Metadata } from "next";

import { DashboardView, type QuestionMetaEntry } from "@/components/dashboard/dashboard-view";
import { DISCLAIMER } from "@/content/data/reglementation";
import { LEVEL_SLUGS, type LevelSlug } from "@/lib/types";
import { availableModulesForLevel, loadAllQuestions, loadQuestions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description:
    "Suivez votre préparation à la théorie plongée : progression par module, radar de compétences, révisions espacées et historique de vos quiz.",
};

export default function DashboardPage() {
  const availableModules = Object.fromEntries(
    LEVEL_SLUGS.map((level) => [level, availableModulesForLevel(level).map((m) => m.slug)]),
  ) as Record<LevelSlug, string[]>;

  const questionCounts = Object.fromEntries(
    LEVEL_SLUGS.map((level) => [level, loadQuestions(level).length]),
  ) as Record<LevelSlug, number>;

  const questionMeta: Record<string, QuestionMetaEntry> = {};
  for (const question of loadAllQuestions()) {
    questionMeta[question.id] = { domain: question.domain, moduleSlug: question.moduleSlug };
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:py-10">
      <DashboardView
        availableModules={availableModules}
        questionCounts={questionCounts}
        questionMeta={questionMeta}
      />
      <p className="text-muted-foreground mt-10 border-t pt-4 text-xs leading-relaxed">
        {DISCLAIMER}
      </p>
    </div>
  );
}
