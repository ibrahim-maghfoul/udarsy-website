"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Cookie, Scale, Mail, Phone, MapPin } from "lucide-react";
import { CONTACT } from "@/lib/constants";

const LAST_UPDATED = "May 8, 2026";

const sections = [
  {
    title: "Information We Collect",
    paragraphs: [
      "We collect information you provide directly when you create an account: your display name, email address, and profile photo. When you sign in with Google, we receive only the basic profile data you have authorized — your name, email address, and profile picture. We do not access your Google Drive, Gmail, contacts, or any other Google services beyond the profile scope.",
      "We also collect information about how you use the platform: lessons accessed, time spent learning, quiz results, progress milestones, favorite content, and contributions submitted.",
      "We may automatically collect technical data such as your IP address, browser type, device type, operating system, and general usage patterns through cookies and similar technologies.",
    ],
    bullets: null as string[] | null,
  },
  {
    title: "How We Use Your Information",
    paragraphs: ["We use the information we collect solely to:"],
    bullets: [
      "Create and maintain your account and authenticate your identity",
      "Deliver, operate, and continuously improve the Udarsy learning platform",
      "Personalize your learning experience, recommendations, and curriculum path",
      "Track your academic progress, streaks, and completed lessons",
      "Send important service communications — account confirmations, security alerts, and product updates",
      "Process and manage your subscription plan (Free, Pro, or Premium)",
      "Enforce our Terms of Service and protect the safety of all users",
      "Comply with applicable Moroccan law and legal obligations",
    ],
  },
  {
    title: "Google API Services",
    paragraphs: [
      "Udarsy uses Google OAuth 2.0 solely for account authentication. When you choose 'Sign in with Google', we request only the minimum scopes necessary: your name, email address, and profile picture.",
      "We do not use your Google data for any purpose beyond signing you in and populating your profile. We do not share, sell, or transfer any Google user data to third parties. Google user data is not used for advertising, profiling, or any purpose not disclosed in this Privacy Policy.",
      "Udarsy's use of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.",
    ],
    bullets: null,
  },
  {
    title: "Sharing Your Information",
    paragraphs: [
      "We do not sell, rent, or trade your personal information to any third party under any circumstances.",
      "We may share your data only in the following limited situations:",
    ],
    bullets: [
      "With infrastructure service providers (hosting, database) who process data on our behalf and are bound by strict data processing agreements",
      "With law enforcement or government authorities when required by Moroccan law or a valid legal request",
      "With your explicit consent, for any purpose you specifically authorize",
    ],
  },
  {
    title: "Data Retention",
    paragraphs: [
      "We retain your personal data for as long as your account is active or as needed to provide the service. If you delete your account, your personal data will be permanently removed within 30 days, except where retention is required by Moroccan law (e.g., financial transaction records).",
      "Anonymized and aggregated usage statistics — which cannot be linked back to you — may be retained indefinitely for platform improvement purposes.",
    ],
    bullets: null,
  },
  {
    title: "Security",
    paragraphs: [
      "We implement industry-standard technical and organizational measures to protect your personal information:",
    ],
    bullets: [
      "HTTPS/TLS encryption for all data in transit",
      "bcrypt hashing for password storage — we never store plaintext passwords",
      "JWT-based access and refresh token authentication with short expiry windows",
      "Strict role-based access controls limiting who can access user data internally",
      "Regular security reviews and dependency audits",
    ],
  },
  {
    title: "Children's Privacy",
    paragraphs: [
      "Udarsy is an educational platform designed for Moroccan students including secondary school and BAC-prep students. We take children's privacy seriously.",
      "For users under the age of 13, we require verifiable parental or guardian consent before collecting any personal information. If we become aware that we have collected data from a child under 13 without such consent, we will delete it promptly. Parents may contact us at the address below to request deletion.",
    ],
    bullets: null,
  },
  {
    title: "Your Rights",
    paragraphs: [
      "In accordance with Moroccan data protection law (Law No. 09-08) and international best practices, you have the following rights regarding your personal data:",
    ],
    bullets: [
      "Access — request a copy of all personal data we hold about you",
      "Correction — request correction of any inaccurate or incomplete data",
      "Deletion — request permanent deletion of your account and associated data",
      "Objection — object to the processing of your data for specific purposes",
      "Portability — receive your data in a structured, machine-readable format",
      "Withdraw consent — revoke Google OAuth access at any time via your Google account settings",
    ],
  },
  {
    title: "Cookies",
    paragraphs: [
      "We use cookies to keep you signed in, remember your language and preferences, and analyze how the platform is used. We do not use advertising or tracking cookies.",
      "For a full breakdown of every cookie type we use and how to manage them, please read our Cookie Policy.",
    ],
    bullets: null,
  },
  {
    title: "Changes to This Policy",
    paragraphs: [
      "We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on the platform at least 14 days before they take effect.",
      "The 'Last Updated' date at the top of this page always reflects the most recent revision. Continued use of the platform after changes take effect constitutes acceptance of the updated policy.",
    ],
    bullets: null,
  },
];

export default function PrivacyPage() {
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
            <Shield size={14} />
            Legal
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[#1a3a2a]">
            Privacy Policy
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
              This Privacy Policy explains how Udarsy collects, uses, and protects your
              personal information. We are committed to handling your data transparently and
              in accordance with Moroccan data protection law (Law No. 09-08) and
              international best practices.
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
                {/* Contour accent — fills from both sides meeting at center */}
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
            Privacy Inquiries
          </p>
          <p className="text-sm text-[#1a3a2a]/60 mb-4 leading-relaxed">
            To exercise any of your rights, request data deletion, or ask questions about
            how we handle your personal information, contact us at:
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
          <p className="text-xs text-[#1a3a2a]/40 mt-4">
            We aim to respond to all privacy-related inquiries within 5 business days.
          </p>
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
          <div className="flex items-center gap-3">
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#3aaa6a] hover:bg-[#3aaa6a]/10 transition-colors"
              style={{
                background: "rgba(58,170,106,0.07)",
                border: "1.5px solid rgba(58,170,106,0.18)",
              }}
            >
              <Scale size={14} />
              Terms
            </Link>
            <Link
              href="/cookies"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#3aaa6a] hover:bg-[#3aaa6a]/10 transition-colors"
              style={{
                background: "rgba(58,170,106,0.07)",
                border: "1.5px solid rgba(58,170,106,0.18)",
              }}
            >
              <Cookie size={14} />
              Cookies
            </Link>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="mt-5 rounded-[24px] p-8 text-center overflow-hidden relative"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 8px), linear-gradient(135deg, #1e7a46 0%, #0f4428 100%)",
          }}
        >
          <p className="text-white/70 text-sm mb-2">Have a question about your data?</p>
          <h3 className="text-white font-black text-xl mb-5">We take privacy seriously.</h3>
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
              boxShadow: "0 2px 10px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.08)",
              textDecoration: "none",
              transition: "transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px) scale(1.04)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 20px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.08)";
            }}
          >
            Contact Us
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
