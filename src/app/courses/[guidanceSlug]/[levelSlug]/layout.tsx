import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

type Node = { _id: string; title: string; slug: string };
type ResolvedPath = {
  kind: "school" | "level" | "guidance" | "subject" | "lesson";
  chain: { school?: Node; level?: Node };
};

function hreflang(url: string) {
  return { fr: url, ar: url, en: url, "x-default": url };
}

async function resolveLevel(guidanceSlug: string, levelSlug: string) {
  const segs = [guidanceSlug, levelSlug].map((s) => {
    try { return decodeURIComponent(s); } catch { return s; }
  });
  const qs = segs.map((s) => `p=${encodeURIComponent(s)}`).join("&");
  return serverFetch<ResolvedPath>(`/data/path-resolve?${qs}`, { revalidate: 3600 });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ guidanceSlug: string; levelSlug: string }>;
}): Promise<Metadata> {
  const { guidanceSlug, levelSlug } = await params;
  const selfPath = `/courses/${encodeURIComponent(guidanceSlug)}/${encodeURIComponent(levelSlug)}`;
  try {
    const resolved = await resolveLevel(guidanceSlug, levelSlug);
    const level = resolved?.chain?.level;
    const school = resolved?.chain?.school;
    if (!level) throw new Error("unresolved");
    const title = `${level.title}${school ? ` — ${school.title}` : ""} | Udarsy`;
    const description = `مسارات ومواد ${level.title} على منصة درسي التعليمية المغربية. Filières et matières de ${level.title} sur Udarsy.`;
    return {
      title,
      description,
      openGraph: { title, description, type: "website", url: selfPath },
      alternates: { canonical: selfPath, languages: hreflang(selfPath) },
    };
  } catch {
    return {
      title: "المستوى الدراسي — Udarsy",
      description: "اكتشف مسارات ومواد المستوى على منصة درسي.",
      alternates: { canonical: selfPath, languages: hreflang(selfPath) },
    };
  }
}

async function buildLevelBreadcrumb(guidanceSlug: string, levelSlug: string): Promise<object | null> {
  try {
    const resolved = await resolveLevel(guidanceSlug, levelSlug);
    const level = resolved?.chain?.level;
    const school = resolved?.chain?.school;
    if (!level) return null;
    const levelUrl = `${SITE_URL}/courses/${encodeURIComponent(guidanceSlug)}/${encodeURIComponent(levelSlug)}`;
    const crumbs = [
      { name: "Udarsy", item: SITE_URL },
      { name: "Courses", item: `${SITE_URL}/courses` },
      ...(school ? [{ name: school.title, item: `${SITE_URL}/courses/${encodeURIComponent(guidanceSlug)}` }] : []),
      { name: level.title, item: levelUrl },
    ];
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
    };
  } catch {
    return null;
  }
}

async function LevelSchema({ guidanceSlug, levelSlug }: { guidanceSlug: string; levelSlug: string }) {
  const schema = await buildLevelBreadcrumb(guidanceSlug, levelSlug);
  if (!schema) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default async function LevelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ guidanceSlug: string; levelSlug: string }>;
}) {
  const { guidanceSlug, levelSlug } = await params;
  return (
    <>
      <LevelSchema guidanceSlug={guidanceSlug} levelSlug={levelSlug} />
      {children}
    </>
  );
}
