/**
 * CONTRATS D'INTERFACE — figés en phase 1.
 * Aucun agent ne modifie ce fichier. Toute évolution passe par l'orchestrateur.
 */

// ---------------------------------------------------------------------------
// Niveaux et domaines
// ---------------------------------------------------------------------------

export const LEVEL_SLUGS = ["n1", "n2", "n3", "n4", "mf1"] as const;
export type LevelSlug = (typeof LEVEL_SLUGS)[number];

export const DOMAIN_SLUGS = [
  "physique",
  "physiologie",
  "tables-deco",
  "reglementation",
  "materiel",
  "environnement",
  "pedagogie",
] as const;
export type DomainSlug = (typeof DOMAIN_SLUGS)[number];

export interface LevelInfo {
  slug: LevelSlug;
  title: string;
  subtitle: string;
  description: string;
  order: number;
}

export interface DomainInfo {
  slug: DomainSlug;
  title: string;
  shortTitle: string;
}

// ---------------------------------------------------------------------------
// Catalogue de contenu (figé dans lib/catalog.ts)
// ---------------------------------------------------------------------------

export interface CatalogModule {
  /** Slug unique global, préfixé par le niveau, ex. "n2-tables-mn90". Nom du fichier MDX : `content/<level>/<slug>.mdx`. */
  slug: string;
  level: LevelSlug;
  domain: DomainSlug;
  title: string;
  /** Résumé d'une phrase affiché dans les listes. */
  description: string;
  /** Ordre d'affichage dans le parcours du niveau (1..n). */
  order: number;
  /** Durée estimée en minutes. */
  durationMinutes: number;
  /** Slugs des modules prérequis (du même niveau ou d'un niveau inférieur). */
  prerequisites: string[];
}

// ---------------------------------------------------------------------------
// Contenu MDX
// ---------------------------------------------------------------------------

/** Frontmatter attendu dans chaque fichier MDX. `slug`, `level`, `domain`… doivent correspondre au catalogue. */
export interface ModuleFrontmatter {
  slug: string;
  title: string;
  level: LevelSlug;
  domain: DomainSlug;
  description: string;
  /** 3 à 6 objectifs pédagogiques mesurables. */
  objectives: string[];
  durationMinutes: number;
  /** Sources citées en bas de page. */
  sources: string[];
}

export interface SectionRef {
  /** Ancre HTML générée par rehype-slug (github-slugger) à partir du titre h2. */
  anchor: string;
  title: string;
  order: number;
}

export interface ModuleContent {
  meta: ModuleFrontmatter;
  catalog: CatalogModule;
  /** Source MDX brute (compilée par la page via next-mdx-remote). */
  source: string;
  /** Sections (titres h2) extraites pour la navigation et le suivi de lecture. */
  sections: SectionRef[];
}

// ---------------------------------------------------------------------------
// Questions et quiz
// ---------------------------------------------------------------------------

export type QuestionType = "qcm" | "calcul" | "vrai-faux";

export interface QuestionOption {
  id: string; // "a", "b", "c", "d"
  text: string;
}

export interface Question {
  /** Id unique global, ex. "n2-tables-012". */
  id: string;
  type: QuestionType;
  level: LevelSlug;
  domain: DomainSlug;
  /** Module de rattachement (slug du catalogue). */
  moduleSlug: string;
  /** Ancre de la section de cours qui explique la notion (lien de correction). */
  sectionAnchor: string;
  /** Énoncé (Markdown, formules KaTeX entre $...$). */
  prompt: string;
  options: QuestionOption[];
  /** Ids des bonnes réponses (1..n — QCM à réponses multiples autorisé). */
  correctOptionIds: string[];
  /** Correction argumentée obligatoire : explication complète, formule appliquée le cas échéant. */
  explanation: string;
  /** 1 (facile) à 3 (difficile). */
  difficulty: 1 | 2 | 3;
}

export interface QuestionBank {
  level: LevelSlug;
  questions: Question[];
}

