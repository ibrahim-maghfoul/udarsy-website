"use client";

/**
 * Hierarchical curriculum browse — pretty URLs all the way down:
 *   /courses/Primaire/6eme-annee/Mathematiques                 (level has single guidance — guidance segment skipped)
 *   /courses/Primaire/6eme-annee/Mathematiques/dorus-...       (lesson under that subject)
 *   /courses/Lycee/2eme-Bac/SVT                                (level with multiple guidances — guidance landing)
 *   /courses/Lycee/2eme-Bac/SVT/Mathematiques-BIOF             (subject under explicit guidance)
 *   /courses/Lycee/2eme-Bac/SVT/Mathematiques-BIOF/lesson-...  (lesson)
 *
 * Each URL segment is matched within its parent (school → level → guidance? → subject → lesson)
 * by the backend /data/path-resolve endpoint. Within-parent uniqueness was confirmed by
 * find-same-parent-twins.ts so this is unambiguous.
 *
 * Specific routes (/courses, /courses/[guidanceSlug], /courses/[guidanceSlug]/[levelSlug],
 * /courses/subject/[subjectId]) still take precedence for shorter paths; this catch-all
 * handles 3+ segments.
 */

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, BookOpen, ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations, useLocale } from "next-intl";
import { resolveCurriculumPath, getSubjects, curriculumPath, type ResolvedPath, type CurriculumChain } from "@/services/data";
import { getSubjectImage } from "@/lib/subjectImages";
import LessonPageClient from "../../lesson/[lessonId]/LessonPageClient";
import SubjectLessonsPage from "../../explore/subject/[subjectId]/page";
import "../../explore/subject-cards.css";

function CurriculumNotFound() {
    return (
        <div className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-16 h-16 bg-green/10 text-green rounded-full flex items-center justify-center mb-2">
                <BookOpen size={32} />
            </div>
            <h2 className="text-xl font-bold text-dark">Page not found</h2>
            <p className="text-sm text-dark/50">This curriculum path doesn&apos;t exist.</p>
            <Link href="/courses" className="mt-2 px-5 py-2 bg-green text-white text-sm font-semibold rounded-xl">
                Browse all courses
            </Link>
        </div>
    );
}

