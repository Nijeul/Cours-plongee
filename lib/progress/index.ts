"use client";

import { useEffect, useState } from "react";

import { LocalProgressStore } from "@/lib/progress/local-store";
import { SupabaseProgressStore } from "@/lib/progress/supabase-store";
import { createClient } from "@/lib/supabase/client";
import type { ProgressStore } from "@/lib/types";

export { LocalProgressStore } from "@/lib/progress/local-store";
export { SupabaseProgressStore } from "@/lib/progress/supabase-store";

export type ProgressMode = "supabase" | "local";

export interface ProgressStoreHandle {
  store: ProgressStore;
  mode: ProgressMode;
}

const localStore = new LocalProgressStore();

/**
 * Retourne le store de progression actif :
 * - Supabase configuré ET session active → SupabaseProgressStore ;
 * - sinon (mode invité ou déconnecté) → LocalProgressStore.
 */
export async function getProgressStore(): Promise<ProgressStoreHandle> {
  const supabase = createClient();
  if (!supabase) return { store: localStore, mode: "local" };

  try {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) return { store: localStore, mode: "local" };
    return { store: new SupabaseProgressStore(supabase, user.id), mode: "supabase" };
  } catch {
    return { store: localStore, mode: "local" };
  }
}

export interface UseProgressStoreResult {
  store: ProgressStore;
  mode: ProgressMode;
  /** Vrai tant que la session n'a pas été déterminée. */
  loading: boolean;
}

/**
 * Hook React exposant le store de progression actif.
 * Se réabonne sur onAuthStateChange : à la connexion/déconnexion, le store
 * bascule automatiquement entre Supabase et localStorage.
 */
export function useProgressStore(): UseProgressStoreResult {
  const [state, setState] = useState<UseProgressStoreResult>({
    store: localStore,
    mode: "local",
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    const resolve = () => {
      getProgressStore().then(
        (handle) => {
          if (!cancelled) setState({ store: handle.store, mode: handle.mode, loading: false });
        },
        () => {
          if (!cancelled) setState({ store: localStore, mode: "local", loading: false });
        }
      );
    };

    resolve();

    const supabase = createClient();
    if (!supabase) return () => undefined;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      resolve();
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
