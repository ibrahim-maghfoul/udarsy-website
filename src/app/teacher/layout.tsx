import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

type TeacherListItem = {
  _id?: string;
  fullName?: string;
  displayName?: string;
  specialist?: string;
  photoURL?: string;
  averageRating?: number;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "الأساتذة", fr: "Professeurs", en: "Teachers" }),
    description:
      "تعرف على أساتذة يودرسي المعتمدين — متخصصون في الباكالوريا والبريفي في المغرب.",
    openGraph: {
      title: "الأساتذة | Udarsy",
      description: "أكثر من 50 أستاذ معتمد متخصص في الباكالوريا والبريفي في المغرب.",
      type: "website",
      url: "/teacher",
    },
    twitter: {
      card: "summary_large_image",
      title: "الأساتذة | Udarsy",
      description: "أساتذة معتمدون متخصصون في الباكالوريا والبريفي في المغرب.",
    },
    alternates: { canonical: "/teacher" },
  };
}

// Mirror of /instructors layout — same ItemList pattern, different endpoint.
// Teachers run real-life classrooms via the teacher-rooms feature, so the
// Person nodes here also carry the affiliation when schoolName is known.
async function TeachersListSchema() {
  const list = await serverFetch<TeacherListItem[]>("/teacher/profiles", { revalidate: 1800 });
  const items = Array.isArray(list) ? list : [];
  if (items.length === 0) return null;

  const collection = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/teacher#collection`,
        url: `${SITE_URL}/teacher`,
        name: "Udarsy — Verified Teachers",
        description: "Browse Udarsy's verified Moroccan teachers — qualified educators running classrooms for BAC and Brevet preparation.",
        inLanguage: ["fr", "ar"],
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE_URL}/teacher#list`,
        name: "Teachers",
        numberOfItems: items.length,
        itemListElement: items.slice(0, 200).map((it, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Person",
            name: it.displayName || it.fullName,
            url: `${SITE_URL}/teacher/${it._id}`,
            ...(it.specialist ? { jobTitle: it.specialist } : {}),
            worksFor: { "@id": `${SITE_URL}/#organization` },
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Teachers", item: `${SITE_URL}/teacher` },
        ],
      },
    ],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collection) }} />
  );
}

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TeachersListSchema />
      {children}
    </>
  );
}
