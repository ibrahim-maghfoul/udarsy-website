import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "من نحن", fr: "À Propos", en: "About" }),
    description:
      "تعرف على منصة يودرسي — مهمتنا هي تسهيل التعلم للتلاميذ المغاربة في كل مكان.",
    openGraph: {
      title: "من نحن | Udarsy",
      description: "تعرف على منصة يودرسي — مهمتنا تسهيل التعلم للتلاميذ المغاربة.",
      type: "website",
      url: "/about",
    },
    twitter: {
      card: "summary",
      title: "من نحن | Udarsy",
      description: "تعرف على منصة يودرسي ومهمتنا التعليمية.",
    },
    alternates: { canonical: "/about" },
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
