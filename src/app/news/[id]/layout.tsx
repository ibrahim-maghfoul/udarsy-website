import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: rawId } = await params;
  try {
    const article = await serverFetch(`/news/${rawId}`, { revalidate: 3600 }) as Record<string, unknown>;
    if (!article) throw new Error("Not found");
    const title = (article.title as string) || "خبر تعليمي";
    const description = (article.description as string)
      ? (article.description as string).slice(0, 160)
      : "اقرأ آخر أخبار التعليم المغربي على منصة درسي.";
    const image = typeof article.image === "string" && article.image.startsWith("http") ? article.image : "/og-image.png";
    const canonicalId = (article.slug as string) ?? rawId;
    return {
      title,
      description,
      openGraph: {
        title: `${title} | Udarsy`,
        description,
        type: "article",
        url: `/news/${canonicalId}`,
        images: [{ url: image, width: 1200, height: 630, alt: title }],
        ...(article.createdAt ? { publishedTime: article.createdAt as string } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Udarsy`,
        description,
        images: [image],
      },
      alternates: { canonical: `/news/${canonicalId}` },
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
