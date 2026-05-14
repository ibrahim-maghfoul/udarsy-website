import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "الأساتذة", fr: "Professeurs", en: "Teachers" }),
    description:
      "تعرف على أساتذة يودرسي المعتمدين — متخصصون في الباكالوريا والبريفي في المغرب.",
    openGraph: {
      title: "الأساتذة | Udarsy",
      description: "أكثر من 50 أستاذ معتمد متخصص في الباكالوريا والبريفي في المغرب.",
      type: "website",
      url: "/teacher",
    },
    twitter: {
      card: "summary_large_image",
      title: "الأساتذة | Udarsy",
      description: "أساتذة معتمدون متخصصون في الباكالوريا والبريفي في المغرب.",
    },
    alternates: { canonical: "/teacher" },
  };
}

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
