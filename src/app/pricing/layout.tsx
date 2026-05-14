import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "الأسعار", fr: "Tarifs", en: "Pricing" }),
    description:
      "اشترك في يودرسي بدءاً من 100 درهم/شهر — خطط مجانية ومدفوعة للتلاميذ المغاربة.",
    openGraph: {
      title: "الأسعار | Udarsy",
      description: "اشترك في يودرسي بدءاً من 100 درهم/شهر — خطط مجانية ومدفوعة.",
      type: "website",
      url: "/pricing",
    },
    twitter: {
      card: "summary",
      title: "الأسعار | Udarsy",
      description: "اشترك في يودرسي بدءاً من 100 درهم/شهر.",
    },
    alternates: { canonical: "/pricing" },
  };
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
