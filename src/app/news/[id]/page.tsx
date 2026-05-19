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

  const jsonLd = article
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description: article.description?.slice(0, 160) || article.title,
        image: article.imageUrl || article.images?.[0]?.src || `${SITE_URL}/og-image.png`,
        datePublished: article.createdAt,
        dateModified: article.updatedAt || article.createdAt,
        url: `${SITE_URL}/news/${id}`,
        inLanguage: "ar",
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
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".article-description", "article p:first-of-type"],
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <NewsDetailClient initialArticle={article} />
    </>
  );
}
