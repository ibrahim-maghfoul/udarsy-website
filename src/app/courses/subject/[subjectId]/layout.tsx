import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

function hreflang(url: string) {
  return { fr: url, ar: url, en: url, "x-default": url };
}

async function fetchSubject(param: string) {
  let s = await serverFetch<{ _id: string; title: string; slug?: string } | null>(`/data/subject/${param}`, { revalidate: 3600 });
  if (!s || !s._id) {
    s = await serverFetch<{ _id: string; title: string; slug?: string } | null>(`/data/subject/by-slug/${param}`, { revalidate: 3600 });
  }
  return s;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}): Promise<Metadata> {
  const param = (await params).subjectId;
  try {
    const subject = await fetchSubject(param);
    if (!subject) throw new Error("Not found");
    const lessons = await serverFetch<unknown[]>(`/data/lessons/${subject._id}`, { revalidate: 3600 });
    const count = lessons?.length ?? 0;
    const canonicalId = subject._id ?? param;
    return {
      title: `${subject.title} — Udarsy`,
      description: `اكتشف دروس ${subject.title} بالفيديوهات والتمارين والامتحانات على منصة درسي. Découvrez les leçons de ${subject.title} avec vidéos, exercices et examens.`,
      openGraph: {
        title: `${subject.title} | Udarsy`,
        description: `${count} درساً بالفيديوهات والتمارين والامتحانات على منصة درسي.`,
        type: "website",
        url: `/courses/subject/${canonicalId}`,
      },
      alternates: {
        canonical: `/courses/subject/${canonicalId}`,
        languages: hreflang(`/courses/subject/${canonicalId}`),
      },
    };
  } catch {
    const selfPath = `/courses/subject/${encodeURIComponent(param)}`;
    return {
      title: "المادة الدراسية — Udarsy",
      description: "اكتشف دروس وتمارين المادة على منصة درسي.",
      alternates: { canonical: selfPath, languages: hreflang(selfPath) },
    };
  }
}

async function SubjectSchemas({ subjectId }: { subjectId: string }) {
  try {
    const subject = await fetchSubject(subjectId);
    if (!subject) return null;
    const lessons = await serverFetch<{ _id: string; title: string; slug: string }[]>(`/data/lessons/${subject._id}`, { revalidate: 3600 });
    const canonicalId = subject._id ?? subjectId;
    const subjectUrl = `${SITE_URL}/courses/subject/${canonicalId}`;

    const courseSchema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "@id": `${subjectUrl}#course`,
      name: subject.title,
      description: `اكتشف دروس ${subject.title} بالفيديوهات والتمارين والامتحانات على منصة درسي. Découvrez les leçons de ${subject.title} avec vidéos, exercices et examens sur Udarsy.`,
      url: subjectUrl,
      provider: {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#organization`,
        name: "Udarsy",
        url: SITE_URL,
      },
      inLanguage: ["ar", "fr"],
      educationalLevel: "secondary",
      hasPart: (lessons ?? []).map(lesson => ({
        "@type": "Course",
        name: lesson.title,
        url: `${SITE_URL}/lesson/${lesson._id}`,
      })),
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Courses", item: `${SITE_URL}/courses` },
        { "@type": "ListItem", position: 3, name: subject.title, item: subjectUrl },
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

export default async function SubjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  return (
    <>
      <SubjectSchemas subjectId={subjectId} />
      {children}
    </>
  );
}
