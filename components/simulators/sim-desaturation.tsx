"use client";

/**
 * Modèle de Haldane pédagogique (N4/MF1) : charge et décharge en azote de
 * compartiments théoriques (périodes 5, 10, 20, 40, 80 et 120 min).
 *
 * IMPLÉMENTATION LOCALE ASSUMÉE : ce calcul exponentiel est une VISUALISATION
 * pédagogique, volontairement implémentée ici et non dans lib/calc (qui ne
 * contient que les moteurs validés par des tests). Modèle :
 *
 *   T(t) = T0 + (Tf − T0) × (1 − 2^(−t/période))
 *
 * avec T0 la tension initiale du compartiment, Tf la tension d'équilibre
 * (PpN₂ ambiante inspirée, calculée via lib/calc/physique). Simplifications
 * documentées : descente et remontée instantanées, tension initiale saturée à
 * la PpN₂ de surface (0,79 bar), aucun calcul de palier — ce simulateur
 * n'est PAS un outil de décompression, il illustre le principe des tables.
 *
 * Seule la pression ambiante vient de lib/calc (absolutePressure,
 * daltonPartialPressure) : rien du moteur MN90 n'est réimplémenté.
 */

import * as React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { frNumber } from "@/components/simulators/formula";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { absolutePressure, daltonPartialPressure, AIR_N2_FRACTION } from "@/lib/calc/physique";

/** Périodes des compartiments pédagogiques (min). */
const PERIODS = [5, 10, 20, 40, 80, 120] as const;
/** Tension d'azote d'un plongeur saturé en surface (bar). */
const SURFACE_N2_TENSION = 0.79;
/** Durée de désaturation tracée après la remontée (min). */
const POST_DIVE_MINUTES = 90;

/**
 * Palette catégorielle validée (adjacente, 6 slots, modes clair et sombre) —
 * cf. procédure dataviz : les couleurs suivent le compartiment, jamais son rang
 * d'affichage. Slot i ↔ période PERIODS[i], que le compartiment soit affiché
 * ou non.
 */
const SERIES_VARS = ["c1", "c2", "c3", "c4", "c5", "c6"] as const;

const CHART_THEME_CSS = `
.sim-desat-chart {
  --sim-c1: #2a78d6; --sim-c2: #eb6834; --sim-c3: #1baf7a;
  --sim-c4: #eda100; --sim-c5: #e87ba4; --sim-c6: #008300;
  --sim-eq: #898781; --sim-grid: #e1e0d9;
}
.dark .sim-desat-chart {
  --sim-c1: #3987e5; --sim-c2: #d95926; --sim-c3: #199e70;
  --sim-c4: #c98500; --sim-c5: #d55181; --sim-c6: #008300;
  --sim-grid: #2c2c2a;
}
`;

/** Tension du compartiment après `minutes` d'exposition à la tension d'équilibre `equilibrium`. */
function haldaneTension(
  initial: number,
  equilibrium: number,
  minutes: number,
  periodMinutes: number,
): number {
  return initial + (equilibrium - initial) * (1 - Math.pow(2, -minutes / periodMinutes));
}

interface ChartPoint {
  t: number;
  eq: number;
  [key: `c${number}`]: number;
}

