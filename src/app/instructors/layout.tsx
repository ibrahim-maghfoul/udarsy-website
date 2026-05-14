import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "المدرّسون", fr: "Instructeurs", en: "Instructors" }),
    description:
      "اكتشف مدرّسي يودرسي — دورات تعليمية بالفيديو والـPDF في مختلف المواد للباكالوريا والبريفي.",
    openGraph: {
      title: "المدرّسون | Udarsy",
      description: "دورات تعليمية بالفيديو والـPDF في مختلف المواد للباكالوريا والبريفي.",
      type: "website",
      url: "/instructors",
    },
    twitter: {
      card: "summary_large_image",
      title: "المدرّسون | Udarsy",
      description: "دورات تعليمية بالفيديو والـPDF للباكالوريا والبريفي.",
    },
    alternates: { canonical: "/instructors" },
  };
}

export default function InstructorsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
