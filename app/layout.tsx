import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Providers from "@/src/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mente Aberta — Apoio Psicológico Gratuito e Anônimo",
  description:
    "Plataforma gratuita e anônima de apoio psicológico. Conectamos você a psicólogos voluntários para conversas seguras e confidenciais.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
