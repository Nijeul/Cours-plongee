"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { CircleUserRound, LayoutDashboard, LogOut, UserRound } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Menu utilisateur du header :
 * - Supabase non configuré → bouton discret « Mode invité » vers /profil ;
 * - configuré, déconnecté → bouton « Connexion » ;
 * - connecté → menu déroulant (profil, tableau de bord, déconnexion).
 */
export function UserMenu() {
  const router = useRouter();
  const configured = isSupabaseConfigured();

  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(configured);

  React.useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) {
        setUser(data.session?.user ?? null);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!configured) {
    return (
      <Button variant="ghost" size="sm" asChild>
        <Link href="/profil">
          <CircleUserRound />
          <span className="hidden sm:inline">Mode invité</span>
        </Link>
      </Button>
    );
  }

  if (loading) {
    return (
      <div
        className="bg-muted size-8 animate-pulse rounded-full"
        aria-hidden="true"
        data-testid="user-menu-loading"
      />
    );
  }

  if (!user) {
    return (
      <Button size="sm" asChild>
        <Link href="/connexion">Connexion</Link>
      </Button>
    );
  }

  const email = user.email ?? "";
  const initial = email.charAt(0).toUpperCase() || "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Ouvrir le menu utilisateur"
          className="focus-visible:ring-ring/50 rounded-full outline-none focus-visible:ring-[3px]"
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {initial}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuLabel className="truncate font-normal">
          <span className="text-muted-foreground text-xs">Connecté en tant que</span>
          <br />
          <span className="truncate text-sm font-medium">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profil">
            <UserRound />
            Profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboard />
            Tableau de bord
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSignOut}>
          <LogOut />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
