"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { User, Mail, Lock, UserPlus, Gift, Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { trackEvent } from "@/lib/analytics";
import { useTranslations } from "next-intl";
import TurnstileWidget, { verifyTurnstileToken } from "@/components/TurnstileWidget";
import { TurnstileInstance } from "@marsidev/react-turnstile";

export default function SignupPage() {
    const { register } = useAuth();
    const { showSnackbar } = useSnackbar();
    const t = useTranslations('Auth');
    const searchParams = useSearchParams();
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const turnstileRef = useRef<TurnstileInstance>(null);

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) setReferralCode(ref.toUpperCase());
    }, [searchParams]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!turnstileToken) return;
        setLoading(true);
        try {
            const verified = await verifyTurnstileToken(turnstileToken);
            if (!verified) {
                showSnackbar('Security check failed. Please try again.', 'error');
                turnstileRef.current?.reset();
                setTurnstileToken(null);
                setLoading(false);
                return;
            }
            const displayName = [name, nickname].filter(Boolean).join(" ").trim();
            await register(email, password, displayName, referralCode || undefined);
            trackEvent({ event: 'sign_up', category: 'Auth', label: 'email', referred: !!referralCode });
        } catch (err: any) {
            showSnackbar(err.message || t('signup_failed'), 'error');
            turnstileRef.current?.reset();
            setTurnstileToken(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-white to-green/10 px-4 pt-24 md:pt-32 pb-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-[10px] border border-green/10 shadow-2xl shadow-green/5 overflow-hidden"
            >
                {/* Image side */}
                <div className="relative hidden md:block bg-green/5 border-r border-green/15">
                    <Image
                        src="/Home page card/All subjects.webp"
                        alt="Udarsy — learn everything"
                        fill
                        priority
                        sizes="(max-width: 768px) 0px, 50vw"
                        className="object-cover select-none pointer-events-none"
                    />
                </div>

                {/* Form side */}
                <div className="p-5 sm:p-6 md:p-8 space-y-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-black text-dark tracking-tight">{t('signup_title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('signup_desc')}</p>
                    </div>

                    {referralCode && (
                        <div className="flex items-center gap-2 p-2.5 bg-green/5 border border-green/20 rounded-[10px] text-green text-sm font-bold">
                            <Gift size={16} />
                            Referred by a friend — you&apos;re joining with a referral!
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-green/80 shrink-0">
                                    Personal Information
                                </h2>
                                <div className="flex-1 h-px bg-green/10" />
                            </div>
                            <div className="flex gap-3">
                                <div className="relative flex-1 min-w-0">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green" size={18} />
                                    <input
                                        type="text"
                                        placeholder={t('name')}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-3 py-3 rounded-[10px] bg-green/5 border border-transparent focus:border-green focus:bg-white focus:ring-4 focus:ring-green/5 outline-none transition-all font-medium text-sm"
                                        autoComplete="given-name"
                                        required
                                    />
                                </div>
                                <div className="relative flex-1 min-w-0">
                                    <input
                                        type="text"
                                        placeholder={t('nickname')}
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        className="w-full px-3 py-3 rounded-[10px] bg-green/5 border border-transparent focus:border-green focus:bg-white focus:ring-4 focus:ring-green/5 outline-none transition-all font-medium text-sm"
                                        autoComplete="nickname"
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green" size={18} />
                                <input
                                    type="email"
                                    placeholder={t('email')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 rounded-[10px] bg-green/5 border border-transparent focus:border-green focus:bg-white focus:ring-4 focus:ring-green/5 outline-none transition-all font-medium text-sm"
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder={t('password')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 rounded-[10px] bg-green/5 border border-transparent focus:border-green focus:bg-white focus:ring-4 focus:ring-green/5 outline-none transition-all font-medium text-sm"
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green/50 hover:text-green transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {password.length > 0 && (
                                <div className="flex items-center gap-2 px-1 pt-1">
                                    {[
                                        { label: '8+ chars', ok: password.length >= 8 },
                                        { label: 'A-Z', ok: /[A-Z]/.test(password) },
                                        { label: '0-9', ok: /[0-9]/.test(password) },
                                    ].map(({ label, ok }) => (
                                        <span
                                            key={label}
                                            className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-all"
                                            style={{
                                                background: ok ? 'rgba(58,170,106,0.1)' : 'rgba(0,0,0,0.05)',
                                                color: ok ? '#16a34a' : '#9ca3af',
                                            }}
                                        >
                                            <span style={{ fontSize: 9 }}>{ok ? '✓' : '○'}</span>
                                            {label}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <TurnstileWidget
                            ref={turnstileRef}
                            onSuccess={setTurnstileToken}
                            onExpire={() => setTurnstileToken(null)}
                            onError={() => setTurnstileToken(null)}
                        />

                        <button
                            type="submit"
                            disabled={loading || !turnstileToken}
                            className="w-full py-3 bg-green text-white font-bold rounded-[10px] hover:shadow-xl hover:shadow-green/20 transition-all flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-70 text-sm"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    {t('signup_btn')}
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </motion.div>
        </div>
    );
}
