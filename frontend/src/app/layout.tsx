import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vachan",
  description: "Learn India's languages. One word at a time.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
