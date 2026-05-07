import type { Metadata } from "next";
import "./calendar.css";

export const metadata: Metadata = {
  title: "التقويم الدراسي | Calendrier Scolaire",
  description:
    "نظم جدولك الدراسي، مواعيدك والمهام اليومية مع تقويم يودرسي. Gérez vos événements, to-dos et calendrier académique avec Udarsy.",
  openGraph: {
    title: "التقويم الدراسي | Udarsy",
    description:
      "نظم جدولك الدراسي، مواعيدك والمهام اليومية مع تقويم يودرسي.",
    type: "website",
    url: "/calendar",
  },
  twitter: {
    card: "summary",
    title: "التقويم الدراسي | Udarsy",
    description: "نظم جدولك الدراسي مع تقويم يودرسي.",
  },
};

export default function CalendarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
