"use client";

import { useState, useRef, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
    ArrowLeft, BotMessageSquare, RefreshCw, Send, Star,
    Globe, Loader2, Lock, Sparkles, ChevronRight,
} from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const LANGS = [
    { code: "fr" as const, label: "Français",  flag: "🇫🇷" },
    { code: "ar" as const, label: "العربية",   flag: "🇲🇦", rtl: true },
    { code: "en" as const, label: "English",   flag: "🌐" },
];

type Lang    = "fr" | "ar" | "en";
type Phase   = "select" | "generating" | "done";

interface QAMessage { role: "user" | "ai"; text: string; }

type Usage = { explanations: number; questions_total: number; questions_per_doc: Record<string, number> };
const EMPTY_USAGE: Usage = { explanations: 0, questions_total: 0, questions_per_doc: {} };

function renderMarkdown(text: string, isRTL: boolean) {
    return text.split("\n").map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        if (line.startsWith("**") && line.endsWith("**"))
            return <p key={i} className="font-black text-dark text-sm mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
        if (/^\d+\.\s\*\*/.test(line))
            return <p key={i} className="font-black text-dark text-sm mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
        if (line.startsWith("- ") || line.startsWith("• "))
            return <p key={i} className={`text-sm text-dark/80 leading-relaxed ${isRTL ? "mr-4" : "ml-4"}`}>• {line.slice(2)}</p>;
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
            <p key={i} className="text-sm text-dark/80 leading-relaxed">
                {parts.map((p, j) =>
                    p.startsWith("**")
                        ? <strong key={j} className="font-bold text-dark">{p.replace(/\*\*/g, "")}</strong>
                        : p
                )}
            </p>
        );
    });
}

