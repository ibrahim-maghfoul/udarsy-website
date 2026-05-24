import api from "@/lib/api";
import { School, Level, Guidance, Subject, Lesson } from "@/types";

export const getSchools = async (): Promise<School[]> => {
    const res = await api.get('/data/schools');
    return res.data.map((s: any) => ({ ...s, id: s._id }));
};

export const getLevels = async (schoolId: string): Promise<Level[]> => {
    const res = await api.get(`/data/levels/${schoolId}`);
    return res.data.map((l: any) => ({ ...l, id: l._id }));
};

export const getGuidances = async (levelId: string): Promise<Guidance[]> => {
    const res = await api.get(`/data/guidances/${levelId}`);
    return res.data.map((g: any) => ({ ...g, id: g._id }));
};

export function subjectSlug(title: string): string {
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
        .replace(/^-|-$/g, '') || 'subject';
}

export const getSubjects = async (guidanceId: string): Promise<Subject[]> => {
    const res = await api.get(`/data/subjects/${guidanceId}`);
    return res.data.map((s: any) => ({ ...s, id: s._id, slug: s.slug ?? subjectSlug(s.title) }));
};

export function guidanceSlug(title: string): string {
    return subjectSlug(title);
}

// Backend now enriches both guidance endpoints with parent { level, school } and an
// `implicit` flag so callers can build hierarchical /courses URLs without walking the
// curriculum tree themselves. Older fields (_id, title, slug) are unchanged.
export type GuidanceWithChain = Guidance & {
    _id: string;
    slug?: string;
    implicit?: boolean;
    level?: { _id: string; title: string; slug: string } | null;
    school?: { _id: string; title: string; slug: string } | null;
};

export const getGuidanceBySlug = async (slug: string): Promise<GuidanceWithChain> => {
    const res = await api.get(`/data/guidance/by-slug/${slug}`);
    return { ...res.data, id: res.data._id };
};

// Canonical fetch by _id. Title-slugs are NOT unique across the curriculum
// (multiple guidances/subjects share the same title), so in-app navigation must
// use _id; getGuidanceBySlug / getSubjectBySlug are best-effort fallbacks only.
export const getGuidanceById = async (id: string): Promise<GuidanceWithChain | null> => {
    try {
        const res = await api.get(`/data/guidance/${id}`);
        if (!res.data?._id) return null;
        return { ...res.data, id: res.data._id };
    } catch { return null; }
};

export const getSubjectBySlug = async (slug: string): Promise<Subject & { _id: string }> => {
    const res = await api.get(`/data/subject/by-slug/${slug}`);
    return { ...res.data, id: res.data._id };
};

export const getSubjectById = async (id: string): Promise<(Subject & { _id: string }) | null> => {
    try {
        const res = await api.get(`/data/subject/${id}`);
        if (!res.data?._id) return null;
        return { ...res.data, id: res.data._id };
    } catch { return null; }
};

// Walk the curriculum tree by title-slugs. Used by the hierarchical /courses/... routes
// to translate a pretty URL into the canonical _id chain that the rest of the app uses.
export type CurriculumChain = {
    school: { _id: string; title: string; slug: string };
    level?: { _id: string; title: string; slug: string };
    guidance?: { _id: string; title: string; slug: string; implicit: boolean };
    subject?: { _id: string; title: string; slug: string };
    lesson?: { _id: string; title: string; slug: string };
};
export type ResolvedPath = { kind: 'school' | 'level' | 'guidance' | 'subject' | 'lesson'; chain: CurriculumChain };

export const resolveCurriculumPath = async (segments: string[]): Promise<ResolvedPath | null> => {
    if (segments.length === 0) return null;
    try {
        const qs = segments.map(s => `p=${encodeURIComponent(s)}`).join('&');
        const res = await api.get(`/data/path-resolve?${qs}`);
        return res.data ?? null;
    } catch { return null; }
};

// Build a hierarchical URL from a partial chain. Skips the guidance segment when it's
// implicit (e.g. Primaire/Collège levels with a single "General" guidance).
export const curriculumPath = (chain: Partial<CurriculumChain>): string => {
    const parts: string[] = [];
    if (chain.school)   parts.push(chain.school.slug);
    if (chain.level)    parts.push(chain.level.slug);
    if (chain.guidance && !chain.guidance.implicit) parts.push(chain.guidance.slug);
    if (chain.subject)  parts.push(chain.subject.slug);
    if (chain.lesson)   parts.push(chain.lesson.slug);
    return '/courses/' + parts.map(encodeURIComponent).join('/');
};

export const getLessons = async (subjectId: string): Promise<Lesson[]> => {
    const res = await api.get(`/data/lessons/${subjectId}`);
    return res.data.map((l: any) => ({ ...l, id: l._id }));
};

export function lessonSlug(title: string): string {
    return subjectSlug(title);
}

export const getLessonBySlug = async (slug: string): Promise<Lesson & { _id: string }> => {
    const res = await api.get(`/data/lesson/by-slug/${slug}`);
    return { ...res.data, id: res.data._id };
};

export const getLessonById = async (lessonId: string): Promise<Lesson | null> => {
    try {
        const res = await api.get(`/data/lesson/${lessonId}`);
        if (!res.data?._id) return null;
        return { ...res.data, id: res.data._id };
    } catch {
        return null;
    }
};

// No-op prefetch stubs — kept so callers don't break
export function prefetchLevels(_schoolId: string) {}
export function prefetchGuidances(_levelId: string) {}
export function prefetchSubjects(_guidanceId: string) {}
export function prefetchLessons(_subjectId: string) {}
