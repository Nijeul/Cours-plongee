import type { Metadata } from "next";

import { RevisionView } from "@/components/dashboard/revision-view";
import { DISCLAIMER } from "@/content/data/reglementation";
import { loadAllQuestions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Révision espacée",
  description:
    "Révisez au bon moment : les questions ratées reviennent automatiquement à J+1, J+3, J+7, J+16 puis J+35 pour ancrer la théorie à long terme.",
};

export default function RevisionPage() {
  const questions = loadAllQuestions();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Révision espacée</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          Répondez à la question, vérifiez la correction, puis évaluez honnêtement votre mémoire :
          l&apos;algorithme programme la prochaine échéance de chaque carte.
        </p>
      </header>
      <RevisionView questions={questions} />
      <p className="text-muted-foreground mt-10 border-t pt-4 text-xs leading-relaxed">
        {DISCLAIMER}
      </p>
    </div>
  );
}