export default function AiExplainPage() {
    const router       = useRouter();
    const params       = useParams();
    const searchParams = useSearchParams();
    const { user }     = useAuth();

    const lessonId      = params.lessonId as string;
    const docId         = searchParams.get("docId") || "";
    const documentTitle = searchParams.get("title") || "Document";
    const documentUrl   = searchParams.get("url") || "";
    const lessonTitle   = searchParams.get("lessonTitle") || "";

    const effectiveDocId = docId
        || (typeof btoa !== "undefined" ? btoa(encodeURIComponent(documentUrl)) : encodeURIComponent(documentUrl));

    const [lang,            setLang]            = useState<Lang>("fr");
    const [phase,           setPhase]           = useState<Phase>("select");
    const [explanation,     setExplanation]     = useState<string | null>(null);
    const [error,           setError]           = useState<string | null>(null);
    const [showUpgradeModal,setShowUpgradeModal] = useState(false);
    const [userRating,   setUserRating]   = useState(0);
    const [avgRating,    setAvgRating]    = useState(0);
    const [ratingCount,  setRatingCount]  = useState(0);
    const [ratingLoading,setRatingLoading]= useState(false);
    const [regenLoading, setRegenLoading] = useState(false);
    const [qaMessages,   setQaMessages]   = useState<QAMessage[]>([]);
    const [qaInput,      setQaInput]      = useState("");
    const [qaLoading,    setQaLoading]    = useState(false);
    const [qaLimitError, setQaLimitError] = useState<string | null>(null);
    const qaBottomRef = useRef<HTMLDivElement>(null);

    // ── Usage helpers (localStorage, daily key) ──────────────────────────────
    const getUsageKey = useCallback(() => {
        const today = new Date().toISOString().split("T")[0];
        return `ai_usage_${user?.id || "guest"}_${today}`;
    }, [user?.id]);

    const getUsage = useCallback((): Usage => {
        try {
            const raw = typeof window !== "undefined" ? localStorage.getItem(getUsageKey()) : null;
            return raw ? (JSON.parse(raw) as Usage) : EMPTY_USAGE;
        } catch { return EMPTY_USAGE; }
    }, [getUsageKey]);

    const saveUsage = useCallback((u: Usage) => {
        try { if (typeof window !== "undefined") localStorage.setItem(getUsageKey(), JSON.stringify(u)); } catch {}
    }, [getUsageKey]);

    // ── Generate explanation ──────────────────────────────────────────────────
    const generate = useCallback(async (language: Lang, force = false) => {
        if (!user) { setError("Please log in to use AI explanations."); setPhase("done"); return; }

        const plan  = user?.subscription?.plan || "free";
        const usage = getUsage();

        if (plan === "free" && !force && usage.explanations >= 1) {
            setError("free_limit");
            setPhase("done");
            return;
        }

        setPhase("generating");
        setError(null);

        try {
            const res = await api.post("/ai/explain", {
                docId: effectiveDocId,
                documentTitle,
                lessonTitle,
                documentUrl,
                language,
                forceRegenerate: force,
            });
            setExplanation(res.data.answer);
            setAvgRating(res.data.avgRating || 0);
            setRatingCount(res.data.ratingCount || 0);
            setPhase("done");

            if (plan === "free") {
                saveUsage({ ...usage, explanations: usage.explanations + 1 });
            }
        } catch (err: any) {
            setError(err?.response?.data?.error || "Failed to generate explanation. Please try again.");
            setPhase("done");
        } finally {
            setRegenLoading(false);
        }
    }, [effectiveDocId, documentTitle, lessonTitle, documentUrl, user, getUsage, saveUsage]);

    const handleGenerate = () => {
        if (dailyUsedUp) { setShowUpgradeModal(true); return; }
        window.scrollTo({ top: 0, behavior: "smooth" });
        generate(lang);
    };

    const handleRegenerate = () => {
        setRegenLoading(true);
        setExplanation(null);
        setQaMessages([]);
        generate(lang, true);
    };

    const handleLangChange = (newLang: Lang) => {
        setLang(newLang);
        if (phase === "done" && explanation) {
            setExplanation(null);
            setQaMessages([]);
            generate(newLang);
        }
    };

    // ── Rate explanation ──────────────────────────────────────────────────────
    const handleRate = async (rating: number) => {
        if (!user || ratingLoading) return;
        setRatingLoading(true);
        setUserRating(rating);
        try {
            const res = await api.post(`/ai/rate/${encodeURIComponent(effectiveDocId)}`, { rating, language: lang });
            setAvgRating(res.data.avgRating);
            setRatingCount(res.data.ratingCount);
        } catch { setUserRating(0); }
        finally { setRatingLoading(false); }
    };

    // ── Ask question ──────────────────────────────────────────────────────────
    const handleAsk = async () => {
        if (!user || !qaInput.trim() || qaLoading) return;
        setQaLimitError(null);

        const plan     = user?.subscription?.plan || "free";
        const usage    = getUsage();
        const docCount = usage.questions_per_doc[effectiveDocId] || 0;
        const total    = usage.questions_total || 0;

        if (plan === "free") { setQaLimitError("free_qa"); return; }
        if (plan === "pro"     && docCount >= 3)  { setQaLimitError("Pro: max 3 questions per document reached."); return; }
        if (plan === "pro"     && total    >= 30) { setQaLimitError("Pro: daily question limit (30) reached."); return; }
        if (plan === "premium" && docCount >= 15) { setQaLimitError("Premium: max 15 questions per document reached."); return; }
        if (plan === "premium" && total    >= 45) { setQaLimitError("Premium: daily question limit (45) reached."); return; }

        const q = qaInput.trim();
        setQaInput("");
        setQaMessages(prev => [...prev, { role: "user", text: q }]);
        setQaLoading(true);
        setTimeout(() => qaBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

        saveUsage({
            ...usage,
            questions_total:    total + 1,
            questions_per_doc:  { ...usage.questions_per_doc, [effectiveDocId]: docCount + 1 },
        });

        try {
            const res = await api.post("/ai/ask", {
                docId: effectiveDocId,
                documentTitle, lessonTitle, documentUrl,
                question: q, language: lang,
            });
            setQaMessages(prev => [...prev, { role: "ai", text: res.data.answer }]);
        } catch (err: any) {
            setQaMessages(prev => [...prev, { role: "ai", text: err?.response?.data?.error || "Failed to get answer." }]);
        } finally {
            setQaLoading(false);
            setTimeout(() => qaBottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        }
    };

    const isRTL       = lang === "ar";
    const plan        = user?.subscription?.plan || "free";
    const isPremium   = plan === "pro" || plan === "premium";
    const dailyUsedUp = plan === "free" && getUsage().explanations >= 1;

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col" dir={isRTL ? "rtl" : "ltr"}>

            {/* ── Upgrade bottom sheet modal ────────────────────────────── */}
            <AnimatePresence>
            {showUpgradeModal && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-end"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowUpgradeModal(false)}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <motion.div
                        className="relative w-full bg-white rounded-t-[32px] p-6 pb-10 shadow-2xl"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-10 h-1 bg-dark/10 rounded-full mx-auto mb-5" />
                        <div className="flex flex-col items-center text-center gap-3 mb-6">
                            <div className="w-14 h-14 rounded-[18px] bg-amber-100 flex items-center justify-center">
                                <Lock size={24} className="text-amber-500" />
                            </div>
                            <h3 className="font-black text-dark text-xl">Daily limit reached</h3>
                            <p className="text-dark/50 text-sm max-w-xs leading-relaxed">
                                Free users get 1 AI explanation per day. Upgrade to Pro for unlimited explanations and Q&A.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/pricing")}
                            className="w-full py-3.5 bg-amber-500 text-white font-black rounded-[16px] text-base shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-colors mb-3"
                        >
                            Upgrade to Pro →
                        </button>
                        <button
                            onClick={() => setShowUpgradeModal(false)}
                            className="w-full py-3 text-dark/40 font-semibold text-sm hover:text-dark/60 transition-colors"
                        >
                            Maybe later
                        </button>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>

            {/* ── Sticky top navbar ─────────────────────────────────────────── */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-green/10 shadow-sm">
                <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
                    <button
                        onClick={() => router.push(`/lesson/${lessonId}`)}
                        className="w-9 h-9 rounded-[12px] bg-green/8 border border-green/12 flex items-center justify-center text-dark/60 hover:bg-green/12 transition-all shrink-0 active:scale-95"
                    >
                        <ArrowLeft size={18} className={isRTL ? "rotate-180" : ""} />
                    </button>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-widest text-dark/30">AI Explanation</p>
                        <h1 className="font-black text-dark text-sm leading-tight line-clamp-1">{documentTitle}</h1>
                    </div>
                    <div className="w-9 h-9 rounded-[12px] bg-green/8 flex items-center justify-center shrink-0">
                        <BotMessageSquare size={16} className="text-green" />
                    </div>
                </div>
            </header>

            {/* ── Phase: select language ────────────────────────────────────── */}
            <AnimatePresence mode="wait">
            {phase === "select" && (
                <motion.div
                    key="select"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="flex-1 flex flex-col px-4 pt-8 pb-32 max-w-2xl mx-auto w-full gap-5"
                >
                    {/* Intro */}
                    <div className="text-center space-y-3 pt-2">
                        <div className="w-14 h-14 rounded-[18px] bg-green/10 flex items-center justify-center mx-auto">
                            <Sparkles size={24} className="text-green" />
                        </div>
                        <h2 className="font-black text-dark text-xl">Choose your language</h2>
                        <p className="text-dark/40 text-sm max-w-xs mx-auto leading-relaxed">
                            Pick the language for the AI explanation before generating.
                        </p>
                    </div>

                    {/* Language options */}
                    <div className="bg-white rounded-[20px] border border-green/10 p-3 shadow-sm space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-dark/30 px-2 pt-1 flex items-center gap-1.5 mb-2">
                            <Globe size={11} /> Language
                        </p>
                        {LANGS.map(l => {
                            const needsPro = l.code !== "fr" && !isPremium;
                            return (
                                <button
                                    key={l.code}
                                    onClick={() => !needsPro && setLang(l.code)}
                                    className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-[14px] font-bold text-sm transition-all border ${
                                        lang === l.code && !needsPro
                                            ? "bg-green/10 border-green/30 text-green"
                                            : needsPro
                                            ? "bg-dark/3 border-dark/5 text-dark/30 cursor-not-allowed"
                                            : "bg-white border-dark/8 text-dark/65 hover:border-green/20 hover:bg-green/4"
                                    }`}
                                >
                                    <span className="text-xl shrink-0">{l.flag}</span>
                                    <span className="flex-1 text-start">{l.label}</span>
                                    {lang === l.code && !needsPro && (
                                        <span className="w-2 h-2 rounded-full bg-green shrink-0" />
                                    )}
                                    {needsPro && (
                                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-wide bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                                            PRO
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Status hint */}
                    {plan === "free" && (
                        <p className="text-center text-[11px] font-semibold -mt-1">
                            {dailyUsedUp ? (
                                <span className="text-amber-500">Daily limit used ·{" "}
                                    <button onClick={() => router.push("/pricing")} className="text-amber-600 font-bold underline">
                                        Upgrade to Pro
                                    </button>
                                </span>
                            ) : (
                                <span className="text-dark/30">Free: 1 explanation per day ·{" "}
                                    <button onClick={() => router.push("/pricing")} className="text-green font-bold">
                                        Upgrade for more
                                    </button>
                                </span>
                            )}
                        </p>
                    )}
                </motion.div>
            )}

            {/* ── Phase: generating ─────────────────────────────────────────── */}
            {phase === "generating" && (
                <motion.div
                    key="generating"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center gap-4 px-4"
                >
                    <div className="w-16 h-16 rounded-[20px] bg-green/10 flex items-center justify-center">
                        <Loader2 size={28} className="text-green animate-spin" />
                    </div>
                    <p className="font-black text-dark text-lg">Generating explanation…</p>
                    <p className="text-dark/35 text-sm">
                        Reading the document in {LANGS.find(l => l.code === lang)?.label}…
                    </p>
                </motion.div>
            )}

            {/* ── Phase: done ───────────────────────────────────────────────── */}
            {phase === "done" && (
                <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 px-4 py-5 max-w-2xl mx-auto w-full space-y-4"
                >
                    {/* Free daily limit hit */}
                    {error === "free_limit" && (
                        <div className="bg-amber-50 border border-amber-200 rounded-[20px] p-6 text-center space-y-4">
                            <Lock size={28} className="text-amber-500 mx-auto" />
                            <div>
                                <p className="font-black text-amber-800 text-lg">Daily limit reached</p>
                                <p className="text-sm text-amber-600/80 mt-1">Free users get 1 AI explanation per day.</p>
                            </div>
                            <button onClick={() => router.push("/pricing")}
                                className="w-full py-3.5 bg-amber-500 text-white font-black rounded-[14px] hover:bg-amber-600 transition-colors">
                                Upgrade to Pro →
                            </button>
                            <button onClick={() => { setError(null); setPhase("select"); }}
                                className="text-sm text-dark/35 font-semibold hover:text-dark/60 transition-colors">
                                ← Back
                            </button>
                        </div>
                    )}

                    {/* Generic error */}
                    {error && error !== "free_limit" && (
                        <div className="bg-red-50 border border-red-100 rounded-[16px] p-5 text-center space-y-3">
                            <p className="text-red-600 font-bold text-sm">{error}</p>
                            <button onClick={() => { setError(null); setPhase("select"); }}
                                className="text-sm text-dark/40 font-semibold hover:text-dark/60 transition-colors">
                                ← Try again
                            </button>
                        </div>
                    )}

                    {/* Explanation card */}
                    {explanation && (
                        <div className="bg-white rounded-[20px] border border-green/10 overflow-hidden shadow-sm">
                            {/* Card header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-green/8 bg-green/3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <Sparkles size={12} className="text-green shrink-0" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-dark/40">Explanation</span>
                                    <span className="text-[10px] font-bold text-dark/25">· {LANGS.find(l => l.code === lang)?.label}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {/* Language switcher */}
                                    <div className="flex items-center gap-0.5 bg-white rounded-lg p-0.5 border border-green/10">
                                        {LANGS.map(l => {
                                            const needsPro = l.code !== "fr" && !isPremium;
                                            return (
                                                <button
                                                    key={l.code}
                                                    onClick={() => !needsPro && handleLangChange(l.code)}
                                                    className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all ${
                                                        lang === l.code    ? "bg-green text-white" :
                                                        needsPro           ? "text-dark/20 cursor-not-allowed" :
                                                        "text-dark/40 hover:text-green"
                                                    }`}
                                                    title={needsPro ? "Upgrade to Pro" : l.label}
                                                >
                                                    {l.code.toUpperCase()}
                                                    {needsPro && <span className="ms-0.5 text-[7px] text-amber-400">✦</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={handleRegenerate}
                                        disabled={regenLoading}
                                        className="flex items-center gap-1 text-[11px] font-black text-dark/35 hover:text-green transition-colors disabled:opacity-40"
                                        title="Regenerate"
                                    >
                                        <RefreshCw size={11} className={regenLoading ? "animate-spin" : ""} />
                                    </button>
                                </div>
                            </div>

                            {/* Explanation body */}
                            <div className="p-4" dir={isRTL ? "rtl" : "ltr"}>
                                <div className="prose prose-sm max-w-none">
                                    {renderMarkdown(explanation, isRTL)}
                                </div>

                                {/* Rating */}
                                <div className="mt-5 pt-4 border-t border-green/8 flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-0.5">
                                        {[1,2,3,4,5].map(s => (
                                            <button key={s} onClick={() => handleRate(s)} disabled={ratingLoading}
                                                className="p-0.5 transition-transform hover:scale-110 active:scale-95">
                                                <Star size={18} className={s <= userRating ? "text-amber-400 fill-amber-400" : "text-dark/15"} />
                                            </button>
                                        ))}
                                    </div>
                                    {ratingCount > 0 && (
                                        <span className="text-[11px] text-dark/35 font-bold">
                                            {avgRating.toFixed(1)} · {ratingCount} {ratingCount === 1 ? "rating" : "ratings"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Q&A card */}
                    {explanation && (
                        <div className="bg-white rounded-[20px] border border-green/10 overflow-hidden shadow-sm">
                            <div className="px-4 py-3 border-b border-green/8 bg-green/3">
                                <p className="text-[10px] font-black uppercase tracking-widest text-dark/40">Ask a Question</p>
                            </div>

                            {/* Messages */}
                            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto" dir={isRTL ? "rtl" : "ltr"}>
                                {qaMessages.length === 0 && (
                                    <p className="text-center text-dark/25 text-sm font-medium py-4">
                                        {plan === "free"
                                            ? "Upgrade to Pro to ask questions about this document."
                                            : "Ask anything about this document…"}
                                    </p>
                                )}
                                {qaMessages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                        <div
                                            className={`max-w-[85%] px-4 py-3 rounded-[16px] text-sm font-medium leading-relaxed ${
                                                msg.role === "user"
                                                    ? "text-white rounded-br-[4px]"
                                                    : "bg-green/5 border border-green/10 text-dark/80 rounded-bl-[4px]"
                                            }`}
                                            style={msg.role === "user" ? { background: "linear-gradient(135deg,#3aaa6a,#2a8a55)" } : undefined}
                                        >
                                            {msg.role === "ai" ? renderMarkdown(msg.text, isRTL) : msg.text}
                                        </div>
                                    </div>
                                ))}
                                {qaLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-green/5 border border-green/10 px-4 py-3 rounded-[16px] rounded-bl-[4px] flex items-center gap-1.5">
                                            {[0,120,240].map(d => (
                                                <span key={d} className="w-1.5 h-1.5 rounded-full bg-green/60 animate-bounce"
                                                    style={{ animationDelay: `${d}ms` }} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div ref={qaBottomRef} />
                            </div>

                            {/* Q&A limit error */}
                            {qaLimitError && (
                                <div className="mx-4 mb-3 p-3 bg-amber-50 border border-amber-200 rounded-[12px] flex items-center justify-between gap-3">
                                    <p className="text-xs font-bold text-amber-700">
                                        {qaLimitError === "free_qa"
                                            ? "Upgrade to Pro to ask questions."
                                            : qaLimitError}
                                    </p>
                                    {qaLimitError === "free_qa" && (
                                        <button onClick={() => router.push("/pricing")}
                                            className="text-[10px] font-black text-amber-600 shrink-0 hover:text-amber-800 transition-colors">
                                            Upgrade →
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Input (pro/premium only) */}
                            {plan !== "free" ? (
                                <div className="px-4 pb-4">
                                    <div className="flex items-end gap-2 bg-green/4 border border-green/12 rounded-[16px] p-2 focus-within:border-green/30 transition-colors">
                                        <textarea
                                            value={qaInput}
                                            onChange={e => setQaInput(e.target.value)}
                                            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAsk(); } }}
                                            placeholder="Ask about this document…"
                                            rows={1}
                                            dir={isRTL ? "rtl" : "ltr"}
                                            className="flex-1 bg-transparent text-sm text-dark font-medium placeholder:text-dark/30 outline-none resize-none leading-relaxed px-2 py-1 min-h-[32px] max-h-[120px]"
                                        />
                                        <button
                                            onClick={handleAsk}
                                            disabled={!qaInput.trim() || qaLoading}
                                            className="w-9 h-9 rounded-[12px] bg-green flex items-center justify-center text-white shrink-0 hover:bg-green/90 disabled:opacity-30 transition-all active:scale-95"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="px-4 pb-4">
                                    <button
                                        onClick={() => router.push("/pricing")}
                                        className="w-full py-3 border border-amber-200 bg-amber-50 text-amber-700 font-black rounded-[14px] text-sm flex items-center justify-center gap-2 hover:bg-amber-100 transition-colors"
                                    >
                                        <Lock size={14} />
                                        Upgrade to Pro for Q&A
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            )}
            </AnimatePresence>

            {/* ── Sticky generate button — only in select phase ─────────── */}
            <AnimatePresence>
            {phase === "select" && (
                <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 80, opacity: 0 }}
                    transition={{ type: "spring", damping: 22, stiffness: 280 }}
                    className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-3 bg-gradient-to-t from-[#F8F9FA] to-transparent"
                >
                    <button
                        onClick={handleGenerate}
                        className={`w-full max-w-2xl mx-auto py-4 font-black rounded-[16px] flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all text-base ${
                            dailyUsedUp
                                ? "bg-amber-500 text-white shadow-amber-500/30 hover:bg-amber-600"
                                : "bg-green text-white shadow-green/25 hover:bg-green/90"
                        }`}
                        style={{ display: "flex" }}
                    >
                        {dailyUsedUp ? <Lock size={17} /> : <Sparkles size={17} />}
                        {dailyUsedUp ? "Daily limit reached — Upgrade" : "Generate Explanation"}
                        <ChevronRight size={15} className="ms-auto" />
                    </button>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
}
