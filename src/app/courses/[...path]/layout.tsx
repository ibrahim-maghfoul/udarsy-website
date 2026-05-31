import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

// Mirrors the chain shape returned by GET /api/data/path-resolve.
type Node = { _id: string; title: string; slug: string };
type Guidance = Node & { implicit?: boolean };
type Chain = {
  school?: Node;
  level?: Node;
  guidance?: Guidance;
  subject?: Node;
  lesson?: Node;
};
type ResolvedPath = {
  kind: "school" | "level" | "guidance" | "subject" | "lesson";
  chain: Chain;
};

function decodeSegments(raw: string[]): string[] {
  return raw.map((s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  });
}

async function resolvePath(segments: string[]): Promise<ResolvedPath | null> {
  if (segments.length === 0) return null;
  const qs = segments.map((s) => `p=${encodeURIComponent(s)}`).join("&");
  return serverFetch<ResolvedPath>(`/data/path-resolve?${qs}`, { revalidate: 3600 });
}

// Self-referencing canonical built from the resolved chain's canonical slugs —
// the same hierarchical URL the rest of the site links to. Skips an implicit
// guidance segment exactly like services/data.ts → curriculumPath().
function chainCanonical(chain: Chain): string {
  const parts: string[] = [];
  if (chain.school) parts.push(chain.school.slug);
  if (chain.level) parts.push(chain.level.slug);
  if (chain.guidance && !chain.guidance.implicit) parts.push(chain.guidance.slug);
  if (chain.subject) parts.push(chain.subject.slug);
  if (chain.lesson) parts.push(chain.lesson.slug);
  return "/courses/" + parts.map(encodeURIComponent).join("/");
}

function hreflang(url: string) {
  return { fr: url, ar: url, en: url, "x-default": url };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path: string[] }>;
}): Promise<Metadata> {
  const segments = decodeSegments((await params).path ?? []);
  // Fallback canonical points at the requested path itself, so even an
  // unresolved page never inherits the homepage canonical from the root layout.
  const requestedPath = "/courses/" + segments.map(encodeURIComponent).join("/");
  try {
    const resolved = await resolvePath(segments);
    if (!resolved) throw new Error("unresolved");
    const { kind, chain } = resolved;
    const canonical = chainCanonical(chain);

    let title: string;
    let description: string;
    switch (kind) {
      case "lesson":
        title = `${chain.lesson?.title} — ${chain.subject?.title ?? "Cours"} | Udarsy`;
        description = `درس ${chain.lesson?.title} بالفيديوهات والتمارين والامتحانات على منصة درسي. Leçon ${chain.lesson?.title} avec vidéos, exercices et examens sur Udarsy.`;
        break;
      case "subject":
        title = `${chain.subject?.title} — Udarsy`;
        description = `اكتشف دروس ${chain.subject?.title} بالفيديوهات والتمارين والامتحانات. Découvrez les leçons de ${chain.subject?.title} avec vidéos, exercices et examens sur Udarsy.`;
        break;
      case "guidance":
        title = `${chain.guidance?.title} — Udarsy`;
        description = `تصفح مواد ${chain.guidance?.title} بالدروس والفيديوهات والتمارين على منصة درسي. Parcourez les matières de ${chain.guidance?.title} sur Udarsy.`;
        break;
      case "level":
        title = `${chain.level?.title} — ${chain.school?.title ?? ""} | Udarsy`;
        description = `مسارات ومواد ${chain.level?.title} على منصة درسي التعليمية المغربية. Filières et matières de ${chain.level?.title} sur Udarsy.`;
        break;
      default:
        title = `${chain.school?.title} — Udarsy`;
        description = `مستويات ومواد ${chain.school?.title} على منصة درسي. Niveaux et matières de ${chain.school?.title} sur Udarsy.`;
    }

    return {
      title,
      description,
      openGraph: { title: title.replace(" — ", " | "), description, type: "website", url: canonical },
      alternates: { canonical, languages: hreflang(canonical) },
    };
  } catch {
    return {
      title: "Cours — Udarsy",
      description: "اكتشف الدروس والتمارين والامتحانات على منصة درسي التعليمية المغربية.",
      alternates: { canonical: requestedPath, languages: hreflang(requestedPath) },
    };
  }
}

