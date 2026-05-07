import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة ملفات تعريف الارتباط | Politique de Cookies",
  description:
    "سياسة ملفات تعريف الارتباط لمنصة يودرسي — كيفية استخدامنا لملفات تعريف الارتباط. Politique de cookies de Udarsy.",
  openGraph: {
    title: "سياسة ملفات تعريف الارتباط | Udarsy",
    description: "سياسة ملفات تعريف الارتباط لمنصة يودرسي.",
    type: "website",
    url: "/cookies",
  },
  robots: { index: true, follow: false },
  alternates: { canonical: "/cookies" },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
