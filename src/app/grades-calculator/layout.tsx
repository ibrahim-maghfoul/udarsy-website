import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "حاسبة الدرجات", fr: "Calculateur de Notes", en: "Grades Calculator" }),
    description:
      "احسب معدلاتك الدراسية وتقديرات الباكالوريا والبريفي بسهولة مع حاسبة الدرجات على منصة يودرسي.",
    openGraph: {
      title: "حاسبة الدرجات | Udarsy",
      description: "احسب معدلاتك الدراسية وتقديرات الباكالوريا والبريفي بسهولة.",
      type: "website",
      url: "/grades-calculator",
    },
    twitter: {
      card: "summary",
      title: "حاسبة الدرجات | Udarsy",
      description: "احسب معدلاتك وتقديرات الباكالوريا والبريفي.",
    },
    alternates: { canonical: "/grades-calculator" },
  };
}

export default function GradesCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
