
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ExternalLink, Download, FileText, Heart, MessageCircle, Send, Star, Eye, ChevronRight, CircleCheck, CircleX, CircleDot } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";
import { ResourceButton } from "@/components/ResourceButton";
import { CookiesWindow } from "@/components/CookiesWindow";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSnackbar } from "@/contexts/SnackbarContext";
import api from "@/lib/api";
import { useTranslations } from "next-intl";


const viewedNewsIds = new Set<string>();

// Route external images through our server-side proxy to bypass hotlink protection.
const proxyUrl = (src: string): string => {
    if (!src) return src;
    if (src.startsWith('data:') || src.startsWith('/')) return src;
    return `/api/news-image?url=${encodeURIComponent(src)}`;
};

const downloadImage = async (url: string, hint = "image") => {
    const slug = hint.replace(/[^a-zA-Z0-9؀-ۿ]+/g, "_").slice(0, 60) || "image";
    // Always download through proxy — bypasses CORS and hotlink restrictions
    const fetchUrl = proxyUrl(url);
    try {
        const res = await fetch(fetchUrl);
        const blob = await res.blob();
        const ext = blob.type.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `${slug}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
    } catch {
        window.open(fetchUrl, "_blank");
    }
};

const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text || "");

const renderText = (text: string, style: any, forceBlack = false, forceWhite = false) => {
    if (!text) return null;
    const lines = text.split("\n");
    const isColored = (c: string) => {
        if (!c) return false;
        const cl = c.toLowerCase().replace(/\s+/g, '');
        return !['#000', '#000000', 'black', 'rgb(0,0,0)', '#fff', '#ffffff', 'white', 'rgb(255,255,255)', 'transparent', 'inherit'].includes(cl);
    };
    return lines.map((line, i) => (
        <React.Fragment key={i}>
            <span style={{
                color: forceBlack ? "#111" : (forceWhite ? "#fff" : (isColored(style?.color) ? "#3aaa6a" : (style?.color || "inherit"))),
                fontWeight: style?.is_bold ? "900" : "inherit",
            }}>
                {line}
            </span>
            {i < lines.length - 1 && <br />}
        </React.Fragment>
    ));
};

const renderBlock = (block: any, index: number) => {
    const blockStyle = block.style || {};
    switch (block.type) {
        case "text": {
            const TagName = (block.subtype?.startsWith("h") ? block.subtype : "p") as any;
            const isHeading = block.subtype?.startsWith("h");
            const isAr = isArabic(block.text);
            return (
                <TagName key={index} dir={isAr ? "rtl" : "ltr"}
                    className={`break-words ${isHeading ? "text-green font-black mt-6 mb-3 md:mt-12 md:mb-6 tracking-tight leading-[1.2]" : "text-dark/80 leading-[1.8] mb-8"}
                        ${block.subtype === "h1" || block.subtype === "h2" ? "text-base md:text-4xl" : block.subtype === "h3" ? "text-sm md:text-3xl" : block.subtype === "h4" ? "text-sm md:text-2xl" : block.subtype === "h5" ? "text-sm md:text-xl" : block.subtype === "h6" ? "text-xs md:text-lg" : "text-sm md:text-xl"}
                        ${isAr ? "text-right" : "text-left"}`}
                    style={{ textAlign: (blockStyle.align as any) || (isAr ? "right" : "left") }}>
                    {renderText(block.text, blockStyle)}
                </TagName>
            );
        }
        case "image":
            return (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="my-10 relative group">
                    <div className="relative overflow-hidden rounded-[32px] border border-gray-100">
                        <a href={block.src} target="_blank" rel="noopener noreferrer" className="block cursor-zoom-in">
                            <img src={proxyUrl(block.src)} alt={block.alt || "Article Image"} className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-700" />
                        </a>
                        {block.alt && (
                            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
                                <p className="text-white/90 text-sm font-bold tracking-wide italic">{block.alt}</p>
                            </div>
                        )}
                        <button
                            onClick={() => downloadImage(block.src, block.alt || `image_${index}`)}
                            title="Download image"
                            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-md"
                            style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}
                        >
                            <Download size={12} /> Download
                        </button>
                    </div>
                </motion.div>
            );
        case "list": {
            const listIsAr = block.items?.some((item: any) => isArabic(item.text));
            return (
                <ul key={index} className="space-y-4 mb-10 list-none" dir={listIsAr ? "rtl" : "ltr"}>
                    {block.items?.map((item: any, i: number) => {
                        const isAr = isArabic(item.text);
                        return (
                            <li key={i} className={`flex gap-4 group items-start ${isAr ? "text-right" : "text-left"}`} dir={isAr ? "rtl" : "ltr"}>
                                <span className="mt-2.5 w-2 h-2 rounded-full bg-green/20 border-2 border-green/40 group-hover:bg-green group-hover:border-green transition-all shrink-0" />
                                <span className="text-dark/80 leading-relaxed text-lg lg:text-xl">{renderText(item.text, item.style)}</span>
                            </li>
                        );
                    })}
                </ul>
            );
        }
        case "link":
            return (
                <motion.div key={index} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="mb-8">
                    <DownloadButton href={block.url} text={renderText(block.text, block.style, false, true)} />
                </motion.div>
            );
        case "table": {
            const allText = block.rows.flat().map((c: any) => c.text || "").join(" ");
            const tableIsAr = isArabic(allText);
            const renderCellLinks = (cell: any) => {
                const links: any[] = Array.isArray(cell.link) ? cell.link : cell.link ? [cell.link] : [];
                if (!links.length) return renderText(cell.text, cell.style, true);
                return (
                    <div className="flex flex-col gap-1">
                        {cell.text && !links.some((l: any) => l.text === cell.text) && (
                            <span>{renderText(cell.text, cell.style, true)}</span>
                        )}
                        {links.map((lk: any, li: number) => lk.isAttachment ? (
                            <DownloadButton key={li} href={lk.url} text={lk.text} isSmall showArrow={false} />
                        ) : (
                            <a key={li} href={lk.url} target="_blank" rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 text-[#1565c0] font-semibold hover:underline">
                                {lk.text}<ExternalLink size={12} />
                            </a>
                        ))}
                    </div>
                );
            };
            return (
                <div key={index} className="my-8 overflow-x-auto" dir={tableIsAr ? "rtl" : "ltr"}>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {block.rows[0].map((cell: any, i: number) => (
                                    <th key={i} className="pb-3 pt-6 text-base font-bold text-dark border-b border-gray-200 first:pt-0">
                                        {renderCellLinks(cell)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {block.rows.slice(1).map((row: any[], ri: number) => (
                                <tr key={ri}>
                                    {row.map((cell: any, ci: number) => (
                                        <td key={ci} className="py-4 px-1 text-[15px] font-medium text-dark/70 leading-relaxed">
                                            <div className={cell.is_header ? "font-bold text-dark" : ""}>
                                                {renderCellLinks(cell)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
        case "video":
            if (block.platform === "youtube" && block.embed_url) {
                return (
                    <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="my-10">
                        <div className="relative w-full rounded-[32px] overflow-hidden border border-gray-100 shadow-lg" style={{ paddingTop: "56.25%" }}>
                            <iframe
                                src={`${block.embed_url}?rel=0&modestbranding=1`}
                                title="YouTube video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                            />
                        </div>
                    </motion.div>
                );
            }
            return null;
        default:
            return null;
    }
};

export default function NewsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const t = useTranslations("News");
    const rawParam = params.id as string; // slug or numeric _id

    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { user, checkAuth, refreshUser, getPhotoURL, getResourceURL } = useAuth();
    const { showSnackbar } = useSnackbar();
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [articleId, setArticleId] = useState('');

    // Q&A State
    const [questions, setQuestions] = useState<any[]>([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [isSubmittingQ, setIsSubmittingQ] = useState(false);
    const [replyingToId, setReplyingToId] = useState<string | null>(null);
    const [adminAnswer, setAdminAnswer] = useState("");
    const [isSubmittingA, setIsSubmittingA] = useState(false);

    useEffect(() => {
        let cancelled = false;
        api.get(`/news/${rawParam}`).then(r => r.data)
            .then(async (articleData) => {
                if (cancelled) return;
                const aid = String(articleData._id);
                setArticle(articleData);
                setArticleId(aid);
                setUserRating(articleData.userRating || 0);
                const qData = await api.get(`/news/${aid}/questions`)
                    .then(r => r.data).catch(() => []);
                if (!cancelled) {
                    setQuestions(qData || []);
                    setLoading(false);
                }
            })
            .catch(() => { if (!cancelled) { setError(true); setLoading(false); } });
        return () => { cancelled = true; };
    }, [rawParam]);

    useEffect(() => {
        if (!articleId || viewedNewsIds.has(articleId)) return;
        viewedNewsIds.add(articleId);
        api.post(`/news/${articleId}/view`).catch(err => console.error('Failed to track view:', err));
    }, [articleId]);

    useEffect(() => {
        if (user?.progress?.savedNews && articleId) {
            setIsSaved(user.progress.savedNews.includes(articleId));
        }
    }, [user, articleId]);

    const handleRate = async (rating: number) => {
        if (!user) {
            showSnackbar(t('login_to_rate'), 'info');
            return;
        }
        if (userRating > 0) return; // Already rated

        try {
            const res = await api.post(`/news/${articleId}/rate`, { rating });
            setUserRating(rating);
            if (res.data.rating) {
                setArticle({ ...article, rating: res.data.rating });
            }
            showSnackbar(t('rating_thanks'), 'success');
        } catch (err) {
            console.error('Rating error:', err);
            showSnackbar(t('rating_failed'), 'error');
        }
    };

    const handleSave = async () => {
        if (!user) {
            showSnackbar(t('login_to_save'), 'info');
            return;
        }
        if (isSaving) return;

        setIsSaving(true);
        try {
            const res = await api.post('/user/saved-news', { newsId: articleId });
            setIsSaved(res.data.savedNews.includes(articleId));
            await checkAuth();
        } catch (error: any) {
            console.error('Failed to toggle save', error);
            if (error?.response?.status === 401) {
                showSnackbar(t('session_expired'), 'info');
                refreshUser();
            } else {
                showSnackbar(t('save_failed'), 'error');
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleAskQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newQuestion.trim() || isSubmittingQ) return;

        setIsSubmittingQ(true);
        try {
            const res = await api.post(`/news/${articleId}/questions`, { question: newQuestion });
            setQuestions([res.data, ...questions]);
            setNewQuestion("");
        } catch (err) {
            console.error('Ask question error:', err);
            showSnackbar(t('question_failed'), 'error');
        } finally {
            setIsSubmittingQ(false);
        }
    };

    const handleAnswerQuestion = async (questionId: string) => {
        if (!user || user.role !== 'admin' || !adminAnswer.trim() || isSubmittingA) return;

        setIsSubmittingA(true);
        try {
            const res = await api.patch(`/news/questions/${questionId}/answer`, { answer: adminAnswer });
            setQuestions(questions.map(q => q._id === questionId ? res.data : q));
            setAdminAnswer("");
            setReplyingToId(null);
            showSnackbar(t('answer_success'), 'success');
        } catch (err) {
            console.error('Answer question error:', err);
            showSnackbar(t('answer_failed'), 'error');
        } finally {
            setIsSubmittingA(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-green border-t-transparent animate-spin" />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <div className="text-center space-y-6">
                    <h1 className="text-3xl font-black text-dark tracking-tight">Article not found</h1>
                    <button onClick={() => router.push("/news")}
                        className="px-8 py-3 rounded-2xl bg-dark text-white font-bold hover:scale-105 transition-all flex items-center gap-2 mx-auto">
                        <ArrowLeft size={18} /> Return to News
                    </button>
                </div>
            </div>
        );
    }

    // Extract hero image from article data (organized or raw)
    const heroImage = article.imageUrl
        || article.images?.[0]?.src
        || article.content_blocks?.find((b: any) => b.type === 'image')?.src
        || null;

    // Status helpers
    const statusConfig: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
        open:    { color: '#3aaa6a', bg: 'rgba(58,170,106,0.15)', icon: <CircleCheck size={13} />, label: 'Ouvert' },
        closed:  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  icon: <CircleX size={13} />,    label: 'Fermé' },
        unknown: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: <CircleDot size={13} />,  label: 'Statut inconnu' },
    };
    const statusInfo = statusConfig[article.status] || statusConfig.unknown;

    const DATE_LABELS: Record<string, string> = {
        deadline:     'Date limite',
        registration: 'Inscription',
        exam:         'Examen',
        results:      'Résultats',
        interview:    'Entretien',
        update:       'Mise à jour',
        date:         'Date',
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen pb-32 bg-white">

            {/* ── Hero ─────────────────────────────────────── */}
            <div className="relative overflow-hidden h-[33dvh] min-h-[200px] md:h-auto md:min-h-[520px]">
                {/* Background: hero image or gradient */}
                {heroImage ? (
                    <>
                        <img src={proxyUrl(heroImage)} alt={article.title || "Article cover"} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,58,42,0.45) 0%, rgba(26,58,42,0.92) 70%, #1a3a2a 100%)' }} />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-dark" />
                )}
                {/* Dot texture overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                {/* Decorative rings */}
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none" style={{ border: '30px solid rgba(58,170,106,0.12)' }} />
                <div className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full pointer-events-none" style={{ border: '36px solid rgba(58,170,106,0.08)' }} />

                <div className="relative z-10 max-w-4xl mx-auto px-[clamp(20px,5vw,48px)] pt-14 md:pt-36 pb-5 md:pb-10 flex flex-col justify-between md:justify-end h-full">
                    {/* Top bar: back + hero download */}
                    <div className="flex items-center justify-between mb-auto pb-6">
                        <button
                            onClick={() => router.push("/news")}
                            className="flex items-center gap-2 font-bold text-sm rounded-full px-4 py-2 transition-all duration-200 backdrop-blur-md"
                            style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                        >
                            <ArrowLeft size={15} />
                            <span className="hidden md:inline">{t('back_to_news')}</span>
                        </button>
                    </div>

                    {/* Category + meta */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="px-4 py-1.5 rounded-full bg-green text-white text-[11px] font-black uppercase tracking-wider">
                            {article.type || article.category}
                        </span>
                        {/* Status badge */}
                        {article.status && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black backdrop-blur-sm"
                                style={{ background: statusInfo.bg, color: statusInfo.color }}>
                                {statusInfo.icon}{statusInfo.label}
                            </span>
                        )}
                        {article.card_date && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white/60 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                <Calendar size={11} />{article.card_date}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white/60 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <Eye size={11} />{article.viewCount || 0}
                        </span>
                        {(article.rating?.average || article.rating) ? (
                            <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-black text-amber-300 backdrop-blur-sm" style={{ background: 'rgba(251,191,36,0.12)' }}>
                                <Star size={11} className="fill-current" />
                                {Number(article.rating?.average ?? article.rating ?? 0).toFixed(1)}
                            </span>
                        ) : null}
                    </div>

                    {/* Title */}
                    <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-black text-white leading-[1.15] tracking-tight max-w-3xl break-words overflow-hidden">
                        {article.title}
                    </h1>

                    {/* Save button — under title, desktop only (mobile shown below hero) */}
                    <div className="hidden md:block mt-5">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm backdrop-blur-md transition-all duration-200 active:scale-95 ${isSaved ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'text-white/80 hover:text-white'}`}
                            style={isSaved ? {} : { background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                            <Heart size={15} fill={isSaved ? "currentColor" : "transparent"} />
                            {isSaved ? t('saved') : t('save')}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile meta bar (below the compressed hero) ── */}
            <div className="md:hidden flex items-center gap-2.5 px-4 py-3 border-b border-green/8 bg-white flex-wrap overflow-x-hidden">
                {/* Category */}
                {(article.type || article.category) && (
                    <span className="px-2.5 py-1 rounded-full bg-green/10 text-green text-[11px] font-black uppercase tracking-wide shrink-0">
                        {article.type || article.category}
                    </span>
                )}
                {/* Views */}
                {article.viewCount > 0 && (
                    <span className="flex items-center gap-1 text-xs text-dark/40 font-semibold shrink-0">
                        <Eye size={12} /> {article.viewCount}
                    </span>
                )}
                {/* Rating */}
                {(article.rating?.average || article.rating) ? (
                    <span className="flex items-center gap-1 text-xs text-amber-500 font-black shrink-0">
                        <Star size={12} className="fill-current" />
                        {Number(article.rating?.average ?? article.rating ?? 0).toFixed(1)}
                    </span>
                ) : null}
                {/* Save */}
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`ml-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-sm transition-all active:scale-95 shrink-0 ${isSaved ? 'bg-red-500 text-white' : 'bg-green/8 border border-green/15 text-dark/60 hover:text-green'}`}
                >
                    <Heart size={13} fill={isSaved ? "currentColor" : "transparent"} />
                    {isSaved ? t('saved') : t('save')}
                </button>
            </div>

            {/* ── Article Body ────────────────────────────── */}
            <div className="max-w-3xl mx-auto px-[clamp(20px,5vw,48px)]">

                {/* Green accent line */}
                <div className="h-1 w-16 rounded-full bg-green mx-auto -mt-0.5 mb-12" />

                {/* ── Important Dates Timeline ──────────────────────────── */}
                {article.important_dates && article.important_dates.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-xl bg-green/10 flex items-center justify-center text-green shrink-0">
                                <Calendar size={17} />
                            </div>
                            <h3 className="text-lg font-black text-dark tracking-tight">Dates importantes</h3>
                        </div>
                        <div className="relative pl-5 border-l-2 border-green/15 space-y-4">
                            {article.important_dates.map((d: any, i: number) => {
                                const today = new Date().toISOString().slice(0, 10);
                                const isPast = d.date < today;
                                const isDeadline = ['deadline', 'registration', 'exam'].includes(d.label);
                                return (
                                    <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                        className={`relative flex items-start gap-4 p-4 rounded-2xl border transition-all ${isPast ? 'bg-gray-50/60 border-gray-100' : 'bg-white border-green/10 shadow-sm'}`}>
                                        {/* Timeline dot */}
                                        <div className={`absolute -left-[21px] w-4 h-4 rounded-full border-2 border-white shrink-0 mt-0.5 ${isPast ? 'bg-gray-300' : isDeadline ? 'bg-red-400' : 'bg-green'}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isPast ? 'bg-gray-100 text-gray-400' : isDeadline ? 'bg-red-50 text-red-500' : 'bg-green/8 text-green'}`}>
                                                    {DATE_LABELS[d.label] || d.label}
                                                </span>
                                                {!isPast && isDeadline && (
                                                    <span className="text-[10px] font-bold text-red-400">Délai actif</span>
                                                )}
                                            </div>
                                            <p className={`text-base font-black mt-1 ${isPast ? 'text-dark/35 line-through' : 'text-dark'}`}>
                                                {d.date}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Content */}
                <div className="mb-16 overflow-x-hidden">
                    <article className="prose md:prose-xl max-w-none prose-headings:text-dark prose-p:text-dark/75 prose-p:leading-[1.9] prose-li:text-dark/75">
                        {article.content_blocks && article.content_blocks.length > 0
                            ? article.content_blocks.map((block: any, idx: number) => renderBlock(block, idx))
                            : article.content_sections && article.content_sections.length > 0
                                ? article.content_sections.map((sec: any, idx: number) => {
                                    const arabicCharCount = (s: string) => (s.match(/[؀-ۿ]/g) || []).length;
                                    const latinCharCount = (s: string) => (s.match(/[a-zA-ZÀ-ɏ]/g) || []).length;
                                    const textDir = (s: string) => {
                                        const ar = arabicCharCount(s), lat = latinCharCount(s);
                                        if (ar === 0 && lat === 0) return 'auto';
                                        return ar > lat ? 'rtl' : 'ltr';
                                    };
                                    return (
                                        <div key={idx} className="mb-10">
                                            {sec.heading && (
                                                <h3 className={`text-green font-black mt-6 mb-3 md:mt-10 md:mb-5 text-sm md:text-xl tracking-tight leading-[1.2] ${textDir(sec.heading) === 'rtl' ? 'text-right' : 'text-left'}`}
                                                    dir={textDir(sec.heading)}>
                                                    {sec.heading}
                                                </h3>
                                            )}
                                            {(sec.body || []).map((line: string, li: number) => {
                                                if (line.startsWith('__IMAGE:')) {
                                                    const inner = line.slice(8);
                                                    const pipeIdx = inner.indexOf('|');
                                                    const src = pipeIdx > 0 ? inner.slice(0, pipeIdx) : inner;
                                                    const alt = pipeIdx > 0 ? inner.slice(pipeIdx + 1) : '';
                                                    return (
                                                        <div key={li} className="my-8 relative group overflow-hidden rounded-[24px] border border-gray-100">
                                                            <img src={proxyUrl(src)} alt={alt} className="w-full h-auto object-cover" loading="lazy" />
                                                            {alt && <p className="text-xs text-dark/40 italic text-center px-4 py-2">{alt}</p>}
                                                            <button
                                                                onClick={() => downloadImage(src, alt || `image_${li}`)}
                                                                title="Download image"
                                                                className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-md"
                                                                style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}
                                                            >
                                                                <Download size={12} /> Download
                                                            </button>
                                                        </div>
                                                    );
                                                }
                                                if (line.startsWith('__VIDEO:')) {
                                                    const inner = line.slice(8);
                                                    const pipeIdx = inner.indexOf('|');
                                                    const videoId = pipeIdx > 0 ? inner.slice(0, pipeIdx) : inner;
                                                    const embedUrl = pipeIdx > 0 ? inner.slice(pipeIdx + 1) : `https://www.youtube.com/embed/${videoId}`;
                                                    if (!videoId) return null;
                                                    return (
                                                        <div key={li} className="my-8 relative w-full rounded-[24px] overflow-hidden border border-gray-100 shadow-lg" style={{ paddingTop: '56.25%' }}>
                                                            <iframe src={`${embedUrl}?rel=0&modestbranding=1`} title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }} />
                                                        </div>
                                                    );
                                                }
                                                if (line.startsWith('__LINK:')) {
                                                    const inner = line.slice(7);
                                                    const pipeIdx = inner.lastIndexOf('|');
                                                    const label = pipeIdx > 0 ? inner.slice(0, pipeIdx) : inner;
                                                    const href = pipeIdx > 0 ? inner.slice(pipeIdx + 1) : '#';
                                                    return (
                                                        <a key={li} href={href} target="_blank" rel="noopener noreferrer"
                                                            className="flex items-center gap-1.5 text-green font-bold text-sm md:text-base underline underline-offset-2 decoration-green/40 hover:decoration-green my-1 transition-colors break-all">
                                                            <ExternalLink size={12} className="shrink-0 opacity-70" />
                                                            {label || href}
                                                        </a>
                                                    );
                                                }
                                                const dir = textDir(line);
                                                return (
                                                    <p key={li} className={`text-dark/80 leading-[1.8] mb-4 text-sm md:text-xl ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                                                        dir={dir}>
                                                        {line}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                    );
                                })
                                : (article.paragraphs || []).length > 0
                                    ? (article.paragraphs || []).map((p: string, idx: number) => (
                                        <p key={idx} className="mb-8 text-lg leading-[1.9]">{p}</p>
                                    ))
                                    : article.content
                                        ? <>
                                            <style>{`
                                                .ahc{direction:${article.language==='fr'?'ltr':'rtl'};text-align:${article.language==='fr'?'left':'right'};font-size:1rem;color:rgba(26,31,46,0.85);line-height:1.75;}
                                                .ahc h1,.ahc h2{color:#3aaa6a;font-size:1.3rem;font-weight:900;margin:2.2rem 0 0.8rem;line-height:1.45;}
                                                .ahc h3{color:#3aaa6a;font-size:1.1rem;font-weight:800;margin:1.8rem 0 0.6rem;line-height:1.4;}
                                                .ahc h4,.ahc h5,.ahc h6{color:rgba(26,31,46,0.9);font-size:1rem;font-weight:700;margin:1.4rem 0 0.5rem;}
                                                .ahc p{margin:0 0 1.3rem;line-height:1.9;color:rgba(26,31,46,0.82);}
                                                .ahc ul{list-style:disc;padding-right:1.6rem;padding-left:0;margin:0 0 1.3rem;}
                                                .ahc ol{list-style:decimal;padding-right:1.6rem;padding-left:0;margin:0 0 1.3rem;}
                                                .ahc li{margin-bottom:0.45rem;line-height:1.8;color:rgba(26,31,46,0.82);}
                                                .ahc table{width:100%;border-collapse:collapse;margin:0 0 1.5rem;font-size:0.88rem;display:block;overflow-x:auto;}
                                                .ahc table td,.ahc table th{border:1px solid #e5e7eb;padding:8px 12px;vertical-align:top;}
                                                .ahc table th{background:#f0fdf4;color:#3aaa6a;font-weight:700;white-space:nowrap;}
                                                .ahc table tr:nth-child(even) td{background:#f9fafb;}
                                                .ahc a{color:#3aaa6a;text-decoration:underline;text-underline-offset:3px;}
                                                .ahc strong,.ahc b{font-weight:700;color:rgba(26,31,46,0.95);}
                                                .ahc img{max-width:100%;height:auto;border-radius:12px;margin:1.5rem auto;display:block;}
                                                .ahc blockquote{border-right:4px solid #3aaa6a;border-left:none;padding:0.75rem 1.25rem;margin:1.5rem 0;background:#f0fdf4;color:rgba(26,31,46,0.75);font-style:italic;border-radius:0 8px 8px 0;}
                                                @media(min-width:768px){.ahc h1,.ahc h2{font-size:1.75rem;}.ahc h3{font-size:1.4rem;}.ahc p,.ahc li{font-size:1.15rem;}}
                                            `}</style>
                                            <div
                                                className="ahc"
                                                dangerouslySetInnerHTML={{ __html: article.content }}
                                            />
                                          </>
                                        : null
                        }
                    </article>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-12">
                    <div className="flex-1 h-px bg-green/10" />
                    <Star size={14} className="text-green/20" />
                    <div className="flex-1 h-px bg-green/10" />
                </div>

                {/* Star Rating — modern card */}
                <section className="mb-12">
                    <div className="rounded-[24px] border border-green/12 bg-white overflow-hidden shadow-sm">
                        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #3aaa6a, #5dc98a, #3aaa6a)' }} />
                        <div className="p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6">
                            <div className="flex flex-col items-center sm:items-start gap-1 sm:min-w-[160px]">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-dark/30">
                                    {t('questions_answers').split(' ')[0] === 'Questions' ? 'Rate this article' : 'تقييم المقال'}
                                </span>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <span className="text-4xl font-black text-dark">
                                        {userRating > 0 ? userRating : Number(article.rating?.average ?? article.rating ?? 0).toFixed(1)}
                                    </span>
                                    <span className="text-dark/25 font-bold text-sm">/5</span>
                                </div>
                                {article.rating?.count > 0 && (
                                    <span className="text-xs text-dark/30 font-semibold">{article.rating.count} {article.rating.count === 1 ? 'rating' : 'ratings'}</span>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col items-center sm:items-start gap-3">
                                <div className="flex items-center gap-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleRate(star)}
                                            disabled={userRating > 0}
                                            className={`transition-all duration-150 ${userRating > 0 ? 'cursor-default' : 'hover:scale-115 active:scale-90'}`}
                                        >
                                            <Star
                                                size={32}
                                                strokeWidth={1.5}
                                                className={`transition-colors ${star <= (userRating || Math.round(article.rating?.average || article.rating || 0))
                                                    ? 'text-amber-400 fill-amber-400'
                                                    : 'text-dark/12 hover:text-amber-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {userRating > 0 ? (
                                    <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green/8 border border-green/15 text-green text-xs font-bold">
                                        <Star size={11} className="fill-green" /> Thank you for rating!
                                    </motion.span>
                                ) : (
                                    <p className="text-xs text-dark/35 font-medium">Your feedback helps us improve our content</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Attachments */}
                {article.attachments && article.attachments.length > 0 && (
                    <section className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-green/10 flex items-center justify-center text-green shrink-0">
                                <FileText size={18} />
                            </div>
                            <h3 className="text-xl font-black text-dark tracking-tight">{t('official_resources')}</h3>
                        </div>
                        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {article.attachments.map((att: any, idx: number) => (
                                <div key={idx} className="group p-5 rounded-2xl bg-[#f6f9f7] border border-green/8 hover:border-green/25 hover:bg-white hover:shadow-xl hover:shadow-green/[0.06] transition-all duration-300 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center text-green shrink-0 group-hover:bg-green group-hover:text-white transition-colors">
                                        <Download size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-dark text-sm leading-tight line-clamp-2 group-hover:text-green transition-colors">{att.label}</p>
                                    </div>
                                    <ChevronRight size={16} className="text-dark/20 group-hover:text-green shrink-0 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Q&A Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-2xl bg-green/10 flex items-center justify-center text-green shrink-0">
                            <MessageCircle size={18} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-dark tracking-tight">{t('questions_answers')}</h3>
                            {questions.length > 0 && <p className="text-xs text-dark/30 font-semibold mt-0.5">{questions.length} question{questions.length > 1 ? 's' : ''}</p>}
                        </div>
                    </div>

                    {/* Ask form */}
                    <div className="mb-8">
                        {user ? (
                            <form onSubmit={handleAskQuestion}>
                                <div className="flex gap-3 items-start">
                                    <img
                                        src={getPhotoURL(user.photoURL) || `https://ui-avatars.com/api/?name=${user.displayName}&background=f3f4f6&color=111`}
                                        alt={user.displayName}
                                        className="w-9 h-9 rounded-full border border-green/10 object-cover shrink-0 mt-1"
                                    />
                                    <div className="flex-1 relative">
                                        <textarea
                                            value={newQuestion}
                                            onChange={(e) => setNewQuestion(e.target.value)}
                                            placeholder={t('ask_placeholder')}
                                            className="w-full bg-[#f6f9f7] border border-green/8 rounded-2xl p-4 pr-14 text-sm resize-none focus:outline-none focus:border-green/25 focus:bg-white focus:shadow-lg focus:shadow-green/[0.04] transition-all min-h-[90px]"
                                            disabled={isSubmittingQ}
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubmittingQ || !newQuestion.trim()}
                                            className="absolute bottom-3 right-3 w-9 h-9 rounded-xl bg-green text-white flex items-center justify-center hover:bg-dark disabled:opacity-40 transition-all shadow-md shadow-green/20"
                                        >
                                            <Send size={14} className="-ml-0.5 mt-0.5" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-[#f6f9f7] border border-green/8 rounded-2xl p-8 text-center flex flex-col items-center gap-3">
                                <MessageCircle size={28} className="text-green/30" />
                                <p className="text-dark/50 font-medium text-sm">{t('login_hint')}</p>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="px-5 py-2 rounded-full bg-green text-white text-sm font-bold shadow-md shadow-green/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    {t('login_to_ask')}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Questions list */}
                    <div className="space-y-3">
                        {questions.length === 0 ? (
                            <p className="text-center text-dark/30 py-8 text-sm">{t('no_questions')}</p>
                        ) : (
                            questions.map((q) => (
                                <div key={q._id} className="p-4 rounded-2xl bg-[#f6f9f7] border border-green/6 space-y-3 hover:border-green/15 transition-colors">
                                    <div className="flex gap-3">
                                        <img
                                            src={getPhotoURL(q.userId?.photoURL) || `https://ui-avatars.com/api/?name=${q.userId?.displayName}&background=fff&color=111`}
                                            alt={q.userId?.displayName || "User"}
                                            className="w-8 h-8 rounded-full border border-green/10 object-cover shrink-0 bg-white"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <span className="font-bold text-dark text-sm">{q.userId?.displayName || "Unknown"}</span>
                                                <span className="text-[11px] text-dark/30">{new Date(q.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-dark/70 text-sm leading-relaxed" dir={isArabic(q.question) ? "rtl" : "ltr"}>{q.question}</p>
                                        </div>
                                    </div>

                                    {q.answer ? (
                                        <div className="ml-8 md:ml-11 pl-4 py-2.5 rounded-xl border-l-2 border-green/30 bg-white/60">
                                            <div className="flex gap-2.5">
                                                <div className="w-6 h-6 rounded-md bg-green text-white flex items-center justify-center shrink-0 text-[7px] font-black mt-0.5">A</div>
                                                <p className="flex-1 text-dark/80 text-sm leading-relaxed" dir={isArabic(q.answer) ? "rtl" : "ltr"}>{q.answer}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        user?.role === 'admin' && (
                                            <div className="ml-8 md:ml-11">
                                                {replyingToId === q._id ? (
                                                    <div className="space-y-2">
                                                        <textarea
                                                            value={adminAnswer}
                                                            onChange={(e) => setAdminAnswer(e.target.value)}
                                                            placeholder="Write your answer..."
                                                            className="w-full bg-white border border-green/15 rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-green/30 transition-all min-h-[70px]"
                                                            autoFocus
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleAnswerQuestion(q._id)}
                                                                disabled={isSubmittingA || !adminAnswer.trim()}
                                                                className="px-3.5 py-1.5 rounded-lg bg-green text-white text-xs font-bold shadow-sm disabled:opacity-40"
                                                            >
                                                                {t('post_answer')}
                                                            </button>
                                                            <button
                                                                onClick={() => { setReplyingToId(null); setAdminAnswer(""); }}
                                                                className="px-3.5 py-1.5 rounded-lg bg-gray-100 text-dark/50 text-xs font-bold hover:bg-gray-200 transition-colors"
                                                            >
                                                                {t('cancel')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setReplyingToId(q._id)}
                                                        className="flex items-center gap-1.5 text-green font-bold text-xs hover:underline"
                                                    >
                                                        <Send size={10} className="rotate-45" /> {t('reply_btn')}
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Source link + footer */}
                <footer className="pt-8 pb-4 border-t border-green/6 flex flex-col items-center gap-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/15">Verified by Udarsy Editorial Team</p>
                    {(article.source_url || article.url) && (
                        <a href={article.source_url || article.url} target="_blank" rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-dark text-white font-bold text-xs hover:scale-105 transition-all duration-200 shadow-xl shadow-dark/15">
                            Original Source <ExternalLink size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                    )}
                </footer>
            </div>

            <CookiesWindow />

            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
                <defs>
                    <filter id="goo_download">
                        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="gooResult" />
                        <feBlend in2="gooResult" in="SourceGraphic" result="mix" />
                    </filter>
                </defs>
            </svg>
        </motion.div>
    );
}
