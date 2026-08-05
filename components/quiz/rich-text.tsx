"use client";

import katex from "katex";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Rendu léger d'un texte de question : Markdown minimal (gras, italique,
 * code inline) et formules KaTeX entre `$...$`.
 *
 * Volontairement simple : les énoncés et corrections de la banque de questions
 * n'utilisent que ces constructions.
 */

/** Segments Markdown inline : **gras**, *italique*, `code`. */
const INLINE_PATTERN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(INLINE_PATTERN).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={key} className="bg-muted rounded px-1 py-0.5 font-mono text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

function renderMath(formula: string, key: string): React.ReactNode {
  let html: string;
  try {
    html = katex.renderToString(formula, { throwOnError: false, output: "html" });
  } catch {
    // Formule invalide : on affiche le source plutôt que de casser la page.
    return <code key={key}>{formula}</code>;
  }
  return (
    <span
      key={key}
      className="whitespace-nowrap"
      // KaTeX produit du HTML sûr à partir d'une formule de notre banque de questions.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Découpe un texte en segments texte / formules `$...$` et les rend. */
function renderSegments(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const parts = text.split(/\$([^$]+)\$/g);
  parts.forEach((part, i) => {
    if (part === "") return;
    const key = `${keyPrefix}-${i}`;
    if (i % 2 === 1) nodes.push(renderMath(part, key));
    else nodes.push(...renderInline(part, key));
  });
  return nodes;
}

interface RichTextProps {
  /** Texte source (Markdown minimal + `$...$`). */
  text: string;
  className?: string;
}

/**
 * Affiche un texte enrichi sur une ou plusieurs lignes (les sauts de ligne
 * doubles créent des paragraphes).
 */
export function RichText({ text, className }: RichTextProps) {
  const paragraphs = React.useMemo(
    () =>
      text
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0),
    [text],
  );

  if (paragraphs.length <= 1) {
    return <span className={className}>{renderSegments(paragraphs[0] ?? text, "p0")}</span>;
  }

  return (
    <span className={cn("block space-y-2", className)}>
      {paragraphs.map((paragraph, i) => (
        <span key={i} className="block">
          {renderSegments(paragraph, `p${i}`)}
        </span>
      ))}
    </span>
  );
}
