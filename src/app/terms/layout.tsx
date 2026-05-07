import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شروط الخدمة | Terms of Service",
  description:
    "شروط خدمة منصة يودرسي — القواعد واللوائح التي تحكم استخدامك للمنصة. Conditions de service de Udarsy.",
  openGraph: {
    title: "شروط الخدمة | Udarsy",
    description: "شروط خدمة منصة يودرسي.",
    type: "website",
    url: "/terms",
  },
  robots: { index: true, follow: false },
  alternates: { canonical: "/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
