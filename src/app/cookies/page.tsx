"use client";

import { motion } from "framer-motion";
import { Cookie } from "lucide-react";

const sections = [
    {
        title: "1. What are Cookies?",
        content: `Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third party to recognize you and make your next visit easier and the Service more useful to you.`,
    },
    {
        title: "2. How We Use Cookies",
        content: `When you use and access the platform, we may place a number of cookies files in your web browser. We use cookies for the following purposes:
• To enable certain functions of the platform (Essential Cookies)
• To provide analytics and understand user behavior
• To store your preferences and personalize content
• To enable ad delivery and behavioral advertising (where applicable)`,
    },
    {
        title: "3. Types of Cookies We Use",
        content: `• Essential Cookies: We may use essential cookies to authenticate users and prevent fraudulent use of user accounts.
• Preference Cookies: These are used to remember your preferences and various settings.
• Analytics Cookies: We use these to track information on how the platform is used so that we can make improvements.`,
    },
    {
        title: "4. Third-Party Cookies",
        content: `In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the platform, deliver advertisements on and through the Service, and so on.`,
    },
    {
        title: "5. Your Choices Regarding Cookies",
        content: `If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser. Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.`,
    },
    {
        title: "6. More Information",
        content: `If you are looking for more information about cookies, you can visit third-party information websites such as AllAboutCookies.org.`,
    },
];

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-[#e4e8e3] md:pt-32 pb-20 px-[clamp(20px,6vw,80px)]">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16 space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/10 text-[#3aaa6a] text-sm font-bold">
                        <Cookie size={16} />
                        Legal
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-[#1a3a2a]">Cookie Policy</h1>
                    <p className="text-muted-foreground text-sm">Last Updated: February 25, 2025</p>
                    <div className="max-w-2xl mx-auto bg-white/50 backdrop-blur-[12px] border border-white/30 rounded-[24px] p-6 text-left shadow-[0_20px_60px_rgba(0,0,0,0.08),_0_4px_16px_rgba(0,0,0,0.04)]">
                        <p className="text-sm text-[#1a3a2a]/70 leading-relaxed">
                            This Cookie Policy explains what cookies are and how we use them on the Udarsy platform.
                        </p>
                    </div>
                </motion.div>

                {/* Sections */}
                <div className="space-y-8">
                    {sections.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.03 }}
                            className="group"
                        >
                            <div className="bg-white rounded-[18px] border-[1.5px] border-[#3aaa6a]/11 p-8 hover:border-[#3aaa6a]/35 hover:shadow-[0_10px_28px_rgba(58,170,106,0.14),_0_3px_10px_rgba(58,170,106,0.08)] transition-all duration-300 space-y-4 relative overflow-hidden">
                                <h2 className="text-2xl font-black text-[#1a3a2a] flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-xl bg-[#3aaa6a]/10 text-[#3aaa6a] text-sm font-black flex items-center justify-center shrink-0">
                                        {i + 1}
                                    </span>
                                    {section.title.replace(/^\d+\.\s/, '')}
                                </h2>
                                <p className="text-[#1a3a2a]/65 leading-relaxed whitespace-pre-line text-sm">
                                    {section.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center space-y-4"
                >
                    <p className="text-[#1a3a2a]/60 text-sm">Still have questions?</p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-5 py-2 bg-[#3aaa6a] text-white font-bold rounded-xl hover:bg-[#3aaa6a]/90 transition-colors shadow-lg shadow-[#3aaa6a]/20"
                    >
                        Contact Us
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
