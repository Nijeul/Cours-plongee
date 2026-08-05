/**
 * Tests des générateurs d'exercices : déterminisme, validité et bornes
 * réalistes des réponses, couverture MN90 jamais dépassée.
 */

import { describe, expect, it } from "vitest";
import { GENERATORS, getGenerator } from "@/lib/calc/generators";
import { mulberry32, pick, randInt } from "@/lib/calc/random";
import { LEVEL_SLUGS, DOMAIN_SLUGS } from "@/lib/types";

const SEEDS = Array.from({ length: 51 }, (_, i) => i); // 0..50

describe("random — mulberry32 et helpers", () => {
  it("une même graine produit la même séquence", () => {
    const a = mulberry32(123);
    const b = mulberry32(123);
    for (let i = 0; i < 20; i++) {
      expect(a()).toBe(b());
    }
  });

  it("des graines différentes produisent des séquences différentes", () => {
    const a = mulberry32(1)();
    const b = mulberry32(2)();
    expect(a).not.toBe(b);
  });

  it("les valeurs restent dans [0 ; 1)", () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("randInt respecte les bornes incluses", () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 500; i++) {
      const v = randInt(rng, 3, 6);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(6);
      expect(Number.isInteger(v)).toBe(true);
    }
  });

  it("randInt et pick valident leurs entrées", () => {
    const rng = mulberry32(1);
    expect(() => randInt(rng, 5, 2)).toThrow(/min .* supérieur à max/);
    expect(() => pick(rng, [])).toThrow(/tableau vide/);
  });
});

describe("GENERATORS — structure et contrat", () => {
  it("expose au moins 8 générateurs aux identifiants uniques", () => {
    expect(GENERATORS.length).toBeGreaterThanOrEqual(8);
    const ids = GENERATORS.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("chaque générateur référence un niveau et un domaine valides", () => {
    for (const generator of GENERATORS) {
      expect(LEVEL_SLUGS).toContain(generator.level);
      expect(DOMAIN_SLUGS).toContain(generator.domain);
      expect(generator.moduleSlug.startsWith(`${generator.level}-`)).toBe(true);
    }
  });

  it("getGenerator retrouve un générateur par id", () => {
    expect(getGenerator("autonomie-air-n2")?.title).toContain("Autonomie");
    expect(getGenerator("inconnu")).toBeUndefined();
  });
});

describe("GENERATORS — déterminisme", () => {
  it("même graine → exercice strictement identique", () => {
    for (const generator of GENERATORS) {
      const first = generator.generate(42);
      const second = generator.generate(42);
      expect(second).toEqual(first);
    }
  });

  it("les graines font varier les énoncés", () => {
    for (const generator of GENERATORS) {
      const statements = new Set(SEEDS.slice(0, 12).map((s) => generator.generate(s).statement));
      expect(statements.size).toBeGreaterThan(1);
    }
  });
});

describe("GENERATORS — validité sur un large éventail de graines", () => {
  it("aucun générateur ne lève d'erreur et tous produisent un exercice complet (graines 0 à 50)", () => {
    for (const generator of GENERATORS) {
      for (const seed of SEEDS) {
        const exercise = generator.generate(seed);
        expect(exercise.generatorId).toBe(generator.id);
        expect(exercise.title.length).toBeGreaterThan(0);
        expect(exercise.statement.length).toBeGreaterThan(20);
        expect(exercise.steps.length).toBeGreaterThanOrEqual(2);
        for (const step of exercise.steps) {
          expect(step.label.length).toBeGreaterThan(0);
          expect(step.detail.length).toBeGreaterThan(0);
        }
        expect(Number.isFinite(exercise.answer)).toBe(true);
        expect(exercise.unit.length).toBeGreaterThan(0);
        expect(exercise.tolerance).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe("GENERATORS — bornes réalistes des réponses", () => {
  function answers(id: string): number[] {
    const generator = getGenerator(id);
    expect(generator).toBeDefined();
    return SEEDS.map((seed) => generator!.generate(seed).answer);
  }

  it("pression absolue N1 : entre 1,5 et 3 bar", () => {
    for (const answer of answers("pression-absolue-n1")) {
      expect(answer).toBeGreaterThanOrEqual(1.5);
      expect(answer).toBeLessThanOrEqual(3);
    }
  });

  it("Mariotte : volume strictement positif et réaliste", () => {
    for (const answer of answers("mariotte-ballon-n2")) {
      expect(answer).toBeGreaterThan(0.3);
      expect(answer).toBeLessThanOrEqual(40);
    }
  });

  it("Dalton : pression partielle entre 0,4 et 5,6 bar", () => {
    for (const answer of answers("dalton-pression-partielle-n2")) {
      expect(answer).toBeGreaterThanOrEqual(0.4);
      expect(answer).toBeLessThanOrEqual(5.6);
    }
  });

  it("profondeur max nitrox : entre 25 et 40 m", () => {
    for (const answer of answers("nitrox-profondeur-max-n4")) {
      expect(answer).toBeGreaterThanOrEqual(25);
      expect(answer).toBeLessThanOrEqual(40);
    }
  });

  it("Archimède : lestage entre 1 et 12 kg", () => {
    for (const answer of answers("archimede-lestage-n2")) {
      expect(answer).toBeGreaterThanOrEqual(1);
      expect(answer).toBeLessThanOrEqual(12);
    }
  });

  it("autonomie : entre 10 et 120 min, entière", () => {
    for (const answer of answers("autonomie-air-n2")) {
      expect(answer).toBeGreaterThanOrEqual(10);
      expect(answer).toBeLessThanOrEqual(120);
      expect(Number.isInteger(answer)).toBe(true);
    }
  });

  it("volume consommé : entre 200 et 3000 L", () => {
    for (const answer of answers("consommation-volume-n3")) {
      expect(answer).toBeGreaterThanOrEqual(200);
      expect(answer).toBeLessThanOrEqual(3000);
    }
  });

  it("MN90 plongée simple : DTR entière entre 1 et 60 min, jamais hors couverture", () => {
    for (const answer of answers("mn90-plongee-simple-n2")) {
      expect(Number.isInteger(answer)).toBe(true);
      expect(answer).toBeGreaterThanOrEqual(1);
      expect(answer).toBeLessThanOrEqual(60);
    }
  });

  it("MN90 majoration : entière entre 1 et 120 min, jamais hors couverture", () => {
    for (const answer of answers("mn90-majoration-n3")) {
      expect(Number.isInteger(answer)).toBe(true);
      expect(answer).toBeGreaterThanOrEqual(1);
      expect(answer).toBeLessThanOrEqual(120);
    }
  });
});
