# PLAN — Plateforme d'apprentissage de la théorie plongée (N1 → MF1)

> Document d'orchestration. Voir `docs/DECISIONS.md` pour les décisions techniques argumentées.

## Vue d'ensemble

- **Stack** : Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 · composants style shadcn/ui (écrits à la main, le registre ui.shadcn.com étant bloqué par la politique réseau) · Supabase (Auth + Postgres + RLS) · MDX via `next-mdx-remote` · KaTeX · Recharts · Vitest · PWA (manifest + service worker léger).
- **Contenu** : MDX versionné dans `content/`, un dossier par niveau. Catalogue de modules **figé** dans `lib/catalog.ts` (phase 1) — tous les agents s'y conforment.
- **Données utilisateur** : Supabase avec RLS ; **mode invité** en repli (localStorage) quand Supabase n'est pas configuré — l'app tourne en local sans aucune clé.

## Phases et agents

### Phase 1 — Contrats d'interface (orchestrateur, séquentiel)

Un seul auteur pour tout ce qui est figé. Fichiers produits :

| Fichier | Rôle |
|---|---|
| `docs/PLAN.md`, `docs/DECISIONS.md` | pilotage |
| `lib/types.ts` | tous les types du domaine (contenu, quiz, progression, SRS, examen, calculs) |
| `lib/catalog.ts` | catalogue figé : niveaux → domaines → modules (slugs, titres, ordre) |
| `lib/utils.ts` | `cn()` partagé |
| `lib/content.ts` | chargeur de contenu MDX (fs + gray-matter), contrat consommé par les pages |
| `content/data/mn90.json` | données MN90 isolées, seed marqué `À VÉRIFIER` |
| `content/data/reglementation.ts` | valeurs réglementaires datées, centralisées |
| `supabase/migrations/*.sql`, `supabase/seed.sql` | schéma complet + RLS |
| `vitest.config.ts`, scripts `package.json`, `.env.example` | outillage |

### Phase 2 — Workflow A (agents parallèles, périmètres exclusifs)

| Agent | Périmètre exclusif | Modèle / effort | Justification |
|---|---|---|---|
| **calc-engine** | `lib/calc/**` (mn90, autonomie, physique, sm2 + tests Vitest) | hérité (Fable), effort max | zéro tolérance à l'erreur : c'est là que les erreurs coûtent cher |
| **design-system** | `components/ui/**`, `components/layout/**`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx` | hérité, effort standard | volume connu (ports shadcn), soin du responsive 375 px |
| **auth** | `lib/supabase/**`, `lib/progress/**`, `middleware.ts`, `app/(auth)/**`, `app/profil/**` | hérité, effort standard | intégration bien balisée @supabase/ssr + repli invité |
| **content-n1n2** | `content/n1/**`, `content/n2/**` | hérité, effort standard | rédaction dense mais cadrée par le catalogue |
| **content-n3** | `content/n3/**` | hérité, effort standard | densité technique |
| **content-n4** | `content/n4/**` | hérité, effort élevé | physique/tables/réglementation d'examen, précision critique |
| **content-mf1** | `content/mf1/**` | hérité, effort élevé | théorie experte + pédagogie |

Point de synchronisation : `pnpm typecheck && pnpm lint && pnpm build && pnpm test` — corrections par l'orchestrateur.

### Phase 3 — Workflow B (après gel des plans de modules et livraison du moteur de calcul)

| Agent | Périmètre exclusif | Modèle / effort | Justification |
|---|---|---|---|
| **questions-n1n2** | `content/questions/n1.json`, `n2.json` | hérité, effort standard | volume, cadré par catalogue + ancres |
| **questions-n3n4mf1** | `content/questions/n3.json`, `n4.json`, `mf1.json` | hérité, effort élevé | exercices chiffrés, corrections argumentées |
| **simulators** | `components/simulators/**` | hérité, effort élevé | consomme `lib/calc` sans le réécrire, interactivité fine |
| **course-ui** | `components/mdx/**`, `app/(app)/niveaux/**`, `app/(app)/cours/**` | hérité, effort standard | rendu MDX, navigation, notes/marque-pages |
| **quiz-exam** | `components/quiz/**`, `app/(app)/entrainement/**`, `app/(app)/examen/**` | hérité, effort standard | moteur de quiz, examen blanc chronométré |
| **dashboard** | `components/dashboard/**`, `app/(app)/dashboard/**`, `app/(app)/revision/**` | hérité, effort standard | radar Recharts, « à réviser aujourd'hui » |

Point de synchronisation : idem phase 2.

### Phase 4 — QA et documentation

| Agent | Mission | Modèle / effort |
|---|---|---|
| **docs** | `README.md`, `docs/DEPLOY.md`, `docs/CONTENT.md`, `.env.example` | hérité, effort bas (rédactionnel) |
| **QA (orchestrateur)** | typecheck, lint, build, tests, cohérence des liens/ancres, PWA, écran 375 px | — |

Seul l'orchestrateur (rôle QA) modifie les fichiers des autres agents pour corriger les erreurs de build.

## Règles de coordination appliquées

- Aucun agent ne touche `package.json` : toutes les dépendances sont installées en phase 0.
- Les agents Contenu écrivent uniquement dans leur dossier de niveau ; jamais deux agents sur le même fichier.
- La banque de questions démarre après le gel du catalogue (`lib/catalog.ts`, phase 1) : chaque question référence un `moduleSlug` + ancre de section existante.
- `calc-engine` livre avant `simulators` (phase 2 → phase 3).
- Ordre d'exécution : Phase 1 → Workflow A → QA intermédiaire → Workflow B → QA finale → docs → livraison.
