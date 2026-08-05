/**
 * Générateurs d'exercices paramétriques — déterministes (même graine → même
 * énoncé, mêmes valeurs, même corrigé).
 *
 * Chaque générateur tire des paramètres réalistes via mulberry32, construit
 * un énoncé en français (Markdown + KaTeX entre `$...$`) et un corrigé pas à
 * pas complet (`steps`). Les générateurs qui s'appuient sur les tables MN90
 * tirent leurs paramètres DANS la couverture de `content/data/mn90.json`
 * (entrées exactes du fichier), pour ne jamais déclencher `Mn90DataError`.
 */

import mn90Json from "@/content/data/mn90.json";
import { computeAutonomy } from "@/lib/calc/autonomie";
import { computeSimpleDive, computeSuccessiveDive } from "@/lib/calc/mn90";
import {
  absolutePressure,
  boyleMariotteVolume,
  daltonPartialPressure,
  depthForPartialPressure,
  WATER_DENSITY_FRESH,
  WATER_DENSITY_SEA,
} from "@/lib/calc/physique";
import { mulberry32, pick, randInt } from "@/lib/calc/random";
import type { ExerciseGenerator, ExerciseStep, GeneratedExercise } from "@/lib/types";

// ---------------------------------------------------------------------------
// Typage local des données MN90 (pour le tirage dans la couverture)
// ---------------------------------------------------------------------------

interface Mn90Row {
  duration: number;
  stops: Record<string, number>;
  gps: string;
}

interface Mn90JsonShape {
  tableI: { entries: { depth: number; rows: Mn90Row[] }[] };
  tableII: { intervals: number[]; residualNitrogen: Record<string, number[]> };
  tableIII: { nitrogenLevels: number[]; depths: number[]; majorations: number[][] };
}

const MN90 = mn90Json as unknown as Mn90JsonShape;

// ---------------------------------------------------------------------------
// Helpers de formatage
// ---------------------------------------------------------------------------

/** Arrondit à 2 décimales (nombre exploitable comme réponse). */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Formate un nombre pour un texte français (virgule décimale, 2 décimales max). */
function fr(value: number): string {
  return String(round2(value)).replace(".", ",");
}

/** Formate un nombre pour une formule KaTeX (virgule décimale sans espace : `{,}`). */
function tex(value: number): string {
  return String(round2(value)).replace(".", "{,}");
}

// ---------------------------------------------------------------------------
// 1. Pression absolue (N1)
// ---------------------------------------------------------------------------

const pressionAbsolueGenerator: ExerciseGenerator = {
  id: "pression-absolue-n1",
  title: "Pression absolue en immersion",
  level: "n1",
  domain: "physique",
  moduleSlug: "n1-flottabilite-pression",
  generate(seed: number): GeneratedExercise {
    const rng = mulberry32(seed);
    const depth = pick(rng, [5, 8, 10, 12, 15, 18, 20]);
    const answer = round2(absolutePressure(depth));

    const steps: ExerciseStep[] = [
      {
        label: "Pression relative due à l'eau",
        formula: "P_{rel} = \\frac{prof}{10}",
        detail: `Tous les 10 m d'eau, la pression augmente de 1 bar : ${fr(depth)} / 10 = ${fr(depth / 10)} bar.`,
      },
      {
        label: "Pression absolue",
        formula: "P_{abs} = \\frac{prof}{10} + 1",
        detail: `On ajoute la pression atmosphérique (1 bar) : ${fr(depth / 10)} + 1 = ${fr(answer)} bar.`,
      },
    ];

    return {
      generatorId: "pression-absolue-n1",
      title: "Pression absolue en immersion",
      statement:
        `Un plongeur évolue à ${depth} m de profondeur. ` +
        `Quelle est la pression absolue qui s'exerce sur lui, en bar ? ` +
        `(On prend $P_{atm} = 1\\ \\text{bar}$ et 1 bar tous les 10 m d'eau.)`,
      steps,
      answer,
      unit: "bar",
      tolerance: 0.01,
    };
  },
};

