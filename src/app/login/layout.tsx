import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import { GoogleAuthWrapper } from "@/components/GoogleAuthWrapper";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "تسجيل الدخول", fr: "Connexion", en: "Login" }),
    description: "سجّل دخولك إلى منصة يودرسي لمتابعة تقدمك الدراسي.",
    robots: { index: false, follow: false },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <GoogleAuthWrapper>{children}</GoogleAuthWrapper>;
}
