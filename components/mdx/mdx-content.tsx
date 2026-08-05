import type { ComponentProps } from "react";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { ARetenir, Attention, EnPratique } from "@/components/mdx/callouts";
import { Memo } from "@/components/mdx/memo";
import {
  SimAutonomie,
  SimDesaturation,
  SimGenerateur,
  SimLoisPhysiques,
  SimTables,
} from "@/components/simulators";
import { cn } from "@/lib/utils";

/**
 * Rendu serveur du MDX des cours (next-mdx-remote/rsc) avec la typographie
 * de lecture maison et les composants pédagogiques (encadrés, fiche mémo,
 * simulateurs).
 */

function H1({ className, ...props }: ComponentProps<"h1">) {
  // Les cours ne devraient pas contenir de h1 (titre porté par la page),
  // mais on le style proprement par sécurité.
  return (
    <h1
      className={cn("mt-10 scroll-mt-20 text-2xl font-bold tracking-tight", className)}
      {...props}
    />
  );
}

function H2({ id, className, children, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      id={id}
      className={cn(
        "group mt-10 scroll-mt-20 border-b pb-2 text-xl font-semibold tracking-tight text-balance sm:text-2xl",
        className
      )}
      {...props}
    >
      {children}
      {id ? (
        <a
          href={`#${id}`}
          aria-label="Lien direct vers cette section"
          className="text-muted-foreground ml-2 align-middle text-base font-normal no-underline opacity-0 transition-opacity group-hover:opacity-60 hover:opacity-100 focus-visible:opacity-100"
        >
          #
        </a>
      ) : null}
    </h2>
  );
}

function H3({ id, className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      id={id}
      className={cn("mt-8 scroll-mt-20 text-lg font-semibold tracking-tight", className)}
      {...props}
    />
  );
}

function H4({ id, className, ...props }: ComponentProps<"h4">) {
  return (
    <h4 id={id} className={cn("mt-6 scroll-mt-20 font-semibold", className)} {...props} />
  );
}

function P({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("mt-4 leading-7", className)} {...props} />;
}

function A({ className, href, ...props }: ComponentProps<"a">) {
  const external = typeof href === "string" && /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={cn(
        "text-primary font-medium underline underline-offset-4 hover:no-underline",
        className
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    />
  );
}

function Ul({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cn("mt-4 list-disc space-y-1.5 pl-6", className)} {...props} />;
}

function Ol({ className, ...props }: ComponentProps<"ol">) {
  return <ol className={cn("mt-4 list-decimal space-y-1.5 pl-6", className)} {...props} />;
}

function Li({ className, ...props }: ComponentProps<"li">) {
  return <li className={cn("leading-7 [&>p]:mt-2 first:[&>p]:mt-0", className)} {...props} />;
}

function Blockquote({ className, ...props }: ComponentProps<"blockquote">) {
  return (
    <blockquote
      className={cn(
        "border-primary/40 text-muted-foreground mt-4 border-l-4 pl-4 italic [&>p]:mt-2 first:[&>p]:mt-0",
        className
      )}
      {...props}
    />
  );
}

function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="mt-6 w-full overflow-x-auto rounded-lg border">
      <table className={cn("w-full min-w-max border-collapse text-sm", className)} {...props} />
    </div>
  );
}

function Th({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "bg-muted/60 border-b px-3 py-2 text-left font-semibold whitespace-nowrap",
        className
      )}
      {...props}
    />
  );
}

function Td({ className, ...props }: ComponentProps<"td">) {
  return <td className={cn("border-b px-3 py-2 align-top", className)} {...props} />;
}

function Tr({ className, ...props }: ComponentProps<"tr">) {
  return <tr className={cn("last:[&>td]:border-b-0", className)} {...props} />;
}

function Code({ className, ...props }: ComponentProps<"code">) {
  return (
    <code
      className={cn(
        "bg-muted rounded-md px-1.5 py-0.5 font-mono text-[0.85em] break-words",
        className
      )}
      {...props}
    />
  );
}

function Pre({ className, ...props }: ComponentProps<"pre">) {
  return (
    <pre
      className={cn(
        "bg-muted mt-4 overflow-x-auto rounded-lg border p-4 font-mono text-sm leading-6 [&_code]:bg-transparent [&_code]:p-0 [&_code]:break-normal",
        className
      )}
      {...props}
    />
  );
}

function Hr({ className, ...props }: ComponentProps<"hr">) {
  return <hr className={cn("my-8 border-t", className)} {...props} />;
}

const components: MDXRemoteProps["components"] = {
  // Composants pédagogiques disponibles dans le MDX.
  Attention,
  ARetenir,
  EnPratique,
  Memo,
  SimTables,
  SimAutonomie,
  SimLoisPhysiques,
  SimDesaturation,
  SimGenerateur,
  // Éléments HTML stylés.
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  a: A,
  ul: Ul,
  ol: Ol,
  li: Li,
  blockquote: Blockquote,
  table: Table,
  th: Th,
  td: Td,
  tr: Tr,
  code: Code,
  pre: Pre,
  hr: Hr,
};

interface MdxContentProps {
  /** Source MDX brute (sans frontmatter), telle que fournie par `loadModule`. */
  source: string;
}

/** Composant SERVEUR : compile et rend le MDX d&apos;un module de cours. */
export function MdxContent({ source }: MdxContentProps) {
  return (
    <div className="min-w-0 text-[0.95rem] leading-7 sm:text-base [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:py-1 [&>*:first-child]:mt-0">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex, rehypeSlug],
          },
        }}
        components={components}
      />
    </div>
  );
}
