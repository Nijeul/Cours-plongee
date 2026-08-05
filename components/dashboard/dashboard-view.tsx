"use client";

import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Check,
  Circle,
  CircleDot,
  GraduationCap,
  History,
  ListChecks,
  Play,
  Target,
  TrendingDown,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import {
  CompetenceRadar,
  SCORE_TONE_TEXT,
  scoreTone,
  type RadarDatum,
} from "@/components/dashboard/competence-radar";
import { formatRelativeFr, localTodayIso } from "@/components/dashboard/dates";
import { StatCard } from "@/components/dashboard/stat-card";
import { LevelBadge } from "@/components/layout/level-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { RADAR_DOMAINS } from "@/content/data/reglementation";
import { getCatalogModule, getDomain, getLevel, getModulesForLevel, isLevelSlug, LEVELS } from "@/lib/catalog";
import { dueCards } from "@/lib/calc/sm2";
import { useProgressStore } from "@/lib/progress";
import type {
  CatalogModule,
  DomainSlug,
  LevelSlug,
  ProgressSnapshot,
  QuizKind,
  UserModuleProgress,
} from "@/lib/types";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Props et types locaux
// ---------------------------------------------------------------------------

/** Métadonnées minimales d'une question, indexées par id (calculées côté serveur). */
export interface QuestionMetaEntry {
  domain: DomainSlug;
  moduleSlug: string;
}

interface DashboardViewProps {
  /** Slugs des modules dont le cours MDX est réellement disponible, par niveau. */
  availableModules: Record<LevelSlug, string[]>;
  /** Nombre de questions disponibles par niveau. */
  questionCounts: Record<LevelSlug, number>;
  /** questionId → { domaine, module } pour toutes les banques. */
  questionMeta: Record<string, QuestionMetaEntry>;
}

const DEFAULT_LEVEL: LevelSlug = "n1";

const KIND_LABELS: Record<QuizKind, string> = {
  entrainement: "Entraînement",
  validation: "Validation",
  examen: "Examen blanc",
  revision: "Révision",
};

const EMPTY_SNAPSHOT: ProgressSnapshot = {
  targetLevel: null,
  modules: [],
  attempts: [],
  srsCards: [],
  examSessions: [],
  bookmarks: [],
  notes: [],
};

interface HistoryEntry {
  id: string;
  typeLabel: string;
  title: string;
  level: LevelSlug;
  scorePercent: number;
  /** Défini uniquement pour les examens blancs. */
  passed?: boolean;
  dateIso: string;
}

interface WeakModule {
  module: CatalogModule;
  scorePercent: number;
  answered: number;
}

// ---------------------------------------------------------------------------
// Vue principale
// ---------------------------------------------------------------------------

