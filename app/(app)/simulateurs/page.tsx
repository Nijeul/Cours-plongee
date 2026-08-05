import type { Metadata } from "next";

import {
  SimAutonomie,
  SimDesaturation,
  SimGenerateur,
  SimLoisPhysiques,
  SimTables,
} from "@/components/simulators";
import { DISCLAIMER } from "@/content/data/reglementation";

export const metadata: Metadata = {
  title: "Simulateurs",
  description:
    "Cinq outils interactifs pour s'approprier la théorie de la plongée : tables MN90, autonomie en air, lois physiques en direct, modèle de Haldane et exercices paramétriques générés à l'infini.",
};

const SECTIONS = [
  { id: "tables", label: "Tables MN90" },
  { id: "autonomie", label: "Autonomie en air" },
  { id: "lois-physiques", label: "Lois physiques" },
  { id: "desaturation", label: "Désaturation" },
  { id: "exercices", label: "Exercices paramétriques" },
] as const;

export default function SimulateursPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Simulateurs</h1>
        <p className="text-muted-foreground mt-2 leading-relaxed">
          Manipulez les notions au lieu de les apprendre par c&oelig;ur : cinq outils
          interactifs branchés sur le moteur de calcul de l&apos;application, du N1 au MF1.
        </p>
        <nav aria-label="Sommaire des simulateurs" className="mt-4">
          <ul className="flex flex-wrap gap-2">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="space-y-10">
        <section id="tables" aria-labelledby="tables-titre" className="scroll-mt-24">
          <h2 id="tables-titre" className="mb-1 text-xl font-semibold">
            Tables MN90
          </h2>
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
            Paliers, groupe de plongée successive et durée totale de remontée d&apos;une
            plongée simple, puis azote résiduel et majoration d&apos;une plongée successive.
          </p>
          <SimTables />
        </section>

        <section id="autonomie" aria-labelledby="autonomie-titre" className="scroll-mt-24">
          <h2 id="autonomie-titre" className="mb-1 text-xl font-semibold">
            Autonomie en air
          </h2>
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
            Bloc, pression, réserve, consommation, profondeur : le calcul complet de
            l&apos;autonomie, avec chaque étape détaillée comme à l&apos;examen.
          </p>
          <SimAutonomie />
        </section>

        <section
          id="lois-physiques"
          aria-labelledby="lois-physiques-titre"
          className="scroll-mt-24"
        >
          <h2 id="lois-physiques-titre" className="mb-1 text-xl font-semibold">
            Lois physiques en direct
          </h2>
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
            Un seul curseur de profondeur pour voir Boyle-Mariotte, Dalton et Archimède
            agir en même temps, de 0 à 60 m.
          </p>
          <SimLoisPhysiques />
        </section>

        <section id="desaturation" aria-labelledby="desaturation-titre" className="scroll-mt-24">
          <h2 id="desaturation-titre" className="mb-1 text-xl font-semibold">
            Désaturation — modèle de Haldane
          </h2>
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
            Pour les candidats N4 et MF1 : la charge et la décharge en azote des
            compartiments théoriques, et la notion de compartiment directeur.
          </p>
          <SimDesaturation />
        </section>

        <section id="exercices" aria-labelledby="exercices-titre" className="scroll-mt-24">
          <h2 id="exercices-titre" className="mb-1 text-xl font-semibold">
            Exercices paramétriques
          </h2>
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
            Des énoncés tirés au sort avec corrigé pas à pas : pression absolue, Mariotte,
            Dalton, Archimède, autonomie, tables MN90…
          </p>
          <SimGenerateur />
        </section>
      </div>

      <p className="text-muted-foreground mt-10 border-t pt-4 text-xs leading-relaxed">
        {DISCLAIMER}
      </p>
    </div>
  );
}