/** Réponse de l'utilisateur à une question dans une tentative. */
export interface QuizAnswer {
  questionId: string;
  selectedOptionIds: string[];
  correct: boolean;
  /** Temps passé en secondes (0 si non mesuré). */
  timeSeconds: number;
}

export type QuizKind = "entrainement" | "validation" | "examen" | "revision";

export interface QuizAttempt {
  id: string;
  kind: QuizKind;
  level: LevelSlug;
  /** Module concerné (absent pour un examen blanc multi-modules). */
  moduleSlug: string | null;
  score: number;
  maxScore: number;
  /** ISO 8601. */
  startedAt: string;
  finishedAt: string | null;
  answers: QuizAnswer[];
}

// ---------------------------------------------------------------------------
// Exercices paramétriques (générateurs codés dans lib/calc/generators.ts)
// ---------------------------------------------------------------------------

export interface ExerciseStep {
  label: string;
  /** Formule KaTeX (sans les $). */
  formula?: string;
  detail: string;
}

export interface GeneratedExercise {
  generatorId: string;
  title: string;
  /** Énoncé complet (Markdown + KaTeX). */
  statement: string;
  /** Corrigé pas à pas. */
  steps: ExerciseStep[];
  /** Réponse numérique attendue. */
  answer: number;
  unit: string;
  /** Tolérance relative acceptée (ex. 0.02 = ±2 %). */
  tolerance: number;
}

export interface ExerciseGenerator {
  id: string;
  title: string;
  level: LevelSlug;
  domain: DomainSlug;
  moduleSlug: string;
  /** Génère un exercice depuis une graine entière (déterministe : même graine → même énoncé). */
  generate(seed: number): GeneratedExercise;
}

// ---------------------------------------------------------------------------
// Progression utilisateur
// ---------------------------------------------------------------------------

export type ModuleStatus = "not_started" | "in_progress" | "completed";

export interface UserModuleProgress {
  moduleSlug: string;
  status: ModuleStatus;
  /** 0..100 — % de sections lues (validation du module non comprise). */
  percent: number;
  /** Ancre de la dernière section lue (reprise de lecture). */
  lastAnchor: string | null;
  /** Meilleur score (0..100) obtenu au test de validation, null si jamais tenté. */
  bestValidationScore: number | null;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  moduleSlug: string;
  anchor: string;
  title: string;
  createdAt: string;
}

