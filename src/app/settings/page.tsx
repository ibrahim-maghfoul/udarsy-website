"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Settings,
    User,
    Bell,
    Monitor,
    Shield,
    CreditCard,
    Plus,
    ChevronRight,
    ChevronLeft,
    Save,
    Loader2,
    GraduationCap,
    MapPin,
    Phone,
    Calendar,
    Users,
    Check,
    Sparkles,
    Zap,
    Star,
    Crown,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSnackbar } from "@/contexts/SnackbarContext";
import GradesCalculator from "@/components/GradesCalculator";

export default function SettingsPage() {
    const t = useTranslations("Settings");
    const tp = useTranslations("Profile");
    const tpr = useTranslations("Pricing");
    const { user, logout, checkAuth } = useAuth();
    const { showSnackbar } = useSnackbar();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("profile");
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [isSubscribing, setIsSubscribing] = useState<string | null>(null);

    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [citySearch, setCitySearch] = useState("");

    const [formData, setFormData] = useState({
        displayName: user?.displayName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        age: user?.age || "",
        gender: user?.gender || "",
        nickname: user?.nickname || "",
        city: user?.city || "",
        schoolName: user?.schoolName || "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                displayName: user.displayName || "",
                email: user.email || "",
                phone: user.phone || "",
                age: user.age || "",
                gender: user.gender || "",
                nickname: user.nickname || "",
                city: user.city || "",
                schoolName: user.schoolName || "",
            });
            setCitySearch(user.city || "");
        }
    }, [user]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".city-dropdown-container") && !target.closest(".gender-dropdown-container")) {
                setShowCityDropdown(false);
                setShowGenderDropdown(false);
            }

        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const moroccanCities = [
        "Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir", "Meknes", "Oujda", "Kenitra", "Tetouan",
        "Safi", "Mohammedia", "Khouribga", "Beni Mellal", "El Jadida", "Taza", "Nador", "Settat", "Larache",
        "Ksar El Kebir", "Khemisset", "Guelmim", "Berrechid", "Oued Zem", "Fquih Ben Salah", "Taourirt",
        "Berkane", "Sidi Slimane", "Sidi Qacem", "Khenifra", "Taroudant", "Essaouira", "Tiznit", "Ouarzazate",
        "Errachidia", "Tan-Tan", "Sidi Ifni", "Dakhla", "Laayouine"
    ];

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await checkAuth();
            await api.patch('/user/profile', formData);
            await checkAuth();
            showSnackbar(t("save_success"), "success");
        } catch (error: any) {
            showSnackbar(error.response?.data?.error || t("save_error"), "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        setIsChangingPassword(true);
        try {
            await api.post('/user/change-password', passwordData);
            showSnackbar(t("password_changed_success"), "success");
            setPasswordData({ currentPassword: "", newPassword: "" });
        } catch (error: any) {
            showSnackbar(error.response?.data?.error || t("password_changed_error"), "error");
        } finally {
            setIsChangingPassword(false);
        }
    };


    const handleSubscribe = async (plan: string) => {
        setIsSubscribing(plan);
        try {
            await api.patch('/user/subscribe', { plan, billingCycle });
            await checkAuth();
            showSnackbar(t("subscribe_success", { plan }), "success");
        } catch (error: any) {
            showSnackbar(error.response?.data?.error || t("subscribe_error"), "error");
        } finally {
            setIsSubscribing(null);
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen pt-8 pb-12 px-[clamp(16px,5vw,48px)] bg-gradient-to-b from-white to-green/5"
        >
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="space-y-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-dark/60 hover:text-dark text-xs font-black uppercase tracking-widest w-fit px-4 py-2 rounded-full border border-dark/15 hover:border-dark/30 hover:bg-dark/5 group transition-all"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        {t("back")}
                    </button>
                    <h1 className="text-4xl font-bold tracking-tight text-dark flex items-center gap-4">
                        <Settings size={36} className="text-green" />
                        {t("title")}
                    </h1>
                </div>

                {/* Horizontal Tab Bar */}
                <div className="inline-flex items-center bg-white rounded-[18px] p-1 shadow-md shadow-black/[0.04] border border-green/10 overflow-x-auto scrollbar-none gap-0.5 self-start max-w-full">
                    {[
                        { id: "profile", label: t("personal_info"), icon: User },
                        { id: "security", label: t("security"), icon: Shield },
                        { id: "billing", label: t("billing"), icon: CreditCard },
                    ].map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-[12px] font-bold text-[12px] whitespace-nowrap transition-colors flex-shrink-0 ${isActive ? "text-white" : "text-dark/50 hover:text-green"}`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="settings-tab-bg"
                                        className="absolute inset-0 rounded-[16px] shadow-lg shadow-green/20"
                                        style={{ background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.07) 0,rgba(255,255,255,0.07) 1px,transparent 0,transparent 50%),linear-gradient(135deg,#3aaa6a 0%,#1e7a46 100%)', backgroundSize: '8px 8px, 100% 100%' }}
                                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                                    />
                                )}
                                <item.icon size={16} className="relative z-10" />
                                <span className="relative z-10">{item.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Settings Content */}
                <div className="space-y-12 pb-20">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                {activeTab === "profile" && (
                                    /* Personal Info Section */
                                    <section id="profile" className="space-y-6">
                                        <div className="flex items-center justify-between border-b border-green/5 pb-4">
                                            <h2 className="text-2xl font-bold text-dark">{t("personal_info")}</h2>
                                        </div>
                                        {!user && (
                                            <div className="flex flex-col items-center justify-center gap-4 py-16 rounded-[32px] border-2 border-dashed border-green/20 bg-green/3">
                                                <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center"><Shield size={32} className="text-green" /></div>
                                                <h3 className="text-xl font-bold text-dark">يجب تسجيل الدخول</h3>
                                                <p className="text-sm text-dark/50 text-center max-w-xs">سجل دخولك للوصول إلى معلوماتك الشخصية وتعديلها.</p>
                                                <Link href="/login" className="px-8 py-3 bg-green text-white font-bold rounded-2xl hover:bg-green/90 transition-all shadow-lg shadow-green/20">تسجيل الدخول</Link>
                                            </div>
                                        )}
                                        {user && (<>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-dark/40 flex items-center gap-2">
                                                    <User size={16} /> {t("profile")}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.displayName}
                                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                                    className="w-full px-5 py-3 rounded-2xl bg-green/5 border border-transparent focus:bg-white focus:border-green outline-none font-medium transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-dark/40 flex items-center gap-2">
                                                    <Users size={16} /> Nickname
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.nickname}
                                                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                                    className="w-full px-5 py-3 rounded-2xl bg-green/5 border border-transparent focus:bg-white focus:border-green outline-none font-medium transition-all"
                                                    placeholder="Your nickname"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-dark/40 flex items-center gap-2">
                                                    <Bell size={16} /> {t("email")}
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    disabled
                                                    className="w-full px-5 py-3 rounded-2xl bg-green/5 border border-transparent outline-none font-medium transition-all opacity-50 cursor-not-allowed"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-dark/40 flex items-center gap-2">
                                                    <Phone size={16} /> {t("phone")}
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-5 py-3 rounded-2xl bg-green/5 border border-transparent focus:bg-white focus:border-green outline-none font-medium transition-all"
                                                    placeholder="+212600000000"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-dark/40 flex items-center gap-2">
                                                    <Calendar size={16} /> {t("age")}
                                                </label>
                                                <input
                                                    type="number"
                                                    max="80"
                                                    value={formData.age}
                                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                    className="w-full px-5 py-3 rounded-2xl bg-green/5 border border-transparent focus:bg-white focus:border-green outline-none font-medium transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2 relative gender-dropdown-container">
                                                <label className="text-sm font-bold text-dark/40 flex items-center gap-2">
                                                    <User size={16} /> {t("gender")}
                                                </label>
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowGenderDropdown(!showGenderDropdown);
                                                            setShowCityDropdown(false)
                                                        }}
                                                        className="w-full px-5 py-3 rounded-2xl bg-green/5 border border-transparent focus:bg-white focus:border-green outline-none font-medium transition-all text-left flex items-center justify-between"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            {formData.gender ? (
                                                                <>
                                                                    <span className="text-green font-bold">{formData.gender === 'male' ? '♂' : '♀'}</span>
                                                                    {t(formData.gender)}
                                                                </>
                                                            ) : (
                                                                <span className="text-dark/20">-</span>
                                                            )}
                                                        </span>
                                                        <ChevronRight size={18} className={`text-dark/20 transition-transform duration-300 ${showGenderDropdown ? 'rotate-90 text-green' : 'rotate-0'}`} />
                                                    </button>

                                                    <AnimatePresence>
                                                        {showGenderDropdown && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                className="absolute z-50 left-0 right-0 top-full mt-2 bg-white border border-green/10 rounded-[24px] shadow-2xl shadow-green/10 overflow-hidden p-2"
                                                            >
                                                                {['male', 'female'].map((g) => (
                                                                    <button
                                                                        key={g}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setFormData({ ...formData, gender: g });
                                                                            setShowGenderDropdown(false);
                                                                        }}
                                                                        className="w-full px-6 py-3.5 text-left text-sm font-bold text-dark/70 hover:text-green hover:bg-green/5 rounded-2xl transition-all flex items-center justify-between group"
                                                                    >
                                                                        <span className="flex items-center gap-3">
                                                                            <span className="text-lg text-green font-black">{g === 'male' ? '♂' : '♀'}</span>
                                                                            {t(g)}
                                                                        </span>
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-green scale-0 group-hover:scale-100 transition-transform" />
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-dark/40 flex items-center gap-2">
                                                    <GraduationCap size={16} /> {t("school_name")}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.schoolName}
                                                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                                                    className="w-full px-5 py-3 rounded-2xl bg-green/5 border border-transparent focus:bg-white focus:border-green outline-none font-medium transition-all"
                                                    placeholder="Your school name"
                                                />
                                            </div>
                                            <div className="space-y-2 relative city-dropdown-container">
                                                <label className="text-sm font-bold text-dark/40 flex items-center gap-2">
                                                    <MapPin size={16} /> {t("city")}
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={citySearch}
                                                        onChange={(e) => {
                                                            setCitySearch(e.target.value);
                                                            setFormData({ ...formData, city: e.target.value });
                                                            setShowCityDropdown(true);
                                                            setShowGenderDropdown(false);
                                                        }}
                                                        onFocus={() => {
                                                            setShowCityDropdown(true);
                                                            setShowGenderDropdown(false);
                                                        }}
                                                        className="w-full px-5 py-3 rounded-2xl bg-green/5 border border-transparent focus:bg-white focus:border-green outline-none font-medium transition-all"
                                                        placeholder={t("select_city") || "Select your city"}
                                                    />
                                                    <ChevronRight size={18} className={`absolute right-5 top-1/2 -translate-y-1/2 text-dark/20 transition-transform duration-300 ${showCityDropdown ? 'rotate-90 text-green' : 'rotate-0'}`} />
                                                </div>

                                                <AnimatePresence>
                                                    {showCityDropdown && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="absolute z-50 left-0 right-0 top-full mt-2 bg-white border border-green/10 rounded-[32px] shadow-2xl shadow-green/10 overflow-hidden max-h-64 overflow-y-auto p-2"
                                                        >
                                                            {moroccanCities
                                                                .filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
                                                                .map(city => (
                                                                    <button
                                                                        key={city}
                                                                        onClick={() => {
                                                                            setFormData({ ...formData, city });
                                                                            setCitySearch(city);
                                                                            setShowCityDropdown(false);
                                                                        }}
                                                                        className="w-full px-6 py-3.5 text-left text-sm font-bold text-dark/70 hover:text-green hover:bg-green/5 rounded-2xl transition-all flex items-center justify-between group"
                                                                    >
                                                                        {city}
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-green scale-0 group-hover:scale-100 transition-transform" />
                                                                    </button>
                                                                ))}
                                                            {moroccanCities.filter(c => c.toLowerCase().includes(citySearch.toLowerCase())).length === 0 && (
                                                                <div className="px-6 py-8 text-center text-muted-foreground italic text-sm">
                                                                    No cities found for "{citySearch}"
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        <div className="pt-6 flex justify-end">
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={isSaving}
                                                className="flex items-center gap-2 px-12 py-4 bg-green text-white font-bold rounded-2xl hover:bg-green/90 transition-all disabled:opacity-50 shadow-lg shadow-green/20"
                                            >
                                                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                                {isSaving ? t("saving") : t("save_changes")}
                                            </button>
                                        </div>
                                    </>)}
                                    </section>
                                )}


                                {activeTab === "security" && (
                                    /* Security Section (Change Password) */
                                    <section id="security" className="space-y-6">
                                        <h2 className="text-2xl font-bold text-dark border-b border-green/5 pb-4">{t("security")}</h2>
                                        {!user ? (
                                            <div className="flex flex-col items-center justify-center gap-4 py-16 rounded-[32px] border-2 border-dashed border-green/20 bg-green/3">
                                                <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center"><Shield size={32} className="text-green" /></div>
                                                <h3 className="text-xl font-bold text-dark">يجب تسجيل الدخول</h3>
                                                <p className="text-sm text-dark/50 text-center max-w-xs">سجل دخولك لإدارة إعدادات الأمان وتغيير كلمة المرور.</p>
                                                <Link href="/login" className="px-8 py-3 bg-green text-white font-bold rounded-2xl hover:bg-green/90 transition-all shadow-lg shadow-green/20">تسجيل الدخول</Link>
                                            </div>
                                        ) : (
                                        <div className="p-8 rounded-[32px] border border-green/10 bg-white space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-dark/40">{t("current_password")}</label>
                                                    <input
                                                        type="password"
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                        className="w-full px-5 py-3 rounded-2xl bg-green/5 border border-transparent focus:bg-white focus:border-green outline-none font-medium transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-dark/40">{t("new_password")}</label>
                                                    <input
                                                        type="password"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                        className="w-full px-5 py-3 rounded-2xl bg-green/5 border border-transparent focus:bg-white focus:border-green outline-none font-medium transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleChangePassword}
                                                disabled={isChangingPassword}
                                                className="px-8 py-3 bg-dark text-white font-bold rounded-xl hover:bg-dark/90 transition-all disabled:opacity-50"
                                            >
                                                {isChangingPassword ? <Loader2 size={18} className="animate-spin" /> : t("change_password")}
                                            </button>
                                        </div>
                                        )}
                                    </section>
                                )}

                                {activeTab === "billing" && (
                                    /* Billing Section */
                                    <section id="billing" className="space-y-12">
                                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-green/5 pb-6">
                                            <div className="space-y-2">
                                                <h2 className="text-2xl font-bold text-dark">{t("billing")}</h2>
                                                <p className="text-muted-foreground">Manage your subscription and billing details.</p>
                                            </div>
                                            {/* Monthly/Yearly Toggle */}
                                            <div className="flex items-center gap-2 bg-green/5 p-1.5 rounded-2xl border border-green/10">
                                                <button
                                                    onClick={() => setBillingCycle("monthly")}
                                                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${billingCycle === "monthly" ? "bg-white text-green shadow-sm" : "text-dark/40 hover:text-green"}`}
                                                >
                                                    {tpr("monthly")}
                                                </button>
                                                <button
                                                    onClick={() => setBillingCycle("yearly")}
                                                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${billingCycle === "yearly" ? "bg-white text-green shadow-sm" : "text-dark/40 hover:text-green"}`}
                                                >
                                                    {tpr("yearly")} <span className="text-[10px] bg-green/10 px-1.5 py-0.5 rounded-full ml-1">{tpr("save_amount", { amount: "478" })}</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 pt-6 items-start">
                                            {([
                                                {
                                                    id: "free",
                                                    name: tpr("free_name"),
                                                    tagline: tpr("free_desc"),
                                                    price: "0",
                                                    numPrice: 0,
                                                    period: tpr("forever"),
                                                    icon: Sparkles,
                                                    isPremium: false,
                                                    borderColor: "border-green/20",
                                                    accentColor: "#3aaa6a",
                                                    badge: null,
                                                    badgeClass: "",
                                                    aiLabel: tpr("ai_free"),
                                                    features: [
                                                        tpr("free_f1"),
                                                        tpr("free_f2"),
                                                        tpr("free_f3"),
                                                        tpr("free_f4"),
                                                        tpr("free_f5"),
                                                        tpr("free_f6"),
                                                        tpr("free_f7"),
                                                        tpr("free_f8"),
                                                    ]
                                                },
                                                {
                                                    id: "pro",
                                                    name: tpr("pro_name"),
                                                    tagline: tpr("pro_desc"),
                                                    price: billingCycle === 'monthly' ? "199" : "1910",
                                                    numPrice: billingCycle === 'monthly' ? 199 : 1910,
                                                    period: billingCycle === 'monthly' ? `/ ${tpr("month")}` : `/ ${tpr("year")}`,
                                                    icon: Zap,
                                                    isPremium: false,
                                                    borderColor: "border-green/60",
                                                    accentColor: "#3aaa6a",
                                                    badge: tpr("most_popular"),
                                                    badgeClass: "bg-green text-white shadow-green/20",
                                                    aiLabel: tpr("ai_pro"),
                                                    features: [
                                                        tpr("pro_f1"),
                                                        tpr("pro_f2"),
                                                        tpr("pro_f3"),
                                                        tpr("pro_f4"),
                                                        tpr("pro_f5"),
                                                        tpr("pro_f6"),
                                                    ]
                                                },
                                                {
                                                    id: "premium",
                                                    name: tpr("premium_name"),
                                                    tagline: tpr("premium_desc"),
                                                    price: billingCycle === 'monthly' ? "299" : "2870",
                                                    numPrice: billingCycle === 'monthly' ? 299 : 2870,
                                                    period: billingCycle === 'monthly' ? `/ ${tpr("month")}` : `/ ${tpr("year")}`,
                                                    icon: Crown,
                                                    isPremium: true,
                                                    borderColor: "border-[#D4AF37]/30",
                                                    accentColor: "#D4AF37",
                                                    badge: tpr("best_value"),
                                                    badgeClass: "bg-gradient-to-r from-[#D4AF37] to-[#F9D423] text-white shadow-[#D4AF37]/30",
                                                    aiLabel: tpr("ai_premium"),
                                                    features: [
                                                        tpr("prem_f1"),
                                                        tpr("prem_f2"),
                                                        tpr("prem_f3"),
                                                        tpr("prem_f4"),
                                                        tpr("prem_f5"),
                                                        tpr("prem_f6"),
                                                    ]
                                                }
                                            ] as const).map((plan) => {
                                                const isCurrentPlan = user?.subscription?.plan === plan.id;
                                                const PlanIcon = plan.icon;
                                                return (
                                                    <div key={plan.id} className="relative pt-5">
                                                        <div className={`relative rounded-3xl px-7 pb-7 pt-10 flex flex-col ${
                                                            plan.isPremium
                                                                ? 'bg-dark text-white shadow-[0_10px_48px_rgba(0,0,0,0.4)]'
                                                                : plan.id === 'pro'
                                                                ? 'bg-white border-2 border-green shadow-[0_10px_48px_rgba(58,170,106,0.22)]'
                                                                : 'bg-white border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.07)]'
                                                        }`}>
                                                            {/* Texture */}
                                                            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                                                                {plan.id === 'free' && (
                                                                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.065) 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }} />
                                                                )}
                                                                {plan.id === 'pro' && (
                                                                    <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(58,170,106,0.08) 0, rgba(58,170,106,0.08) 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, rgba(58,170,106,0.08) 0, rgba(58,170,106,0.08) 1px, transparent 0, transparent 50%)', backgroundSize: '16px 16px' }} />
                                                                )}
                                                                {plan.isPremium && (
                                                                    <>
                                                                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1.5px, transparent 1.5px), radial-gradient(circle, rgba(255,255,255,0.1) 1.5px, transparent 1.5px)', backgroundSize: '22px 38px', backgroundPosition: '0 0, 11px 19px' }} />
                                                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-52" style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(58,170,106,0.25) 0%, transparent 68%)' }} />
                                                                    </>
                                                                )}
                                                            </div>

                                                            {/* Top circle icon */}
                                                            <div className={`absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                                                                plan.id === 'pro'
                                                                    ? 'bg-green shadow-[0_4px_16px_rgba(58,170,106,0.55)]'
                                                                    : plan.isPremium
                                                                    ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_4px_16px_rgba(245,158,11,0.5)]'
                                                                    : 'bg-white border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.09)]'
                                                            }`}>
                                                                <PlanIcon size={17} className={plan.id === 'free' ? 'text-gray-400' : 'text-white'} strokeWidth={2} />
                                                            </div>

                                                            {/* Hanging side badge */}
                                                            {plan.badge && (
                                                                <div className="absolute -right-1 top-10 z-10 flex items-center">
                                                                    <div className={`pl-3.5 pr-4 py-1.5 text-white text-[10px] font-bold tracking-wide rounded-l-full ${
                                                                        plan.isPremium
                                                                            ? 'bg-amber-500 shadow-[0_3px_14px_rgba(245,158,11,0.55)]'
                                                                            : 'bg-green shadow-[0_3px_14px_rgba(58,170,106,0.55)]'
                                                                    }`}>
                                                                        {plan.badge}
                                                                    </div>
                                                                    <div className={`w-0 h-0 border-y-[11px] border-y-transparent border-l-[7px] ${
                                                                        plan.isPremium ? 'border-l-amber-500' : 'border-l-green'
                                                                    }`} />
                                                                </div>
                                                            )}

                                                            {/* Current plan indicator */}
                                                            {isCurrentPlan && (
                                                                <div className="absolute top-3 left-3 z-10">
                                                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                                                                        plan.isPremium ? 'bg-white/10 text-white border border-white/20' : 'bg-green/10 text-green border border-green/20'
                                                                    }`}>✓ {t("billing")}</span>
                                                                </div>
                                                            )}

                                                            {/* Plan name */}
                                                            <div className={`text-[11px] font-bold uppercase tracking-widest mb-2 mt-1 ${plan.isPremium ? 'text-white/40' : 'text-gray-400'}`}>
                                                                {plan.name}
                                                            </div>

                                                            {/* Price */}
                                                            <div className="flex items-baseline gap-1 overflow-hidden mb-1">
                                                                <span className={`text-[44px] font-bold leading-none tracking-tight ${plan.isPremium ? 'text-white' : 'text-dark'}`}>
                                                                    {plan.price}
                                                                </span>
                                                                <span className={`text-sm ml-1 ${plan.isPremium ? 'text-white/50' : 'text-gray-400'}`}>
                                                                    DH {plan.period}
                                                                </span>
                                                            </div>

                                                            {/* Tagline */}
                                                            <p className={`text-[13px] mb-6 ${plan.isPremium ? 'text-white/50' : 'text-gray-400'}`}>{plan.tagline}</p>

                                                            {/* Divider */}
                                                            <div className={`h-px mb-5 ${plan.isPremium ? 'bg-white/10' : 'bg-dark/[0.05]'}`} />

                                                            {/* Features */}
                                                            <ul className="space-y-2.5 flex-1 mb-4">
                                                                {plan.features.map((f, j) => (
                                                                    <li key={j} className="flex items-start gap-2.5 text-sm">
                                                                        <Check
                                                                            size={14}
                                                                            className={`mt-0.5 flex-shrink-0 ${plan.isPremium || plan.id === 'pro' ? 'text-green' : 'text-gray-400'}`}
                                                                            strokeWidth={2.5}
                                                                        />
                                                                        <span className={plan.isPremium ? 'text-white/75' : 'text-gray-600'}>{f}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>

                                                            {/* AI chip */}
                                                            <div className={`mb-5 flex items-center gap-2 px-3 py-2 rounded-xl ${plan.isPremium ? 'bg-white/10 border border-white/10' : 'bg-violet-50 border border-violet-100'}`}>
                                                                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 flex-shrink-0">
                                                                    <path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.2L12 16.5l-6.2 4.4 2.4-7.2L2 9.2h7.6z" fill="#8b5cf6"/>
                                                                </svg>
                                                                <span className={`text-xs font-semibold ${plan.isPremium ? 'text-violet-300' : 'text-violet-600'}`}>{plan.aiLabel}</span>
                                                            </div>

                                                            {/* CTA */}
                                                            <button
                                                                disabled={isCurrentPlan}
                                                                className={`w-full py-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                                                                    isCurrentPlan
                                                                        ? plan.isPremium
                                                                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#F9D423] text-white shadow-lg shadow-[#D4AF37]/20 cursor-default'
                                                                            : 'bg-green text-white shadow-lg shadow-green/20 cursor-default'
                                                                        : plan.isPremium
                                                                            ? 'bg-[#D4AF37]/10 text-[#D4AF37]/60 border border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-white hover:shadow-lg hover:shadow-[#D4AF37]/20 hover:border-transparent'
                                                                            : 'bg-green/5 text-green/50 border border-green/15 hover:bg-green hover:text-white hover:shadow-lg hover:shadow-green/20 hover:border-transparent'
                                                                }`}
                                                            >
                                                                {isCurrentPlan
                                                                    ? <><Check size={14} strokeWidth={3} /> {t("billing")}</>
                                                                    : "Coming Soon"
                                                                }
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div
                                            className="p-8 rounded-[28px] text-white text-center space-y-4 shadow-2xl relative overflow-hidden group"
                                            style={{ background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 2px,transparent 2px,transparent 8px),linear-gradient(135deg,#1e7a46 0%,#0f4428 100%)' }}
                                        >
                                            <div className="relative z-10 flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 rounded-[2rem] bg-white/10 flex items-center justify-center backdrop-blur-md">
                                                    <CreditCard size={32} className="text-white" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-2xl font-black">{t("subscription_management")}</h3>
                                                    <p className="max-w-md mx-auto text-white/60 font-medium">
                                                        {t("coming_soon")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </motion.div>
                        </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
