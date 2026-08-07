/**
 * Point d'entrée unique des schémas pédagogiques.
 *
 * Les exports de ce fichier (plus `Figure`) définissent exactement les
 * balises de schéma utilisables dans les cours MDX — le mapping de
 * `components/mdx/mdx-content.tsx` est construit dessus. Un schéma absent
 * d'ici n'existe pas pour le contenu.
 */

export { Figure } from "./figure";

export * from "./physique";
export * from "./physiologie";
export * from "./tables";
export * from "./reglementation";
export * from "./materiel";
export * from "./pedagogie";
