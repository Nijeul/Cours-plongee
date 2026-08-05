import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LevelBadge } from "@/components/layout/level-badge";
import { ModuleQuiz } from "@/components/quiz/module-quiz";
import { DISCLAIMER, MODULE_VALIDATION_THRESHOLD } from "@/content/data/reglementation";
import { CATALOG, getCatalogModule, getLevel, getModulesForLevel } from "@/lib/catalog";
import { loadQuestions, moduleExists } from "@/lib/content";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode?: string }>;
}

export function generateStaticParams() {
  return CATALOG.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const [{ slug }, { mode }] = await Promise.all([params, searchParams]);
  const catalogModule = getCatalogModule(slug);
  if (!catalogModule) return { title: "Entraînement" };
  const validation = mode === "validation";
  return {
    title: `${validation ? "Validation" : "Entraînement"} — ${catalogModule.title}`,
    description: validation
      ? `Test de validation du module « ${catalogModule.title} » : ${MODULE_VALIDATION_THRESHOLD} % de bonnes réponses pour valider vos acquis.`
      : `Quiz d'entraînement corrigé sur le module « ${catalogModule.title} ».`,
  };
}

export default async function EntrainementModulePage({ params, searchParams }: PageProps) {
  const [{ slug }, { mode }] = await Promise.all([params, searchParams]);
  const catalogModule = getCatalogModule(slug);
  if (!catalogModule) notFound();

  const validation = mode === "validation";
  const questions = loadQuestions(catalogModule.level).filter((q) => q.moduleSlug === slug);
  const backHref = `/entrainement/${catalogModule.level}`;

  // Étape suivante du parcours : le prochain module du niveau (s'il a son cours),
  // ou l'examen blanc du niveau quand on vient de valider le dernier module.
  const levelModules = getModulesForLevel(catalogModule.level);
  const nextModule = levelModules
    .filter((m) => m.order > catalogModule.order && moduleExists(m.slug))
    .at(0);
  const nextHref = nextModule ? `/cours/${nextModule.slug}` : `/examen/${catalogModule.level}`;
  const nextLabel = nextModule
    ? `Module suivant : ${nextModule.title}`
    : `Examen blanc ${getLevel(catalogModule.level).title}`;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <Link
          href={backHref}
          className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Entraînement du niveau
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            {validation ? "Test de validation" : "Entraînement"} — {catalogModule.title}
          </h1>
          <LevelBadge level={catalogModule.level} />
        </div>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          {validation
            ? `Aucune correction avant la fin : obtenez au moins ${MODULE_VALIDATION_THRESHOLD} % de bonnes réponses pour valider le module.`
            : "Chaque question est corrigée immédiatement, avec l'explication complète et un lien vers la section du cours."}
        </p>
      </header>

      {questions.length === 0 ? (
        <p className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm leading-relaxed">
          Ce module n&apos;a pas encore de questions : elles sont en cours de rédaction. Vous pouvez{" "}
          <Link
            href={`/cours/${catalogModule.slug}`}
            className="text-primary underline-offset-4 hover:underline"
          >
            relire le cours
          </Link>{" "}
          en attendant.
        </p>
      ) : (
        <ModuleQuiz
          level={catalogModule.level}
          moduleSlug={catalogModule.slug}
          questions={questions}
          mode={validation ? "validation" : "entrainement"}
          backHref={backHref}
          backLabel="Retour à l'entraînement"
          nextHref={nextHref}
          nextLabel={nextLabel}
          validationHref={
            validation ? undefined : `/entrainement/module/${catalogModule.slug}?mode=validation`
          }
        />
      )}

      <p className="text-muted-foreground mt-10 border-t pt-4 text-xs leading-relaxed">
        {DISCLAIMER}
      </p>
    </div>
  );
}
