import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Calculator,
  ClipboardCheck,
  Gauge,
  GraduationCap,
  Timer,
  Wind,
} from "lucide-react";

import { LevelBadge } from "@/components/layout/level-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getModulesForLevel, LEVELS } from "@/lib/catalog";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Cours structurés",
    description:
      "Des modules progressifs par niveau et par domaine, avec objectifs pédagogiques, formules et schémas.",
  },
  {
    icon: ClipboardCheck,
    title: "Entraînement corrigé",
    description:
      "QCM, calculs et vrai/faux avec correction argumentée et renvoi vers la section de cours concernée.",
  },
  {
    icon: CalendarClock,
    title: "Révision espacée",
    description:
      "Un système de répétition espacée reprend automatiquement vos erreurs aux bons intervalles (J+1, J+3, J+7…).",
  },
  {
    icon: Timer,
    title: "Examens blancs",
    description:
      "Des sessions chronométrées au format de chaque niveau, avec relevé de score par domaine.",
  },
] as const;

const TOOLS = [
  {
    icon: Calculator,
    title: "Simulateur de tables MN90",
    description:
      "Planifiez une plongée simple ou successive : paliers, DTR, groupe de plongée successive et majoration.",
  },
  {
    icon: Wind,
    title: "Autonomie en air",
    description:
      "Calculez votre consommation et votre autonomie selon le bloc, la pression, la réserve et la profondeur.",
  },
  {
    icon: Gauge,
    title: "Physique appliquée",
    description:
      "Manipulez les lois de Boyle-Mariotte, Dalton, Henry et Archimède avec des calculateurs pas à pas.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-primary text-sm font-semibold tracking-wide uppercase">
              FFESSM — du Niveau 1 au MF1
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance sm:text-5xl">
              La théorie de la plongée, expliquée et entraînée
            </h1>
            <p className="text-muted-foreground mt-4 text-base leading-relaxed sm:text-lg">
              Révisez la théorie du N1 au MF1 avec des cours clairs, entraînez-vous sur des
              questions corrigées et suivez votre progression jusqu&apos;à l&apos;examen.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/niveaux/n1">
                  Commencer par le Niveau 1
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard">Voir mon tableau de bord</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Niveaux */}
      <section id="niveaux" className="scroll-mt-16">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Choisissez votre niveau</h2>
            <p className="text-muted-foreground mt-2">
              Cinq parcours complets, du premier brevet au monitorat, conformes au Manuel de
              Formation Technique FFESSM.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEVELS.map((level) => {
              const moduleCount = getModulesForLevel(level.slug).length;
              return (
                <Link
                  key={level.slug}
                  href={`/niveaux/${level.slug}`}
                  aria-label={`${level.title} — ${level.subtitle}`}
                  className="group focus-visible:ring-ring/50 rounded-xl outline-none focus-visible:ring-[3px]"
                >
                  <Card className="h-full gap-4 transition-shadow group-hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <LevelBadge level={level.slug} />
                        <span className="text-muted-foreground text-xs">
                          {moduleCount} modules
                        </span>
                      </div>
                      <CardTitle className="mt-2 text-lg">{level.title}</CardTitle>
                      <CardDescription>{level.subtitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {level.description}
                      </p>
                      <p className="text-primary mt-4 inline-flex items-center gap-1 text-sm font-medium">
                        Découvrir le parcours
                        <ArrowRight
                          aria-hidden="true"
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                        />
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-muted/50 border-y">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Comment ça marche</h2>
            <p className="text-muted-foreground mt-2">
              Une méthode simple : apprendre, s&apos;entraîner, réviser au bon moment, puis se tester en
              conditions d&apos;examen.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="bg-card rounded-xl border p-5 shadow-sm">
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                  <feature.icon aria-hidden="true" className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outils */}
      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Des simulateurs pour manipuler les calculs
            </h2>
            <p className="text-muted-foreground mt-2">
              Les calculs d&apos;examen se comprennent en pratiquant : chaque simulateur détaille sa
              résolution pas à pas.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <div key={tool.title} className="bg-card rounded-xl border p-5 shadow-sm">
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                  <tool.icon aria-hidden="true" className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{tool.title}</h3>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-primary text-primary-foreground mt-12 flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
                <GraduationCap aria-hidden="true" className="size-6" />
                Prêt à passer votre prochain niveau ?
              </h2>
              <p className="text-primary-foreground/85 mt-1.5 text-sm sm:text-base">
                Choisissez votre niveau cible et suivez votre progression module par module.
              </p>
            </div>
            <Button asChild size="lg" variant="secondary" className="shrink-0">
              <Link href="/dashboard">
                Suivre ma progression
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
