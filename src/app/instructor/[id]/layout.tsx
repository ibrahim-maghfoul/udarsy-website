import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await serverFetch(`/instructor/${id}`, { revalidate: 3600 });
    if (!data) throw new Error("Not found");
    const instructor = data.instructor || data;
    const name = instructor.displayName || instructor.name || "المدرّس";
    return {
      title: `${name} — مدرّس درسي`,
      description: `دورات ${name} على منصة درسي — فيديوهات ودروس PDF للباكالوريا والبريفي. Cours de ${name} sur Udarsy.`,
      openGraph: {
        title: `${name} | Udarsy`,
        description: `دورات ${name} — فيديوهات ودروس PDF على منصة درسي.`,
        type: "profile",
        url: `/instructor/${id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} | Udarsy`,
        description: `دورات ${name} على منصة درسي.`,
      },
      alternates: { canonical: `/instructor/${id}` },
    };
  } catch {
    return {
      title: "مدرّس درسي",
      description: "اكتشف دورات مدرّسي درسي للباكالوريا والبريفي.",
    };
  }
}

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
