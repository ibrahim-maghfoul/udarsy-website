import type { MetadataRoute } from "next";
import { serverFetch } from "@/lib/serverFetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.udarsy.com";

function toSlug(title: string): string {
  const nfd = title.toLowerCase().normalize('NFD');
  let stripped = '';
  for (const ch of nfd) {
    const cp = ch.codePointAt(0)!;
    if (cp >= 0x0300 && cp <= 0x036F) continue;
    stripped += ch;
  }
  return stripped
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9؀-ۿ-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'school';
}

const TEAM_SLUGS = [
  "ibrahim-maghfoul",
  "abderrahman-aouinat",
  "mouhamed-demo",
  "ayman-nouri",
  "asmae-monaghim",
  "safae-el-oujdi",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    // Core learning
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/news`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    // Community
    { url: `${SITE_URL}/rankings`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/contributions`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/teacher`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/instructors`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    // Tools
    { url: `${SITE_URL}/grades-calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/calendar`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/download`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    // Apply / Join
    { url: `${SITE_URL}/apply-instructor`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/apply-teacher`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/report`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    // Company
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const teamRoutes: MetadataRoute.Sitemap = TEAM_SLUGS.map((slug) => ({
    url: `${SITE_URL}/team/${slug}`,
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  const [newsData, lessonData, guidanceData, subjectData, schoolData, levelData, teacherData, instructorData, serviceData] = await Promise.all([
    serverFetch<any>('/news?limit=500', { cache: 'no-store' }),
    serverFetch<{ _id: string; slug: string }[]>('/data/lessons/all', { cache: 'no-store' }),
    serverFetch<{ _id: string; slug: string }[]>('/data/guidances/all', { cache: 'no-store' }),
    serverFetch<{ _id: string; slug: string }[]>('/data/subjects/all', { cache: 'no-store' }),
    serverFetch<{ _id: string; title: string }[]>('/data/schools', { cache: 'no-store' }),
    serverFetch<{ levelSlug: string; schoolSlug: string }[]>('/data/levels/all', { cache: 'no-store' }),
    serverFetch<any[]>('/teacher/profiles', { cache: 'no-store' }),
    serverFetch<any[]>('/instructor', { cache: 'no-store' }),
    serverFetch<any[]>('/data/school-services', { cache: 'no-store' }),
  ]);

  const newsList: { _id: string; slug?: string; updatedAt?: string; createdAt?: string }[] =
    newsData?.news || (Array.isArray(newsData) ? newsData : []);
  const lessonList: { _id: string; slug: string }[] = Array.isArray(lessonData) ? lessonData : [];
  const guidanceList: { _id: string; slug: string }[] = Array.isArray(guidanceData) ? guidanceData : [];
  const subjectList: { _id: string; slug: string }[] = Array.isArray(subjectData) ? subjectData : [];
  const schoolList: { _id: string; title: string }[] = Array.isArray(schoolData) ? schoolData : [];
  const levelList: { levelSlug: string; schoolSlug: string }[] = Array.isArray(levelData) ? levelData : [];
  const teacherList: { _id: string }[] = Array.isArray(teacherData) ? teacherData : [];
  const instructorList: { _id: string }[] = Array.isArray(instructorData) ? instructorData : [];
  const serviceList: { _id: string }[] = Array.isArray(serviceData) ? serviceData : [];

  const newsRoutes: MetadataRoute.Sitemap = newsList.map((n) => ({
    url: `${SITE_URL}/news/${n.slug || n._id}`,
    lastModified: n.updatedAt || n.createdAt || now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const schoolRoutes: MetadataRoute.Sitemap = schoolList.map((s) => ({
    url: `${SITE_URL}/courses/${toSlug(s.title)}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const levelRoutes: MetadataRoute.Sitemap = levelList.map((l) => ({
    url: `${SITE_URL}/courses/${l.schoolSlug}/${l.levelSlug}`,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const guidanceRoutes: MetadataRoute.Sitemap = guidanceList.map((g) => ({
    url: `${SITE_URL}/courses/${g.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const subjectRoutes: MetadataRoute.Sitemap = subjectList.map((s) => ({
    url: `${SITE_URL}/courses/subject/${s.slug}`,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const lessonRoutes: MetadataRoute.Sitemap = lessonList.flatMap((l) => [
    { url: `${SITE_URL}/lesson/${l.slug || l._id}`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${SITE_URL}/lesson/${l.slug || l._id}/preview`, changeFrequency: "monthly" as const, priority: 0.5 },
  ]);

  const teacherRoutes: MetadataRoute.Sitemap = teacherList.map((t) => ({
    url: `${SITE_URL}/teacher/${t._id}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const instructorRoutes: MetadataRoute.Sitemap = instructorList.map((i) => ({
    url: `${SITE_URL}/instructor/${i._id}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = serviceList.map((s) => ({
    url: `${SITE_URL}/services/${s._id}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...teamRoutes,
    ...schoolRoutes,
    ...levelRoutes,
    ...guidanceRoutes,
    ...subjectRoutes,
    ...newsRoutes,
    ...lessonRoutes,
    ...teacherRoutes,
    ...instructorRoutes,
    ...serviceRoutes,
  ];
}