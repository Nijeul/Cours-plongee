-- ============================================================================
-- Durcissement (audit sécurité) : bornes serveur sur les champs libres.
-- La RLS empêche déjà tout accès croisé ; ces contraintes empêchent en plus
-- un client malveillant (ou un bug) de stocker des volumes arbitraires via
-- l'API Supabase, indépendamment des limites posées côté interface.
-- ============================================================================

alter table public.profiles
  add constraint profiles_display_name_len check (char_length(display_name) <= 80);

alter table public.notes
  add constraint notes_content_len check (char_length(content) <= 5000);

alter table public.bookmarks
  add constraint bookmarks_title_len check (char_length(title) <= 300);

-- Les instantanés d'examen (réponses + agrégats par domaine) restent petits :
-- quelques dizaines de Ko suffisent largement pour le plus gros format (MF1).
alter table public.exam_sessions
  add constraint exam_sessions_answers_size check (pg_column_size(answers) <= 262144),
  add constraint exam_sessions_by_domain_size check (pg_column_size(by_domain) <= 65536);
