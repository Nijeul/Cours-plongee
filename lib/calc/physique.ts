/**
 * Lois physiques appliquées à la plongée — fonctions pures de référence.
 *
 * Conventions d'enseignement FFESSM :
 * - 10 m d'eau = 1 bar de pression relative (eau de mer comme eau douce,
 *   simplification pédagogique usuelle) ;
 * - pression atmosphérique au niveau de la mer = 1 bar ;
 * - air : 21 % d'O₂, 79 % de N₂ (fractions 0,21 / 0,79) ;
 * - densité de l'eau douce 1,00 ; de l'eau de mer 1,03 ;
 * - g = 9,81 m/s² pour la conversion kg-force → newtons.
 */

/** Densité de l'eau douce (kg/L). */
export const WATER_DENSITY_FRESH = 1.0;
/** Densité de l'eau de mer (kg/L) — convention d'enseignement. */
export const WATER_DENSITY_SEA = 1.03;
/** Accélération de la pesanteur (m/s²). */
export const GRAVITY_MS2 = 9.81;
/** Fraction d'oxygène dans l'air. */
export const AIR_O2_FRACTION = 0.21;
/** Fraction d'azote dans l'air. */
export const AIR_N2_FRACTION = 0.79;

/**
 * Pression absolue à une profondeur donnée (bar).
 *
 * P_abs = profondeur / 10 + 1 (1 bar de pression relative tous les 10 m,
 * plus 1 bar de pression atmosphérique).
 *
 * @param depthMeters profondeur en mètres (≥ 0).
 * @throws {Error} si la profondeur est négative ou non finie.
 */
export function absolutePressure(depthMeters: number): number {
  if (!Number.isFinite(depthMeters) || depthMeters < 0) {
    throw new Error(
      `Profondeur invalide : ${depthMeters} m. La profondeur doit être positive ou nulle.`,
    );
  }
  return depthMeters / 10 + 1;
}

/**
 * Loi de Boyle-Mariotte : à température constante, P × V = constante.
 *
 * Retourne le volume V₂ occupé par un gaz passant de la pression P₁
 * (volume V₁) à la pression P₂ : V₂ = V₁ × P₁ / P₂.
 *
 * @param v1 volume initial (L, > 0).
 * @param p1 pression initiale (bar, > 0).
 * @param p2 pression finale (bar, > 0).
 * @throws {Error} si un paramètre est négatif, nul ou non fini.
 */
export function boyleMariotteVolume(v1: number, p1: number, p2: number): number {
  if (!Number.isFinite(v1) || v1 <= 0) {
    throw new Error(`Volume initial invalide : ${v1} L. Le volume doit être strictement positif.`);
  }
  if (!Number.isFinite(p1) || p1 <= 0) {
    throw new Error(`Pression initiale invalide : ${p1} bar. La pression doit être strictement positive.`);
  }
  if (!Number.isFinite(p2) || p2 <= 0) {
    throw new Error(`Pression finale invalide : ${p2} bar. La pression doit être strictement positive.`);
  }
  return (v1 * p1) / p2;
}

/**
 * Loi de Dalton : pression partielle d'un gaz dans un mélange.
 *
 * Pp = fraction du gaz × pression absolue.
 *
 * @param fraction fraction du gaz dans le mélange (0 < fraction ≤ 1, ex. 0,21 pour l'O₂ de l'air).
 * @param absolutePressureBar pression absolue du mélange (bar, > 0).
 * @throws {Error} si la fraction sort de ]0 ; 1] ou si la pression est invalide.
 */
export function daltonPartialPressure(fraction: number, absolutePressureBar: number): number {
  if (!Number.isFinite(fraction) || fraction <= 0 || fraction > 1) {
    throw new Error(
      `Fraction de gaz invalide : ${fraction}. La fraction doit être comprise entre 0 (exclu) et 1 (inclus).`,
    );
  }
  if (!Number.isFinite(absolutePressureBar) || absolutePressureBar <= 0) {
    throw new Error(
      `Pression absolue invalide : ${absolutePressureBar} bar. La pression doit être strictement positive.`,
    );
  }
  return fraction * absolutePressureBar;
}

/**
 * Profondeur maximale pour ne pas dépasser une pression partielle cible
 * (application nitrox / toxicité de l'O₂).
 *
 * P_abs max = Pp cible / fraction, puis profondeur = (P_abs max − 1) × 10.
 * La valeur retournée n'est pas arrondie (à l'appelant d'arrondir, en
 * pratique vers le bas par sécurité).
 *
 * @param fraction fraction du gaz dans le mélange (0 < fraction ≤ 1).
 * @param targetPp pression partielle cible (bar, > 0, ex. 1,6 pour la PpO₂ maximale).
 * @throws {Error} si la pression partielle cible est déjà dépassée en surface
 *   (targetPp / fraction < 1) ou si un paramètre est invalide.
 */
