"use client";

import { TimerIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface TimerProps {
  /** Horodatage de fin (ms, epoch). Le temps restant est recalculé à chaque tick. */
  endsAt: number;
  /** Appelé une seule fois quand le temps est écoulé. */
  onExpire: () => void;
  /** Seuil d'alerte visuelle en secondes (défaut : 300 s = 5 min). */
  warnUnderSeconds?: number;
  className?: string;
}

function formatRemaining(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Chronomètre à rebours robuste : le temps restant est déduit d'une référence
 * horodatée (`endsAt` − `Date.now()`), jamais d'un décompte cumulé — aucune
 * dérive même si l'onglet est mis en veille ou si les ticks sont irréguliers.
 */
export function Timer({ endsAt, onExpire, warnUnderSeconds = 300, className }: TimerProps) {
  const compute = React.useCallback(
    () => Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)),
    [endsAt],
  );
  const [remaining, setRemaining] = React.useState(compute);
  const expiredRef = React.useRef(false);
  const onExpireRef = React.useRef(onExpire);
  React.useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  React.useEffect(() => {
    expiredRef.current = false;
    const tick = () => {
      const value = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRemaining(value);
      if (value <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current();
      }
    };
    tick();
    const interval = window.setInterval(tick, 500);
    return () => window.clearInterval(interval);
  }, [endsAt]);

  const warning = remaining > 0 && remaining <= warnUnderSeconds;

  return (
    <div
      role="timer"
      aria-live={warning ? "polite" : "off"}
      aria-label={`Temps restant : ${formatRemaining(remaining)}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-sm font-semibold tabular-nums",
        warning
          ? "border-red-600/40 bg-red-50 text-red-700 motion-safe:animate-pulse dark:border-red-400/30 dark:bg-red-950/50 dark:text-red-300"
          : "bg-muted text-foreground",
        className,
      )}
    >
      <TimerIcon aria-hidden className="size-4" />
      {formatRemaining(remaining)}
    </div>
  );
}
