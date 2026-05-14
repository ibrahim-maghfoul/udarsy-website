import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "الأخبار المحفوظة", fr: "Actualités Sauvegardées", en: "Saved News" }),
    description: "اعرض قائمة مقالاتك وأخبارك المحفوظة على منصة يودرسي.",
    robots: { index: false, follow: false },
  };
}

export default function FavoritesNewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
