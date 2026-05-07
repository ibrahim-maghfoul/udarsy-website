import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "انضم كمدرّس | Devenir Instructeur",
  description:
    "هل أنت أستاذ أو متخصص؟ انضم إلى يودرسي كمدرّس وشارك دوراتك مع آلاف التلاميذ المغاربة. Vous êtes professeur ? Rejoignez Udarsy comme instructeur et partagez vos cours.",
  openGraph: {
    title: "انضم كمدرّس | Udarsy",
    description:
      "انضم إلى يودرسي كمدرّس وشارك دوراتك مع آلاف التلاميذ المغاربة.",
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

export default function ApplyInstructorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
