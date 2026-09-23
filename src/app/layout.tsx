import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IA Seguros Portal",
  description:
    "Notícias de Inteligência Artificial no setor de seguros no Brasil e no mundo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
