import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "الإعدادات", fr: "Paramètres", en: "Settings" }),
    description: "إدارة إعدادات حسابك على منصة يودرسي.",
    robots: { index: false, follow: false },
  };
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
