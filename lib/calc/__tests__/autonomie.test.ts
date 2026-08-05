/**
 * Tests du calcul d'autonomie en air.
 */

import { describe, expect, it } from "vitest";
import { computeAutonomy } from "@/lib/calc/autonomie";

describe("computeAutonomy — cas nominaux", () => {
  it("bloc 12 L à 200 bar, réserve 50 bar, 20 L/min, 20 m → 30 min", () => {
    const result = computeAutonomy({
      tankVolumeLiters: 12,
      pressureBar: 200,
      reserveBar: 50,
      surfaceConsumption: 20,
      depthMeters: 20,
    });
    expect(result.availableAirLiters).toBe(1800); // 12 × (200 − 50)
    expect(result.absolutePressureBar).toBe(3); // 20 / 10 + 1
    expect(result.consumptionAtDepth).toBe(60); // 20 × 3
    expect(result.autonomyMinutes).toBe(30); // 1800 / 60
  });

  it("bloc 15 L à 230 bar, réserve 50 bar, 15 L/min, 40 m → 36 min", () => {
    const result = computeAutonomy({
      tankVolumeLiters: 15,
      pressureBar: 230,
      reserveBar: 50,
      surfaceConsumption: 15,
      depthMeters: 40,
    });
    expect(result.availableAirLiters).toBe(2700);
    expect(result.absolutePressureBar).toBe(5);
    expect(result.consumptionAtDepth).toBe(75);
    expect(result.autonomyMinutes).toBe(36);
  });

  it("en surface (0 m), la consommation au fond égale la consommation de surface", () => {
    const result = computeAutonomy({
      tankVolumeLiters: 12,
      pressureBar: 200,
      reserveBar: 50,
      surfaceConsumption: 20,
      depthMeters: 0,
    });
    expect(result.absolutePressureBar).toBe(1);
    expect(result.consumptionAtDepth).toBe(20);
    expect(result.autonomyMinutes).toBe(90);
  });
});

describe("computeAutonomy — arrondi à la minute inférieure", () => {
  it("15 L à 220 bar, réserve 50 bar, 17 L/min, 22 m → 46,875 → 46 min", () => {
    const result = computeAutonomy({
      tankVolumeLiters: 15,
      pressureBar: 220,
      reserveBar: 50,
      surfaceConsumption: 17,
      depthMeters: 22,
    });
    expect(result.availableAirLiters).toBe(2550);
    expect(result.absolutePressureBar).toBeCloseTo(3.2, 10);
    expect(result.consumptionAtDepth).toBeCloseTo(54.4, 10);
    expect(result.autonomyMinutes).toBe(46); // jamais la minute entamée
  });
});

describe("computeAutonomy — étapes pédagogiques", () => {
  it("retourne 4 étapes complètes (label, formule, détail chiffré)", () => {
    const result = computeAutonomy({
      tankVolumeLiters: 12,
      pressureBar: 200,
      reserveBar: 50,
      surfaceConsumption: 20,
      depthMeters: 20,
    });
    expect(result.steps).toHaveLength(4);
    for (const step of result.steps) {
      expect(step.label.length).toBeGreaterThan(0);
      expect(step.formula ?? "").not.toBe("");
      expect(step.detail.length).toBeGreaterThan(0);
    }
    expect(result.steps[0].detail).toContain("1800");
    expect(result.steps[3].detail).toContain("30");
  });
});

describe("computeAutonomy — validation des entrées", () => {
  const base = {
    tankVolumeLiters: 12,
    pressureBar: 200,
    reserveBar: 50,
    surfaceConsumption: 20,
    depthMeters: 20,
  };

  it("refuse un volume nul ou négatif", () => {
    expect(() => computeAutonomy({ ...base, tankVolumeLiters: 0 })).toThrow(/Volume de bloc invalide/);
    expect(() => computeAutonomy({ ...base, tankVolumeLiters: -12 })).toThrow(/Volume de bloc invalide/);
  });

  it("refuse une pression de gonflage nulle ou négative", () => {
    expect(() => computeAutonomy({ ...base, pressureBar: 0 })).toThrow(/Pression de gonflage invalide/);
  });

  it("refuse une réserve négative", () => {
    expect(() => computeAutonomy({ ...base, reserveBar: -10 })).toThrow(/Pression de réserve invalide/);
  });

  it("refuse une réserve supérieure ou égale à la pression de gonflage", () => {
    expect(() => computeAutonomy({ ...base, reserveBar: 200 })).toThrow(/aucun air disponible/i);
    expect(() => computeAutonomy({ ...base, pressureBar: 50, reserveBar: 50 })).toThrow(
      /aucun air disponible/i,
    );
  });

  it("refuse une consommation nulle et une profondeur négative", () => {
    expect(() => computeAutonomy({ ...base, surfaceConsumption: 0 })).toThrow(
      /Consommation en surface invalide/,
    );
    expect(() => computeAutonomy({ ...base, depthMeters: -1 })).toThrow(/Profondeur invalide/);
  });
});
