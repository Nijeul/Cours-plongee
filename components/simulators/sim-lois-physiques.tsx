"use client";

/**
 * Simulateur des lois physiques : un unique curseur de profondeur (0–60 m)
 * met à jour en direct la pression absolue, le volume d'un ballon de 10 L
 * (Boyle-Mariotte, visualisé par un cercle dont l'AIRE est proportionnelle au
 * volume), les pressions partielles PpO₂/PpN₂ (Dalton, avec seuils) et le
 * poids apparent d'un plongeur type (Archimède).
 *
 * Tous les calculs viennent de lib/calc/physique — aucune logique réimplémentée.
 */

import * as React from "react";

import { Formula, frNumber } from "@/components/simulators/formula";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  absolutePressure,
  archimedeApparentWeight,
  boyleMariotteVolume,
  daltonPartialPressure,
  depthForPartialPressure,
  AIR_N2_FRACTION,
  AIR_O2_FRACTION,
  WATER_DENSITY_FRESH,
  WATER_DENSITY_SEA,
} from "@/lib/calc/physique";

/** Volume du ballon pris en surface (L). */
const BALLOON_SURFACE_VOLUME = 10;
/** Seuil de toxicité de l'oxygène (hyperoxie) en pression partielle. */
const PPO2_MAX = 1.6;
/** Seuil pédagogique d'apparition de la narcose à l'azote. */
const PPN2_NARCOSE = 5.6;
/** Plongeur type : masse équipée et volume immergé. */
const DIVER_MASS_KG = 95;
const DIVER_VOLUME_L = 92;

interface GasBarProps {
  label: string;
  value: number;
  /** Borne haute de l'échelle de la barre (bar). */
  scaleMax: number;
  threshold: number;
  thresholdLabel: string;
}

/** Barre horizontale de pression partielle avec seuil marqué. */
function GasBar({ label, value, scaleMax, threshold, thresholdLabel }: GasBarProps) {
  const widthPercent = Math.min(100, (value / scaleMax) * 100);
  const thresholdPercent = (threshold / scaleMax) * 100;
  const overThreshold = value >= threshold;

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span
          className={
            overThreshold
              ? "text-destructive text-sm font-semibold tabular-nums"
              : "text-sm font-semibold tabular-nums"
          }
        >
          {frNumber(value)} bar
          {overThreshold ? ` — seuil ${frNumber(threshold)} bar dépassé !` : ""}
        </span>
      </div>
      <div
        className="bg-muted relative h-4 overflow-hidden rounded-full"
        role="img"
        aria-label={`${label} : ${frNumber(value)} bar sur une échelle de 0 à ${frNumber(scaleMax)} bar, seuil à ${frNumber(threshold)} bar`}
      >
        <div
          className={`h-full rounded-full transition-all ${overThreshold ? "bg-destructive" : "bg-primary"}`}
          style={{ width: `${widthPercent}%` }}
        />
        <div
          aria-hidden="true"
          className="bg-destructive absolute inset-y-0 w-0.5"
          style={{ left: `${thresholdPercent}%` }}
        />
      </div>
      <p className="text-muted-foreground text-xs">
        Seuil : {thresholdLabel} à {frNumber(threshold)} bar.
      </p>
    </div>
  );
}

