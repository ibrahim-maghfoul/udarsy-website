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

// 1-segment /courses/<slug> is also the "browse a school" entry point (e.g.
// /courses/lycee). When the segment isn't a guidance, resolve it as a school so
// the page still gets a real title instead of the generic fallback.
async function fetchSchool(param: string) {
  const decoded = (() => { try { return decodeURIComponent(param); } catch { return param; } })();
  const resolved = await serverFetch<{ chain?: { school?: { title: string } } }>(
    `/data/path-resolve?p=${encodeURIComponent(decoded)}`,
    { revalidate: 3600 }
  );
  return resolved?.chain?.school ?? null;
}

function hreflang(url: string) {
  return { fr: url, ar: url, en: url, "x-default": url };
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
    const url = `/courses/${canonicalId}`;
    return {
      title: `${guidance.title} — Udarsy`,
      description: `اكتشف مواد ${guidance.title} بالدروس والفيديوهات والتمارين على منصة درسي. Découvrez les matières de ${guidance.title} avec leçons, vidéos et exercices.`,
      openGraph: {
        title: `${guidance.title} | Udarsy`,
        description: `تصفح مواد ${guidance.title} على منصة درسي التعليمية.`,
        type: "website",
        url,
      },
      alternates: { canonical: url, languages: hreflang(url) },
    };
  } catch {
    // Not a guidance — most likely a school landing page (/courses/lycee).
    const selfPath = `/courses/${encodeURIComponent(param)}`;
    const school = await fetchSchool(param).catch(() => null);
    if (school) {
      const description = `مستويات ومواد ${school.title} على منصة درسي. Niveaux et matières de ${school.title} sur Udarsy.`;
      return {
        title: `${school.title} — Udarsy`,
        description,
        openGraph: { title: `${school.title} | Udarsy`, description, type: "website", url: selfPath },
        alternates: { canonical: selfPath, languages: hreflang(selfPath) },
      };
    }
    return {
      title: "المسار الدراسي — Udarsy",
      description: "اكتشف المواد الدراسية على منصة درسي.",
      alternates: { canonical: selfPath, languages: hreflang(selfPath) },
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
