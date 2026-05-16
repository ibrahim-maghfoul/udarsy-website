"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useSnackbar } from "@/contexts/SnackbarContext";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const passwordValid =
        password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    const passwordsMatch = password === confirm;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordsMatch) {
            showSnackbar("Passwords do not match", "error");
            return;
        }
        if (!passwordValid) {
            showSnackbar("Password must be at least 8 characters with one uppercase letter and one number", "error");
            return;
        }
        if (!token) {
            showSnackbar("Invalid reset link", "error");
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/reset-password", { token, password });
            setDone(true);
            setTimeout(() => router.push("/login"), 2500);
        } catch (err: any) {
            showSnackbar(err.response?.data?.error || "Reset failed. The link may have expired.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-white to-green/10 p-4">
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">Invalid reset link.</p>
                    <Link href="/forgot-password" className="text-green font-bold hover:underline text-sm">
                        Request a new one
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-white to-green/10 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-8 md:p-10 rounded-[40px] border border-green/10 shadow-2xl shadow-green/5 space-y-8"
            >
                {!done ? (
                    <>
                        <div className="space-y-2">
                            <h1 className="text-2xl md:text-3xl font-black text-dark tracking-tight">New password</h1>
                            <p className="text-muted-foreground text-sm" dir="rtl">
                                أدخل كلمة مرور جديدة لحسابك.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-green/5 border border-transparent focus:border-green focus:bg-white focus:ring-4 focus:ring-green/5 outline-none transition-all font-medium"
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-green/50 hover:text-green transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {password.length > 0 && (
                                <div className="flex items-center gap-2 px-1">
                                    {[
                                        { label: "8+ chars", ok: password.length >= 8 },
                                        { label: "A-Z", ok: /[A-Z]/.test(password) },
                                        { label: "0-9", ok: /[0-9]/.test(password) },
                                    ].map(({ label, ok }) => (
                                        <span
                                            key={label}
                                            className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-all"
                                            style={{
                                                background: ok ? "rgba(58,170,106,0.1)" : "rgba(0,0,0,0.05)",
                                                color: ok ? "#16a34a" : "#9ca3af",
                                            }}
                                        >
                                            <span style={{ fontSize: 9 }}>{ok ? "✓" : "○"}</span>
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green" size={20} />
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    className={`w-full pl-12 pr-12 py-4 rounded-2xl bg-green/5 border transition-all font-medium outline-none focus:ring-4 focus:ring-green/5 focus:bg-white ${
                                        confirm.length > 0
                                            ? passwordsMatch
                                                ? "border-green"
                                                : "border-red-400"
                                            : "border-transparent"
                                    }`}
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-green/50 hover:text-green transition-colors"
                                >
                                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !passwordValid || !passwordsMatch}
                                className="w-full py-4 bg-green text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-green/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
                            >
                                {loading ? (
                                    <><Loader2 size={20} className="animate-spin" /> Saving...</>
                                ) : (
                                    "Reset Password"
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center">
                                <CheckCircle className="text-green" size={36} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black text-dark">Password reset!</h1>
                            <p className="text-muted-foreground text-sm">
                                Redirecting you to login...
                            </p>
                            <p className="text-muted-foreground text-sm" dir="rtl">
                                تم تغيير كلمة المرور بنجاح.
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="text-green animate-spin" size={32} />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
