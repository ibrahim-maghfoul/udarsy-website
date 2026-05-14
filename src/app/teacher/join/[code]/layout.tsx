import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "الانضمام للقاعة", fr: "Rejoindre la Classe", en: "Join Class" }),
    description: "انضم إلى قاعة دراسية على منصة يودرسي باستخدام رمز الدعوة.",
    robots: { index: false, follow: false },
  };
}

export default function JoinRoomLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
