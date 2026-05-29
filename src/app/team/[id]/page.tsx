"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Mail } from "lucide-react";

// Must stay in sync with src/app/team/[id]/layout.tsx (metadata + JSON-LD)
// and the team grid on src/app/about/page.tsx.
const teamData = [
    {
        id: "ibrahim-maghfoul",
        name: "Ibrahim Maghfoul",
        role: "Website Manager",
        initials: "IM",
        color: "bg-green",
        img: "/team/ibrahim-maghfoul.webp",
        bio: "Ibrahim is the visionary behind Udarsy. He leads platform architecture and digital strategy, scaling Morocco's freemium learning platform to reach tens of thousands of students."
    },
    {
        id: "abderrahman-aouinat",
        name: "Abderrahman Aouinat",
        role: "Multimedia Responsable",
        initials: "AA",
        color: "bg-blue-500",
        img: "/team/abderrahman-aouinat.webp",
        bio: "Abderrahman directs Udarsy's video production and interactive media. He turns complex Moroccan curriculum topics into engaging, visual learning experiences for students at every level."
    },
    {
        id: "abdelhakim-taouqi",
        name: "Abdelhakim Taouqi",
        role: "Marketing Manager",
        initials: "AT",
        color: "bg-amber-500",
        img: "/team/abdelhakim-taouqi.webp",
        bio: "Abdelhakim drives Udarsy's growth across Morocco. He combines data-driven marketing with strong brand building, reaching the students who need Udarsy most as they prepare for BAC and Brevet."
    },
    {
        id: "mouhamed-el-wardi",
        name: "Mouhamed El Wardi",
        role: "Developer",
        initials: "MW",
        color: "bg-purple-500",
        img: "/team/mouhamed-el-wardi.webp",
        bio: "Mouhamed builds and maintains the technical foundations of Udarsy. From the lesson platform to the mobile apps, he ensures the systems keeping thousands of Moroccan students learning every day are robust, fast, and scalable."
    },
    {
        id: "asmae-monaghim",
        name: "Asmae Monaghim",
        role: "Finance Manager",
        initials: "AM",
        color: "bg-red-500",
        img: "/team/asmae-monaghim.webp",
        bio: "Asmae oversees the financial health of Udarsy. She manages budgeting, planning, and resource allocation with the meticulous attention to detail that keeps the platform on a sustainable trajectory."
    },
    {
        id: "safae-el-oujdi",
        name: "Safae El Oujdi",
        role: "Logistic",
        initials: "SO",
        color: "bg-cyan-500",
        img: "/team/safae-el-oujdi.webp",
        bio: "Safae runs Udarsy's day-to-day operations. Her logistical expertise streamlines internal processes and coordinates between teams, suppliers, and partners across the Kingdom."
    }
];

export default function TeamMemberPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const member = teamData.find(m => m.id === id);

    if (!member) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
                <div className="text-center">
                    <h1 className="text-2xl md:text-4xl font-bold text-dark">Member Not Found</h1>
                    <button onClick={() => router.push('/about')} className="mt-4 px-6 py-3 bg-green text-white rounded-xl font-bold">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-24 md:pt-32 pb-16 px-[clamp(20px,6vw,80px)] overflow-hidden">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => router.push('/about')} className="flex items-center gap-2 text-dark/50 hover:text-green transition-colors font-bold mb-8">
                    <ChevronLeft size={20} /> Back to About
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row gap-10 items-start"
                >
                    <div className={`w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-[2rem] overflow-hidden shadow-2xl ${member.img ? "" : `flex items-center justify-center text-white text-3xl md:text-5xl lg:text-7xl font-black ${member.color}`}`}>
                        {member.img ? (
                            <img
                                src={member.img}
                                alt={member.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            member.initials
                        )}
                    </div>

                    <div className="space-y-6 flex-1">
                        <div>
                            <p className="text-green font-bold text-sm tracking-widest uppercase mb-1">{member.role}</p>
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-dark tracking-tight">{member.name}</h1>
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {member.bio}
                        </p>

                        <div className="flex gap-4 pt-4 border-t border-green/10">
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green/10 text-green font-bold hover:bg-green hover:text-white transition-colors">
                                <Mail size={18} /> Contact
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