async function buildCurriculumSchemas(segments: string[]): Promise<object[]> {
  try {
    const resolved = await resolvePath(segments);
    if (!resolved) return [];
    const { kind, chain } = resolved;
    const canonical = `${SITE_URL}${chainCanonical(chain)}`;

    // Breadcrumb from whatever depth resolved.
    const crumbs: { name: string; href: string }[] = [
      { name: "Udarsy", href: SITE_URL },
      { name: "Courses", href: `${SITE_URL}/courses` },
    ];
    const acc: Chain = {};
    if (chain.school) { acc.school = chain.school; crumbs.push({ name: chain.school.title, href: `${SITE_URL}${chainCanonical(acc)}` }); }
    if (chain.level) { acc.level = chain.level; crumbs.push({ name: chain.level.title, href: `${SITE_URL}${chainCanonical(acc)}` }); }
    if (chain.guidance && !chain.guidance.implicit) { acc.guidance = chain.guidance; crumbs.push({ name: chain.guidance.title, href: `${SITE_URL}${chainCanonical(acc)}` }); }
    if (chain.subject) { acc.subject = chain.subject; crumbs.push({ name: chain.subject.title, href: `${SITE_URL}${chainCanonical(acc)}` }); }
    if (chain.lesson) { acc.lesson = chain.lesson; crumbs.push({ name: chain.lesson.title, href: `${SITE_URL}${chainCanonical(acc)}` }); }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        item: c.href,
      })),
    };

    const provider = {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: "Udarsy",
      url: SITE_URL,
    };

    const schemas: object[] = [breadcrumbSchema];

    if (kind === "subject" && chain.subject) {
      const lessons = await serverFetch<Node[]>(`/data/lessons/${chain.subject._id}`, { revalidate: 3600 });
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Course",
        "@id": `${canonical}#course`,
        name: chain.subject.title,
        description: `اكتشف دروس ${chain.subject.title} بالفيديوهات والتمارين والامتحانات على منصة درسي. Découvrez les leçons de ${chain.subject.title} sur Udarsy.`,
        url: canonical,
        provider,
        inLanguage: ["ar", "fr"],
        educationalLevel: "secondary",
        hasPart: (lessons ?? []).map((l) => ({
          "@type": "Course",
          name: l.title,
          url: `${SITE_URL}/lesson/${l._id}`,
        })),
      });
    } else if (kind === "guidance" && chain.guidance) {
      const subjects = await serverFetch<Node[]>(`/data/subjects/${chain.guidance._id}`, { revalidate: 3600 });
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Course",
        "@id": `${canonical}#course`,
        name: chain.guidance.title,
        description: `تصفح مواد ${chain.guidance.title} على منصة درسي. Parcourez les matières de ${chain.guidance.title} sur Udarsy.`,
        url: canonical,
        provider,
        inLanguage: ["ar", "fr"],
        educationalLevel: "secondary",
      });
      schemas.push({
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${chain.guidance.title} — subjects`,
        numberOfItems: subjects?.length ?? 0,
        itemListElement: (subjects ?? []).map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.title,
          url: `${SITE_URL}${chainCanonical({ ...acc, subject: s })}`,
        })),
      });
    }

    return schemas;
  } catch {
    return [];
  }
}

async function CurriculumSchemas({ segments }: { segments: string[] }) {
  const schemas = await buildCurriculumSchemas(segments);
  if (schemas.length === 0) return null;
  return (
    <>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
    </>
  );
}

export default async function CurriculumPathLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ path: string[] }>;
}) {
  const segments = decodeSegments((await params).path ?? []);
  return (
    <>
      <CurriculumSchemas segments={segments} />
      {children}
    </>
  );
}
