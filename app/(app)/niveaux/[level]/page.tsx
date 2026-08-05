import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipboardCheck, Clock, GraduationCap, Hourglass, Lock } from "lucide-react";

import { ModuleProgressBadge } from "@/components/course/module-progress-badge";
import { LevelBadge } from "@/components/layout/level-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCatalogModule, getDomain, getLevel, getModulesForLevel, isLevelSlug, LEVELS } from "@/lib/catalog";
import { availableModulesForLevel } from "@/lib/content";
import type { CatalogModule } from "@/lib/types";

interface LevelPageProps {
  params: Promise<{ level: string }>;
}

export function generateStaticParams() {
  return LEVELS.map((level) => ({ level: level.slug }));
}

export async function generateMetadata({ params }: LevelPageProps): Promise<Metadata> {
  const { level } = await params;
  if (!isLevelSlug(level)) return {};
  const info = getLevel(level);
  return {
    title: `${info.title} — ${info.subtitle}`,
    description: info.description,
  };
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}

function prerequisiteTitles(module: CatalogModule): string[] {
  return module.prerequisites
    .map((slug) => getCatalogModule(slug)?.title)
    .filter((title): title is string => Boolean(title));
}

function ModuleCardBody({
  module,
  available,
}: {
  module: CatalogModule;
  available: boolean;
}) {
  const domain = getDomain(module.domain);
  const prerequisites = prerequisiteTitles(module);
  return (
    <>
      <CardHeader className="px-4 sm:px-6">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="bg-primary/10 text-primary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums"
          >
            {module.order}
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
              <CardTitle className="text-base leading-snug">{module.title}</CardTitle>
              {available ? (
                <ModuleProgressBadge moduleSlug={module.slug} />
              ) : (
                <span className="border-border bg-muted text-muted-foreground inline-flex w-fit shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap">
                  <Hourglass aria-hidden="true" className="size-3" />
                  Bientôt disponible
                </span>
              )}
            </div>
            <CardDescription className="leading-relaxed">
              {module.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-0 sm:px-6">
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1.5 pl-10 text-xs">
          <span className="bg-secondary text-secondary-foreground inline-flex items-center rounded-full border px-2 py-0.5 font-medium">
            {domain.shortTitle}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden="true" className="size-3.5" />
            {formatDuration(module.durationMinutes)}
          </span>
          {prerequisites.length > 0 ? (
            <span className="inline-flex items-center gap-1">
              <Lock aria-hidden="true" className="size-3.5 shrink-0" />
              Prérequis&nbsp;: {prerequisites.join(", ")}
            </span>
          ) : null}
        </div>
      </CardContent>
    </>
  );
}

export default async function LevelPage({ params }: LevelPageProps) {
  const { level } = await params;
  if (!isLevelSlug(level)) notFound();

  const info = getLevel(level);
  const modules = getModulesForLevel(level);
  const availableSlugs = new Set(availableModulesForLevel(level).map((m) => m.slug));
  const totalMinutes = modules.reduce((sum, m) => sum + m.durationMinutes, 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={level} />
          <p className="text-muted-foreground text-sm font-medium">{info.subtitle}</p>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{info.title}</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">{info.description}</p>
        <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-sm">
          <Clock aria-hidden="true" className="size-4" />
          {modules.length} modules · environ {formatDuration(totalMinutes)} de cours
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={`/examen/${level}`}>
              <GraduationCap aria-hidden="true" className="size-4" />
              Examen blanc {info.title}
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/entrainement/${level}`}>
              <ClipboardCheck aria-hidden="true" className="size-4" />
              S&apos;entraîner
            </Link>
          </Button>
        </div>
      </header>

      <section aria-label={`Modules du ${info.title}`}>
        <ol className="space-y-3">
          {modules.map((module) => {
            const available = availableSlugs.has(module.slug);
            return (
              <li key={module.slug}>
                {available ? (
                  <Link
                    href={`/cours/${module.slug}`}
                    className="group block rounded-xl focus-visible:outline-none"
                  >
                    <Card className="group-hover:border-primary/40 gap-3 py-4 transition-colors group-hover:shadow-sm">
                      <ModuleCardBody module={module} available />
                    </Card>
                  </Link>
                ) : (
                  <Card
                    aria-disabled="true"
                    className="bg-muted/40 gap-3 py-4 opacity-70 shadow-none"
                  >
                    <ModuleCardBody module={module} available={false} />
                  </Card>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
