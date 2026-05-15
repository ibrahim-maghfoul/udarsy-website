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

export const getGuidanceBySlug = async (slug: string): Promise<Guidance & { _id: string }> => {
    const res = await api.get(`/data/guidance/by-slug/${slug}`);
    return { ...res.data, id: res.data._id };
};

export const getSubjectBySlug = async (slug: string): Promise<Subject & { _id: string }> => {
    const res = await api.get(`/data/subject/by-slug/${slug}`);
    return { ...res.data, id: res.data._id };
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
