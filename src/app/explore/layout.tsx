import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { VerifyRequired } from "@/components/VerifyRequired";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "الدورات", fr: "Cours", en: "Courses" }),
    description:
      "تصفح المناهج الدراسية المغربية — اختر مدرستك، مستواك، مسارك والمادة التي تريد تعلمها.",
    openGraph: {
      title: "الدورات | Udarsy",
      description: "تصفح المناهج الدراسية المغربية — اختر مدرستك، مستواك ومادتك.",
      type: "website",
      url: "/courses",
    },
    twitter: {
      card: "summary_large_image",
      title: "الدورات | Udarsy",
      description: "تصفح المناهج الدراسية المغربية.",
    },
    alternates: { canonical: "/courses" },
  };
}

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <VerifyRequired>{children}</VerifyRequired>;
}
