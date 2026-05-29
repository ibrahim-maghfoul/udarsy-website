import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "من نحن", fr: "À Propos", en: "About" }),
    description:
      "تعرف على منصة يودرسي — مهمتنا هي تسهيل التعلم للتلاميذ المغاربة في كل مكان.",
    openGraph: {
      title: "من نحن | Udarsy",
      description: "تعرف على منصة يودرسي — مهمتنا تسهيل التعلم للتلاميذ المغاربة.",
      type: "website",
      url: "/about",
    },
    twitter: {
      card: "summary",
      title: "من نحن | Udarsy",
      description: "تعرف على منصة يودرسي ومهمتنا التعليمية.",
    },
    alternates: { canonical: "/about" },
  };
}

// AboutPage + BreadcrumbList + a team ItemList referencing each /team/[id]
// Person@id. Combined with the Person + ProfilePage schemas emitted by
// /team/[id]/layout.tsx, the result is one resolved entity graph: visitors
// land on About → see the team grid → individual profiles already exist as
// the same entities. Identity is consistent across the surface.
const TEAM_SLUGS = [
  "ibrahim-maghfoul",
  "abderrahman-aouinat",
  "abdelhakim-taouqi",
  "mouhamed-el-wardi",
  "asmae-monaghim",
  "safae-el-oujdi",
];

const aboutSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about#aboutpage`,
      url: `${SITE_URL}/about`,
      name: "About Udarsy",
      description: "Udarsy is a freemium learning platform serving Moroccan students from primary school to BAC — lessons, exercises, and exams aligned with the national curriculum.",
      inLanguage: ["fr", "ar", "en"],
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/about#team`,
      name: "Udarsy team",
      numberOfItems: TEAM_SLUGS.length,
      itemListElement: TEAM_SLUGS.map((slug, i) => ({
        "@type": "ListItem",
        position: i + 1,
        // Resolves to the Person@id emitted from /team/[slug]/layout.tsx.
        // Google treats this as one entity, not a duplicate person node.
        item: { "@id": `${SITE_URL}/team/${slug}#person` },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
      ],
    },
  ],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      {children}
    </>
  );
}
