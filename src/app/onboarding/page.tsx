"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ChevronRight, ChevronLeft, GraduationCap, School, BookOpen,
    User, ChevronDown, MapPin, Phone, Check, Camera, Upload,
} from "lucide-react";
import Image from "next/image";
import DatePicker from "@/components/ui/DatePicker";
import { getSchools, getLevels, getGuidances } from "@/services/data";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useSnackbar } from "@/contexts/SnackbarContext";
import { useTranslations } from "next-intl";
import ImageCropper from "@/components/ImageCropper";
import "../explore/subject-cards.css";

const moroccanCities = [
    "Casablanca", "Rabat", "Marrakech", "Fes", "Tangier", "Agadir", "Meknes", "Oujda", "Kenitra", "Tetouan",
    "Safi", "Mohammedia", "Khouribga", "Beni Mellal", "El Jadida", "Taza", "Nador", "Settat", "Larache",
    "Ksar El Kebir", "Khemisset", "Guelmim", "Berrechid", "Oued Zem", "Fquih Ben Salah", "Taourirt",
    "Berkane", "Sidi Slimane", "Sidi Qacem", "Khenifra", "Taroudant", "Essaouira", "Tiznit", "Ouarzazate",
    "Errachidia", "Tan-Tan", "Sidi Ifni", "Dakhla", "Laayouine"
];

function calculateAge(birthdayStr: string): number {
    const birthday = new Date(birthdayStr + "T00:00");
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) age--;
    return age;
}

type PhotoMode = "avatar" | "upload";