// ---------------------------------------------------------------------------
// 2. Boyle-Mariotte (N2)
// ---------------------------------------------------------------------------

const mariotteGenerator: ExerciseGenerator = {
  id: "mariotte-ballon-n2",
  title: "Loi de Boyle-Mariotte : volume d'un ballon",
  level: "n2",
  domain: "physique",
  moduleSlug: "n2-pression-mariotte",
  generate(seed: number): GeneratedExercise {
    const rng = mulberry32(seed);
    const depth = pick(rng, [10, 20, 30, 40]);
    const volume = randInt(rng, 2, 8);
    const goingUp = rng() < 0.5;

    const pDepth = absolutePressure(depth);
    const p1 = goingUp ? pDepth : 1;
    const p2 = goingUp ? 1 : pDepth;
    const answer = round2(boyleMariotteVolume(volume, p1, p2));

    const statement = goingUp
      ? `Un ballon souple est gonflé à ${volume} L à ${depth} m de profondeur, puis lâché. ` +
        `Quel volume occupe-t-il en arrivant à la surface ? (Température constante.)`
      : `Un ballon souple de ${volume} L est gonflé à la surface, puis descendu à ${depth} m de profondeur. ` +
        `Quel volume occupe-t-il à cette profondeur ? (Température constante.)`;

    const steps: ExerciseStep[] = [
      {
        label: "Pressions absolues aux deux profondeurs",
        formula: "P_{abs} = \\frac{prof}{10} + 1",
        detail: `À ${depth} m : ${fr(depth)} / 10 + 1 = ${fr(pDepth)} bar ; à la surface : 1 bar.`,
      },
      {
        label: "Loi de Boyle-Mariotte",
        formula: "P_1 \\times V_1 = P_2 \\times V_2",
        detail: `À température constante, le produit pression × volume est constant.`,
      },
      {
        label: "Volume final",
        formula: `V_2 = \\frac{V_1 \\times P_1}{P_2} = \\frac{${tex(volume)} \\times ${tex(p1)}}{${tex(p2)}}`,
        detail: `V₂ = ${fr(volume)} × ${fr(p1)} / ${fr(p2)} = ${fr(answer)} L.`,
      },
    ];

    return {
      generatorId: "mariotte-ballon-n2",
      title: "Loi de Boyle-Mariotte : volume d'un ballon",
      statement,
      steps,
      answer,
      unit: "L",
      tolerance: 0.02,
    };
  },
};

// ---------------------------------------------------------------------------
// 3. Dalton : pression partielle à l'air (N2)
// ---------------------------------------------------------------------------

const daltonGenerator: ExerciseGenerator = {
  id: "dalton-pression-partielle-n2",
  title: "Loi de Dalton : pression partielle à l'air",
  level: "n2",
  domain: "physique",
  moduleSlug: "n2-dalton-henry",
  generate(seed: number): GeneratedExercise {
    const rng = mulberry32(seed);
    const depth = pick(rng, [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]);
    const gas = pick(rng, [
      { name: "d'oxygène ($PpO_2$)", symbol: "PpO_2", fraction: 0.21, label: "O₂ (21 %)" },
      { name: "d'azote ($PpN_2$)", symbol: "PpN_2", fraction: 0.79, label: "N₂ (79 %)" },
    ] as const);

    const pAbs = absolutePressure(depth);
    const answer = round2(daltonPartialPressure(gas.fraction, pAbs));

    const steps: ExerciseStep[] = [
      {
        label: "Pression absolue à la profondeur",
        formula: "P_{abs} = \\frac{prof}{10} + 1",
        detail: `${fr(depth)} / 10 + 1 = ${fr(pAbs)} bar.`,
      },
      {
        label: "Loi de Dalton",
        formula: `${gas.symbol} = F_{gaz} \\times P_{abs}`,
        detail:
          `La pression partielle d'un gaz est proportionnelle à sa fraction dans le mélange : ` +
          `${fr(gas.fraction)} × ${fr(pAbs)} = ${fr(answer)} bar pour le gaz ${gas.label}.`,
      },
    ];

    return {
      generatorId: "dalton-pression-partielle-n2",
      title: "Loi de Dalton : pression partielle à l'air",
      statement:
        `Un plongeur respire de l'air (21 % d'O₂, 79 % de N₂) à ${depth} m de profondeur. ` +
        `Quelle est la pression partielle ${gas.name} qu'il respire, en bar ?`,
      steps,
      answer,
      unit: "bar",
      tolerance: 0.02,
    };
  },
};

