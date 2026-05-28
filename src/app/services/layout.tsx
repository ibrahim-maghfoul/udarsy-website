import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { VerifyRequired } from "@/components/VerifyRequired";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "الخدمات المدرسية", fr: "Services Scolaires", en: "School Services" }),
    description:
      "اطلع على التقويمات المدرسية، فترات التسجيل والتوجيه في المدارس المغربية.",
    openGraph: {
      title: "الخدمات المدرسية | Udarsy",
      description: "التقويمات المدرسية، فترات التسجيل والتوجيه في المدارس المغربية.",
      type: "website",
      url: "/services",
    },
    twitter: {
      card: "summary_large_image",
      title: "الخدمات المدرسية | Udarsy",
      description: "التقويمات المدرسية والتوجيه في المدارس المغربية.",
    },
    alternates: { canonical: "/services" },
  };
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <VerifyRequired>{children}</VerifyRequired>;
}