export interface Note {
  id: string;
  moduleSlug: string;
  anchor: string;
  content: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Révision espacée — SM-2 simplifié (intervalles J+1, J+3, J+7, J+16, J+35)
// ---------------------------------------------------------------------------

export interface SrsCard {
  id: string;
  /** Id de la question source. */
  questionId: string;
  level: LevelSlug;
  domain: DomainSlug;
  moduleSlug: string;
  /** Facteur de facilité SM-2 (>= 1.3, initial 2.5). */
  easiness: number;
  /** Intervalle courant en jours. */
  intervalDays: number;
  /** Nombre de répétitions réussies consécutives. */
  repetitions: number;
  /** Nombre total d'échecs. */
  lapses: number;
  /** Date d'échéance ISO (date seule, ex. "2026-08-06"). */
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

/** Qualité de réponse SM-2 simplifiée : 0 = échec, 1 = difficile, 2 = correct, 3 = facile. */
export type SrsQuality = 0 | 1 | 2 | 3;

// ---------------------------------------------------------------------------
// Examens blancs
// ---------------------------------------------------------------------------

export interface ExamConfig {
  level: LevelSlug;
  title: string;
  /** Nombre de questions tirées. */
  questionCount: number;
  /** Durée en minutes. */
  durationMinutes: number;
  /** Seuil de réussite en % (0..100). */
  passThreshold: number;
  /** Domaines couverts avec leur poids relatif (somme libre, normalisée au tirage). */
  domainWeights: Partial<Record<DomainSlug, number>>;
  /** Note explicative (barème réel, épreuves). */
  note: string;
}

export interface ExamDomainResult {
  domain: DomainSlug;
  score: number;
  maxScore: number;
}

export interface ExamSession {
  id: string;
  level: LevelSlug;
  startedAt: string;
  finishedAt: string | null;
  durationMinutes: number;
  score: number;
  maxScore: number;
  passed: boolean;
  byDomain: ExamDomainResult[];
  answers: QuizAnswer[];
}

// ---------------------------------------------------------------------------
// Store de progression (implémentations : Supabase + localStorage)
// ---------------------------------------------------------------------------

export interface ProgressSnapshot {
  targetLevel: LevelSlug | null;
  modules: UserModuleProgress[];
  attempts: QuizAttempt[];
  srsCards: SrsCard[];
  examSessions: ExamSession[];
  bookmarks: Bookmark[];
  notes: Note[];
}

/**
 * Contrat unique de persistance. Implémentations dans lib/progress/ :
 *  - SupabaseProgressStore (utilisateur connecté)
 *  - LocalProgressStore (mode invité, localStorage)
 * Toutes les méthodes sont asynchrones et idempotentes.
 */
export interface ProgressStore {
  getSnapshot(): Promise<ProgressSnapshot>;
  setTargetLevel(level: LevelSlug): Promise<void>;
  upsertModuleProgress(p: UserModuleProgress): Promise<void>;
  saveAttempt(a: QuizAttempt): Promise<void>;
  upsertSrsCard(c: SrsCard): Promise<void>;
  saveExamSession(s: ExamSession): Promise<void>;
  addBookmark(b: Bookmark): Promise<void>;
  removeBookmark(id: string): Promise<void>;
  upsertNote(n: Note): Promise<void>;
  removeNote(id: string): Promise<void>;
}

// ---------------------------------------------------------------------------
// Moteur de calcul — contrats (implémentations dans lib/calc/)
// ---------------------------------------------------------------------------

/** Erreur levée quand les données MN90 ne couvrent pas le cas demandé. Message explicite, jamais de valeur inventée. */
export class Mn90DataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Mn90DataError";
  }
}

export interface Mn90Stop {
  /** Profondeur du palier en mètres (3, 6, 9…). */
  depth: number;
  /** Durée du palier en minutes. */
  minutes: number;
}

export interface Mn90SimpleResult {
  /** Profondeur de la table utilisée (arrondi supérieur). */
  tableDepth: number;
  /** Durée de la table utilisée (arrondi supérieur). */
  tableDuration: number;
  stops: Mn90Stop[];
  /** Groupe de plongée successive (lettre A..P) ou null si hors table. */
  gps: string | null;
  /** Durée totale de remontée en minutes (remontée + paliers + inter-paliers). */
  dtrMinutes: number;
}

export interface Mn90SuccessiveInput {
  /** GPS de la première plongée. */
  gps: string;
  /** Intervalle de surface en minutes. */
  surfaceIntervalMinutes: number;
  /** Profondeur prévue de la seconde plongée en mètres. */
  secondDiveDepth: number;
}

export interface Mn90SuccessiveResult {
  /** Azote résiduel lu dans le tableau II. */
  residualNitrogen: number;
  /** Majoration en minutes lue dans le tableau III. */
  majorationMinutes: number;
}

export interface AutonomyInput {
  /** Volume du bloc en litres (ex. 12, 15). */
  tankVolumeLiters: number;
  /** Pression de gonflage en bars. */
  pressureBar: number;
  /** Pression de réserve en bars (ex. 50). */
  reserveBar: number;
  /** Consommation en surface en L/min (ex. 20). */
  surfaceConsumption: number;
  /** Profondeur d'évolution en mètres. */
  depthMeters: number;
}

export interface AutonomyResult {
  availableAirLiters: number;
  absolutePressureBar: number;
  consumptionAtDepth: number;
  autonomyMinutes: number;
  steps: ExerciseStep[];
}
