"use client";

/**
 * Simulateur de tables MN90 : plongée simple (table I) et plongée successive
 * (tableaux II + III). Toute la logique vient de lib/calc/mn90 — ce composant
 * ne fait qu'orchestrer la saisie et l'affichage.
 */

import { TriangleAlert } from "lucide-react";
import * as React from "react";

import { NumberField } from "@/components/simulators/number-field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import mn90Json from "@/content/data/mn90.json";
import { computeSimpleDive, computeSuccessiveDive } from "@/lib/calc/mn90";
import {
  Mn90DataError,
  type Mn90SimpleResult,
  type Mn90SuccessiveResult,
} from "@/lib/types";

const DATA_META = (mn90Json as { meta: { warning: string; source: string } }).meta;

/** Groupes de plongée successive couverts par le tableau II du jeu de données. */
const GPS_LETTERS = Object.keys(
  (mn90Json as { tableII: { residualNitrogen: Record<string, number[]> } }).tableII
    .residualNitrogen,
);

function fr(value: number): string {
  return String(Math.round(value * 100) / 100).replace(".", ",");
}

type Outcome<T> = { result: T; error: null } | { result: null; error: Error };

function safeCompute<T>(fn: () => T): Outcome<T> {
  try {
    return { result: fn(), error: null };
  } catch (error) {
    return { result: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
}

function DataErrorAlert({ error }: { error: Error }) {
  const isDataError = error instanceof Mn90DataError;
  return (
    <Alert variant="destructive">
      <TriangleAlert />
      <AlertTitle>
        {isDataError ? "Hors couverture du jeu de données" : "Calcul impossible"}
      </AlertTitle>
      <AlertDescription>
        <p>{error.message}</p>
        {isDataError ? (
          <p>
            Cas à compléter depuis un exemplaire officiel des tables MN90 : le moteur
            n&apos;extrapole jamais.
          </p>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}

function SimpleDiveResult({ result }: { result: Mn90SimpleResult }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="bg-muted/50 rounded-lg border p-3">
          <p className="text-muted-foreground text-xs">Entrée de table</p>
          <p className="text-lg font-semibold tabular-nums">{result.tableDepth} m</p>
        </div>
        <div className="bg-muted/50 rounded-lg border p-3">
          <p className="text-muted-foreground text-xs">Durée de table</p>
          <p className="text-lg font-semibold tabular-nums">{result.tableDuration} min</p>
        </div>
        <div className="bg-muted/50 rounded-lg border p-3">
          <p className="text-muted-foreground text-xs">DTR</p>
          <p className="text-lg font-semibold tabular-nums">{result.dtrMinutes} min</p>
        </div>
        <div className="bg-muted/50 rounded-lg border p-3">
          <p className="text-muted-foreground text-xs">GPS</p>
          <p className="text-lg font-semibold">
            {result.gps ? (
              <Badge className="text-sm">{result.gps}</Badge>
            ) : (
              <span className="text-muted-foreground text-sm">—</span>
            )}
          </p>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium">Paliers de décompression</h4>
        {result.stops.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Aucun palier obligatoire pour cette entrée de table (palier de principe de
            3 min à 3 m recommandé).
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profondeur du palier</TableHead>
                <TableHead>Durée</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.stops.map((stop) => (
                <TableRow key={stop.depth}>
                  <TableCell className="tabular-nums">{stop.depth} m</TableCell>
                  <TableCell className="tabular-nums">{stop.minutes} min</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed">
        DTR : remontée à 15 m/min depuis la profondeur saisie jusqu&apos;au premier palier
        (ou jusqu&apos;à la surface), puis 6 m/min entre les paliers et vers la surface,
        plus la durée des paliers — total arrondi à la minute supérieure.
      </p>
    </div>
  );
}

function SuccessiveResult({ result }: { result: Mn90SuccessiveResult }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-lg border p-3">
          <p className="text-muted-foreground text-xs">Azote résiduel (tableau II)</p>
          <p className="text-lg font-semibold tabular-nums">{fr(result.residualNitrogen)}</p>
        </div>
        <div className="bg-muted/50 rounded-lg border p-3">
          <p className="text-muted-foreground text-xs">Majoration (tableau III)</p>
          <p className="text-lg font-semibold tabular-nums">{result.majorationMinutes} min</p>
        </div>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">
        La majoration de {result.majorationMinutes} min s&apos;ajoute à la durée réelle de la
        seconde plongée pour former la durée fictive d&apos;entrée dans la table I.
      </p>
    </div>
  );
}

export function SimTables() {
  // Plongée simple.
  const [depth, setDepth] = React.useState(20);
  const [duration, setDuration] = React.useState(40);

  // Plongée successive.
  const [gps, setGps] = React.useState("D");
  const [surfaceInterval, setSurfaceInterval] = React.useState(120);
  const [secondDepth, setSecondDepth] = React.useState(18);

  const simple = React.useMemo<Outcome<Mn90SimpleResult> | null>(() => {
    if (!Number.isFinite(depth) || !Number.isFinite(duration)) return null;
    return safeCompute(() => computeSimpleDive({ depthMeters: depth, durationMinutes: duration }));
  }, [depth, duration]);

  const successive = React.useMemo<Outcome<Mn90SuccessiveResult> | null>(() => {
    if (!Number.isFinite(surfaceInterval) || !Number.isFinite(secondDepth)) return null;
    return safeCompute(() =>
      computeSuccessiveDive({
        gps,
        surfaceIntervalMinutes: surfaceInterval,
        secondDiveDepth: secondDepth,
      }),
    );
  }, [gps, surfaceInterval, secondDepth]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tables MN90</CardTitle>
        <CardDescription>
          Paliers, GPS et DTR d&apos;une plongée simple ; azote résiduel et majoration
          d&apos;une plongée successive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <TriangleAlert />
          <AlertTitle>Données à vérifier</AlertTitle>
          <AlertDescription>
            <p>{DATA_META.warning}</p>
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="simple">
          <TabsList className="w-full">
            <TabsTrigger value="simple">Plongée simple</TabsTrigger>
            <TabsTrigger value="successive">Plongée successive</TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="space-y-5 pt-2">
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                id="sim-tables-depth"
                label="Profondeur"
                unit="m"
                value={depth}
                onChange={setDepth}
                min={5}
                max={65}
              />
              <NumberField
                id="sim-tables-duration"
                label="Durée de la plongée"
                unit="min"
                value={duration}
                onChange={setDuration}
                min={5}
                max={180}
                step={5}
              />
            </div>

            {simple === null ? (
              <p className="text-muted-foreground text-sm">
                Saisissez une profondeur et une durée numériques pour lancer le calcul.
              </p>
            ) : simple.error ? (
              <DataErrorAlert error={simple.error} />
            ) : (
              <SimpleDiveResult result={simple.result} />
            )}
          </TabsContent>

          <TabsContent value="successive" className="space-y-5 pt-2">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sim-tables-gps">GPS de la première plongée</Label>
                <Select value={gps} onValueChange={setGps}>
                  <SelectTrigger id="sim-tables-gps" className="w-full">
                    <SelectValue placeholder="Choisir un groupe" />
                  </SelectTrigger>
                  <SelectContent>
                    {GPS_LETTERS.map((letter) => (
                      <SelectItem key={letter} value={letter}>
                        Groupe {letter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <NumberField
                id="sim-tables-interval"
                label="Intervalle de surface"
                unit="min"
                value={surfaceInterval}
                onChange={setSurfaceInterval}
                min={15}
                max={760}
                step={5}
              />
              <NumberField
                id="sim-tables-second-depth"
                label="Profondeur de la seconde plongée"
                unit="m"
                value={secondDepth}
                onChange={setSecondDepth}
                min={5}
                max={65}
              />
            </div>

            {successive === null ? (
              <p className="text-muted-foreground text-sm">
                Saisissez un intervalle et une profondeur numériques pour lancer le calcul.
              </p>
            ) : successive.error ? (
              <DataErrorAlert error={successive.error} />
            ) : (
              <SuccessiveResult result={successive.result} />
            )}
          </TabsContent>
        </Tabs>

        <p className="text-muted-foreground text-xs">Source : {DATA_META.source}.</p>
      </CardContent>
    </Card>
  );
}
