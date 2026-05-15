import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await serverFetch(`/teacher/profiles/${id}`, { revalidate: 3600 }) as Record<string, unknown>;
    if (!data) throw new Error("Not found");
    const teacher = (data.teacher || data) as Record<string, unknown>;
    const name = (teacher.displayName || teacher.fullName || "الأستاذ") as string;
    const specialization = (teacher.specialization || "") as string;
    return {
      title: `${name} — أستاذ درسي`,
      description: `${name}${specialization ? ` — ${specialization}` : ""} على منصة درسي. درسي أستاذ معتمد للباكالوريا والبريفي في المغرب.`,
      openGraph: {
        title: `${name} | Udarsy`,
        description: `${name}${specialization ? ` — ${specialization}` : ""} — أستاذ معتمد على منصة درسي.`,
        type: "profile",
        url: `/teacher/${id}`,
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} | Udarsy`,
        description: `${name} — أستاذ معتمد على منصة درسي.`,
      },
      alternates: { canonical: `/teacher/${id}` },
    };
  } catch {
    return {
      title: "أستاذ درسي",
      description: "اكتشف أساتذة درسي المعتمدين للباكالوريا والبريفي.",
    };
  }
}

export default function TeacherProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
