# DEPLOY — Supabase + Vercel, pas à pas

Ce guide part de zéro : aucune connaissance préalable du projet n'est nécessaire. À la fin, l'application tourne en production sur Vercel avec comptes utilisateurs et progression synchronisée via Supabase.

**Rappel important** : Supabase est **optionnel**. Sans les variables d'environnement, l'application fonctionne intégralement en « mode invité » (progression stockée dans le navigateur). Vous pouvez donc déployer sur Vercel sans Supabase (sautez les étapes A à D et F), ou ajouter Supabase plus tard.

Vue d'ensemble :

- **A.** Créer le projet Supabase
- **B.** Appliquer le schéma (migration) puis le contenu (seed)
- **C.** Configurer l'authentification (email/mot de passe, URLs de redirection)
- **D.** Récupérer les clés d'API
- **E.** Déployer sur Vercel
- **F.** Ajouter l'URL de production aux redirections Supabase
- **G.** Vérifications post-déploiement
- Dépannage

---

## A. Créer le projet Supabase

1. Créez un compte sur [https://supabase.com](https://supabase.com) (gratuit pour ce type d'usage).
2. Cliquez sur **New project**.
3. Choisissez :
   - **Name** : par exemple `cours-plongee` ;
   - **Database password** : générez un mot de passe fort et conservez-le (il servira si vous utilisez la CLI) ;
   - **Region** : la plus proche de vos utilisateurs (par exemple *West EU (Paris)* ou *Central EU (Frankfurt)*).
4. Validez et attendez la fin du provisionnement (une à deux minutes).

## B. Appliquer la migration, puis le seed

Le schéma complet (tables, index, politiques RLS) tient dans un seul fichier : `supabase/migrations/20260805000001_schema.sql`. Le contenu pédagogique de référence est dans `supabase/seed.sql` (fichier **généré** par `pnpm seed:generate` — ne pas l'éditer à la main).

Appliquez **d'abord la migration, ensuite le seed** (le seed insère dans les tables créées par la migration).

### Voie 1 — SQL Editor (la plus simple, aucun outil à installer)

1. Dans le tableau de bord Supabase, ouvrez **SQL Editor** → **New query**.
2. Copiez l'intégralité du fichier `supabase/migrations/20260805000001_schema.sql` du dépôt, collez-la dans l'éditeur, puis cliquez sur **Run**. Aucune erreur ne doit s'afficher.
3. Ouvrez une nouvelle requête, copiez l'intégralité de `supabase/seed.sql`, collez et **Run**. Le fichier commence par un `truncate` : il peut être rejoué sans risque à chaque mise à jour du contenu.
4. Vérifiez dans **Table Editor** que les tables `levels`, `modules`, `sections`, `questions` et `question_options` sont remplies (5 niveaux, 42 modules, 640 questions).

### Voie 2 — CLI Supabase

1. Installez la [CLI Supabase](https://supabase.com/docs/guides/cli), puis connectez-vous :

   ```bash
   supabase login
   ```

2. Depuis la racine du dépôt, liez le projet (le *project ref* figure dans l'URL du tableau de bord, `https://supabase.com/dashboard/project/<PROJECT_REF>`) :

   ```bash
   supabase link --project-ref VOTRE_PROJECT_REF
   ```

3. Appliquez les migrations du dossier `supabase/migrations/` :

   ```bash
   supabase db push
   ```

4. Appliquez le seed — soit en collant `supabase/seed.sql` dans le SQL Editor (voie 1, étape 3), soit via `psql` avec la chaîne de connexion du projet (**Settings → Database → Connection string**) :

   ```bash
   psql "VOTRE_CHAINE_DE_CONNEXION" -f supabase/seed.sql
   ```

> Après toute modification du contenu du dépôt (cours, questions, catalogue), régénérez le seed puis rejouez-le :
>
> ```bash
> pnpm seed:generate
> ```

## C. Configurer l'authentification

1. Dans le tableau de bord Supabase, ouvrez **Authentication → Providers** (ou *Sign In / Providers* selon la version de l'interface) et vérifiez que le fournisseur **Email** est **activé** (email + mot de passe — c'est le cas par défaut).
2. Ouvrez **Authentication → URL Configuration** :
   - **Site URL** : l'URL principale de l'application — `http://localhost:3000` pour commencer ; vous la remplacerez par l'URL de production à l'étape F.
   - **Redirect URLs** : ajoutez les entrées suivantes (l'application utilise la route `/auth/callback` pour l'échange de code PKCE — confirmation d'inscription, lien magique, réinitialisation de mot de passe) :

     ```text
     http://localhost:3000/**
     http://localhost:3000/auth/callback
     https://VOTRE-DOMAINE/**
     https://VOTRE-DOMAINE/auth/callback
     ```

     Remplacez `VOTRE-DOMAINE` par votre domaine de production dès que vous le connaîtrez (étape F).
3. *(Optionnel)* Personnalisez les emails transactionnels en français dans **Authentication → Emails** (ou *Email Templates*) : confirmation d'inscription, réinitialisation de mot de passe, etc.
4. *(Optionnel, développement uniquement)* Pour tester sans boîte mail, désactivez la confirmation d'email : **Authentication → Providers → Email → Confirm email** décoché. À réactiver en production.

## D. Récupérer les clés d'API

1. Ouvrez **Settings → API** (ou *Project Settings → API Keys*).
2. Notez les deux valeurs suivantes :

   | Valeur dans Supabase | Variable d'environnement |
   |---|---|
   | **Project URL** (`https://xxxx.supabase.co`) | `NEXT_PUBLIC_SUPABASE_URL` |
   | **anon / public key** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

   La clé *anon* est faite pour être exposée côté navigateur : ce sont les politiques RLS du schéma qui protègent les données. Ne copiez **jamais** la clé `service_role` dans l'application.

3. Pour tester en local, reportez ces valeurs dans `.env.local` :

   ```bash
   cp .env.example .env.local
   ```

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   Relancez `pnpm dev` : le bandeau « mode invité » disparaît et les pages d'inscription/connexion deviennent opérationnelles.

## E. Déployer sur Vercel

1. Poussez le dépôt sur GitHub (si ce n'est pas déjà fait).
2. Sur [https://vercel.com](https://vercel.com), cliquez sur **Add New → Project** et importez le dépôt GitHub.
3. Vercel détecte automatiquement le framework **Next.js** et le gestionnaire **pnpm** (grâce à `pnpm-lock.yaml`) : ne changez ni la commande de build (`next build`) ni le répertoire de sortie.
4. Dans **Environment Variables**, saisissez :

   | Nom | Valeur |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL notée à l'étape D |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé anon notée à l'étape D |
   | `NEXT_PUBLIC_SITE_URL` | `https://VOTRE-PROJET.vercel.app` (ou votre domaine personnalisé) |

5. Cliquez sur **Deploy** et attendez la fin du build.
6. Notez l'URL de production attribuée (par exemple `https://cours-plongee.vercel.app`).

> Ces variables sont `NEXT_PUBLIC_*` : elles sont figées **au moment du build**. Si vous les ajoutez ou les modifiez après coup, relancez un déploiement (**Deployments → Redeploy**).

## F. Retour dans Supabase : déclarer l'URL de production

1. Revenez dans **Authentication → URL Configuration**.
2. Remplacez la **Site URL** par l'URL de production (`https://cours-plongee.vercel.app` ou votre domaine).
3. Dans **Redirect URLs**, vérifiez que figurent bien :

   ```text
   https://cours-plongee.vercel.app/**
   https://cours-plongee.vercel.app/auth/callback
   ```

   (en plus des entrées `http://localhost:3000/…` conservées pour le développement). Sans cela, les liens de confirmation et de réinitialisation ne redirigeront pas vers votre site.

## G. Vérifications post-déploiement

1. **Inscription** : sur le site de production, créez un compte via `/inscription`. Vous devez recevoir l'email de confirmation ; le lien doit aboutir sur le site (route `/auth/callback` puis tableau de bord).
2. **Connexion** : déconnectez-vous puis reconnectez-vous via `/connexion`.
3. **Profil créé automatiquement** : dans Supabase, **Table Editor → profiles**, une ligne doit exister pour votre utilisateur (créée par le trigger `on_auth_user_created`).
4. **Progression synchronisée** : lisez une section de cours et répondez à quelques questions, puis vérifiez que des lignes apparaissent dans `user_progress` et `quiz_attempts`. Ouvrez le site depuis un autre navigateur ou appareil avec le même compte : la progression doit suivre.
5. **RLS** : créez un second compte et vérifiez qu'il ne voit ni la progression ni les statistiques du premier. Les tables de contenu (`levels`, `modules`, `sections`, `questions`, `question_options`) sont en lecture publique — c'est voulu ; toutes les tables utilisateur sont protégées par des politiques « chacun ne lit et n'écrit que ses propres lignes ».
6. **Mode invité** : en navigation privée, sans compte, l'application doit rester entièrement utilisable (bandeau mode invité affiché).

## Dépannage

| Symptôme | Cause probable | Correction |
|---|---|---|
| Toutes les pages renvoient `404: NOT_FOUND` alors que le déploiement est `Ready` et que le build liste bien les routes | **Framework Preset** du projet Vercel sur « Other » au moment du build : la sortie Next.js n'est pas routée | **Settings → Build and Deployment → Framework Preset = Next.js**, puis **Redeploy** (le réglage ne s'applique qu'aux builds suivants). |
| Le déploiement échoue sur `The Edge Function "middleware" is referencing unsupported modules` | Fichier `middleware.ts` déprécié en Next.js 16 | Convention `proxy.ts` (fonction exportée `proxy`) — déjà appliqué dans ce dépôt. |
| Le lien de confirmation ou de réinitialisation renvoie une erreur (`redirect_to` refusé) ou atterrit sur `localhost` | URL absente des **Redirect URLs**, ou **Site URL** restée sur `localhost` | Étapes C.2 et F : ajoutez `https://VOTRE-DOMAINE/**` et `https://VOTRE-DOMAINE/auth/callback`, corrigez la Site URL. |
| Après clic sur le lien de l'email, redirection vers `/connexion?erreur=lien-invalide` | Code PKCE expiré ou déjà consommé (lien ouvert deux fois, ou dans un autre navigateur que celui de la demande) | Redemandez un email ; ouvrez le lien dans le navigateur d'origine. |
| Email de confirmation jamais reçu | Quota d'envoi Supabase par défaut très limité, ou email en spam | En développement : désactivez **Confirm email** (étape C.4). En production : configurez un SMTP personnalisé (**Settings → Auth → SMTP**). |
| Le site affiche le bandeau « mode invité » alors que Supabase est configuré | Variables absentes ou mal nommées au build : c'est le repli **par design** (`lib/supabase/config.ts`) | Vérifiez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans Vercel, puis **redéployez** (variables figées au build). |
| `relation "public.levels" does not exist` en jouant le seed | Seed appliqué avant la migration | Rejouez d'abord `supabase/migrations/20260805000001_schema.sql`, puis `supabase/seed.sql`. |
| L'inscription échoue avec une erreur de mot de passe | Politique de mot de passe Supabase (longueur minimale) | Ajustez **Authentication → Providers → Email** ou choisissez un mot de passe plus long. |
| Contenu obsolète en base après une mise à jour des cours ou des questions | Seed non régénéré | `pnpm seed:generate` puis rejouez `supabase/seed.sql` (il purge et recharge les tables de contenu). |
