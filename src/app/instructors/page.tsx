'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, BookOpen } from 'lucide-react';
import api from '@/lib/api';

interface Instructor {
    _id: string;
    displayName: string;
    photoURL?: string;
    courseCount: number;
}

export default function InstructorsPage() {
    const t = useTranslations('Instructors');
    const locale = useLocale();
    const isAr = locale === 'ar';
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/instructor')
            .then(res => setInstructors(res.data))
            .catch(err => setError(err.response?.data?.error || 'Failed to fetch instructors'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="min-h-screen bg-white pt-20 md:pt-32 pb-16" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12 space-y-3">
                    <div className="flex items-center gap-3 text-green">
                        <div className="svc-icon" style={{ background: 'rgba(58,170,106,0.10)', color: '#3aaa6a' }}>
                            <GraduationCap size={22} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(58,170,106,0.6)' }}>
                            {t('title')}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-dark">{t('title')}</h1>
                    <p className="text-sm" style={{ color: 'rgba(26,58,42,0.4)' }}>{t('subtitle')}</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-[18px] p-4 mb-6 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Loading skeletons */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="rounded-[18px] overflow-hidden animate-pulse" style={{ border: '1.5px solid rgba(58,170,106,0.08)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                <div className="h-36" style={{ background: '#f3f4f3' }} />
                                <div className="p-5 space-y-2.5">
                                    <div className="h-4 w-32 rounded-full" style={{ background: '#f3f4f3' }} />
                                    <div className="h-3 w-20 rounded-full" style={{ background: '#f3f4f3' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : instructors.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center text-center py-20 px-4 rounded-[18px] border border-dashed"
                        style={{ background: 'rgba(58,170,106,0.03)', borderColor: 'rgba(58,170,106,0.18)' }}>
                        <div className="svc-icon mb-5" style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(58,170,106,0.10)', color: '#3aaa6a' }}>
                            <GraduationCap size={26} />
                        </div>
                        <h3 className="text-xl font-bold text-dark mb-2">{t('empty')}</h3>
                        <p className="text-sm max-w-sm mb-7 leading-relaxed" style={{ color: 'rgba(26,58,42,0.45)' }}>
                            {t('empty_cta_desc')}
                        </p>
                        <Link
                            href="/apply-instructor"
                            className="inline-flex items-center gap-2 bg-green text-white font-bold px-6 py-3 rounded-2xl hover:bg-green/85 transition-all shadow-[0_4px_20px_rgba(58,170,106,0.35)]"
                        >
                            {t('empty_cta')}
                            <ArrowRight size={15} className={isAr ? 'rotate-180' : ''} />
                        </Link>
                    </div>
                ) : (
                    /* Instructor grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {instructors.map((instructor, i) => (
                            <motion.div
                                key={instructor._id}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                style={{ willChange: 'transform' }}
                            >
                                <Link href={`/instructor/${instructor._id}`} className="group block">
                                    <div
                                        className="relative bg-white rounded-[18px] overflow-hidden flex flex-col transition-all duration-[280ms] cubic-bezier-spring"
                                        style={{
                                            border: '1.5px solid rgba(58,170,106,0.11)',
                                            boxShadow: '0 2px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
                                        }}
                                        onMouseEnter={e => {
                                            const el = e.currentTarget;
                                            el.style.borderColor = 'rgba(58,170,106,0.35)';
                                            el.style.boxShadow = '0 10px 28px rgba(58,170,106,0.14), 0 3px 10px rgba(58,170,106,0.08)';
                                            el.style.transform = 'translate3d(0,-5px,0)';
                                        }}
                                        onMouseLeave={e => {
                                            const el = e.currentTarget;
                                            el.style.borderColor = 'rgba(58,170,106,0.11)';
                                            el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)';
                                            el.style.transform = 'translate3d(0,0,0)';
                                        }}
                                    >
                                        {/* Top accent bar */}
                                        <div
                                            className="absolute top-0 left-0 w-1/2 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                                            style={{ background: 'linear-gradient(90deg, #3aaa6a, #5dc98a)', transitionTimingFunction: 'cubic-bezier(0.34,1.2,0.64,1)' }}
                                        />
                                        <div
                                            className="absolute top-0 right-0 w-1/2 h-[3px] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                                            style={{ background: 'linear-gradient(90deg, #5dc98a, #3aaa6a)', transitionTimingFunction: 'cubic-bezier(0.34,1.2,0.64,1)' }}
                                        />

                                        {/* Avatar header */}
                                        <div
                                            className="p-8 flex items-center justify-center relative"
                                            style={{
                                                background: 'linear-gradient(135deg, #f0faf5 0%, #e8f5ee 100%)',
                                                backgroundImage: 'linear-gradient(135deg, #f0faf5 0%, #e8f5ee 100%), radial-gradient(circle, rgba(58,170,106,0.18) 1px, transparent 1px)',
                                                backgroundSize: 'auto, 14px 14px',
                                            }}
                                        >
                                            {instructor.photoURL ? (
                                                <Image
                                                    src={instructor.photoURL.startsWith('http')
                                                        ? instructor.photoURL
                                                        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/data/images/profile-picture/${instructor.photoURL}`}
                                                    alt={instructor.displayName}
                                                    width={80}
                                                    height={80}
                                                    className="w-20 h-20 rounded-full object-cover transition-transform duration-[280ms] group-hover:scale-105"
                                                    style={{ boxShadow: '0 4px 12px rgba(58,170,106,0.25)' }}
                                                />
                                            ) : (
                                                <div
                                                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-black transition-transform duration-[280ms] group-hover:scale-105"
                                                    style={{ background: 'linear-gradient(135deg, #3aaa6a, #1e7a46)', boxShadow: '0 4px 12px rgba(58,170,106,0.3)' }}
                                                >
                                                    {instructor.displayName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 p-5 flex flex-col">
                                            <h3 className="font-bold text-dark mb-1 group-hover:text-green transition-colors duration-200" style={{ fontSize: '0.9rem' }}>
                                                {instructor.displayName}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-auto pt-3" style={{ borderTop: '1px solid rgba(58,170,106,0.08)' }}>
                                                <div
                                                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                                                    style={{ background: 'rgba(58,170,106,0.07)', color: 'rgba(58,170,106,0.75)' }}
                                                >
                                                    <BookOpen size={11} />
                                                    {instructor.courseCount}
                                                </div>
                                                <span className="text-xs" style={{ color: 'rgba(26,58,42,0.45)' }}>
                                                    {instructor.courseCount === 1 ? t('course') : t('courses')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
