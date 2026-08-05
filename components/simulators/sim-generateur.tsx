"use client";

/**
 * Générateur d'exercices paramétriques : tire un exercice déterministe dans
 * GENERATORS (lib/calc/generators) à partir d'une graine aléatoire tirée côté
 * client, vérifie la réponse avec la tolérance de l'exercice et affiche le
 * corrigé pas à pas.
 */

import { CircleCheck, CircleX, RefreshCw } from "lucide-react";
import * as React from "react";

import { MathText, StepList, frNumber } from "@/components/simulators/formula";
import { LevelBadge } from "@/components/layout/level-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { GENERATORS } from "@/lib/calc/generators";
import { LEVEL_SLUGS, type LevelSlug } from "@/lib/types";

interface SimGenerateurProps {
  /** Niveau de filtrage des générateurs (slug "n1"…"mf1"). Tous si absent ou inconnu. */
  niveau?: string;
}

/** Tire une graine entière aléatoire (32 bits). */
function randomSeed(): number {
  return Math.floor(Math.random() * 0xffffffff);
}

export function SimGenerateur({ niveau }: SimGenerateurProps) {
  const generators = React.useMemo(() => {
    if (niveau && (LEVEL_SLUGS as readonly string[]).includes(niveau)) {
      return GENERATORS.filter((generator) => generator.level === (niveau as LevelSlug));
    }
    return GENERATORS;
  }, [niveau]);

  const [generatorId, setGeneratorId] = React.useState<string>(generators[0]?.id ?? "");
  // Première graine fixe : rendu identique serveur/client (pas d'écart d'hydratation),
  // le bouton « Nouvel exercice » tire ensuite une graine aléatoire.
  const [seed, setSeed] = React.useState<number>(20260805);
  const [answerText, setAnswerText] = React.useState("");
  const [feedback, setFeedback] = React.useState<"correct" | "incorrect" | null>(null);

  const generator =
    generators.find((candidate) => candidate.id === generatorId) ?? generators[0];

  const exercise = React.useMemo(() => {
    if (!generator) return null;
    return generator.generate(seed);
  }, [generator, seed]);

  if (generators.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exercices paramétriques</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Aucun exercice paramétrique n&apos;est disponible pour ce niveau pour le moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  function newExercise(nextGeneratorId?: string) {
    if (nextGeneratorId) setGeneratorId(nextGeneratorId);
    setSeed(randomSeed());
    setAnswerText("");
    setFeedback(null);
  }

  function checkAnswer(event: React.FormEvent) {
    event.preventDefault();
    if (!exercise) return;
    const parsed = Number(answerText.trim().replace(",", "."));
    if (answerText.trim() === "" || Number.isNaN(parsed)) {
      setFeedback(null);
      return;
    }
    const tolerance = Math.max(Math.abs(exercise.answer) * exercise.tolerance, 0.01);
    setFeedback(Math.abs(parsed - exercise.answer) <= tolerance + 1e-9 ? "correct" : "incorrect");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercices paramétriques</CardTitle>
        <CardDescription>
          Des énoncés générés à l&apos;infini avec corrigé pas à pas — comme à
          l&apos;examen, les valeurs changent à chaque tirage.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="sim-generateur-type">Type d&apos;exercice</Label>
          <Select value={generator?.id ?? ""} onValueChange={(value) => newExercise(value)}>
            <SelectTrigger id="sim-generateur-type" className="w-full">
              <SelectValue placeholder="Choisir un exercice" />
            </SelectTrigger>
            <SelectContent>
              {generators.map((candidate) => (
                <SelectItem key={candidate.id} value={candidate.id}>
                  {candidate.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {exercise === null || !generator ? (
          <div className="space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-9 w-40" />
          </div>
        ) : (
          <>
            <div className="bg-muted/50 space-y-2 rounded-lg border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <LevelBadge level={generator.level} />
                <h4 className="text-sm font-semibold">{exercise.title}</h4>
              </div>
              <p className="text-sm leading-relaxed">
                <MathText text={exercise.statement} />
              </p>
            </div>

            <form onSubmit={checkAnswer} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="sim-generateur-reponse">
                  Votre réponse <span className="text-muted-foreground font-normal">({exercise.unit})</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="sim-generateur-reponse"
                    inputMode="decimal"
                    placeholder={`Réponse en ${exercise.unit}`}
                    value={answerText}
                    onChange={(event) => {
                      setAnswerText(event.target.value);
                      setFeedback(null);
                    }}
                    className="max-w-48"
                  />
                  <Button type="submit">Vérifier</Button>
                </div>
              </div>
            </form>

            {feedback === "correct" ? (
              <Alert className="border-emerald-600/30 text-emerald-800 dark:text-emerald-300">
                <CircleCheck />
                <AlertTitle>Bonne réponse !</AlertTitle>
                <AlertDescription>
                  <p>
                    Réponse attendue : {frNumber(exercise.answer)} {exercise.unit} (tolérance ±
                    {frNumber(exercise.tolerance * 100)} %). Consultez le corrigé pour vérifier
                    votre méthode.
                  </p>
                </AlertDescription>
              </Alert>
            ) : null}
            {feedback === "incorrect" ? (
              <Alert variant="destructive">
                <CircleX />
                <AlertTitle>Ce n&apos;est pas la valeur attendue</AlertTitle>
                <AlertDescription>
                  <p>
                    Reprenez le calcul étape par étape avec le corrigé ci-dessous, puis tirez un
                    nouvel exercice pour vous entraîner.
                  </p>
                </AlertDescription>
              </Alert>
            ) : null}

            <Accordion type="single" collapsible>
              <AccordionItem value="corrige">
                <AccordionTrigger>Corrigé pas à pas</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <StepList steps={exercise.steps} />
                  <p className="text-sm font-medium">
                    Réponse : {frNumber(exercise.answer)} {exercise.unit}
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      (tolérance acceptée : ±{frNumber(exercise.tolerance * 100)} %)
                    </span>
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Button type="button" variant="outline" onClick={() => newExercise()}>
              <RefreshCw aria-hidden="true" />
              Nouvel exercice
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
