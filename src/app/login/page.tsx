"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Mail, Lock, LogIn, Chrome, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useGoogleLogin } from '@react-oauth/google';
import { trackEvent } from "@/lib/analytics";
import { useTranslations } from "next-intl";
import { fetchAndStoreGoogleProfile } from "@/lib/googleProfile";

export default function LoginPage() {
    const { login, googleLogin } = useAuth();
    const { showSnackbar } = useSnackbar();
    const t = useTranslations('Auth');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password, rememberMe);
            trackEvent({ event: 'login', category: 'Auth', label: 'email' });
        } catch (err: any) {
            showSnackbar(err.message || t('login_failed'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        scope: 'profile email https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.addresses.read',
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                await fetchAndStoreGoogleProfile(tokenResponse.access_token);
                await googleLogin(tokenResponse.access_token, undefined, rememberMe);
                trackEvent({ event: 'login', category: 'Auth', label: 'google' });
            } catch (err: any) {
                showSnackbar(err.message || t('google_login_failed'), 'error');
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            showSnackbar(t('google_login_failed'), 'error');
        }
    });

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
                        <h1 className="text-2xl md:text-3xl font-black text-green tracking-tight">{t('signin_title')}</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-3">
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
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(v => !v)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-green/50 hover:text-green transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 px-1">
                            <div className="flex items-center gap-2">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 appearance-none rounded-md border-2 border-green/20 bg-green/5 checked:bg-green checked:border-green transition-all cursor-pointer peer"
                                    />
                                    <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <label htmlFor="rememberMe" className="text-xs font-medium text-dark/70 cursor-pointer select-none">
                                    Remember me for 15 days
                                </label>
                            </div>
                            <Link
                                href="/forgot-password"
                                className="text-xs font-medium text-green hover:underline shrink-0"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
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
                                    <LogIn size={18} />
                                    {t('signin_btn')}
                                </>
                            )}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-green/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-white text-muted-foreground">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled={loading}
                            onClick={() => handleGoogleLogin()}
                            className="w-full py-3 bg-white border-2 border-green/10 text-dark font-bold rounded-[10px] hover:bg-green/5 transition-all flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50 text-sm"
                        >
                            <Chrome size={18} className="text-green" />
                            Google
                        </button>
                    </form>

                    <div className="relative text-center pt-1">
                        <p className="text-muted-foreground text-xs font-medium">
                            {t('no_account')}{" "}
                            <Link href="/signup" className="text-green font-bold hover:underline">
                                {t('signup_btn')}
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
