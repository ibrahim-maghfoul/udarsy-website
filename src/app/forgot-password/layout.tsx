import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "نسيت كلمة المرور", fr: "Mot de passe oublié", en: "Forgot Password" }),
    robots: { index: false, follow: false },
  };
}

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}