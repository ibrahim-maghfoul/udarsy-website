import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

// Try id first (canonical); fall back to slug for legacy URLs.
async function fetchLessonForMeta(param: string) {
  let lesson = await serverFetch<Record<string, unknown> | null>(`/data/lesson/${param}`, { revalidate: 3600 });
  if (!lesson || !(lesson as any)._id) {
    lesson = await serverFetch<Record<string, unknown> | null>(`/data/lesson/by-slug/${param}`, { revalidate: 3600 });
  }
  return lesson;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}): Promise<Metadata> {
  const param = (await params).lessonId;
  try {
    const lesson = await fetchLessonForMeta(param);
    if (!lesson) throw new Error("Not found");
    const title = (lesson.title as string) || "درس";
    const canonicalId = ((lesson as any)._id as string) ?? param;
    return {
      title,
      description: `تعلم درس "${title}" — دروس، تمارين وامتحانات على منصة درسي. Apprenez "${title}" avec cours, exercices et examens sur Udarsy.`,
      openGraph: {
        title: `${title} | Udarsy`,
        description: `دروس وتمارين لـ "${title}" على منصة درسي.`,
        type: "article",
        url: `/lesson/${canonicalId}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Udarsy`,
        description: `دروس وتمارين لـ "${title}" على منصة درسي.`,
      },
      alternates: { canonical: `/lesson/${canonicalId}` },
    };
  } catch {
    return {
      title: "الدرس",
      description: "اكتشف دروس وتمارين منصة درسي التعليمية المغربية.",
    };
  }
}

async function LessonSchemas({ slug }: { slug: string }) {
  try {
    const lesson = await fetchLessonForMeta(slug);
    if (!lesson) return null;
    const canonicalId = ((lesson as any)._id as string) ?? slug;
    const lessonUrl = `${SITE_URL}/lesson/${canonicalId}`;

    const courseSchema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "@id": `${lessonUrl}#course`,
      name: lesson.title,
      description: `دروس وتمارين لـ "${lesson.title}" على منصة درسي. Cours et exercices pour "${lesson.title}" sur Udarsy.`,
      url: lessonUrl,
      provider: {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#organization`,
        name: "Udarsy",
        url: SITE_URL,
      },
      inLanguage: ["ar", "fr"],
      educationalLevel: "secondary",
      teaches: lesson.title,
      isPartOf: { "@id": `${SITE_URL}/courses#website` },
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Courses", item: `${SITE_URL}/courses` },
        { "@type": "ListItem", position: 3, name: lesson.title as string, item: lessonUrl },
      ],
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </>
    );
  } catch {
    return null;
  }
}

export default async function LessonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  return (
    <>
      <LessonSchemas slug={lessonId} />
      {children}
    </>
  );
}
