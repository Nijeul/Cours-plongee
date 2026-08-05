# Cours de plongée — théorie FFESSM du N1 au MF1

Application web d'apprentissage de la théorie de la plongée (cursus FFESSM), du Niveau 1 au Monitorat Fédéral 1er degré. Elle réunit dans une seule interface les cours, les QCM corrigés, les simulateurs de calcul, les examens blancs et un système de révision espacée.

> **AVERTISSEMENT — à lire avant toute utilisation**
>
> - **Contenu de révision uniquement.** Cette application ne remplace en aucun cas la formation dispensée en club par un moniteur qualifié, ni les textes réglementaires en vigueur.
> - **Données MN90 à vérifier.** Le fichier `content/data/mn90.json` est un **jeu de données d'amorçage, non vérifié sur un exemplaire officiel des tables MN90** (statut `A_VERIFIER`). Il doit être intégralement contrôlé sur des tables officielles avant tout usage réel — la procédure est décrite dans [docs/CONTENT.md](docs/CONTENT.md). Le moteur de calcul refuse proprement tout cas non couvert par ce fichier, mais il ne peut pas détecter une valeur recopiée de travers.

## Ce que fait l'application

- **Parcours par niveau** : N1, N2, N3, N4/GP et MF1 — 42 modules de cours au format MDX, organisés par domaine (physique, physiologie, tables et décompression, réglementation, matériel, environnement, pédagogie), avec objectifs pédagogiques, prérequis, fiches mémo et sources.
- **QCM corrigés** : 640 questions avec **correction argumentée** systématique et lien direct vers la section de cours concernée. Entraînement libre par niveau, domaine ou module, et quiz de validation de module.
- **Simulateurs interactifs** : tables MN90 (plongée simple et successive, paliers, GPS, majoration), consommation et autonomie en air, lois physiques (Mariotte, Archimède, Dalton, Henry), désaturation, générateur d'exercices — adossés au moteur de calcul de `lib/calc`, couvert par 97 tests Vitest.
- **Examens blancs** : sessions chronométrées par niveau, tirage pondéré par domaine, score détaillé et correction complète.
- **Révision espacée** : algorithme SM-2 (cartes, intervalles croissants, échéances quotidiennes) alimenté par vos erreurs.
- **PWA hors ligne** : manifeste et service worker (`public/manifest.webmanifest`, `public/sw.js`), page de repli hors connexion, installation sur mobile.
- **Mode invité ou compte Supabase** : sans aucune configuration, l'application est 100 % fonctionnelle en « mode invité » (progression stockée dans le navigateur via localStorage). Avec un projet Supabase configuré : comptes utilisateurs (email/mot de passe), progression synchronisée entre appareils et données protégées par Row Level Security.

## Pile technique

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 · composants style shadcn/ui écrits à la main · Supabase (Auth + Postgres + RLS) · MDX via `next-mdx-remote` · KaTeX · Recharts · Vitest.

## Prérequis

- **Node.js 22**
- **pnpm** version 10 (voir le champ `packageManager` de `package.json` ; avec Corepack : `corepack enable`)

Aucun compte Supabase n'est nécessaire pour développer ou utiliser l'application en local (mode invité).

## Installation

1. Installer les dépendances :

   ```bash
   pnpm install
   ```

2. *(Optionnel)* Configurer Supabase. Cette étape peut être sautée : sans variables d'environnement, l'application démarre en mode invité.

   ```bash
   cp .env.example .env.local
   # puis renseigner les valeurs (voir le tableau ci-dessous et docs/DEPLOY.md)
   ```

3. Lancer le serveur de développement :

   ```bash
   pnpm dev
   ```

4. Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Toutes les variables sont **optionnelles** : en leur absence, l'application bascule en mode invité (voir `lib/supabase/config.ts`).

| Variable | Obligatoire | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Non | URL du projet Supabase (`https://xxxx.supabase.co`). Absente → mode invité. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Non | Clé anonyme publique du projet Supabase. Absente → mode invité. |
| `NEXT_PUBLIC_SITE_URL` | Non | URL publique du site, utilisée pour les redirections d'authentification et la PWA. Par défaut : `http://localhost:3000`. |

