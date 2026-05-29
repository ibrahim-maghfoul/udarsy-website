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
    serverFetch<{ _id: string; slug: string; subjectId: string }[]>('/data/lessons/all', { cache: 'no-store' }),
    serverFetch<{ _id: string; slug: string; levelId: string }[]>('/data/guidances/all', { cache: 'no-store' }),
    serverFetch<{ _id: string; slug: string; guidanceId: string }[]>('/data/subjects/all', { cache: 'no-store' }),
    serverFetch<{ _id: string; title: string }[]>('/data/schools', { cache: 'no-store' }),
    serverFetch<{ _id: string; levelSlug: string; schoolId: string; schoolSlug: string }[]>('/data/levels/all', { cache: 'no-store' }),
    serverFetch<any[]>('/teacher/profiles', { cache: 'no-store' }),
    serverFetch<any[]>('/instructor', { cache: 'no-store' }),
    serverFetch<any[]>('/data/school-services', { cache: 'no-store' }),
  ]);

  const newsList: { _id: string; slug?: string; updatedAt?: string; createdAt?: string }[] =
    newsData?.news || (Array.isArray(newsData) ? newsData : []);
  const lessonList = Array.isArray(lessonData) ? lessonData : [];
  const guidanceList = Array.isArray(guidanceData) ? guidanceData : [];
  const subjectList = Array.isArray(subjectData) ? subjectData : [];
  const schoolList = Array.isArray(schoolData) ? schoolData : [];
  const levelList = Array.isArray(levelData) ? levelData : [];
  const teacherList: { _id: string }[] = Array.isArray(teacherData) ? teacherData : [];
  const instructorList: { _id: string }[] = Array.isArray(instructorData) ? instructorData : [];
  const serviceList: { _id: string }[] = Array.isArray(serviceData) ? serviceData : [];

  // Build the chain lookups used to produce hierarchical URLs.
  // The implicit-guidance flag mirrors the catch-all route: a level with exactly one
  // guidance (Primaire/Collège "General") omits the guidance segment from URLs.
  const guidancesByLevel = new Map<string, typeof guidanceList>();
  for (const g of guidanceList) {
    const arr = guidancesByLevel.get(String(g.levelId)) ?? [];
    arr.push(g);
    guidancesByLevel.set(String(g.levelId), arr);
  }
  const levelById = new Map(levelList.map(l => [String(l._id), l]));
  const guidanceById = new Map(guidanceList.map(g => [String(g._id), g]));
  const subjectById = new Map(subjectList.map(s => [String(s._id), s]));

  // Returns school/level prefix and whether the guidance segment is implicit (single-
  // guidance level — skip it in URL). Returns null if any join fails.
  function chainPrefix(levelId: string): { schoolSlug: string; levelSlug: string; implicitGuidance: boolean } | null {
    const level = levelById.get(String(levelId));
    if (!level) return null;
    const siblings = guidancesByLevel.get(String(levelId)) ?? [];
    return { schoolSlug: level.schoolSlug, levelSlug: level.levelSlug, implicitGuidance: siblings.length === 1 };
  }

  function guidancePath(g: { slug: string; levelId: string }): string | null {
    const p = chainPrefix(g.levelId);
    if (!p) return null;
    // Single-guidance levels collapse to /courses/<school>/<level>/<subject>; the
    // guidance landing itself isn't a useful sitemap target there.
    if (p.implicitGuidance) return null;
    return `/courses/${p.schoolSlug}/${p.levelSlug}/${g.slug}`;
  }

  function subjectPath(s: { slug: string; guidanceId: string }): string | null {
    const g = guidanceById.get(String(s.guidanceId));
    if (!g) return null;
    const p = chainPrefix(g.levelId);
    if (!p) return null;
    const segs = [p.schoolSlug, p.levelSlug];
    if (!p.implicitGuidance) segs.push(g.slug);
    segs.push(s.slug);
    return `/courses/${segs.join('/')}`;
  }

  function lessonPath(l: { slug: string; subjectId: string }): string | null {
    const s = subjectById.get(String(l.subjectId));
    if (!s) return null;
    const subjUrl = subjectPath(s);
    if (!subjUrl) return null;
    return `${subjUrl}/${l.slug}`;
  }

  const enc = (u: string) => u.split('/').map(p => p.startsWith('http') ? p : encodeURIComponent(p)).join('/').replace(`${encodeURIComponent('https')}%3A`, 'https:').replace(`${encodeURIComponent('http')}%3A`, 'http:');

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

  // Hierarchical URLs joined from the parent chains. Single-guidance levels skip the
  // guidance segment (no "/general/" in Primaire/Collège URLs). Title-only slug
  // collisions don't matter here because each level/guidance/subject scope is unique
  // within its parent (verified by find-same-parent-twins.ts).
  const guidanceRoutes: MetadataRoute.Sitemap = guidanceList
    .map(g => guidancePath(g))
    .filter((u): u is string => !!u)
    .map(u => ({ url: `${SITE_URL}${enc(u)}`, changeFrequency: "weekly" as const, priority: 0.8 }));

  const subjectRoutes: MetadataRoute.Sitemap = subjectList
    .map(s => subjectPath(s))
    .filter((u): u is string => !!u)
    .map(u => ({ url: `${SITE_URL}${enc(u)}`, changeFrequency: "weekly" as const, priority: 0.75 }));

  const lessonRoutes: MetadataRoute.Sitemap = lessonList.flatMap(l => {
    const u = lessonPath(l);
    if (!u) return [];
    return [{ url: `${SITE_URL}${enc(u)}`, changeFrequency: "monthly" as const, priority: 0.7 }];
  });

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