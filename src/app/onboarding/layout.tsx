import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "إعداد الحساب", fr: "Configuration", en: "Setup" }),
    description: "أكمل إعداد حسابك على منصة يودرسي.",
    robots: { index: false, follow: false },
  };
}

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
