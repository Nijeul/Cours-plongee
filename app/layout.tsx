import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PwaRegister } from "@/components/pwa-register";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Théorie Plongée — Réviser la théorie de la plongée du N1 au MF1",
    template: "%s — Théorie Plongée",
  },
  description:
    "Cours structurés, entraînement corrigé, révision espacée et examens blancs pour préparer la théorie des niveaux de plongée FFESSM : N1, N2, N3, N4/GP et MF1.",
  applicationName: "Théorie Plongée",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icons/app-icon.svg" },
  keywords: [
    "plongée",
    "théorie plongée",
    "FFESSM",
    "niveau 1",
    "niveau 2",
    "niveau 3",
    "niveau 4",
    "guide de palanquée",
    "MF1",
    "tables MN90",
    "examen blanc plongée",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0e4a6b" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

/**
 * Applique la classe .dark selon prefers-color-scheme, avant le premier rendu
 * (pas de flash) et en direct si l'utilisateur change le réglage système.
 */
const themeScript = `(function(){try{var m=window.matchMedia("(prefers-color-scheme: dark)");var a=function(){document.documentElement.classList.toggle("dark",m.matches)};a();m.addEventListener("change",a)}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
        <Toaster />
        <PwaRegister />
      </body>
    </html>
  );
}
