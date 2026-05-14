import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "انضم كمدرّس", fr: "Devenir Instructeur", en: "Become Instructor" }),
    description:
      "هل أنت أستاذ أو متخصص؟ انضم إلى يودرسي كمدرّس وشارك دوراتك مع آلاف التلاميذ المغاربة.",
    openGraph: {
      title: "انضم كمدرّس | Udarsy",
      description: "انضم إلى يودرسي كمدرّس وشارك دوراتك مع آلاف التلاميذ المغاربة.",
      type: "website",
      url: "/apply-instructor",
    },
    twitter: {
      card: "summary",
      title: "انضم كمدرّس | Udarsy",
      description: "انضم إلى يودرسي كمدرّس وشارك دوراتك.",
    },
    alternates: { canonical: "/apply-instructor" },
  };
}

export default function ApplyInstructorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
