"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, School, Info, Database, ArrowLeft, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { getSchoolServices } from "@/services/services";
import { useLocale } from "next-intl";

export default function ServicesPage() {
    const locale = useLocale();
    const isAr = locale === 'ar';
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await getSchoolServices();
            setServices(data);
            setLoading(false);
        };
        load();
    }, []);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'calendar_today': return <Calendar size={22} />;
            case 'school':         return <School   size={22} />;
            case 'info':           return <Info     size={22} />;
            default:               return <Database size={22} />;
        }
    };

    return (
        <div className="min-h-screen bg-white pb-20 md:pt-32" dir={isAr ? "rtl" : "ltr"}>
            <div className="max-w-5xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-14">
                    <div className="space-y-2 text-center md:text-start">
                        <div className="flex items-center justify-center md:justify-start gap-3 text-green mb-3">
                            <div className="svc-icon" style={{ background: 'rgba(58,170,106,0.10)', color: '#3aaa6a' }}>
                                <LayoutGrid size={22} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-green/60">Official Hub</span>
                        </div>
                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-dark">Services &amp; Info</h1>
                        <p className="text-dark/40 text-sm">Official educational resources and school information for Morocco.</p>
                    </div>
                    <Link
                        href="/profile"
                        className={`hidden md:flex btn-back ${isAr ? "rtl" : ""}`}
                    >
                        <ArrowLeft size={14} className={`btn-back-arrow ${isAr ? "rotate-180" : ""}`} />
                        Back to Profile
                    </Link>
                </div>

                {/* Loading skeletons */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {[1, 2, 3, 4].map(i => (
                            <div
                                key={i}
                                className="h-[88px] rounded-[18px] animate-pulse"
                                style={{ background: '#f3f4f3', border: '1.5px solid rgba(58,170,106,0.08)' }}
                            />
                        ))}
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {services.map((service, i) => (
                            <motion.div
                                key={service._id}
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Link href={`/services/${service._id}`} className="svc-card" style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <div className="svc-icon" style={{ background: 'rgba(58,170,106,0.10)', color: '#3aaa6a', flexShrink: 0 }}>
                                        {getIcon(service.icon)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {service.category && (
                                            <span className="inline-block mb-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest"
                                                style={{ background: 'rgba(58,170,106,0.07)', color: 'rgba(58,170,106,0.75)' }}>
                                                {service.category}
                                            </span>
                                        )}
                                        <h3 className="text-sm font-bold text-dark truncate">{service.title}</h3>
                                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'rgba(26,58,42,0.38)' }}>{service.description}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center rounded-[18px] border border-dashed" style={{ background: 'rgba(58,170,106,0.04)', borderColor: 'rgba(58,170,106,0.2)' }}>
                        <div className="w-16 h-16 rounded-[14px] mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(58,170,106,0.10)' }}>
                            <Database size={22} className="text-green" />
                        </div>
                        <h3 className="text-lg font-bold text-dark mb-1">No services available</h3>
                        <p className="text-sm" style={{ color: 'rgba(26,58,42,0.4)' }}>Check back later for new updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
