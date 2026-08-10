"use client";

import * as React from "react";
import { Bookmark, StickyNote } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { uuid } from "@/lib/ids";
import { useProgressStore } from "@/lib/progress";
import type { Bookmark as BookmarkType, Note, SectionRef } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SectionToolsProps {
  moduleSlug: string;
  sections: SectionRef[];
}

/**
 * Sommaire interactif d&apos;un module de cours : liens d&apos;ancre vers chaque
 * section, avec marque-page et note personnelle par section (persistés via le
 * store de progression). Monté une seule fois par page cours.
 */
export function SectionTools({ moduleSlug, sections }: SectionToolsProps) {
  const { store, loading } = useProgressStore();
  const [bookmarks, setBookmarks] = React.useState<BookmarkType[]>([]);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [editing, setEditing] = React.useState<SectionRef | null>(null);
  const [draft, setDraft] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (loading) return;
    let cancelled = false;
    store
      .getSnapshot()
      .then((snapshot) => {
        if (cancelled) return;
        setBookmarks(snapshot.bookmarks.filter((b) => b.moduleSlug === moduleSlug));
        setNotes(snapshot.notes.filter((n) => n.moduleSlug === moduleSlug));
      })
      .catch(() => {
        // Store indisponible : les outils restent utilisables en local d'écran.
      });
    return () => {
      cancelled = true;
    };
  }, [store, loading, moduleSlug]);

  const toggleBookmark = async (section: SectionRef) => {
    const existing = bookmarks.find((b) => b.anchor === section.anchor);
    try {
      if (existing) {
        setBookmarks((prev) => prev.filter((b) => b.id !== existing.id));
        await store.removeBookmark(existing.id);
        toast("Marque-page retiré");
      } else {
        const bookmark: BookmarkType = {
          id: uuid(),
          moduleSlug,
          anchor: section.anchor,
          title: section.title,
          createdAt: new Date().toISOString(),
        };
        setBookmarks((prev) => [...prev, bookmark]);
        await store.addBookmark(bookmark);
        toast("Marque-page ajouté");
      }
    } catch {
      toast.error("Impossible d'enregistrer le marque-page.");
    }
  };

  const openNote = (section: SectionRef) => {
    const existing = notes.find((n) => n.anchor === section.anchor);
    setDraft(existing?.content ?? "");
    setEditing(section);
  };

  const saveNote = async () => {
    if (!editing) return;
    const existing = notes.find((n) => n.anchor === editing.anchor);
    const content = draft.trim();
    setSaving(true);
    try {
      if (!content) {
        if (existing) {
          setNotes((prev) => prev.filter((n) => n.id !== existing.id));
          await store.removeNote(existing.id);
          toast("Note supprimée");
        }
      } else {
        const note: Note = {
          id: existing?.id ?? uuid(),
          moduleSlug,
          anchor: editing.anchor,
          content,
          updatedAt: new Date().toISOString(),
        };
        setNotes((prev) => [...prev.filter((n) => n.id !== note.id), note]);
        await store.upsertNote(note);
        toast("Note enregistrée");
      }
      setEditing(null);
    } catch {
      toast.error("Impossible d'enregistrer la note.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ol className="space-y-0.5">
        {sections.map((section) => {
          const bookmarked = bookmarks.some((b) => b.anchor === section.anchor);
          const hasNote = notes.some((n) => n.anchor === section.anchor);
          return (
            <li key={section.anchor} className="flex min-w-0 items-center gap-0.5">
              <a
                href={`#${section.anchor}`}
                className="hover:text-primary min-w-0 flex-1 truncate py-1.5 text-sm transition-colors"
              >
                <span className="text-muted-foreground mr-2 tabular-nums">
                  {section.order}.
                </span>
                {section.title}
              </a>
              <button
                type="button"
                onClick={() => toggleBookmark(section)}
                disabled={loading}
                aria-pressed={bookmarked}
                aria-label={
                  bookmarked
                    ? `Retirer le marque-page de la section « ${section.title} »`
                    : `Ajouter un marque-page sur la section « ${section.title} »`
                }
                className={cn(
                  "hover:bg-accent shrink-0 rounded-md p-1.5 transition-colors disabled:opacity-40",
                  bookmarked ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Bookmark
                  aria-hidden="true"
                  className={cn("size-3.5", bookmarked && "fill-current")}
                />
              </button>
              <button
                type="button"
                onClick={() => openNote(section)}
                disabled={loading}
                aria-label={
                  hasNote
                    ? `Modifier la note de la section « ${section.title} »`
                    : `Ajouter une note sur la section « ${section.title} »`
                }
                className={cn(
                  "hover:bg-accent shrink-0 rounded-md p-1.5 transition-colors disabled:opacity-40",
                  hasNote ? "text-primary" : "text-muted-foreground"
                )}
              >
                <StickyNote
                  aria-hidden="true"
                  className={cn("size-3.5", hasNote && "fill-current")}
                />
              </button>
            </li>
          );
        })}
      </ol>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Note personnelle</DialogTitle>
            <DialogDescription>
              {editing ? `Section « ${editing.title} »` : ""}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Votre note : point à revoir, moyen mnémotechnique, question à poser…"
            rows={5}
            maxLength={5000}
            autoFocus
          />
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Annuler
            </Button>
            <Button type="button" onClick={saveNote} disabled={saving}>
              {saving ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
