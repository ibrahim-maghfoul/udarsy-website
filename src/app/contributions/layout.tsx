import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "المساهمات", fr: "Contribuer", en: "Contribute" }),
    description:
      "شارك دروسك وملخصاتك مع آلاف التلاميذ المغاربة. شارك في بناء مجتمع تعليمي قوي على منصة يودرسي.",
    openGraph: {
      title: "المساهمات | Udarsy",
      description: "شارك دروسك وملخصاتك مع آلاف التلاميذ المغاربة على منصة يودرسي.",
      type: "website",
      url: "/contributions",
    },
    twitter: {
      card: "summary_large_image",
      title: "المساهمات | Udarsy",
      description: "شارك دروسك وملخصاتك مع التلاميذ المغاربة.",
    },
    alternates: { canonical: "/contributions" },
  };
}

export default function ContributionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
