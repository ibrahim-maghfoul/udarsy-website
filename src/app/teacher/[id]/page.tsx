import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";
import TeacherPageClient from "./TeacherPageClient";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const teacher = await serverFetch<any>(`/teacher/profiles/${id}`, { revalidate: 3600 });

  if (!teacher) return { title: "Teacher | Udarsy" };

  const name = teacher.fullName || teacher.userId?.displayName || "Teacher";
  const title = `${name} | Udarsy`;
  const description = teacher.bio?.slice(0, 160) || `${name} — ${teacher.specialist || "Enseignant"} sur Udarsy.`;
  const rawPhoto = teacher.photoURL || teacher.userId?.photoURL;
  const image = rawPhoto?.startsWith("http") ? rawPhoto : `${SITE_URL}/og-image.png`;
  const url = `${SITE_URL}/teacher/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "profile",
      images: [{ url: image, width: 1200, height: 630, alt: name }],
      siteName: "Udarsy",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@udarsyschool",
    },
  };
}

export default function TeacherPage() {
  return <TeacherPageClient />;
}
