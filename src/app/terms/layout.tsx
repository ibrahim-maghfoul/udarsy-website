import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "شروط الخدمة", fr: "Conditions", en: "Terms" }),
    description:
      "شروط خدمة منصة يودرسي — القواعد واللوائح التي تحكم استخدامك للمنصة.",
    openGraph: {
      title: "شروط الخدمة | Udarsy",
      description: "شروط خدمة منصة يودرسي.",
      type: "website",
      url: "/terms",
    },
    robots: { index: true, follow: false },
    alternates: { canonical: "/terms" },
  };
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
