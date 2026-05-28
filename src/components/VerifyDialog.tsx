"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, CheckCircle, Loader2, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { VERIFY_REQUIRED_EVENT } from "@/lib/verifyGate";

/**
 * Global verification dialog. Mounted once at the root layout, listens for
 * the `udarsy:verify-required` window event, and opens a portal modal.
 *
 * Anywhere in the app, code can call `triggerVerifyDialog()` (from verifyGate)
 * to open it — no prop drilling, no per-page modal duplication.
 */
export function VerifyDialog() {
    const ta = useTranslations("Auth");
    const tc = useTranslations("Common");
    const locale = useLocale();
    const isAr = locale === "ar";
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [verifyState, setVerifyState] = useState<"idle" | "sending" | "sent" | "error">("idle");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const onEvent = () => setOpen(true);
        window.addEventListener(VERIFY_REQUIRED_EVENT, onEvent);
        return () => window.removeEventListener(VERIFY_REQUIRED_EVENT, onEvent);
    }, []);

    const close = () => {
        setOpen(false);
        setVerifyState("idle");
    };

    const handleResend = async () => {
        if (verifyState === "sending" || !user?.email) return;
        setVerifyState("sending");
        try {
            await api.post("/auth/resend-verification", { email: user.email });
            setVerifyState("sent");
        } catch {
            setVerifyState("error");
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
                    onClick={close}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 16 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="bg-white rounded-[10px] p-7 w-full max-w-md shadow-2xl shadow-green/10 border border-green/10 text-center space-y-5 relative"
                        onClick={(e) => e.stopPropagation()}
                        dir={isAr ? "rtl" : undefined}
                    >
                        <button
                            onClick={close}
                            aria-label={tc("close")}
                            className={`absolute top-4 ${isAr ? "left-4" : "right-4"} w-8 h-8 rounded-full bg-green/8 flex items-center justify-center text-green hover:bg-green/15 transition-colors`}
                        >
                            <X size={14} />
                        </button>

                        <div className="mx-auto w-16 h-16 rounded-[10px] bg-green/8 border border-green/20 flex items-center justify-center">
                            <Lock size={28} className="text-green" strokeWidth={2.2} />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-xl md:text-2xl font-black text-dark tracking-tight">
                                {ta("verify_required_title")}
                            </h1>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {ta("verify_required_desc")}
                            </p>
                        </div>

                        {user?.email && (
                            <div className="flex items-center gap-2 justify-center text-xs font-bold text-dark/70 bg-green/5 rounded-[10px] px-3 py-2 border border-green/10">
                                <Mail size={14} className="text-green" />
                                <span className="truncate">{user.email}</span>
                            </div>
                        )}

                        {verifyState === "sent" ? (
                            <div className="flex items-center justify-center gap-2 text-sm font-bold text-green">
                                <CheckCircle size={16} />
                                {ta("verify_email_sent")}
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={verifyState === "sending"}
                                className="w-full py-3 bg-green text-white font-bold rounded-[10px] hover:shadow-xl hover:shadow-green/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 text-sm"
                            >
                                {verifyState === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                                {ta("verify_email_resend")}
                            </button>
                        )}

                        {verifyState === "error" && (
                            <p className="text-xs text-red-500 font-medium">{ta("verify_email_resend_failed")}</p>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
