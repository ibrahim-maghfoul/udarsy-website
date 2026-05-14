import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "ملفي الشخصي", fr: "Mon Profil", en: "My Profile" }),
    description: "اعرض إحصائياتك الدراسية، دروسك المفضلة وإعداداتك على منصة يودرسي.",
    robots: { index: false, follow: false },
  };
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
