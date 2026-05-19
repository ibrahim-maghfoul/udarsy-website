import type { Metadata } from "next";
import { serverFetch } from "@/lib/serverFetch";
import NewsDetailClient from "./NewsDetailClient";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await serverFetch<any>(`/news/${id}`, { revalidate: 3600 });

  if (!article) {
    return { title: "Article | Udarsy" };
  }

  const title = `${article.title} | Udarsy`;
  const description = article.description?.slice(0, 160) || article.title;
  const image = article.imageUrl || article.images?.[0]?.src || `${SITE_URL}/og-image.png`;
  const url = `${SITE_URL}/news/${id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.createdAt,
      modifiedTime: article.updatedAt || article.createdAt,
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

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const article = await serverFetch<any>(`/news/${id}`, { revalidate: 3600 });

  const articleUrl = `${SITE_URL}/news/${id}`;
  const articleImage = article?.imageUrl || article?.images?.[0]?.src || `${SITE_URL}/og-image.png`;

  const avgRating =
    article?.ratings?.length > 0
      ? article.ratings.reduce((sum: number, r: { value: number }) => sum + r.value, 0) /
        article.ratings.length
      : null;

  const articleSchema = article
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "@id": `${articleUrl}#article`,
        headline: article.title,
        description: article.description?.slice(0, 160) || article.title,
        image: articleImage,
        datePublished: article.createdAt,
        dateModified: article.updatedAt || article.createdAt,
        url: articleUrl,
        inLanguage: article.language === "fr" ? "fr" : "ar",
        articleSection: article.category || "Education",
        keywords: Array.isArray(article.tags) ? article.tags.join(", ") : undefined,
        isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
        publisher: {
          "@type": "EducationalOrganization",
          "@id": `${SITE_URL}/#organization`,
          name: "Udarsy",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/og-image.png` },
        },
        author: {
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "Udarsy",
        },
        ...(avgRating !== null && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating.toFixed(1),
            ratingCount: article.ratings.length,
            bestRating: 5,
            worstRating: 1,
          },
        }),
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".article-description", "article p:first-of-type"],
        },
      }
    : null;

  const qaItems: { question: string; answer: string }[] = Array.isArray(article?.qaList)
    ? article.qaList.filter(
        (q: { question?: string; answer?: string }) => q.question && q.answer
      )
    : [];

  const faqSchema =
    qaItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: qaItems.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        }
      : null;

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <NewsDetailClient initialArticle={article} />
    </>
  );
}
