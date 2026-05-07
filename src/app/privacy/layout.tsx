import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | Politique de Confidentialité",
  description:
    "سياسة خصوصية منصة يودرسي — كيفية جمع واستخدام وحماية بياناتك الشخصية. Politique de confidentialité de Udarsy — comment nous collectons, utilisons et protégeons vos données.",
  openGraph: {
    title: "سياسة الخصوصية | Udarsy",
    description: "سياسة خصوصية منصة يودرسي.",
    type: "website",
    url: "/privacy",
  },
  robots: { index: true, follow: false },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
