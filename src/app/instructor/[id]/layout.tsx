import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

type InstructorPayload = {
  user?: { _id?: string; displayName?: string; photoURL?: string; coverPhotoURL?: string };
  profile?: { fullName?: string; specialist?: string };
  courses?: unknown[];
  courseCount?: number;
  averageRating?: number;
  totalRatings?: number;
  // Some routes flatten the response — fall back to top-level fields.
  displayName?: string;
  name?: string;
};

async function fetchInstructor(id: string): Promise<InstructorPayload | null> {
  const data = (await serverFetch<Record<string, unknown>>(`/instructor/${id}`, { revalidate: 3600 })) ?? null;
  if (!data) return null;
  const block = (data.instructor || data) as Record<string, unknown>;
  return block as InstructorPayload;
}

function instructorName(p: InstructorPayload): string {
  return (p.user?.displayName || p.profile?.fullName || p.displayName || p.name || "المدرّس") as string;
}

function instructorSpec(p: InstructorPayload): string {
  return (p.profile?.specialist || "") as string;
}

function instructorPhoto(p: InstructorPayload): string | null {
  const u = p.user?.photoURL;
  return typeof u === "string" && u.startsWith("http") ? u : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await fetchInstructor(id);
    if (!data) throw new Error("Not found");
    const name = instructorName(data);
    const photo = instructorPhoto(data) ?? `${SITE_URL}/og-image.png`;
    return {
      title: `${name} — مدرّس درسي`,
      description: `دورات ${name} على منصة درسي — فيديوهات ودروس PDF للباكالوريا والبريفي. Cours de ${name} sur Udarsy.`,
      openGraph: {
        title: `${name} | Udarsy`,
        description: `دورات ${name} — فيديوهات ودروس PDF على منصة درسي.`,
        type: "profile",
        url: `/instructor/${id}`,
        images: [{ url: photo, width: 800, height: 800, alt: name }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} | Udarsy`,
        description: `دورات ${name} على منصة درسي.`,
        images: [photo],
      },
      alternates: { canonical: `/instructor/${id}` },
    };
  } catch {
    return {
      title: "مدرّس درسي",
      description: "اكتشف دورات مدرّسي درسي للباكالوريا والبريفي.",
    };
  }
}

// ProfilePage + Person + BreadcrumbList. AggregateRating is only emitted when
// the backend reports at least one real rating — schema.org rejects rating
// counts of zero. The Person carries an interactionStatistic with course
// count so Google understands the breadth of this instructor's output.
async function InstructorSchemas({ id }: { id: string }) {
  try {
    const data = await fetchInstructor(id);
    if (!data) return null;
    const name = instructorName(data);
    const spec = instructorSpec(data);
    const url = `${SITE_URL}/instructor/${id}`;
    const photo = instructorPhoto(data);
    const courseCount = typeof data.courseCount === "number"
      ? data.courseCount
      : Array.isArray(data.courses) ? data.courses.length : 0;

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
    if (photo) person.image = { "@type": "ImageObject", url: photo, width: 800, height: 800 };
    if (courseCount > 0) {
      person.interactionStatistic = {
        "@type": "InteractionCounter",
        interactionType: { "@type": "WriteAction" },
        userInteractionCount: courseCount,
        name: "Courses published",
      };
    }
    if (typeof data.averageRating === "number" && data.averageRating > 0 &&
        typeof data.totalRatings === "number" && data.totalRatings > 0) {
      person.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: data.averageRating,
        ratingCount: data.totalRatings,
        bestRating: 5,
        worstRating: 1,
      };
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
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
            { "@type": "ListItem", position: 2, name: "Instructors", item: `${SITE_URL}/instructors` },
            { "@type": "ListItem", position: 3, name, item: url },
          ],
        },
      ],
    };

    return (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    );
  } catch {
    return null;
  }
}

export default async function InstructorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <InstructorSchemas id={id} />
      {children}
    </>
  );
}
