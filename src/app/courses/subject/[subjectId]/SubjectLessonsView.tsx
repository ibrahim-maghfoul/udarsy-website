"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    BookOpen, FileText, Play, ArrowLeft,
    ClipboardList, CheckCircle2, GraduationCap, Search
} from "lucide-react";
import { getLessons, getSubjectBySlug, getSubjectById, curriculumPath, type CurriculumChain } from "@/services/data";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations, useLocale } from "next-intl";
import "./lesson-cards.css";

// Inner view component. The default export below wraps it in a Next-PageProps-
// compatible signature; the catch-all /courses/[...path] route imports this
// view directly to pass `subjectId` + `chain` explicitly.
export function SubjectLessonsView({ subjectId: subjectIdProp, chain }: { subjectId?: string; chain?: CurriculumChain } = {}) {
    const params = useParams();
    // Either passed in by the hierarchical /courses/[...] catch-all (canonical _id),
    // or read from the [subjectId] URL segment (also _id; slug fallback for legacy).
    const subjectParam = (subjectIdProp ?? (params.subjectId as string)) || '';
    const { user } = useAuth();
    const router = useRouter();
    const [subjectTitle, setSubjectTitle] = useState('');
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState('');
    const t = useTranslations("Lesson");
    const locale = useLocale();
    const isAr = locale === 'ar';

    useEffect(() => {
        if (!subjectParam) return;
        setError(false);
        setLoading(true);
        (async () => {
            // Prefer fetch by canonical _id; fall back to slug only for legacy URLs.
            const subject = (await getSubjectById(subjectParam)) ?? (await getSubjectBySlug(subjectParam).catch(() => null));
            if (!subject) { setError(true); setLoading(false); return; }
            setSubjectTitle(subject.title ?? '');
            const lessonsRes = await getLessons(subject._id);
            setLessons(lessonsRes);
            setLoading(false);
        })().catch(() => { setError(true); setLoading(false); });
    }, [subjectParam]);

    const filteredLessons = search.trim()
        ? lessons.filter(l => l.title?.toLowerCase().includes(search.trim().toLowerCase()))
        : lessons;

    return (
        <div className="min-h-screen bg-[#fafbfc]">
            {/* Mobile sticky header */}
            <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-green/8 flex items-center gap-3 px-4 py-3 shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="w-8 h-8 rounded-full bg-green/8 border border-green/15 flex items-center justify-center text-green shrink-0"
                >
                    <ArrowLeft size={16} />
                </button>
                <span className="font-bold text-dark/70 text-sm truncate">{subjectTitle || t("back_subjects")}</span>
            </div>

            {/* Header */}
            <header className="hidden md:block relative overflow-hidden bg-gradient-to-b from-[#f0f7f3] to-transparent border-b border-green/8 pt-32 pb-10 px-6">
                {/* Decorative blobs — GPU-accelerated, pointer-events off */}
                <div
                    className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-green/5 blur-3xl pointer-events-none"
                    style={{ transform: 'translate3d(30%, -30%, 0)' }}
                />
                <div
                    className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-green/4 blur-2xl pointer-events-none"
                    style={{ transform: 'translate3d(-20%, 20%, 0)' }}
                />

                <div className="max-w-6xl mx-auto relative">
                    <button
                        onClick={() => router.back()}
                        className={`btn-back mb-5 ${isAr ? 'rtl flex-row-reverse' : ''}`}
                    >
                        <ArrowLeft size={15} className={`btn-back-arrow ${isAr ? 'rotate-180' : ''}`} />
                        {t("back_subjects")}
                    </button>

                    {/* Title + search on the same row */}
                    <div className={`flex items-end justify-between gap-6 ${isAr ? 'flex-row-reverse' : ''}`}>
                        <div>
                            <h1 className="text-2xl font-bold text-dark">{subjectTitle || t("back_subjects")}</h1>
                        </div>

                        {/* Search bar */}
                        <div className="relative w-72 shrink-0">
                            <Search
                                size={15}
                                className="absolute top-1/2 -translate-y-1/2 text-green/40 pointer-events-none"
                                style={{ [isAr ? 'right' : 'left']: '12px' }}
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search lessons…"
                                className={`w-full py-2.5 text-sm bg-white border border-green/20 rounded-xl text-dark placeholder:text-gray-400 focus:outline-none focus:border-green/40 focus:ring-2 focus:ring-green/8 ${isAr ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4'}`}
                                dir={isAr ? 'rtl' : undefined}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto pt-4 md:pt-10 pb-[120px] md:pb-32 px-4 md:px-6">

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" dir={isAr ? "rtl" : undefined}>
                        {Array(6).fill(0).map((_, i) => (
                            <div
                                key={i}
                                className="lesson-card-skeleton"
                                style={{ animationDelay: `${i * 70}ms` }}
                            />
                        ))}
                    </div>
                ) : filteredLessons.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" dir={isAr ? "rtl" : undefined}>
                        {filteredLessons.map((lesson: any, index: number) => {
                            const progress = user?.progress?.lessons?.find(
                                (l: any) => l.lessonId === (lesson._id ?? lesson.id)
                            );
                            const completedCount = progress?.completedResources?.length ?? 0;
                            const totalResources =
                                (lesson.coursesPdf?.length ?? 0) +
                                (lesson.videos?.length ?? 0) +
                                (lesson.exercices?.length ?? 0) +
                                (lesson.exams?.length ?? 0) +
                                (lesson.resourses?.length ?? 0);
                            const progressPct = totalResources > 0
                                ? Math.min(100, Math.round((completedCount / totalResources) * 100))
                                : 0;
                            const isStarted = user && completedCount > 0;
                            const isDone = user && totalResources > 0 && progressPct === 100;

                            const resourceIcons: { icon: any; count: number; key: string }[] = [];
                            if (lesson.coursesPdf?.length > 0)  resourceIcons.push({ icon: FileText,     count: lesson.coursesPdf.length,  key: 'pdf' });
                            if (lesson.videos?.length > 0)       resourceIcons.push({ icon: Play,         count: lesson.videos.length,      key: 'video' });
                            if (lesson.exercices?.length > 0)    resourceIcons.push({ icon: ClipboardList, count: lesson.exercices.length,  key: 'exercise' });
                            if (lesson.exams?.length > 0)        resourceIcons.push({ icon: GraduationCap, count: lesson.exams.length,      key: 'exam' });
                            if (lesson.resourses?.length > 0)    resourceIcons.push({ icon: Search,       count: lesson.resourses.length,   key: 'resource' });

                            return (
                                <Link
                                    href={chain?.school && chain?.level && chain?.guidance && chain?.subject
                                        ? curriculumPath({ ...chain, lesson: { _id: lesson._id, title: lesson.title, slug: lesson.slug ?? lesson.title } })
                                        : `/lesson/${lesson._id ?? lesson.id}`}
                                    key={lesson.id || lesson._id}
                                    className={`lesson-card-v2 ${isDone ? 'lesson-card-done' : ''}`}
                                    style={{ animationDelay: `${index * 40}ms` }}
                                >

                                    {/* Decorative background number */}
                                    <div className="lesson-v2-bg-number">
                                        {isDone
                                            ? <CheckCircle2 size={52} strokeWidth={1.2} />
                                            : String(index + 1).padStart(2, '0')}
                                    </div>

                                    <div className="lesson-v2-content">
                                        {/* Index + done badge */}
                                        <div className="lesson-v2-header">
                                            <span className={`lesson-v2-index ${isDone ? 'lesson-v2-index--done' : ''}`}>
                                                {isDone
                                                    ? <><CheckCircle2 size={13} /> {t("completed") || "Done"}</>
                                                    : `#${String(index + 1).padStart(2, '0')}`}
                                            </span>
                                            {isStarted && !isDone && (
                                                <span className="lesson-v2-badge-done">{t("in_progress") || "In progress"}</span>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h3 className="lesson-v2-title">{lesson.title}</h3>

                                        {/* Resource chips */}
                                        {resourceIcons.length > 0 && (
                                            <div className="lesson-v2-chips">
                                                {resourceIcons.map(({ icon: Icon, count, key }) => (
                                                    <span key={key} className="lesson-v2-chip">
                                                        <Icon size={11} />
                                                        <span>{count}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Progress bar */}
                                        {user && totalResources > 0 && (
                                            <div className="lesson-v2-progress">
                                                <div className="lesson-v2-progress-track">
                                                    <div
                                                        className="lesson-v2-progress-fill"
                                                        style={{ width: `${progressPct}%` }}
                                                    />
                                                </div>
                                                <span className="lesson-v2-progress-label">
                                                    {completedCount}/{totalResources}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : error ? (
                    <div className="text-center py-24 space-y-4">
                        <div className="w-20 h-20 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <BookOpen size={36} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Failed to load lessons</h2>
                        <p className="text-gray-400 max-w-xs mx-auto text-sm">Check your connection and try again.</p>
                        <button
                            onClick={() => { setLoading(true); setError(false); (async () => { const s = (await getSubjectById(subjectParam)) ?? (await getSubjectBySlug(subjectParam).catch(() => null)); if (!s) throw new Error('not found'); const res = await getLessons(s._id); setLessons(res); setLoading(false); })().catch(() => { setError(true); setLoading(false); }); }}
                            className="mt-2 px-5 py-2 bg-green text-white text-sm font-bold rounded-xl hover:bg-green/90 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : search.trim() ? (
                    <div className="text-center py-24 space-y-4">
                        <div className="w-20 h-20 bg-green/8 text-green rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Search size={36} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">No results</h2>
                        <p className="text-gray-400 max-w-xs mx-auto text-sm">
                            No lessons match &ldquo;{search}&rdquo;.
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-24 space-y-4">
                        <div className="w-20 h-20 bg-green/8 text-green rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <BookOpen size={36} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">No lessons yet</h2>
                        <p className="text-gray-400 max-w-xs mx-auto text-sm">
                            This subject doesn&apos;t have any lessons posted yet. Check back later!
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