export default function OnboardingPage() {
    const t = useTranslations("Onboarding");
    const { user, forceRefreshUser } = useAuth();
    const { showSnackbar } = useSnackbar();
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(0);
    const [showGenderDropdown, setShowGenderDropdown] = useState(false);
    const [showCitySuggestions, setShowCitySuggestions] = useState(false);
    const genderRef = useRef<HTMLDivElement>(null);

    // Profile photo state
    const [photoMode, setPhotoMode] = useState<PhotoMode>("avatar");
    const [isCropping, setIsCropping] = useState(false);
    const [cropImage, setCropImage] = useState<string | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoUploadStatus, setPhotoUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selections, setSelections] = useState({
        birthday: "", gender: "", city: "", school: "", phone: "",
        schoolId: "", levelId: "", guidanceId: "",
    });
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Pre-fill from existing user data
    useEffect(() => {
        if (!user) return;
        setSelections(prev => ({
            ...prev,
            birthday: user.birthday
                ? new Date(user.birthday as any).toISOString().split('T')[0]
                : prev.birthday,
            gender:   (user.gender as string)  || prev.gender,
            city:     user.city                || prev.city,
            school:   user.schoolName          || prev.school,
            phone:    user.phone               || prev.phone,
            schoolId:   user.selectedPath?.schoolId   || prev.schoolId,
            levelId:    user.selectedPath?.levelId    || prev.levelId,
            guidanceId: user.selectedPath?.guidanceId || prev.guidanceId,
        }));
        // If user already has a photo, reflect that on the upload preview
        if (user.photoURL) {
            setPhotoPreview(user.photoURL.startsWith('http') ? user.photoURL : null);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    // Pre-fill from Google profile
    useEffect(() => {
        const stored = sessionStorage.getItem('googleOnboardingData');
        if (!stored) return;
        sessionStorage.removeItem('googleOnboardingData');
        try {
            const data = JSON.parse(stored) as { birthday?: string; city?: string };
            setSelections(prev => ({
                ...prev,
                ...(data.birthday ? { birthday: data.birthday } : {}),
                ...(data.city ? { city: data.city } : {}),
            }));
        } catch {}
    }, []);

    // Close gender dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (genderRef.current && !genderRef.current.contains(e.target as Node))
                setShowGenderDropdown(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Steps: 0=personal, 1=photo, 2=school, 3=level, 4=guidance
    const stepMeta = [
        { id: "personal",  title: t("personal_info_title"), desc: t("personal_info_desc"), icon: User },
        { id: "photo",     title: "Profile Picture",         desc: "Choose your look",       icon: Camera },
        { id: "school",    title: t("school_title"),         desc: t("school_desc"),          icon: School },
        { id: "level",     title: t("level_title"),          desc: t("level_desc"),           icon: GraduationCap },
        { id: "guidance",  title: t("guidance_title"),       desc: t("guidance_desc"),        icon: BookOpen },
    ];

    // wizard covers steps 2-4 (school/level/guidance), shown as 1-3
    const wizardStep = currentStep - 1; // 1, 2, 3
    const wizardStepLabels = [stepMeta[2].title, stepMeta[3].title, stepMeta[4].title];
    const wizardStepIcons = [<School size={26} key="s" />, <GraduationCap size={26} key="g" />, <BookOpen size={26} key="b" />];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    useEffect(() => {
        if (currentStep > 1) fetchOptions();
    }, [currentStep, selections.schoolId, selections.levelId]);

    const fetchOptions = async () => {
        setLoading(true);
        try {
            let res: any[] = [];
            if (currentStep === 2) {
                res = await getSchools();
                res.sort((a, b) => {
                    const priority = (title: string) => {
                        const l = title.toLowerCase();
                        if (l.includes("prim") || l.includes("ابتدا")) return 0;
                        if (l.includes("coll") || l.includes("إعدا")) return 1;
                        if (l.includes("lyc")  || l.includes("ثانو")) return 2;
                        return 3;
                    };
                    return priority(a.title) - priority(b.title);
                });
            } else if (currentStep === 3) {
                res = await getLevels(selections.schoolId);
                res.sort((a, b) => {
                    const priority = (t: string) => {
                        const l = t.toLowerCase();
                        if (l.includes("tronc") || l.includes("جذع")) return 0;
                        if (l.includes("1ère") || l.includes("أولى")) return 1;
                        if (l.includes("2ème") || l.includes("ثانية")) return 2;
                        return 3;
                    };
                    return priority(a.title) - priority(b.title);
                });
            } else if (currentStep === 4) {
                res = await getGuidances(selections.levelId);
                res.sort((a, b) => a.title.localeCompare(b.title));
            }
            setOptions(res);
        } catch (e) {
            console.error("Failed to fetch onboarding options:", e);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setCropImage(ev.target?.result as string);
            setIsCropping(true);
        };
        reader.readAsDataURL(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCropSave = async (croppedBlob: Blob) => {
        setIsCropping(false);
        setPhotoPreview(URL.createObjectURL(croppedBlob));
        setPhotoUploadStatus("uploading");
        try {
            const formData = new FormData();
            formData.append("photo", croppedBlob, "profile.jpg");
            await api.post("/user/profile/photo", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setPhotoUploadStatus("success");
            showSnackbar(t("photo_updated"), "success");
            setTimeout(() => setPhotoUploadStatus("idle"), 3000);
        } catch (err) {
            console.error("Photo upload failed:", err);
            setPhotoUploadStatus("error");
            showSnackbar(t("photo_failed"), "error");
            setTimeout(() => setPhotoUploadStatus("idle"), 3000);
        }
    };

    const handleStep0Next = async () => {
        try {
            await api.patch("/user/profile", {
                ...(selections.birthday  && { birthday:   selections.birthday }),
                ...(selections.gender    && { gender:     selections.gender }),
                ...(selections.city      && { city:       selections.city }),
                ...(selections.school    && { schoolName: selections.school }),
                ...(selections.phone     && { phone:      selections.phone }),
            });
        } catch (e) {
            console.error("Failed to save personal info:", e);
        }
        setCurrentStep(1);
    };

    const handlePhotoStepNext = async () => {
        if (photoMode === "avatar" && selections.gender) {
            try {
                await api.patch("/user/profile", {
                    photoURL: `/avatars/${selections.gender}.png`,
                });
            } catch (e) {
                console.error("Failed to save avatar:", e);
            }
        }
        setCurrentStep(2);
    };

    const handleSelect = (id: string) => {
        const stepId = stepMeta[currentStep].id;
        setSelections(prev => ({ ...prev, [`${stepId}Id`]: id }));
        if (currentStep < stepMeta.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleFinish({ ...selections, guidanceId: id });
        }
    };

    const handleFinish = async (final: typeof selections) => {
        try {
            const selectedSchool   = (await getSchools()).find(s => s.id === final.schoolId);
            const selectedLevel    = (await getLevels(final.schoolId)).find(l => l.id === final.levelId);
            const selectedGuidance = (await getGuidances(final.levelId)).find(g => g.id === final.guidanceId);
            await api.patch("/user/profile", {
                birthday: final.birthday,
                gender:   final.gender,
                city:       final.city   || undefined,
                schoolName: final.school || undefined,
                phone:      final.phone  || undefined,
                selectedPath: { schoolId: final.schoolId, levelId: final.levelId, guidanceId: final.guidanceId },
                level: {
                    school:   selectedSchool?.title   || "",
                    level:    selectedLevel?.title    || "",
                    guidance: selectedGuidance?.title || "",
                },
            });
            // Load the user into global state for the first time now that onboarding is done
            await forceRefreshUser();
            router.push("/courses");
        } catch (e) {
            console.error("Failed to save profile:", e);
            showSnackbar(t("save_error"), "error");
        }
    };

    const age = selections.birthday ? calculateAge(selections.birthday) : null;
    const labelClass = "text-xs font-black uppercase tracking-widest px-0.5 flex items-center gap-2 text-dark/50" as const;
    const inputClass = "w-full pl-11 pr-4 py-[15px] rounded-2xl bg-green/5 border border-transparent focus:border-green focus:bg-white focus:ring-4 focus:ring-green/5 outline-none transition-all font-medium text-dark placeholder:text-dark/30 text-sm" as const;
    const optionalBadge = (
        <span className="ml-auto text-[10px] font-semibold normal-case tracking-normal" style={{ color: "rgba(26,58,42,0.30)" }}>
            {t("optional")}
        </span>
    );

    const cardStyle = { boxShadow: "0 4px 28px rgba(58,170,106,0.08), 0 1px 4px rgba(0,0,0,0.04)" };
    const headerStyle = { background: "linear-gradient(135deg, #f0faf5 0%, #e8f5ee 100%)" };
    const dotPattern = { backgroundImage: "radial-gradient(circle, rgba(58,170,106,0.15) 1px, transparent 1px)", backgroundSize: "14px 14px" };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-start md:justify-center px-4 pt-20 md:pt-28 pb-16"
            style={{ background: "linear-gradient(160deg, #ffffff 0%, #f4fbf7 55%, #eaf5ef 100%)" }}
        >
            <div className="w-full max-w-md space-y-4">

                {/* Global progress bar */}
                <div className="flex gap-1.5 mb-2">
                    {stepMeta.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? "bg-green" : "bg-green/10"}`}
                        />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    >

                        {/* ════════════════════════════════
                            STEP 0 — Personal Information
                        ════════════════════════════════ */}
                        {currentStep === 0 && (
                            <div className="bg-white rounded-[28px] border border-green/8" style={cardStyle}>
                                <div className="relative px-6 pt-7 pb-6 border-b border-green/6 overflow-hidden rounded-t-[28px]" style={headerStyle}>
                                    <div className="absolute inset-0 pointer-events-none" style={dotPattern} />
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className="step-icon-box"><User size={26} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-green/50 uppercase tracking-widest mb-0.5">{t("personal_info_title")}</p>
                                            <h2 className="text-xl font-black text-dark tracking-tight leading-tight">{stepMeta[0].desc}</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    {/* Row 1: Birthday | City */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className={labelClass}>
                                                {t("birthday")}
                                                {age !== null && (
                                                    <span className="ml-auto text-[10px] font-bold normal-case tracking-normal rounded-full px-2 py-0.5" style={{ background: "rgba(58,170,106,0.10)", color: "#3aaa6a" }}>
                                                        {age}y
                                                    </span>
                                                )}
                                            </label>
                                            <DatePicker
                                                value={selections.birthday}
                                                onChange={(val: string) => setSelections(prev => ({ ...prev, birthday: val }))}
                                                placeholder={t("pick_date")}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className={labelClass}>{t("city")}{optionalBadge}</label>
                                            <div className="relative">
                                                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-green/60 pointer-events-none" />
                                                <input
                                                    type="text"
                                                    value={selections.city}
                                                    onChange={e => { setSelections(p => ({ ...p, city: e.target.value })); setShowCitySuggestions(true); }}
                                                    onFocus={() => setShowCitySuggestions(true)}
                                                    onBlur={() => setTimeout(() => setShowCitySuggestions(false), 150)}
                                                    placeholder="City…"
                                                    autoComplete="off"
                                                    className="w-full pl-10 pr-4 py-[15px] rounded-2xl border border-transparent bg-green/5 focus:border-green focus:bg-white focus:ring-4 focus:ring-green/5 outline-none transition-all text-sm font-medium text-dark placeholder:text-dark/30"
                                                />
                                                {showCitySuggestions && selections.city && moroccanCities.filter(c => c.toLowerCase().includes(selections.city.toLowerCase())).length > 0 && (
                                                    <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white border border-green/10 rounded-[20px] max-h-44 overflow-y-auto p-1.5" style={{ boxShadow: "0 16px 40px rgba(58,170,106,0.12), 0 4px 12px rgba(0,0,0,0.06)" }}>
                                                        {moroccanCities
                                                            .filter(c => c.toLowerCase().includes(selections.city.toLowerCase()))
                                                            .map(city => (
                                                                <button
                                                                    key={city}
                                                                    type="button"
                                                                    onMouseDown={e => e.preventDefault()}
                                                                    onClick={() => { setSelections(p => ({ ...p, city })); setShowCitySuggestions(false); }}
                                                                    className={`w-full px-3.5 py-2.5 text-left text-xs font-bold rounded-xl transition-all flex items-center justify-between ${selections.city === city ? "text-green bg-green/5" : "text-dark/70 hover:text-green hover:bg-green/5"}`}
                                                                >
                                                                    <span className="flex items-center gap-2">
                                                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${selections.city === city ? "bg-green" : "bg-green/20"}`} />
                                                                        {city}
                                                                    </span>
                                                                    {selections.city === city && <Check size={12} className="text-green" />}
                                                                </button>
                                                            ))
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2: Gender | Phone */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5" ref={genderRef}>
                                            <label className={labelClass}>{t("gender")}</label>
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowGenderDropdown(v => !v)}
                                                    className={`w-full px-4 py-[15px] rounded-2xl border transition-all text-left flex items-center justify-between text-sm font-medium ${showGenderDropdown ? "border-green bg-white ring-4 ring-green/5" : "border-transparent bg-green/5"} ${!selections.gender ? "text-dark/30" : "text-dark"}`}
                                                >
                                                    <span className="flex items-center gap-2.5">
                                                        {selections.gender ? (
                                                            <>
                                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-black" style={{ background: "rgba(58,170,106,0.10)", color: "#3aaa6a" }}>
                                                                    {selections.gender === "male" ? "♂" : "♀"}
                                                                </span>
                                                                <span className="font-bold">{selections.gender === "male" ? "Male" : "Female"}</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <User size={15} className="text-green/40" />
                                                                <span>Gender…</span>
                                                            </>
                                                        )}
                                                    </span>
                                                    <ChevronDown size={14} className={`shrink-0 transition-transform ${showGenderDropdown ? "rotate-180 text-green" : "text-dark/20"}`} />
                                                </button>

                                                <AnimatePresence>
                                                    {showGenderDropdown && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 4, scale: 0.97 }}
                                                            transition={{ duration: 0.16, ease: [0.34, 1.4, 0.64, 1] }}
                                                            className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white border border-green/10 rounded-[20px] overflow-hidden p-1.5"
                                                            style={{ boxShadow: "0 16px 40px rgba(58,170,106,0.12), 0 4px 12px rgba(0,0,0,0.06)" }}
                                                        >
                                                            {["male", "female"].map(g => (
                                                                <button
                                                                    key={g}
                                                                    type="button"
                                                                    onClick={() => { setSelections(p => ({ ...p, gender: g })); setShowGenderDropdown(false); }}
                                                                    className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-dark/70 hover:text-green hover:bg-green/5 rounded-xl transition-all flex items-center gap-2.5"
                                                                >
                                                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-black" style={{ background: "rgba(58,170,106,0.08)", color: "#3aaa6a" }}>
                                                                        {g === "male" ? "♂" : "♀"}
                                                                    </span>
                                                                    {g === "male" ? "Male" : "Female"}
                                                                    {selections.gender === g && <Check size={12} className="text-green ml-auto" />}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className={labelClass}>{t("phone")}{optionalBadge}</label>
                                            <div className="relative">
                                                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-green/50" />
                                                <input
                                                    type="tel"
                                                    value={selections.phone}
                                                    onChange={e => setSelections(p => ({ ...p, phone: e.target.value }))}
                                                    className={inputClass}
                                                    placeholder="06…"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 py-0.5">
                                        <div className="flex-1 border-t border-dashed border-green/15" />
                                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "rgba(26,58,42,0.25)" }}>{t("optional")}</span>
                                        <div className="flex-1 border-t border-dashed border-green/15" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className={`${labelClass} text-dark/40`}>{t("school_name")}{optionalBadge}</label>
                                        <div className="relative">
                                            <School size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-green/50" />
                                            <input
                                                type="text"
                                                value={selections.school}
                                                onChange={e => setSelections(p => ({ ...p, school: e.target.value }))}
                                                className={inputClass}
                                                placeholder="e.g. Lycée Hassan II"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleStep0Next}
                                        disabled={!selections.birthday || !selections.gender}
                                        className="w-full py-4 bg-green text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 text-sm mt-1"
                                        style={{ boxShadow: selections.birthday && selections.gender ? "0 8px 24px rgba(58,170,106,0.28)" : "none" }}
                                    >
                                        {t("next")} <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ════════════════════════════════
                            STEP 1 — Profile Picture
                        ════════════════════════════════ */}
                        {currentStep === 1 && (
                            <div className="bg-white rounded-[28px] border border-green/8" style={cardStyle}>
                                <div className="relative px-6 pt-7 pb-6 border-b border-green/6 overflow-hidden rounded-t-[28px]" style={headerStyle}>
                                    <div className="absolute inset-0 pointer-events-none" style={dotPattern} />
                                    <div className="relative z-10 flex items-center gap-4">
                                        <div className="step-icon-box"><Camera size={26} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-green/50 uppercase tracking-widest mb-0.5">Profile Picture</p>
                                            <h2 className="text-xl font-black text-dark tracking-tight leading-tight">Choose your look</h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">
                                    {/* Mode tabs */}
                                    <div className="flex gap-2 p-1 bg-green/5 rounded-2xl">
                                        {(["avatar", "upload"] as const).map((mode) => (
                                            <button
                                                key={mode}
                                                type="button"
                                                onClick={() => setPhotoMode(mode)}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                                    photoMode === mode
                                                        ? "bg-white text-green shadow-sm shadow-green/10"
                                                        : "text-dark/40 hover:text-dark/60"
                                                }`}
                                            >
                                                {mode === "avatar" ? "Avatar" : "Upload Photo"}
                                            </button>
                                        ))}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {photoMode === "avatar" ? (
                                            <motion.div
                                                key="avatar"
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                                transition={{ duration: 0.22 }}
                                                className="flex flex-col items-center gap-4 py-2"
                                            >
                                                {selections.gender ? (
                                                    <>
                                                        <div className="relative">
                                                            <div className="absolute inset-x-1 -inset-y-2 bg-gradient-to-tr from-green/20 to-emerald-400/20 rounded-[2.5rem] -z-10 blur-2xl" />
                                                            <div className="w-36 h-36 rounded-[2rem] overflow-hidden border-[3px] border-green shadow-xl relative">
                                                                <Image
                                                                    src={`/avatars/${selections.gender}.png`}
                                                                    alt={`${selections.gender} avatar`}
                                                                    fill
                                                                    className="object-cover"
                                                                    unoptimized
                                                                />
                                                            </div>
                                                        </div>
                                                        <p className="text-sm font-bold text-dark/50">
                                                            {selections.gender === "male" ? "Male" : "Female"} avatar selected
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-36 h-36 rounded-[2rem] border-2 border-dashed border-green/20 bg-green/[0.02] flex items-center justify-center">
                                                            <User size={48} className="text-green/20" />
                                                        </div>
                                                        <p className="text-sm text-dark/40 font-medium text-center">
                                                            Go back to select your gender first
                                                        </p>
                                                    </>
                                                )}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="upload"
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                                transition={{ duration: 0.22 }}
                                                className="flex flex-col items-center gap-4 py-2"
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                                    className="hidden"
                                                    onChange={handlePhotoChange}
                                                />
                                                <div
                                                    className="relative group cursor-pointer"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <div className="absolute inset-x-1 -inset-y-2 bg-gradient-to-tr from-green/20 to-emerald-400/20 rounded-[2.5rem] -z-10 blur-2xl group-hover:blur-3xl transition-all duration-500" />
                                                    {photoPreview ? (
                                                        <div className="w-36 h-36 rounded-[2rem] overflow-hidden border-[3px] border-green shadow-xl relative">
                                                            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                <Camera size={28} className="text-white" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-36 h-36 rounded-[2rem] border-2 border-dashed border-green/30 bg-green/[0.03] group-hover:border-green group-hover:bg-green/5 transition-all flex flex-col items-center justify-center gap-2">
                                                            <Upload size={32} className="text-green/40 group-hover:text-green transition-colors" />
                                                            <span className="text-xs font-bold text-green/40 group-hover:text-green transition-colors">Choose photo</span>
                                                        </div>
                                                    )}
                                                    {photoPreview && (
                                                        <div className="absolute -bottom-1 -right-1 bg-green text-white p-1.5 rounded-full border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                                                            <Camera size={14} />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-xs font-bold text-green/50 uppercase tracking-widest">
                                                    {photoUploadStatus === "uploading" ? "Uploading..." :
                                                     photoUploadStatus === "success" ? "✓ Uploaded" :
                                                     photoPreview ? "Tap to change" : "Profile Photo"}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Next */}
                                    <button
                                        onClick={handlePhotoStepNext}
                                        disabled={photoMode === "avatar" && !selections.gender}
                                        className="w-full py-4 bg-green text-white font-black rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 text-sm"
                                        style={{ boxShadow: "0 8px 24px rgba(58,170,106,0.28)" }}
                                    >
                                        {t("next")} <ChevronRight size={18} />
                                    </button>

                                    <button
                                        onClick={() => setCurrentStep(0)}
                                        className="btn-back w-full"
                                    >
                                        <ChevronLeft size={14} className="btn-back-arrow" />
                                        {t("back")}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ════════════════════════════════
                            STEPS 2-4 — School / Level / Guidance
                        ════════════════════════════════ */}
                        {currentStep > 1 && (
                            <div className="space-y-3">
                                <div
                                    className="bg-white rounded-[28px] border border-green/8 overflow-hidden animate-slide-up"
                                    style={{ boxShadow: "0 8px 28px rgba(58,170,106,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}
                                >
                                    <div className="relative px-6 pt-7 pb-6 border-b border-green/6" style={headerStyle}>
                                        <div className="absolute inset-0 pointer-events-none" style={dotPattern} />

                                        {/* Step dots (1-3 for school/level/guidance) */}
                                        <div className="relative z-10 flex items-center justify-center gap-2 mb-5">
                                            {[1, 2, 3].map(s => (
                                                <div key={s} className="flex items-center gap-2">
                                                    <div className={`step-dot ${s < wizardStep ? "step-dot-past" : s === wizardStep ? "step-dot-active" : "step-dot-future"}`}>
                                                        {s < wizardStep ? "✓" : s}
                                                    </div>
                                                    {s < 3 && (
                                                        <div className={`step-line ${s < wizardStep ? "step-line-done" : "step-line-pending"}`} />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="relative z-10 flex items-center gap-4">
                                            <div className="step-icon-box">
                                                {wizardStepIcons[wizardStep - 1]}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-green/50 uppercase tracking-widest mb-0.5">
                                                    Step {wizardStep} of 3
                                                </p>
                                                <h2 className="text-xl font-black text-dark tracking-tight leading-tight">
                                                    {wizardStepLabels[wizardStep - 1]}
                                                </h2>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-2">
                                        {loading ? (
                                            Array(3).fill(0).map((_, i) => (
                                                <div key={i} className="selection-skeleton" style={{ animationDelay: `${i * 70}ms` }} />
                                            ))
                                        ) : options.length === 0 ? (
                                            <div className="py-8 text-center text-sm text-green/40 font-medium">
                                                Nothing found — check your connection.
                                            </div>
                                        ) : (
                                            options.map((item, index) => {
                                                const currentSelectionId =
                                                    currentStep === 2 ? selections.schoolId :
                                                    currentStep === 3 ? selections.levelId :
                                                    selections.guidanceId;
                                                const isSelected = item.id === currentSelectionId;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        onClick={() => handleSelect(item.id)}
                                                        className="selection-card"
                                                        style={{
                                                            animationDelay: `${index * 40}ms`,
                                                            ...(isSelected ? {
                                                                borderColor: "rgba(58,170,106,0.5)",
                                                                background: "rgba(58,170,106,0.04)",
                                                                boxShadow: "0 0 0 3px rgba(58,170,106,0.08)",
                                                            } : {})
                                                        }}
                                                    >
                                                        <div className="selection-card-row">
                                                            <span className="selection-card-num" style={isSelected ? { background: "rgba(58,170,106,0.18)", color: "#3aaa6a" } : {}}>
                                                                {isSelected ? "✓" : String(index + 1).padStart(2, "0")}
                                                            </span>
                                                            <span className="selection-card-label" style={isSelected ? { color: "#3aaa6a" } : {}}>{item.title}</span>
                                                            <ChevronRight size={15} className="selection-card-chevron" style={isSelected ? { color: "#3aaa6a" } : {}} />
                                                        </div>
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>

                                    <div className="px-4 pb-4">
                                        <button onClick={() => setCurrentStep(currentStep - 1)} className="btn-back">
                                            <ChevronLeft size={14} className="btn-back-arrow" />
                                            {t("back")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isCropping && cropImage && (
                    <ImageCropper
                        image={cropImage}
                        onClose={() => setIsCropping(false)}
                        onCropSave={handleCropSave}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
