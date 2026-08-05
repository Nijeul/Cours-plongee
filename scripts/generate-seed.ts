/**
 * Génère supabase/seed.sql depuis le catalogue et le contenu du repo.
 * Usage : pnpm seed:generate  (à relancer après toute modification de contenu)
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { CATALOG, LEVELS } from "../lib/catalog";
import type { Question } from "../lib/types";

const ROOT = path.join(__dirname, "..");
const CONTENT = path.join(ROOT, "content");

function esc(value: string): string {
  return value.replace(/'/g, "''");
}

function arr(values: string[]): string {
  return `'{${values.map((v) => `"${esc(v)}"`).join(",")}}'`;
}

function extractSections(source: string): { anchor: string; title: string }[] {
  const slugger = new GithubSlugger();
  const out: { anchor: string; title: string }[] = [];
  let inCode = false;
  for (const line of source.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = /^##\s+(.+)$/.exec(line);
    if (m) {
      const title = m[1].replace(/\{#.*\}\s*$/, "").trim();
      out.push({ title, anchor: slugger.slug(title) });
    }
  }
  return out;
}

const lines: string[] = [
  "-- Généré par scripts/generate-seed.ts — ne pas éditer à la main.",
  "-- Recharge le contenu pédagogique de référence (la vérité vit dans content/).",
  "truncate public.question_options, public.questions, public.sections, public.modules, public.levels cascade;",
  "",
];

for (const l of LEVELS) {
  lines.push(
    `insert into public.levels (slug, title, subtitle, description, sort_order) values ('${l.slug}', '${esc(l.title)}', '${esc(l.subtitle)}', '${esc(l.description)}', ${l.order});`,
  );
}
lines.push("");

for (const m of CATALOG) {
  lines.push(
    `insert into public.modules (slug, level_slug, domain, title, description, sort_order, duration_minutes, prerequisites) values ('${m.slug}', '${m.level}', '${m.domain}', '${esc(m.title)}', '${esc(m.description)}', ${m.order}, ${m.durationMinutes}, ${arr(m.prerequisites)});`,
  );
  const file = path.join(CONTENT, m.level, `${m.slug}.mdx`);
  if (fs.existsSync(file)) {
    const { content } = matter(fs.readFileSync(file, "utf8"));
    extractSections(content).forEach((s, i) => {
      lines.push(
        `insert into public.sections (module_slug, anchor, title, sort_order) values ('${m.slug}', '${esc(s.anchor)}', '${esc(s.title)}', ${i + 1});`,
      );
    });
  }
}
lines.push("");

for (const level of LEVELS) {
  const file = path.join(CONTENT, "questions", `${level.slug}.json`);
  if (!fs.existsSync(file)) continue;
  const bank = JSON.parse(fs.readFileSync(file, "utf8")) as { questions: Question[] };
  for (const q of bank.questions) {
    lines.push(
      `insert into public.questions (id, module_slug, level_slug, domain, question_type, section_anchor, prompt, explanation, difficulty) values ('${q.id}', '${q.moduleSlug}', '${q.level}', '${q.domain}', '${q.type}', '${esc(q.sectionAnchor)}', '${esc(q.prompt)}', '${esc(q.explanation)}', ${q.difficulty});`,
    );
    for (const o of q.options) {
      lines.push(
        `insert into public.question_options (question_id, option_id, option_text, is_correct) values ('${q.id}', '${o.id}', '${esc(o.text)}', ${q.correctOptionIds.includes(o.id)});`,
      );
    }
  }
}

fs.writeFileSync(path.join(ROOT, "supabase", "seed.sql"), lines.join("\n") + "\n");
console.log(`supabase/seed.sql généré (${lines.length} lignes).`);
