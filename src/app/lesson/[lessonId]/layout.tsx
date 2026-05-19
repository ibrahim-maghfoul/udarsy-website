import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}): Promise<Metadata> {
  const slug = (await params).lessonId;
  try {
    const lesson = await serverFetch(`/data/lesson/by-slug/${slug}`, { revalidate: 3600 }) as Record<string, unknown>;
    if (!lesson) throw new Error("Not found");
    const title = (lesson.title as string) || "درس";
    const canonicalSlug = (lesson.slug as string) ?? slug;
    return {
      title,
      description: `تعلم درس "${title}" — دروس، تمارين وامتحانات على منصة درسي. Apprenez "${title}" avec cours, exercices et examens sur Udarsy.`,
      openGraph: {
        title: `${title} | Udarsy`,
        description: `دروس وتمارين لـ "${title}" على منصة درسي.`,
        type: "article",
        url: `/lesson/${canonicalSlug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Udarsy`,
        description: `دروس وتمارين لـ "${title}" على منصة درسي.`,
      },
      alternates: { canonical: `/lesson/${canonicalSlug}` },
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
    const lesson = await serverFetch<Record<string, unknown>>(`/data/lesson/by-slug/${slug}`, { revalidate: 3600 });
    if (!lesson) return null;
    const canonicalSlug = (lesson.slug as string) ?? slug;
    const lessonUrl = `${SITE_URL}/lesson/${canonicalSlug}`;

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
