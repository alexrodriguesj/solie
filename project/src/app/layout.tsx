import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-Q70R77702S";
const META_PIXEL_ID = "1980494209179394";
const GTM_ID = "GTM-KVQ5FZCK";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://soliepilates.com.br"),
  title: "Soliê Pilates | Pilates no Água Verde, Curitiba",
  description:
    "Studio de Pilates com fisioterapeutas no Água Verde, Curitiba. Atendimento individual, máximo 2 alunos por aula. Agende sua aula experimental gratuita.",
  keywords: [
    "pilates água verde",
    "pilates curitiba",
    "studio de pilates curitiba",
    "pilates com fisioterapeuta",
    "pilates para dor na coluna",
    "pilates para postura",
    "pilates individual curitiba",
    "pilates para gestantes curitiba",
    "pilates para hérnia de disco",
    "aula de pilates perto de mim",
  ],
  openGraph: {
    title: "Soliê Pilates | Pilates no Água Verde, Curitiba",
    description:
      "Studio de Pilates com fisioterapeutas no Água Verde, Curitiba. Atendimento individual, máximo 2 alunos por aula. Agende sua aula experimental gratuita.",
    type: "website",
    locale: "pt_BR",
    siteName: "Soliê Pilates",
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
        {/* Google Tag Manager */}
        <Script
          id="gtm-head"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HealthAndBeautyBusiness",
              name: "Soliê Pilates",
              description:
                "Studio de Pilates com fisioterapeutas no Água Verde, Curitiba. Atendimento individual, máximo 2 alunos por aula.",
              url: "https://soliepilates.com.br",
              telephone: "+5541999047534",
              email: "contato@soliepilates.com.br",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Av. Rep. Argentina, 1237 - Sala 610",
                addressLocality: "Curitiba",
                addressRegion: "PR",
                postalCode: "80620-010",
                addressCountry: "BR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: -25.4576109,
                longitude: -49.2882227,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
                  opens: "07:00",
                  closes: "21:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Friday",
                  opens: "07:00",
                  closes: "19:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: "Saturday",
                  opens: "08:00",
                  closes: "12:00",
                },
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5.0",
                reviewCount: "37",
                bestRating: "5",
              },
              priceRange: "$$",
              image: "https://soliepilates.com.br/images/hero-1.jpg",
              sameAs: [
                "https://instagram.com/soliepilates",
                "https://facebook.com/soliepilates",
              ],
            }),
          }}
        />
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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
