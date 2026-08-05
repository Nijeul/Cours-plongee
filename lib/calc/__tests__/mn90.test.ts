/**
 * Tests du moteur de tables MN90 — toutes les valeurs attendues sont
 * vérifiées à la main contre `content/data/mn90.json`.
 */

import { describe, expect, it } from "vitest";
import {
  computeSimpleDive,
  computeSuccessiveDive,
  getMajoration,
  getResidualNitrogen,
} from "@/lib/calc/mn90";
import { Mn90DataError } from "@/lib/types";

describe("computeSimpleDive — lectures exactes de la table I", () => {
  it("20 m / 40 min : pas de palier, GPS H, DTR 2 min", () => {
    const result = computeSimpleDive({ depthMeters: 20, durationMinutes: 40 });
    expect(result.tableDepth).toBe(20);
    expect(result.tableDuration).toBe(40);
    expect(result.stops).toEqual([]);
    expect(result.gps).toBe("H");
    // 20 / 15 = 1,333 → arrondi à la minute supérieure : 2 min.
    expect(result.dtrMinutes).toBe(2);
  });

  it("12 m / 15 min : plongée courte sans palier, GPS A, DTR 1 min", () => {
    const result = computeSimpleDive({ depthMeters: 12, durationMinutes: 15 });
    expect(result.stops).toEqual([]);
    expect(result.gps).toBe("A");
    expect(result.dtrMinutes).toBe(1); // 12 / 15 = 0,8 → 1 min
  });

  it("35 m / 40 min : trois paliers ordonnés du plus profond au moins profond", () => {
    const result = computeSimpleDive({ depthMeters: 35, durationMinutes: 40 });
    expect(result.stops).toEqual([
      { depth: 9, minutes: 2 },
      { depth: 6, minutes: 12 },
      { depth: 3, minutes: 33 },
    ]);
    expect(result.gps).toBe("K");
    // (35 − 9) / 15 = 1,733 ; 9 / 6 = 1,5 ; paliers 47 → 50,233 → 51 min.
    expect(result.dtrMinutes).toBe(51);
  });
});

describe("computeSimpleDive — arrondis à l'entrée immédiatement supérieure", () => {
  it("17 m / 42 min → table 20 m / 45 min, palier 4 min à 3 m, GPS I", () => {
    const result = computeSimpleDive({ depthMeters: 17, durationMinutes: 42 });
    expect(result.tableDepth).toBe(20);
    expect(result.tableDuration).toBe(45);
    expect(result.stops).toEqual([{ depth: 3, minutes: 4 }]);
    expect(result.gps).toBe("I");
    // (17 − 3) / 15 = 0,933 ; 3 / 6 = 0,5 ; palier 4 → 5,433 → 6 min.
    expect(result.dtrMinutes).toBe(6);
  });

  it("22 m / 47 min → table 25 m / 50 min, paliers 6 m et 3 m, GPS K", () => {
    const result = computeSimpleDive({ depthMeters: 22, durationMinutes: 47 });
    expect(result.tableDepth).toBe(25);
    expect(result.tableDuration).toBe(50);
    expect(result.stops).toEqual([
      { depth: 6, minutes: 2 },
      { depth: 3, minutes: 30 },
    ]);
    expect(result.gps).toBe("K");
    // (22 − 6) / 15 = 1,067 ; 6 / 6 = 1 ; paliers 32 → 34,067 → 35 min.
    expect(result.dtrMinutes).toBe(35);
  });

  it("10 m / 120 min → table 12 m / 120 min (profondeur arrondie à 12 m)", () => {
    const result = computeSimpleDive({ depthMeters: 10, durationMinutes: 120 });
    expect(result.tableDepth).toBe(12);
    expect(result.tableDuration).toBe(120);
    expect(result.gps).toBe("H");
    expect(result.dtrMinutes).toBe(1); // 10 / 15 = 0,667 → 1 min
  });
});

describe("computeSimpleDive — hors couverture : Mn90DataError, jamais d'extrapolation", () => {
  it("refuse une profondeur au-delà de la dernière entrée (61 m)", () => {
    expect(() => computeSimpleDive({ depthMeters: 61, durationMinutes: 10 })).toThrow(Mn90DataError);
    expect(() => computeSimpleDive({ depthMeters: 61, durationMinutes: 10 })).toThrow(/hors couverture/);
  });

  it("refuse une durée au-delà de la dernière ligne (60 m / 25 min)", () => {
    expect(() => computeSimpleDive({ depthMeters: 60, durationMinutes: 25 })).toThrow(Mn90DataError);
    expect(() => computeSimpleDive({ depthMeters: 60, durationMinutes: 25 })).toThrow(/durée maximale/i);
  });

  it("refuse une durée au-delà de la dernière ligne (20 m / 75 min)", () => {
    expect(() => computeSimpleDive({ depthMeters: 20, durationMinutes: 75 })).toThrow(Mn90DataError);
  });

  it("refuse profondeur et durée invalides (négatives ou nulles)", () => {
    expect(() => computeSimpleDive({ depthMeters: -5, durationMinutes: 10 })).toThrow(Mn90DataError);
    expect(() => computeSimpleDive({ depthMeters: 20, durationMinutes: 0 })).toThrow(Mn90DataError);
    expect(() => computeSimpleDive({ depthMeters: Number.NaN, durationMinutes: 10 })).toThrow(
      Mn90DataError,
    );
  });
});

