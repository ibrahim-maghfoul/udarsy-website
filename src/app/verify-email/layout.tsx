import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "تأكيد البريد الإلكتروني", fr: "Vérification de l'email", en: "Verify Email" }),
    robots: { index: false, follow: false },
  };
}

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}