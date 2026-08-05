import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  /** Icône lucide (ou tout élément) affichée à gauche. */
  icon?: React.ReactNode;
  /** Libellé court de la statistique. */
  label: string;
  /** Valeur principale (nombre, pourcentage…). */
  value: React.ReactNode;
  /** Précision optionnelle sous la valeur. */
  hint?: React.ReactNode;
  className?: string;
}

/** Petite carte de statistique : icône, libellé, valeur et précision optionnelle. */
export function StatCard({ icon, label, value, hint, className }: StatCardProps) {
  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="flex items-center gap-3 px-4">
        {icon ? (
          <div
            aria-hidden
            className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg"
          >
            {icon}
          </div>
        ) : null}
        <div className="min-w-0">
          <p className="text-muted-foreground truncate text-xs font-medium">{label}</p>
          <p className="text-xl leading-tight font-bold tracking-tight">{value}</p>
          {hint ? <p className="text-muted-foreground mt-0.5 text-xs">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
