"use client";

/**
 * Champ numérique contrôlé partagé par les simulateurs : un Input (saisie
 * libre, virgule ou point acceptés) synchronisé avec un Slider.
 *
 * La saisie clavier n'est PAS bornée aux limites du curseur : cela permet de
 * demander volontairement des valeurs hors couverture (les moteurs de calcul
 * répondent alors par une erreur pédagogique explicite). Une saisie non
 * numérique propage NaN — à l'appelant d'afficher un message neutre.
 */

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface NumberFieldProps {
  id: string;
  label: string;
  /** Unité affichée à côté du label (ex. "m", "min", "bar"). */
  unit?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

export function NumberField({ id, label, unit, value, onChange, min, max, step = 1 }: NumberFieldProps) {
  const [text, setText] = React.useState<string>(String(value));
  const [lastValue, setLastValue] = React.useState<number>(value);

  // Synchronisation quand la valeur change de l'extérieur (curseur).
  if (value !== lastValue) {
    setLastValue(value);
    if (Number.isFinite(value)) setText(String(value).replace(".", ","));
  }

  function handleInput(raw: string) {
    setText(raw);
    const parsed = Number(raw.trim().replace(",", "."));
    const next = raw.trim() === "" || Number.isNaN(parsed) ? Number.NaN : parsed;
    setLastValue(next);
    onChange(next);
  }

  const sliderValue = Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>
          {label}
          {unit ? <span className="text-muted-foreground font-normal"> ({unit})</span> : null}
        </Label>
        <Input
          id={id}
          inputMode="decimal"
          value={text}
          onChange={(event) => handleInput(event.target.value)}
          className="h-8 w-24 text-right"
          aria-describedby={`${id}-slider`}
        />
      </div>
      <Slider
        id={`${id}-slider`}
        aria-label={`${label}${unit ? ` en ${unit}` : ""} (curseur)`}
        min={min}
        max={max}
        step={step}
        value={[sliderValue]}
        onValueChange={([next]) => {
          setLastValue(next);
          setText(String(next).replace(".", ","));
          onChange(next);
        }}
      />
    </div>
  );
}
