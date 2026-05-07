import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "أخباري المحفوظة | Actualités Sauvegardées",
  description: "اعرض قائمة مقالاتك وأخبارك المحفوظة على منصة يودرسي.",
  robots: { index: false, follow: false },
};

export default function FavoritesNewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
