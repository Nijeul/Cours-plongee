import type { ReactNode } from "react";
import { BookmarkCheck, TriangleAlert, Wrench, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Encadrés pédagogiques utilisés dans le MDX des cours :
 * `<Attention>`, `<ARetenir>`, `<EnPratique>`.
 * Composants serveur : ils reçoivent du Markdown déjà rendu en `children`.
 */

interface CalloutProps {
  children?: ReactNode;
}

interface CalloutBaseProps extends CalloutProps {
  label: string;
  icon: LucideIcon;
  className: string;
  iconClassName: string;
  labelClassName: string;
}

function Callout({
  label,
  icon: Icon,
  className,
  iconClassName,
  labelClassName,
  children,
}: CalloutBaseProps) {
  return (
    <aside
      role="note"
      aria-label={label}
      className={cn("my-6 rounded-lg border border-l-4 px-4 py-3 shadow-xs", className)}
    >
      <p
        className={cn(
          "flex items-center gap-2 text-sm font-semibold tracking-tight",
          labelClassName
        )}
      >
        <Icon aria-hidden="true" className={cn("size-4 shrink-0", iconClassName)} />
        {label}
      </p>
      <div className="mt-1.5 text-sm leading-6 [&_p]:mt-0 [&_p+p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5">
        {children}
      </div>
    </aside>
  );
}

/** Encadré d&apos;avertissement (ambre) : erreurs fréquentes, points de sécurité. */
export function Attention({ children }: CalloutProps) {
  return (
    <Callout
      label="Attention"
      icon={TriangleAlert}
      className="border-amber-500/50 border-l-amber-500 bg-amber-50 text-amber-950 dark:border-amber-400/30 dark:border-l-amber-400 dark:bg-amber-950/40 dark:text-amber-100"
      iconClassName="text-amber-600 dark:text-amber-400"
      labelClassName="text-amber-800 dark:text-amber-300"
    >
      {children}
    </Callout>
  );
}

/** Encadré « À retenir » (bleu) : l&apos;essentiel à mémoriser. */
export function ARetenir({ children }: CalloutProps) {
  return (
    <Callout
      label="À retenir"
      icon={BookmarkCheck}
      className="border-blue-500/50 border-l-blue-500 bg-blue-50 text-blue-950 dark:border-blue-400/30 dark:border-l-blue-400 dark:bg-blue-950/40 dark:text-blue-100"
      iconClassName="text-blue-600 dark:text-blue-400"
      labelClassName="text-blue-800 dark:text-blue-300"
    >
      {children}
    </Callout>
  );
}

/** Encadré « En pratique » (émeraude) : application concrète, gestes de terrain. */
export function EnPratique({ children }: CalloutProps) {
  return (
    <Callout
      label="En pratique"
      icon={Wrench}
      className="border-emerald-500/50 border-l-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-400/30 dark:border-l-emerald-400 dark:bg-emerald-950/40 dark:text-emerald-100"
      iconClassName="text-emerald-600 dark:text-emerald-400"
      labelClassName="text-emerald-800 dark:text-emerald-300"
    >
      {children}
    </Callout>
  );
}