La procédure complète de création du projet Supabase et de récupération de ces valeurs est décrite dans [docs/DEPLOY.md](docs/DEPLOY.md).

## Commandes

| Commande | Effet |
|---|---|
| `pnpm dev` | Serveur de développement Next.js. |
| `pnpm build` | Build de production. |
| `pnpm start` | Sert le build de production. |
| `pnpm lint` | Analyse ESLint. |
| `pnpm typecheck` | Vérification TypeScript (`tsc --noEmit`). |
| `pnpm test` | Lance les 97 tests Vitest (`pnpm test:watch` pour le mode continu). |
| `pnpm validate:content` | Valide tout le contenu : catalogue ↔ fichiers MDX, frontmatter, compilation MDX, ancres et cohérence des 640 questions. |
| `pnpm seed:generate` | Régénère `supabase/seed.sql` à partir du contenu du dépôt (à relancer après toute modification de contenu si Supabase est utilisé). |

## Structure du projet

```
Cours-plongee/
├── app/                      # Routes Next.js (App Router)
│   ├── (app)/                #   Application : niveaux, cours, dashboard, entrainement,
│   │                         #   examen, revision, simulateurs
│   ├── (auth)/               #   Connexion, inscription, mot de passe oublié, réinitialisation
│   ├── auth/callback/        #   Callback Supabase (échange de code PKCE)
│   ├── hors-ligne/           #   Page de repli hors connexion (PWA)
│   └── profil/               #   Profil utilisateur
├── components/
│   ├── auth/                 #   Menu utilisateur, alerte mode invité
│   ├── course/               #   Suivi de lecture, outils de section
│   ├── dashboard/            #   Tableaux de bord, radar de compétences
│   ├── layout/               #   En-tête, pied de page, badges de niveau
│   ├── mdx/                  #   Rendu MDX : encadrés pédagogiques, fiche Memo
│   ├── quiz/                 #   QCM, quiz de module, sessions d'examen
│   ├── simulators/           #   SimTables, SimAutonomie, SimLoisPhysiques,
│   │                         #   SimDesaturation, SimGenerateur
│   └── ui/                   #   Composants de base style shadcn/ui
├── content/
│   ├── n1/ … n4/ mf1/        #   42 modules de cours MDX (un dossier par niveau)
│   ├── questions/            #   640 questions (un fichier JSON par niveau)
│   └── data/                 #   mn90.json (tables MN90 — statut À VÉRIFIER)
│                             #   reglementation.ts (valeurs réglementaires datées)
├── lib/
│   ├── calc/                 #   Moteur de calcul testé : MN90, physique, autonomie,
│   │                         #   SM-2, générateurs d'exercices (97 tests Vitest)
│   ├── progress/             #   Progression : localStorage (invité) ou Supabase
│   ├── supabase/             #   Clients Supabase (navigateur, serveur, middleware)
│   ├── catalog.ts            #   Catalogue des modules — SOURCE DE VÉRITÉ du contenu
│   ├── content.ts            #   Chargeur MDX (fs + gray-matter)
│   └── types.ts              #   Contrats d'interface du domaine
├── scripts/
│   ├── generate-seed.ts      #   Génère supabase/seed.sql depuis content/
│   └── validate-content.mts  #   Validation du contenu (pnpm validate:content)
├── supabase/
│   ├── migrations/           #   Schéma SQL complet + politiques RLS
│   └── seed.sql              #   Contenu de référence (généré — ne pas éditer à la main)
├── public/                   #   manifest.webmanifest, sw.js, icônes (PWA)
├── docs/                     #   PLAN.md, DECISIONS.md, DEPLOY.md, CONTENT.md
└── middleware.ts             #   Rafraîchissement de session Supabase
```

## Documentation

- [docs/DEPLOY.md](docs/DEPLOY.md) — déploiement pas à pas : Supabase (schéma, seed, authentification) puis Vercel.
- [docs/CONTENT.md](docs/CONTENT.md) — maintenance du contenu : modules MDX, banque de questions, vérification des tables MN90, valeurs réglementaires.
- [docs/PLAN.md](docs/PLAN.md) — plan d'orchestration du projet.
- [docs/DECISIONS.md](docs/DECISIONS.md) — journal des décisions techniques.
