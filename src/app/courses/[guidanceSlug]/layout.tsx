import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

// Try id first (canonical, unique); fall back to slug only for legacy URLs.
async function fetchGuidance(param: string) {
  let g = await serverFetch<{ _id: string; title: string; slug?: string } | null>(`/data/guidance/${param}`, { revalidate: 3600 });
  if (!g || !g._id) {
    g = await serverFetch<{ _id: string; title: string; slug?: string } | null>(`/data/guidance/by-slug/${param}`, { revalidate: 3600 });
  }
  return g;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ guidanceSlug: string }>;
}): Promise<Metadata> {
  const param = (await params).guidanceSlug;
  try {
    const guidance = await fetchGuidance(param);
    if (!guidance) throw new Error("Not found");
    const canonicalId = guidance._id ?? param;
    return {
      title: `${guidance.title} — Udarsy`,
      description: `اكتشف مواد ${guidance.title} بالدروس والفيديوهات والتمارين على منصة درسي. Découvrez les matières de ${guidance.title} avec leçons, vidéos et exercices.`,
      openGraph: {
        title: `${guidance.title} | Udarsy`,
        description: `تصفح مواد ${guidance.title} على منصة درسي التعليمية.`,
        type: "website",
        url: `/courses/${canonicalId}`,
      },
      alternates: { canonical: `/courses/${canonicalId}` },
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
    const guidance = await fetchGuidance(slug);
    if (!guidance) return null;
    const canonicalId = guidance._id ?? slug;
    const guidanceUrl = `${SITE_URL}/courses/${canonicalId}`;

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
