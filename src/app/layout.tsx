import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import "../styles/pickers.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { SnackbarProvider } from "@/contexts/SnackbarContext";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import CookieBanner from "@/components/CookieBanner";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PageTransition } from "@/components/PageTransition";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap", // Prevent FOIT — show fallback font immediately
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://udarsy.ma"),
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {process.env.NEXT_PUBLIC_BACKEND_URL && (
          <link rel="preconnect" href={process.env.NEXT_PUBLIC_BACKEND_URL} crossOrigin="anonymous" />
        )}
      </head>
      <body className={`${cairo.variable} font-cairo antialiased`} suppressHydrationWarning>
        {/* Google Analytics 4 — script injected after interactive, won't block render */}
        <GoogleAnalytics />
        <NextIntlClientProvider messages={messages}>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'placeholder-client-id'}>
            <AuthProvider>
              <SnackbarProvider>
                {/* AnalyticsProvider: activates page-view + scroll-depth + referral tracking */}
                <AnalyticsProvider>
                  <Navbar />
                  <main><PageTransition>{children}</PageTransition></main>
                  <LanguageSwitcher />
                  <Footer />
                  <CookieBanner />
                </AnalyticsProvider>
              </SnackbarProvider>
            </AuthProvider>
          </GoogleOAuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
