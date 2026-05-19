import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";
import LessonPageClient from "./LessonPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = await serverFetch<any>(`/data/lesson/by-slug/${lessonId}`, { revalidate: 3600 });

  if (!lesson) return { title: "Lesson | Udarsy" };

  const title = `${lesson.title} | Udarsy`;
  const description = `${lesson.title} — cours, exercices et examens sur Udarsy, la plateforme éducative marocaine.`;
  const image = `${SITE_URL}/og-image.png`;
  const url = `${SITE_URL}/lesson/${lessonId}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: lesson.title }],
      siteName: "Udarsy",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@UdarsyMa",
    },
  };
}

export default function LessonPage() {
  return <LessonPageClient />;
}
