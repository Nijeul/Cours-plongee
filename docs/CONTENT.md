# CONTENT — guide de maintenance du contenu

Tout le contenu pédagogique vit dans le dépôt, versionné avec le code :

| Emplacement | Contenu |
|---|---|
| `content/<niveau>/<slug>.mdx` | Les cours (42 modules), un dossier par niveau : `n1`, `n2`, `n3`, `n4`, `mf1`. |
| `content/questions/<niveau>.json` | La banque de questions (640 questions), un fichier par niveau. |
| `content/data/mn90.json` | Les données des tables MN90 consommées par le moteur de calcul et le simulateur. |
| `content/data/reglementation.ts` | Les valeurs réglementaires centralisées et datées. |
| `lib/catalog.ts` | Le **catalogue** : la liste de référence des niveaux, domaines et modules. |

La base Supabase ne contient qu'une **copie** de ce contenu (générée par `pnpm seed:generate`) : la vérité vit toujours dans `content/` et `lib/catalog.ts`.

---

## 1. Le catalogue : source de vérité

`lib/catalog.ts` définit chaque module : `slug`, `level`, `domain`, `title`, `description`, `order`, `durationMinutes`, `prerequisites`. Le chargeur (`lib/content.ts`), la validation, le seed et toutes les pages s'y réfèrent.

**Ajouter un module se fait donc en deux temps, dans cet ordre :**

1. Ajouter l'entrée dans `CATALOG` (`lib/catalog.ts`), avec un slug **préfixé par le niveau** (ex. `n2-nitrox`) et un `domain` existant (`physique`, `physiologie`, `tables-deco`, `reglementation`, `materiel`, `environnement`, `pedagogie`).
2. Créer le fichier `content/<niveau>/<slug>.mdx` correspondant — le nom du fichier doit être exactement `<slug>.mdx`.

Un module présent dans le catalogue sans fichier MDX est signalé en erreur par `pnpm validate:content` ; un fichier MDX absent du catalogue n'est jamais chargé.

## 2. Format d'un module MDX

### Frontmatter

```yaml
---
slug: n1-flottabilite-pression        # identique au catalogue et au nom de fichier
title: "Flottabilité et pression"
level: n1                             # identique au catalogue
domain: physique                      # identique au catalogue
description: "Résumé d'une phrase affiché dans les listes."
objectives:                           # 3 à 6 objectifs pédagogiques mesurables
  - "Expliquer …"
  - "Calculer …"
  - "Décrire …"
durationMinutes: 40
sources:                              # au moins une source, citée en bas de page
  - "Manuel de Formation Technique FFESSM"
  - "Code du sport, art. A.322-71 et s."
---
```

Contraintes vérifiées par `pnpm validate:content` :

- `slug`, `level`, `domain` **strictement identiques** à l'entrée du catalogue ;
- `objectives` : entre **3 et 6** éléments ;
- `sources` : liste non vide.

### Corps du module

- **Les titres `h2` (`## …`) sont les sections du module.** Ils deviennent des ancres HTML (générées par `rehype-slug` / `github-slugger`), utilisées pour la navigation, le suivi de lecture, les signets, les notes… et surtout par le champ `sectionAnchor` des questions.

  > **Attention : renommer un titre `h2` change son ancre et casse les `sectionAnchor` des questions qui pointent dessus** (ainsi que les signets et notes des utilisateurs côté Supabase). `pnpm validate:content` détecte les ancres orphelines ; après un renommage, mettez à jour les questions concernées dans `content/questions/<niveau>.json`.

  Visez au moins 3 sections `h2` par module (un avertissement est émis en dessous).

- **Encadrés pédagogiques** (composants disponibles dans le MDX, voir `components/mdx/callouts.tsx`) :

  ```mdx
  <Attention>
  Point de sécurité ou piège fréquent.
  </Attention>

  <ARetenir>
  L'essentiel à mémoriser.
  </ARetenir>

  <EnPratique>
  Application concrète en plongée ou en club.
  </EnPratique>
  ```

  Laissez une ligne vide entre la balise et le contenu pour que le Markdown intérieur soit rendu.

- **Fiche `<Memo>` obligatoire** : chaque module se termine par une fiche de synthèse `<Memo>…</Memo>` (`components/mdx/memo.tsx`). Son absence est une **erreur** de validation.

- **Formules KaTeX** : `$…$` en ligne, `$$…$$` en bloc (plugins `remark-math` + `rehype-katex`).

  ```mdx
  $$P_{absolue} = P_{atmosphérique} + \frac{profondeur}{10}$$
  ```

