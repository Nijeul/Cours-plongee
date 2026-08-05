"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { translateAuthError } from "@/components/auth/auth-errors";
import { GuestModeAlert } from "@/components/auth/guest-mode-alert";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function ConnexionPage() {
  return (
    <React.Suspense fallback={null}>
      <ConnexionForm />
    </React.Suspense>
  );
}

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const configured = isSupabaseConfigured();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);

  // Erreur transmise par /auth/callback (lien expiré ou invalide).
  const callbackError =
    searchParams.get("erreur") === "lien-invalide"
      ? "Le lien de connexion est invalide ou a expiré. Demandez un nouveau lien ou connectez-vous avec votre mot de passe."
      : null;
  const displayedError = error ?? callbackError;

  async function handlePasswordSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) return;

    setPending(true);
    setError(null);
    setInfo(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(translateAuthError(signInError.message));
      setPending(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleMagicLink() {
    const supabase = createClient();
    if (!supabase) return;
    if (!email) {
      setError("Saisissez d'abord votre adresse email pour recevoir un lien magique.");
      return;
    }

    setPending(true);
    setError(null);
    setInfo(null);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    setPending(false);

    if (otpError) {
      setError(translateAuthError(otpError.message));
      return;
    }

    setInfo(
      "Lien magique envoyé ! Consultez votre boîte de réception et cliquez sur le lien pour vous connecter."
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {!configured && <GuestModeAlert />}

      <Card>
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Accédez à votre compte pour retrouver votre progression sur tous vos appareils.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSignIn} className="flex flex-col gap-4">
            {displayedError && (
              <Alert variant="destructive">
                <AlertTitle>Connexion impossible</AlertTitle>
                <AlertDescription>{displayedError}</AlertDescription>
              </Alert>
            )}
            {info && (
              <Alert>
                <AlertTitle>Email envoyé</AlertTitle>
                <AlertDescription>{info}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                disabled={!configured || pending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.fr"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link
                  href="/mot-de-passe-oublie"
                  className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={!configured || pending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={!configured || pending} className="w-full">
              {pending ? "Connexion en cours…" : "Se connecter"}
            </Button>

            <div className="text-muted-foreground flex items-center gap-3 text-xs">
              <span className="bg-border h-px flex-1" aria-hidden="true" />
              ou
              <span className="bg-border h-px flex-1" aria-hidden="true" />
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={!configured || pending}
              onClick={handleMagicLink}
              className="w-full"
            >
              Recevoir un lien magique par email
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-foreground underline underline-offset-4">
              Créer un compte
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
