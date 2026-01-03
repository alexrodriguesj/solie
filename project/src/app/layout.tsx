import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-Q70R77702S";

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
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
