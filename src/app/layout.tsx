import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import CookieBanner from "@/components/CookieBanner";
import { PageTransition } from "@/components/PageTransition";
import { VerifyDialog } from "@/components/VerifyDialog";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/MicrosoftClarity";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

// Single font family — Cairo covers both Arabic and Latin scripts with 3 weights.
// Barlow Condensed and Instrument Sans were dropped (only used in unused
// FuturisticHero component) — saves ~9 woff2 requests, ~200ms FCP on mobile.
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "700", "900"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com"),
  title: {
    default: "Udarsy — منصة التعلم المغربية",
    template: "%s | Udarsy",
  },
  description:
    "يودرسي — دروس مجانية، تمارين تفاعلية وامتحانات نموذجية وفق المنهج المغربي. للتلاميذ من الابتدائي إلى الباكالوريا في المغرب.",
  keywords: [
    "udarsy", "يودرسي", "درسي", "تعلم", "المغرب", "باكالوريا", "بريفي",
    "bac maroc", "cours maroc", "éducation maroc", "brevet maroc",
    "lycée maroc", "darija school", "تعليم مغربي", "دروس مغربية",
  ],
  authors: [{ name: "Udarsy" }],
  creator: "Udarsy",
  openGraph: {
    type: "website",
    locale: "ar_MA",
    alternateLocale: ["fr_MA", "en_US"],
    url: "/",
    siteName: "Udarsy",
    title: "Udarsy — منصة التعلم المغربية",
    description:
      "يودرسي — دروس مجانية، تمارين تفاعلية وامتحانات نموذجية وفق المنهج المغربي. للتلاميذ من الابتدائي إلى الباكالوريا في المغرب.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Udarsy — منصة التعلم المغربية",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Udarsy — منصة التعلم المغربية",
    description:
      "يودرسي — دروس مجانية، تمارين تفاعلية وامتحانات نموذجية وفق المنهج المغربي. للتلاميذ من الابتدائي إلى الباكالوريا في المغرب.",
    images: ["/og-image.png"],
    creator: "@UdarsyMa",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        {/* Preconnect to the R2 image origin so the hero card images don't pay
            DNS+TCP+TLS RTT before the first byte. Saves ~300ms LCP on mobile. */}
        <link rel="preconnect" href="https://files.udarsy.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://files.udarsy.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "EducationalOrganization",
                  "@id": "https://www.udarsy.com/#organization",
                  "name": "Udarsy",
                  "alternateName": ["يودرسي", "Udarsy Maroc"],
                  "url": "https://www.udarsy.com",
                  "logo": {
                    "@type": "ImageObject",
                    "@id": "https://www.udarsy.com/#logo",
                    "url": "https://www.udarsy.com/og-image.png",
                    "caption": "Udarsy — منصة التعلم المغربية",
                  },
                  "image": { "@id": "https://www.udarsy.com/#logo" },
                  "description": "Morocco's free educational platform for BAC and Brevet preparation. Provides lessons, interactive exercises, and model exams aligned with the Moroccan national curriculum.",
                  "foundingDate": "2021",
                  "areaServed": { "@type": "Country", "name": "Morocco" },
                  "addressCountry": "MA",
                  "inLanguage": ["ar", "fr", "en"],
                  "audience": {
                    "@type": "EducationalAudience",
                    "educationalRole": "student",
                  },
                  "knowsAbout": [
                    "BAC preparation Morocco",
                    "Brevet preparation Morocco",
                    "Moroccan national curriculum",
                    "Mathematics BAC Maroc",
                    "Physics Chemistry Morocco",
                    "Arabic language education Morocco",
                    "lycée marocain",
                    "préparation baccalauréat Maroc",
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+212642094671",
                    "email": "contact@udarsy.com",
                    "contactType": "customer support",
                    "areaServed": "MA",
                  },
                  "sameAs": ["https://twitter.com/UdarsyMa"],
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.udarsy.com/#website",
                  "url": "https://www.udarsy.com",
                  "name": "Udarsy",
                  "description": "Morocco's educational platform for BAC and Brevet preparation",
                  "publisher": { "@id": "https://www.udarsy.com/#organization" },
                  "inLanguage": ["ar", "fr", "en"],
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://www.udarsy.com/courses?q={search_term_string}",
                    },
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "WebPage",
                  "@id": "https://www.udarsy.com/#webpage",
                  "url": "https://www.udarsy.com",
                  "name": "Udarsy — منصة التعلم المغربية",
                  "description": "يودرسي — دروس مجانية، تمارين تفاعلية وامتحانات نموذجية وفق المنهج المغربي. للتلاميذ من الابتدائي إلى الباكالوريا في المغرب.",
                  "isPartOf": { "@id": "https://www.udarsy.com/#website" },
                  "about": { "@id": "https://www.udarsy.com/#organization" },
                  "inLanguage": ["ar", "fr", "en"],
                  "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                      { "@type": "ListItem", "position": 1, "name": "Udarsy", "item": "https://www.udarsy.com" },
                    ],
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${cairo.variable} font-cairo antialiased`} suppressHydrationWarning>
        {/* Google Analytics 4 — script injected after interactive, won't block render */}
        <GoogleAnalytics />
        <MicrosoftClarity />
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
              <SnackbarProvider>
                {/* AnalyticsProvider: activates page-view + scroll-depth + referral tracking */}
                <AnalyticsProvider>
                  <Navbar />
                  <main><PageTransition>{children}</PageTransition></main>
                  <LanguageSwitcher />
                  <Footer />
                  <CookieBanner />
                  <VerifyDialog />
                </AnalyticsProvider>
              </SnackbarProvider>
            </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
