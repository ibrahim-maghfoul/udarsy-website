import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "سياسة الخصوصية", fr: "Confidentialité", en: "Privacy" }),
    description:
      "سياسة خصوصية منصة يودرسي — كيفية جمع واستخدام وحماية بياناتك الشخصية.",
    openGraph: {
      title: "سياسة الخصوصية | Udarsy",
      description: "سياسة خصوصية منصة يودرسي.",
      type: "website",
      url: "/privacy",
    },
    robots: { index: true, follow: false },
    alternates: { canonical: "/privacy" },
  };
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
