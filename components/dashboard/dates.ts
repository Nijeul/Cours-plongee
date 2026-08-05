/**
 * Aides de formatage de dates en français, sans dépendance externe
 * (Intl.DateTimeFormat / Intl.RelativeTimeFormat, locale fr-FR).
 */

/** Date du jour au format ISO (AAAA-MM-JJ), en heure locale de l'appareil. */
export function localTodayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

const RELATIVE_UNITS: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
  { unit: "year", seconds: 365 * 24 * 3600 },
  { unit: "month", seconds: 30 * 24 * 3600 },
  { unit: "week", seconds: 7 * 24 * 3600 },
  { unit: "day", seconds: 24 * 3600 },
  { unit: "hour", seconds: 3600 },
  { unit: "minute", seconds: 60 },
];

/**
 * Date relative en français : « à l'instant », « il y a 3 heures », « hier »…
 * Retourne une chaîne vide si la date est invalide.
 */
export function formatRelativeFr(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });
  for (const { unit, seconds } of RELATIVE_UNITS) {
    if (Math.abs(diffSeconds) >= seconds) {
      return formatter.format(Math.trunc(diffSeconds / seconds), unit);
    }
  }
  return "à l’instant";
}

/**
 * Date complète en français à partir d'une date ISO (AAAA-MM-JJ),
 * ex. « jeudi 6 août ». Interprétée en heure locale (pas de décalage UTC).
 */
export function formatDayFr(dateIso: string): string {
  const [year, month, day] = dateIso.split("-").map(Number);
  if (!year || !month || !day) return dateIso;
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

/** Nombre de jours (entiers) entre aujourd'hui et une date ISO (AAAA-MM-JJ). */
export function daysUntil(dateIso: string, todayIso: string): number {
  const toUtc = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  };
  return Math.round((toUtc(dateIso) - toUtc(todayIso)) / (24 * 3600 * 1000));
}
