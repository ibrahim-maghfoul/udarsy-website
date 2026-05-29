import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "الأسعار", fr: "Tarifs", en: "Pricing" }),
    description:
      "اشترك في يودرسي بدءاً من 199 درهم/شهر — خطط مجانية ومدفوعة للتلاميذ المغاربة.",
    openGraph: {
      title: "الأسعار | Udarsy",
      description: "اشترك في يودرسي بدءاً من 199 درهم/شهر — خطط مجانية ومدفوعة.",
      type: "website",
      url: "/pricing",
    },
    twitter: {
      card: "summary",
      title: "الأسعار | Udarsy",
      description: "اشترك في يودرسي بدءاً من 199 درهم/شهر.",
    },
    alternates: { canonical: "/pricing" },
  };
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Puis-je annuler à tout moment ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vous ne payez que pour le mois ou l'année que vous souhaitez souscrire — sans contrat, sans frais surprises.",
      },
    },
    {
      "@type": "Question",
      name: "Y a-t-il un essai gratuit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui ! Notre forfait Gratuit l'est pour toujours. Vous pouvez aussi essayer les fonctionnalités Pro avec plus d'avantages — aucune carte de crédit requise.",
      },
    },
    {
      "@type": "Question",
      name: "Quels modes de paiement acceptez-vous ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nous acceptons les virements bancaires via BANQUE POPULAIRE. Contactez-nous sur WhatsApp après votre virement pour activer votre abonnement.",
      },
    },
    {
      "@type": "Question",
      name: "Puis-je changer de forfait ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, vous pouvez changer de forfait à tout moment. Les changements prennent effet immédiatement. Vous ne payez que la différence.",
      },
    },
    {
      "@type": "Question",
      name: "Combien coûte l'abonnement Udarsy Pro ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'abonnement Pro coûte 199 MAD par mois ou 1 910 MAD par an. Il inclut un accès illimité aux cours, 30 explications IA par jour et aucune publicité.",
      },
    },
    {
      "@type": "Question",
      name: "Combien coûte l'abonnement Udarsy Premium ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'abonnement Premium coûte 299 MAD par mois ou 2 870 MAD par an. Il inclut tout le forfait Pro plus 2 heures de sessions en face-à-face avec un instructeur et un mentorat personnalisé.",
      },
    },
  ],
};

// Product/Offer for each paid plan plus an Offer for the free tier. Prices
// + cycles are hardcoded here to match src/app/pricing/page.tsx; keep them
// in sync when prices change. Currency is MAD (Moroccan Dirham). Free plan
// is modeled as a single Offer with price=0 + priceCurrency=MAD to satisfy
// schema.org's requirement that price be a numeric value.
const proMonthly = 199;
const proYearly = 1910;
const premiumMonthly = 299;
const premiumYearly = 2870;

const productsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      "@id": `${SITE_URL}/pricing#free`,
      name: "Udarsy Free",
      description: "Forfait gratuit Udarsy — accès aux leçons essentielles, 10 téléchargements hors ligne, sans carte de crédit.",
      brand: { "@id": `${SITE_URL}/#organization` },
      category: "EducationApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "MAD",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/pricing`,
        seller: { "@id": `${SITE_URL}/#organization` },
      },
    },
    {
      "@type": "Product",
      "@id": `${SITE_URL}/pricing#pro`,
      name: "Udarsy Pro",
      description: "Abonnement Pro Udarsy — accès illimité aux cours, 30 explications IA par jour, sans publicité.",
      brand: { "@id": `${SITE_URL}/#organization` },
      category: "EducationApplication",
      offers: [
        {
          "@type": "Offer",
          name: "Mensuel",
          price: String(proMonthly),
          priceCurrency: "MAD",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/pricing`,
          seller: { "@id": `${SITE_URL}/#organization` },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: proMonthly,
            priceCurrency: "MAD",
            billingDuration: "P1M",
            unitText: "month",
          },
        },
        {
          "@type": "Offer",
          name: "Annuel",
          price: String(proYearly),
          priceCurrency: "MAD",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/pricing`,
          seller: { "@id": `${SITE_URL}/#organization` },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: proYearly,
            priceCurrency: "MAD",
            billingDuration: "P1Y",
            unitText: "year",
          },
        },
      ],
    },
    {
      "@type": "Product",
      "@id": `${SITE_URL}/pricing#premium`,
      name: "Udarsy Premium",
      description: "Abonnement Premium Udarsy — tout Pro plus 2 heures de sessions en face-à-face avec un instructeur et mentorat personnalisé.",
      brand: { "@id": `${SITE_URL}/#organization` },
      category: "EducationApplication",
      offers: [
        {
          "@type": "Offer",
          name: "Mensuel",
          price: String(premiumMonthly),
          priceCurrency: "MAD",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/pricing`,
          seller: { "@id": `${SITE_URL}/#organization` },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: premiumMonthly,
            priceCurrency: "MAD",
            billingDuration: "P1M",
            unitText: "month",
          },
        },
        {
          "@type": "Offer",
          name: "Annuel",
          price: String(premiumYearly),
          priceCurrency: "MAD",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/pricing`,
          seller: { "@id": `${SITE_URL}/#organization` },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: premiumYearly,
            priceCurrency: "MAD",
            billingDuration: "P1Y",
            unitText: "year",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Pricing", item: `${SITE_URL}/pricing` },
      ],
    },
  ],
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }}
      />
      {children}
    </>
  );
}
