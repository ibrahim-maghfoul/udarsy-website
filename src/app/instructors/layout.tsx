import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

type InstructorListItem = {
  _id?: string;
  displayName?: string;
  fullName?: string;
  photoURL?: string;
  courseCount?: number;
  averageRating?: number;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "المدرّسون", fr: "Instructeurs", en: "Instructors" }),
    description:
      "اكتشف مدرّسي يودرسي — دورات تعليمية بالفيديو والـPDF في مختلف المواد للباكالوريا والبريفي.",
    openGraph: {
      title: "المدرّسون | Udarsy",
      description: "دورات تعليمية بالفيديو والـPDF في مختلف المواد للباكالوريا والبريفي.",
      type: "website",
      url: "/instructors",
    },
    twitter: {
      card: "summary_large_image",
      title: "المدرّسون | Udarsy",
      description: "دورات تعليمية بالفيديو والـPDF للباكالوريا والبريفي.",
    },
    alternates: { canonical: "/instructors" },
  };
}

// CollectionPage + ItemList of all active instructors. Each ListItem points
// at the instructor's profile URL — every /instructor/[id] layout emits its
// own Person@id, so this list and those nodes resolve as one entity graph.
async function InstructorsListSchema() {
  const list = await serverFetch<InstructorListItem[]>("/instructor", { revalidate: 1800 });
  const items = Array.isArray(list) ? list : [];
  if (items.length === 0) return null;

  const collection = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/instructors#collection`,
        url: `${SITE_URL}/instructors`,
        name: "Udarsy — Instructors",
        description: "Browse Udarsy instructors who publish video and PDF courses for the Moroccan BAC and Brevet curriculum.",
        inLanguage: ["fr", "ar"],
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/instructors#list`,
        name: "Instructors",
        numberOfItems: items.length,
        itemListElement: items.slice(0, 200).map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Person",
            name: it.displayName || it.fullName,
            url: `${SITE_URL}/instructor/${it._id}`,
            worksFor: { "@id": `${SITE_URL}/#organization` },
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Instructors", item: `${SITE_URL}/instructors` },
        ],
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
  );
}

export default async function InstructorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InstructorsListSchema />
      {children}
    </>
  );
}
