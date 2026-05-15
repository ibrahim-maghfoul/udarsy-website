import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const article = await serverFetch(`/news/${id}`, { revalidate: 3600 });
    if (!article) throw new Error("Not found");
    const title = article.title || "خبر تعليمي";
    const description = article.description
      ? article.description.slice(0, 160)
      : "اقرأ آخر أخبار التعليم المغربي على منصة درسي.";
    const image = article.image?.startsWith("http") ? article.image : "/og-image.png";
    return {
      title,
      description,
      openGraph: {
        title: `${title} | Udarsy`,
        description,
        type: "article",
        url: `/news/${id}`,
        images: [{ url: image, width: 1200, height: 630, alt: title }],
        ...(article.createdAt && { publishedTime: article.createdAt }),
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Udarsy`,
        description,
        images: [image],
      },
      alternates: { canonical: `/news/${id}` },
    };
  } catch {
    return {
      title: "أخبار التعليم",
      description: "اقرأ آخر أخبار التعليم المغربي على منصة درسي.",
    };
  }
}

export default function NewsArticleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
