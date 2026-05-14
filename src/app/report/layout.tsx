import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "الإبلاغ", fr: "Signaler", en: "Report" }),
    description: "أبلغنا عن أي مشكلة أو اقتراح لتحسين منصة يودرسي.",
    robots: { index: false, follow: false },
  };
}

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
