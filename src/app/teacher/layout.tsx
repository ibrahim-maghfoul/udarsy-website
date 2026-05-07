import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "أساتذة يودرسي | Professeurs Udarsy",
  description:
    "تعرف على أساتذة يودرسي المعتمدين — أكثر من 50 أستاذ متخصص في الباكالوريا والبريفي في المغرب. Découvrez les professeurs certifiés Udarsy — spécialisés BAC et Brevet au Maroc.",
  openGraph: {
    title: "أساتذة يودرسي | Udarsy",
    description:
      "أكثر من 50 أستاذ معتمد متخصص في الباكالوريا والبريفي في المغرب.",
    type: "website",
    url: "/teacher",
  },
  twitter: {
    card: "summary_large_image",
    title: "أساتذة يودرسي | Udarsy",
    description: "أساتذة معتمدون متخصصون في الباكالوريا والبريفي في المغرب.",
  },
  alternates: { canonical: "/teacher" },
};

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
