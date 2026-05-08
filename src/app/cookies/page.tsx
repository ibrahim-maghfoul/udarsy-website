"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Cookie, Shield, BarChart2, Settings, Globe, Scale, Mail, Phone, MapPin } from "lucide-react";
import { CONTACT } from "@/lib/constants";

const LAST_UPDATED = "May 8, 2026";

const cookieTypes = [
  {
    icon: Shield,
    label: "Essential",
    tag: "Always active",
    description: "Required for the platform to function. Session auth, CSRF protection, and security tokens. Cannot be disabled.",
    examples: ["Session token", "CSRF token", "Auth state"],
  },
  {
    icon: BarChart2,
    label: "Analytics",
    tag: "Anonymous",
    description: "Help us understand how students use the platform so we can improve lessons and features.",
    examples: ["Page views", "Session duration", "Feature usage"],
  },
  {
    icon: Settings,
    label: "Preference",
    tag: "Personalization",
    description: "Remember your selected language, theme, and notification settings across visits.",
    examples: ["Language (ar/fr/en)", "Theme", "Notifications"],
  },
  {
    icon: Globe,
    label: "Third-party",
    tag: "External services",
    description: "Set by external services we rely on to deliver the platform, such as Google for sign-in.",
    examples: ["Google OAuth", "Analytics providers"],
  },
];

const sections = [
  {
    title: "What Are Cookies?",
    paragraphs: [
      "Cookies are small text files placed on your device by websites you visit. They allow a site to remember your actions and preferences — such as language, login session, or display settings — over time, so you don't have to re-enter them each visit.",
      "We use both session cookies (erased when you close your browser) and persistent cookies (which remain on your device until they expire or you delete them).",
    ],
    bullets: null as string[] | null,
  },
  {
    title: "How We Use Cookies",
    paragraphs: ["When you use Udarsy, we may place cookies in your browser for the following purposes:"],
    bullets: [
      "Keep you signed in and protect your account from unauthorized access",
      "Remember your selected language (Arabic, French, or English) and locale preferences",
      "Track your learning progress, streaks, and completed lessons",
      "Understand which features are most used so we can improve the platform",
      "Deliver a personalized content experience based on your curriculum level and guidance",
    ],
  },
  {
    title: "Third-Party Cookies",
    paragraphs: [
      "Some features on Udarsy involve third-party services that may set their own cookies on your device. These include Google (for OAuth sign-in) and analytics providers.",
      "We do not sell or share cookie data with advertisers. Third-party service providers are bound by their own privacy policies and data protection agreements.",
    ],
    bullets: null,
  },
  {
    title: "Managing Your Cookie Preferences",
    paragraphs: [
      "You can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that disabling essential cookies may prevent the platform from functioning correctly.",
    ],
    bullets: [
      "Chrome: Settings → Privacy and Security → Cookies and other site data",
      "Firefox: Settings → Privacy & Security → Cookies and Site Data",
      "Safari: Preferences → Privacy → Manage Website Data",
      "Edge: Settings → Cookies and site permissions → Cookies and site data",
    ],
  },
  {
    title: "Cookies & Your Privacy",
    paragraphs: [
      "We are committed to protecting your privacy in accordance with Moroccan data protection law. We only collect the minimum cookie data necessary to provide and improve the platform.",
      "Cookies that store personal information are encrypted and transmitted over secure HTTPS connections only. We never use cookies to collect sensitive personal data such as passwords or payment details.",
    ],
    bullets: null,
  },
  {
    title: "Changes to This Policy",
    paragraphs: [
      "We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes via a notice on the platform.",
      "The 'Last Updated' date at the top of this page always reflects the most recent revision.",
    ],
    bullets: null,
  },
];

export default function CookiesPage() {
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
            <Cookie size={14} />
            Legal
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-[#1a3a2a]">
            Cookie Policy
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
              This Cookie Policy explains what cookies are, which types Udarsy uses, and how
              you can manage your cookie preferences.
            </p>
          </div>
        </motion.div>

        {/* Cookie type grid */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <p className="text-xs font-black uppercase tracking-widest text-[#3aaa6a] mb-4">
            Types of Cookies We Use
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cookieTypes.map((type, i) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative overflow-hidden rounded-[18px] bg-white group"
                  style={{
                    border: "1.5px solid rgba(58,170,106,0.11)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)",
                    transition: "border-color 0.28s ease, box-shadow 0.28s ease, transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
                    willChange: "transform",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(58,170,106,0.35)";
                    e.currentTarget.style.boxShadow = "0 10px 28px rgba(58,170,106,0.14), 0 3px 10px rgba(58,170,106,0.08)";
                    e.currentTarget.style.transform = "translate3d(0,-5px,0)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(58,170,106,0.11)";
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)";
                    e.currentTarget.style.transform = "translate3d(0,0,0)";
                  }}
                >
                  {/* Top accent bar — fills from both sides on hover */}
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

                  {/* Icon header with dot texture */}
                  <div
                    className="relative p-5 pb-4"
                    style={{
                      background: "linear-gradient(135deg, #f0faf5, #e8f5ee)",
                    }}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: "radial-gradient(circle, rgba(58,170,106,0.18) 1px, transparent 1px)",
                        backgroundSize: "14px 14px",
                      }}
                    />
                    <div className="relative flex items-center justify-between">
                      <div
                        className="w-10 h-10 rounded-[11px] flex items-center justify-center"
                        style={{ background: "rgba(58,170,106,0.12)" }}
                      >
                        <Icon size={18} style={{ color: "#3aaa6a" }} />
                      </div>
                      <span
                        className="text-[10px] font-black rounded-full px-2.5 py-1"
                        style={{
                          background: "rgba(58,170,106,0.10)",
                          color: "rgba(58,170,106,0.75)",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {type.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 pt-4 space-y-3">
                    <p className="font-black text-sm text-[#1a3a2a]">{type.label}</p>
                    <p className="text-xs text-[#1a3a2a]/55 leading-relaxed">{type.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {type.examples.map((ex, ei) => (
                        <span
                          key={ei}
                          className="text-[10px] font-bold rounded-full px-2.5 py-0.5"
                          style={{
                            background: "rgba(58,170,106,0.07)",
                            color: "#3aaa6a",
                          }}
                        >
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
                  e.currentTarget.style.boxShadow = "0 10px 28px rgba(58,170,106,0.14), 0 3px 10px rgba(58,170,106,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(58,170,106,0.11)";
                  e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)";
                }}
              >
                {/* Top accent bar — fills from both sides on hover */}
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
            href="/terms"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[#3aaa6a] hover:bg-[#3aaa6a]/10 transition-colors"
            style={{
              background: "rgba(58,170,106,0.07)",
              border: "1.5px solid rgba(58,170,106,0.18)",
            }}
          >
            <Scale size={14} />
            Terms of Service
          </Link>
        </motion.div>

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
          <p className="text-white/70 text-sm mb-2">Questions about how we use cookies?</p>
          <h3 className="text-white font-black text-xl mb-5">Get in touch with us.</h3>
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
