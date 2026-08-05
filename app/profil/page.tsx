"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { translateAuthError } from "@/components/auth/auth-errors";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isLevelSlug, LEVELS } from "@/lib/catalog";
import { useProgressStore } from "@/lib/progress";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { LevelSlug } from "@/lib/types";

export default function ProfilPage() {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const { store, mode, loading } = useProgressStore();

  const [user, setUser] = React.useState<User | null>(null);
  const [displayName, setDisplayName] = React.useState("");
  const [nameSaving, setNameSaving] = React.useState(false);
  const [nameSaved, setNameSaved] = React.useState(false);
  const [targetLevel, setTargetLevel] = React.useState<LevelSlug | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Charge l'utilisateur et son profil (nom affiché).
  React.useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    let cancelled = false;

    supabase.auth.getSession().then(async ({ data }) => {
      const sessionUser = data.session?.user ?? null;
      if (cancelled) return;
      setUser(sessionUser);
      if (!sessionUser) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", sessionUser.id)
        .maybeSingle<{ display_name: string | null }>();
      if (!cancelled && profile?.display_name) {
        setDisplayName(profile.display_name);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  // Charge le niveau cible depuis le store actif (Supabase ou localStorage).
  React.useEffect(() => {
    if (loading) return;
    let cancelled = false;
    store.getSnapshot().then(
      (snapshot) => {
        if (!cancelled) setTargetLevel(snapshot.targetLevel);
      },
      () => {
        // Lecture impossible : on laisse la valeur courante.
      }
    );
    return () => {
      cancelled = true;
    };
  }, [store, loading]);

  async function handleLevelChange(value: string) {
    if (!isLevelSlug(value)) return;
    setTargetLevel(value);
    setError(null);
    try {
      await store.setTargetLevel(value);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Enregistrement du niveau cible impossible.");
    }
  }

  async function handleSaveName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase || !user) return;

    setNameSaving(true);
    setNameSaved(false);
    setError(null);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim() || null, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    setNameSaving(false);

    if (updateError) {
      setError(translateAuthError(updateError.message));
      return;
    }
    setNameSaved(true);
  }

  async function handleSignOut() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const connected = configured && user !== null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profil</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Vos informations et vos préférences d’apprentissage.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Compte</CardTitle>
          <CardDescription>
            {connected
              ? "Vous êtes connecté : votre progression est synchronisée entre vos appareils."
              : configured
                ? "Vous n'êtes pas connecté : votre progression est enregistrée uniquement dans ce navigateur."
                : "Mode invité : ce déploiement fonctionne sans compte, votre progression est enregistrée uniquement dans ce navigateur."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {connected ? (
            <>
              <div className="flex flex-col gap-2">
                <Label>Adresse email</Label>
                <p className="text-sm">{user?.email}</p>
              </div>

              <form onSubmit={handleSaveName} className="flex flex-col gap-2">
                <Label htmlFor="displayName">Nom affiché</Label>
                <div className="flex gap-2">
                  <Input
                    id="displayName"
                    type="text"
                    maxLength={60}
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      setNameSaved(false);
                    }}
                    placeholder="Votre nom"
                  />
                  <Button type="submit" variant="outline" disabled={nameSaving}>
                    {nameSaving ? "Enregistrement…" : "Enregistrer"}
                  </Button>
                </div>
                {nameSaved && <p className="text-muted-foreground text-xs">Nom enregistré.</p>}
              </form>

              <div>
                <Button variant="outline" onClick={handleSignOut}>
                  Se déconnecter
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Label>Mode</Label>
              <p className="text-muted-foreground text-sm">
                {mode === "local"
                  ? "Invité — les données (progression, quiz, notes, révisions) restent dans le stockage local de ce navigateur. Elles seront perdues si vous videz les données du site."
                  : "Compte — vos données sont enregistrées en ligne."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Niveau préparé</CardTitle>
          <CardDescription>
            Le niveau cible personnalise votre tableau de bord et vos révisions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex max-w-sm flex-col gap-2">
            <Label htmlFor="target-level">Niveau cible</Label>
            <Select
              value={targetLevel ?? undefined}
              onValueChange={handleLevelChange}
              disabled={loading}
            >
              <SelectTrigger id="target-level" className="w-full">
                <SelectValue placeholder="Choisir un niveau" />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map((level) => (
                  <SelectItem key={level.slug} value={level.slug}>
                    {level.title} — {level.subtitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {configured && !connected && (
        <Card>
          <CardHeader>
            <CardTitle>Synchronisez votre progression</CardTitle>
            <CardDescription>
              Créez un compte gratuit pour retrouver votre progression, vos notes et vos révisions
              sur tous vos appareils.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/inscription">Créer un compte</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/connexion">Se connecter</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!configured && (
        <Alert>
          <AlertTitle>Pourquoi pas de compte ?</AlertTitle>
          <AlertDescription>
            Ce déploiement n’est pas relié à Supabase : les comptes sont désactivés. Pour activer la
            création de compte et la synchronisation entre appareils, configurez les variables
            d’environnement décrites dans{" "}
            <code className="font-mono text-xs">docs/DEPLOY.md</code>.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
