import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "لوحة الشرف", fr: "Classement", en: "Rankings" }),
    description:
      "اكتشف أفضل المساهمين والمتعلمين على منصة يودرسي. تصنيفات أسبوعية وشهرية لأكثر التلاميذ نشاطاً في المغرب.",
    openGraph: {
      title: "لوحة الشرف | Udarsy",
      description: "أفضل المساهمين والمتعلمين على منصة يودرسي — تصنيفات أسبوعية وشهرية.",
      type: "website",
      url: "/rankings",
    },
    twitter: {
      card: "summary_large_image",
      title: "لوحة الشرف | Udarsy",
      description: "أفضل المساهمين والمتعلمين على منصة يودرسي.",
    },
    alternates: { canonical: "/rankings" },
  };
}

export default function RankingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
