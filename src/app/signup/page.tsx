"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, UserPlus, Chrome, Gift, Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useGoogleLogin } from '@react-oauth/google';
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useTranslations } from "next-intl";

export default function SignupPage() {
    const { register, googleLogin } = useAuth();
    const { showSnackbar } = useSnackbar();
    const t = useTranslations('Auth');
    const t_pricing = useTranslations('Pricing');
    const searchParams = useSearchParams();
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const ref = searchParams.get('ref');
        if (ref) setReferralCode(ref.toUpperCase());
    }, [searchParams]);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(email, password, name, nickname, referralCode || undefined);
        } catch (err: any) {
            showSnackbar(err.message || 'Sign up failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                await googleLogin(tokenResponse.access_token, referralCode || undefined, rememberMe);
            } catch (err: any) {
                showSnackbar(err.message || 'Google Sign up failed', 'error');
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            showSnackbar('Google Sign up failed', 'error');
        }
    });

    return (
        <div className="min-h-screen flex flex-col items-center justify-start md:justify-center bg-gradient-to-br from-white via-white to-green/10 p-4 pt-20 md:pt-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8 bg-white p-6 md:p-10 rounded-[40px] border border-green/10 shadow-2xl shadow-green/5"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-2xl md:text-4xl font-black text-dark tracking-tight">{t('signup_title')}</h1>
                    <p className="text-muted-foreground">{t('signup_desc')}</p>
                </div>

                {referralCode && (
                    <div className="flex items-center gap-2 p-3 bg-green/5 border border-green/20 rounded-2xl text-green text-sm font-bold">
                        <Gift size={16} />
                        Referred by a friend — you&apos;re joining with a referral!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-green" size={20} />
                            <input
                                type="text"
                                placeholder={t('fullname')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-green/5 border border-transparent focus:border-green focus:bg-white focus:ring-4 focus:ring-green/5 outline-none transition-all font-medium"
                                autoComplete="name"
                                required
                            />
                        </div>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-green" size={20} />
                            <input
                                type="text"
                                placeholder={t('nickname')}
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-green/5 border border-transparent focus:border-green focus:bg-white focus:ring-4 focus:ring-green/5 outline-none transition-all font-medium"
                                autoComplete="username"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-green" size={20} />
                            <input
                                type="email"
                                placeholder={t('email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-green/5 border border-transparent focus:border-green focus:bg-white focus:ring-4 focus:ring-green/5 outline-none transition-all font-medium"
                                autoComplete="email"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-green" size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={t('password')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-green/5 border border-transparent focus:border-green focus:bg-white focus:ring-4 focus:ring-green/5 outline-none transition-all font-medium"
                                autoComplete="new-password"
                                minLength={8}
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

                    <div className="flex items-center gap-3 px-1">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-5 h-5 appearance-none rounded-lg border-2 border-green/20 bg-green/5 checked:bg-green checked:border-green transition-all cursor-pointer peer"
                            />
                            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <label htmlFor="rememberMe" className="text-sm font-medium text-dark/70 cursor-pointer select-none">
                            Remember me for 15 days
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-green text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-green/20 transition-all flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Loading...
                            </>
                        ) : (
                            <>
                                <UserPlus size={20} />
                                {t('signup_btn')}
                            </>
                        )}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-green/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleGoogleLogin()}
                        className="w-full py-4 bg-white border-2 border-green/10 text-dark font-bold rounded-2xl hover:bg-green/5 transition-all flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50"
                    >
                        <Chrome size={20} className="text-green" />
                        Google
                    </button>
                </form>

                <div className="relative text-center space-y-6">
                    <p className="text-muted-foreground text-sm font-medium">
                        {t('have_account')}{" "}
                        <Link href="/login" className="text-green font-bold hover:underline">
                            {t('signin_btn')}
                        </Link>
                    </p>

                    <div className="pt-4 border-t border-green/5">
                        <Link
                            href="/contact"
                            className="group inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-green transition-colors"
                        >
                            <span>{t_pricing('faq_contact')}</span>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
