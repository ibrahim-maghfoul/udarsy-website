import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "الدروس المفضلة", fr: "Cours Favoris", en: "Favorite Lessons" }),
    description: "اعرض قائمة دروسك وموادك المفضلة على منصة يودرسي.",
    robots: { index: false, follow: false },
  };
}

export default function FavoritesCoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
