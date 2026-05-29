"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, BookOpen, ChevronRight, ChevronLeft, LogIn } from "lucide-react";
import Link from "next/link";
import { getSubjects, getGuidances, getSchools, getLevels, prefetchLessons, prefetchLevels, prefetchGuidances, subjectSlug, curriculumPath, type CurriculumChain } from "@/services/data";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { getSubjectImage } from "@/lib/subjectImages";
import "./subject-cards.css";

// ---------- Guest Level Selector component ----------
import { GraduationCap, School, UserPlus } from "lucide-react";

// onSelect receives a ready-to-navigate hierarchical /courses URL. We keep the title
// only for callers that want to set a display name; the URL is already canonical.
// Localized SEO copy shown beside the wizard. Mirrors the localized strings that
// used to live in the server header (courses/page.tsx) so guests in every locale
// get a real, keyword-rich <h1> next to the onboarding flow.
const GUEST_SEO_COPY: Record<string, { h1: string; lead: string; free: string; lessons: string; subjects: string; levels: string }> = {
    en: { h1: 'The entire Moroccan curriculum in one place', lead: 'Lessons, graded exercises, regional and national exams.', free: 'Free to start.', lessons: 'lessons', subjects: 'subjects', levels: 'grade levels' },
    fr: { h1: 'Tout le programme marocain en un seul endroit', lead: 'Cours, exercices corrigés, examens régionaux et nationaux.', free: 'Gratuit pour commencer.', lessons: 'leçons', subjects: 'matières', levels: 'niveaux' },
    ar: { h1: 'كل المنهج المغربي في مكان واحد', lead: 'دروس، تمارين مصححة، امتحانات جهوية ووطنية.', free: 'مجاني للبدء.', lessons: 'درس', subjects: 'مادة', levels: 'مستوى' },
};

