'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
    Newspaper, Loader2, ChevronRight, ChevronLeft, ArrowLeft, Bookmark,
    Sparkles, AlertCircle, RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import NewsCard from '@/components/NewsCard';
import '../favorites.css';

interface SavedArticle {
    _id: string;
    title?: string;
    category?: string;
    type?: string;
    imageUrl?: string;
    images?: { src: string }[];
    date?: string;
    card_date?: string;
    readTime?: string;
}

const DARK_STRIPE = `repeating-linear-gradient(45deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 2px,transparent 2px,transparent 8px),linear-gradient(135deg,#1e7a46 0%,#0f4428 100%)`;
const DOT_TEXTURE: React.CSSProperties = {
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
    backgroundSize: "18px 18px",
    opacity: 0.35,
};

const PER_PAGE = 6;
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60';

export default function FavoriteNewsPage() {
    const t = useTranslations('Profile');
    const locale = useLocale();
    const isAr = locale === 'ar';
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [news, setNews] = useState<SavedArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
    }, [user, authLoading, router]);

    const fetchSaved = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/user/saved-news');
            setNews(Array.isArray(res.data) ? res.data : []);
        } catch (err: any) {
            console.error('Error fetching saved news:', err);
            setError(err?.response?.data?.error || err?.message || 'Failed to load saved articles');
            setNews([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) fetchSaved();
    }, [user, fetchSaved]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <Loader2 className="animate-spin text-green" size={32} />
            </div>
        );
    }

    const ChevronArrow = isAr ? ChevronLeft : ChevronRight;
    const totalPages = Math.max(1, Math.ceil(news.length / PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const paged = news.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-24 md:pb-0 pt-10 md:pt-28">
            <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-6">

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
                            <Newspaper size={26} className="text-sky-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 flex items-center gap-1.5">
                                <Sparkles size={9} /> {t('saved_news_subtitle')}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
                                {t('saved_news')}
                            </h1>
                            <p className="text-white/50 text-xs font-medium mt-0.5">
                                {news.length} {news.length === 1 ? 'saved article' : 'saved articles'}
                            </p>
                        </div>

                        {/* Browse CTA — desktop */}
                        <Link
                            href="/news"
                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-white/12 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition-all"
                        >
                            Browse news <ChevronArrow size={14} />
                        </Link>
                    </div>
                </motion.div>

                {/* States */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                        {Array(3).fill(0).map((_, i) => (
                            <div
                                key={i}
                                className="w-[290px] h-[320px] rounded-[28px] bg-white border border-green/10 animate-pulse"
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
                            <p className="text-sm font-black text-dark">Couldn’t load your saved articles</p>
                            <p className="text-xs text-dark/50 mt-0.5 break-words">{error}</p>
                        </div>
                        <button
                            onClick={fetchSaved}
                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-green text-white text-xs font-bold hover:bg-green/90 transition-all"
                        >
                            <RefreshCw size={12} /> Retry
                        </button>
                    </motion.div>
                ) : news.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[10px] bg-white border border-green/10 p-12 sm:p-16 text-center"
                    >
                        <div className="w-16 h-16 bg-green/8 rounded-[10px] flex items-center justify-center mx-auto mb-4 border border-green/15">
                            <Bookmark size={26} className="text-green/70" />
                        </div>
                        <p className="font-black text-dark text-lg mb-1">{t('no_saved_news')}</p>
                        <p className="text-dark/50 text-sm max-w-sm mx-auto mb-8">
                            Tap the heart on any article to save it here for later.
                        </p>
                        <Link
                            href="/news"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green text-white rounded-[10px] font-bold text-sm hover:shadow-xl hover:shadow-green/20 transition-all"
                        >
                            Browse News <ChevronArrow size={16} />
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={safePage}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center"
                            >
                                {paged.map((item, i) => (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <NewsCard
                                            title={item.title}
                                            subtitle={item.type || item.category}
                                            category={item.category || 'General'}
                                            image={item.imageUrl || item.images?.[0]?.src || FALLBACK_IMG}
                                            href={`/news/${item._id}`}
                                            articleId={String(item._id)}
                                            date={item.card_date || (item.date ? new Date(item.date).toLocaleDateString() : '')}
                                            readTime={item.readTime}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-10">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={safePage === 1}
                                    className="w-10 h-10 rounded-[10px] border border-green/15 bg-white flex items-center justify-center hover:border-green/35 hover:text-green disabled:opacity-30 disabled:hover:border-green/15 transition-all text-dark/60 font-bold"
                                >
                                    {isAr ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-10 h-10 rounded-[10px] text-xs font-black tabular-nums transition-all ${
                                            safePage === i + 1
                                                ? 'bg-green text-white shadow-md shadow-green/20'
                                                : 'bg-white border border-green/15 text-dark hover:border-green/35 hover:text-green'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={safePage === totalPages}
                                    className="w-10 h-10 rounded-[10px] border border-green/15 bg-white flex items-center justify-center hover:border-green/35 hover:text-green disabled:opacity-30 disabled:hover:border-green/15 transition-all text-dark/60 font-bold"
                                >
                                    {isAr ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                                </button>
                            </div>
                        )}

                        {/* Mobile CTA */}
                        <div className="text-center sm:hidden pt-2">
                            <Link
                                href="/news"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-green text-white rounded-[10px] font-bold text-sm hover:shadow-xl hover:shadow-green/20 transition-all"
                            >
                                Browse news <ChevronArrow size={16} />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}