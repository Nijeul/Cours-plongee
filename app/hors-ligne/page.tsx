import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hors ligne",
};

export default function HorsLignePage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <svg
        viewBox="0 0 24 24"
        className="text-muted-foreground size-12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden
      >
        <path d="M2 12c3-2.5 5-2.5 8 0s5 2.5 8 0" strokeLinecap="round" />
        <path d="M2 17c3-2.5 5-2.5 8 0s5 2.5 8 0" strokeLinecap="round" />
        <path d="M4 4l16 16" strokeLinecap="round" />
      </svg>
      <h1 className="text-2xl font-bold tracking-tight">Vous êtes hors ligne</h1>
      <p className="text-muted-foreground">
        Cette page n&apos;est pas encore disponible hors connexion. Les cours que vous avez déjà
        consultés restent accessibles : retournez à l&apos;accueil ou rouvrez un module récent.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2 inline-flex h-10 items-center justify-center rounded-md px-6 text-sm font-medium"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