function GuestLevelSelector({ onSelect }: { onSelect: (url: string, title: string) => void }) {
    const t = useTranslations('Onboarding');
    const locale = useLocale();
    const seo = GUEST_SEO_COPY[locale] ?? GUEST_SEO_COPY.fr;
    const isAr = locale === 'ar';
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState<any[]>([]);
    // Stash the school + level the user picked along the way — we need their titles
    // (not just IDs) to build the hierarchical URL at the end, matching what authed
    // users get from /courses without a redirect bounce through the UUID URL.
    const [selections, setSelections] = useState<{
        school?: { id: string; title: string };
        level?: { id: string; title: string };
    }>({});

    const finishSelection = (guidance: { id: string; title: string }, implicit: boolean) => {
        const { school, level } = selections;
        if (!school || !level) return;
        const url = curriculumPath({
            school: { _id: school.id, title: school.title, slug: subjectSlug(school.title) },
            level: { _id: level.id, title: level.title, slug: subjectSlug(level.title) },
            guidance: { _id: guidance.id, title: guidance.title, slug: subjectSlug(guidance.title), implicit },
        });
        onSelect(url, guidance.title);
    };

    useEffect(() => {
        fetchOptions();
    }, [step, selections]);

    const fetchOptions = async () => {
        setLoading(true);
        try {
            let res: any[] = [];
            if (step === 1) {
                res = await getSchools();
                res.sort((a, b) => {
                    const priority = (title: string) => {
                        const l = title.toLowerCase();
                        if (l.includes('prim') || l.includes('ابتدا')) return 0;
                        if (l.includes('coll') || l.includes('إعدا')) return 1;
                        if (l.includes('lyc') || l.includes('ثانو')) return 2;
                        return 3;
                    };
                    return priority(a.title) - priority(b.title);
                });
                // Prefetch levels for all schools so next step loads instantly
                res.forEach(s => prefetchLevels(s.id));
            } else if (step === 2) {
                if (!selections.school) return;
                res = await getLevels(selections.school.id);
                res.sort((a, b) => {
                    const priority = (title: string) => {
                        const l = title.toLowerCase();
                        if (l.includes('tronc')) return 0;
                        if (l.includes('1ère') || l.includes('1ere')) return 1;
                        if (l.includes('2ème') || l.includes('2eme')) return 2;
                        return 3;
                    };
                    return priority(a.title) - priority(b.title);
                });
                // Prefetch guidances for all levels
                res.forEach(l => prefetchGuidances(l.id));
            } else if (step === 3) {
                if (!selections.level) return;
                res = await getGuidances(selections.level.id);
                if (res.length === 1) {
                    // Implicit guidance: curriculumPath drops the guidance segment for us.
                    finishSelection({ id: res[0].id, title: res[0].title }, true);
                    return;
                }
            }
            setOptions(res);
        } catch (error) {
            console.error("Failed to fetch options", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item: any) => {
        if (step === 1) {
            setSelections({ school: { id: item.id, title: item.title } });
            setStep(2);
        } else if (step === 2) {
            setSelections(prev => ({ ...prev, level: { id: item.id, title: item.title } }));
            setStep(3);
        } else {
            // Reached step 3 with multiple guidances — explicit pick, not implicit.
            finishSelection({ id: item.id, title: item.title }, false);
        }
    };

    const stepIcons = [
        <School size={26} />,
        <GraduationCap size={26} />,
        <BookOpen size={26} />,
    ];

    const stepLabels = [
        t('school_title'),
        t('level_title'),
        t('guidance_title'),
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-4 py-8 pt-28 md:pt-36 bg-[#fafbfc]">
            <div className="w-full max-w-4xl flex flex-col md:flex-row md:items-start md:justify-center gap-8 md:gap-14">

                {/* Marketing side panel — SEO copy, visible on all viewports.
                    Pinned to the top (md:items-start above) so it doesn't jump
                    when the wizard card height changes between steps. */}
                <div className="w-full md:max-w-sm md:shrink-0 md:pt-2 animate-slide-up" dir={isAr ? 'rtl' : 'ltr'}>
                    <h1 className="text-2xl md:text-3xl font-black text-dark tracking-tight leading-tight mb-4">
                        {seo.h1}
                    </h1>
                    <p className="text-dark/60 text-base leading-relaxed mb-8">
                        {seo.lead}{' '}
                        <span className="font-bold text-green">{seo.free}</span>
                    </p>
                    <div className="flex items-center gap-8">
                        {[
                            { value: '2631+', label: seo.lessons },
                            { value: '298+', label: seo.subjects },
                            { value: '12+', label: seo.levels },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <p className="text-2xl font-black text-green leading-none">{stat.value}</p>
                                <p className="text-xs font-medium text-dark/45 mt-1.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wizard column */}
                <div className="w-full max-w-md space-y-4">

                {/* Wizard panel */}
                <div
                    key={step}
                    className="bg-white rounded-[10px] border border-green/8 shadow-xl shadow-green/5 overflow-hidden animate-slide-up"
                >
                    {/* Header with dot texture */}
                    <div
                        className="relative px-6 pt-7 pb-6 border-b border-green/6"
                        style={{ background: 'linear-gradient(135deg, #f0faf5 0%, #e8f5ee 100%)' }}
                    >
                        {/* Dot texture */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(circle, rgba(58,170,106,0.15) 1px, transparent 1px)', backgroundSize: '14px 14px' }}
                        />

                        {/* Step progress */}
                        <div className="relative z-10 flex items-center justify-center gap-2 mb-5">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center gap-2">
                                    <div className={`step-dot ${s < step ? 'step-dot-past' : s === step ? 'step-dot-active' : 'step-dot-future'}`}>
                                        {s < step ? '✓' : s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`step-line ${s < step ? 'step-line-done' : 'step-line-pending'}`} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Icon + title */}
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="step-icon-box">
                                {stepIcons[step - 1]}
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-green/50 uppercase tracking-widest mb-0.5">
                                    Step {step} of 3
                                </p>
                                <h2 className="text-xl font-black text-dark tracking-tight leading-tight">
                                    {stepLabels[step - 1]}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Options list */}
                    <div className="p-4 space-y-2">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div
                                    key={i}
                                    className="selection-skeleton"
                                    style={{ animationDelay: `${i * 70}ms` }}
                                />
                            ))
                        ) : options.length === 0 ? (
                            <div className="py-8 text-center text-sm text-green/40 font-medium">
                                Nothing found — check your connection.
                            </div>
                        ) : (
                            options.map((item, index) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    className="selection-card"
                                    style={{ animationDelay: `${index * 40}ms` }}
                                >
                                    <div className="selection-card-row">
                                        <span className="selection-card-num">{String(index + 1).padStart(2, '0')}</span>
                                        <span className="selection-card-label">{item.title}</span>
                                        <ChevronRight size={15} className="selection-card-chevron" />
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Back / footer */}
                    {step > 1 && (
                        <div className="px-4 pb-4">
                            <button onClick={() => setStep(step - 1)} className="btn-back">
                                <ChevronLeft size={14} className="btn-back-arrow" />
                                Back to {step === 2 ? stepLabels[0] : stepLabels[1]}
                            </button>
                        </div>
                    )}
                </div>
                </div>
            </div>
        </div>
    );
}

// ---------- Main page ----------
export default function CoursesBrowser() {
    const { user } = useAuth();
    const t = useTranslations('Subjects');
    const nt = useTranslations('Navbar');
    const locale = useLocale();
    const isAr = locale === 'ar';
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [anonymousPathParams, setAnonymousPathParams] = useState<any>(null);
    const [guidanceName, setGuidanceName] = useState('');
    // Resolved curriculum chain (school/level/guidance) used to build hierarchical URLs
    // for the subject cards. Lazily filled after fetchSubjects resolves; until then,
    // cards fall back to /courses/subject/<_id>.
    const [chain, setChain] = useState<Partial<CurriculumChain> | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            const params = new URLSearchParams(window.location.search);
            const guidanceId = params.get('guidanceId');
            const guidanceTitle = params.get('guidanceTitle');

            if (guidanceId) {
                setAnonymousPathParams({ guidanceId, guidanceTitle });
                if (guidanceTitle) setGuidanceName(guidanceTitle);
                fetchSubjects(guidanceId);
            } else {
                setLoading(false);
            }
            return;
        }

        if (user.selectedPath?.guidanceId) {
            setAnonymousPathParams(null);
            fetchSubjects(user.selectedPath.guidanceId, user.selectedPath.levelId);
        } else {
            const params = new URLSearchParams(window.location.search);
            const guidanceId = params.get('guidanceId');
            const guidanceTitle = params.get('guidanceTitle');

            if (guidanceId) {
                setAnonymousPathParams({ guidanceId, guidanceTitle });
                if (guidanceTitle) setGuidanceName(guidanceTitle);
                fetchSubjects(guidanceId);
                return;
            }
            router.push('/onboarding');
        }
    }, [user, router]);

    const fetchSubjects = async (guidanceId: string, levelId?: string) => {
        setLoading(true);
        try {
            const [subjectsRes, guidances] = await Promise.all([
                getSubjects(guidanceId),
                levelId ? getGuidances(levelId) : Promise.resolve(null),
            ]);
            setSubjects(subjectsRes);
            if (guidances) {
                const g = guidances.find((g: any) => (g.id || g._id) === guidanceId);
                if (g) setGuidanceName(g.title);
                // Build the chain used for hierarchical subject card URLs. We have the
                // titles from user.level; the slug fn matches the backend's generateSlug.
                if (user?.level && guidances.length > 0) {
                    const implicit = guidances.length === 1;
                    setChain({
                        school:   { _id: user.selectedPath?.schoolId   ?? '', title: user.level.school,   slug: subjectSlug(user.level.school) },
                        level:    { _id: user.selectedPath?.levelId    ?? '', title: user.level.level,    slug: subjectSlug(user.level.level) },
                        guidance: { _id: user.selectedPath?.guidanceId ?? '', title: user.level.guidance, slug: subjectSlug(user.level.guidance), implicit },
                    });
                }
            }
        } catch {
            setSubjects([]);
        } finally {
            setLoading(false);
        }
    };

    // Memoize filtered subjects to avoid re-filtering on every render
    const filteredSubjects = useMemo(() =>
        subjects.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())),
        [subjects, searchQuery]
    );

    // If not logged in and no path is selected yet, show selector
    if (!user && !loading && !anonymousPathParams) {
        return <GuestLevelSelector onSelect={(url) => {
            router.replace(url);
        }} />;
    }

    return (
        <div className="min-h-screen bg-[#fafbfc] animate-slide-up">
            {/* Mobile sticky header */}
            <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-green/8 flex items-center gap-3 px-4 py-3 shadow-sm">
                <span className="font-bold text-dark/70 text-sm truncate">
                    {guidanceName || t('title')}
                </span>
            </div>

            {/* Desktop header */}
            <header className="hidden md:block relative overflow-hidden bg-gradient-to-b from-[#f0f7f3] to-transparent border-b border-green/8 pt-32 pb-10 px-6">
                <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-green/5 blur-3xl pointer-events-none" style={{ transform: 'translate3d(30%, -30%, 0)' }} />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-green/4 blur-2xl pointer-events-none" style={{ transform: 'translate3d(-20%, 20%, 0)' }} />
                <div className="max-w-7xl mx-auto relative" dir={isAr ? 'rtl' : 'ltr'}>
                    <div className="space-y-2 mb-6">
                        <h1 className="text-2xl md:text-4xl font-bold text-dark">
                            {nt('welcome')}, {user?.displayName?.split(' ')[0] || t('student')}!
                        </h1>
                        {guidanceName && (
                            <p className="text-muted-foreground text-lg">{guidanceName}</p>
                        )}
                    </div>
                    <div className="flex items-center justify-between gap-6">
                        <div className="relative w-72 shrink-0">
                            <Search
                                size={15}
                                className={`absolute top-1/2 -translate-y-1/2 text-green/40 pointer-events-none ${isAr ? 'right-3' : 'left-3'}`}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('search_placeholder')}
                                className={`w-full py-2.5 text-sm bg-white border border-green/20 rounded-xl text-dark placeholder:text-gray-400 focus:outline-none focus:border-green/40 focus:ring-2 focus:ring-green/8 ${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
                            />
                        </div>
                        {!user && (
                            <div className="flex-1 max-w-xl relative overflow-hidden bg-[#1e7a46] rounded-2xl px-4 py-3 shadow-lg shadow-green/10"
                                style={{ backgroundImage: `repeating-linear-gradient(45deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 2px,transparent 2px,transparent 8px),linear-gradient(135deg,#1e7a46 0%,#0f4428 100%)` }}>
                                <div className="relative z-10 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <UserPlus size={18} strokeWidth={1.8} className="text-white/90 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-bold text-white text-sm leading-tight">Save your learning progress!</p>
                                            <p className="text-white/70 text-xs leading-snug hidden sm:block">Sign in to track lessons and save favorites.</p>
                                        </div>
                                    </div>
                                    <Link href="/login" className="btn-signin"><LogIn size={14} />Sign In</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile search */}
            <div className="md:hidden px-4 pt-3 space-y-2" dir={isAr ? 'rtl' : 'ltr'}>
                <div className="relative">
                    <Search size={15} className={`absolute top-1/2 -translate-y-1/2 text-green/40 pointer-events-none ${isAr ? 'right-3' : 'left-3'}`} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('search_placeholder')}
                        className={`w-full py-2.5 text-sm bg-white border border-green/20 rounded-xl text-dark placeholder:text-gray-400 focus:outline-none focus:border-green/40 ${isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
                    />
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto pt-8 px-5 md:px-10" style={{ paddingBottom: '8rem' }}>
                {!loading && filteredSubjects.length > 0 && (
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-green/10" />
                        <span className="px-3.5 py-1 bg-green text-white text-xs font-bold rounded-full whitespace-nowrap tracking-wide">
                            {filteredSubjects.length} {filteredSubjects.length === 1 ? "subject" : "subjects"}
                        </span>
                        <div className="flex-1 h-px bg-green/10" />
                    </div>
                )}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                        {Array(6).fill(0).map((_, i) => (
                            <div
                                key={i}
                                className="subject-card-skeleton"
                                style={{ animationDelay: `${i * 70}ms` }}
                            />
                        ))}
                    </div>
                ) : filteredSubjects.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                        {filteredSubjects.map((subject: any, index: number) => {
                            // Match by lessonId set (slug or _id) OR subjectId — whichever is current
                            const lessonIdSet: Set<string> = new Set(subject.lessonIds || []);
                            const currentSubjectId: string = subject._id || subject.id || '';
                            const subjectLessons = (user?.progress?.lessons?.filter((l: any) =>
                                (lessonIdSet.size > 0 && lessonIdSet.has(l.lessonId)) ||
                                (currentSubjectId && l.subjectId === currentSubjectId)
                            ) ?? []);
                            const totalCompleted = subjectLessons.reduce(
                                (sum: number, l: any) => sum + (l.completedResources?.length ?? 0), 0
                            );
                            // Use real total from subject aggregate (all lessons, not just visited ones)
                            const totalResources = subject.totalResources ?? subjectLessons.reduce(
                                (sum: number, l: any) => sum + (l.totalResourcesCount ?? 0), 0
                            );
                            const progressPct = totalResources > 0
                                ? Math.min(100, Math.round((totalCompleted / totalResources) * 100))
                                : 0;
                            const isComplete = totalResources > 0 && progressPct === 100;

                            const radius = 17;
                            const circumference = 2 * Math.PI * radius;
                            const strokeOffset = circumference - (progressPct / 100) * circumference;

                            const imageUrl = getSubjectImage(subject.title);

                            return (
                                <Link
                                    href={chain?.school && chain?.level && chain?.guidance
                                        ? curriculumPath({ ...chain, subject: { _id: subject._id, title: subject.title, slug: subject.slug ?? subjectSlug(subject.title) } })
                                        : `/courses/subject/${subject._id ?? subject.id}`}
                                    key={subject.id}
                                    className={`subject-card ${isComplete ? 'subject-card-done' : ''}${!imageUrl ? ' subject-card-fallback' : ''}`}
                                    style={{
                                        animationDelay: `${index * 40}ms`,
                                        backgroundImage: imageUrl ? `url('${imageUrl}')` : undefined,
                                    }}
                                    onMouseEnter={() => prefetchLessons(subject.id)}
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
                    <div className="text-center py-24 space-y-4">
                        <div className="w-20 h-20 bg-green/10 text-green rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-dark">{t('no_subjects')}</h2>
                    </div>
                )}
                <div style={{ height: '4rem' }} />
            </main>
        </div>
    );
}
