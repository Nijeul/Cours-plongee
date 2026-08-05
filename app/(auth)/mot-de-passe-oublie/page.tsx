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

export default function MotDePasseOubliePage() {
  const configured = isSupabaseConfigured();

  const [email, setEmail] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  async function handleReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) return;

    setPending(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reinitialiser`,
    });

    setPending(false);

    if (resetError) {
      setError(translateAuthError(resetError.message));
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="flex flex-col gap-4">
      {!configured && <GuestModeAlert />}

      <Card>
        <CardHeader>
          <CardTitle>Mot de passe oublié</CardTitle>
          <CardDescription>
            Indiquez votre adresse email : nous vous enverrons un lien pour définir un nouveau mot
            de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert>
              <AlertTitle>Email envoyé</AlertTitle>
              <AlertDescription>
                Si un compte existe pour {email}, un email de réinitialisation vient de lui être
                envoyé. Ouvrez le lien qu’il contient pour choisir un nouveau mot de passe.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Envoi impossible</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
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

              <Button type="submit" disabled={!configured || pending} className="w-full">
                {pending ? "Envoi en cours…" : "Envoyer le lien de réinitialisation"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground text-sm">
            <Link href="/connexion" className="text-foreground underline underline-offset-4">
              Retour à la connexion
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
