import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "تواصل معنا", fr: "Contact", en: "Contact" }),
    description:
      "تواصل مع فريق يودرسي — أسئلة، اقتراحات أو شراكات.",
    openGraph: {
      title: "تواصل معنا | Udarsy",
      description: "تواصل مع فريق يودرسي — أسئلة، اقتراحات أو شراكات.",
      type: "website",
      url: "/contact",
    },
    twitter: {
      card: "summary",
      title: "تواصل معنا | Udarsy",
      description: "تواصل مع فريق يودرسي.",
    },
    alternates: { canonical: "/contact" },
  };
}

// ContactPage marks the URL as the canonical contact surface — Google uses
// it to seed the Knowledge Panel "Contact" action. The embedded
// ContactPoint duplicates the phone/email already on the root Organization
// node but with a page-specific @id so this page can be referenced
// independently from snippets.
const contactSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${SITE_URL}/contact#contactpage`,
      url: `${SITE_URL}/contact`,
      name: "Contact Udarsy",
      description: "Reach the Udarsy team — questions, partnerships, support requests.",
      inLanguage: ["fr", "ar", "en"],
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "ContactPoint",
      "@id": `${SITE_URL}/contact#point`,
      contactType: "customer support",
      telephone: "+212642094671",
      email: "contact@udarsy.com",
      availableLanguage: ["French", "Arabic", "English"],
      areaServed: { "@type": "Country", name: "Morocco" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Contact", item: `${SITE_URL}/contact` },
      ],
    },
  ],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      {children}
    </>
  );
}
