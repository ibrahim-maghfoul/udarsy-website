import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

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

export default function GuidanceSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
