/**
 * Valide tout le contenu du repo :
 *  - chaque module du catalogue a son fichier MDX, frontmatter cohérent ;
 *  - le MDX compile avec les mêmes plugins que le rendu (remark-math/gfm, rehype-katex/slug) ;
 *  - les questions référencent des modules et des ancres de sections existants.
 * Usage : pnpm validate:content
 */
import fs from "node:fs";
import path from "node:path";
import { compile } from "@mdx-js/mdx";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import { CATALOG, LEVELS } from "../lib/catalog";
import type { ModuleFrontmatter, Question } from "../lib/types";

const ROOT = path.join(import.meta.dirname, "..");
const errors: string[] = [];
const warnings: string[] = [];

function extractSections(source: string): string[] {
  const slugger = new GithubSlugger();
  const anchors: string[] = [];
  let inCode = false;
  for (const line of source.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = /^##\s+(.+)$/.exec(line);
    if (m) anchors.push(slugger.slug(m[1].replace(/\{#.*\}\s*$/, "").trim()));
  }
  return anchors;
}

async function main() {
  const sectionsBySlug = new Map<string, string[]>();

  for (const mod of CATALOG) {
    const file = path.join(ROOT, "content", mod.level, `${mod.slug}.mdx`);
    if (!fs.existsSync(file)) {
      errors.push(`MODULE MANQUANT : ${mod.level}/${mod.slug}.mdx`);
      continue;
    }
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const meta = data as ModuleFrontmatter;
    for (const [key, expected] of [
      ["slug", mod.slug],
      ["level", mod.level],
      ["domain", mod.domain],
    ] as const) {
      if (meta[key] !== expected)
        errors.push(`${mod.slug} : frontmatter ${key} = "${meta[key]}" ≠ "${expected}"`);
    }
    if (!Array.isArray(meta.objectives) || meta.objectives.length < 3 || meta.objectives.length > 6)
      errors.push(`${mod.slug} : objectives doit contenir 3 à 6 éléments`);
    if (!Array.isArray(meta.sources) || meta.sources.length === 0)
      errors.push(`${mod.slug} : sources manquantes`);
    if (!/<Memo>/.test(content)) errors.push(`${mod.slug} : bloc <Memo> manquant`);
    if (/TODO|lorem ipsum|Lorem ipsum/i.test(content)) errors.push(`${mod.slug} : TODO/lorem détecté`);

    const anchors = extractSections(content);
    if (anchors.length < 3) warnings.push(`${mod.slug} : seulement ${anchors.length} sections h2`);
    sectionsBySlug.set(mod.slug, anchors);

    try {
      await compile(content, {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [rehypeKatex, rehypeSlug],
        format: "mdx",
      });
    } catch (e) {
      errors.push(`${mod.slug} : MDX INVALIDE — ${(e as Error).message}`);
    }
  }

  let questionCount = 0;
  for (const level of LEVELS) {
    const file = path.join(ROOT, "content", "questions", `${level.slug}.json`);
    if (!fs.existsSync(file)) {
      warnings.push(`Pas de banque de questions pour ${level.slug}`);
      continue;
    }
    let bank: { questions: Question[] };
    try {
      bank = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (e) {
      errors.push(`questions/${level.slug}.json : JSON invalide — ${(e as Error).message}`);
      continue;
    }
    const ids = new Set<string>();
    for (const q of bank.questions) {
      questionCount++;
      if (ids.has(q.id)) errors.push(`questions/${level.slug} : id dupliqué ${q.id}`);
      ids.add(q.id);
      const anchors = sectionsBySlug.get(q.moduleSlug);
      if (!anchors) {
        errors.push(`${q.id} : moduleSlug inconnu "${q.moduleSlug}"`);
      } else if (!anchors.includes(q.sectionAnchor)) {
        errors.push(`${q.id} : ancre "${q.sectionAnchor}" absente de ${q.moduleSlug} (ancres : ${anchors.join(", ")})`);
      }
      if (q.level !== level.slug) errors.push(`${q.id} : level "${q.level}" ≠ "${level.slug}"`);
      if (!q.correctOptionIds?.length) errors.push(`${q.id} : aucune bonne réponse`);
      if (q.options.length < 2) errors.push(`${q.id} : moins de 2 options`);
      const optIds = new Set(q.options.map((o) => o.id));
      for (const c of q.correctOptionIds)
        if (!optIds.has(c)) errors.push(`${q.id} : correctOptionId "${c}" absent des options`);
      if (!q.explanation || q.explanation.length < 40)
        warnings.push(`${q.id} : explication courte (« correction argumentée » attendue)`);
    }
  }

  console.log(`Modules vérifiés : ${CATALOG.length} — Questions vérifiées : ${questionCount}`);
  if (warnings.length) console.log(`\nAVERTISSEMENTS (${warnings.length}) :\n- ` + warnings.join("\n- "));
  if (errors.length) {
    console.error(`\nERREURS (${errors.length}) :\n- ` + errors.join("\n- "));
    process.exit(1);
  }
  console.log("\nContenu valide.");
}

main();