export function SimDesaturation() {
  const [depth, setDepth] = React.useState(30);
  const [duration, setDuration] = React.useState(30);
  const [visible, setVisible] = React.useState<Record<number, boolean>>({
    5: true,
    10: true,
    20: true,
    40: true,
    80: true,
    120: true,
  });

  const bottomPpN2 = daltonPartialPressure(AIR_N2_FRACTION, absolutePressure(depth));

  const { data, tensionsAtSurfacing, leadingPeriod } = React.useMemo(() => {
    const points: ChartPoint[] = [];
    const totalMinutes = duration + POST_DIVE_MINUTES;

    for (let t = 0; t <= totalMinutes; t++) {
      const point: ChartPoint = {
        t,
        eq: t <= duration ? bottomPpN2 : SURFACE_N2_TENSION,
      };
      for (const period of PERIODS) {
        if (t <= duration) {
          // Phase fond : charge depuis la tension de surface vers la PpN₂ du fond.
          point[`c${period}`] = haldaneTension(SURFACE_N2_TENSION, bottomPpN2, t, period);
        } else {
          // Phase surface : décharge depuis la tension atteinte à la sortie du fond.
          const atSurfacing = haldaneTension(SURFACE_N2_TENSION, bottomPpN2, duration, period);
          point[`c${period}`] = haldaneTension(
            atSurfacing,
            SURFACE_N2_TENSION,
            t - duration,
            period,
          );
        }
      }
      points.push(point);
    }

    const tensions = PERIODS.map((period) => ({
      period,
      tension: haldaneTension(SURFACE_N2_TENSION, bottomPpN2, duration, period),
    }));
    const leading = tensions.reduce((best, current) =>
      current.tension > best.tension ? current : best,
    );

    return { data: points, tensionsAtSurfacing: tensions, leadingPeriod: leading };
  }, [duration, bottomPpN2]);

  const yMax = Math.ceil(bottomPpN2 * 2) / 2 + 0.5;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Désaturation — modèle de Haldane</CardTitle>
        <CardDescription>
          Charge et décharge en azote de six compartiments théoriques (périodes 5 à
          120 min). Visualisation pédagogique N4/MF1 — pas un outil de décompression.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <style>{CHART_THEME_CSS}</style>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="sim-desat-profondeur">Profondeur</Label>
              <span className="font-semibold tabular-nums">{depth} m</span>
            </div>
            <Slider
              id="sim-desat-profondeur"
              aria-label="Profondeur en mètres"
              min={10}
              max={60}
              step={1}
              value={[depth]}
              onValueChange={([next]) => setDepth(next)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="sim-desat-duree">Durée au fond</Label>
              <span className="font-semibold tabular-nums">{duration} min</span>
            </div>
            <Slider
              id="sim-desat-duree"
              aria-label="Durée au fond en minutes"
              min={5}
              max={60}
              step={1}
              value={[duration]}
              onValueChange={([next]) => setDuration(next)}
            />
          </div>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Compartiments affichés (période)</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {PERIODS.map((period, index) => (
              <label
                key={period}
                className="flex cursor-pointer items-center gap-1.5 text-sm"
                htmlFor={`sim-desat-comp-${period}`}
              >
                <Checkbox
                  id={`sim-desat-comp-${period}`}
                  checked={visible[period]}
                  onCheckedChange={(checked) =>
                    setVisible((previous) => ({ ...previous, [period]: checked === true }))
                  }
                />
                <span
                  aria-hidden="true"
                  className="sim-desat-chart inline-block size-2.5 rounded-full"
                  style={{ backgroundColor: `var(--sim-${SERIES_VARS[index]})` }}
                />
                {period} min
              </label>
            ))}
          </div>
        </fieldset>

        <div className="sim-desat-chart" aria-hidden="true">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
              <CartesianGrid stroke="var(--sim-grid)" vertical={false} />
              <XAxis
                dataKey="t"
                type="number"
                domain={[0, duration + POST_DIVE_MINUTES]}
                tickFormatter={(value: number) => `${value}`}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                stroke="var(--border)"
                label={{
                  value: "Temps (min)",
                  position: "insideBottomRight",
                  offset: -2,
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                }}
              />
              <YAxis
                domain={[0, yMax]}
                tickFormatter={(value: number) => frNumber(value)}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                stroke="var(--border)"
                width={38}
                label={{
                  value: "Tension N₂ (bar)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                }}
              />
              <Tooltip
                formatter={(value) => `${frNumber(Number(value))} bar`}
                labelFormatter={(value) => `t = ${value} min`}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  color: "var(--foreground)",
                  fontSize: "0.75rem",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
              <ReferenceLine
                x={duration}
                stroke="var(--sim-eq)"
                strokeDasharray="4 4"
                label={{
                  value: "Remontée",
                  position: "top",
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                }}
              />
              <Line
                dataKey="eq"
                name="Tension d'équilibre (PpN₂ ambiante)"
                stroke="var(--sim-eq)"
                strokeDasharray="6 3"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              {PERIODS.map((period, index) =>
                visible[period] ? (
                  <Line
                    key={period}
                    dataKey={`c${period}`}
                    name={`${period} min`}
                    stroke={`var(--sim-${SERIES_VARS[index]})`}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                ) : null,
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-medium">
            Tensions à la sortie du fond (t = {duration} min)
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Compartiment</TableHead>
                <TableHead>Tension N₂</TableHead>
                <TableHead>Saturation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tensionsAtSurfacing.map(({ period, tension }) => {
                const saturationPercent =
                  ((tension - SURFACE_N2_TENSION) / (bottomPpN2 - SURFACE_N2_TENSION)) * 100;
                const isLeading = period === leadingPeriod.period;
                return (
                  <TableRow key={period} className={isLeading ? "bg-primary/5" : undefined}>
                    <TableCell className="font-medium">
                      {period} min{isLeading ? " (directeur)" : ""}
                    </TableCell>
                    <TableCell className="tabular-nums">{frNumber(tension)} bar</TableCell>
                    <TableCell className="tabular-nums">
                      {frNumber(saturationPercent)} %
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="text-muted-foreground space-y-2 text-xs leading-relaxed">
          <p>
            <span className="text-foreground font-medium">Compartiment directeur :</span>{" "}
            à la sortie du fond, le compartiment {leadingPeriod.period} min présente la
            tension la plus élevée ({frNumber(leadingPeriod.tension)} bar pour une PpN₂
            ambiante de {frNumber(bottomPpN2)} bar au fond). C&apos;est lui qui impose le
            profil de remontée : c&apos;est sa tension, comparée à la sursaturation
            critique tolérée, qui détermine les paliers dans les modèles de type Haldane.
            Les compartiments courts (5, 10 min) se chargent et se déchargent vite ; les
            compartiments longs (80, 120 min) gouvernent les plongées longues, profondes
            ou successives.
          </p>
          <p>
            Modèle pédagogique simplifié : descente et remontée instantanées, plongeur
            initialement saturé à la PpN₂ de surface (0,79 bar), demi-vie exponentielle
            T(t) = T₀ + (T_f − T₀) × (1 − 2^(−t/période)). Ce simulateur illustre le
            principe des tables — il ne calcule aucun palier réel.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
