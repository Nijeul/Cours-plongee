"use client";

import * as React from "react";
import { CornerDownRight, X } from "lucide-react";

import { useProgressStore } from "@/lib/progress";
import type { SectionRef, UserModuleProgress } from "@/lib/types";

interface ReadingTrackerProps {
  moduleSlug: string;
  /** Sections h2 du module (ids présents dans le DOM après rendu du MDX). */
  sections: SectionRef[];
}

/**
 * Suivi de lecture d&apos;un module de cours :
 * - IntersectionObserver sur les titres h2 (ids = ancres des sections) ;
 * - au premier passage : statut `in_progress` ;
 * - `percent` = sections vues / total, `lastAnchor` = dernière section vue ;
 * - écritures debouncées vers le store de progression ;
 * - si une lecture précédente existe, bouton flottant « Reprendre la lecture ».
 *
 * Le pourcentage ne régresse jamais et un module déjà `completed` le reste.
 */
export function ReadingTracker({ moduleSlug, sections }: ReadingTrackerProps) {
  const { store, loading } = useProgressStore();
  const [resumeAnchor, setResumeAnchor] = React.useState<string | null>(null);
  const [resumeDismissed, setResumeDismissed] = React.useState(false);

  React.useEffect(() => {
    if (loading || sections.length === 0) return;

    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    let timer: number | null = null;
    let dirty = false;

    const seen = new Set<string>();
    let lastAnchor: string | null = null;
    let existing: UserModuleProgress | null = null;

    const buildProgress = (): UserModuleProgress => {
      const readPercent = Math.round((seen.size / sections.length) * 100);
      return {
        moduleSlug,
        status: existing?.status === "completed" ? "completed" : "in_progress",
        percent: Math.max(existing?.percent ?? 0, readPercent),
        lastAnchor: lastAnchor ?? existing?.lastAnchor ?? null,
        bestValidationScore: existing?.bestValidationScore ?? null,
        updatedAt: new Date().toISOString(),
      };
    };

    const flush = () => {
      if (!dirty) return;
      dirty = false;
      const next = buildProgress();
      existing = next;
      store.upsertModuleProgress(next).catch(() => {
        // Écriture silencieuse : la lecture ne doit jamais être interrompue.
      });
    };

    const schedule = () => {
      dirty = true;
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(flush, 1500);
    };

    store
      .getSnapshot()
      .then((snapshot) => {
        if (cancelled) return;
        existing = snapshot.modules.find((m) => m.moduleSlug === moduleSlug) ?? null;

        const savedAnchor = existing?.lastAnchor ?? null;
        if (savedAnchor && sections.some((s) => s.anchor === savedAnchor)) {
          setResumeAnchor(savedAnchor);
        }

        observer = new IntersectionObserver(
          (entries) => {
            let changed = false;
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              const id = entry.target.id;
              if (!id) continue;
              seen.add(id);
              lastAnchor = id;
              changed = true;
            }
            if (changed) schedule();
          },
          // Une section compte comme « vue » quand son titre entre dans les
          // 70 % supérieurs de la fenêtre.
          { rootMargin: "0px 0px -30% 0px", threshold: 0 }
        );

        for (const section of sections) {
          const el = document.getElementById(section.anchor);
          if (el) observer.observe(el);
        }
      })
      .catch(() => {
        // Store indisponible : pas de suivi, la page reste lisible.
      });

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (timer !== null) window.clearTimeout(timer);
      flush();
    };
  }, [store, loading, moduleSlug, sections]);

  const handleResume = () => {
    if (resumeAnchor) {
      document
        .getElementById(resumeAnchor)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setResumeDismissed(true);
  };

  if (!resumeAnchor || resumeDismissed) return null;

  return (
    <div className="fixed right-4 bottom-4 z-30 print:hidden">
      <div className="bg-background/95 flex items-center gap-1 rounded-full border py-1 pr-1 pl-3 shadow-lg backdrop-blur-sm">
        <button
          type="button"
          onClick={handleResume}
          className="text-foreground flex items-center gap-1.5 text-xs font-medium"
        >
          <CornerDownRight aria-hidden="true" className="text-primary size-3.5" />
          Reprendre la lecture
        </button>
        <button
          type="button"
          onClick={() => setResumeDismissed(true)}
          aria-label="Masquer le bouton de reprise de lecture"
          className="text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full p-1.5 transition-colors"
        >
          <X aria-hidden="true" className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
