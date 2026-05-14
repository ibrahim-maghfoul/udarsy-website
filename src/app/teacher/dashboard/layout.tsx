import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "لوحة الأستاذ", fr: "Tableau de Bord", en: "Teacher Dashboard" }),
    description: "أدر قاعاتك الدراسية وملفك الشخصي كأستاذ على منصة يودرسي.",
    robots: { index: false, follow: false },
  };
}

export default function TeacherDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
