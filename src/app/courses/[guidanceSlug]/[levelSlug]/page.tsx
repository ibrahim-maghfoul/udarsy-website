"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    BookOpen, ArrowLeft, ChevronRight, ChevronLeft, Search,
    Calculator, Atom, Globe, Microscope, Cpu, Lightbulb,
    FlaskConical, Languages, Database,
} from "lucide-react";
import { getSchools, getLevels, getGuidances, subjectSlug, guidanceSlug } from "@/services/data";
import { useLocale } from "next-intl";

function getGuidanceIcon(title: string) {
    const t = title.toLowerCase();
    if (t.includes('math') || t.includes('رياضيات')) return <Calculator size={24} />;
    if (t.includes('physi') || t.includes('فيزياء') || t.includes('chimie') || t.includes('pc')) return <Atom size={24} />;
    if (t.includes('svt') || t.includes('vie') || t.includes('terre') || t.includes('biolog') || t.includes('agrono')) return <Microscope size={24} />;
    if (t.includes('histoir') || t.includes('géo') || t.includes('humain') || t.includes('تاريخ')) return <Globe size={24} />;
    if (t.includes('lettr') || t.includes('français') || t.includes('arabe') || t.includes('lang') || t.includes('لغة')) return <Languages size={24} />;
    if (t.includes('tech') || t.includes('info') || t.includes('électr') || t.includes('mécani')) return <Cpu size={24} />;
    if (t.includes('économ') || t.includes('gestion') || t.includes('اقتصاد') || t.includes('comptab')) return <Database size={24} />;
    if (t.includes('philo') || t.includes('فلسفة')) return <Lightbulb size={24} />;
    return <FlaskConical size={24} />;
}

export default function LevelPage() {
    const params = useParams();
    const sSlug = params.guidanceSlug as string;
    const lSlug = params.levelSlug as string;
    const router = useRouter();
    const locale = useLocale();
    const isAr = locale === 'ar';

    const [schoolName, setSchoolName] = useState('');
    const [levelName, setLevelName] = useState('');
    const [guidances, setGuidances] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!sSlug || !lSlug) return;
        setLoading(true);
        setError(false);
        getSchools()
            .then(schools => {
                const school = schools.find(s => subjectSlug(s.title) === sSlug);
                if (!school) throw new Error('School not found');
                setSchoolName(school.title);
                return getLevels(school.id);
            })
            .then(levels => {
                const level = levels.find((l: any) => subjectSlug(l.title) === lSlug);
                if (!level) throw new Error('Level not found');
                setLevelName(level.title);
                return getGuidances(level.id || level._id);
            })
            .then(gs => { setGuidances(gs); setLoading(false); })
            .catch(() => { setError(true); setLoading(false); });
    }, [sSlug, lSlug]);

    const filtered = useMemo(() =>
        guidances.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase())),
        [guidances, searchQuery]
    );

    if (error) {
        return (
            <div className="min-h-screen bg-[#fafbfc] flex flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="w-16 h-16 bg-green/10 text-green rounded-full flex items-center justify-center mb-2">
                    <BookOpen size={32} />
                </div>
                <h2 className="text-xl font-bold text-dark">Level not found</h2>
                <p className="text-sm text-dark/50">The level you&apos;re looking for doesn&apos;t exist.</p>
                <button onClick={() => router.push(`/courses/${sSlug}`)} className="mt-2 px-5 py-2 bg-green text-white text-sm font-semibold rounded-xl">
                    Back to school
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafbfc] animate-slide-up">
            <div className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-green/8 flex items-center gap-3 px-4 py-3 shadow-sm">
                <button onClick={() => router.push(`/courses/${sSlug}`)} className="w-8 h-8 rounded-full bg-green/8 border border-green/15 flex items-center justify-center text-green shrink-0">
                    <ArrowLeft size={16} />
                </button>
                <span className="font-bold text-dark/70 text-sm truncate">{levelName || 'Level'}</span>
            </div>

            <header className="hidden md:block relative overflow-hidden bg-gradient-to-b from-[#f0f7f3] to-transparent border-b border-green/8 pt-32 pb-10 px-6">
                <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-green/5 blur-3xl pointer-events-none" style={{ transform: 'translate3d(30%,-30%,0)' }} />
                <div className="max-w-7xl mx-auto relative">
                    <div className={`flex items-center gap-2 text-sm text-dark/40 mb-3 ${isAr ? 'flex-row-reverse' : ''}`}>
                        <Link href="/courses" className="hover:text-green transition-colors">Courses</Link>
                        <span>/</span>
                        <Link href={`/courses/${sSlug}`} className="hover:text-green transition-colors">{schoolName}</Link>
                        <span>/</span>
                        <span className="text-dark/70">{levelName}</span>
                    </div>
                    <div className={`flex items-center justify-between gap-6 ${isAr ? 'flex-row-reverse' : ''}`}>
                        <h1 className="text-2xl md:text-4xl font-bold text-dark">{levelName || 'Level'}</h1>
                        <div className="relative w-72 shrink-0">
                            <Search size={15} className={`absolute top-1/2 -translate-y-1/2 text-green/40 pointer-events-none ${isAr ? 'right-3' : 'left-3'}`} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search pathway..."
                                className={`w-full py-2.5 text-sm bg-white border border-green/20 rounded-xl text-dark placeholder:text-gray-400 focus:outline-none focus:border-green/40 ${isAr ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4'}`}
                                dir={isAr ? 'rtl' : undefined}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <div className="md:hidden px-4 pt-3">
                <div className="relative">
                    <Search size={15} className={`absolute top-1/2 -translate-y-1/2 text-green/40 pointer-events-none ${isAr ? 'right-3' : 'left-3'}`} />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search pathway..."
                        className={`w-full py-2.5 text-sm bg-white border border-green/20 rounded-xl text-dark placeholder:text-gray-400 focus:outline-none focus:border-green/40 ${isAr ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4'}`}
                        dir={isAr ? 'rtl' : undefined} />
                </div>
            </div>

            <main className="max-w-7xl mx-auto pt-8 px-6 pb-32">
                {!loading && filtered.length > 0 && (
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-px bg-green/10" />
                        <span className="px-3.5 py-1 bg-green text-white text-xs font-bold rounded-full">
                            {filtered.length} {filtered.length === 1 ? 'pathway' : 'pathways'}
                        </span>
                        <div className="flex-1 h-px bg-green/10" />
                    </div>
                )}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-20 rounded-2xl bg-green/5 animate-pulse" style={{ animationDelay: `${i * 70}ms` }} />
                        ))}
                    </div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {filtered.map((g: any, index: number) => (
                            <Link key={g.id || g._id} href={`/courses/${guidanceSlug(g.title)}`}
                                className="group flex items-center gap-4 p-5 bg-white border border-green/12 rounded-2xl hover:border-green/30 hover:shadow-md hover:shadow-green/8 transition-all duration-200"
                                style={{ animationDelay: `${index * 40}ms` }}>
                                <div className="w-11 h-11 rounded-xl bg-green/8 text-green flex items-center justify-center shrink-0 group-hover:bg-green/15 transition-colors">
                                    {getGuidanceIcon(g.title)}
                                </div>
                                <h3 className="flex-1 font-bold text-dark text-sm leading-tight">{g.title}</h3>
                                <div className="text-green/30 group-hover:text-green/60 transition-colors shrink-0">
                                    {isAr ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-green/10 text-green rounded-full flex items-center justify-center mx-auto mb-6"><Search size={40} /></div>
                        <h2 className="text-2xl font-bold text-dark">No pathways found</h2>
                    </div>
                )}
            </main>
        </div>
    );
}
