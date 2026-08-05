import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { getCatalogModule, getModulesForLevel } from "@/lib/catalog";
import type {
  CatalogModule,
  LevelSlug,
  ModuleContent,
  ModuleFrontmatter,
  Question,
  SectionRef,
} from "@/lib/types";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Charge un module MDX depuis `content/<level>/<slug>.mdx`.
 * Lève une erreur explicite si le fichier manque ou si le frontmatter
 * ne correspond pas au catalogue.
 */
export function loadModule(slug: string): ModuleContent {
  const catalog = getCatalogModule(slug);
  if (!catalog) {
    throw new Error(`Module absent du catalogue : ${slug}`);
  }
  const filePath = path.join(CONTENT_DIR, catalog.level, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier de cours introuvable : ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const meta = data as ModuleFrontmatter;
  if (meta.slug !== slug) {
    throw new Error(`Frontmatter incohérent dans ${filePath} : slug "${meta.slug}" ≠ "${slug}"`);
  }
  return {
    meta,
    catalog,
    source: content,
    sections: extractSections(content),
  };
}

export function moduleExists(slug: string): boolean {
  const catalog = getCatalogModule(slug);
  if (!catalog) return false;
  return fs.existsSync(path.join(CONTENT_DIR, catalog.level, `${slug}.mdx`));
}

export function loadModulesForLevel(level: LevelSlug): ModuleContent[] {
  return getModulesForLevel(level)
    .filter((m) => moduleExists(m.slug))
    .map((m) => loadModule(m.slug));
}

export function availableModulesForLevel(level: LevelSlug): CatalogModule[] {
  return getModulesForLevel(level).filter((m) => moduleExists(m.slug));
}

/**
 * Extrait les sections (titres `##`) avec les mêmes ancres que rehype-slug
 * (github-slugger), pour la navigation et le suivi de lecture.
 */
export function extractSections(mdxSource: string): SectionRef[] {
  const slugger = new GithubSlugger();
  const sections: SectionRef[] = [];
  let inCode = false;
  let order = 1;
  for (const line of mdxSource.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = /^##\s+(.+)$/.exec(line);
    if (m) {
      const title = m[1].replace(/\{#.*\}\s*$/, "").trim();
      sections.push({ title, anchor: slugger.slug(title), order: order++ });
    }
  }
  return sections;
}

/**
 * Charge la banque de questions d'un niveau depuis `content/questions/<level>.json`.
 * Retourne un tableau vide si le fichier n'existe pas encore.
 */
export function loadQuestions(level: LevelSlug): Question[] {
  const filePath = path.join(CONTENT_DIR, "questions", `${level}.json`);
  if (!fs.existsSync(filePath)) return [];
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as { questions: Question[] };
  return parsed.questions;
}

export function loadAllQuestions(): Question[] {
  return (["n1", "n2", "n3", "n4", "mf1"] as LevelSlug[]).flatMap((l) => loadQuestions(l));
}
