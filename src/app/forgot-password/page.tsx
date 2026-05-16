"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/auth/forgot-password", { email });
        } catch {
            // always show success to avoid email enumeration
        } finally {
            setLoading(false);
            setSent(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-white to-green/10 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-8 md:p-10 rounded-[40px] border border-green/10 shadow-2xl shadow-green/5 space-y-8"
            >
                {!sent ? (
                    <>
                        <div className="space-y-2">
                            <h1 className="text-2xl md:text-3xl font-black text-dark tracking-tight">Forgot password?</h1>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Enter your email and we&apos;ll send you a reset link.
                            </p>
                            <p className="text-muted-foreground text-sm leading-relaxed" dir="rtl">
                                أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-green" size={20} />
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-green/5 border border-transparent focus:border-green focus:bg-white focus:ring-4 focus:ring-green/5 outline-none transition-all font-medium"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-green text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-green/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
                            >
                                {loading ? (
                                    <><Loader2 size={20} className="animate-spin" /> Sending...</>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </form>

                        <Link
                            href="/login"
                            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-green transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to login
                        </Link>
                    </>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center">
                                <CheckCircle className="text-green" size={36} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black text-dark">Check your inbox</h1>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                If <span className="font-semibold text-dark">{email}</span> is registered, you&apos;ll receive a reset link shortly.
                            </p>
                            <p className="text-muted-foreground text-sm leading-relaxed" dir="rtl">
                                إذا كان البريد مسجلاً، ستصلك رسالة قريباً.
                            </p>
                        </div>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-sm font-medium text-green hover:underline"
                        >
                            <ArrowLeft size={16} />
                            Back to login
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
