import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portaria San Marino",
  description: "Sistema de controle de visitantes e entregas - Condomínio San Marino",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
