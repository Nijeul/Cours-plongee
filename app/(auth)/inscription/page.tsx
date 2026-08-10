"use client";

import * as React from "react";
import Link from "next/link";

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

export default function InscriptionPage() {
  const configured = isSupabaseConfigured();

  const [displayName, setDisplayName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) return;

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setPending(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        data: displayName.trim() ? { display_name: displayName.trim() } : undefined,
      },
    });

    setPending(false);

    if (signUpError) {
      setError(translateAuthError(signUpError.message));
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="flex flex-col gap-4">
      {!configured && <GuestModeAlert />}

      <Card>
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>
            Gratuit : votre progression, vos notes et vos révisions synchronisées entre appareils.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert>
              <AlertTitle>Vérifiez votre boîte mail</AlertTitle>
              <AlertDescription>
                Un email de confirmation vient d’être envoyé à {email}. Cliquez sur le lien qu’il
                contient pour activer votre compte, puis connectez-vous.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Inscription impossible</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="displayName">Nom affiché (facultatif)</Label>
                <Input
                  id="displayName"
                  type="text"
                  autoComplete="name"
                  maxLength={60}
                  disabled={!configured || pending}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Jacques M."
                />
              </div>

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
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  disabled={!configured || pending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-muted-foreground text-xs">Au moins 8 caractères.</p>
              </div>

              <Button type="submit" disabled={!configured || pending} className="w-full">
                {pending ? "Création du compte…" : "Créer mon compte"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            Déjà inscrit ?{" "}
            <Link href="/connexion" className="text-foreground underline underline-offset-4">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
