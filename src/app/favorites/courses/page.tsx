'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Heart, BookOpen, ChevronRight, ChevronLeft, Loader2, ArrowLeft, Bookmark, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import '../favorites.css';

interface FavoriteLesson {
    lessonId: string;
    subjectId: string;
    guidanceId?: string;
    isFavorite: boolean;
    lastAccessed?: string;
    totalTimeSpent?: number;
    completedResources?: string[];
    totalResourcesCount?: number;
    lessonTitle?: string;
    subjectTitle?: string;
}

const DARK_STRIPE = `repeating-linear-gradient(45deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 2px,transparent 2px,transparent 8px),linear-gradient(135deg,#1e7a46 0%,#0f4428 100%)`;
const DOT_TEXTURE: React.CSSProperties = {
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
    backgroundSize: "18px 18px",
    opacity: 0.35,
};

export default function FavoriteCoursesPage() {
    const t = useTranslations('Profile');
    const locale = useLocale();
    const isAr = locale === 'ar';
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [favorites, setFavorites] = useState<FavoriteLesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [user, authLoading, router]);

    const fetchFavorites = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/progress/favorites');
            setFavorites(Array.isArray(res.data) ? res.data : []);
        } catch (err: any) {
            console.error('Error fetching favorites:', err);
            setError(err?.response?.data?.error || err?.message || 'Failed to load favorites');
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) fetchFavorites();
    }, [user, fetchFavorites]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <Loader2 className="animate-spin text-green" size={32} />
            </div>
        );
    }

    const ChevronArrow = isAr ? ChevronLeft : ChevronRight;

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-24 md:pb-0 pt-10 md:pt-28">
            <div className="max-w-3xl mx-auto px-4 md:px-6 space-y-6">

                {/* Back */}
                <Link href="/profile" className={`btn-back inline-flex ${isAr ? 'rtl' : ''}`}>
                    <ArrowLeft size={14} className="btn-back-arrow" />
                    Back to Profile
                </Link>

                {/* Hero header */}
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden rounded-[10px] p-6 md:p-8"
                    style={{ background: DARK_STRIPE }}
                >
                    <div className="absolute inset-0 pointer-events-none" style={DOT_TEXTURE} />
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-[16px] bg-white/15 flex items-center justify-center shrink-0 border border-white/15">
                            <Heart size={26} className="text-rose-300 fill-rose-300/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                                <Sparkles size={9} /> {t('favorites_subtitle')}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                                {t('favorites')}
                            </h1>
                            <p className="text-white/50 text-xs font-medium mt-0.5">
                                {favorites.length} {favorites.length === 1 ? 'saved lesson' : 'saved lessons'}
                            </p>
                        </div>

                        {/* Explore CTA — desktop */}
                        <Link
                            href="/courses"
                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-white/12 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all"
                        >
                            Explore more <ChevronArrow size={14} />
                        </Link>
                    </div>
                </motion.div>

                {/* States */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array(4).fill(0).map((_, i) => (
                            <div
                                key={i}
                                className="h-[88px] rounded-[10px] bg-white border border-green/10 animate-pulse"
                                style={{ animationDelay: `${i * 60}ms` }}
                            />
                        ))}
                    </div>
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[10px] bg-white border border-rose-200 p-6 flex items-start gap-4"
                    >
                        <div className="w-10 h-10 rounded-[10px] bg-rose-50 flex items-center justify-center shrink-0">
                            <AlertCircle size={20} className="text-rose-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-dark">Couldn’t load your favorites</p>
                            <p className="text-xs text-dark/50 mt-0.5 break-words">{error}</p>
                        </div>
                        <button
                            onClick={fetchFavorites}
                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-green text-white text-xs font-bold hover:bg-green/90 transition-all"
                        >
                            <RefreshCw size={12} /> Retry
                        </button>
                    </motion.div>
                ) : favorites.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[10px] bg-white border border-green/10 p-12 sm:p-16 text-center"
                    >
                        <div className="w-16 h-16 bg-green/8 rounded-[10px] flex items-center justify-center mx-auto mb-4 border border-green/15">
                            <Bookmark size={26} className="text-green/70" />
                        </div>
                        <p className="font-black text-dark text-lg mb-1">No favorites yet</p>
                        <p className="text-dark/50 text-sm max-w-sm mx-auto mb-8">
                            Tap the heart on any lesson to save it here for quick access later.
                        </p>
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green text-white rounded-[10px] font-bold text-sm hover:shadow-xl hover:shadow-green/20 transition-all"
                        >
                            Browse Courses <ChevronArrow size={16} />
                        </Link>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {favorites.map((lesson, i) => {
                                const completed = lesson.completedResources?.length ?? 0;
                                const total = lesson.totalResourcesCount ?? 0;
                                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

                                return (
                                    <motion.div
                                        key={lesson.lessonId}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <Link
                                            href={`/lesson/${lesson.lessonId}`}
                                            className="fav-card group relative flex items-center gap-4 p-4 sm:p-5 rounded-[10px] bg-white border border-green/10 overflow-hidden"
                                        >
                                            {/* Icon */}
                                            <div className="w-12 h-12 rounded-[10px] bg-green/8 border border-green/15 flex items-center justify-center text-green shrink-0 transition-colors group-hover:bg-green group-hover:text-white">
                                                <BookOpen size={20} />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0 relative z-[1]">
                                                <h4 className="font-black text-dark text-sm leading-tight line-clamp-2">
                                                    {lesson.lessonTitle || 'Saved Lesson'}
                                                </h4>
                                                <p className="text-[11px] font-medium text-dark/40 mt-1 line-clamp-1">
                                                    {lesson.subjectTitle || lesson.subjectId || '—'}
                                                </p>
                                                {total > 0 && (
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <div className="h-1.5 flex-1 rounded-full bg-green/8 overflow-hidden max-w-[120px]">
                                                            <div
                                                                className="h-full bg-green rounded-full transition-all"
                                                                style={{ width: `${pct}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-black text-green tabular-nums">{pct}%</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Trailing */}
                                            <div className="flex items-center gap-2 shrink-0 relative z-[1]">
                                                <Heart size={13} className="text-rose-500 fill-rose-500" />
                                                <ChevronArrow size={16} className="text-dark/25 group-hover:text-green transition-colors" />
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Mobile CTA */}
                {!loading && !error && favorites.length > 0 && (
                    <div className="text-center sm:hidden pt-2">
                        <Link
                            href="/courses"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green text-white rounded-[10px] font-bold text-sm hover:shadow-xl hover:shadow-green/20 transition-all"
                        >
                            Explore more <ChevronArrow size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}