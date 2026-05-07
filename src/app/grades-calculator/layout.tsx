import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حاسبة الدرجات | Calculateur de Notes",
  description:
    "احسب معدلاتك الدراسية وتقديرات الباكالوريا والبريفي بسهولة مع حاسبة الدرجات على منصة يودرسي. Calculez vos moyennes scolaires et estimez vos notes BAC et Brevet avec Udarsy.",
  openGraph: {
    title: "حاسبة الدرجات | Udarsy",
    description:
      "احسب معدلاتك الدراسية وتقديرات الباكالوريا والبريفي بسهولة.",
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

export default function GradesCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
