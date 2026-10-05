import type { Metadata, Viewport } from "next";
// Self-hosted fonts (no network needed at build time).
// Nunito = Latin body text. Baloo family = headings + the six Indian scripts.
import "@fontsource-variable/nunito";
import "@fontsource-variable/baloo-2"; // Devanagari (Hindi) + Latin
import "@fontsource-variable/baloo-tammudu-2"; // Telugu
import "@fontsource-variable/baloo-thambi-2"; // Tamil
import "@fontsource-variable/baloo-chettan-2"; // Malayalam
import "@fontsource-variable/baloo-tamma-2"; // Kannada
import "@fontsource-variable/baloo-da-2"; // Bengali
import "./globals.css";
import { SessionProvider } from "@/components/session/session-provider";
import { StatsProvider } from "@/components/session/stats-provider";

export const metadata: Metadata = {
  title: {
    default: "Vachan — Learn India's languages",
    template: "%s · Vachan",
  },
  description:
    "Learn Hindi, Telugu, Tamil, Malayalam, Kannada and Bengali with short, game-like lessons. One word at a time.",
};

export const viewport: Viewport = {
  themeColor: "#5a3be0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <SessionProvider>
          <StatsProvider>{children}</StatsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
