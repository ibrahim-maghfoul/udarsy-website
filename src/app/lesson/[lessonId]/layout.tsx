import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}): Promise<Metadata> {
  const slug = (await params).lessonId; // folder is [lessonId] but value is now a slug
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

export default function LessonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
