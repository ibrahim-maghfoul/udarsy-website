import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "انضم كأستاذ | Devenir Professeur Udarsy",
  description:
    "هل أنت أستاذ تريد الوصول إلى تلاميذ جدد؟ قدّم طلب التحقق من هويتك كأستاذ على منصة يودرسي. Êtes-vous professeur ? Soumettez votre demande de vérification sur Udarsy.",
  openGraph: {
    title: "انضم كأستاذ | Udarsy",
    description: "قدّم طلب التحقق من هويتك كأستاذ على منصة يودرسي.",
    type: "website",
    url: "/apply-teacher",
  },
  twitter: {
    card: "summary",
    title: "انضم كأستاذ | Udarsy",
    description: "قدّم طلبك كأستاذ معتمد على منصة يودرسي.",
  },
  alternates: { canonical: "/apply-teacher" },
};

export default function ApplyTeacherLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
