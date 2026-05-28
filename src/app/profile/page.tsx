"use client";

import "./profile.css";
import { useState, useEffect, useRef, useTransition } from "react";
import { setUserLocaleAction } from "@/app/actions/locale";
import type { Locale } from "@/lib/localeConfig";
import { UdarsyLoader } from "@/components/UdarsyLoader";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Book,
    Settings as SettingsIcon,
    LogOut,
    ChevronRight,
    ChevronLeft,
    Heart,
    Camera,
    CircleDashed,
    Loader2,
    CheckCircle,
    XCircle,
    Star,
    Plus,
    GraduationCap,
    MessageSquare,
    FileText,
    X,
    RefreshCw,
    Languages,
    ChevronDown,
    Lock,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { getLessonById, getSubjects, getGuidances, getSubjectById } from "@/services/data";
import { getSubjectImage } from "@/lib/subjectImages";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import dynamic from "next/dynamic";
import { useSnackbar } from "@/contexts/SnackbarContext";
import ProgressCharts from "@/components/profile/ProgressCharts";
import { SERVICE_CARD_IMAGES } from "@/lib/serviceCardImages";
import { triggerVerifyDialog } from "@/lib/verifyGate";

const ImageCropper = dynamic(() => import("@/components/ImageCropper"), { ssr: false });

