import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "دروسي المفضلة | Cours Favoris",
  description: "اعرض قائمة دروسك وموادك المفضلة على منصة يودرسي.",
  robots: { index: false, follow: false },
};

export default function FavoritesCoursesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
