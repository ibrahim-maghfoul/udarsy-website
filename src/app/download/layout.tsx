import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "تحميل الموارد", fr: "Télécharger", en: "Download" }),
    description:
      "حمّل الدروس والتمارين والامتحانات بصيغة PDF للدراسة بدون إنترنت.",
    openGraph: {
      title: "تحميل الموارد | Udarsy",
      description: "حمّل الدروس والتمارين والامتحانات بصيغة PDF للدراسة بدون إنترنت.",
      type: "website",
      url: "/download",
    },
    twitter: {
      card: "summary_large_image",
      title: "تحميل الموارد | Udarsy",
      description: "حمّل الدروس والتمارين والامتحانات بصيغة PDF.",
    },
    alternates: { canonical: "/download" },
  };
}

export default function DownloadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
