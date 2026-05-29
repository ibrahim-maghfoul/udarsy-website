import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";
import "./calendar.css";
import "../../styles/pickers.css";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "التقويم الدراسي", fr: "Calendrier", en: "Calendar" }),
    description:
      "نظم جدولك الدراسي، مواعيدك والمهام اليومية مع تقويم يودرسي.",
    openGraph: {
      title: "التقويم الدراسي | Udarsy",
      description: "نظم جدولك الدراسي، مواعيدك والمهام اليومية مع تقويم يودرسي.",
      type: "website",
      url: "/calendar",
    },
    twitter: {
      card: "summary",
      title: "التقويم الدراسي | Udarsy",
      description: "نظم جدولك الدراسي مع تقويم يودرسي.",
    },
    alternates: { canonical: "/calendar" },
  };
}

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