- **Simulateurs insérables** dans n'importe quel module (voir `components/simulators/`) :

  ```mdx
  <SimTables />          {/* tables MN90 : plongée simple et successive */}
  <SimAutonomie />       {/* consommation et autonomie en air */}
  <SimLoisPhysiques />   {/* Mariotte, Archimède, Dalton, Henry */}
  <SimDesaturation />    {/* saturation / désaturation */}
  <SimGenerateur />      {/* générateur d'exercices corrigés */}
  ```

- **Pièges MDX** (le MDX est du Markdown + JSX, la compilation échoue sinon — `pnpm validate:content` compile chaque module avec les mêmes plugins que le site) :
  - **Chevrons** : `<` suivi d'une lettre ouvre une balise JSX. Écrivez « inférieur à 10 m », `\<`, ou passez par KaTeX (`$<$`, `$\le$`). Même prudence avec `>` en début de ligne (citation Markdown).
  - **Accolades** : `{…}` est interprété comme une expression JavaScript. Échappez-les (`\{`, `\}`) ou mettez le fragment en code inline entre accents graves.

## 3. La banque de questions

Un fichier par niveau : `content/questions/<niveau>.json`, de la forme `{ "level": "n2", "questions": [ … ] }`. Format d'une question (type `Question` de `lib/types.ts`) :

```json
{
  "id": "n2-tables-012",
  "type": "qcm",
  "level": "n2",
  "domain": "tables-deco",
  "moduleSlug": "n2-tables-mn90",
  "sectionAnchor": "les-plongees-successives",
  "prompt": "Énoncé (Markdown, formules KaTeX entre $...$).",
  "options": [
    { "id": "a", "text": "…" },
    { "id": "b", "text": "…" },
    { "id": "c", "text": "…" },
    { "id": "d", "text": "…" }
  ],
  "correctOptionIds": ["b"],
  "explanation": "Correction argumentée : pourquoi la bonne réponse est bonne, pourquoi les autres sont fausses, formule appliquée le cas échéant.",
  "difficulty": 2
}
```

Règles :

- `id` **unique et global**, préfixé par le niveau (ex. `n2-tables-012`) ;
- `type` : `qcm`, `calcul` ou `vrai-faux` ; `difficulty` : 1 (facile) à 3 (difficile) ;
- `moduleSlug` : un slug existant du catalogue ; `sectionAnchor` : **l'ancre d'une section `h2` réelle de ce module** — c'est le lien « revoir le cours » de la correction ;
- au moins 2 options, au moins une bonne réponse (les QCM à réponses multiples sont autorisés), chaque `correctOptionId` doit exister dans `options` ;
- **`explanation` obligatoire et argumentée** : une explication de moins de 40 caractères déclenche un avertissement — la correction commentée est un principe fondateur de l'application.

Pour trouver l'ancre exacte d'une section, le plus simple est de la copier depuis l'URL du site (menu de navigation du module) ; en cas d'erreur, `pnpm validate:content` liste les ancres disponibles du module.

## 4. Vérifier et compléter `content/data/mn90.json`

**État actuel : `meta.status = "A_VERIFIER"`.** Le fichier est un jeu d'amorçage recopié de mémoire, **non vérifié** sur un exemplaire officiel des tables MN90 (édition FFESSM). Le simulateur de tables (`components/simulators/sim-tables.tsx`) affiche le texte de `meta.warning` à l'écran ; tant que la vérification n'est pas faite, ces valeurs ne doivent pas servir à préparer une vraie plongée.

### Structure du fichier

```jsonc
{
  "meta": {
    "status": "A_VERIFIER",          // à retirer une fois la vérification faite
    "source": "…",
    "updated": "AAAA-MM-JJ",
    "ascentSpeedMeters": { "min": 15, "max": 17 },
    "interStopSpeed": 6
  },
  "tableI": {                        // plongée simple
    "entries": [
      {
        "depth": 20,                 // profondeur de l'entrée de table (m)
        "rows": [
          { "duration": 45,          // durée de plongée (min)
            "stops": { "3": 4 },     // paliers : minutes par profondeur de palier ("6", "3"…)
            "gps": "I" }             // Groupe de Plongée Successive
        ]
      }
    ]
  },
  "tableII": {                       // azote résiduel
    "intervals": [15, 30, …, 720],   // intervalles de surface (min)
    "residualNitrogen": {
      "A": [0.84, 0.83, …],          // une ligne par GPS, une valeur par intervalle
      "B": [ … ]
    }
  },
  "tableIII": {                      // majoration
    "nitrogenLevels": [0.84, …],     // lignes : azote résiduel
    "depths": [12, 15, …, 60],       // colonnes : profondeur de la 2e plongée (m)
    "majorations": [ [4, 3, …], … ]  // minutes ; 999 = case « hors table » (successive interdite)
  }
}
```

