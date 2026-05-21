import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "إعادة تعيين كلمة المرور", fr: "Réinitialiser le mot de passe", en: "Reset Password" }),
    robots: { index: false, follow: false },
  };
}

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}