// ---------------------------------------------------------------------------
// 4. Dalton : profondeur maximale au nitrox (N4)
// ---------------------------------------------------------------------------

const nitroxDepthGenerator: ExerciseGenerator = {
  id: "nitrox-profondeur-max-n4",
  title: "Profondeur maximale d'utilisation d'un nitrox",
  level: "n4",
  domain: "physique",
  moduleSlug: "n4-pressions-gaz",
  generate(seed: number): GeneratedExercise {
    const rng = mulberry32(seed);
    const mix = pick(rng, [
      { o2Percent: 32, fraction: 0.32 },
      { o2Percent: 36, fraction: 0.36 },
      { o2Percent: 40, fraction: 0.4 },
    ] as const);
    const ppMax = pick(rng, [1.4, 1.6]);

    const maxPAbs = ppMax / mix.fraction;
    const answer = round2(depthForPartialPressure(mix.fraction, ppMax));

    const steps: ExerciseStep[] = [
      {
        label: "Pression absolue maximale admissible",
        formula: `P_{abs\\,max} = \\frac{PpO_{2\\,max}}{F_{O_2}} = \\frac{${tex(ppMax)}}{${tex(mix.fraction)}}`,
        detail: `${fr(ppMax)} / ${fr(mix.fraction)} = ${fr(maxPAbs)} bar de pression absolue au maximum.`,
      },
      {
        label: "Profondeur correspondante",
        formula: "prof_{max} = (P_{abs\\,max} - 1) \\times 10",
        detail:
          `(${fr(maxPAbs)} − 1) × 10 = ${fr(answer)} m. ` +
          `En pratique, on arrondit à la profondeur inférieure par sécurité.`,
      },
    ];

    return {
      generatorId: "nitrox-profondeur-max-n4",
      title: "Profondeur maximale d'utilisation d'un nitrox",
      statement:
        `Un plongeur utilise un nitrox à ${mix.o2Percent} % d'oxygène. ` +
        `La pression partielle d'oxygène ne doit pas dépasser $${tex(ppMax)}\\ \\text{bar}$. ` +
        `Quelle est la profondeur maximale d'utilisation de ce mélange, en mètres ?`,
      steps,
      answer,
      unit: "m",
      tolerance: 0.02,
    };
  },
};

// ---------------------------------------------------------------------------
// 5. Archimède : lestage (N2)
// ---------------------------------------------------------------------------

const archimedeGenerator: ExerciseGenerator = {
  id: "archimede-lestage-n2",
  title: "Poussée d'Archimède : calcul de lestage",
  level: "n2",
  domain: "physique",
  moduleSlug: "n2-archimede",
  generate(seed: number): GeneratedExercise {
    const rng = mulberry32(seed);
    const massKg = randInt(rng, 75, 95);
    const volumeLiters = massKg + randInt(rng, 2, 8);
    const water = pick(rng, [
      { label: "en mer", density: WATER_DENSITY_SEA },
      { label: "en lac (eau douce)", density: WATER_DENSITY_FRESH },
    ] as const);

    const buoyancy = round2(volumeLiters * water.density);
    // Le plongeur flotte : le lestage à ajouter est l'opposé du poids apparent.
    const answer = round2(buoyancy - massKg);

    const steps: ExerciseStep[] = [
      {
        label: "Poussée d'Archimède",
        formula: `P_{arch} = V \\times d = ${tex(volumeLiters)} \\times ${tex(water.density)}`,
        detail:
          `Le poids du volume d'eau déplacé : ${fr(volumeLiters)} L × ${fr(water.density)} = ` +
          `${fr(buoyancy)} kg de poussée vers le haut.`,
      },
      {
        label: "Poids apparent",
        formula: "P_{app} = P_{reel} - P_{arch}",
        detail:
          `${fr(massKg)} − ${fr(buoyancy)} = ${fr(massKg - buoyancy)} kg : ` +
          `le poids apparent est négatif, le plongeur flotte.`,
      },
      {
        label: "Lestage nécessaire",
        formula: "lest = P_{arch} - P_{reel}",
        detail:
          `Pour être équilibré (poids apparent nul), il faut ajouter ` +
          `${fr(buoyancy)} − ${fr(massKg)} = ${fr(answer)} kg de plomb.`,
      },
    ];

    return {
      generatorId: "archimede-lestage-n2",
      title: "Poussée d'Archimède : calcul de lestage",
      statement:
        `Un plongeur équipé pèse ${massKg} kg et son volume total (corps + équipement) est de ` +
        `${volumeLiters} L. Il plonge ${water.label}, où la densité de l'eau est de ${fr(water.density)}. ` +
        `Quel lestage doit-il ajouter, en kg, pour être parfaitement équilibré ? ` +
        `(On néglige le volume du plomb.)`,
      steps,
      answer,
      unit: "kg",
      tolerance: 0.02,
    };
  },
};

