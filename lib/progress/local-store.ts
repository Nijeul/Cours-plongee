import { LEVEL_SLUGS } from "@/lib/types";
import type {
  Bookmark,
  ExamSession,
  LevelSlug,
  Note,
  ProgressSnapshot,
  ProgressStore,
  QuizAttempt,
  SrsCard,
  UserModuleProgress,
} from "@/lib/types";

/** Clé localStorage unique, versionnée pour permettre des migrations futures. */
const STORAGE_KEY = "plongee.progress.v1";

function emptySnapshot(): ProgressSnapshot {
  return {
    targetLevel: null,
    modules: [],
    attempts: [],
    srsCards: [],
    examSessions: [],
    bookmarks: [],
    notes: [],
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readSnapshot(): ProgressSnapshot {
  if (!isBrowser()) return emptySnapshot();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySnapshot();
    const parsed = JSON.parse(raw) as Partial<ProgressSnapshot> | null;
    if (!parsed || typeof parsed !== "object") return emptySnapshot();
    // Fusion défensive : chaque champ manquant ou invalide retombe sur la valeur vide.
    const base = emptySnapshot();
    return {
      targetLevel:
        typeof parsed.targetLevel === "string" &&
        (LEVEL_SLUGS as readonly string[]).includes(parsed.targetLevel)
          ? parsed.targetLevel
          : base.targetLevel,
      modules: Array.isArray(parsed.modules) ? parsed.modules : base.modules,
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts : base.attempts,
      srsCards: Array.isArray(parsed.srsCards) ? parsed.srsCards : base.srsCards,
      examSessions: Array.isArray(parsed.examSessions) ? parsed.examSessions : base.examSessions,
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : base.bookmarks,
      notes: Array.isArray(parsed.notes) ? parsed.notes : base.notes,
    };
  } catch {
    return emptySnapshot();
  }
}

function writeSnapshot(snapshot: ProgressSnapshot): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Quota dépassé ou stockage indisponible (navigation privée) : on ignore
    // silencieusement, la progression reste en mémoire pour la session en cours.
  }
}

function mutate(fn: (snapshot: ProgressSnapshot) => void): void {
  const snapshot = readSnapshot();
  fn(snapshot);
  writeSnapshot(snapshot);
}

/**
 * Store de progression « mode invité » : tout est stocké dans le navigateur
 * (localStorage), aucune donnée ne quitte l'appareil. SSR-safe : sans `window`,
 * lit un snapshot vide et ignore les écritures.
 */
export class LocalProgressStore implements ProgressStore {
  async getSnapshot(): Promise<ProgressSnapshot> {
    return readSnapshot();
  }

  async setTargetLevel(level: LevelSlug): Promise<void> {
    mutate((s) => {
      s.targetLevel = level;
    });
  }

  async upsertModuleProgress(p: UserModuleProgress): Promise<void> {
    mutate((s) => {
      const index = s.modules.findIndex((m) => m.moduleSlug === p.moduleSlug);
      if (index >= 0) s.modules[index] = p;
      else s.modules.push(p);
    });
  }

  async saveAttempt(a: QuizAttempt): Promise<void> {
    mutate((s) => {
      const index = s.attempts.findIndex((x) => x.id === a.id);
      if (index >= 0) s.attempts[index] = a;
      else s.attempts.push(a);
    });
  }

  async upsertSrsCard(c: SrsCard): Promise<void> {
    mutate((s) => {
      // Unicité par question (une carte de révision par question).
      const index = s.srsCards.findIndex((x) => x.questionId === c.questionId);
      if (index >= 0) s.srsCards[index] = c;
      else s.srsCards.push(c);
    });
  }

  async saveExamSession(session: ExamSession): Promise<void> {
    mutate((s) => {
      const index = s.examSessions.findIndex((x) => x.id === session.id);
      if (index >= 0) s.examSessions[index] = session;
      else s.examSessions.push(session);
    });
  }

  async addBookmark(b: Bookmark): Promise<void> {
    mutate((s) => {
      // Unicité par (module, ancre), comme la contrainte SQL côté Supabase.
      const index = s.bookmarks.findIndex(
        (x) => x.moduleSlug === b.moduleSlug && x.anchor === b.anchor
      );
      if (index >= 0) s.bookmarks[index] = b;
      else s.bookmarks.push(b);
    });
  }

  async removeBookmark(id: string): Promise<void> {
    mutate((s) => {
      s.bookmarks = s.bookmarks.filter((x) => x.id !== id);
    });
  }

  async upsertNote(n: Note): Promise<void> {
    mutate((s) => {
      // Unicité par (module, ancre), comme la contrainte SQL côté Supabase.
      const index = s.notes.findIndex(
        (x) => x.moduleSlug === n.moduleSlug && x.anchor === n.anchor
      );
      if (index >= 0) s.notes[index] = n;
      else s.notes.push(n);
    });
  }

  async removeNote(id: string): Promise<void> {
    mutate((s) => {
      s.notes = s.notes.filter((x) => x.id !== id);
    });
  }
}
