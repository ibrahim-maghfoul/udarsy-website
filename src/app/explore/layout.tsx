import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "استكشاف المواد", fr: "Explorer", en: "Explore" }),
    description:
      "تصفح المناهج الدراسية المغربية — اختر مدرستك، مستواك، مسارك والمادة التي تريد تعلمها.",
    openGraph: {
      title: "استكشاف المواد | Udarsy",
      description: "تصفح المناهج الدراسية المغربية — اختر مدرستك، مستواك ومادتك.",
      type: "website",
      url: "/explore",
    },
    twitter: {
      card: "summary_large_image",
      title: "استكشاف المواد | Udarsy",
      description: "تصفح المناهج الدراسية المغربية.",
    },
    alternates: { canonical: "/explore" },
  };
}

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
