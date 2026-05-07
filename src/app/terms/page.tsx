"use client";

import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import { useTranslations } from "next-intl";

const sections = [
    {
        title: "1. Acceptance of Terms",
        content: `By accessing or using the Udarsy platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.`,
    },
    {
        title: "2. User Accounts",
        content: `You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. We cannot and will not be liable for any loss or damage arising from your failure to comply with these security requirements.`,
    },
    {
        title: "3. Content and Intellectual Property",
        content: `The service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Udarsy and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Udarsy.`,
    },
    {
        title: "4. User Conduct",
        content: `You agree not to use the platform in any way that causes, or may cause, damage to the platform or impairment of the availability or accessibility of Udarsy; or in any way which is unlawful, illegal, fraudulent, or harmful.`,
    },
    {
        title: "5. Termination",
        content: `We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.`,
    },
    {
        title: "6. Limitation of Liability",
        content: `In no event shall Udarsy, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.`,
    },
    {
        title: "7. Changes to Terms",
        content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our service after any revisions become effective, you agree to be bound by the revised terms.`,
    },
    {
        title: "8. Contact Us",
        content: `If you have any questions about these Terms, please contact us:
        
Email: support@udarsy.io
Address: Algiers, Algeria`,
    },
];

export default function TermsPage() {
    // If you have a specific translation namespace for terms, you would use it here.
    // For now we'll fall back to English for the hardcoded text if translations aren't found.
    // const t = useTranslations('Terms');

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
                        <Scale size={16} />
                        Legal
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-[#1a3a2a]">Terms of Service</h1>
                    <p className="text-muted-foreground text-sm">Last Updated: February 25, 2025</p>
                    <div className="max-w-2xl mx-auto bg-white/50 backdrop-blur-[12px] border border-white/30 rounded-[24px] p-6 text-left shadow-[0_20px_60px_rgba(0,0,0,0.08),_0_4px_16px_rgba(0,0,0,0.04)]">
                        <p className="text-sm text-[#1a3a2a]/70 leading-relaxed">
                            These Terms of Service outline the rules and regulations for the use of Udarsy's website and platform.
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
                    <p className="text-[#1a3a2a]/60 text-sm">Have a question about our terms?</p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-5 py-2 bg-[#3aaa6a] text-white font-bold rounded-xl hover:bg-[#3aaa6a]/90 transition-colors shadow-lg shadow-[#3aaa6a]/20"
                    >
                        Contact Support
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
