/**
 * Génération d'identifiants côté client.
 *
 * IMPORTANT : les colonnes `id` de quiz_attempts, exam_sessions, bookmarks et
 * notes sont de type `uuid` en base (voir supabase/migrations). Tout identifiant
 * client doit donc être un UUID **sans préfixe** — un id du type "quiz-…" est
 * rejeté par Postgres (`invalid input syntax for type uuid`) et la donnée est
 * silencieusement perdue pour les utilisateurs connectés.
 */
export function uuid(): string {
  const cryptoApi: Crypto | undefined = typeof globalThis.crypto !== "undefined" ? globalThis.crypto : undefined;
  if (cryptoApi?.randomUUID) {
    return cryptoApi.randomUUID();
  }
  // Repli UUID v4 valide (anciens navigateurs, contextes non sécurisés).
  const bytes = new Uint8Array(16);
  if (cryptoApi?.getRandomValues) {
    cryptoApi.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
