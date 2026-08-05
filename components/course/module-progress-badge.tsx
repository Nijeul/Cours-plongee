"use client";

import * as React from "react";
import { CircleCheck } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useProgressStore } from "@/lib/progress";
import type { UserModuleProgress } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ModuleProgressBadgeProps {
  moduleSlug: string;
  className?: string;
}

/**
 * Badge d&apos;état de progression d&apos;un module, injecté côté client dans les
 * cartes (pages serveur) : non commencé / en cours x % / validé.
 */
export function ModuleProgressBadge({ moduleSlug, className }: ModuleProgressBadgeProps) {
  const { store, loading } = useProgressStore();
  const [progress, setProgress] = React.useState<UserModuleProgress | null | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (loading) return;
    let cancelled = false;
    store
      .getSnapshot()
      .then((snapshot) => {
        if (cancelled) return;
        setProgress(snapshot.modules.find((m) => m.moduleSlug === moduleSlug) ?? null);
      })
      .catch(() => {
        if (!cancelled) setProgress(null);
      });
    return () => {
      cancelled = true;
    };
  }, [store, loading, moduleSlug]);

  if (loading || progress === undefined) {
    return <Skeleton className={cn("h-5 w-24 rounded-md", className)} />;
  }

  const base =
    "inline-flex w-fit shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap";

  if (progress?.status === "completed") {
    return (
      <span
        className={cn(
          base,
          "border-emerald-600/25 bg-emerald-50 text-emerald-800 dark:border-emerald-400/25 dark:bg-emerald-950/60 dark:text-emerald-300",
          className
        )}
      >
        <CircleCheck aria-hidden="true" className="size-3" />
        Validé
      </span>
    );
  }

  if (progress && (progress.status === "in_progress" || progress.percent > 0)) {
    return (
      <span
        className={cn(
          base,
          "border-blue-600/25 bg-blue-50 text-blue-800 dark:border-blue-400/25 dark:bg-blue-950/60 dark:text-blue-300",
          className
        )}
      >
        En cours · {Math.round(progress.percent)}&nbsp;%
      </span>
    );
  }

  return (
    <span className={cn(base, "border-border bg-muted text-muted-foreground", className)}>
      Non commencé
    </span>
  );
}
