"use client";

import { useState } from "react";
import { Mail, ShieldAlert, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslations } from "next-intl";
import api from "@/lib/api";

interface VerifyRequiredProps {
    children: React.ReactNode;
}

/**
 * Gates a route behind email verification.
 * - Public visitors (not logged in) see the children — other auth flows handle that.
 * - Logged-in + verified users see the children.
 * - Logged-in + unverified users see a lock screen and cannot reach the content.
 */
export function VerifyRequired({ children }: VerifyRequiredProps) {
    const { user, loading } = useAuth();
    const t = useTranslations("Auth");
    const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

    if (loading) return null;
    if (!user) return <>{children}</>;
    if (user.isVerified) return <>{children}</>;

    const handleResend = async () => {
        if (state === "sending") return;
        setState("sending");
        try {
            await api.post("/auth/resend-verification", { email: user.email });
            setState("sent");
        } catch {
            setState("error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-white to-green/10 px-4 pt-24 md:pt-32 pb-10">
            <div className="w-full max-w-md bg-white rounded-[10px] border border-green/10 shadow-2xl shadow-green/5 p-6 sm:p-8 text-center space-y-5">
                <div className="mx-auto w-16 h-16 rounded-[10px] bg-amber-50 border border-amber-200 flex items-center justify-center">
                    <ShieldAlert size={32} className="text-amber-600" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-xl md:text-2xl font-black text-dark tracking-tight">
                        {t("verify_required_title")}
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {t("verify_required_desc")}
                    </p>
                </div>

                <div className="flex items-center gap-2 justify-center text-xs font-bold text-dark/70 bg-green/5 rounded-[10px] px-3 py-2">
                    <Mail size={14} className="text-green" />
                    <span className="truncate">{user.email}</span>
                </div>

                {state === "sent" ? (
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-green">
                        <CheckCircle size={16} />
                        {t("verify_email_sent")}
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={state === "sending"}
                        className="w-full py-3 bg-green text-white font-bold rounded-[10px] hover:shadow-xl hover:shadow-green/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60 text-sm"
                    >
                        {state === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
                        {t("verify_email_resend")}
                    </button>
                )}

                {state === "error" && (
                    <p className="text-xs text-red-500 font-medium">{t("verify_email_resend_failed")}</p>
                )}

                <Link
                    href="/"
                    className="block text-xs font-bold text-muted-foreground hover:text-green transition-colors"
                >
                    {t("verify_required_home")}
                </Link>
            </div>
        </div>
    );
}
