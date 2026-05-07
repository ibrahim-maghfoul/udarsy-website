import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل الدخول | Connexion",
  description: "سجّل دخولك إلى منصة يودرسي لمتابعة تقدمك الدراسي. Connectez-vous à Udarsy.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
