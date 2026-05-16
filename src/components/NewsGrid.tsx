'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import NewsCard from '@/components/NewsCard';
import { useTranslations } from 'next-intl';
import { BookOpen, GraduationCap, Users, LayoutGrid } from 'lucide-react';
import { useIsLowEndDevice } from '@/lib/performance';

interface NewsItem {
    id: string;
    title: string;
    subtitle: string;
    category: string;
    image: string;
    date: string;
    readTime: string;
    rating?: number;
    viewCount?: number;
    status?: string;
    language?: string;
    deadline?: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const containerVariantsReduced = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.15 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
const itemVariantsReduced = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.15 } },
};

const ITEMS_PER_PAGE = 9;

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    All: LayoutGrid,
    Bac: GraduationCap,
    Etudiant: BookOpen,
    College: Users,
};

const CATEGORIES = ['All', 'Bac', 'Etudiant', 'College'];

export default function NewsGrid({ items }: { items: NewsItem[] }) {
    const t = useTranslations('News');
    const prefersReducedMotion = useReducedMotion();
    const isLowEnd = useIsLowEndDevice();
    const simplifyMotion = prefersReducedMotion || isLowEnd;
    const [activeCategory, setActiveCategory] = React.useState('All');
    const [currentPage, setCurrentPage] = React.useState(1);

    const categories = CATEGORIES;

    const getCategoryLabel = React.useCallback((tab: string) => {
        if (tab === 'All') return t('tab_all');
        if (tab === 'Bac') return t('tab_bac');
        if (tab === 'Etudiant') return t('tab_etudiant');
        if (tab === 'College') return t('tab_college');
        return tab;
    }, [t]);

    const categoryCounts = React.useMemo(() => {
        const counts: Record<string, number> = { All: items.length };
        CATEGORIES.forEach(c => {
            if (c !== 'All') counts[c] = items.filter(i => i.category === c).length;
        });
        return counts;
    }, [items]);

    const filteredItems = React.useMemo(() => {
        return activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);
    }, [activeCategory, items]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;

    const currentItems = React.useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredItems.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage, filteredItems]);

    React.useEffect(() => { setCurrentPage(1); }, [activeCategory]);

    const goTo = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-8">
            {/* ── Category tabs ───────────────────────────────────────────── */}
            <div className="flex items-center justify-center">
                <div className="flex items-center bg-white rounded-[22px] p-1.5 shadow-lg shadow-black/[0.05] border border-green/10 overflow-x-auto scrollbar-none max-w-full gap-0.5">
                    {categories.map((tab) => {
                        const Icon = CATEGORY_ICONS[tab];
                        const isActive = activeCategory === tab;
                        const count = categoryCounts[tab] || 0;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveCategory(tab)}
                                className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-[16px] font-bold text-[13px] transition-colors duration-150 whitespace-nowrap shrink-0 ${
                                    isActive ? 'text-white' : 'text-dark/40 hover:text-dark/70 hover:bg-green/[0.05]'
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="news-cat-bg"
                                        className="absolute inset-0 rounded-[16px] shadow-lg shadow-green/20"
                                        style={{ background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 2px,transparent 2px,transparent 8px),linear-gradient(135deg,#3aaa6a 0%,#1e7a46 100%)' }}
                                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-1.5">
                                    <Icon size={16} />
                                    <span className="hidden sm:inline">{getCategoryLabel(tab)}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black min-w-[18px] text-center transition-colors ${isActive ? 'bg-white/20 text-white' : 'bg-green/8 text-dark/35'}`}>
                                        {count}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Grid ─────────────────────────────────────────────────────── */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={`${activeCategory}-${currentPage}`}
                    variants={simplifyMotion ? containerVariantsReduced : containerVariants}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="flex flex-wrap justify-center gap-8 gap-y-14 sm:gap-y-8"
                >
                    {currentItems.map((item) => (
                        <motion.div key={item.id} variants={simplifyMotion ? itemVariantsReduced : itemVariants}>
                            <NewsCard
                                title={item.title}
                                subtitle={item.subtitle}
                                category={item.category}
                                image={item.image}
                                href={`/news/${item.id}`}
                                date={item.date}
                                readTime={item.readTime}
                                rating={item.rating}
                                viewCount={item.viewCount}
                                status={item.status}
                                deadline={item.deadline}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            {currentItems.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-dark/30 font-bold text-lg">Aucun article dans cette catégorie</p>
                </div>
            )}

            {/* ── Pagination ───────────────────────────────────────────────── */}
            {totalPages > 1 && (
                <div dir="ltr" className="flex justify-center items-center gap-2 py-8 flex-wrap">
                    <button
                        onClick={() => goTo(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-full font-bold bg-white text-dark border border-green/10 hover:border-green/30 hover:bg-green/5 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        ←
                    </button>

                    {(() => {
                        const pages: (number | 'dot')[] = [];
                        const add = (p: number) => { if (!pages.includes(p)) pages.push(p); };
                        for (let i = 1; i <= Math.min(3, totalPages); i++) add(i);
                        if (currentPage > 4) pages.push('dot');
                        for (let i = Math.max(4, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) add(i);
                        if (currentPage < totalPages - 2) pages.push('dot');
                        if (totalPages > 3) add(totalPages);
                        return pages.map((p, idx) =>
                            p === 'dot' ? (
                                <span key={`dot-${idx}`} className="w-10 h-10 flex items-center justify-center text-dark/20 font-bold text-lg select-none">…</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => goTo(p as number)}
                                    className={`w-10 h-10 rounded-full font-bold transition-all focus:outline-none ${currentPage === p ? 'bg-green text-white scale-110 shadow-lg shadow-green/30' : 'bg-white text-dark border border-green/10 hover:border-green/30 hover:bg-green/5 shadow-sm'}`}
                                >
                                    {p}
                                </button>
                            )
                        );
                    })()}

                    <button
                        onClick={() => goTo(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 rounded-full font-bold bg-white text-dark border border-green/10 hover:border-green/30 hover:bg-green/5 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
}
