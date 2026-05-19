import type { MetadataRoute } from "next";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/explore`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/rankings`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/contributions`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/teacher`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/instructors`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/grades-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/download`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/apply-instructor`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/apply-teacher`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/calendar`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
  ];

  const [newsData, lessonData] = await Promise.all([
    serverFetch<any>('/news?limit=200', { revalidate: 86400 }),
    serverFetch<{ _id: string }[]>('/data/lessons/all', { revalidate: 86400 }),
  ]);

  const newsList: { _id: string }[] = newsData?.news || (Array.isArray(newsData) ? newsData : []);
  const lessonList: { _id: string }[] = Array.isArray(lessonData) ? lessonData : [];

  const newsIds = newsList.map((n) => String(n._id));
  const lessonIds = lessonList.map((l) => String(l._id));

  const newsRoutes: MetadataRoute.Sitemap = newsList.map((n) => ({
    url: `${SITE_URL}/news/${n._id}`,
    lastModified: (n as any).updatedAt || (n as any).createdAt || now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const lessonRoutes: MetadataRoute.Sitemap = lessonIds.map((id) => ({
    url: `${SITE_URL}/lesson/${id}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...newsRoutes, ...lessonRoutes];
}
