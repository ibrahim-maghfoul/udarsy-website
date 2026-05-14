import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "سياسة الكوكيز", fr: "Politique Cookies", en: "Cookie Policy" }),
    description:
      "سياسة ملفات تعريف الارتباط لمنصة يودرسي — كيفية استخدامنا لملفات تعريف الارتباط.",
    openGraph: {
      title: "سياسة الكوكيز | Udarsy",
      description: "سياسة ملفات تعريف الارتباط لمنصة يودرسي.",
      type: "website",
      url: "/cookies",
    },
    robots: { index: true, follow: false },
    alternates: { canonical: "/cookies" },
  };
}

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