### Garanties du moteur (`lib/calc/mn90.ts`)

Le moteur applique les lectures **pénalisantes** des MN90 (profondeur et durée arrondies à l'entrée immédiatement supérieure en table I ; intervalle arrondi à l'intervalle immédiatement inférieur en tableau II ; azote et profondeur arrondis à la valeur immédiatement supérieure en tableau III) et **refuse proprement tout cas hors couverture** : toute profondeur, durée, intervalle ou combinaison absente du fichier lève une `Mn90DataError` avec un message explicite — **jamais d'extrapolation**. Vous pouvez donc remplir le fichier progressivement : ce qui n'y est pas est simplement refusé.

### Procédure de vérification

1. Procurez-vous un **exemplaire officiel** des tables MN90 (édition FFESSM en vigueur, par exemple celle du Manuel de Formation Technique).
2. **Table I** : pour chaque profondeur (`entries[].depth`) et chaque ligne (`duration`), comparez un à un les paliers (`stops`) et le GPS (`gps`). Complétez les profondeurs ou durées manquantes en respectant strictement la structure ci-dessus (paliers indexés par profondeur de palier en mètres, minutes en valeurs).
3. **Tableau II** : vérifiez la liste `intervals` puis, GPS par GPS, chaque valeur d'azote résiduel (chaque ligne doit avoir exactement autant de valeurs que d'intervalles).
4. **Tableau III** : vérifiez `nitrogenLevels`, `depths`, puis la matrice `majorations` ligne par ligne (chaque ligne = un niveau d'azote, chaque colonne = une profondeur). Utilisez la sentinelle `999` pour les cases où la table interdit la plongée successive.
5. Vérifiez aussi `meta.ascentSpeedMeters` et `meta.interStopSpeed` (vitesses de remontée), dupliquées côté enseignement dans `content/data/reglementation.ts`.
6. Une fois **tout** vérifié : retirez le champ `meta.status` (ou remplacez `A_VERIFIER`), mettez à jour `meta.updated` et `meta.warning`.
7. Relancez la suite de tests :

   ```bash
   pnpm test
   ```

   `lib/calc/__tests__/mn90.test.ts` vérifie la cohérence du moteur **et** des données : lectures exactes de cas connus, règles d'arrondi, refus hors couverture, sentinelle `999`, composition successive. Si une valeur corrigée d'après la table officielle contredit une attente de test, c'est l'attente du test qui doit être alignée sur la table officielle — jamais l'inverse.

## 5. `content/data/reglementation.ts` : valeurs datées

Ce fichier centralise **toutes** les valeurs réglementaires affichées ou utilisées dans l'application : aptitudes et espaces d'évolution (PE12 → PA60), aptitudes par brevet, effectifs de palanquée, profondeur maximale à l'air, vitesses de remontée, pression de réserve, matériel obligatoire (Code du sport), formats d'examens blancs (`EXAM_CONFIGS`).

Les textes évoluent : à chaque vérification sur le Code du sport et le Manuel de Formation Technique en vigueur, mettez à jour les valeurs **et** la constante `REGLEMENTATION_DATE`. Ne dupliquez jamais une valeur réglementaire ailleurs dans le code ou le contenu : faites-la vivre ici.

## 6. Après toute modification de contenu

Dans l'ordre :

1. **Valider le contenu** :

   ```bash
   pnpm validate:content
   ```

   Ce script vérifie : présence d'un fichier MDX pour chaque module du catalogue ; cohérence du frontmatter (slug/level/domain, 3-6 objectifs, sources) ; présence du bloc `<Memo>` ; absence de `TODO`/lorem ipsum ; compilation MDX avec les plugins du site (remark-gfm, remark-math, rehype-katex, rehype-slug) ; nombre de sections `h2` ; et, pour chaque question : id unique, `moduleSlug` existant, `sectionAnchor` présent dans le module, niveau cohérent, options et bonnes réponses valides, longueur de l'explication.

2. **Relancer les tests** (obligatoire si `content/data/` ou `lib/calc/` a changé) :

   ```bash
   pnpm test
   ```

3. **Régénérer le seed** si vous utilisez Supabase, puis rejouer `supabase/seed.sql` dans le projet (voir [docs/DEPLOY.md](DEPLOY.md), étape B) :

   ```bash
   pnpm seed:generate
   ```

4. **Vérifier le build** :

   ```bash
   pnpm build
   ```
