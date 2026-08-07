/**
 * Palette sémantique unique des schémas pédagogiques.
 *
 * Chaque entrée pointe vers une variable CSS `--schema-…` (définie dans
 * `schema-theme.css`, importé par `components/schemas/figure.tsx`) avec un
 * repli hexadécimal proche du thème clair. Les valeurs clair/sombre sont
 * gérées par le CSS : ne JAMAIS mettre de couleur en dur dans un schéma,
 * toujours passer par `SCHEMA_COLORS` (ou `currentColor` pour le texte).
 */
export const SCHEMA_COLORS = {
  /** Eau, milieu ambiant, courbes de profondeur (bleu). */
  eau: "var(--schema-eau, #33689e)",
  /** Pression, valeurs barométriques (bleu profond). */
  pression: "var(--schema-pression, #2c5490)",
  /** Danger, interdits, accidents (rouge). */
  danger: "var(--schema-danger, #c23c2e)",
  /** Sécurité, procédures correctes, paliers effectués (vert). */
  securite: "var(--schema-securite, #2e7d4f)",
  /** Vigilance, points d'attention, limites à surveiller (orange). */
  vigilance: "var(--schema-vigilance, #a05a12)",
  /** Éléments neutres : axes, connecteurs, structure (gris). */
  neutre: "var(--schema-neutre, #64707e)",
  /** Air respiré, bulles, volumes gazeux (cyan). */
  air: "var(--schema-air, #2f7f9e)",
  /** Azote, saturation des tissus (violet). */
  azote: "var(--schema-azote, #7b4bab)",
  /** Oxygène, toxicité O2, Nitrox (turquoise). */
  oxygene: "var(--schema-oxygene, #197a6b)",
  /** Tissus, compartiments physiologiques (brun doux). */
  tissu: "var(--schema-tissu, #8a6552)",
} as const satisfies Record<string, `var(--schema-${string}, #${string})`>;

/** Nom d'une couleur sémantique de la palette des schémas. */
export type SchemaColor = keyof typeof SCHEMA_COLORS;

/** Liste ordonnée des noms de couleurs (utile pour les légendes ou les démos). */
export const SCHEMA_COLOR_NAMES = Object.keys(SCHEMA_COLORS) as SchemaColor[];

/**
 * Retourne la valeur CSS (`var(--schema-…, repli)`) d'une couleur sémantique.
 * Helper typé à préférer à l'accès direct quand le nom vient d'une prop.
 */
export function schemaColor(nom: SchemaColor): string {
  return SCHEMA_COLORS[nom];
}

/** Garde de type : `true` si la chaîne est un nom de couleur de la palette. */
export function isSchemaColor(valeur: string): valeur is SchemaColor {
  return valeur in SCHEMA_COLORS;
}