export function SimLoisPhysiques() {
  const [depth, setDepth] = React.useState(20);

  const pAbs = absolutePressure(depth);
  const balloonVolume = boyleMariotteVolume(BALLOON_SURFACE_VOLUME, 1, pAbs);
  const ppO2 = daltonPartialPressure(AIR_O2_FRACTION, pAbs);
  const ppN2 = daltonPartialPressure(AIR_N2_FRACTION, pAbs);
  const seaWeight = archimedeApparentWeight({
    massKg: DIVER_MASS_KG,
    volumeLiters: DIVER_VOLUME_L,
    waterDensity: WATER_DENSITY_SEA,
  });
  const freshWeight = archimedeApparentWeight({
    massKg: DIVER_MASS_KG,
    volumeLiters: DIVER_VOLUME_L,
    waterDensity: WATER_DENSITY_FRESH,
  });
  const depthPpO2Max = depthForPartialPressure(AIR_O2_FRACTION, PPO2_MAX);
  const depthNarcose = depthForPartialPressure(AIR_N2_FRACTION, PPN2_NARCOSE);

  // Cercle dont l'AIRE est proportionnelle au volume : r ∝ √V.
  const surfaceRadius = 44;
  const balloonRadius = surfaceRadius * Math.sqrt(balloonVolume / BALLOON_SURFACE_VOLUME);

  function buoyancyText(apparentKgf: number): string {
    if (Math.abs(apparentKgf) < 0.05) return "équilibre parfait";
    return apparentKgf > 0 ? "le plongeur coule" : "le plongeur flotte";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lois physiques en direct</CardTitle>
        <CardDescription>
          Déplacez le curseur de profondeur : Mariotte, Dalton et Archimède réagissent
          instantanément.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <Label htmlFor="sim-lois-profondeur">Profondeur</Label>
            <span className="text-lg font-semibold tabular-nums">{depth} m</span>
          </div>
          <Slider
            id="sim-lois-profondeur"
            aria-label="Profondeur en mètres"
            min={0}
            max={60}
            step={1}
            value={[depth]}
            onValueChange={([next]) => setDepth(next)}
          />
          <p className="text-sm">
            Pression absolue :{" "}
            <span className="font-semibold tabular-nums">{frNumber(pAbs)} bar</span>{" "}
            <span className="text-muted-foreground">
              (<Formula tex="P_{abs} = \frac{prof}{10} + 1" />)
            </span>
          </p>
        </div>

        <Separator />

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium">Boyle-Mariotte — le ballon de 10 L</h4>
            <p className="text-muted-foreground mb-2 text-xs">
              Un ballon souple gonflé à 10 L en surface, descendu à {depth} m : son volume
              devient <span className="font-semibold">{frNumber(balloonVolume)} L</span>{" "}
              (l&apos;aire du disque est proportionnelle au volume).
            </p>
            <svg
              viewBox="0 0 120 120"
              className="mx-auto block h-40 w-40"
              role="img"
              aria-label={`Ballon de ${frNumber(BALLOON_SURFACE_VOLUME)} L en surface, ${frNumber(balloonVolume)} L à ${depth} m`}
            >
              <circle
                cx="60"
                cy="60"
                r={surfaceRadius}
                fill="none"
                stroke="currentColor"
                strokeDasharray="4 4"
                className="text-muted-foreground/50"
              />
              <circle
                cx="60"
                cy="60"
                r={balloonRadius}
                className="fill-primary/30 stroke-primary transition-all"
                strokeWidth="2"
              />
              <text
                x="60"
                y="64"
                textAnchor="middle"
                className="fill-foreground text-[12px] font-semibold"
              >
                {frNumber(balloonVolume)} L
              </text>
            </svg>
            <p className="text-muted-foreground text-center text-xs">
              Pointillés : volume en surface (10 L). <Formula tex="P_1 V_1 = P_2 V_2" />
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Dalton — pressions partielles à l&apos;air</h4>
            <GasBar
              label="PpO₂ (21 % d'O₂)"
              value={ppO2}
              scaleMax={2}
              threshold={PPO2_MAX}
              thresholdLabel="hyperoxie (toxicité de l'oxygène)"
            />
            <GasBar
              label="PpN₂ (79 % de N₂)"
              value={ppN2}
              scaleMax={6.5}
              threshold={PPN2_NARCOSE}
              thresholdLabel="seuil pédagogique de narcose"
            />
            <p className="text-muted-foreground text-xs leading-relaxed">
              À l&apos;air, PpO₂ atteint {frNumber(PPO2_MAX)} bar vers{" "}
              {frNumber(depthPpO2Max)} m et PpN₂ atteint {frNumber(PPN2_NARCOSE)} bar vers{" "}
              {frNumber(depthNarcose)} m (<Formula tex="Pp = F_{gaz} \times P_{abs}" />).
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm font-medium">Archimède — poids apparent d&apos;un plongeur type</h4>
          <p className="text-muted-foreground mb-2 text-xs">
            Plongeur équipé : masse {DIVER_MASS_KG} kg, volume immergé {DIVER_VOLUME_L} L.
            Dans ce modèle simplifié, le poids apparent ne dépend pas de la profondeur
            (compression de la combinaison négligée).
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { title: "Eau de mer (densité 1,03)", result: seaWeight },
              { title: "Eau douce (densité 1,00)", result: freshWeight },
            ].map(({ title, result }) => (
              <div key={title} className="bg-muted/50 rounded-lg border p-3">
                <p className="text-muted-foreground text-xs">{title}</p>
                <p className="text-sm">
                  Poussée : <span className="font-semibold tabular-nums">{frNumber(result.buoyancyKgf)} kgf</span>
                </p>
                <p className="text-sm">
                  Poids apparent :{" "}
                  <span className="font-semibold tabular-nums">
                    {frNumber(result.apparentWeightKgf)} kgf
                  </span>{" "}
                  <span className="text-muted-foreground tabular-nums">
                    ({frNumber(result.apparentWeightNewtons)} N)
                  </span>
                </p>
                <p className="text-muted-foreground text-xs">
                  → {buoyancyText(result.apparentWeightKgf)}
                </p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            <Formula tex="P_{app} = P_{reel} - V \times d" /> — un poids apparent négatif
            signifie que la poussée d&apos;Archimède l&apos;emporte.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
