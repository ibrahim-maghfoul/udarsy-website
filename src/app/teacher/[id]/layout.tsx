import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

type TeacherProfile = {
  _id?: string;
  fullName?: string;
  displayName?: string;
  bio?: string;
  photoURL?: string;
  specialist?: string;
  specialization?: string;
  schoolName?: string;
  averageRating?: number;
  totalRatings?: number;
  isVerified?: boolean;
};

async function fetchTeacher(id: string): Promise<TeacherProfile | null> {
  const data = (await serverFetch<Record<string, unknown>>(`/teacher/profiles/${id}`, { revalidate: 3600 })) ?? null;
  if (!data) return null;
  return (data.teacher || data) as TeacherProfile;
}

function teacherName(t: TeacherProfile): string {
  return (t.displayName || t.fullName || "الأستاذ") as string;
}

function teacherSpec(t: TeacherProfile): string {
  return (t.specialization || t.specialist || "") as string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const teacher = await fetchTeacher(id);
    if (!teacher) throw new Error("Not found");
    const name = teacherName(teacher);
    const spec = teacherSpec(teacher);
    const photo = typeof teacher.photoURL === "string" && teacher.photoURL.startsWith("http") ? teacher.photoURL : `${SITE_URL}/og-image.png`;
    return {
      title: `${name} — أستاذ درسي`,
      description: `${name}${spec ? ` — ${spec}` : ""} على منصة درسي. درسي أستاذ معتمد للباكالوريا والبريفي في المغرب.`,
      openGraph: {
        title: `${name} | Udarsy`,
        description: `${name}${spec ? ` — ${spec}` : ""} — أستاذ معتمد على منصة درسي.`,
        type: "profile",
        url: `/teacher/${id}`,
        images: [{ url: photo, width: 800, height: 800, alt: name }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} | Udarsy`,
        description: `${name} — أستاذ معتمد على منصة درسي.`,
        images: [photo],
      },
      alternates: { canonical: `/teacher/${id}` },
    };
  } catch {
    return {
      title: "أستاذ درسي",
      description: "اكتشف أساتذة درسي المعتمدين للباكالوريا والبريفي.",
    };
  }
}

// ProfilePage + Person + (optional) AggregateRating + BreadcrumbList.
// Person carries jobTitle / worksFor / nationality so Google can confidently
// associate the page with the entity. The Organization @id reference points
// back at the canonical Udarsy node defined in the root layout.
async function TeacherSchemas({ id }: { id: string }) {
  try {
    const teacher = await fetchTeacher(id);
    if (!teacher) return null;
    const name = teacherName(teacher);
    const spec = teacherSpec(teacher);
    const url = `${SITE_URL}/teacher/${id}`;
    const photo = typeof teacher.photoURL === "string" && teacher.photoURL.startsWith("http") ? teacher.photoURL : null;

    const person: Record<string, unknown> = {
      "@type": "Person",
      "@id": `${url}#person`,
      name,
      url,
      worksFor: { "@id": `${SITE_URL}/#organization` },
      knowsAbout: ["Moroccan curriculum", "BAC preparation", "Brevet preparation", spec].filter(Boolean),
      nationality: { "@type": "Country", name: "Morocco" },
    };
    if (spec) person.jobTitle = spec;
    if (teacher.bio) person.description = teacher.bio;
    if (photo) person.image = { "@type": "ImageObject", url: photo, width: 800, height: 800 };
    if (teacher.schoolName) {
      person.affiliation = { "@type": "EducationalOrganization", name: teacher.schoolName };
    }

    const graph: Record<string, unknown>[] = [
      {
        "@type": "ProfilePage",
        "@id": `${url}#profilepage`,
        url,
        name: `${name}${spec ? ` — ${spec}` : ""}`,
        mainEntity: { "@id": `${url}#person` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        inLanguage: ["ar", "fr"],
      },
      person,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Teachers", item: `${SITE_URL}/teacher` },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
    ];

    // AggregateRating only if there is at least one rating — empty ratings
    // count as a SD warning in Search Console (ratingValue=0 isn't valid).
    if (typeof teacher.averageRating === "number" && teacher.averageRating > 0 &&
        typeof teacher.totalRatings === "number" && teacher.totalRatings > 0) {
      person.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: teacher.averageRating,
        ratingCount: teacher.totalRatings,
        bestRating: 5,
        worstRating: 1,
      };
    }

    const jsonLd = { "@context": "https://schema.org", "@graph": graph };
    return (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    );
  } catch {
    return null;
  }
}

export default async function TeacherProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <TeacherSchemas id={id} />
      {children}
    </>
  );
}