export function DashboardView({ availableModules, questionCounts, questionMeta }: DashboardViewProps) {
  const { store, mode, loading } = useProgressStore();
  const [snapshot, setSnapshot] = React.useState<ProgressSnapshot | null>(null);
  const [snapshotLoading, setSnapshotLoading] = React.useState(true);
  const todayIso = React.useMemo(() => localTodayIso(), []);

  React.useEffect(() => {
    if (loading) return;
    let cancelled = false;
    store.getSnapshot().then(
      (s) => {
        if (!cancelled) {
          setSnapshot(s);
          setSnapshotLoading(false);
        }
      },
      () => {
        if (!cancelled) {
          setSnapshot(EMPTY_SNAPSHOT);
          setSnapshotLoading(false);
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [store, loading]);

  const snap = snapshot ?? EMPTY_SNAPSHOT;
  const targetLevel: LevelSlug = snap.targetLevel ?? DEFAULT_LEVEL;

  const onLevelChange = (value: string) => {
    if (!isLevelSlug(value)) return;
    setSnapshot((prev) => ({ ...(prev ?? EMPTY_SNAPSHOT), targetLevel: value }));
    void store.setTargetLevel(value);
  };

  // ----- Modules du niveau cible -------------------------------------------
  const levelModules = React.useMemo<CatalogModule[]>(() => {
    const available = new Set(availableModules[targetLevel] ?? []);
    return getModulesForLevel(targetLevel).filter((m) => available.has(m.slug));
  }, [availableModules, targetLevel]);

  const progressBySlug = React.useMemo(() => {
    const map = new Map<string, UserModuleProgress>();
    for (const p of snap.modules) map.set(p.moduleSlug, p);
    return map;
  }, [snap.modules]);

  const completedCount = levelModules.filter(
    (m) => progressBySlug.get(m.slug)?.status === "completed",
  ).length;
  const levelPercent =
    levelModules.length > 0 ? Math.round((completedCount / levelModules.length) * 100) : 0;

  // ----- Reprendre la lecture ----------------------------------------------
  const resume = React.useMemo(() => {
    const inProgress = snap.modules
      .filter((p) => p.status === "in_progress" && getCatalogModule(p.moduleSlug))
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
    const progress = inProgress[0];
    if (!progress) return null;
    const catalogModule = getCatalogModule(progress.moduleSlug);
    if (!catalogModule) return null;
    return { progress, module: catalogModule };
  }, [snap.modules]);

  const nextModule = React.useMemo(
    () => levelModules.find((m) => (progressBySlug.get(m.slug)?.status ?? "not_started") !== "completed") ?? null,
    [levelModules, progressBySlug],
  );

  // ----- Révision espacée ---------------------------------------------------
  const due = React.useMemo(() => dueCards(snap.srsCards, todayIso), [snap.srsCards, todayIso]);

  // ----- Radar de compétences ----------------------------------------------
  const radarData = React.useMemo<RadarDatum[]>(() => {
    const totals = new Map<DomainSlug, { correct: number; total: number }>();
    const domains = RADAR_DOMAINS[targetLevel];
    for (const d of domains) totals.set(d, { correct: 0, total: 0 });

    for (const attempt of snap.attempts) {
      if (attempt.level !== targetLevel) continue;
      for (const answer of attempt.answers) {
        const meta = questionMeta[answer.questionId];
        if (!meta) continue;
        const bucket = totals.get(meta.domain);
        if (!bucket) continue;
        bucket.total += 1;
        if (answer.correct) bucket.correct += 1;
      }
    }
    for (const session of snap.examSessions) {
      if (session.level !== targetLevel) continue;
      for (const result of session.byDomain) {
        const bucket = totals.get(result.domain);
        if (!bucket) continue;
        bucket.total += result.maxScore;
        bucket.correct += result.score;
      }
    }

    return domains.map((domain) => {
      const bucket = totals.get(domain) ?? { correct: 0, total: 0 };
      const evaluated = bucket.total > 0;
      return {
        domain,
        label: getDomain(domain).shortTitle,
        score: evaluated ? Math.round((bucket.correct / bucket.total) * 100) : 0,
        evaluated,
        answered: bucket.total,
      };
    });
  }, [snap.attempts, snap.examSessions, questionMeta, targetLevel]);

  // ----- Points faibles (modules du niveau cible) --------------------------
  const weakModules = React.useMemo<WeakModule[]>(() => {
    const totals = new Map<string, { correct: number; total: number }>();
    const answers = [
      ...snap.attempts.flatMap((a) => a.answers),
      ...snap.examSessions.flatMap((s) => s.answers),
    ];
    for (const answer of answers) {
      const meta = questionMeta[answer.questionId];
      if (!meta) continue;
      const catalogModule = getCatalogModule(meta.moduleSlug);
      if (!catalogModule || catalogModule.level !== targetLevel) continue;
      const bucket = totals.get(meta.moduleSlug) ?? { correct: 0, total: 0 };
      bucket.total += 1;
      if (answer.correct) bucket.correct += 1;
      totals.set(meta.moduleSlug, bucket);
    }
    return [...totals.entries()]
      .map(([slug, bucket]) => {
        const catalogModule = getCatalogModule(slug);
        if (!catalogModule) return null;
        return {
          module: catalogModule,
          scorePercent: Math.round((bucket.correct / bucket.total) * 100),
          answered: bucket.total,
        };
      })
      .filter((w): w is WeakModule => w !== null)
      .sort((a, b) => a.scorePercent - b.scorePercent)
      .slice(0, 3);
  }, [snap.attempts, snap.examSessions, questionMeta, targetLevel]);

  // ----- Historique ---------------------------------------------------------
  const history = React.useMemo<HistoryEntry[]>(() => {
    const entries: HistoryEntry[] = [];
    for (const attempt of snap.attempts) {
      if (attempt.maxScore <= 0) continue;
      // Les examens blancs sont listés via leur session (avec réussite/échec) :
      // la tentative jumelle de kind « examen » ferait doublon.
      if (attempt.kind === "examen") continue;
      const moduleTitle = attempt.moduleSlug
        ? (getCatalogModule(attempt.moduleSlug)?.title ?? attempt.moduleSlug)
        : `Série ${getLevel(attempt.level).title}`;
      entries.push({
        id: `attempt-${attempt.id}`,
        typeLabel: KIND_LABELS[attempt.kind],
        title: moduleTitle,
        level: attempt.level,
        scorePercent: Math.round((attempt.score / attempt.maxScore) * 100),
        dateIso: attempt.finishedAt ?? attempt.startedAt,
      });
    }
    for (const session of snap.examSessions) {
      if (session.maxScore <= 0) continue;
      entries.push({
        id: `exam-${session.id}`,
        typeLabel: "Examen blanc",
        title: getLevel(session.level).title,
        level: session.level,
        scorePercent: Math.round((session.score / session.maxScore) * 100),
        passed: session.passed,
        dateIso: session.finishedAt ?? session.startedAt,
      });
    }
    return entries.sort((a, b) => (a.dateIso < b.dateIso ? 1 : -1)).slice(0, 8);
  }, [snap.attempts, snap.examSessions]);

  const examsPassed = snap.examSessions.filter((s) => s.passed).length;

  // ----- Rendu --------------------------------------------------------------
  if (loading || snapshotLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* En-tête : bonjour + sélecteur de niveau cible */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Bonjour !</h1>
          <p className="text-muted-foreground mt-1 leading-relaxed">
            Voici où vous en êtes dans votre préparation.
          </p>
        </div>
        <div className="w-full sm:w-64">
          <label
            htmlFor="dashboard-level"
            className="text-muted-foreground mb-1.5 block text-xs font-medium"
          >
            Niveau préparé
          </label>
          <Select value={targetLevel} onValueChange={onLevelChange}>
            <SelectTrigger id="dashboard-level" className="w-full">
              <SelectValue placeholder="Choisir un niveau" />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((level) => (
                <SelectItem key={level.slug} value={level.slug}>
                  {level.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Encart mode invité */}
      {mode === "local" ? (
        <div className="border-primary/25 bg-primary/5 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <UserPlus aria-hidden className="text-primary mt-0.5 size-5 shrink-0" />
            <p className="text-sm leading-relaxed">
              <span className="font-medium">Mode invité :</span> votre progression est enregistrée
              sur cet appareil uniquement. Créez un compte gratuit pour la retrouver partout.
            </p>
          </div>
          <Button asChild size="sm" className="shrink-0">
            <Link href="/inscription">Créer un compte</Link>
          </Button>
        </div>
      ) : null}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={<ListChecks className="size-4" />}
          label="Questions au programme"
          value={questionCounts[targetLevel]}
          hint={getLevel(targetLevel).subtitle}
        />
        <StatCard
          icon={<Target className="size-4" />}
          label="Quiz réalisés"
          value={snap.attempts.filter((a) => a.kind !== "examen").length}
          hint="entraînements, validations et révisions"
        />
        <StatCard
          icon={<GraduationCap className="size-4" />}
          label="Examens blancs réussis"
          value={`${examsPassed} / ${snap.examSessions.length}`}
          hint={snap.examSessions.length === 0 ? "aucun examen passé" : undefined}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Reprendre */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Play aria-hidden className="text-primary size-4" />
              Reprendre
            </CardTitle>
            <CardDescription>
              {resume
                ? "Votre dernier module en cours de lecture."
                : "Aucun module en cours : lancez-vous !"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {resume ? (
              <>
                <div className="flex items-center gap-2">
                  <LevelBadge level={resume.module.level} />
                  <p className="min-w-0 flex-1 truncate font-medium">{resume.module.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={resume.progress.percent} className="flex-1" />
                  <span className="text-muted-foreground text-xs font-medium tabular-nums">
                    {resume.progress.percent} %
                  </span>
                </div>
                <Button asChild className="w-full sm:w-auto">
                  <Link
                    href={`/cours/${resume.module.slug}${
                      resume.progress.lastAnchor ? `#${resume.progress.lastAnchor}` : ""
                    }`}
                  >
                    Reprendre la lecture
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </Button>
              </>
            ) : nextModule ? (
              <>
                <div className="flex items-center gap-2">
                  <LevelBadge level={nextModule.level} />
                  <p className="min-w-0 flex-1 truncate font-medium">{nextModule.title}</p>
                </div>
                <Button asChild className="w-full sm:w-auto">
                  <Link href={`/cours/${nextModule.slug}`}>
                    Commencer ce module
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <p className="text-muted-foreground text-sm leading-relaxed">
                Les cours de ce niveau sont en cours de rédaction.{" "}
                <Link href="/niveaux" className="text-primary font-medium underline-offset-4 hover:underline">
                  Découvrir les autres niveaux
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* À réviser aujourd'hui */}
        <Card className={cn(due.length > 0 && "border-primary/40 bg-primary/5")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock aria-hidden className="text-primary size-4" />
              À réviser aujourd&apos;hui
            </CardTitle>
            <CardDescription>
              Révision espacée : les questions ratées reviennent au bon moment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-bold tracking-tight">
              {due.length}
              <span className="text-muted-foreground ml-2 text-sm font-normal">
                {due.length > 1 ? "cartes dues" : "carte due"}
              </span>
            </p>
            {due.length > 0 ? (
              <Button asChild className="w-full sm:w-auto">
                <Link href="/revision">
                  Lancer la session de révision
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
            ) : (
              <p className="text-muted-foreground text-sm leading-relaxed">
                Rien à réviser pour le moment.{" "}
                <Link
                  href="/revision"
                  className="text-primary font-medium underline-offset-4 hover:underline"
                >
                  Voir mes prochaines échéances
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progression du niveau cible */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen aria-hidden className="text-primary size-4" />
            Progression — {getLevel(targetLevel).title}
          </CardTitle>
          <CardDescription>
            {completedCount} / {levelModules.length} modules complétés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Progress value={levelPercent} className="flex-1" />
            <span className="text-sm font-semibold tabular-nums">{levelPercent} %</span>
          </div>
          {levelModules.length > 0 ? (
            <ul className="divide-y">
              {levelModules.map((m) => {
                const p = progressBySlug.get(m.slug);
                const status = p?.status ?? "not_started";
                return (
                  <li key={m.slug} className="flex items-center gap-3 py-2">
                    {status === "completed" ? (
                      <Check
                        aria-hidden
                        className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                      />
                    ) : status === "in_progress" ? (
                      <CircleDot
                        aria-hidden
                        className="size-4 shrink-0 text-amber-600 dark:text-amber-400"
                      />
                    ) : (
                      <Circle aria-hidden className="text-muted-foreground/50 size-4 shrink-0" />
                    )}
                    <Link
                      href={`/cours/${m.slug}`}
                      className="hover:text-primary min-w-0 flex-1 truncate text-sm font-medium transition-colors"
                    >
                      {m.title}
                    </Link>
                    <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                      {status === "completed"
                        ? "complété"
                        : status === "in_progress"
                          ? `${p?.percent ?? 0} %`
                          : "à faire"}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm leading-relaxed">
              Les modules de ce niveau sont en cours de rédaction.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Radar de compétences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target aria-hidden className="text-primary size-4" />
              Radar de compétences
            </CardTitle>
            <CardDescription>
              % de bonnes réponses par domaine du {getLevel(targetLevel).title}, quiz et examens
              blancs confondus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompetenceRadar data={radarData} />
          </CardContent>
        </Card>

        {/* Points faibles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingDown aria-hidden className="text-primary size-4" />
              Points faibles
            </CardTitle>
            <CardDescription>
              Les modules où vos scores sont les plus bas : entraînez-vous en priorité.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {weakModules.length > 0 ? (
              <ul className="space-y-3">
                {weakModules.map(({ module: m, scorePercent, answered }) => (
                  <li
                    key={m.slug}
                    className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{m.title}</p>
                      <p className="text-muted-foreground text-xs">
                        {getDomain(m.domain).shortTitle} ·{" "}
                        <span className={cn("font-semibold", SCORE_TONE_TEXT[scoreTone(scorePercent)])}>
                          {scorePercent} %
                        </span>{" "}
                        sur {answered} {answered > 1 ? "réponses" : "réponse"}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="shrink-0">
                      <Link href={`/entrainement/module/${m.slug}`}>S&apos;entraîner</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm leading-relaxed">
                Pas encore assez de données pour identifier vos points faibles.{" "}
                <Link
                  href={`/entrainement/${targetLevel}`}
                  className="text-primary font-medium underline-offset-4 hover:underline"
                >
                  Faire un quiz d&apos;entraînement
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Historique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <History aria-hidden className="text-primary size-4" />
            Historique
          </CardTitle>
          <CardDescription>Vos dernières tentatives, tous niveaux confondus.</CardDescription>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <ul className="divide-y">
              {history.map((entry) => (
                <li key={entry.id} className="flex items-center gap-3 py-2.5">
                  <LevelBadge level={entry.level} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{entry.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {entry.typeLabel} · {formatRelativeFr(entry.dateIso)}
                    </p>
                  </div>
                  {entry.passed !== undefined ? (
                    <Badge
                      variant="outline"
                      className={cn(
                        entry.passed
                          ? "border-emerald-600/30 text-emerald-700 dark:text-emerald-400"
                          : "border-red-600/30 text-red-700 dark:text-red-400",
                      )}
                    >
                      {entry.passed ? "Réussi" : "Échoué"}
                    </Badge>
                  ) : null}
                  <span
                    className={cn(
                      "shrink-0 text-sm font-semibold tabular-nums",
                      SCORE_TONE_TEXT[scoreTone(entry.scorePercent)],
                    )}
                  >
                    {entry.scorePercent} %
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm leading-relaxed">
              Aucune tentative pour l&apos;instant : commencez par un{" "}
              <Link
                href={`/entrainement/${targetLevel}`}
                className="text-primary font-medium underline-offset-4 hover:underline"
              >
                quiz d&apos;entraînement
              </Link>{" "}
              ou un{" "}
              <Link
                href="/examen"
                className="text-primary font-medium underline-offset-4 hover:underline"
              >
                examen blanc
              </Link>
              .
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Squelette de chargement
// ---------------------------------------------------------------------------

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Chargement du tableau de bord">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-full sm:w-64" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-20 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-44 rounded-xl" />
        <Skeleton className="h-44 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}
