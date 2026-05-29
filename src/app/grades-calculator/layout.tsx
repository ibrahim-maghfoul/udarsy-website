import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { pageTitle } from "@/lib/page-title";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  // Locale-targeted descriptions widen the keyword surface beyond Arabic.
  // FR is the largest organic-search audience for "calculateur de moyenne bac".
  const descriptions: Record<string, string> = {
    fr: "Calculez votre moyenne du Baccalauréat ou du Brevet marocain en ligne, gratuitement. Entrez vos notes et coefficients — obtenez instantanément votre moyenne et votre mention.",
    ar: "احسب معدلك في الباكالوريا أو البريفي المغربي عبر الإنترنت مجاناً. أدخل نقاطك ومعاملاتك واحصل فوراً على معدلك وميزتك.",
    en: "Calculate your Moroccan BAC or Brevet grade average online, for free. Enter your marks and coefficients — get your average and honors mention instantly.",
  };
  const description = descriptions[locale] || descriptions.fr;
  const url = `${SITE_URL}/grades-calculator`;

  return {
    title: await pageTitle({
      ar: "حاسبة معدل الباكالوريا والبريفي",
      fr: "Calculateur de Moyenne BAC & Brevet Maroc",
      en: "Moroccan BAC & Brevet Grade Calculator",
    }),
    description,
    openGraph: {
      title: "Calculateur de Moyenne BAC & Brevet Maroc | Udarsy",
      description,
      type: "website",
      url,
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: "Calculateur de moyenne Udarsy" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Calculateur de Moyenne BAC & Brevet Maroc | Udarsy",
      description,
    },
    alternates: {
      canonical: url,
      languages: { fr: url, ar: url, en: url, "x-default": url },
    },
  };
}

// SoftwareApplication schema: tells Google this is a free tool, eligible for
// rich tool snippets. HowTo schema documents the 3-step usage and is eligible
// for step-by-step rich results on calculator queries.
const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/grades-calculator#app`,
  name: "Udarsy — Calculateur de Moyenne BAC & Brevet Maroc",
  applicationCategory: "EducationApplication",
  operatingSystem: "Web",
  url: `${SITE_URL}/grades-calculator`,
  inLanguage: ["fr", "ar", "en"],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "MAD",
    availability: "https://schema.org/InStock",
  },
  audience: {
    "@type": "EducationalAudience",
    educationalRole: "student",
    geographicArea: { "@type": "Country", name: "Morocco" },
  },
  provider: { "@id": `${SITE_URL}/#organization` },
  description: "Outil gratuit pour calculer la moyenne du Baccalauréat ou du Brevet marocain à partir de notes et coefficients par matière.",
  featureList: [
    "Calcul de la moyenne par matière avec coefficients",
    "Plusieurs examens par matière (contrôle continu + examen national)",
    "Sauvegarde locale des notes saisies",
    "Aligné sur le système de notation marocain (sur 20)",
    "Conversion automatique en mention (Très Bien, Bien, Assez Bien, Passable)",
  ],
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${SITE_URL}/grades-calculator#howto`,
  name: "Comment calculer sa moyenne BAC ou Brevet au Maroc",
  description: "Étapes pour calculer votre moyenne avec le calculateur Udarsy.",
  totalTime: "PT2M",
  inLanguage: "fr",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Ajouter vos matières",
      text: "Entrez le nom de chaque matière et son coefficient (par exemple : Mathématiques, coefficient 9 pour les Sciences Maths).",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Saisir vos notes",
      text: "Ajoutez vos notes obtenues pour chaque examen de la matière. Le calculateur accepte plusieurs examens par matière.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Lire votre moyenne",
      text: "Le calculateur affiche votre moyenne par matière, votre moyenne générale pondérée par coefficient, et la mention correspondante.",
    },
  ],
};

export default function GradesCalculatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {children}
    </>
  );
}