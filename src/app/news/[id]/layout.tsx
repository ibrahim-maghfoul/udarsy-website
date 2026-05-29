import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

type Article = {
  _id?: string;
  slug?: string;
  title?: string;
  description?: string;
  content?: string;
  image?: string;
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  language?: string;
};

async function fetchArticle(rawId: string): Promise<Article | null> {
  return (await serverFetch<Article>(`/news/${rawId}`, { revalidate: 3600 })) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: rawId } = await params;
  try {
    const article = await fetchArticle(rawId);
    if (!article) throw new Error("Not found");
    const title = article.title || "خبر تعليمي";
    const description = article.description
      ? article.description.slice(0, 160)
      : "اقرأ آخر أخبار التعليم المغربي على منصة درسي.";
    const image = typeof article.image === "string" && article.image.startsWith("http") ? article.image : "/og-image.png";
    const canonicalId = article.slug ?? rawId;
    return {
      title,
      description,
      openGraph: {
        title: `${title} | Udarsy`,
        description,
        type: "article",
        url: `/news/${canonicalId}`,
        images: [{ url: image, width: 1200, height: 630, alt: title }],
        ...(article.createdAt ? { publishedTime: article.createdAt } : {}),
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

// Server component that emits NewsArticle + BreadcrumbList JSON-LD. NewsArticle
// is what Google looks for to consider a page for the Top Stories carousel,
// Discover feed, and AI Overview citations. Article alone (which Next emits via
// openGraph.type='article') isn't enough — Google wants the explicit schema.
async function NewsArticleSchemas({ rawId }: { rawId: string }) {
  try {
    const article = await fetchArticle(rawId);
    if (!article) return null;
    const canonicalId = article.slug ?? rawId;
    const articleUrl = `${SITE_URL}/news/${canonicalId}`;
    const image = typeof article.image === "string" && article.image.startsWith("http")
      ? article.image
      : `${SITE_URL}/og-image.png`;

    const newsArticleSchema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "@id": `${articleUrl}#article`,
      headline: article.title,
      description: article.description,
      image: [image],
      url: articleUrl,
      mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
      datePublished: article.createdAt,
      dateModified: article.updatedAt ?? article.createdAt,
      inLanguage: article.language === "ar" ? "ar-MA" : article.language === "fr" ? "fr-MA" : "ar-MA",
      author: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Udarsy",
        url: SITE_URL,
      },
      publisher: {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Udarsy",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
        },
      },
      ...(article.category ? { articleSection: article.category } : {}),
      ...(article.tags && article.tags.length > 0 ? { keywords: article.tags.join(", ") } : {}),
      isAccessibleForFree: true,
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Udarsy", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "News", item: `${SITE_URL}/news` },
        { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
      ],
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </>
    );
  } catch {
    return null;
  }
}

export default async function NewsArticleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <NewsArticleSchemas rawId={id} />
      {children}
    </>
  );
}
