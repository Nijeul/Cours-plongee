import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  Clock,
  ListOrdered,
  Target,
} from "lucide-react";

import { ReadingTracker } from "@/components/course/reading-tracker";
import { SectionTools } from "@/components/course/section-tools";
import { LevelBadge } from "@/components/layout/level-badge";
import { MdxContent } from "@/components/mdx/mdx-content";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MODULE_VALIDATION_THRESHOLD } from "@/content/data/reglementation";
import { getCatalogModule, getDomain, getLevel } from "@/lib/catalog";
import { availableModulesForLevel, loadModule, moduleExists } from "@/lib/content";
import { LEVEL_SLUGS } from "@/lib/types";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return LEVEL_SLUGS.flatMap((level) =>
    availableModulesForLevel(level).map((module) => ({ slug: module.slug }))
  );
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const catalog = getCatalogModule(slug);
  if (!catalog || !moduleExists(slug)) return {};
  return {
    title: `${catalog.title} — ${getLevel(catalog.level).title}`,
    description: catalog.description,
  };
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const catalog = getCatalogModule(slug);
  if (!catalog || !moduleExists(slug)) notFound();

  const { meta, sections, source } = loadModule(slug);
  const level = getLevel(catalog.level);
  const domain = getDomain(catalog.domain);

  const levelModules = availableModulesForLevel(catalog.level);
  const index = levelModules.findIndex((m) => m.slug === slug);
  const previous = index > 0 ? levelModules[index - 1] : null;
  const next = index >= 0 && index < levelModules.length - 1 ? levelModules[index + 1] : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      {/* En-tête du module */}
      <header className="mb-8">
        <Link
          href={`/niveaux/${catalog.level}`}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {level.title}
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <LevelBadge level={catalog.level} />
          <span className="bg-secondary text-secondary-foreground inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
            {domain.shortTitle}
          </span>
          <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
            <Clock aria-hidden="true" className="size-3.5" />
            {formatDuration(catalog.durationMinutes)}
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          {meta.title}
        </h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">{meta.description}</p>
      </header>

      {/* Objectifs pédagogiques */}
      {meta.objectives.length > 0 ? (
        <Card className="mb-6 gap-3 py-4">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target aria-hidden="true" className="text-primary size-4 shrink-0" />
              Objectifs du module
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pt-0 sm:px-6">
            <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
              {meta.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}

      {/* Sommaire + outils (marque-pages, notes) */}
      {sections.length > 0 ? (
        <Card className="mb-8 gap-3 py-4">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="flex items-center gap-2 text-base">
              <ListOrdered aria-hidden="true" className="text-primary size-4 shrink-0" />
              Sommaire
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pt-0 sm:px-6">
            <SectionTools moduleSlug={catalog.slug} sections={sections} />
          </CardContent>
        </Card>
      ) : null}

      {/* Contenu du cours */}
      <article aria-label={meta.title}>
        <MdxContent source={source} />
      </article>

      {/* Suivi de lecture (client, invisible hors bouton de reprise) */}
      <ReadingTracker moduleSlug={catalog.slug} sections={sections} />

      {/* Validation du module */}
      <div className="border-primary/30 bg-primary/5 mt-10 rounded-xl border border-dashed p-4 sm:p-6">
        <h2 className="text-base font-semibold">Prêt à valider ce module&nbsp;?</h2>
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
          Un test corrigé sur les notions du module : {MODULE_VALIDATION_THRESHOLD}&nbsp;% de
          bonnes réponses valident le module dans votre progression.
        </p>
        <Button asChild className="mt-3">
          <Link href={`/entrainement/module/${catalog.slug}?mode=validation`}>
            <ClipboardCheck aria-hidden="true" className="size-4" />
            Valider ce module
          </Link>
        </Button>
      </div>

      {/* Sources */}
      {meta.sources.length > 0 ? (
        <section aria-label="Sources" className="mt-8 border-t pt-4">
          <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Sources
          </h2>
          <ul className="text-muted-foreground mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed">
            {meta.sources.map((sourceItem) => (
              <li key={sourceItem}>{sourceItem}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Navigation précédent / suivant */}
      <nav aria-label="Modules voisins" className="mt-8 grid gap-3 sm:grid-cols-2">
        {previous ? (
          <Link
            href={`/cours/${previous.slug}`}
            className="hover:border-primary/40 group rounded-xl border p-4 transition-colors"
          >
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              Module précédent
            </span>
            <span className="group-hover:text-primary mt-1 block text-sm font-medium transition-colors">
              {previous.title}
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" className="hidden sm:block" />
        )}
        {next ? (
          <Link
            href={`/cours/${next.slug}`}
            className="hover:border-primary/40 group rounded-xl border p-4 text-right transition-colors sm:col-start-2"
          >
            <span className="text-muted-foreground flex items-center justify-end gap-1 text-xs">
              Module suivant
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </span>
            <span className="group-hover:text-primary mt-1 block text-sm font-medium transition-colors">
              {next.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </div>
  );
}
