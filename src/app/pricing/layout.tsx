import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

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

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
