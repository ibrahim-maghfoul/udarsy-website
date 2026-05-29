import type { Metadata } from "next";

// The /preview route is an in-app resource viewer (PDF/video with progress timer),
// not a marketing landing page. We keep it functional for logged-in students but
// tell crawlers to skip it so SERPs don't surface weak "Lesson - Udarsy" snippets
// that compete with the real /lesson/* hierarchical URLs.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
