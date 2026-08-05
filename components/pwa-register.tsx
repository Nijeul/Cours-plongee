"use client";

import { useEffect } from "react";

/** Enregistre le service worker (consultation hors ligne). Production uniquement. */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // L'app fonctionne sans service worker : échec silencieux.
    });
  }, []);
  return null;
}
