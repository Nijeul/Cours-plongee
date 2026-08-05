"use client";

import { BookOpen, Check, CircleCheck, CircleX, X } from "lucide-react";
import Link from "next/link";

import { RichText } from "@/components/quiz/rich-text";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getDomain } from "@/lib/catalog";
import { displayOptions, isAnswerCorrect } from "@/lib/quiz/selection";
import type { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<Question["type"], string> = {
  qcm: "QCM",
  calcul: "Calcul",
  "vrai-faux": "Vrai / faux",
};

const DIFFICULTY_LABELS: Record<Question["difficulty"], string> = {
  1: "Facile",
  2: "Moyen",
  3: "Difficile",
};

interface QuestionCardProps {
  question: Question;
  /** Position dans la série (0-based). */
  index: number;
  total: number;
  /** Options actuellement cochées. */
  selectedIds: string[];
  /** Appelé à chaque changement de sélection (ignoré si `revealed` ou `disabled`). */
  onSelectionChange?: (ids: string[]) => void;
  /** Correction visible : options colorées, explication, lien vers le cours. */
  revealed: boolean;
  disabled?: boolean;
  /** Affiche le lien « Revoir le cours » dans la correction (défaut : oui). */
  showCourseLink?: boolean;
  className?: string;
}

/**
 * Carte d'une question de quiz : énoncé (Markdown + KaTeX), options en
 * boutons radio (une seule bonne réponse) ou cases à cocher (plusieurs),
 * puis correction complète une fois la réponse révélée.
 */
export function QuestionCard({
  question,
  index,
  total,
  selectedIds,
  onSelectionChange,
  revealed,
  disabled = false,
  showCourseLink = true,
  className,
}: QuestionCardProps) {
  const multiple = question.correctOptionIds.length > 1;
  const interactive = !revealed && !disabled;
  const correct = revealed ? isAnswerCorrect(question, selectedIds) : false;

  const toggleOption = (optionId: string, checked: boolean) => {
    if (!interactive || !onSelectionChange) return;
    if (checked) onSelectionChange([...selectedIds, optionId]);
    else onSelectionChange(selectedIds.filter((id) => id !== optionId));
  };

  const optionClasses = (optionId: string) => {
    const isCorrect = question.correctOptionIds.includes(optionId);
    const isSelected = selectedIds.includes(optionId);
    return cn(
      "flex items-start gap-3 rounded-lg border p-3 transition-colors",
      interactive && "hover:bg-accent/50 cursor-pointer",
      revealed &&
        isCorrect &&
        "border-emerald-600/40 bg-emerald-50 dark:border-emerald-400/30 dark:bg-emerald-950/40",
      revealed &&
        !isCorrect &&
        isSelected &&
        "border-red-600/40 bg-red-50 dark:border-red-400/30 dark:bg-red-950/40",
      revealed && !isCorrect && !isSelected && "opacity-70",
    );
  };

  const optionStatusIcon = (optionId: string) => {
    if (!revealed) return null;
    const isCorrect = question.correctOptionIds.includes(optionId);
    const isSelected = selectedIds.includes(optionId);
    if (isCorrect) {
      return (
        <Check
          aria-hidden
          className="mt-0.5 size-4 shrink-0 text-emerald-700 dark:text-emerald-400"
        />
      );
    }
    if (isSelected) {
      return <X aria-hidden className="mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400" />;
    }
    return <span aria-hidden className="size-4 shrink-0" />;
  };

  const optionLabel = (position: number, text: string) => (
    <span className="flex-1 text-sm leading-relaxed">
      <span className="text-muted-foreground mr-1.5 font-semibold uppercase">
        {String.fromCharCode(97 + position)}.
      </span>
      <RichText text={text} />
    </span>
  );

  // Ordre d'affichage mélangé de façon déterministe (biais de position neutralisé).
  const options = displayOptions(question);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <span className="font-medium">
            Question {index + 1} / {total}
          </span>
          <Badge variant="outline">{TYPE_LABELS[question.type]}</Badge>
          <Badge variant="outline">{getDomain(question.domain).shortTitle}</Badge>
          <Badge variant="outline">{DIFFICULTY_LABELS[question.difficulty]}</Badge>
        </div>
        <CardTitle className="text-base leading-relaxed font-medium sm:text-lg">
          <RichText text={question.prompt} />
        </CardTitle>
        {multiple && !revealed ? (
          <p className="text-muted-foreground text-xs">Plusieurs réponses possibles.</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {multiple ? (
          <div className="grid gap-2" role="group" aria-label="Options de réponse">
            {options.map((option, position) => {
              const inputId = `${question.id}-${option.id}`;
              return (
                <label key={option.id} htmlFor={inputId} className={optionClasses(option.id)}>
                  <Checkbox
                    id={inputId}
                    className="mt-0.5"
                    checked={selectedIds.includes(option.id)}
                    disabled={!interactive}
                    onCheckedChange={(checked) => toggleOption(option.id, checked === true)}
                  />
                  {optionLabel(position, option.text)}
                  {optionStatusIcon(option.id)}
                </label>
              );
            })}
          </div>
        ) : (
          <RadioGroup
            className="gap-2"
            value={selectedIds[0] ?? ""}
            disabled={!interactive}
            onValueChange={(value) => {
              if (interactive && onSelectionChange) onSelectionChange([value]);
            }}
          >
            {options.map((option, position) => {
              const inputId = `${question.id}-${option.id}`;
              return (
                <label key={option.id} htmlFor={inputId} className={optionClasses(option.id)}>
                  <RadioGroupItem id={inputId} value={option.id} className="mt-0.5" />
                  {optionLabel(position, option.text)}
                  {optionStatusIcon(option.id)}
                </label>
              );
            })}
          </RadioGroup>
        )}

        {revealed ? (
          <div
            className={cn(
              "rounded-lg border p-4",
              correct
                ? "border-emerald-600/30 bg-emerald-50/70 dark:border-emerald-400/25 dark:bg-emerald-950/30"
                : "border-red-600/30 bg-red-50/70 dark:border-red-400/25 dark:bg-red-950/30",
            )}
          >
            <p
              className={cn(
                "flex items-center gap-2 text-sm font-semibold",
                correct
                  ? "text-emerald-800 dark:text-emerald-300"
                  : "text-red-800 dark:text-red-300",
              )}
            >
              {correct ? (
                <CircleCheck aria-hidden className="size-4 shrink-0" />
              ) : (
                <CircleX aria-hidden className="size-4 shrink-0" />
              )}
              {correct
                ? "Bonne réponse !"
                : selectedIds.length === 0
                  ? "Pas de réponse."
                  : "Mauvaise réponse."}
            </p>
            <div className="text-foreground/90 mt-2 text-sm leading-relaxed">
              <RichText text={question.explanation} />
            </div>
            {showCourseLink ? (
              <Link
                href={`/cours/${question.moduleSlug}#${question.sectionAnchor}`}
                className="text-primary mt-3 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
              >
                <BookOpen aria-hidden className="size-4" />
                Revoir le cours
              </Link>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