export default function ProfilePage() {
    const t = useTranslations("Profile");
    const ts = useTranslations("Settings");
    const tc = useTranslations("Common");
    const ta = useTranslations("Auth");
    const locale = useLocale();
    const isAr = locale === 'ar';
    const { user, logout, loading: authLoading, checkAuth, forceRefreshUser, getPhotoURL, getResourceURL } = useAuth();
    const [lastLessons, setLastLessons] = useState<any[]>([]);
    const [photoUploadStatus, setPhotoUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [cropImage, setCropImage] = useState<string | null>(null);
    const [guidanceTotalResources, setGuidanceTotalResources] = useState<number>(0);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [langPending, startLangTransition] = useTransition();
    const [localSettings, setLocalSettings] = useState({ notifications: true, theme: 'system' as 'light' | 'dark' | 'system' });
    const [approvedApplication, setApprovedApplication] = useState<any>(null);
    const [instructorNames, setInstructorNames] = useState<{ guidance: string; subject: string }>({ guidance: '', subject: '' });
    const [teacherVerification, setTeacherVerification] = useState<any>(null);
    const [profileDataLoading, setProfileDataLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);
    const [activeRoleTab, setActiveRoleTab] = useState<'instructor' | 'teacher'>('instructor');
    const [showRewardDialog, setShowRewardDialog] = useState(false);
    const [rewardRequesting, setRewardRequesting] = useState(false);
    const [myRewardRequests, setMyRewardRequests] = useState<any[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [resettingPath, setResettingPath] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            setProfileDataLoading(true);
            Promise.all([
                fetchLastVisitedLessons(),
                fetchApprovedApplication(),
                fetchTeacherVerification(),
            ]).finally(() => setProfileDataLoading(false));
            // Sync local settings state from user
            setLocalSettings({
                notifications: user.settings?.notifications ?? true,
                theme: user.settings?.theme ?? 'system',
            });
            // Fetch guidance total resources if path is set
            if (user.selectedPath?.guidanceId) {
                api.get(`/data/guidance-resources/${user.selectedPath.guidanceId}`)
                    .then(r => setGuidanceTotalResources(r.data?.total || 0))
                    .catch(() => {});
            }
        }
    }, [authLoading, user, router]);

    const fetchLastVisitedLessons = async () => {
        if (!user?.progress?.lessons?.length) return;
        const top = [...user.progress.lessons]
            .filter((l: any) => l.lastAccessed && l.lessonId)
            .sort((a: any, b: any) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
            .slice(0, 4);
        if (!top.length) return;
        const enriched = await Promise.all(top.map(async (prog: any) => {
            const lesson = await getLessonById(prog.lessonId);
            if (!lesson) return null;
            const subject = lesson.subjectId ? await getSubjectById(lesson.subjectId) : null;
            return { ...lesson, progress: prog, subject };
        }));
        setLastLessons(enriched.filter(Boolean) as any[]);
    };

    const fetchApprovedApplication = async () => {
        try {
            const res = await api.get('/teacher/applications/me');
            const apps = res.data || [];
            const approved = apps.find((app: any) => app.status === 'approved');
            if (approved) {
                setApprovedApplication(approved);
                const [guidances, subjects] = await Promise.all([
                    getGuidances(approved.targetLevelId),
                    getSubjects(approved.targetGuidanceId),
                ]);
                const gId = String(approved.targetGuidanceId);
                const sId = String(approved.targetSubjectId);
                const guidance = guidances.find((g: any) => String(g._id) === gId || String(g.id) === gId);
                const subject = subjects.find((s: any) => String(s._id) === sId || String(s.id) === sId);
                setInstructorNames({
                    guidance: guidance?.title || '',
                    subject: subject?.title || '',
                });
            }
        } catch (err) {
            console.error('Failed to fetch applications', err);
        }
    };

    const fetchTeacherVerification = async () => {
        try {
            const res = await api.get('/teacher/verify/me');
            if (res.data?.status === 'approved') setTeacherVerification(res.data);
        } catch { }
    };

    const fetchMyRewardRequests = async () => {
        try {
            const res = await api.get('/user/reward-requests/me');
            setMyRewardRequests(res.data || []);
        } catch { }
    };

    const handleRequestReward = async () => {
        setRewardRequesting(true);
        try {
            await api.post('/user/reward-request');
            showSnackbar(t('reward_request_success'), 'success');
            fetchMyRewardRequests();
        } catch (err: any) {
            showSnackbar(err.response?.data?.error || t('reward_request_failed'), 'error');
        } finally {
            setRewardRequesting(false);
        }
    };

    // Wipe every lesson/resource the user has touched AND drop their study path,
    // then send them through onboarding to pick again. Destructive — gated by a confirm.
    const handleResetAndChoosePath = async () => {
        if (resettingPath) return;
        const ok = window.confirm(t('reset_confirm'));
        if (!ok) return;
        setResettingPath(true);
        try {
            await api.post('/progress/reset', { clearPath: true });
            await forceRefreshUser();
            showSnackbar(t('reset_success'), 'success');
            router.push('/onboarding?pathOnly=1');
        } catch {
            showSnackbar(t('reset_failed'), 'error');
        } finally {
            setResettingPath(false);
        }
    };

    const saveSettings = async (patch: Partial<typeof localSettings>) => {
        const updated = { ...localSettings, ...patch };
        setLocalSettings(updated);
        setSavingSettings(true);
        try {
            await api.patch('/user/profile', { settings: updated });
            showSnackbar(t('settings_saved'), "success");
        } catch {
            showSnackbar(t('settings_failed'), "error");
        } finally {
            setSavingSettings(false);
        }
    };

    useEffect(() => {
        if (profileDataLoading) return;
        const _isInstructor = user?.role === 'instructor';
        const _isTeacher = user?.role === 'teacher';
        const _showIns = _isInstructor || (_isTeacher && !!approvedApplication);
        const _showTea = _isTeacher || (_isInstructor && !!teacherVerification);
        if (_showIns && _showTea) {
            setRedirecting(true);
            router.replace('/instructor-dashboard');
            return;
        }
        if (_showIns) { setRedirecting(true); router.replace('/instructor-dashboard'); return; }
        if (_showTea) { setRedirecting(true); router.replace('/teacher/dashboard'); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileDataLoading]);

    const handlePhotoClick = () => {
        if (currentPhoto) { setPreviewOpen(true); return; }
        fileInputRef.current?.click();
    };

    const handleCameraClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        fileInputRef.current?.click();
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

        // Upload to backend
        setPhotoUploadStatus("uploading");
        setUploadProgress(0);
        try {
            const formData = new FormData();
            formData.append("photo", croppedBlob, "profile.jpg");
            await api.post("/user/profile/photo", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / (progressEvent.total || 1)) * 100);
                    setUploadProgress(progress);
                }
            });
            await checkAuth(); // Refresh user data
            setPhotoUploadStatus("success");
            showSnackbar(t("photo_updated_success"), "success");
            setTimeout(() => {
                setPhotoUploadStatus("idle");
                setUploadProgress(0);
            }, 3000);
        } catch (err) {
            console.error("Photo upload failed:", err);
            setPhotoPreview(null);
            setPhotoUploadStatus("error");
            showSnackbar(t("photo_updated_error"), "error");
            setTimeout(() => {
                setPhotoUploadStatus("idle");
                setUploadProgress(0);
            }, 3000);
        }
    };

    const filesOpenedToday = (() => {
        const today = new Date().toISOString().split('T')[0];
        const history: any[] = user?.progress?.timeSpentHistory || [];
        const entry = history.find((h: any) => (h.date || '').startsWith(today));
        return entry?.filesOpened ?? entry?.documentsOpened ?? user?.progress?.documentsOpened ?? 0;
    })();

    const stats = [
        { label: t("lessons_started"), value: String(user?.progress?.lessons?.length || 0), icon: Book, color: "text-blue-500", bg: "bg-blue-50" },
        { label: t("files_opened"), value: String(filesOpenedToday), icon: FileText, color: "text-green", bg: "bg-green/10" },
        { label: t("points"), value: String(user?.points || 0), icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
    ];

    // Data for charts — derived from lesson entries (a lesson counts as completed
    // once every one of its resources is done).
    const timeHistory = user?.progress?.timeSpentHistory || [];
    const progressLessons = user?.progress?.lessons || [];
    const completedLessons = progressLessons.filter(
        (l: any) => (l.totalResourcesCount || 0) > 0 && (l.completedResources?.length || 0) >= l.totalResourcesCount
    ).length;
    const viewedLessons = Math.max(0, progressLessons.length - completedLessons);
    const totalLessons = progressLessons.length;

    const calculateCompletion = () => {
        if (!user) return 0;
        const fields = [
            user.displayName,
            user.age,
            user.city,
            user.phone,
            user.schoolName,
            user.email,
            user.level?.school,
            user.level?.level,
            user.level?.guidance,
            user.photoURL
        ];
        const filledFields = fields.filter(f => f && f !== "").length;
        return Math.round((filledFields / fields.length) * 100);
    };

    const profileCompletion = calculateCompletion();

    const suggestions = [
        { id: 'age', label: t("suggest_age"), done: !!user?.age },
        { id: 'city', label: t("suggest_city"), done: !!user?.city },
        { id: 'path', label: t("suggest_path"), done: !!(user?.level?.school && user?.level?.level && user?.level?.guidance) },
        { id: 'photo', label: t("suggest_photo"), done: !!user?.photoURL },
        { id: 'school', label: t("suggest_school"), done: !!user?.schoolName },
        { id: 'phone', label: t("suggest_phone"), done: !!user?.phone },
    ].filter(s => !s.done);

    const currentPhoto = photoPreview || getPhotoURL(user?.photoURL);

    const isInstructor = user?.role === 'instructor';
    const isTeacher = user?.role === 'teacher';
    const isUnverified = !!user && user.isVerified !== true;
    const showInstructorSection = isInstructor || (isTeacher && !!approvedApplication);
    const showTeacherSection = isTeacher || (isInstructor && !!teacherVerification);
    const hasBothRoles = showInstructorSection && showTeacherSection;

    // While deciding whether to redirect, show a clean loading screen for role users
    if ((isInstructor || isTeacher) && (profileDataLoading || redirecting)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
                <UdarsyLoader size={90} />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-[#F8F9FA] pb-24 md:pb-0 pt-10 md:pt-32 px-0 md:px-8"
        >
            <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10 space-y-6">

                {/* ── Role Banners (Instructor / Teacher) ── */}
                {(showInstructorSection || showTeacherSection) && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-3"
                    >
                        {/* Tab switcher — only shown when user has both roles */}
                        {hasBothRoles && (
                            <div className="flex gap-2 p-1 bg-white rounded-2xl border border-green/10 shadow-sm w-fit">
                                <button
                                    onClick={() => setActiveRoleTab('instructor')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${activeRoleTab === 'instructor' ? 'bg-green text-white shadow-md shadow-green/20' : 'text-dark/50 hover:text-dark/80'}`}
                                >
                                    <GraduationCap size={14} /> {t("instructor_tab")}
                                </button>
                                <button
                                    onClick={() => setActiveRoleTab('teacher')}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${activeRoleTab === 'teacher' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-dark/50 hover:text-dark/80'}`}
                                >
                                    <MessageSquare size={14} /> {t("teacher_tab")}
                                </button>
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {/* Instructor Banner */}
                            {showInstructorSection && (!hasBothRoles || activeRoleTab === 'instructor') && (
                                <motion.div
                                    key="instructor"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.22 }}
                                    className="relative overflow-hidden rounded-[10px]"
                                    style={{ background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 2px,transparent 2px,transparent 8px),linear-gradient(135deg,#1e7a46 0%,#0f4428 100%)' }}
                                >
                                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '18px 18px', opacity: 0.35 }} />
                                    <div className="relative z-10 p-6 md:p-8">
                                        <div className="flex items-start gap-4 mb-5">
                                            <div className="w-14 h-14 rounded-[16px] overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                                                {currentPhoto
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    ? <img src={currentPhoto} alt="" className="w-full h-full object-cover" />
                                                    : <div className="w-full h-full flex items-center justify-center"><GraduationCap size={28} className="text-white" /></div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.14em] text-green-300 bg-white/10 border border-white/15 rounded-full px-2.5 py-1 mb-1.5">
                                                    <GraduationCap size={10} /> {t("instructor_badge")}
                                                </span>
                                                <h2 className="text-lg font-black text-white leading-tight">{user?.displayName}</h2>
                                                {approvedApplication && (
                                                    <p className="text-sm text-white/50 line-clamp-1 mt-0.5">
                                                        {approvedApplication.specialist}{instructorNames.subject ? ` · ${instructorNames.subject}` : ''}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Link href="/instructor-dashboard" className="inline-flex items-center gap-1.5 px-6 py-3 bg-white text-green font-black rounded-[14px] text-sm hover:bg-green/5 transition-colors shadow-md">
                                            <GraduationCap size={15} /> {t("go_to_instructor_dashboard")}
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {/* Teacher Banner */}
                            {showTeacherSection && (!hasBothRoles || activeRoleTab === 'teacher') && (
                                <motion.div
                                    key="teacher"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.22 }}
                                    className="relative overflow-hidden rounded-[10px]"
                                    style={{ background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 2px,transparent 2px,transparent 8px),linear-gradient(135deg,#1e3a8a 0%,#0f2260 100%)' }}
                                >
                                    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '18px 18px', opacity: 0.35 }} />
                                    <div className="relative z-10 p-6 md:p-8">
                                        <div className="flex items-start gap-4 mb-5">
                                            <div className="w-14 h-14 rounded-[16px] overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                                                {currentPhoto
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    ? <img src={currentPhoto} alt="" className="w-full h-full object-cover" />
                                                    : <div className="w-full h-full flex items-center justify-center"><MessageSquare size={28} className="text-white" /></div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.14em] text-indigo-300 bg-white/10 border border-white/15 rounded-full px-2.5 py-1 mb-1.5">
                                                    <MessageSquare size={10} /> {t("teacher_badge")}
                                                </span>
                                                <h2 className="text-lg font-black text-white leading-tight">{user?.displayName}</h2>
                                                {teacherVerification && (
                                                    <p className="text-sm text-white/50 line-clamp-1 mt-0.5">
                                                        {teacherVerification.subject}{teacherVerification.schoolName ? ` · ${teacherVerification.schoolName}` : ''}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Link href="/teacher/dashboard" className="inline-flex items-center gap-1.5 px-6 py-3 bg-white text-indigo-700 font-black rounded-[14px] text-sm hover:bg-indigo-50 transition-colors shadow-md">
                                            <MessageSquare size={15} /> {t("go_to_teacher_dashboard")}
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* ── Student Profile Card ── */}
                <div>
                {/* Hero Section — desktop only */}
                <div className="md:bg-white md:rounded-[10px] md:border md:border-green/10 md:p-10 md:shadow-2xl md:shadow-green/5 p-0 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                        <div className="flex flex-row md:flex-row items-center md:items-start gap-4 md:gap-8 w-full md:w-auto">
                            {/* Profile Picture with Upload */}
                            <div className="relative group shrink-0">
                                <div
                                    className="relative group cursor-pointer w-20 h-20 md:w-40 md:h-40 flex-shrink-0"
                                    onClick={handlePhotoClick}
                                >
                                    <div className="absolute inset-x-2 -inset-y-3 bg-gradient-to-tr from-green/20 to-emerald-400/20 rounded-[20px] md:rounded-[3rem] -z-10 blur-2xl group-hover:blur-3xl transition-all duration-500" />
                                    {currentPhoto ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={currentPhoto}
                                            alt={user?.displayName}
                                            className="w-full h-full object-cover rounded-[20px] md:rounded-[3rem] border-4 border-green shadow-xl shadow-green/20 group-hover:scale-[1.02] bg-white transition-all duration-300 relative z-10"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-white border-4 border-green rounded-[20px] md:rounded-[3rem] flex items-center justify-center shadow-xl shadow-green/20 group-hover:scale-[1.02] transition-all duration-300 relative z-10">
                                            <User size={64} className="text-green" />
                                        </div>
                                    )}
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[20px] md:rounded-[3rem] z-20">
                                        <Camera size={32} className="text-white" />
                                    </div>
                                    {/* Static Camera Icon on Edge */}
                                    <div onClick={handleCameraClick} className="absolute -bottom-1 -right-1 bg-green text-white p-2.5 rounded-full border-4 border-[#F8F9FA] shadow-md z-30 group-hover:scale-110 transition-transform">
                                        <Camera size={18} />
                                    </div>

                                    {/* Premium Badge — top-left on mobile, top-right on desktop */}
                                    {(user?.subscription?.plan === 'premium' || user?.subscription?.plan === 'pro') && (
                                        <div className="absolute -top-1 -left-1 md:-left-auto md:-right-1 w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-400 border-[3px] border-white flex items-center justify-center shadow-lg pointer-events-none z-10" title={t("premium_member")}>
                                            <Star size={16} className="text-white fill-current md:hidden" />
                                            <Star size={20} className="text-white fill-current hidden md:block" />
                                        </div>
                                    )}
                                </div>

                                {/* Upload status badge */}
                                <AnimatePresence>
                                    {photoUploadStatus !== "idle" && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl
                                                            ${photoUploadStatus === "uploading" ? "bg-white border border-green/20" : ""}
                                                            ${photoUploadStatus === "success" ? "bg-green" : ""}
                                                            ${photoUploadStatus === "error" ? "bg-red-500" : ""}
                                                        `}
                                        >
                                            {photoUploadStatus === "uploading" && <Loader2 size={20} className="text-green animate-spin" />}
                                            {photoUploadStatus === "success" && <CheckCircle size={20} className="text-white" />}
                                            {photoUploadStatus === "error" && <XCircle size={20} className="text-white" />}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                />

                                {/* Click hint */}
                                {photoUploadStatus !== "idle" && (
                                    <div className="mt-3 space-y-2">
                                        <p className="text-xs text-center text-muted-foreground font-medium">
                                            {photoUploadStatus === "uploading" ? `${t("updating")} (${uploadProgress}%)` :
                                                photoUploadStatus === "success" ? `✓ ${t("updated")}` :
                                                    t("upload_failed")}
                                        </p>
                                        {photoUploadStatus === "uploading" && (
                                            <div className="w-full h-1 bg-green/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${uploadProgress}%` }}
                                                    className="h-full bg-green"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="text-left space-y-2 md:space-y-3 min-w-0">
                                <div className="flex flex-row items-center gap-2 flex-wrap">
                                    <h1 className="text-lg md:text-4xl font-bold text-dark">{user?.displayName}</h1>
                                    {/* Plan badge — hidden on mobile (shown as photo badge) */}
                                    {(() => {
                                        const plan = user?.subscription?.plan;
                                        if (plan === 'premium') return (
                                            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-amber-400 text-white shadow-md shadow-amber-200 shrink-0">
                                                <Star size={9} className="fill-white" /> {t("plan_premium")}
                                            </span>
                                        );
                                        if (plan === 'pro') return (
                                            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-green text-white shadow-md shadow-green/30 shrink-0">
                                                <Star size={9} className="fill-white" /> {t("plan_pro")}
                                            </span>
                                        );
                                        return (
                                            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-green/20 text-green/60 shrink-0">
                                                {t("plan_free")}
                                            </span>
                                        );
                                    })()}
                                </div>
                                {/* Age + gender inline on mobile */}
                                <div className="flex flex-row flex-wrap items-center gap-x-3 gap-y-1 md:flex-col md:items-start md:gap-2">
                                    {(user?.age || user?.gender) && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            {user?.age && <span className="flex items-center gap-1"><User size={13} className="text-green" />{user.age} {t("years_short")}</span>}
                                            {user?.age && user?.gender && <span className="text-dark/20">·</span>}
                                            {user?.gender && <span className="text-green font-bold text-base">{user.gender.toLowerCase() === 'male' ? '♂' : user.gender.toLowerCase() === 'female' ? '♀' : '⚧'}</span>}
                                            {user?.gender && <span className="hidden md:inline text-muted-foreground">{ts(user.gender.toLowerCase()) || user.gender}</span>}
                                        </div>
                                    )}
                                    <p className="text-muted-foreground flex items-center gap-2 text-sm">
                                        <GraduationCap size={13} className="text-green" />
                                        {user?.level?.guidance || t("new_student")} • {user?.level?.level || t("onboarding_status")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Profile Completion */}
                    {profileCompletion < 100 && (
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        dir={isAr ? "rtl" : "ltr"}
                        className="rounded-[10px] relative overflow-hidden"
                        style={{ background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 2px,transparent 2px,transparent 8px),linear-gradient(135deg,#1e7a46 0%,#0f4428 100%)' }}
                    >
                        {/* Dot grid texture — matches instructor banner */}
                        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '18px 18px', opacity: 0.35 }} />

                        {/* Header row */}
                        <div className="relative z-10 flex items-center gap-5 p-5 md:p-7">
                            {/* Progress ring */}
                            <div className="relative shrink-0">
                                <svg className="w-[68px] h-[68px] md:w-24 md:h-24 -rotate-90" viewBox="0 0 128 128" style={{ shapeRendering: "geometricPrecision" }}>
                                    {/* Track */}
                                    <circle cx="64" cy="64" r="54" stroke="white" strokeOpacity="0.12" strokeWidth="10" fill="transparent" strokeLinecap="round" />
                                    {/* Fill */}
                                    <motion.circle
                                        cx="64" cy="64" r="54"
                                        stroke="white" strokeWidth="10" fill="transparent"
                                        strokeDasharray={339.3}
                                        initial={{ strokeDashoffset: 339.3 }}
                                        animate={{ strokeDashoffset: 339.3 - (339.3 * profileCompletion) / 100 }}
                                        strokeLinecap="round"
                                        transition={{ duration: 1.1, ease: [0.34, 1.2, 0.64, 1] }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {profileCompletion === 100 ? (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.5 }}>
                                            <Star size={20} className="text-white fill-white" />
                                        </motion.div>
                                    ) : (
                                        <span className="text-base md:text-xl font-black text-white tabular-nums">{profileCompletion}%</span>
                                    )}
                                </div>
                            </div>

                            {/* Text */}
                            <div className={`flex-1 min-w-0 ${isAr ? "text-right" : "text-left"}`}>
                                <div className={`flex items-center gap-1.5 mb-1.5 ${isAr ? "flex-row-reverse" : ""}`}>
                                    {profileCompletion === 100
                                        ? <CheckCircle size={12} className="text-white/80 shrink-0" />
                                        : <CircleDashed size={12} className="text-white/80 shrink-0 animate-spin-slow" />}
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">
                                        {profileCompletion === 100 ? t("completion_success_title") : t("completion_title")}
                                    </span>
                                </div>
                                <h3 className="text-base md:text-2xl font-black text-white leading-tight mb-1">
                                    {profileCompletion === 100
                                        ? <>{t.rich("completion_perfect", { green: (chunks) => <span className="text-green-200">{chunks}</span> })}</>
                                        : t("completion_almost_ready")}
                                </h3>
                                <p className="text-white/50 text-xs md:text-sm leading-snug line-clamp-2 font-medium">
                                    {profileCompletion === 100 ? t("completion_success_desc") : t("completion_desc")}
                                </p>
                            </div>
                        </div>

                        {/* Suggestions */}
                        {profileCompletion < 100 && suggestions.length > 0 && (
                            <div className="relative z-10 px-5 pb-5 md:px-7 md:pb-7 flex flex-col gap-1.5">
                                <div className="h-px bg-white/10 mb-2" />
                                {suggestions.map((suggestion, idx) => (
                                    <motion.button
                                        key={suggestion.id}
                                        initial={{ opacity: 0, x: isAr ? 12 : -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 + idx * 0.05, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                                        onClick={() => {
                                            if (suggestion.id === 'path') router.push('/onboarding');
                                            else if (suggestion.id === 'photo') handlePhotoClick();
                                            else router.push('/settings');
                                        }}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-[14px] bg-white/8 hover:bg-white/14 border border-white/10 hover:border-white/20 transition-all duration-200 group/btn ${isAr ? "flex-row-reverse text-right" : "text-left"}`}
                                    >
                                        <div className="w-6 h-6 rounded-[9px] bg-white/12 flex items-center justify-center text-white shrink-0 group-hover/btn:bg-white/20 group-hover/btn:scale-105 transition-all">
                                            <Plus size={13} />
                                        </div>
                                        <span className="text-sm font-semibold text-white/85 flex-1 truncate group-hover/btn:text-white transition-colors">{suggestion.label}</span>
                                        <ChevronRight size={13} className={`${isAr ? "rotate-180" : ""} text-white/25 group-hover/btn:text-white/70 group-hover/btn:translate-x-0.5 transition-all shrink-0`} />
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                    )}

                    {/* Progress Charts */}
                    <div className="relative">
                        <div
                            className={isUnverified ? "pointer-events-none select-none" : ""}
                            style={isUnverified ? { filter: 'blur(4px)' } : undefined}
                            aria-hidden={isUnverified}
                        >
                            <ProgressCharts
                                timeHistory={timeHistory}
                                completedLessons={completedLessons}
                                viewedLessons={viewedLessons}
                                totalLessons={totalLessons}
                                documentsOpened={user?.progress?.documentsOpened || 0}
                                completedResources={user?.progress?.lessons?.reduce((sum: number, l: any) => sum + (l.completedResources?.length || 0), 0) || 0}
                                totalResources={guidanceTotalResources || user?.totalGuidanceResources || user?.progress?.lessons?.reduce((sum: number, l: any) => sum + (l.totalResourcesCount || 0), 0) || totalLessons}
                            />
                        </div>
                        {isUnverified && (
                            <button
                                type="button"
                                onClick={() => triggerVerifyDialog()}
                                aria-label={ta("verify_required_title")}
                                className="absolute inset-0 z-30 flex flex-wrap items-stretch"
                                style={{ gap: 20 }}
                            >
                                <div style={{ flex: 1, minWidth: 0 }} className="group/cell flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-green shadow-lg shadow-green/30 flex items-center justify-center transition-transform duration-300 group-hover/cell:scale-110">
                                        <Lock size={20} className="text-white" strokeWidth={2.3} />
                                    </div>
                                </div>
                                <div className="group/cell w-full lg:w-[320px] flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-green shadow-lg shadow-green/30 flex items-center justify-center transition-transform duration-300 group-hover/cell:scale-110">
                                        <Lock size={20} className="text-white" strokeWidth={2.3} />
                                    </div>
                                </div>
                            </button>
                        )}
                    </div>

                    {/* Last Visited Courses — 16:9 grid (up to 4) */}
                    {lastLessons.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-2xl font-black text-dark">{t("last_visited")}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {lastLessons.map((lesson: any) => {
                                    const prog = lesson.progress;
                                    const subjectTitle = lesson.subject?.title || '';
                                    const subjectImage = subjectTitle ? getSubjectImage(subjectTitle) : undefined;
                                    const totalResources = (lesson.coursesPdf?.length ?? 0) + (lesson.videos?.length ?? 0) + (lesson.exercices?.length ?? 0) + (lesson.exams?.length ?? 0) + (lesson.resourses?.length ?? 0);
                                    const completedCount = prog?.completedResources?.length ?? 0;
                                    const progressPct = totalResources > 0 ? Math.min(100, Math.round((completedCount / totalResources) * 100)) : 0;
                                    const lastDate = prog?.lastAccessed ? new Date(prog.lastAccessed).toLocaleDateString(locale, { month: 'short', day: 'numeric' }) : '';
                                    return (
                                        <Link
                                            key={prog.lessonId}
                                            href={(() => { const r = prog?.lastResourceId || prog?.completedResources?.[prog.completedResources.length - 1] || ''; const tp = prog?.lastResourceType || ''; const qs = r ? `?doc=${encodeURIComponent(r)}${tp ? `&type=${encodeURIComponent(tp)}` : ''}` : ''; return `/lesson/${lesson.slug || prog.lessonId}${qs}`; })()}
                                            className={`last-visited-card group${subjectImage ? '' : ' last-visited-card-fallback'}`}
                                            style={subjectImage ? { backgroundImage: `url('${subjectImage}')` } : undefined}
                                        >
                                            <div className="last-visited-card-scrim" />
                                            <div className="last-visited-card-top">
                                                <span className="last-visited-card-eyebrow">{t("continue_learning")}</span>
                                                <h3 className="last-visited-card-title">{lesson.title}</h3>
                                                {subjectTitle && <p className="last-visited-card-subject">{subjectTitle}</p>}
                                            </div>
                                            <div className="last-visited-card-bottom">
                                                {totalResources > 0 ? (
                                                    <div className="last-visited-card-progress">
                                                        <div className="last-visited-card-progress-track">
                                                            <div
                                                                className="last-visited-card-progress-fill"
                                                                style={{ width: `${progressPct}%` }}
                                                            />
                                                        </div>
                                                        <span className="last-visited-card-progress-label">{completedCount}/{totalResources}</span>
                                                    </div>
                                                ) : <span />}
                                                {lastDate && <span className="last-visited-card-date">{lastDate}</span>}
                                            </div>
                                            <div className="last-visited-card-arrow">
                                                <ChevronRight size={14} />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── Services Grid ── */}
                    <div className="space-y-4 pt-10 border-t border-green/8">
                        <div>
                            <h2 className="text-2xl font-black text-dark">{t("services_title")}</h2>
                            <p className="text-sm mt-1" style={{ color: 'rgba(26,58,42,0.4)' }}>{t("services_subtitle")}</p>
                        </div>

                        <div className="relative">
                        <div
                            className={`grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 ${isUnverified ? "pointer-events-none select-none" : ""}`}
                            style={isUnverified ? { filter: 'blur(4px)' } : undefined}
                            aria-hidden={isUnverified}
                        >

                            {/* 0. Class Chat */}
                            <Link
                                href="/profile/chat"
                                className="profile-svc-card"
                                style={{ backgroundImage: `url('${SERVICE_CARD_IMAGES.chatroom}')` }}
                            >
                                <div className="profile-svc-card-title-wrap">
                                    <h4 className="profile-svc-card-title">{t("chat_room")}</h4>
                                    <p className="profile-svc-card-subtitle">{t("chat_room_subtitle")}</p>
                                </div>
                                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse z-[3]" />
                                <div className="profile-svc-card-arrow">
                                    {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                                </div>
                            </Link>

                            {/* 1. Points System */}
                            <button
                                className="profile-svc-card"
                                style={{ backgroundImage: `url('${SERVICE_CARD_IMAGES.points}')` }}
                                onClick={() => { setShowRewardDialog(true); fetchMyRewardRequests(); }}
                            >
                                <div className="profile-svc-card-title-wrap">
                                    <h4 className="profile-svc-card-title">
                                        {(user?.points || 0).toLocaleString()}<span className="text-[11px] ml-1 opacity-90">{t("pts")}</span>
                                    </h4>
                                    <p className="profile-svc-card-subtitle">{t("points_system")}</p>
                                </div>
                                <div className="profile-svc-card-arrow">
                                    {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                                </div>
                            </button>

                            {/* Rankings */}
                            <Link
                                href="/rankings"
                                className="profile-svc-card"
                                style={{ backgroundImage: `url('${SERVICE_CARD_IMAGES.rankings}')` }}
                            >
                                <div className="profile-svc-card-title-wrap">
                                    <h4 className="profile-svc-card-title">{t("rankings")}</h4>
                                    <p className="profile-svc-card-subtitle">{t("rankings_subtitle")}</p>
                                </div>
                                <div className="profile-svc-card-arrow">
                                    {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                                </div>
                            </Link>

                            {/* 2. Calendar */}
                            <Link
                                href="/calendar"
                                className="profile-svc-card"
                                style={{ backgroundImage: `url('${SERVICE_CARD_IMAGES.calendar}')` }}
                            >
                                <div className="profile-svc-card-title-wrap">
                                    <h4 className="profile-svc-card-title">{t("calendar")}</h4>
                                    <p className="profile-svc-card-subtitle">{t("calendar_subtitle")}</p>
                                </div>
                                <div className="profile-svc-card-arrow">
                                    {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                                </div>
                            </Link>

                            {/* 3. Contributions Hub */}
                            <Link
                                href="/contributions"
                                className="profile-svc-card"
                                style={{ backgroundImage: `url('${SERVICE_CARD_IMAGES.contributions}')` }}
                            >
                                <div className="profile-svc-card-title-wrap">
                                    <h4 className="profile-svc-card-title">{t("contributions")}</h4>
                                    <p className="profile-svc-card-subtitle">{t("contributions_subtitle")}</p>
                                </div>
                                <div className="profile-svc-card-arrow">
                                    {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                                </div>
                            </Link>

                            {/* 4. Favorite Courses */}
                            <Link
                                href="/favorites/courses"
                                className="profile-svc-card"
                                style={{ backgroundImage: `url('${SERVICE_CARD_IMAGES.favorites}')` }}
                            >
                                <div className="profile-svc-card-title-wrap">
                                    <h4 className="profile-svc-card-title">{t("favorites")}</h4>
                                    <p className="profile-svc-card-subtitle">{t("favorites_subtitle")}</p>
                                </div>
                                <div className="profile-svc-card-arrow">
                                    {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                                </div>
                            </Link>

                            {/* 7. Saved News */}
                            <Link
                                href="/favorites/news"
                                className="profile-svc-card"
                                style={{ backgroundImage: `url('${SERVICE_CARD_IMAGES.savedNews}')` }}
                            >
                                <div className="profile-svc-card-title-wrap">
                                    <h4 className="profile-svc-card-title">{t("saved_news")}</h4>
                                    <p className="profile-svc-card-subtitle">{t("saved_news_subtitle")}</p>
                                </div>
                                <div className="profile-svc-card-arrow">
                                    {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                                </div>
                            </Link>

                            {/* 8. Grades Calculator */}
                            <Link
                                href="/grades-calculator"
                                className="profile-svc-card"
                                style={{ backgroundImage: `url('${SERVICE_CARD_IMAGES.gradesCalc}')` }}
                            >
                                <div className="profile-svc-card-title-wrap">
                                    <h4 className="profile-svc-card-title">{t("grades_calc")}</h4>
                                    <p className="profile-svc-card-subtitle">{t("grades_calc_subtitle")}</p>
                                </div>
                                <div className="profile-svc-card-arrow">
                                    {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                                </div>
                            </Link>

                            {/* 9. Invite Friends */}
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await import('@/lib/api').then(m => m.default.get('/user/affiliate-code'));
                                        const code = res.data.affiliateCode;
                                        const link = `${window.location.origin}/signup?ref=${code}`;
                                        await navigator.clipboard.writeText(link);
                                        showSnackbar(t('invite_link_copied'), "success");
                                    } catch {
                                        showSnackbar(t('invite_link_failed'), "error");
                                    }
                                }}
                                className="profile-svc-card"
                                style={{ backgroundImage: `url('${SERVICE_CARD_IMAGES.invite}')` }}
                            >
                                <div className="profile-svc-card-title-wrap">
                                    <h4 className="profile-svc-card-title">{t("invite_friends")}</h4>
                                    <p className="profile-svc-card-subtitle">{t("invite_friends_subtitle")}</p>
                                </div>
                                <div className="profile-svc-card-arrow">
                                    {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                                </div>
                            </button>

                            {/* 10. Share Udarsy */}
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({ title: 'Udarsy', text: t('share_app_text'), url: window.location.origin });
                                    } else {
                                        showSnackbar(t('sharing_not_supported'), "info");
                                    }
                                }}
                                className="profile-svc-card"
                                style={{ backgroundImage: `url('${SERVICE_CARD_IMAGES.share}')` }}
                            >
                                <div className="profile-svc-card-title-wrap">
                                    <h4 className="profile-svc-card-title">{t("share_app")}</h4>
                                    <p className="profile-svc-card-subtitle">{t("share_app_subtitle")}</p>
                                </div>
                                <div className="profile-svc-card-arrow">
                                    {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                                </div>
                            </button>

                            {/* 11. Report Issue */}
                            <Link
                                href="/report"
                                className="profile-svc-card"
                                style={{ backgroundImage: `url('${SERVICE_CARD_IMAGES.report}')` }}
                            >
                                <div className="profile-svc-card-title-wrap">
                                    <h4 className="profile-svc-card-title">{t("report_issue")}</h4>
                                    <p className="profile-svc-card-subtitle">{t("report_issue_subtitle")}</p>
                                </div>
                                <div className="profile-svc-card-arrow">
                                    {isAr ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                                </div>
                            </Link>

                        </div>
                        {isUnverified && (
                            <button
                                type="button"
                                onClick={() => triggerVerifyDialog()}
                                aria-label={ta("verify_required_title")}
                                className="absolute top-0 left-0 right-0 z-30 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3"
                            >
                                {Array.from({ length: 11 }).map((_, i) => (
                                    <div key={i} className="group/cell aspect-[16/9] flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-green shadow-lg shadow-green/30 flex items-center justify-center transition-transform duration-300 group-hover/cell:scale-110">
                                            <Lock size={20} className="text-white" strokeWidth={2.3} />
                                        </div>
                                    </div>
                                ))}
                            </button>
                        )}
                        </div>
                    </div>

                    {/* ── Udarsy Programs (separated section) ── */}
                    {user?.role !== 'admin' && <div className="pt-10 border-t border-green/8 space-y-4">
                        <div>
                            <h2 className="text-2xl font-black text-dark">{t("programs_title")}</h2>
                            <p className="text-sm mt-1" style={{ color: 'rgba(26,58,42,0.4)' }}>{t("programs_subtitle")}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Teacher Program */}
                            <div className="rounded-[10px] border border-indigo-100 bg-indigo-50/50 p-4 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                                        <MessageSquare size={20} className="text-indigo-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-dark text-sm">{t("program_teacher")}</h4>
                                        <p className="text-[11px] text-indigo-500 font-bold">{t("program_teacher_tagline")}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-dark/50 leading-relaxed">
                                    {t("program_teacher_desc")}
                                </p>
                                {user?.role === 'teacher' ? (
                                    <Link href="/teacher/dashboard" className="w-full py-2 bg-indigo-500 text-white font-bold rounded-xl text-xs text-center hover:bg-indigo-600 transition-colors">
                                        {t("go_to_dashboard")}
                                    </Link>
                                ) : profileCompletion < 100 ? (
                                    <div className="w-full py-2 bg-indigo-100 text-indigo-300 font-bold rounded-xl text-xs text-center cursor-not-allowed">
                                        {t("complete_profile_first", { percent: profileCompletion })}
                                    </div>
                                ) : (
                                    <Link href="/apply-teacher" className="w-full py-2 bg-indigo-100 text-indigo-600 font-bold rounded-xl text-xs text-center hover:bg-indigo-200 transition-colors">
                                        {t("apply_as_teacher")}
                                    </Link>
                                )}
                            </div>

                            {/* Instructor Program */}
                            <div className="rounded-[10px] border border-green/20 bg-green/5 p-4 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green/15 flex items-center justify-center shrink-0">
                                        <GraduationCap size={20} className="text-green" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-dark text-sm">{t("program_instructor")}</h4>
                                        <p className="text-[11px] text-green font-bold">{t("program_instructor_tagline")}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-dark/50 leading-relaxed">
                                    {t("program_instructor_desc")}
                                </p>
                                {user?.role === 'instructor' ? (
                                    <Link href="/instructor-dashboard" className="w-full py-2 bg-green text-white font-bold rounded-xl text-xs text-center hover:bg-green/90 transition-colors">
                                        {t("go_to_dashboard")}
                                    </Link>
                                ) : profileCompletion < 100 ? (
                                    <div className="w-full py-2 bg-green/10 text-green/40 font-bold rounded-xl text-xs text-center cursor-not-allowed">
                                        {t("complete_profile_first", { percent: profileCompletion })}
                                    </div>
                                ) : (
                                    <Link href="/apply-instructor" className="w-full py-2 bg-green/10 text-green font-bold rounded-xl text-xs text-center hover:bg-green/20 transition-colors">
                                        {t("apply_as_instructor")}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>}

                    {/* ── Inline Settings Panel ── */}
                    <AnimatePresence>
                        {settingsOpen && (
                            <motion.div
                                key="settings-panel"
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                                className="border-t border-green/8 pt-8 space-y-4"
                            >
                                <div>
                                    <h2 className="text-2xl font-black text-dark">{t("settings_title")}</h2>
                                    <p className="text-sm mt-1" style={{ color: 'rgba(26,58,42,0.4)' }}>{t("settings_subtitle")}</p>
                                </div>
                                <div className="rounded-[10px] border border-green/10 divide-y divide-green/8 overflow-hidden bg-white shadow-sm">
                                    {/* Notifications toggle */}
                                    <div className="flex items-center justify-between px-5 py-4">
                                        <div>
                                            <p className="text-sm font-bold text-dark">{t("notifications_setting")}</p>
                                            <p className="text-xs mt-0.5" style={{ color: 'rgba(26,58,42,0.4)' }}>{t("notifications_setting_desc")}</p>
                                        </div>
                                        <button
                                            disabled={savingSettings}
                                            onClick={() => saveSettings({ notifications: !localSettings.notifications })}
                                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${localSettings.notifications ? 'bg-green' : 'bg-dark/15'} disabled:opacity-50`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${localSettings.notifications ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                    {/* Theme selector */}
                                    <div className="px-5 py-4">
                                        <p className="text-sm font-bold text-dark mb-3">{t("theme")}</p>
                                        <div className="flex gap-2">
                                            {(['light', 'system', 'dark'] as const).map(themeKey => (
                                                <button
                                                    key={themeKey}
                                                    disabled={savingSettings}
                                                    onClick={() => saveSettings({ theme: themeKey })}
                                                    className={`flex-1 py-2 rounded-[12px] text-xs font-black capitalize transition-all border disabled:opacity-50 ${localSettings.theme === themeKey ? 'bg-green text-white border-green shadow-md shadow-green/20' : 'text-dark/50 border-green/15 hover:border-green/30'}`}
                                                >
                                                    {ts(themeKey)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    {/* Change password link */}
                                    <Link href="/settings/password" className="flex items-center justify-between px-5 py-4 hover:bg-green/3 transition-colors group">
                                        <div>
                                            <p className="text-sm font-bold text-dark">{t("change_password")}</p>
                                            <p className="text-xs mt-0.5" style={{ color: 'rgba(26,58,42,0.4)' }}>{t("change_password_desc")}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-green/30 group-hover:text-green transition-colors" />
                                    </Link>
                                    {/* Delete account link */}
                                    <Link href="/settings/delete-account" className="flex items-center justify-between px-5 py-4 hover:bg-red-50/50 transition-colors group">
                                        <div>
                                            <p className="text-sm font-bold text-red-500">{t("delete_account")}</p>
                                            <p className="text-xs mt-0.5 text-red-400/70">{t("delete_account_short_desc")}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-red-300 group-hover:text-red-500 transition-colors" />
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="pt-8 border-t border-green/6 flex flex-col items-center gap-4">
                        <div className="self-start flex items-center gap-2.5">
                            <h2 className="text-2xl font-black text-dark">{t("settings_privacy")}</h2>
                            <span className="inline-flex items-center justify-center min-w-[26px] h-[26px] px-2 rounded-full bg-green/10 text-green text-xs font-black tabular-nums">4</span>
                        </div>
                        <div className="flex flex-col items-stretch w-full max-w-xs gap-3">
                            <Link
                                href="/settings"
                                className="group flex items-center justify-center gap-2.5 px-7 py-2.5 rounded-full border bg-white font-bold text-sm transition-all"
                                style={{ borderColor: 'rgba(58,170,106,0.25)', color: 'rgba(58,170,106,0.85)' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(58,170,106,0.06)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(58,170,106,0.5)'; (e.currentTarget as HTMLAnchorElement).style.color = '#3aaa6a'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#fff'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(58,170,106,0.25)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(58,170,106,0.85)'; }}
                            >
                                <SettingsIcon size={15} className="transition-transform duration-300 group-hover:rotate-45" />
                                {t("settings")}
                            </Link>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setLangOpen(o => !o)}
                                    disabled={langPending}
                                    className="group flex items-center justify-center gap-2.5 px-7 py-2.5 rounded-full border bg-white font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={{ borderColor: 'rgba(58,170,106,0.25)', color: 'rgba(58,170,106,0.85)' }}
                                    onMouseEnter={e => { if (langPending) return; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(58,170,106,0.06)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(58,170,106,0.5)'; (e.currentTarget as HTMLButtonElement).style.color = '#3aaa6a'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(58,170,106,0.25)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(58,170,106,0.85)'; }}
                                >
                                    <Languages size={15} className="transition-transform duration-300 group-hover:scale-110" />
                                    {tc("change_language")}
                                    <ChevronDown size={14} className={`transition-transform duration-300 ${langOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence initial={false}>
                                    {langOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex flex-col gap-1.5 pt-1">
                                                {[
                                                    { code: 'en', label: 'English', flag: 'EN' },
                                                    { code: 'fr', label: 'Français', flag: 'FR' },
                                                    { code: 'ar', label: 'العربية', flag: 'AR' },
                                                ].map((lang) => {
                                                    const isActive = lang.code === locale;
                                                    return (
                                                        <button
                                                            key={lang.code}
                                                            disabled={langPending || isActive}
                                                            onClick={() => {
                                                                if (isActive) { setLangOpen(false); return; }
                                                                startLangTransition(async () => {
                                                                    await setUserLocaleAction(lang.code as Locale);
                                                                    window.location.reload();
                                                                });
                                                            }}
                                                            className="flex items-center justify-between gap-3 px-5 py-2 rounded-full border bg-white text-sm font-bold transition-all disabled:cursor-default"
                                                            style={{
                                                                borderColor: isActive ? 'rgba(58,170,106,0.5)' : 'rgba(58,170,106,0.18)',
                                                                color: isActive ? '#3aaa6a' : 'rgba(58,170,106,0.75)',
                                                                background: isActive ? 'rgba(58,170,106,0.06)' : '#fff',
                                                            }}
                                                        >
                                                            <span className="flex items-center gap-2.5">
                                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green/10 text-green text-[10px] font-black">{lang.flag}</span>
                                                                {lang.label}
                                                            </span>
                                                            {isActive && <CheckCircle size={14} className="text-green" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <button
                                onClick={handleResetAndChoosePath}
                                disabled={resettingPath}
                                className="group flex items-center justify-center gap-2.5 px-7 py-2.5 rounded-full border bg-white font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{ borderColor: 'rgba(58,170,106,0.25)', color: 'rgba(58,170,106,0.85)' }}
                                onMouseEnter={e => { if (resettingPath) return; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(58,170,106,0.06)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(58,170,106,0.5)'; (e.currentTarget as HTMLButtonElement).style.color = '#3aaa6a'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(58,170,106,0.25)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(58,170,106,0.85)'; }}
                                title={t("reset_path_title")}
                            >
                                <RefreshCw size={15} className={`${resettingPath ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform`} />
                                {resettingPath ? t("resetting") : t("reset_and_choose_path")}
                            </button>
                            <button
                                onClick={logout}
                                className="group flex items-center justify-center gap-2.5 px-7 py-2.5 rounded-full border bg-white font-bold text-sm transition-all"
                                style={{ borderColor: 'rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.7)' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.04)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.35)'; (e.currentTarget as HTMLButtonElement).style.color = '#ef4444'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.2)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(239,68,68,0.7)'; }}
                            >
                                <LogOut size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                                {tc("sign_out")}
                            </button>
                        </div>
                    </div>
                </div>
                </div>{/* end Student Profile Card wrapper */}
            </div>{/* end max-w-5xl */}

            <AnimatePresence>
                {isCropping && cropImage && (
                    <ImageCropper
                        image={cropImage}
                        onClose={() => setIsCropping(false)}
                        onCropSave={handleCropSave}
                    />
                )}
            </AnimatePresence>

            {/* Original photo preview modal */}
            <AnimatePresence>
                {previewOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setPreviewOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            className="relative max-w-lg w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={user?.photoURLOriginal || currentPhoto || ''}
                                alt={user?.displayName}
                                className="w-full rounded-3xl shadow-2xl object-contain"
                            />
                            <button
                                onClick={() => setPreviewOpen(false)}
                                className="absolute -top-3 -right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg text-dark hover:bg-red-50 hover:text-red-500 transition-all"
                            >
                                <X size={18} />
                            </button>
                            <div onClick={handleCameraClick} className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-green text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg cursor-pointer hover:bg-green/90 transition-all">
                                <Camera size={14} /> {t("change_photo")}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Points Reward Dialog */}
            <AnimatePresence>
                {showRewardDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
                        onClick={() => setShowRewardDialog(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 16 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 16 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="bg-white rounded-[28px] p-7 w-full max-w-md shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-[14px] flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.12)' }}>
                                        <Star size={22} className="fill-amber-400 text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-dark text-lg leading-tight">{t("reward_dialog_title")}</h3>
                                        <p className="text-[12px] text-dark/40 font-medium">{t("reward_dialog_subtitle")}</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowRewardDialog(false)} className="w-8 h-8 rounded-full bg-dark/5 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors">
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="rounded-[18px] p-4 mb-5" style={{ background: 'rgba(251,191,36,0.07)', border: '1.5px solid rgba(251,191,36,0.2)' }}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-bold text-dark/60">{t("your_points")}</span>
                                    <span className="text-2xl font-black text-amber-500">{(user?.points || 0).toLocaleString()} <span className="text-sm">{t("pts")}</span></span>
                                </div>
                                <div className="h-2 rounded-full bg-amber-100 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all"
                                        style={{ width: `${Math.min(100, ((user?.points || 0) / 10000) * 100)}%` }}
                                    />
                                </div>
                                <p className="text-[11px] text-dark/40 mt-1.5 font-medium">{t("pts_until_eligibility", { count: Math.max(0, 10000 - (user?.points || 0)).toLocaleString() })}</p>
                            </div>

                            <div className="space-y-2.5 mb-5">
                                <p className="text-xs font-black text-dark/40 uppercase tracking-widest">{t("how_to_earn")}</p>
                                {[
                                    { icon: '📄', text: t("earn_open_resource"), pts: t("earn_open_pts") },
                                    { icon: '✅', text: t("earn_complete_resource"), pts: t("earn_complete_pts") },
                                    { icon: '🤝', text: t("earn_contribution"), pts: t("earn_contribution_pts") },
                                    { icon: '📅', text: t("earn_daily_login"), pts: t("earn_login_pts") },
                                ].map(({ icon, text, pts }) => (
                                    <div key={text} className="flex items-center justify-between py-2 px-3 rounded-[12px]" style={{ background: 'rgba(58,170,106,0.04)' }}>
                                        <span className="text-sm text-dark/70 font-medium flex items-center gap-2"><span>{icon}</span>{text}</span>
                                        <span className="text-xs font-black text-green">{pts}</span>
                                    </div>
                                ))}
                            </div>

                            {myRewardRequests.length > 0 && (
                                <div className="mb-4 rounded-[14px] p-3" style={{ background: 'rgba(58,170,106,0.05)', border: '1px solid rgba(58,170,106,0.12)' }}>
                                    <p className="text-[11px] font-black text-dark/40 uppercase tracking-widest mb-2">{t("your_requests")}</p>
                                    {myRewardRequests.slice(0, 2).map((r: any) => (
                                        <div key={r._id} className="flex items-center justify-between text-sm py-1">
                                            <span className="text-dark/60 font-medium">{new Date(r.createdAt).toLocaleDateString()}</span>
                                            <span className={`text-xs font-black px-2 py-0.5 rounded-full ${r.status === 'approved' ? 'bg-green/10 text-green' : r.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                                                {r.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={handleRequestReward}
                                disabled={rewardRequesting || (user?.points || 0) < 10000 || myRewardRequests.some((r: any) => r.status === 'pending')}
                                className="w-full py-3.5 rounded-[16px] font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                style={(user?.points || 0) >= 10000 && !myRewardRequests.some((r: any) => r.status === 'pending')
                                    ? { background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff', boxShadow: '0 8px 24px rgba(245,158,11,0.3)' }
                                    : { background: 'rgba(0,0,0,0.05)', color: 'rgba(0,0,0,0.3)' }
                                }
                            >
                                {rewardRequesting ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />}
                                {myRewardRequests.some((r: any) => r.status === 'pending')
                                    ? t("request_pending")
                                    : (user?.points || 0) >= 10000
                                        ? t("request_pro")
                                        : t("need_more_pts", { count: (10000 - (user?.points || 0)).toLocaleString() })
                                }
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
