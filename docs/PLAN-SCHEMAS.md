# PLAN — Enrichissement visuel de la partie cours (schémas SVG)

> Périmètre strict : `content/` (insertion), `components/schemas/**` (création), `components/mdx/mdx-content.tsx` (mapping, orchestrateur), `app/(app)/schemas/` (page registre). Aucune modification de l'auth, du schéma de base, des simulateurs ni du moteur de calcul.

## Contrats transverses (fixés par l'orchestrateur)

- **Wrapper de figure** : `components/schemas/figure.tsx` expose `<Figure n={1} titre="…" description="…">` — numérotation par module, légende, description accessible repliable (`<details>`). Fourni par l'agent primitives, utilisé par tous.
- **Palette sémantique** (variables CSS définies dans `components/schemas/primitives/`) : bleu = pression/eau, rouge = danger/accident, vert = sécurité/procédure correcte, orange = vigilance, gris = neutre. Compatible clair/sombre via `currentColor` et variables du thème.
- **Contrat de composant** : SVG inline, `viewBox` + largeur fluide, `role="img"` + `<title>` + `<desc>`, textes en `<text>` réels, lisible à 375 px (variante empilée si besoin), prop optionnelle `level` pour le niveau de détail. Export nommé, un fichier par schéma `components/schemas/<domaine>/<nom>.tsx`, ré-exporté par `components/schemas/<domaine>/index.ts`.
- **Nommage MDX** : les balises utilisables dans les cours sont exactement les exports de `components/schemas/index.ts` (assemblé par l'orchestrateur) + `Figure`. Aucune autre balise nouvelle.
- **Interactif** : statique par défaut ; toute interactivité passe par les simulateurs existants (déjà insérés dans les cours), pas de redéveloppement.

## Phases et agents

| Phase | Agent | Périmètre exclusif | Modèle / effort | Justification |
|---|---|---|---|---|
| 1 | **audit** | `docs/AUDIT-SCHEMAS.md` | hérité (Fable), standard | lecture exhaustive et classement, pas de production |
| 2 | **primitives** | `components/schemas/primitives/**`, `components/schemas/figure.tsx` | hérité, élevé | fondation graphique de tout le chantier : cohérence et qualité critiques |
| 3 | **schemas-physique** | `components/schemas/physique/**` | hérité, élevé | exactitude des grandeurs et des proportions |
| 3 | **schemas-physiologie** | `components/schemas/physiologie/**` | hérité, élevé | anatomie stylisée + arbres de décision de CAT : erreur coûteuse |
| 3 | **schemas-tables** | `components/schemas/tables/**` | hérité, élevé | profils, frises et logigrammes denses |
| 3 | **schemas-reglementation** | `components/schemas/reglementation/**` | hérité, standard | schémas structurés (espaces, cursus, palanquées) |
| 3 | **schemas-materiel** | `components/schemas/materiel/**` | hérité, standard | coupes stylisées et circuits |
| 3 | **schemas-pedagogie** | `components/schemas/pedagogie/**` | hérité, standard | boucles et matrices simples |
| 4 | **integration-n1n2** | `content/n1/**`, `content/n2/**` | hérité, standard | insertion, appels, légendes, synthèses |
| 4 | **integration-n3n4mf1** | `content/n3/**`, `content/n4/**`, `content/mf1/**` | hérité, standard | idem |
| 4 | **QA (orchestrateur)** | mapping MDX, `components/schemas/index.ts`, `app/(app)/schemas/`, `docs/SCHEMAS.md`, gates + captures clair/sombre/375 px | — | seul à modifier les fichiers des autres |

## Ordre d'exécution et synchronisation

1. **Phase 1 + 2 en parallèle** (l'audit ne conditionne pas les primitives).
2. Livraison de l'audit à l'utilisateur ; poursuite immédiate sur les priorités 1.
3. **Phase 3** : 6 agents domaine en parallèle, chacun réalisant la liste minimale du cahier des charges + les priorités 1 de l'audit dans son domaine. Sortie structurée : pour chaque schéma, fichier, export, modules cibles, section, légende proposée.
4. Orchestrateur : assemblage `components/schemas/index.ts`, mapping MDX, `docs/SCHEMAS.md`, build de contrôle.
5. **Phase 4** : 2 agents intégration (périmètres exclusifs par niveau), puis QA complète (build, thèmes, 375 px, orphelins/manquants), page `/schemas`, livraison.

## Choix des modèles

Un seul modèle disponible dans l'environnement (hérité, Fable) : la différenciation demandée est appliquée par le **niveau d'effort de raisonnement** (élevé pour primitives, physique, physiologie, tables ; standard pour le reste), comme pour le chantier initial (cf. docs/DECISIONS.md, D-010).
