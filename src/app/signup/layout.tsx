import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إنشاء حساب | Créer un Compte",
  description: "انضم إلى يودرسي مجاناً وابدأ رحلتك التعليمية اليوم. Rejoignez Udarsy gratuitement.",
  robots: { index: false, follow: false },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