// ---------------------------------------------------------------------------
// 6. Autonomie en air (N2)
// ---------------------------------------------------------------------------

const autonomieGenerator: ExerciseGenerator = {
  id: "autonomie-air-n2",
  title: "Autonomie en air à profondeur constante",
  level: "n2",
  domain: "physique",
  moduleSlug: "n2-consommation-autonomie",
  generate(seed: number): GeneratedExercise {
    const rng = mulberry32(seed);
    const tankVolumeLiters = pick(rng, [12, 15]);
    const pressureBar = randInt(rng, 18, 23) * 10; // 180 à 230 bar
    const reserveBar = 50;
    const surfaceConsumption = pick(rng, [15, 17, 20]);
    const depthMeters = pick(rng, [10, 15, 20, 25, 30, 35, 40]);

    const result = computeAutonomy({
      tankVolumeLiters,
      pressureBar,
      reserveBar,
      surfaceConsumption,
      depthMeters,
    });

    return {
      generatorId: "autonomie-air-n2",
      title: "Autonomie en air à profondeur constante",
      statement:
        `Un plongeur équipé d'un bloc de ${tankVolumeLiters} L gonflé à ${pressureBar} bar évolue à ` +
        `${depthMeters} m. Sa consommation en surface est de ${surfaceConsumption} L/min et il souhaite ` +
        `conserver une réserve de ${reserveBar} bar. Quelle est son autonomie à cette profondeur, ` +
        `en minutes (arrondie à la minute inférieure) ?`,
      steps: result.steps,
      answer: result.autonomyMinutes,
      unit: "min",
      tolerance: 0.02,
    };
  },
};

// ---------------------------------------------------------------------------
// 7. Volume d'air consommé (N3)
// ---------------------------------------------------------------------------

const consommationGenerator: ExerciseGenerator = {
  id: "consommation-volume-n3",
  title: "Volume d'air consommé pendant une plongée",
  level: "n3",
  domain: "physique",
  moduleSlug: "n3-planification-air",
  generate(seed: number): GeneratedExercise {
    const rng = mulberry32(seed);
    const depth = pick(rng, [10, 20, 30, 40]);
    const durationMinutes = randInt(rng, 10, 25);
    const surfaceConsumption = pick(rng, [15, 18, 20]);

    const pAbs = absolutePressure(depth);
    const depthConsumption = surfaceConsumption * pAbs;
    const answer = round2(depthConsumption * durationMinutes);

    const steps: ExerciseStep[] = [
      {
        label: "Pression absolue à la profondeur",
        formula: "P_{abs} = \\frac{prof}{10} + 1",
        detail: `${fr(depth)} / 10 + 1 = ${fr(pAbs)} bar.`,
      },
      {
        label: "Consommation au fond",
        formula: "C_{fond} = C_{surface} \\times P_{abs}",
        detail: `${fr(surfaceConsumption)} × ${fr(pAbs)} = ${fr(depthConsumption)} L/min à ${fr(depth)} m.`,
      },
      {
        label: "Volume total consommé",
        formula: `V = C_{fond} \\times t = ${tex(depthConsumption)} \\times ${tex(durationMinutes)}`,
        detail: `${fr(depthConsumption)} L/min × ${fr(durationMinutes)} min = ${fr(answer)} L d'air (détendus à 1 bar).`,
      },
    ];

    return {
      generatorId: "consommation-volume-n3",
      title: "Volume d'air consommé pendant une plongée",
      statement:
        `Un plongeur dont la consommation en surface est de ${surfaceConsumption} L/min reste ` +
        `${durationMinutes} min à ${depth} m de profondeur. Quel volume d'air (en litres, ramenés ` +
        `à la pression atmosphérique) consomme-t-il pendant cette période ?`,
      steps,
      answer,
      unit: "L",
      tolerance: 0.02,
    };
  },
};

