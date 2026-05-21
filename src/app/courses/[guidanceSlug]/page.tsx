"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Search, BookOpen, ChevronRight, ChevronLeft, LogIn,
    ArrowLeft, UserPlus, School, GraduationCap,
} from "lucide-react";
import { getGuidanceBySlug, getSubjects, getSchools, getLevels, subjectSlug, prefetchLessons } from "@/services/data";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations, useLocale } from "next-intl";
import { getSubjectImage } from "@/lib/subjectImages";
import "../../explore/subject-cards.css";

export default function GuidanceSubjectsPage() {
    const params = useParams();
    const slug = params.guidanceSlug as string;
    const { user } = useAuth();
    const router = useRouter();
    const t = useTranslations('Subjects');
    const locale = useLocale();
    const isAr = locale === 'ar';

    const [mode, setMode] = useState<'guidance' | 'school'>('guidance');
    const [guidanceName, setGuidanceName] = useState('');
    const [subjects, setSubjects] = useState<any[]>([]);
    const [schoolName, setSchoolName] = useState('');
    const [levels, setLevels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        setError(false);
        getGuidanceBySlug(slug)
            .then(guidance => {
                if (!guidance?._id) throw new Error('not a guidance');
                setMode('guidance');
                setGuidanceName(guidance.title);
                return getSubjects(guidance._id);
            })
            .then(res => { setSubjects(res); setLoading(false); })
            .catch(() => {
                // Not a guidance slug — try school
                getSchools()
                    .then(schools => {
                        const school = schools.find(s => subjectSlug(s.title) === slug);
                        if (!school) { setError(true); setLoading(false); return; }
                        setMode('school');
                        setSchoolName(school.title);
                        return getLevels(school.id);
                    })
                    .then(lvls => { if (lvls) { setLevels(lvls); setLoading(false); } })
                    .catch(() => { setError(true); setLoading(false); });
            });
    }, [slug]);

    const filteredSubjects = useMemo(() =>
        subjects.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase())),
        [subjects, searchQuery]
    );

    if (mode === 'school' && !loading) {
        return (
            <div className="min-h-screen bg-[#fafbfc] animate-slide-up">
                <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-green/8 flex items-center gap-3 px-4 py-3 shadow-sm">
                    <button onClick={() => router.push('/courses')} className="w-8 h-8 rounded-full bg-green/8 border border-green/15 flex items-center justify-center text-green shrink-0">
                        <ArrowLeft size={16} />
                    </button>
                    <span className="font-bold text-dark/70 text-sm truncate">{schoolName}</span>
                </div>
                <header className="hidden md:block relative overflow-hidden bg-gradient-to-b from-[#f0f7f3] to-transparent border-b border-green/8 pt-32 pb-10 px-6">
                    <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-green/5 blur-3xl pointer-events-none" style={{ transform: 'translate3d(30%,-30%,0)' }} />
                    <div className="max-w-7xl mx-auto relative">
                        <div className={`flex items-center gap-2 text-sm text-dark/40 mb-3 ${isAr ? 'flex-row-reverse' : ''}`}>
                            <button onClick={() => router.push('/courses')} className="hover:text-green transition-colors">Courses</button>
                            <span>/</span>
                            <span className="text-dark/70">{schoolName}</span>
                        </div>
                        <h1 className="text-2xl md:text-4xl font-bold text-dark">{schoolName}</h1>
                        <p className="text-dark/50 mt-2 text-sm">Choose a level to explore its pathways</p>
                    </div>
                </header>
                <main className="max-w-7xl mx-auto pt-8 px-5 md:px-10 pb-32">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-green/10" />
                        <span className="px-3.5 py-1 bg-green text-white text-xs font-bold rounded-full">{levels.length} {levels.length === 1 ? 'level' : 'levels'}</span>
                        <div className="flex-1 h-px bg-green/10" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {levels.map((level: any, index: number) => {
                            const icon = schoolName.toLowerCase().includes('lyc') ? <GraduationCap size={28} /> : schoolName.toLowerCase().includes('coll') ? <BookOpen size={28} /> : <School size={28} />;
                            return (
                                <button
                                    key={level.id || level._id}
                                    onClick={() => router.push(`/courses/${slug}/${subjectSlug(level.title)}`)}
                                    className="group relative flex flex-col items-center justify-center gap-3 p-6 bg-white border border-green/12 rounded-2xl text-center hover:border-green/30 hover:shadow-md hover:shadow-green/8 transition-all duration-200"
                                    style={{ animationDelay: `${index * 40}ms` }}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-green/8 text-green flex items-center justify-center group-hover:bg-green/15 transition-colors">{icon}</div>
                                    <h3 className="font-bold text-dark text-sm leading-tight">{level.title}</h3>
                                    <div className={`absolute ${isAr ? 'left-3' : 'right-3'} top-3 text-green/30 group-hover:text-green/60 transition-colors`}>
                                        {isAr ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="w-16 h-16 bg-green/10 text-green rounded-full flex items-center justify-center mb-2">
                    <BookOpen size={32} />
                </div>
                <h2 className="text-xl font-bold text-dark">Path not found</h2>
                <p className="text-sm text-dark/50">The guidance you&apos;re looking for doesn&apos;t exist.</p>
                <button onClick={() => router.push('/courses')} className="mt-2 px-5 py-2 bg-green text-white text-sm font-semibold rounded-xl">
                    Browse all courses
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafbfc] animate-slide-up">
            {/* Mobile sticky header */}
            <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-green/8 flex items-center gap-3 px-4 py-3 shadow-sm">
                <button
                    onClick={() => router.push('/courses')}
                    className="w-8 h-8 rounded-full bg-green/8 border border-green/15 flex items-center justify-center text-green shrink-0"
                >
                    <ArrowLeft size={16} />
                </button>
                <span className="font-bold text-dark/70 text-sm truncate">
                    {guidanceName || t('title')}
                </span>
            </div>

            {/* Desktop header */}
            <header className="hidden md:block relative overflow-hidden bg-gradient-to-b from-[#f0f7f3] to-transparent border-b border-green/8 pt-32 pb-10 px-6">
                <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-green/5 blur-3xl pointer-events-none" style={{ transform: 'translate3d(30%, -30%, 0)' }} />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-green/4 blur-2xl pointer-events-none" style={{ transform: 'translate3d(-20%, 20%, 0)' }} />
                <div className="max-w-7xl mx-auto relative">
                    <div className="space-y-2 mb-6">
                        <h1 className="text-2xl md:text-4xl font-bold text-dark">
                            {guidanceName || t('title')}
                        </h1>
                    </div>
                    <div className={`flex items-center justify-between gap-6 ${isAr ? 'flex-row-reverse' : ''}`}>
                        <div className="relative w-72 shrink-0">
                            <Search
                                size={15}
                                className="absolute top-1/2 -translate-y-1/2 text-green/40 pointer-events-none"
                                style={{ [isAr ? 'right' : 'left']: '12px' }}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder={t('search_placeholder')}
                                className={`w-full py-2.5 text-sm bg-white border border-green/20 rounded-xl text-dark placeholder:text-gray-400 focus:outline-none focus:border-green/40 focus:ring-2 focus:ring-green/8 ${isAr ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4'}`}
                                dir={isAr ? 'rtl' : undefined}
                            />
                        </div>
                        {!user && (
                            <div
                                className="flex-1 max-w-xl relative overflow-hidden bg-[#1e7a46] rounded-2xl px-4 py-3 shadow-lg shadow-green/10"
                                style={{ backgroundImage: `repeating-linear-gradient(45deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 2px,transparent 2px,transparent 8px),linear-gradient(135deg,#1e7a46 0%,#0f4428 100%)` }}
                            >
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
            <div className="md:hidden px-4 pt-3">
                <div className="relative">
                    <Search size={15} className={`absolute top-1/2 -translate-y-1/2 text-green/40 pointer-events-none ${isAr ? 'right-3' : 'left-3'}`} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder={t('search_placeholder')}
                        className={`w-full py-2.5 text-sm bg-white border border-green/20 rounded-xl text-dark placeholder:text-gray-400 focus:outline-none focus:border-green/40 ${isAr ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4'}`}
                        dir={isAr ? 'rtl' : undefined}
                    />
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto pt-8 px-5 md:px-10" style={{ paddingBottom: '8rem' }}>
                {!loading && filteredSubjects.length > 0 && (
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-green/10" />
                        <span className="px-3.5 py-1 bg-green text-white text-xs font-bold rounded-full whitespace-nowrap tracking-wide">
                            {filteredSubjects.length} {filteredSubjects.length === 1 ? 'subject' : 'subjects'}
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
                ) : filteredSubjects.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
                        {filteredSubjects.map((subject: any, index: number) => {
                            const subjectLessons = user?.progress?.lessons?.filter(
                                (l: any) => l.subjectId === (subject._id || subject.id)
                            ) ?? [];
                            const totalCompleted = subjectLessons.reduce(
                                (sum: number, l: any) => sum + (l.completedResources?.length ?? 0), 0
                            );
                            const totalResources = subject.totalResources ?? subjectLessons.reduce(
                                (sum: number, l: any) => sum + (l.totalResourcesCount ?? 0), 0
                            );
                            const progressPct = totalResources > 0
                                ? Math.min(100, Math.round((totalCompleted / totalResources) * 100))
                                : 0;
                            const isStarted = subjectLessons.length > 0;
                            const isComplete = totalResources > 0 && progressPct === 100;
                            const radius = 17;
                            const circumference = 2 * Math.PI * radius;
                            const strokeOffset = circumference - (progressPct / 100) * circumference;

                            const imageUrl = getSubjectImage(subject.title);

                            return (
                                <Link
                                    href={`/courses/subject/${subject.slug ?? subjectSlug(subject.title)}`}
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

                                    {isStarted && (
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
