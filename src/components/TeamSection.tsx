"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Facebook, Twitter, Linkedin, X } from "lucide-react";
import Image from "next/image";
import { TEAM } from "@/lib/constants";

const PATTERN_CLASS: Record<string, string> = {
    coral: "bg-[radial-gradient(circle_at_20%_20%,#ff7f50_0%,transparent_50%)]",
    dots: "bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]",
    diagonal: "bg-[linear-gradient(45deg,#000_10%,transparent_10%,transparent_50%,#000_50%,#000_60%,transparent_60%,transparent_100%)]",
};

export function TeamSection() {
    const t = useTranslations('Team');
    const [currentPage, setCurrentPage] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [animKey, setAnimKey] = useState(0);
    const [inView, setInView] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Portal the bottom sheet to <body>, so it escapes the `.page-transition`
    // stacking context (created by its opacity animation). Inside that context
    // the sheet's z-50 is trapped below the sibling <Footer>; portaling to the
    // root stacking context lets the fixed overlay cover the footer.
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const check = () => {
            setIsMobile(window.innerWidth < 768);
            setCurrentPage(0);
        };
        check();
        window.addEventListener('resize', check, { passive: true });
        return () => window.removeEventListener('resize', check);
    }, []);

    // Pause auto-advance when section is offscreen — saves a setTimeout chain that
    // re-renders the whole carousel every 3.8s on every page load.
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const allTeam = useMemo(() => TEAM.map(m => ({
        ...m, role: t(m.roleKey), desc: t(m.descKey)
    })), [t]);

    const [shuffledTeam, setShuffledTeam] = useState(allTeam);

    useEffect(() => {
        setShuffledTeam([...allTeam].sort(() => Math.random() - 0.5));
    }, [allTeam]);

    const selectedMember = useMemo(
        () => shuffledTeam.find(m => m.id === selectedMemberId) ?? null,
        [shuffledTeam, selectedMemberId]
    );

    const perPage = isMobile ? 2 : 3;
    const totalPages = Math.ceil(shuffledTeam.length / perPage) || 1;

    const advance = useCallback(() => {
        setCurrentPage(p => {
            const pages = Math.ceil(shuffledTeam.length / (isMobile ? 2 : 3)) || 1;
            const next = (p + 1) % pages;
            if (next === 0) setShuffledTeam(s => [...s].sort(() => Math.random() - 0.5));
            return next;
        });
        setAnimKey(k => k + 1);
    }, [shuffledTeam.length, isMobile]);

    useEffect(() => {
        if (isHovered || !inView) return;
        const timer = setTimeout(advance, 3800);
        return () => clearTimeout(timer);
    }, [currentPage, isHovered, inView, advance]);

    const visibleMembers = useMemo(() =>
        shuffledTeam.slice(currentPage * perPage, currentPage * perPage + perPage),
    [currentPage, shuffledTeam, perPage]);

    return (
        <section ref={sectionRef} className="bg-[#f0f2ee] pt-24 pb-16 md:pb-24 px-[clamp(24px,6vw,80px)]">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green/30 bg-green/5 text-[13px] font-semibold text-green/80 shadow-[0_0_12px_rgba(58,170,106,0.15)] mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                    {t('kicker')}
                </div>
                <h2 className="text-[clamp(32px,5vw,62px)] font-bold text-dark leading-tight mb-4">
                    <span className="font-light">{t('title1')}</span> <strong className="font-extrabold text-green">{t('title_highlight')}</strong> <span className="text-green relative">{t('title2')}</span>
                </h2>
                <p className="text-[#6a8a78] text-lg max-w-2xl mx-auto">
                    {t('desc1')}<br />{t('desc2')}
                </p>
            </div>

            <div
                className="max-w-[1200px] mx-auto"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-8 items-start w-full">
                        {visibleMembers.map((member, i) => (
                            <div
                                key={`${member.id}-${animKey}`}
                                className="relative group w-full cursor-pointer"
                                style={{
                                    opacity: 0, translate: '0 40px', scale: '0.9', rotate: member.rot,
                                    animation: `teamCardIn 0.5s ease-out ${i * 0.1}s forwards`,
                                }}
                                onClick={() => isMobile && setSelectedMemberId(member.id)}
                            >
                                <div className={`rounded-2xl md:rounded-[40px] overflow-hidden ${member.color} relative aspect-[3/4] shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-black/5 transition-shadow duration-300 group-hover:shadow-[0_20px_48px_rgba(0,0,0,0.18)]`}>
                                    {member.pattern && (
                                        <div className={`absolute inset-0 opacity-10 ${PATTERN_CLASS[member.pattern] || ""}`}
                                            style={member.pattern !== 'dots' ? { backgroundSize: '10px 10px' } : undefined} />
                                    )}
                                    <div className="h-2/3 overflow-hidden relative">
                                        <Image
                                            src={member.img}
                                            alt={member.name}
                                            fill
                                            loading="lazy"
                                            sizes="(max-width: 640px) 33vw, 33vw"
                                            className="object-cover md:[@media(hover:hover)]:grayscale md:[@media(hover:hover)]:group-hover:grayscale-0 transition-[filter] duration-300 pointer-events-none"
                                        />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 p-3 md:p-8 pt-6 md:pt-12 bg-gradient-to-t from-black/90 to-transparent text-white transition-transform duration-300 md:translate-y-6 group-hover:translate-y-0">
                                        <h3 className="text-[13px] md:text-2xl font-bold mb-0.5 md:mb-1 leading-tight">{member.name}</h3>
                                        <p className="text-[11px] md:text-sm opacity-80 leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none">{member.role}</p>
                                    </div>
                                </div>
                                <div className="mt-2 md:mt-6 hidden md:flex flex-row items-center justify-between px-4 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                    <span className="bg-dark text-white font-bold text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border border-dark/10 hover:bg-green hover:border-green transition-colors cursor-pointer text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                                        {member.role}
                                    </span>
                                    <div className="flex gap-2">
                                        {member.socials?.facebook && <a href={member.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-dark/20 flex items-center justify-center text-dark/40 hover:bg-dark hover:text-white transition-all"><Facebook size={12} /></a>}
                                        {member.socials?.twitter && <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-dark/20 flex items-center justify-center text-dark/40 hover:bg-dark hover:text-white transition-all"><Twitter size={12} /></a>}
                                        {member.socials?.linkedin && <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-dark/20 flex items-center justify-center text-dark/40 hover:bg-dark hover:text-white transition-all"><Linkedin size={12} /></a>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-3 mt-4 md:mt-12">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => { setCurrentPage(i); setAnimKey(k => k + 1); }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${currentPage === i ? 'w-10 bg-dark' : 'w-6 bg-dark/10 hover:bg-dark/20'}`}
                    />
                ))}
            </div>

            {/* Mobile bottom sheet — portaled to <body> to escape the
                `.page-transition` stacking context (otherwise the footer paints over it) */}
            {mounted && createPortal(
            <AnimatePresence>
                {selectedMember && (
                    <motion.div
                        className="fixed inset-0 z-50 md:hidden flex items-end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedMemberId(null)}
                    >
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                        <motion.div
                            className="relative w-full rounded-t-[32px] overflow-hidden shadow-2xl"
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Image header */}
                            <div className={`relative h-56 ${selectedMember.color}`}>
                                <Image
                                    src={selectedMember.img}
                                    alt={selectedMember.name}
                                    fill
                                    className="object-cover object-top"
                                    sizes="100vw"
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
                                {/* Close button */}
                                <button
                                    onClick={() => setSelectedMemberId(null)}
                                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 border border-white/15"
                                >
                                    <X size={15} />
                                </button>
                                {/* Name + role over photo */}
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <h3 className="font-black text-white text-2xl leading-tight drop-shadow-lg">{selectedMember.name}</h3>
                                    <span className="inline-block mt-2 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
                                        {selectedMember.role}
                                    </span>
                                </div>
                            </div>

                            {/* Content area */}
                            <div className="bg-white px-6 pt-5 pb-10">
                                <div className="w-10 h-1 bg-dark/10 rounded-full mx-auto mb-5" />
                                <p className="text-dark/60 text-[15px] leading-relaxed mb-6">{selectedMember.desc}</p>
                                {(selectedMember.socials?.facebook || selectedMember.socials?.twitter || selectedMember.socials?.linkedin) && (
                                    <div className="flex gap-3">
                                        {selectedMember.socials?.facebook && (
                                            <a href={selectedMember.socials.facebook} target="_blank" rel="noopener noreferrer"
                                                className="w-11 h-11 rounded-2xl border border-dark/10 bg-dark/3 flex items-center justify-center text-dark/40 hover:bg-dark hover:text-white hover:border-dark transition-all">
                                                <Facebook size={15} />
                                            </a>
                                        )}
                                        {selectedMember.socials?.twitter && (
                                            <a href={selectedMember.socials.twitter} target="_blank" rel="noopener noreferrer"
                                                className="w-11 h-11 rounded-2xl border border-dark/10 bg-dark/3 flex items-center justify-center text-dark/40 hover:bg-dark hover:text-white hover:border-dark transition-all">
                                                <Twitter size={15} />
                                            </a>
                                        )}
                                        {selectedMember.socials?.linkedin && (
                                            <a href={selectedMember.socials.linkedin} target="_blank" rel="noopener noreferrer"
                                                className="w-11 h-11 rounded-2xl border border-dark/10 bg-dark/3 flex items-center justify-center text-dark/40 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] transition-all">
                                                <Linkedin size={15} />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>,
            document.body
            )}
        </section>
    );
}
