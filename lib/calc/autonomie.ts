/**
 * Calcul d'autonomie en air — convention d'enseignement FFESSM (N2/N3).
 *
 * Modèle :
 * - air disponible = volume du bloc × (pression de gonflage − pression de réserve) ;
 * - pression absolue au fond = profondeur / 10 + 1 ;
 * - consommation au fond = consommation en surface × pression absolue ;
 * - autonomie = air disponible / consommation au fond, arrondie à la minute
 *   INFÉRIEURE (on ne s'accorde jamais la minute entamée).
 *
 * Chaque étape du calcul est restituée dans `steps` (label, formule KaTeX sans
 * les `$`, détail chiffré en français) pour affichage pédagogique.
 */

import type { AutonomyInput, AutonomyResult, ExerciseStep } from "@/lib/types";

/** Formate un nombre pour un texte français (virgule décimale, 2 décimales max). */
function fr(value: number): string {
  return String(Number(value.toFixed(2))).replace(".", ",");
}

/**
 * Calcule l'autonomie en air d'un plongeur à profondeur constante.
 *
 * @throws {Error} si une entrée est invalide : valeurs non finies ou négatives,
 *   volume/consommation nuls, ou réserve supérieure ou égale à la pression de
 *   gonflage (message français explicite).
 */
export function computeAutonomy(input: AutonomyInput): AutonomyResult {
  const { tankVolumeLiters, pressureBar, reserveBar, surfaceConsumption, depthMeters } = input;

  if (!Number.isFinite(tankVolumeLiters) || tankVolumeLiters <= 0) {
    throw new Error(
      `Volume de bloc invalide : ${tankVolumeLiters} L. Le volume doit être strictement positif (ex. 12 ou 15 L).`,
    );
  }
  if (!Number.isFinite(pressureBar) || pressureBar <= 0) {
    throw new Error(
      `Pression de gonflage invalide : ${pressureBar} bar. La pression doit être strictement positive (ex. 200 bar).`,
    );
  }
  if (!Number.isFinite(reserveBar) || reserveBar < 0) {
    throw new Error(
      `Pression de réserve invalide : ${reserveBar} bar. La réserve doit être positive ou nulle (ex. 50 bar).`,
    );
  }
  if (reserveBar >= pressureBar) {
    throw new Error(
      `Réserve (${reserveBar} bar) supérieure ou égale à la pression de gonflage (${pressureBar} bar) : ` +
        `aucun air disponible, le calcul d'autonomie est impossible.`,
    );
  }
  if (!Number.isFinite(surfaceConsumption) || surfaceConsumption <= 0) {
    throw new Error(
      `Consommation en surface invalide : ${surfaceConsumption} L/min. Elle doit être strictement positive (ex. 20 L/min).`,
    );
  }
  if (!Number.isFinite(depthMeters) || depthMeters < 0) {
    throw new Error(
      `Profondeur invalide : ${depthMeters} m. La profondeur doit être positive ou nulle.`,
    );
  }

  const availableAirLiters = tankVolumeLiters * (pressureBar - reserveBar);
  const absolutePressureBar = depthMeters / 10 + 1;
  const consumptionAtDepth = surfaceConsumption * absolutePressureBar;
  const rawAutonomy = availableAirLiters / consumptionAtDepth;
  const autonomyMinutes = Math.floor(rawAutonomy);

  const steps: ExerciseStep[] = [
    {
      label: "Air disponible avant la réserve",
      formula: "V_{dispo} = V_{bloc} \\times (P_{gonflage} - P_{reserve})",
      detail:
        `${fr(tankVolumeLiters)} L × (${fr(pressureBar)} − ${fr(reserveBar)}) bar = ` +
        `${fr(availableAirLiters)} L d'air utilisable (détendus à la pression atmosphérique).`,
    },
    {
      label: "Pression absolue à la profondeur d'évolution",
      formula: "P_{abs} = \\frac{prof}{10} + 1",
      detail: `${fr(depthMeters)} / 10 + 1 = ${fr(absolutePressureBar)} bar.`,
    },
    {
      label: "Consommation au fond",
      formula: "C_{fond} = C_{surface} \\times P_{abs}",
      detail:
        `${fr(surfaceConsumption)} L/min × ${fr(absolutePressureBar)} = ` +
        `${fr(consumptionAtDepth)} L/min à ${fr(depthMeters)} m.`,
    },
    {
      label: "Autonomie",
      formula: "t = \\frac{V_{dispo}}{C_{fond}}",
      detail:
        `${fr(availableAirLiters)} / ${fr(consumptionAtDepth)} = ${fr(rawAutonomy)} min, ` +
        `arrondi à la minute inférieure : ${autonomyMinutes} min.`,
    },
  ];

  return {
    availableAirLiters,
    absolutePressureBar,
    consumptionAtDepth,
    autonomyMinutes,
    steps,
  };
}
