"use client";

/**
 * Simulateur d'autonomie en air : bloc, pression, réserve, consommation et
 * profondeur → computeAutonomy (lib/calc/autonomie). Le déroulé pédagogique
 * (steps avec formules KaTeX) vient directement du moteur.
 */

import { TriangleAlert } from "lucide-react";
import * as React from "react";

import { StepList, frNumber } from "@/components/simulators/formula";
import { NumberField } from "@/components/simulators/number-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { computeAutonomy } from "@/lib/calc/autonomie";
import type { AutonomyResult } from "@/lib/types";

const TANK_VOLUMES = [10, 12, 15, 18] as const;

export function SimAutonomie() {
  const [tankVolume, setTankVolume] = React.useState<number>(12);
  const [pressure, setPressure] = React.useState(200);
  const [reserve, setReserve] = React.useState(50);
  const [consumption, setConsumption] = React.useState(20);
  const [depth, setDepth] = React.useState(20);

  const outcome = React.useMemo<
    { result: AutonomyResult; error: null } | { result: null; error: Error } | null
  >(() => {
    if (
      !Number.isFinite(pressure) ||
      !Number.isFinite(reserve) ||
      !Number.isFinite(consumption) ||
      !Number.isFinite(depth)
    ) {
      return null;
    }
    try {
      return {
        result: computeAutonomy({
          tankVolumeLiters: tankVolume,
          pressureBar: pressure,
          reserveBar: reserve,
          surfaceConsumption: consumption,
          depthMeters: depth,
        }),
        error: null,
      };
    } catch (error) {
      return {
        result: null,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }, [tankVolume, pressure, reserve, consumption, depth]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Autonomie en air</CardTitle>
        <CardDescription>
          Combien de temps à cette profondeur avant d&apos;entamer la réserve ? Calcul selon
          la convention d&apos;enseignement FFESSM, arrondi à la minute inférieure.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sim-autonomie-bloc">Volume du bloc</Label>
            <Select
              value={String(tankVolume)}
              onValueChange={(value) => setTankVolume(Number(value))}
            >
              <SelectTrigger id="sim-autonomie-bloc" className="w-full">
                <SelectValue placeholder="Choisir un bloc" />
              </SelectTrigger>
              <SelectContent>
                {TANK_VOLUMES.map((volume) => (
                  <SelectItem key={volume} value={String(volume)}>
                    {volume} L
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <NumberField
            id="sim-autonomie-pression"
            label="Pression de gonflage"
            unit="bar"
            value={pressure}
            onChange={setPressure}
            min={50}
            max={300}
            step={10}
          />
          <NumberField
            id="sim-autonomie-reserve"
            label="Pression de réserve"
            unit="bar"
            value={reserve}
            onChange={setReserve}
            min={0}
            max={100}
            step={5}
          />
          <NumberField
            id="sim-autonomie-conso"
            label="Consommation en surface"
            unit="L/min"
            value={consumption}
            onChange={setConsumption}
            min={10}
            max={40}
          />
          <NumberField
            id="sim-autonomie-profondeur"
            label="Profondeur d'évolution"
            unit="m"
            value={depth}
            onChange={setDepth}
            min={0}
            max={65}
          />
        </div>

        {outcome === null ? (
          <p className="text-muted-foreground text-sm">
            Saisissez des valeurs numériques valides pour lancer le calcul.
          </p>
        ) : outcome.error ? (
          <Alert variant="destructive">
            <TriangleAlert />
            <AlertTitle>Calcul impossible</AlertTitle>
            <AlertDescription>
              <p>{outcome.error.message}</p>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-5">
            <div className="bg-primary/5 border-primary/20 rounded-lg border p-4 text-center">
              <p className="text-muted-foreground text-sm">Autonomie à {frNumber(depth)} m</p>
              <p className="text-primary text-4xl font-bold tabular-nums">
                {outcome.result.autonomyMinutes}&nbsp;min
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                {frNumber(outcome.result.availableAirLiters)} L d&apos;air disponibles ·{" "}
                {frNumber(outcome.result.consumptionAtDepth)} L/min consommés au fond ·{" "}
                pression absolue {frNumber(outcome.result.absolutePressureBar)} bar
              </p>
            </div>

            <Separator />

            <div>
              <h4 className="mb-3 text-sm font-medium">Déroulé du calcul</h4>
              <StepList steps={outcome.result.steps} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
