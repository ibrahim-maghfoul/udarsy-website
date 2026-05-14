import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "الأخبار", fr: "Actualités", en: "News" }),
    description:
      "آخر أخبار التعليم والتوجيه في المغرب — باكالوريا، بريفي، مستجدات وزارة التربية الوطنية.",
    openGraph: {
      title: "الأخبار | Udarsy",
      description: "آخر أخبار التعليم والتوجيه في المغرب — باكالوريا، بريفي، مستجدات وزارة التربية الوطنية.",
      type: "website",
      url: "/news",
    },
    twitter: {
      card: "summary_large_image",
      title: "الأخبار | Udarsy",
      description: "آخر أخبار التعليم والتوجيه في المغرب.",
    },
    alternates: { canonical: "/news" },
  };
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
