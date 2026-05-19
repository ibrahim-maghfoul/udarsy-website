import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ guidanceSlug: string }>;
}): Promise<Metadata> {
  const slug = (await params).guidanceSlug;
  try {
    const guidance = await serverFetch<{ _id: string; title: string }>(`/data/guidance/by-slug/${slug}`, { revalidate: 3600 });
    if (!guidance) throw new Error("Not found");
    return {
      title: `${guidance.title} — Udarsy`,
      description: `اكتشف مواد ${guidance.title} بالدروس والفيديوهات والتمارين على منصة درسي. Découvrez les matières de ${guidance.title} avec leçons, vidéos et exercices.`,
      openGraph: {
        title: `${guidance.title} | Udarsy`,
        description: `تصفح مواد ${guidance.title} على منصة درسي التعليمية.`,
        type: "website",
        url: `/courses/${slug}`,
      },
      alternates: { canonical: `/courses/${slug}` },
    };
  } catch {
    return {
      title: "المسار الدراسي — Udarsy",
      description: "اكتشف المواد الدراسية على منصة درسي.",
    };
  }
}

async function GuidanceSchemas({ slug }: { slug: string }) {
  try {
    const guidance = await serverFetch<{ _id: string; title: string; slug: string }>(
      `/data/guidance/by-slug/${slug}`,
      { revalidate: 3600 }
    );
    if (!guidance) return null;
    const canonicalSlug = guidance.slug ?? slug;
    const guidanceUrl = `${SITE_URL}/courses/${canonicalSlug}`;

    const courseSchema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "@id": `${guidanceUrl}#course`,
      name: guidance.title,
      description: `اكتشف مواد ودروس ${guidance.title} على منصة درسي التعليمية المغربية. Découvrez les matières de ${guidance.title} sur Udarsy.`,
      url: guidanceUrl,
      provider: {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#organization`,
        name: "Udarsy",
        url: SITE_URL,
      },
      inLanguage: ["ar", "fr"],
      educationalLevel: "secondary",
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Courses", item: `${SITE_URL}/courses` },
        { "@type": "ListItem", position: 3, name: guidance.title, item: guidanceUrl },
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

export default async function GuidanceSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ guidanceSlug: string }>;
}) {
  const { guidanceSlug } = await params;
  return (
    <>
      <GuidanceSchemas slug={guidanceSlug} />
      {children}
    </>
  );
}
