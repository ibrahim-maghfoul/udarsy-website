import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "لوحة المدرّس", fr: "Tableau de Bord", en: "Dashboard" }),
    description: "أدر دوراتك وتحليلاتك كمدرّس على منصة يودرسي.",
    robots: { index: false, follow: false },
  };
}

export default function InstructorDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
