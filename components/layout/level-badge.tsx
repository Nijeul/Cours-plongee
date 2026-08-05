import * as React from "react";

import type { LevelSlug } from "@/lib/types";
import { cn } from "@/lib/utils";

const LEVEL_LABELS: Record<LevelSlug, string> = {
  n1: "N1",
  n2: "N2",
  n3: "N3",
  n4: "N4 / GP",
  mf1: "MF1",
};

const LEVEL_CLASSES: Record<LevelSlug, string> = {
  n1: "border-emerald-600/20 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-950/60 dark:text-emerald-300",
  n2: "border-blue-600/20 bg-blue-50 text-blue-800 dark:border-blue-400/20 dark:bg-blue-950/60 dark:text-blue-300",
  n3: "border-indigo-600/20 bg-indigo-50 text-indigo-800 dark:border-indigo-400/20 dark:bg-indigo-950/60 dark:text-indigo-300",
  n4: "border-amber-600/25 bg-amber-50 text-amber-800 dark:border-amber-400/20 dark:bg-amber-950/60 dark:text-amber-300",
  mf1: "border-red-600/20 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-950/60 dark:text-red-300",
};

interface LevelBadgeProps extends React.ComponentProps<"span"> {
  level: LevelSlug;
  /** Contenu personnalisé (par défaut : libellé court du niveau, ex. "N1"). */
  children?: React.ReactNode;
}

/** Badge coloré par niveau (N1 émeraude, N2 bleu, N3 indigo, N4 ambre, MF1 rouge). */
function LevelBadge({ level, className, children, ...props }: LevelBadgeProps) {
  return (
    <span
      data-slot="level-badge"
      data-level={level}
      className={cn(
        "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
        LEVEL_CLASSES[level],
        className
      )}
      {...props}
    >
      {children ?? LEVEL_LABELS[level]}
    </span>
  );
}

export { LevelBadge, LEVEL_LABELS };
