import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "انضم كأستاذ", fr: "Devenir Professeur", en: "Become Teacher" }),
    description:
      "هل أنت أستاذ تريد الوصول إلى تلاميذ جدد؟ قدّم طلب التحقق من هويتك كأستاذ على منصة يودرسي.",
    openGraph: {
      title: "انضم كأستاذ | Udarsy",
      description: "قدّم طلب التحقق من هويتك كأستاذ على منصة يودرسي.",
      type: "website",
      url: "/apply-teacher",
    },
    twitter: {
      card: "summary",
      title: "انضم كأستاذ | Udarsy",
      description: "قدّم طلبك كأستاذ معتمد على منصة يودرسي.",
    },
    alternates: { canonical: "/apply-teacher" },
  };
}

export default function ApplyTeacherLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
