import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Solie Pilates | Studio de Pilates Personalizado",
  description:
    "Transforme seu corpo e mente com Pilates. Atendimento personalizado em um ambiente acolhedor e exclusivo. Agende sua aula experimental.",
  keywords: [
    "pilates",
    "studio pilates",
    "pilates personalizado",
    "aula pilates",
    "pilates para dor",
    "pilates postura",
  ],
  openGraph: {
    title: "Solie Pilates | Studio de Pilates Personalizado",
    description:
      "Transforme seu corpo e mente com Pilates. Atendimento personalizado em um ambiente acolhedor e exclusivo.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
