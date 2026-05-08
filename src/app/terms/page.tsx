"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Scale, Cookie, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT } from "@/lib/constants";

const LAST_UPDATED = "May 8, 2026";

const sections = [
  {
    title: "Acceptance of Terms",
    paragraphs: [
      "By accessing or using the Udarsy platform, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use the service.",
      "These terms apply to all users including students, teachers, instructors, and visitors. Use of the service by minors under 13 requires verifiable parental or guardian consent.",
    ],
    bullets: null as string[] | null,
  },
  {
    title: "User Accounts",
    paragraphs: [
      "You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Notify us immediately of any unauthorized access.",
      "We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a risk to other users.",
    ],
    bullets: null,
  },
  {
    title: "Subscription Plans & Payments",
    paragraphs: [
      "Udarsy offers three subscription tiers priced in Moroccan Dirhams (MAD). All prices include applicable taxes.",
    ],
    bullets: [
      "Free Plan (0 MAD) — basic lessons, 10 offline downloads per month",
      "Pro Plan — 199 MAD/month or 1,910 MAD/year — premium lessons, ad-free experience, 100 downloads",
      "Premium Plan — 299 MAD/month or 2,870 MAD/year — full access, unlimited downloads, priority support",
    ],
  },
  {
    title: "Refund Policy",
    paragraphs: [
      "Subscription fees are generally non-refundable. Exceptions apply where required by Moroccan consumer protection law (Law No. 31-08). If you believe you are entitled to a refund, contact our support team within 7 days of the charge.",
      "Udarsy reserves the right to issue refunds or credits at its sole discretion for service interruptions or billing errors.",
    ],
    bullets: null,
  },
  {
    title: "Content & Intellectual Property",
    paragraphs: [
      "All platform content — lessons, videos, PDFs, exercises, and exams — is owned by Udarsy or licensed from content partners. Unauthorized reproduction, redistribution, or public display is strictly prohibited.",
      "User-submitted contributions remain the intellectual property of the contributor. By submitting content you grant Udarsy a worldwide, non-exclusive, royalty-free license to display and distribute that content on the platform.",
    ],
    bullets: null,
  },
  {
    title: "Acceptable Use",
    paragraphs: ["By using Udarsy you agree not to:"],
    bullets: [
      "Violate any applicable Moroccan law or regulation",
      "Upload content that is harmful, defamatory, obscene, or infringes third-party rights",
      "Attempt unauthorized access to any part of the platform or its infrastructure",
      "Use automated tools to scrape or harvest platform content",
      "Impersonate another user, teacher, instructor, or Udarsy staff member",
      "Share or sell account credentials to circumvent subscription restrictions",
    ],
  },
  {
    title: "Teacher & Instructor Obligations",
    paragraphs: [
      "Teachers and instructors must provide accurate, truthful information during the application and verification process. Submitting false credentials is grounds for immediate termination and may be reported to relevant Moroccan authorities.",
      "Teachers are solely responsible for the accuracy and appropriateness of educational content shared within their classroom rooms.",
    ],
    bullets: null,
  },
  {
    title: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by Moroccan law, Udarsy and its affiliates shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.",
      "Our total liability for any claim arising from these terms shall not exceed the total fees you paid Udarsy during the 12 months preceding the claim.",
    ],
    bullets: null,
  },
  {
    title: "Changes to These Terms",
    paragraphs: [
      "We may update these Terms of Service periodically. We will notify users of significant changes via email or a prominent notice on the platform at least 14 days before they take effect.",
      "Continued use of the platform after changes take effect constitutes acceptance of the revised terms.",
    ],
    bullets: null,
  },
  {
    title: "Governing Law",
    paragraphs: [
      "These Terms are governed by the laws of the Kingdom of Morocco. Any disputes arising from or relating to these Terms shall be resolved in the competent courts of Rabat, Morocco.",
      "We encourage users to contact our support team before initiating any legal proceedings — most issues can be resolved quickly and amicably.",
    ],
    bullets: null,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#e4e8e3] pt-20 md:pt-32 pb-24 px-[clamp(16px,6vw,80px)]">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14 space-y-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3aaa6a]/10 text-[#3aaa6a] text-xs font-black tracking-widest uppercase">
            <Scale size={14} />
            Legal
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[#1a3a2a]">
            Terms of Service
          </h1>
          <p className="text-[#1a3a2a]/50 text-sm">Last updated: {LAST_UPDATED}</p>
          <div
            className="max-w-2xl mx-auto text-left p-6 rounded-[24px]"
            style={{
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.35)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
            }}
          >
            <p className="text-sm text-[#1a3a2a]/65 leading-relaxed">
              These Terms of Service outline the rules and regulations for using the Udarsy
              educational platform. Please read them carefully before creating an account or
              accessing any content.
            </p>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-5">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.025, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="relative overflow-hidden rounded-[18px] bg-white group"
                style={{
                  border: "1.5px solid rgba(58,170,106,0.11)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)",
                  transition: "border-color 0.28s ease, box-shadow 0.28s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(58,170,106,0.35)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 28px rgba(58,170,106,0.14), 0 3px 10px rgba(58,170,106,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(58,170,106,0.11)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)";
                }}
              >
                {/* Top accent bar — fills from both sides meeting at center */}
                <div
                  className="absolute top-0 left-0 w-1/2 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[350ms]"
                  style={{
                    background: "linear-gradient(90deg, #3aaa6a, #5dc98a)",
                    transitionTimingFunction: "cubic-bezier(0.34,1.2,0.64,1)",
                  }}
                />
                <div
                  className="absolute top-0 right-0 w-1/2 h-[3px] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-[350ms]"
                  style={{
                    background: "linear-gradient(90deg, #5dc98a, #3aaa6a)",
                    transitionTimingFunction: "cubic-bezier(0.34,1.2,0.64,1)",
                  }}
                />

                <div className="p-7 md:p-8 space-y-4">
                  <div className="flex items-start gap-4">
                    <span
                      className="w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-sm font-black text-[#3aaa6a]"
                      style={{ background: "rgba(58,170,106,0.10)" }}
                    >
                      {i + 1}
                    </span>
                    <h2 className="text-lg md:text-xl font-black text-[#1a3a2a] leading-tight mt-1">
                      {section.title}
                    </h2>
                  </div>

                  <div className="pl-[52px] space-y-3">
                    {section.paragraphs.map((p, pi) => (
                      <p key={pi} className="text-sm text-[#1a3a2a]/65 leading-relaxed">
                        {p}
                      </p>
                    ))}
                    {section.bullets && (
                      <ul className="space-y-2 mt-1">
                        {section.bullets.map((b, bi) => (
                          <li key={bi} className="flex items-start gap-2.5 text-sm text-[#1a3a2a]/65">
                            <span
                              className="mt-[5px] w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ background: "#3aaa6a" }}
                            />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="mt-5 rounded-[18px] p-7 md:p-8"
          style={{
            background: "rgba(58,170,106,0.05)",
            border: "1.5px solid rgba(58,170,106,0.15)",
          }}
        >
          <p className="text-xs font-black uppercase tracking-widest text-[#3aaa6a] mb-4">
            Contact Us
          </p>
          <div className="space-y-3">
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-3 text-sm text-[#1a3a2a]/70 hover:text-[#3aaa6a] transition-colors"
            >
              <Mail size={15} className="shrink-0 text-[#3aaa6a]" />
              {CONTACT.email}
            </a>
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="flex items-center gap-3 text-sm text-[#1a3a2a]/70 hover:text-[#3aaa6a] transition-colors"
            >
              <Phone size={15} className="shrink-0 text-[#3aaa6a]" />
              {CONTACT.phone}
            </a>
            <div className="flex items-center gap-3 text-sm text-[#1a3a2a]/70">
              <MapPin size={15} className="shrink-0 text-[#3aaa6a]" />
              {CONTACT.location}
            </div>
          </div>
        </motion.div>

        {/* Related policies */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-[18px] p-6 bg-white"
          style={{
            border: "1.5px solid rgba(58,170,106,0.11)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <p className="text-sm text-[#1a3a2a]/60">Also read our other legal documents:</p>
          <Link
            href="/cookies"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#3aaa6a] transition-all hover:bg-[#3aaa6a]/10"
            style={{
              background: "rgba(58,170,106,0.07)",
              border: "1.5px solid rgba(58,170,106,0.18)",
            }}
          >
            <Cookie size={14} />
            Cookie Policy
          </Link>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="mt-8 rounded-[24px] p-8 text-center overflow-hidden relative"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 8px), linear-gradient(135deg, #1e7a46 0%, #0f4428 100%)",
          }}
        >
          <p className="text-white/70 text-sm mb-2">Have a question about our terms?</p>
          <h3 className="text-white font-black text-xl mb-5">We&apos;re here to help.</h3>
          <Link
            href="/contact"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.04em",
              color: "#1a6b3a",
              background: "#ffffff",
              borderRadius: "999px",
              padding: "7px 18px",
              border: "none",
              boxShadow: "0 2px 10px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.08)",
              textDecoration: "none",
            }}
          >
            Contact Support
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
