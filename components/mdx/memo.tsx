"use client";

import * as React from "react";
import { BookMarked, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Fiche mémo imprimable insérée dans le MDX des cours via `<Memo>`.
 *
 * Au clic sur « Imprimer / PDF », une classe est ajoutée sur `<body>` :
 * les règles `@media print` ci-dessous masquent alors tout le reste de la
 * page et n&apos;impriment que la fiche. La classe est retirée après impression
 * (événement `afterprint`, avec un filet de sécurité par temporisation).
 */

const PRINT_CLASS = "memo-printing";

const PRINT_STYLES = `
@media print {
  body.${PRINT_CLASS} * {
    visibility: hidden;
  }
  body.${PRINT_CLASS} #memo-print,
  body.${PRINT_CLASS} #memo-print * {
    visibility: visible;
  }
  body.${PRINT_CLASS} #memo-print {
    position: absolute;
    inset: 0 auto auto 0;
    width: 100%;
    margin: 0;
    border: 1px solid #000;
    box-shadow: none;
    background: #fff;
    color: #000;
  }
}
`;

interface MemoProps {
  children?: React.ReactNode;
}

export function Memo({ children }: MemoProps) {
  const handlePrint = React.useCallback(() => {
    const body = document.body;
    body.classList.add(PRINT_CLASS);

    const cleanup = () => {
      body.classList.remove(PRINT_CLASS);
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);

    try {
      window.print();
    } finally {
      // Filet de sécurité si `afterprint` n'est pas émis (certains mobiles).
      window.setTimeout(cleanup, 2000);
    }
  }, []);

  return (
    <section
      id="memo-print"
      aria-label="Fiche mémo"
      className="border-primary/60 bg-card my-8 rounded-xl border-2 shadow-sm print:block"
    >
      <style dangerouslySetInnerHTML={{ __html: PRINT_STYLES }} />
      <header className="border-primary/30 flex flex-wrap items-center justify-between gap-2 border-b border-dashed px-4 py-3">
        <p className="text-primary flex items-center gap-2 text-sm font-bold tracking-tight uppercase">
          <BookMarked aria-hidden="true" className="size-4 shrink-0" />
          Fiche mémo
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePrint}
          className="print:hidden"
        >
          <Printer aria-hidden="true" className="size-4" />
          Imprimer / PDF
        </Button>
      </header>
      <div className="px-4 py-4 text-sm leading-6 [&_p]:mt-0 [&_p+p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3:first-child]:mt-0 [&_table]:mt-2 [&_table]:w-full [&_table]:text-xs [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_td]:border [&_td]:px-2 [&_td]:py-1">
        {children}
      </div>
    </section>
  );
}
