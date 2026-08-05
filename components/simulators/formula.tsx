"use client";

/**
 * Helpers partagés des simulateurs : rendu KaTeX (formules), texte avec
 * formules inline `$...$` et affichage d'un corrigé pas à pas (ExerciseStep[]).
 *
 * Le CSS de KaTeX est chargé globalement dans app/layout.tsx
 * (`katex/dist/katex.min.css`) : on rend ici le HTML via
 * `katex.renderToString` (sortie sûre, générée localement à partir de la
 * formule — jamais de contenu utilisateur).
 */

import katex from "katex";
import * as React from "react";

import type { ExerciseStep } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FormulaProps {
  /** Formule KaTeX, sans les délimiteurs `$`. */
  tex: string;
  /** Rendu en mode bloc (displayMode) plutôt qu'en ligne. */
  block?: boolean;
  className?: string;
}

/** Rend une formule KaTeX. En cas d'erreur de syntaxe, KaTeX affiche la source en rouge (throwOnError: false). */
export function Formula({ tex, block = false, className }: FormulaProps) {
  const html = React.useMemo(
    () => katex.renderToString(tex, { throwOnError: false, displayMode: block }),
    [tex, block],
  );
  return (
    <span
      className={cn(block && "block overflow-x-auto py-1", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Rend un texte contenant des formules KaTeX entre `$...$` (énoncés des
 * générateurs d'exercices). Le reste du texte est rendu tel quel.
 */
export function MathText({ text, className }: { text: string; className?: string }) {
  const parts = React.useMemo(() => text.split(/\$([^$]+)\$/g), [text]);
  return (
    <span className={className}>
      {parts.map((part, index) =>
        index % 2 === 1 ? <Formula key={index} tex={part} /> : <React.Fragment key={index}>{part}</React.Fragment>,
      )}
    </span>
  );
}

/** Liste ordonnée d'étapes de calcul : label, formule KaTeX facultative, détail chiffré. */
export function StepList({ steps }: { steps: ExerciseStep[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={index} className="flex gap-3">
          <span
            aria-hidden="true"
            className="bg-primary/10 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
          >
            {index + 1}
          </span>
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium">{step.label}</p>
            {step.formula ? (
              <Formula block tex={step.formula} className="text-sm" />
            ) : null}
            <p className="text-muted-foreground text-sm leading-relaxed">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Formate un nombre pour un texte français (virgule décimale, 2 décimales max). */
export function frNumber(value: number): string {
  return String(Math.round(value * 100) / 100).replace(".", ",");
}