describe("getResidualNitrogen — tableau II, intervalle immédiatement inférieur", () => {
  it("lit la valeur exacte quand l'intervalle est une colonne de la table", () => {
    expect(getResidualNitrogen("C", 60)).toBe(0.88);
    expect(getResidualNitrogen("A", 15)).toBe(0.84);
    expect(getResidualNitrogen("P", 720)).toBe(0.85);
  });

  it("arrondit à l'intervalle immédiatement inférieur (pénalisant) : C / 50 min → colonne 45", () => {
    expect(getResidualNitrogen("C", 50)).toBe(0.89);
  });

  it("H / 119 min → colonne 90 min", () => {
    expect(getResidualNitrogen("H", 119)).toBe(1.01);
  });

  it("au-delà de 720 min, retourne l'azote de base 0,81", () => {
    expect(getResidualNitrogen("P", 721)).toBe(0.81);
    expect(getResidualNitrogen("A", 1440)).toBe(0.81);
  });

  it("refuse un intervalle inférieur au premier de la table (plongée consécutive)", () => {
    expect(() => getResidualNitrogen("B", 14)).toThrow(Mn90DataError);
    expect(() => getResidualNitrogen("B", 14)).toThrow(/consécutive/);
  });

  it("refuse un GPS inconnu ou un intervalle invalide", () => {
    expect(() => getResidualNitrogen("Z", 60)).toThrow(Mn90DataError);
    expect(() => getResidualNitrogen("Z", 60)).toThrow(/GPS inconnu/);
    expect(() => getResidualNitrogen("A", 0)).toThrow(Mn90DataError);
  });
});

describe("getMajoration — tableau III, lectures pénalisantes", () => {
  it("valeurs exactes sur les bornes de la table", () => {
    expect(getMajoration(0.84, 12)).toBe(4);
    expect(getMajoration(1.07, 40)).toBe(10);
  });

  it("arrondit l'azote au niveau immédiatement supérieur : 0,88 → ligne 0,89", () => {
    expect(getMajoration(0.88, 20)).toBe(6);
  });

  it("arrondit la profondeur à la colonne immédiatement supérieure : 18 m → 20 m", () => {
    expect(getMajoration(0.89, 18)).toBe(6);
  });

  it("cumule les deux arrondis : 1,08 / 38 m → ligne 1,13, colonne 40 m", () => {
    expect(getMajoration(1.08, 38)).toBe(13);
  });

  it("1,46 / 15 m → ligne 1,57, colonne 15 m : 101 min", () => {
    expect(getMajoration(1.46, 15)).toBe(101);
  });

  it("refuse un azote au-delà du dernier niveau (1,57)", () => {
    expect(() => getMajoration(1.58, 20)).toThrow(Mn90DataError);
  });

  it("refuse une profondeur au-delà de la dernière colonne (60 m)", () => {
    expect(() => getMajoration(0.9, 61)).toThrow(Mn90DataError);
  });

  it("refuse la case sentinelle « hors table » (1,57 / 12 m)", () => {
    expect(() => getMajoration(1.5, 12)).toThrow(Mn90DataError);
    expect(() => getMajoration(1.5, 12)).toThrow(/hors table/i);
  });

  it("refuse des entrées invalides", () => {
    expect(() => getMajoration(0, 20)).toThrow(Mn90DataError);
    expect(() => getMajoration(0.9, -3)).toThrow(Mn90DataError);
  });
});

describe("computeSuccessiveDive — composition tableaux II et III", () => {
  it("GPS H, 120 min, 20 m → azote 0,97, majoration 16 min", () => {
    const result = computeSuccessiveDive({
      gps: "H",
      surfaceIntervalMinutes: 120,
      secondDiveDepth: 20,
    });
    expect(result.residualNitrogen).toBe(0.97);
    // 0,97 → ligne 1,01 ; 20 m → colonne 20 m → 16 min.
    expect(result.majorationMinutes).toBe(16);
  });

  it("GPS J, 100 min, 33 m → colonne 90 min (1,07), ligne 1,07, colonne 35 m → 12 min", () => {
    const result = computeSuccessiveDive({
      gps: "J",
      surfaceIntervalMinutes: 100,
      secondDiveDepth: 33,
    });
    expect(result.residualNitrogen).toBe(1.07);
    expect(result.majorationMinutes).toBe(12);
  });

  it("au-delà de 12 h : azote 0,81, lecture stricte du tableau III (ligne 0,84)", () => {
    const result = computeSuccessiveDive({
      gps: "A",
      surfaceIntervalMinutes: 800,
      secondDiveDepth: 20,
    });
    expect(result.residualNitrogen).toBe(0.81);
    expect(result.majorationMinutes).toBe(2);
  });

  it("propage les erreurs des tableaux composés", () => {
    expect(() =>
      computeSuccessiveDive({ gps: "Z", surfaceIntervalMinutes: 60, secondDiveDepth: 20 }),
    ).toThrow(Mn90DataError);
    expect(() =>
      computeSuccessiveDive({ gps: "H", surfaceIntervalMinutes: 60, secondDiveDepth: 70 }),
    ).toThrow(Mn90DataError);
  });
});
