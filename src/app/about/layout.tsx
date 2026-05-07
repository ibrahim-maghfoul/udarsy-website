import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن | À Propos de Udarsy",
  description:
    "تعرف على منصة يودرسي — مهمتنا هي تسهيل التعلم للتلاميذ المغاربة في كل مكان. Découvrez Udarsy — notre mission est de rendre l'éducation accessible à tous les élèves marocains.",
  openGraph: {
    title: "من نحن | Udarsy",
    description:
      "تعرف على منصة يودرسي — مهمتنا تسهيل التعلم للتلاميذ المغاربة.",
    type: "website",
    url: "/about",
  },
  twitter: {
    card: "summary",
    title: "من نحن | Udarsy",
    description: "تعرف على منصة يودرسي ومهمتنا التعليمية.",
  },
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