// Subjects grid under a guidance (3-seg Lycée style URLs). Mirrors the styling of the
// existing /courses/[guidanceSlug] subject grid so it feels identical.
function GuidanceSubjectsView({ chain }: { chain: CurriculumChain }) {
    const { user } = useAuth();
    const router = useRouter();
    const t = useTranslations("Subjects");
    const locale = useLocale();
    const isAr = locale === 'ar';
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!chain.guidance?._id) return;
        setLoading(true);
        getSubjects(chain.guidance._id)
            .then(res => setSubjects(res))
            .catch(() => setSubjects([]))
            .finally(() => setLoading(false));
    }, [chain.guidance?._id]);

    const filtered = useMemo(() =>
        subjects.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())),
        [subjects, searchQuery]
    );

    return (
        <div className="min-h-screen bg-[#fafbfc] animate-slide-up">
            <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-green/8 flex items-center gap-3 px-4 py-3 shadow-sm">
                <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-green/8 border border-green/15 flex items-center justify-center text-green shrink-0">
                    <ArrowLeft size={16} />
                </button>
                <span className="font-bold text-dark/70 text-sm truncate">{chain.guidance?.title || t('title')}</span>
            </div>

            <header className="hidden md:block relative overflow-hidden bg-gradient-to-b from-[#f0f7f3] to-transparent border-b border-green/8 pt-32 pb-10 px-6">
                <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-green/5 blur-3xl pointer-events-none" style={{ transform: 'translate3d(30%, -30%, 0)' }} />
                <div className="max-w-7xl mx-auto relative">
                    <div className={`flex items-center gap-2 text-sm text-dark/40 mb-3 ${isAr ? 'flex-row-reverse' : ''}`}>
                        <Link href="/courses" className="hover:text-green transition-colors">Courses</Link>
                        <span>/</span>
                        <span className="text-dark/70">{chain.school.title}</span>
                        <span>/</span>
                        <span className="text-dark/70">{chain.level?.title}</span>
                        <span>/</span>
                        <span className="text-dark/70">{chain.guidance?.title}</span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-bold text-dark">{chain.guidance?.title}</h1>
                    <div className="mt-6 relative w-72">
                        <Search size={15} className={`absolute top-1/2 -translate-y-1/2 text-green/40 pointer-events-none ${isAr ? 'right-3' : 'left-3'}`} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={t('search_placeholder')}
                            className={`w-full py-2.5 text-sm bg-white border border-green/20 rounded-xl text-dark placeholder:text-gray-400 focus:outline-none focus:border-green/40 ${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto pt-8 px-5 md:px-10" style={{ paddingBottom: '8rem' }}>
                {!loading && filtered.length > 0 && (
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-green/10" />
                        <span className="px-3.5 py-1 bg-green text-white text-xs font-bold rounded-full">
                            {filtered.length} {filtered.length === 1 ? 'subject' : 'subjects'}
                        </span>
                        <div className="flex-1 h-px bg-green/10" />
                    </div>
                )}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="subject-card-skeleton" style={{ animationDelay: `${i * 70}ms` }} />
                        ))}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                        {filtered.map((subject: any, index: number) => {
                            const lessonIdSet: Set<string> = new Set(subject.lessonIds || []);
                            const currentSubjectId: string = subject._id || subject.id || '';
                            const subjectLessons = (user?.progress?.lessons?.filter((l: any) =>
                                (lessonIdSet.size > 0 && lessonIdSet.has(l.lessonId)) ||
                                (currentSubjectId && l.subjectId === currentSubjectId)
                            ) ?? []);
                            const totalCompleted = subjectLessons.reduce(
                                (sum: number, l: any) => sum + (l.completedResources?.length ?? 0), 0
                            );
                            const totalResources = subject.totalResources ?? subjectLessons.reduce(
                                (sum: number, l: any) => sum + (l.totalResourcesCount ?? 0), 0
                            );
                            const progressPct = totalResources > 0 ? Math.min(100, Math.round((totalCompleted / totalResources) * 100)) : 0;
                            const isComplete = totalResources > 0 && progressPct === 100;
                            const radius = 17;
                            const circumference = 2 * Math.PI * radius;
                            const strokeOffset = circumference - (progressPct / 100) * circumference;
                            const imageUrl = getSubjectImage(subject.title);

                            const href = curriculumPath({
                                school: chain.school,
                                level: chain.level,
                                guidance: chain.guidance,
                                subject: { _id: subject._id, title: subject.title, slug: subject.slug ?? subject.title },
                            });

                            return (
                                <Link
                                    href={href}
                                    key={subject._id}
                                    className={`subject-card ${isComplete ? 'subject-card-done' : ''}${!imageUrl ? ' subject-card-fallback' : ''}`}
                                    style={{ animationDelay: `${index * 40}ms`, backgroundImage: imageUrl ? `url('${imageUrl}')` : undefined }}
                                >
                                    <div className="subject-card-overlay" />
                                    <div className="subject-card-title-wrap">
                                        <h3 className="subject-card-title">{subject.title}</h3>
                                    </div>
                                    <div className="subject-card-arrow">
                                        {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                                    </div>
                                    {user && (
                                        <div className="subject-card-ring">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                                                <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
                                                <circle
                                                    cx="20" cy="20" r={radius} fill="none"
                                                    stroke={isComplete ? '#3aaa6a' : 'rgba(255,255,255,0.75)'}
                                                    strokeWidth="2.5" strokeLinecap="round"
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={strokeOffset}
                                                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                                                />
                                            </svg>
                                            <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-black ${isComplete ? 'text-green-400' : 'text-white'}`}>
                                                {isComplete ? '✓' : `${progressPct}%`}
                                            </span>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <h2 className="text-2xl font-bold text-dark">{t('no_subjects')}</h2>
                    </div>
                )}
                <div style={{ height: '4rem' }} />
            </main>
        </div>
    );
}

export default function CurriculumCatchAll() {
    const params = useParams();
    const router = useRouter();
    // useParams can return URL-encoded segments for non-ASCII paths in some Next.js
    // setups (Arabic URLs would arrive as '%D8%A7%D9%84…' instead of 'الد…'). Decoding
    // here guarantees we send raw Unicode to the service, which then encodes exactly
    // once for the API call.
    const segments = useMemo(() => {
        const raw = (params.path as string[]) ?? [];
        return raw.map(s => {
            try { return decodeURIComponent(s); } catch { return s; }
        });
    }, [params.path]);

    const [resolved, setResolved] = useState<ResolvedPath | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (segments.length === 0) { router.replace('/courses'); return; }
        setLoading(true);
        setNotFound(false);
        resolveCurriculumPath(segments)
            .then(r => {
                if (!r) setNotFound(true);
                else setResolved(r);
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [segments, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-green border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }
    if (notFound || !resolved) return <CurriculumNotFound />;

    if (resolved.kind === 'lesson' && resolved.chain.lesson)
        return <LessonPageClient lessonId={resolved.chain.lesson._id} />;
    if (resolved.kind === 'subject' && resolved.chain.subject)
        return <SubjectLessonsPage subjectId={resolved.chain.subject._id} chain={resolved.chain} />;
    if (resolved.kind === 'guidance' && resolved.chain.guidance)
        return <GuidanceSubjectsView chain={resolved.chain} />;
    // school / level fall back to the legacy 1-2 segment routes.
    return <CurriculumNotFound />;
}
