/**
 * Tests des lois physiques appliquées à la plongée.
 */

import { describe, expect, it } from "vitest";
import {
  absolutePressure,
  archimedeApparentWeight,
  boyleMariotteVolume,
  consumptionAtDepth,
  daltonPartialPressure,
  depthForPartialPressure,
  surfaceEquivalentConsumption,
  WATER_DENSITY_FRESH,
  WATER_DENSITY_SEA,
} from "@/lib/calc/physique";

describe("absolutePressure", () => {
  it("vaut 1 bar en surface et augmente de 1 bar tous les 10 m", () => {
    expect(absolutePressure(0)).toBe(1);
    expect(absolutePressure(10)).toBe(2);
    expect(absolutePressure(40)).toBe(5);
  });

  it("gère les profondeurs intermédiaires", () => {
    expect(absolutePressure(38)).toBeCloseTo(4.8, 10);
    expect(absolutePressure(3)).toBeCloseTo(1.3, 10);
  });

  it("refuse une profondeur négative ou non finie", () => {
    expect(() => absolutePressure(-1)).toThrow(/Profondeur invalide/);
    expect(() => absolutePressure(Number.NaN)).toThrow(/Profondeur invalide/);
  });
});

describe("boyleMariotteVolume", () => {
  it("un ballon de 6 L à 4 bar occupe 24 L à 1 bar", () => {
    expect(boyleMariotteVolume(6, 4, 1)).toBe(24);
  });

  it("un ballon de 6 L en surface occupe 1,5 L à 30 m (4 bar)", () => {
    expect(boyleMariotteVolume(6, 1, 4)).toBe(1.5);
  });

  it("refuse volumes et pressions nuls ou négatifs", () => {
    expect(() => boyleMariotteVolume(0, 1, 2)).toThrow(/Volume initial invalide/);
    expect(() => boyleMariotteVolume(6, 0, 2)).toThrow(/Pression initiale invalide/);
    expect(() => boyleMariotteVolume(6, 1, 0)).toThrow(/Pression finale invalide/);
  });
});

describe("daltonPartialPressure", () => {
  it("PpO₂ de l'air à 40 m (5 bar) : 0,21 × 5 = 1,05 bar", () => {
    expect(daltonPartialPressure(0.21, 5)).toBeCloseTo(1.05, 10);
  });

  it("PpN₂ de l'air à 30 m (4 bar) : 0,79 × 4 = 3,16 bar", () => {
    expect(daltonPartialPressure(0.79, 4)).toBeCloseTo(3.16, 10);
  });

  it("refuse une fraction hors de ]0 ; 1] et une pression invalide", () => {
    expect(() => daltonPartialPressure(0, 3)).toThrow(/Fraction de gaz invalide/);
    expect(() => daltonPartialPressure(1.2, 3)).toThrow(/Fraction de gaz invalide/);
    expect(() => daltonPartialPressure(0.21, 0)).toThrow(/Pression absolue invalide/);
  });
});

describe("depthForPartialPressure", () => {
  it("air (21 % O₂), PpO₂ max 1,6 bar → 66,19 m", () => {
    expect(depthForPartialPressure(0.21, 1.6)).toBeCloseTo(66.19, 2);
  });

  it("nitrox 32, PpO₂ max 1,4 bar → 33,75 m", () => {
    expect(depthForPartialPressure(0.32, 1.4)).toBeCloseTo(33.75, 10);
  });

  it("nitrox 40, PpO₂ max 1,6 bar → 30 m", () => {
    expect(depthForPartialPressure(0.4, 1.6)).toBeCloseTo(30, 10);
  });

  it("refuse une cible déjà dépassée en surface (O₂ pur, cible 0,5 bar)", () => {
    expect(() => depthForPartialPressure(1, 0.5)).toThrow(/déjà dépassée en surface/);
  });

  it("refuse fraction et cible invalides", () => {
    expect(() => depthForPartialPressure(0, 1.6)).toThrow(/Fraction de gaz invalide/);
    expect(() => depthForPartialPressure(0.21, 0)).toThrow(/Pression partielle cible invalide/);
  });
});

describe("archimedeApparentWeight", () => {
  it("plongeur 85 kg / 80 L en eau douce : poids apparent +5 kgf (49,05 N), il coule", () => {
    const result = archimedeApparentWeight({
      massKg: 85,
      volumeLiters: 80,
      waterDensity: WATER_DENSITY_FRESH,
    });
    expect(result.buoyancyKgf).toBeCloseTo(80, 10);
    expect(result.apparentWeightKgf).toBeCloseTo(5, 10);
    expect(result.apparentWeightNewtons).toBeCloseTo(49.05, 10);
  });

  it("plongeur 80 kg / 78 L en mer (1,03) : poids apparent −0,34 kgf, il flotte", () => {
    const result = archimedeApparentWeight({
      massKg: 80,
      volumeLiters: 78,
      waterDensity: WATER_DENSITY_SEA,
    });
    expect(result.buoyancyKgf).toBeCloseTo(80.34, 10);
    expect(result.apparentWeightKgf).toBeCloseTo(-0.34, 10);
    expect(result.apparentWeightNewtons).toBeCloseTo(-3.34, 2);
  });

  it("la même masse flotte davantage en mer qu'en eau douce", () => {
    const fresh = archimedeApparentWeight({ massKg: 82, volumeLiters: 80, waterDensity: 1.0 });
    const sea = archimedeApparentWeight({ massKg: 82, volumeLiters: 80, waterDensity: 1.03 });
    expect(sea.apparentWeightKgf).toBeLessThan(fresh.apparentWeightKgf);
  });

  it("refuse masse, volume ou densité invalides", () => {
    expect(() =>
      archimedeApparentWeight({ massKg: -1, volumeLiters: 80, waterDensity: 1 }),
    ).toThrow(/Masse invalide/);
    expect(() => archimedeApparentWeight({ massKg: 80, volumeLiters: 0, waterDensity: 1 })).toThrow(
      /Volume invalide/,
    );
    expect(() =>
      archimedeApparentWeight({ massKg: 80, volumeLiters: 80, waterDensity: 0 }),
    ).toThrow(/Densité d'eau invalide/);
  });
});

describe("consommations", () => {
  it("consommation au fond : 20 L/min en surface → 60 L/min à 20 m", () => {
    expect(consumptionAtDepth(20, 20)).toBe(60);
  });

  it("consommation ramenée en surface : 60 L/min à 20 m → 20 L/min", () => {
    expect(surfaceEquivalentConsumption(60, 20)).toBe(20);
  });

  it("les deux fonctions sont réciproques", () => {
    const surface = 17;
    const depth = 34;
    expect(surfaceEquivalentConsumption(consumptionAtDepth(surface, depth), depth)).toBeCloseTo(
      surface,
      10,
    );
  });

  it("refuse des consommations nulles ou négatives", () => {
    expect(() => consumptionAtDepth(0, 20)).toThrow(/Consommation en surface invalide/);
    expect(() => surfaceEquivalentConsumption(-5, 20)).toThrow(/Consommation au fond invalide/);
  });
});
