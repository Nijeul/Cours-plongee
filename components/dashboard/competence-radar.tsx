"use client";

import * as React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import type { DomainSlug } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Donnée d'un domaine sur le radar de compétences. */
export interface RadarDatum {
  domain: DomainSlug;
  /** Libellé court du domaine (ex. « Physique »). */
  label: string;
  /** Score 0..100 (% de bonnes réponses). */
  score: number;
  /** Faux tant qu'aucune réponse n'a été enregistrée sur ce domaine. */
  evaluated: boolean;
  /** Nombre de réponses prises en compte. */
  answered: number;
}

export type ScoreTone = "low" | "mid" | "high";

/** Rouge sous 50, ambre de 50 à 79, vert à partir de 80. */
export function scoreTone(score: number): ScoreTone {
  if (score < 50) return "low";
  if (score < 80) return "mid";
  return "high";
}

export const SCORE_TONE_TEXT: Record<ScoreTone, string> = {
  low: "text-red-600 dark:text-red-400",
  mid: "text-amber-600 dark:text-amber-400",
  high: "text-emerald-600 dark:text-emerald-400",
};

export const SCORE_TONE_DOT: Record<ScoreTone, string> = {
  low: "bg-red-500",
  mid: "bg-amber-500",
  high: "bg-emerald-500",
};

interface CompetenceRadarProps {
  data: RadarDatum[];
  className?: string;
}

/**
 * Radar de compétences par domaine : polygone des scores (0..100) et légende
 * détaillée avec code couleur (rouge < 50, ambre 50-79, vert ≥ 80).
 * Les domaines sans donnée restent à 0 avec la mention « pas encore évalué ».
 */
export function CompetenceRadar({ data, className }: CompetenceRadarProps) {
  const hasAnyData = data.some((d) => d.evaluated);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="h-56 w-full sm:h-64" aria-hidden>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              dataKey="score"
              stroke="var(--primary)"
              fill="var(--primary)"
              fillOpacity={0.25}
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <ul className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
        {data.map((d) => {
          const tone = scoreTone(d.score);
          return (
            <li key={d.domain} className="flex items-center gap-2 text-sm">
              <span
                aria-hidden
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  d.evaluated ? SCORE_TONE_DOT[tone] : "bg-muted-foreground/40",
                )}
              />
              <span className="min-w-0 flex-1 truncate">{d.label}</span>
              {d.evaluated ? (
                <span className={cn("text-sm font-semibold tabular-nums", SCORE_TONE_TEXT[tone])}>
                  {d.score} %
                </span>
              ) : (
                <span className="text-muted-foreground text-xs">pas encore évalué</span>
              )}
            </li>
          );
        })}
      </ul>

      <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className={cn("size-2 rounded-full", SCORE_TONE_DOT.low)} />
          moins de 50 %
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className={cn("size-2 rounded-full", SCORE_TONE_DOT.mid)} />
          50 à 79 %
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className={cn("size-2 rounded-full", SCORE_TONE_DOT.high)} />
          80 % et plus
        </span>
      </p>

      {!hasAnyData ? (
        <p className="text-muted-foreground text-sm leading-relaxed">
          Répondez à des quiz d&apos;entraînement ou passez un examen blanc pour alimenter votre
          radar de compétences.
        </p>
      ) : null}
    </div>
  );
}
