/**
 * Générateur pseudo-aléatoire déterministe (mulberry32) et helpers de tirage.
 *
 * Utilisé par les générateurs d'exercices : une même graine produit toujours
 * la même séquence de nombres, donc le même énoncé et le même corrigé.
 */

/**
 * Crée un générateur pseudo-aléatoire mulberry32.
 *
 * @param seed graine entière (tout nombre ; réduit à un entier 32 bits non signé).
 * @returns fonction retournant à chaque appel un flottant dans [0 ; 1).
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Tire un entier uniforme dans [min ; max] (bornes incluses).
 *
 * @throws {Error} si min > max ou si les bornes ne sont pas des entiers finis.
 */
export function randInt(rng: () => number, min: number, max: number): number {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error(`Bornes invalides : [${min} ; ${max}]. Des entiers sont attendus.`);
  }
  if (min > max) {
    throw new Error(`Bornes invalides : min (${min}) est supérieur à max (${max}).`);
  }
  return min + Math.floor(rng() * (max - min + 1));
}

/**
 * Tire un élément uniforme dans un tableau non vide.
 *
 * @throws {Error} si le tableau est vide.
 */
export function pick<T>(rng: () => number, values: readonly T[]): T {
  if (values.length === 0) {
    throw new Error("Impossible de tirer un élément dans un tableau vide.");
  }
  return values[Math.floor(rng() * values.length)];
}
