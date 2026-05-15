import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}): Promise<Metadata> {
  const slug = (await params).subjectId; // param name matches folder; value is a slug
  try {
    const subject = await serverFetch<{ _id: string; title: string; slug: string }>(`/data/subject/by-slug/${slug}`, { revalidate: 3600 });
    if (!subject) throw new Error("Not found");
    const lessons = await serverFetch<unknown[]>(`/data/lessons/${subject._id}`, { revalidate: 3600 });
    const count = lessons?.length ?? 0;
    const canonicalSlug = subject.slug ?? slug;
    return {
      title: `${subject.title} — Udarsy`,
      description: `اكتشف دروس ${subject.title} بالفيديوهات والتمارين والامتحانات على منصة درسي. Découvrez les leçons de ${subject.title} avec vidéos, exercices et examens.`,
      openGraph: {
        title: `${subject.title} | Udarsy`,
        description: `${count} درساً بالفيديوهات والتمارين والامتحانات على منصة درسي.`,
        type: "website",
        url: `/explore/subject/${canonicalSlug}`,
      },
      alternates: { canonical: `/explore/subject/${canonicalSlug}` },
    };
  } catch {
    return {
      title: "المادة الدراسية",
      description: "اكتشف دروس وتمارين المادة على منصة درسي.",
    };
  }
}

export default function SubjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
