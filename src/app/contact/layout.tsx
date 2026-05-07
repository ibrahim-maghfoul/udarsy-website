import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تواصل معنا | Contactez-nous",
  description:
    "تواصل مع فريق يودرسي — أسئلة، اقتراحات أو شراكات. Contactez l'équipe Udarsy pour toute question, suggestion ou partenariat.",
  openGraph: {
    title: "تواصل معنا | Udarsy",
    description: "تواصل مع فريق يودرسي — أسئلة، اقتراحات أو شراكات.",
    type: "website",
    url: "/contact",
  },
  twitter: {
    card: "summary",
    title: "تواصل معنا | Udarsy",
    description: "تواصل مع فريق يودرسي.",
  },
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
