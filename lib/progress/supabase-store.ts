import type { SupabaseClient } from "@supabase/supabase-js";

import { LEVEL_SLUGS } from "@/lib/types";
import type {
  Bookmark,
  DomainSlug,
  ExamDomainResult,
  ExamSession,
  LevelSlug,
  ModuleStatus,
  Note,
  ProgressSnapshot,
  ProgressStore,
  QuizAnswer,
  QuizAttempt,
  QuizKind,
  SrsCard,
  UserModuleProgress,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Types des lignes SQL (snake_case, cf. supabase/migrations/20260805000001_schema.sql)
// ---------------------------------------------------------------------------

interface ProfileRow {
  target_level: string | null;
}

interface UserProgressRow {
  module_slug: string;
  status: string;
  percent: number;
  last_anchor: string | null;
  best_validation_score: number | null;
  updated_at: string;
}

interface QuizAttemptRow {
  id: string;
  kind: string;
  level_slug: string;
  module_slug: string | null;
  score: number;
  max_score: number;
  started_at: string;
  finished_at: string | null;
}

interface QuizAnswerRow {
  attempt_id: string;
  question_id: string;
  selected_option_ids: string[];
  is_correct: boolean;
  time_seconds: number;
}

interface SrsCardRow {
  id: string;
  question_id: string;
  level_slug: string;
  domain: string;
  module_slug: string;
  easiness: number;
  interval_days: number;
  repetitions: number;
  lapses: number;
  due_date: string;
  created_at: string;
  updated_at: string;
}

interface ExamSessionRow {
  id: string;
  level_slug: string;
  started_at: string;
  finished_at: string | null;
  duration_minutes: number;
  score: number;
  max_score: number;
  passed: boolean;
  by_domain: ExamDomainResult[];
  answers: QuizAnswer[];
}

interface BookmarkRow {
  id: string;
  module_slug: string;
  anchor: string;
  title: string;
  created_at: string;
}

interface NoteRow {
  id: string;
  module_slug: string;
  anchor: string;
  content: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Mappings snake_case (SQL) ↔ camelCase (types TS)
// ---------------------------------------------------------------------------

function asLevelSlug(value: string): LevelSlug {
  return (LEVEL_SLUGS as readonly string[]).includes(value) ? (value as LevelSlug) : "n1";
}

function mapModuleProgress(row: UserProgressRow): UserModuleProgress {
  return {
    moduleSlug: row.module_slug,
    status: row.status as ModuleStatus,
    percent: row.percent,
    lastAnchor: row.last_anchor,
    bestValidationScore: row.best_validation_score,
    updatedAt: row.updated_at,
  };
}

function mapAttempt(row: QuizAttemptRow, answers: QuizAnswer[]): QuizAttempt {
  return {
    id: row.id,
    kind: row.kind as QuizKind,
    level: asLevelSlug(row.level_slug),
    moduleSlug: row.module_slug,
    score: row.score,
    maxScore: row.max_score,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    answers,
  };
}

function mapAnswer(row: QuizAnswerRow): QuizAnswer {
  return {
    questionId: row.question_id,
    selectedOptionIds: row.selected_option_ids ?? [],
    correct: row.is_correct,
    timeSeconds: row.time_seconds,
  };
}

function mapSrsCard(row: SrsCardRow): SrsCard {
  return {
    id: row.id,
    questionId: row.question_id,
    level: asLevelSlug(row.level_slug),
    domain: row.domain as DomainSlug,
    moduleSlug: row.module_slug,
    easiness: row.easiness,
    intervalDays: row.interval_days,
    repetitions: row.repetitions,
    lapses: row.lapses,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapExamSession(row: ExamSessionRow): ExamSession {
  return {
    id: row.id,
    level: asLevelSlug(row.level_slug),
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    durationMinutes: row.duration_minutes,
    score: row.score,
    maxScore: row.max_score,
    passed: row.passed,
    byDomain: Array.isArray(row.by_domain) ? row.by_domain : [],
    answers: Array.isArray(row.answers) ? row.answers : [],
  };
}

function mapBookmark(row: BookmarkRow): Bookmark {
  return {
    id: row.id,
    moduleSlug: row.module_slug,
    anchor: row.anchor,
    title: row.title,
    createdAt: row.created_at,
  };
}

function mapNote(row: NoteRow): Note {
  return {
    id: row.id,
    moduleSlug: row.module_slug,
    anchor: row.anchor,
    content: row.content,
    updatedAt: row.updated_at,
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

/**
 * Store de progression adossé à Supabase (utilisateur connecté).
 * Chaque table est protégée par RLS : seules les lignes de l'utilisateur
 * courant sont lisibles/modifiables.
 *
 * NB : les identifiants clients (QuizAttempt.id, SrsCard.id, Bookmark.id,
 * Note.id, ExamSession.id) doivent être des UUID (crypto.randomUUID()).
 */
export class SupabaseProgressStore implements ProgressStore {
  constructor(
    private readonly supabase: SupabaseClient,
    private readonly userId: string
  ) {}

  async getSnapshot(): Promise<ProgressSnapshot> {
    const [profile, progress, attempts, answers, srsCards, examSessions, bookmarks, notes] =
      await Promise.all([
        this.supabase
          .from("profiles")
          .select("target_level")
          .eq("id", this.userId)
          .maybeSingle<ProfileRow>(),
        this.supabase
          .from("user_progress")
          .select("module_slug, status, percent, last_anchor, best_validation_score, updated_at")
          .eq("user_id", this.userId),
        this.supabase
          .from("quiz_attempts")
          .select("id, kind, level_slug, module_slug, score, max_score, started_at, finished_at")
          .eq("user_id", this.userId)
          .order("started_at", { ascending: false }),
        this.supabase
          .from("quiz_answers")
          .select("attempt_id, question_id, selected_option_ids, is_correct, time_seconds")
          .eq("user_id", this.userId)
          .order("id", { ascending: true }),
        this.supabase
          .from("srs_cards")
          .select(
            "id, question_id, level_slug, domain, module_slug, easiness, interval_days, repetitions, lapses, due_date, created_at, updated_at"
          )
          .eq("user_id", this.userId),
        this.supabase
          .from("exam_sessions")
          .select(
            "id, level_slug, started_at, finished_at, duration_minutes, score, max_score, passed, by_domain, answers"
          )
          .eq("user_id", this.userId)
          .order("started_at", { ascending: false }),
        this.supabase
          .from("bookmarks")
          .select("id, module_slug, anchor, title, created_at")
          .eq("user_id", this.userId)
          .order("created_at", { ascending: false }),
        this.supabase
          .from("notes")
          .select("id, module_slug, anchor, content, updated_at")
          .eq("user_id", this.userId)
          .order("updated_at", { ascending: false }),
      ]);

    const firstError =
      profile.error ??
      progress.error ??
      attempts.error ??
      answers.error ??
      srsCards.error ??
      examSessions.error ??
      bookmarks.error ??
      notes.error;
    if (firstError) {
      throw new Error(`Lecture de la progression impossible : ${firstError.message}`);
    }

    const answersByAttempt = new Map<string, QuizAnswer[]>();
    for (const row of (answers.data ?? []) as QuizAnswerRow[]) {
      const list = answersByAttempt.get(row.attempt_id) ?? [];
      list.push(mapAnswer(row));
      answersByAttempt.set(row.attempt_id, list);
    }

    const rawTarget = profile.data?.target_level ?? null;

    return {
      targetLevel:
        rawTarget && (LEVEL_SLUGS as readonly string[]).includes(rawTarget)
          ? (rawTarget as LevelSlug)
          : null,
      modules: ((progress.data ?? []) as UserProgressRow[]).map(mapModuleProgress),
      attempts: ((attempts.data ?? []) as QuizAttemptRow[]).map((row) =>
        mapAttempt(row, answersByAttempt.get(row.id) ?? [])
      ),
      srsCards: ((srsCards.data ?? []) as SrsCardRow[]).map(mapSrsCard),
      examSessions: ((examSessions.data ?? []) as ExamSessionRow[]).map(mapExamSession),
      bookmarks: ((bookmarks.data ?? []) as BookmarkRow[]).map(mapBookmark),
      notes: ((notes.data ?? []) as NoteRow[]).map(mapNote),
    };
  }

  async setTargetLevel(level: LevelSlug): Promise<void> {
    const { error } = await this.supabase
      .from("profiles")
      .upsert(
        { id: this.userId, target_level: level, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );
    if (error) throw new Error(`Enregistrement du niveau cible impossible : ${error.message}`);
  }

  async upsertModuleProgress(p: UserModuleProgress): Promise<void> {
    const { error } = await this.supabase.from("user_progress").upsert(
      {
        user_id: this.userId,
        module_slug: p.moduleSlug,
        status: p.status,
        percent: p.percent,
        last_anchor: p.lastAnchor,
        best_validation_score: p.bestValidationScore,
        updated_at: p.updatedAt,
      },
      { onConflict: "user_id,module_slug" }
    );
    if (error) throw new Error(`Enregistrement de la progression impossible : ${error.message}`);
  }

  async saveAttempt(a: QuizAttempt): Promise<void> {
    const { error } = await this.supabase.from("quiz_attempts").upsert(
      {
        id: a.id,
        user_id: this.userId,
        kind: a.kind,
        level_slug: a.level,
        module_slug: a.moduleSlug,
        score: a.score,
        max_score: a.maxScore,
        started_at: a.startedAt,
        finished_at: a.finishedAt,
      },
      { onConflict: "id" }
    );
    if (error) throw new Error(`Enregistrement du quiz impossible : ${error.message}`);

    // Idempotence : on remplace les réponses de la tentative.
    const { error: deleteError } = await this.supabase
      .from("quiz_answers")
      .delete()
      .eq("attempt_id", a.id)
      .eq("user_id", this.userId);
    if (deleteError) {
      throw new Error(`Enregistrement des réponses impossible : ${deleteError.message}`);
    }

    if (a.answers.length > 0) {
      const { error: insertError } = await this.supabase.from("quiz_answers").insert(
        a.answers.map((answer) => ({
          attempt_id: a.id,
          user_id: this.userId,
          question_id: answer.questionId,
          selected_option_ids: answer.selectedOptionIds,
          is_correct: answer.correct,
          time_seconds: answer.timeSeconds,
        }))
      );
      if (insertError) {
        throw new Error(`Enregistrement des réponses impossible : ${insertError.message}`);
      }
    }
  }

  async upsertSrsCard(c: SrsCard): Promise<void> {
    // Conflit sur (user_id, question_id) : une seule carte par question.
    const { error } = await this.supabase.from("srs_cards").upsert(
      {
        user_id: this.userId,
        question_id: c.questionId,
        level_slug: c.level,
        domain: c.domain,
        module_slug: c.moduleSlug,
        easiness: c.easiness,
        interval_days: c.intervalDays,
        repetitions: c.repetitions,
        lapses: c.lapses,
        due_date: c.dueDate,
        created_at: c.createdAt,
        updated_at: c.updatedAt,
      },
      { onConflict: "user_id,question_id" }
    );
    if (error) throw new Error(`Enregistrement de la carte de révision impossible : ${error.message}`);
  }

  async saveExamSession(s: ExamSession): Promise<void> {
    const { error } = await this.supabase.from("exam_sessions").upsert(
      {
        id: s.id,
        user_id: this.userId,
        level_slug: s.level,
        started_at: s.startedAt,
        finished_at: s.finishedAt,
        duration_minutes: s.durationMinutes,
        score: s.score,
        max_score: s.maxScore,
        passed: s.passed,
        by_domain: s.byDomain,
        answers: s.answers,
      },
      { onConflict: "id" }
    );
    if (error) throw new Error(`Enregistrement de l'examen blanc impossible : ${error.message}`);
  }

  async addBookmark(b: Bookmark): Promise<void> {
    // Conflit sur (user_id, module_slug, anchor) : un marque-page par ancre.
    const { error } = await this.supabase.from("bookmarks").upsert(
      {
        id: b.id,
        user_id: this.userId,
        module_slug: b.moduleSlug,
        anchor: b.anchor,
        title: b.title,
        created_at: b.createdAt,
      },
      { onConflict: "user_id,module_slug,anchor" }
    );
    if (error) throw new Error(`Ajout du marque-page impossible : ${error.message}`);
  }

  async removeBookmark(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", this.userId);
    if (error) throw new Error(`Suppression du marque-page impossible : ${error.message}`);
  }

  async upsertNote(n: Note): Promise<void> {
    // Conflit sur (user_id, module_slug, anchor) : une note par ancre.
    const { error } = await this.supabase.from("notes").upsert(
      {
        id: n.id,
        user_id: this.userId,
        module_slug: n.moduleSlug,
        anchor: n.anchor,
        content: n.content,
        updated_at: n.updatedAt,
      },
      { onConflict: "user_id,module_slug,anchor" }
    );
    if (error) throw new Error(`Enregistrement de la note impossible : ${error.message}`);
  }

  async removeNote(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", this.userId);
    if (error) throw new Error(`Suppression de la note impossible : ${error.message}`);
  }
}
