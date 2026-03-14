import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fatec Finanças",
  description: "Dashboard moderna de finanças pessoais com dados mockados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
