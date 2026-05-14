import type { Metadata } from "next";
import { pageTitle } from "@/lib/page-title";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: await pageTitle({ ar: "تواصل معنا", fr: "Contact", en: "Contact" }),
    description:
      "تواصل مع فريق يودرسي — أسئلة، اقتراحات أو شراكات.",
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
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
