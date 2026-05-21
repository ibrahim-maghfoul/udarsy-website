import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { GoogleAuthWrapper } from "@/components/GoogleAuthWrapper";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "إنشاء حساب", fr: "S'inscrire", en: "Sign Up" }),
    description: "انضم إلى يودرسي مجاناً وابدأ رحلتك التعليمية اليوم.",
    robots: { index: false, follow: false },
  };
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <GoogleAuthWrapper>{children}</GoogleAuthWrapper>;
}
