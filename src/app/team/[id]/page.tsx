"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronLeft, Mail, ExternalLink, GraduationCap, Award, Briefcase } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const teamData = [
    {
        id: "ibrahim-maghfoul",
        name: "Ibrahim Maghfoul",
        role: "Website Manager",
        initials: "IM",
        color: "bg-green",
        bio: "Ibrahim is the visionary behind Udarsy platform. He ensures that every component is seamlessly integrated, and the user experience is world-class. With his profound knowledge in platform architecture and digital strategy, he has scaled Udarsy to reach thousands of learners."
    },
    {
        id: "abderrahman-aouinat",
        name: "Abderrahman Aouinat",
        role: "Multimedia Responsable",
        initials: "AA",
        color: "bg-blue-500",
        bio: "Abderrahman handles all things visual and interactive. From video production to interactive media, he ensures that the content provided is engaging and retains high production value, transforming complex topics into visually accessible learning experiences."
    },
    {
        id: "mouhamed-demo",
        name: "Mouhamed Demo",
        role: "Marketing Manager",
        initials: "MD",
        color: "bg-amber-500",
        bio: "Mouhamed is the engine behind our growth. His strategic vision and marketing expertise have been crucial in expanding our user base. He focuses on data-driven marketing, brand building, and reaching students who need Udarsy the most."
    },
    {
        id: "ayman-nouri",
        name: "Ayman Nouri",
        role: "Developer",
        initials: "AN",
        color: "bg-purple-500",
        bio: "Ayman is the core architect of our technical solutions. He writes the code that powers Udarsy, ensuring that the platform is robust, fast, and scalable. He is passionate about modern web technologies and optimizing performance."
    },
    {
        id: "asmae-monaghim",
        name: "Asmae Monaghim",
        role: "Finance Manager",
        initials: "AM",
        color: "bg-red-500",
        bio: "Asmae is responsible for the financial health of the project. She oversees budgeting, financial planning, and resource allocation. Her meticulous attention to detail ensures that the company remains on a strong, sustainable trajectory."
    },
    {
        id: "safae-el-oujdi",
        name: "Safae El Oujdi",
        role: "Logistic",
        initials: "SO",
        color: "bg-cyan-500",
        bio: "Safae ensures the smooth operation of all behind-the-scenes activities. Her logistical expertise helps streamline internal processes and operations, making sure the team has everything they need to execute their goals efficiently."
    }
];

export default function TeamMemberPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const t = useTranslations('Common');

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
                    <div className={`w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-[2rem] flex items-center justify-center text-white text-3xl md:text-5xl lg:text-7xl font-black shadow-2xl ${member.color}`}>
                        {member.initials}
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
