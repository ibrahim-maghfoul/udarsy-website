"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const { forceRefreshUser } = useAuth();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [error, setError] = useState("");
    const [resending, setResending] = useState(false);
    const [resendEmail, setResendEmail] = useState("");
    const [resendSent, setResendSent] = useState(false);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setError("No verification token found in the link.");
            return;
        }

        api.post("/auth/verify-email", { token })
            .then(async () => {
                setStatus("success");
                // Refresh AuthContext so isVerified flips to true immediately —
                // otherwise VerifyRequired-gated pages (services, explore, lesson,
                // favorites) stay locked until the user manually reloads.
                try { await forceRefreshUser(); } catch { /* non-fatal */ }
            })
            .catch((err) => {
                setStatus("error");
                setError(err.response?.data?.error || "Invalid or expired verification link.");
            });
    }, [token, forceRefreshUser]);

    const handleResend = async (e: React.FormEvent) => {
        e.preventDefault();
        setResending(true);
        try {
            await api.post("/auth/resend-verification", { email: resendEmail });
            setResendSent(true);
        } catch {
            setResendSent(true); // still show success to avoid email enumeration
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-white to-green/10 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-8 md:p-10 rounded-[40px] border border-green/10 shadow-2xl shadow-green/5 text-center space-y-6"
            >
                {status === "loading" && (
                    <>
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center">
                                <Loader2 className="text-green animate-spin" size={32} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black text-dark">Verifying your email...</h1>
                            <p className="text-muted-foreground text-sm">Please wait a moment.</p>
                        </div>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center">
                                <CheckCircle className="text-green" size={36} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black text-dark">Email Verified!</h1>
                            <p className="text-muted-foreground text-sm">
                                Your email has been confirmed. You can now access all features.
                            </p>
                            <p className="text-muted-foreground text-sm" dir="rtl">
                                تم تأكيد بريدك الإلكتروني بنجاح.
                            </p>
                        </div>
                        <Link
                            href="/courses"
                            className="inline-block w-full py-4 bg-green text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-green/20 transition-all active:scale-95"
                        >
                            Continue to Udarsy
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                                <XCircle className="text-red-500" size={36} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black text-dark">Verification Failed</h1>
                            <p className="text-muted-foreground text-sm">{error}</p>
                        </div>

                        {!resendSent ? (
                            <form onSubmit={handleResend} className="space-y-3 text-left">
                                <p className="text-sm font-semibold text-dark text-center">
                                    Request a new verification link:
                                </p>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-green" size={18} />
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        value={resendEmail}
                                        onChange={(e) => setResendEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-green/5 border border-transparent focus:border-green focus:bg-white outline-none transition-all text-sm font-medium"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={resending}
                                    className="w-full py-3 bg-green text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-green/20 transition-all active:scale-95 disabled:opacity-70 text-sm flex items-center justify-center gap-2"
                                >
                                    {resending && <Loader2 size={16} className="animate-spin" />}
                                    Send New Link
                                </button>
                            </form>
                        ) : (
                            <div className="p-4 bg-green/5 border border-green/20 rounded-2xl text-sm text-green font-medium">
                                If your email is registered and unverified, a new link has been sent.
                            </div>
                        )}

                        <Link href="/login" className="block text-sm text-muted-foreground hover:text-green transition-colors font-medium">
                            Back to login
                        </Link>
                    </>
                )}
            </motion.div>
        </div>
    );
}