// ---------------------------------------------------------------------------
// 8. Table MN90 : plongée simple (N2) — tirage DANS la couverture du JSON
// ---------------------------------------------------------------------------

const mn90SimpleGenerator: ExerciseGenerator = {
  id: "mn90-plongee-simple-n2",
  title: "Table MN90 : plongée simple et DTR",
  level: "n2",
  domain: "tables-deco",
  moduleSlug: "n2-tables-mn90",
  generate(seed: number): GeneratedExercise {
    const rng = mulberry32(seed);
    // Tirage d'une entrée exacte du fichier de données : couverture garantie.
    const entry = pick(rng, MN90.tableI.entries);
    const row = pick(rng, entry.rows);

    const result = computeSimpleDive({ depthMeters: entry.depth, durationMinutes: row.duration });

    const stopsText =
      result.stops.length === 0
        ? "aucun palier obligatoire"
        : result.stops.map((s) => `${s.minutes} min à ${s.depth} m`).join(", puis ");

    const firstStopDepth = result.stops.length > 0 ? result.stops[0].depth : 0;
    const stopMinutes = result.stops.reduce((total, s) => total + s.minutes, 0);
    const mainAscent = (entry.depth - firstStopDepth) / 15;
    const interStops = firstStopDepth / 6;

    const steps: ExerciseStep[] = [
      {
        label: "Lecture de la table I",
        detail:
          `Entrée ${result.tableDepth} m / ${result.tableDuration} min : ${stopsText} ` +
          `(GPS : ${result.gps}).`,
      },
      {
        label: "Remontée à 15 m/min",
        formula: "t_{remontee} = \\frac{prof - prof_{palier}}{15}",
        detail:
          result.stops.length === 0
            ? `Du fond à la surface : ${fr(entry.depth)} / 15 = ${fr(mainAscent)} min.`
            : `Du fond au premier palier (${firstStopDepth} m) : ` +
              `(${fr(entry.depth)} − ${fr(firstStopDepth)}) / 15 = ${fr(mainAscent)} min.`,
      },
      {
        label: "Paliers et remontée à 6 m/min",
        detail:
          result.stops.length === 0
            ? "Aucun palier : rien à ajouter."
            : `Paliers : ${fr(stopMinutes)} min ; trajets entre paliers et jusqu'à la surface à 6 m/min : ` +
              `${fr(firstStopDepth)} / 6 = ${fr(interStops)} min.`,
      },
      {
        label: "Durée totale de remontée (DTR)",
        detail:
          `${fr(mainAscent)} + ${fr(interStops)} + ${fr(stopMinutes)} = ` +
          `${fr(mainAscent + interStops + stopMinutes)} min, arrondi à la minute supérieure : ` +
          `${result.dtrMinutes} min.`,
      },
    ];

    return {
      generatorId: "mn90-plongee-simple-n2",
      title: "Table MN90 : plongée simple et DTR",
      statement:
        `Une palanquée effectue une plongée simple à ${entry.depth} m pendant ${row.duration} min ` +
        `(profondeur et durée exactes des entrées de table). À l'aide des tables MN90, déterminez la ` +
        `durée totale de remontée (DTR) en minutes, en remontant à 15 m/min jusqu'au premier palier ` +
        `(ou jusqu'à la surface) puis à 6 m/min entre les paliers et vers la surface ` +
        `(résultat arrondi à la minute supérieure).`,
      steps,
      answer: result.dtrMinutes,
      unit: "min",
      tolerance: 0.02,
    };
  },
};