export function depthForPartialPressure(fraction: number, targetPp: number): number {
  if (!Number.isFinite(fraction) || fraction <= 0 || fraction > 1) {
    throw new Error(
      `Fraction de gaz invalide : ${fraction}. La fraction doit être comprise entre 0 (exclu) et 1 (inclus).`,
    );
  }
  if (!Number.isFinite(targetPp) || targetPp <= 0) {
    throw new Error(
      `Pression partielle cible invalide : ${targetPp} bar. La valeur doit être strictement positive.`,
    );
  }
  const maxAbsolutePressure = targetPp / fraction;
  if (maxAbsolutePressure < 1) {
    throw new Error(
      `Pression partielle cible (${targetPp} bar) déjà dépassée en surface avec une fraction de ${fraction} : ` +
        `ce mélange n'est pas respirable dans ces conditions.`,
    );
  }
  return (maxAbsolutePressure - 1) * 10;
}

export interface ArchimedeInput {
  /** Masse réelle de l'objet ou du plongeur équipé (kg). */
  massKg: number;
  /** Volume immergé (litres). */
  volumeLiters: number;
  /** Densité de l'eau (1,00 eau douce, 1,03 eau de mer). */
  waterDensity: number;
}

export interface ArchimedeResult {
  /** Poussée d'Archimède en kg-force (poids du volume d'eau déplacé). */
  buoyancyKgf: number;
  /** Poids apparent en kg-force (positif : l'objet coule ; négatif : il flotte). */
  apparentWeightKgf: number;
  /** Poids apparent en newtons. */
  apparentWeightNewtons: number;
}

/**
 * Poussée d'Archimède et poids apparent.
 *
 * Tout corps plongé dans un fluide reçoit une poussée verticale, dirigée de
 * bas en haut, égale au poids du volume de fluide déplacé :
 * - poussée (kgf) = volume (L) × densité de l'eau ;
 * - poids apparent (kgf) = masse réelle − poussée ;
 * - poids apparent (N) = poids apparent (kgf) × 9,81.
 *
 * Un poids apparent positif signifie que le corps coule, négatif qu'il
 * flotte, nul qu'il est équilibré.
 *
 * @throws {Error} si la masse, le volume ou la densité sont négatifs, nuls
 *   (densité/volume) ou non finis.
 */
export function archimedeApparentWeight(input: ArchimedeInput): ArchimedeResult {
  const { massKg, volumeLiters, waterDensity } = input;

  if (!Number.isFinite(massKg) || massKg < 0) {
    throw new Error(`Masse invalide : ${massKg} kg. La masse doit être positive ou nulle.`);
  }
  if (!Number.isFinite(volumeLiters) || volumeLiters <= 0) {
    throw new Error(`Volume invalide : ${volumeLiters} L. Le volume doit être strictement positif.`);
  }
  if (!Number.isFinite(waterDensity) || waterDensity <= 0) {
    throw new Error(
      `Densité d'eau invalide : ${waterDensity}. Utilisez 1,00 (eau douce) ou 1,03 (eau de mer).`,
    );
  }

  const buoyancyKgf = volumeLiters * waterDensity;
  const apparentWeightKgf = massKg - buoyancyKgf;
  const apparentWeightNewtons = apparentWeightKgf * GRAVITY_MS2;

  return { buoyancyKgf, apparentWeightKgf, apparentWeightNewtons };
}

/**
 * Consommation à une profondeur donnée (L/min).
 *
 * C_fond = C_surface × P_abs.
 *
 * @param surfaceConsumptionLpm consommation en surface (L/min, > 0).
 * @param depthMeters profondeur (m, ≥ 0).
 * @throws {Error} si un paramètre est invalide.
 */
export function consumptionAtDepth(surfaceConsumptionLpm: number, depthMeters: number): number {
  if (!Number.isFinite(surfaceConsumptionLpm) || surfaceConsumptionLpm <= 0) {
    throw new Error(
      `Consommation en surface invalide : ${surfaceConsumptionLpm} L/min. Elle doit être strictement positive.`,
    );
  }
  return surfaceConsumptionLpm * absolutePressure(depthMeters);
}

/**
 * Consommation ramenée en surface (L/min) — utile pour caractériser un
 * plongeur à partir d'une consommation mesurée au fond.
 *
 * C_surface = C_fond / P_abs.
 *
 * @param depthConsumptionLpm consommation mesurée à la profondeur (L/min, > 0).
 * @param depthMeters profondeur de la mesure (m, ≥ 0).
 * @throws {Error} si un paramètre est invalide.
 */
export function surfaceEquivalentConsumption(
  depthConsumptionLpm: number,
  depthMeters: number,
): number {
  if (!Number.isFinite(depthConsumptionLpm) || depthConsumptionLpm <= 0) {
    throw new Error(
      `Consommation au fond invalide : ${depthConsumptionLpm} L/min. Elle doit être strictement positive.`,
    );
  }
  return depthConsumptionLpm / absolutePressure(depthMeters);
}
