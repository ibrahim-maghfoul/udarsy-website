import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { VerifyRequired } from "@/components/VerifyRequired";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

type Service = { _id: string; title?: string; description?: string };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "الخدمات المدرسية", fr: "Services Scolaires", en: "School Services" }),
    description:
      "اطلع على التقويمات المدرسية، فترات التسجيل والتوجيه في المدارس المغربية.",
    openGraph: {
      title: "الخدمات المدرسية | Udarsy",
      description: "التقويمات المدرسية، فترات التسجيل والتوجيه في المدارس المغربية.",
      type: "website",
      url: "/services",
    },
    twitter: {
      card: "summary_large_image",
      title: "الخدمات المدرسية | Udarsy",
      description: "التقويمات المدرسية والتوجيه في المدارس المغربية.",
    },
    alternates: { canonical: "/services" },
  };
}

// Emits an ItemList of all services so Google has the full service inventory
// even though the page itself fetches client-side. Visible UI is unchanged.
async function ServicesItemListJsonLd() {
  const services = await serverFetch<Service[]>("/data/school-services", { revalidate: 3600 });
  const list = Array.isArray(services) ? services : [];
  if (list.length === 0) return null;

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/services#list`,
    name: "Udarsy — Services scolaires marocains",
    numberOfItems: list.length,
    itemListElement: list.slice(0, 100).map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      description: s.description,
      url: `${SITE_URL}/services/${s._id}`,
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
  );
}

export default async function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServicesItemListJsonLd />
      <VerifyRequired>{children}</VerifyRequired>
    </>
  );
}