// ---------------------------------------------------------------------------
// 9. Table MN90 : majoration de plongée successive (N3) — dans la couverture
// ---------------------------------------------------------------------------

const mn90MajorationGenerator: ExerciseGenerator = {
  id: "mn90-majoration-n3",
  title: "Table MN90 : majoration d'une plongée successive",
  level: "n3",
  domain: "tables-deco",
  moduleSlug: "n3-tables-avancees",
  generate(seed: number): GeneratedExercise {
    const rng = mulberry32(seed);
    const gps = pick(rng, ["B", "C", "D", "E", "F", "G", "H", "I", "J", "K"] as const);
    const surfaceIntervalMinutes = randInt(rng, 30, 240);
    // Profondeur ≥ 15 m : évite la seule case sentinelle (999) du tableau III.
    const secondDiveDepth = pick(rng, [15, 20, 25, 30, 35, 40]);

    const result = computeSuccessiveDive({ gps, surfaceIntervalMinutes, secondDiveDepth });

    // Reconstitution des valeurs de table utilisées, pour le corrigé.
    const intervals = MN90.tableII.intervals;
    let usedInterval = intervals[0];
    for (const interval of intervals) {
      if (interval <= surfaceIntervalMinutes) usedInterval = interval;
    }
    const usedLevel = MN90.tableIII.nitrogenLevels.find((l) => l >= result.residualNitrogen);
    const usedDepth = MN90.tableIII.depths.find((d) => d >= secondDiveDepth);

    const steps: ExerciseStep[] = [
      {
        label: "Tableau II : azote résiduel",
        detail:
          `Intervalle de ${surfaceIntervalMinutes} min → colonne immédiatement inférieure : ` +
          `${usedInterval} min. Pour le GPS ${gps}, azote résiduel = ${fr(result.residualNitrogen)}.`,
      },
      {
        label: "Tableau III : majoration",
        detail:
          `Azote ${fr(result.residualNitrogen)} → ligne immédiatement supérieure : ${fr(usedLevel ?? 0)} ; ` +
          `profondeur ${secondDiveDepth} m → colonne immédiatement supérieure : ${usedDepth ?? 0} m. ` +
          `Majoration lue : ${result.majorationMinutes} min.`,
      },
      {
        label: "Utilisation de la majoration",
        detail:
          `La majoration de ${result.majorationMinutes} min s'ajoute à la durée réelle de la seconde ` +
          `plongée pour entrer dans la table I (durée fictive).`,
      },
    ];

    return {
      generatorId: "mn90-majoration-n3",
      title: "Table MN90 : majoration d'une plongée successive",
      statement:
        `Après une première plongée sortie avec le GPS ${gps}, une palanquée observe un intervalle de ` +
        `surface de ${surfaceIntervalMinutes} min, puis replonge à ${secondDiveDepth} m. ` +
        `À l'aide des tableaux II et III des tables MN90, déterminez la majoration (en minutes) ` +
        `à ajouter à la durée de la seconde plongée.`,
      steps,
      answer: result.majorationMinutes,
      unit: "min",
      tolerance: 0.02,
    };
  },
};

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

/** Tous les générateurs d'exercices disponibles dans l'application. */
export const GENERATORS: ExerciseGenerator[] = [
  pressionAbsolueGenerator,
  mariotteGenerator,
  daltonGenerator,
  nitroxDepthGenerator,
  archimedeGenerator,
  autonomieGenerator,
  consommationGenerator,
  mn90SimpleGenerator,
  mn90MajorationGenerator,
];

/** Retrouve un générateur par son identifiant. */
export function getGenerator(id: string): ExerciseGenerator | undefined {
  return GENERATORS.find((generator) => generator.id === id);
}
