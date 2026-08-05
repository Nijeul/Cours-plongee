"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { translateAuthError } from "@/components/auth/auth-errors";
import { GuestModeAlert } from "@/components/auth/guest-mode-alert";
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
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function ReinitialiserPage() {
  const router = useRouter();
  const configured = isSupabaseConfigured();

  const [hasSession, setHasSession] = React.useState<boolean | null>(configured ? null : false);
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setHasSession(Boolean(data.session));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpdatePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    if (!supabase) return;

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setPending(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setPending(false);

    if (updateError) {
      setError(translateAuthError(updateError.message));
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1500);
  }

  const formDisabled = !configured || pending || hasSession === false;

  return (
    <div className="flex flex-col gap-4">
      {!configured && <GuestModeAlert />}

      <Card>
        <CardHeader>
          <CardTitle>Nouveau mot de passe</CardTitle>
          <CardDescription>Choisissez un nouveau mot de passe pour votre compte.</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert>
              <AlertTitle>Mot de passe mis à jour</AlertTitle>
              <AlertDescription>
                Votre mot de passe a bien été modifié. Redirection vers votre tableau de bord…
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
              {configured && hasSession === false && (
                <Alert variant="destructive">
                  <AlertTitle>Lien invalide ou expiré</AlertTitle>
                  <AlertDescription>
                    Aucune session active. Ouvrez le lien reçu par email, ou{" "}
                    <Link href="/mot-de-passe-oublie" className="underline underline-offset-4">
                      demandez un nouveau lien de réinitialisation
                    </Link>
                    .
                  </AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Modification impossible</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={formDisabled}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-muted-foreground text-xs">Au moins 6 caractères.</p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirm">Confirmer le mot de passe</Label>
                <Input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  disabled={formDisabled}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={formDisabled} className="w-full">
                {pending ? "Enregistrement…" : "Enregistrer le nouveau mot de passe"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
