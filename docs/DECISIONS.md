# DECISIONS — journal des décisions techniques

Chaque décision prise sans validation explicite est consignée ici avec sa justification.

## D-001 — Composants shadcn/ui écrits à la main
La politique réseau de l'environnement bloque `ui.shadcn.com` (403 proxy). Les composants `components/ui/*` sont donc des ports manuels fidèles du style shadcn (Radix UI + Tailwind + CVA), avec `components.json`-like conventions (`cn()`, tokens CSS variables). Aucune différence fonctionnelle pour l'utilisateur final.

## D-002 — Contenu servi depuis le repo, données utilisateur seules en base
Le contenu pédagogique (MDX + questions JSON) est chargé depuis `content/` au build (SSG). La base Supabase ne stocke que les données utilisateur (progression, tentatives, SRS, notes…), référencées par **slug** de module/section — pas de FK vers des tables de contenu. Les tables de contenu (`levels`, `modules`, `sections`, `questions`, `question_options`) existent néanmoins dans les migrations avec lecture publique, et `supabase/seed.sql` les alimente, pour respecter le schéma demandé et permettre une future API. Avantage décisif : l'app fonctionne intégralement sans étape de synchronisation build → base (fragile, nécessite la service key en CI).

## D-003 — Mode invité (localStorage) en repli de Supabase
La progression passe par une interface `ProgressStore` avec deux implémentations : Supabase (connecté) et localStorage (invité ou Supabase non configuré). Bénéfices : `pnpm dev` fonctionne sans aucune variable d'environnement ; un visiteur peut essayer sans compte ; les exigences « retrouver sa progression sur n'importe quel appareil » restent couvertes par l'implémentation Supabase.

## D-004 — MDX via `next-mdx-remote` (RSC) plutôt que contentlayer/@next/mdx
`contentlayer` n'est plus maintenu ; `@next/mdx` impose le contenu dans `app/`. `next-mdx-remote` (export RSC) permet du MDX dans `content/`, compilé côté serveur au build avec `remark-math`/`rehype-katex`/`rehype-slug`, et l'injection de composants interactifs (simulateurs, encadrés).

## D-005 — Données MN90 isolées et marquées « À VÉRIFIER »
`content/data/mn90.json` contient un jeu d'amorçage recopié de mémoire, chaque bloc marqué `"status": "A_VERIFIER"`. Le moteur (`lib/calc/mn90.ts`) échoue proprement (erreur explicite, jamais de valeur inventée) si une entrée manque. L'utilisateur remplira/validera ce fichier depuis un exemplaire officiel — le format est documenté dans `docs/CONTENT.md`.

## D-006 — PWA minimale sans dépendance
`next-pwa` est peu maintenu et `@serwist/next` n'est pas garanti compatible Next 16. Choix : `manifest.webmanifest` + service worker écrit à la main (cache-first sur les pages de cours et assets statiques, network-first ailleurs), enregistré par un petit composant client. Suffisant pour consulter les cours hors ligne.

## D-007 — Tailwind v4 (CSS-first)
`create-next-app` installe Tailwind v4 : la config passe par `@theme` dans `app/globals.css` (pas de `tailwind.config.ts`). Les tokens shadcn (couleurs sémantiques, radius) sont déclarés en CSS variables + `@theme inline`.

## D-008 — Barème de validation des modules
Seuil d'auto-évaluation fixé à 80 % (spec). Un module passe à `completed` quand le test de validation atteint le seuil ; les notions ratées entrent dans le SRS (SM-2 simplifié, intervalles J+1/J+3/J+7/J+16/J+35 conformes au prompt).

## D-009 — Formats d'examen blanc
Les barèmes officiels varient selon les commissions ; valeurs retenues (modifiables dans `content/data/reglementation.ts`) : N2 : 30 QCM / 45 min / seuil 50 % ; N3 : 40 QCM / 60 min ; N4 : épreuves par domaine (physique 20 pts / 45 min, tables 20 pts / 30 min, anatomie 20 pts / 45 min, réglementation 20 pts / 30 min, matériel 20 pts / 30 min), note éliminatoire < 5/20 ; MF1 : format N4 renforcé + pédagogie. Marqués « à vérifier selon le manuel de formation en vigueur ».

## D-010 — Modèles des sous-agents
L'environnement expose un seul modèle (hérité, Fable). La différenciation demandée (« le plus capable » vs « intermédiaire ») est appliquée via le **niveau d'effort de raisonnement** par agent (max/élevé pour moteur de calcul, contenu N4/MF1, simulateurs, questions techniques ; standard pour le reste ; bas pour la documentation).

## D-011 — Expressions JSX dans le MDX des cours (blockJS)
`next-mdx-remote` v6 supprime par défaut toutes les expressions JavaScript du MDX (plugin `removeJavaScriptExpressions`), ce qui vidait silencieusement les attributs `n={1}` des `<Figure>` (les figures s'affichaient sans numéro). Le contenu MDX vit dans le dépôt et est relu en revue : `blockJS: false` est donc activé dans `components/mdx/mdx-content.tsx`, en conservant le garde-fou `blockDangerousJS` (blocage de `eval`, `require`, etc.). Règle d'écriture inchangée pour les auteurs : pas d'expressions dans le texte courant, uniquement dans les attributs de composants.

## D-012 — Schémas pédagogiques (chantier « enrichissement visuel »)
50 schémas SVG (priorité 1 de `docs/AUDIT-SCHEMAS.md`) produits en composants React statiques (`components/schemas/<domaine>/`), bâtis sur des primitives communes (palette sémantique, axes, silhouettes, logigrammes) compatibles clair/sombre et lisibles à 375 px. 102 insertions dans 38 modules : chaque figure est numérotée par module, appelée dans le texte, légendée et suivie d'une synthèse « À retenir ». Registre : `docs/SCHEMAS.md` + page `/schemas`. Les propositions P2/P3 de l'audit restent à produire.

## D-013 — Audit sécurité (2026-08-10)
Constats sains : RLS complète sur toutes les tables utilisateur (`auth.uid()`), contenu pédagogique en lecture seule publique, aucun usage de `service_role` côté code, `.env*` ignoré par git, callback d'auth protégé contre l'open redirect, contenu utilisateur rendu exclusivement via React (pas de XSS), KaTeX sans option `trust`, `pnpm audit` vierge. Correctifs appliqués : en-têtes de sécurité HTTP dans `next.config.ts` (CSP auto-hébergée + connect-src Supabase, nosniff, frame-ancestors 'none', Referrer-Policy, Permissions-Policy, HSTS) ; mot de passe minimum porté de 6 à 8 caractères (à aligner dans Supabase Auth) ; bornes serveur sur les champs libres (migration `20260810000001_hardening.sql` : display_name 80, notes 5000, titres de marque-pages 300, instantanés d'examen ≤ 256 Ko).
